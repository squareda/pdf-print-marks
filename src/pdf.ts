import fs from "fs";
import { PDFDocument } from "@cantoo/pdf-lib";
import { addColorBars } from "./colorbars";
import { addRegistrationMarks } from "./registrationMark";
import addCropMarks from "./cropMarks";
import addMetadata from "./addMetadata";
import mirrorBleed, { mirrorEmbedPages } from "./mirrorBleed";
import { GetPageOptions } from "./types";
const packageVersion = require("../package.json").version;

const round = (num: number) => Number(num.toFixed(3));
const mmToPoints = (mm: number) => mm * 2.8346456693;

const CROP_LENGTH = 21;

export type PDFPrintMarksOptions = {
  /** Input pdf file path. One of `input` or `file` is required */
  input?: string;
  /** Input pdf file buffer or base64 string. One of `input` or `file` is required */
  file?: string | Uint8Array | Buffer;
  /** Output file path. You can ignore this option if you want to process the returned Uint8Array yourself */
  output?: string;
  /** Bleed in mm */
  bleed?: number;
  /** Content width in mm */
  width: number;
  /** Content height in mm */
  height: number;
  /** Document name if you want it included in page info footer */
  docName?: string;
  /** Mirror the border to create the bleed (instead of scaling) */
  mirror?: boolean;
  /** Print Marks: render the color bars */
  colorBars?: boolean;
  /** Print Marks: render the registration marks */
  registrationMarks?: boolean;
  /** Print Marks: render the crop marks */
  cropMarks?: boolean;
  /** Print Marks: render the bleed marks */
  bleedMarks?: boolean;
  /** Print Marks: render the page information */
  pageInformation?: boolean;
  /** Set custom page options */
  getPageOptions?: GetPageOptions;
};

const pdfPrintMarks = async (options: PDFPrintMarksOptions) => {
  if (!options.input && !options.file) {
    throw new Error("No input file provided. Please specify input or file.");
  }
  const file = options.file || fs.readFileSync(options.input!);
  const pdfDoc = await PDFDocument.load(file);
  const outputPdf = await PDFDocument.create();
  const WIDTH = mmToPoints(options.width);
  const HEIGHT = mmToPoints(options.height);
  const pages = pdfDoc.getPages();
  const bleedLength = options?.bleed ? mmToPoints(options.bleed) : 0;
  const pagePadding = bleedLength + CROP_LENGTH;
  const date = new Date();

  const clonedPages = await (options.mirror
    ? mirrorEmbedPages({
        outputPdf,
        pages,
        bleedLength,
        getPageOptions: options.getPageOptions,
      })
    : outputPdf.embedPages(pages));

  for (let i = 0; i < clonedPages.length; i++) {
    const pageWidth = round(WIDTH + pagePadding * 2);
    const pageHeight = round(HEIGHT + pagePadding * 2);
    const newPage = outputPdf.addPage([pageWidth, pageHeight]);
    const pageNumber = outputPdf.getPageCount() - 1;
    const pageBleedMethod = options.getPageOptions?.(pageNumber)?.bleedMethod;
    if (pageBleedMethod === "mirror" && !options.mirror) {
      throw new Error("Mirror bleed method requires mirror option to be set");
    }
    const mirror =
      pageBleedMethod === "mirror" ||
      (!pageBleedMethod && options.mirror && i === 0);

    if (mirror) {
      await mirrorBleed({
        clonedPages,
        pageNumber: i,
        newPage,
        bleedLength,
        cropLength: CROP_LENGTH,
        width: WIDTH,
        height: HEIGHT,
      });
      i += 4;
    } else {
      newPage.drawPage(
        clonedPages[i],
        pageBleedMethod === "none"
          ? {
              x: CROP_LENGTH + bleedLength,
              y: CROP_LENGTH + bleedLength,
              width: WIDTH,
              height: HEIGHT,
            }
          : {
              x: CROP_LENGTH,
              y: CROP_LENGTH,
              width: WIDTH + bleedLength * 2,
              height: HEIGHT + bleedLength * 2,
            }
      );
    }

    if (options.colorBars !== false) {
      addColorBars(newPage, pagePadding, bleedLength);
    }
    if (options.registrationMarks !== false) {
      addRegistrationMarks(newPage, bleedLength);
    }
    if (options.bleedMarks !== false) {
      addCropMarks(newPage, 0, "bleed");
    }
    if (options.bleed && options.cropMarks !== false) {
      addCropMarks(newPage, bleedLength);
    }
    if (options.pageInformation !== false) {
      addMetadata(
        newPage,
        options.docName || "",
        date,
        pageNumber + 1,
        bleedLength
      );
    }
    newPage.setMediaBox(0, 0, pageWidth, pageHeight);
    newPage.setArtBox(pagePadding, pagePadding, WIDTH, HEIGHT);
    newPage.setBleedBox(
      CROP_LENGTH,
      CROP_LENGTH,
      WIDTH + bleedLength * 2,
      HEIGHT + bleedLength * 2
    );
    newPage.setCropBox(0, 0, pageWidth, pageHeight);
    newPage.setTrimBox(pagePadding, pagePadding, WIDTH, HEIGHT);
  }

  const defaultProducer = `pdf-print-marks (${packageVersion})`;

  outputPdf.setProducer(defaultProducer);
  outputPdf.setCreator(pdfDoc.getCreator() || defaultProducer);
  outputPdf.setAuthor(pdfDoc.getAuthor() || defaultProducer);

  const pdfBytes = await outputPdf.save();

  if (options.output) {
    fs.writeFileSync(options.output, pdfBytes);
  }

  return pdfBytes;
};

export default pdfPrintMarks;
