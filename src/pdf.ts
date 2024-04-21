import fs from "fs";
import { PDFDocument } from "@cantoo/pdf-lib";
import { addColorBars } from "./colorbars";
import { addRegistrationMarks } from "./registrationMark";
import addCropMarks from "./cropMarks";
import addMetadata from "./addMetadata";
import mirrorBleed, { mirrorEmbedPages } from "./mirrorBleed";
const packageVersion = require("../package.json").version;

const mmToPoints = (mm: number) => mm * 2.83465;

const CROP_LENGTH = 21;

const pdfPrintMarks = async (options: {
  /** Bleed in mm */
  bleed?: number;
  width: number;
  height: number;
  docName?: string;
  mirror?: boolean;
  output: string;
  input: string;
}) => {
  const file = fs.readFileSync(options.input);
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
      })
    : outputPdf.embedPages(pages));

  for (let i = 0; i < pages.length; i++) {
    const newPage = outputPdf.addPage([
      WIDTH + pagePadding * 2,
      HEIGHT + pagePadding * 2,
    ]);
    const mirror = options.mirror && i === 0;

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
      newPage.drawPage(clonedPages[i], {
        x: CROP_LENGTH,
        y: CROP_LENGTH,
        width: WIDTH + bleedLength * 2,
        height: HEIGHT + bleedLength * 2,
      });
    }

    addColorBars(newPage, pagePadding, bleedLength);
    addRegistrationMarks(newPage, bleedLength);
    addCropMarks(newPage, 0, "bleed");
    if (options.bleed) {
      addCropMarks(newPage, bleedLength);
    }
    if (options.docName) {
      addMetadata(newPage, options.docName, date, i + 1, bleedLength);
    }
    newPage.setArtBox(CROP_LENGTH, CROP_LENGTH, WIDTH, HEIGHT);
    newPage.setBleedBox(CROP_LENGTH, CROP_LENGTH, WIDTH, HEIGHT);
    newPage.setCropBox(0, 0, WIDTH + CROP_LENGTH * 2, HEIGHT + CROP_LENGTH * 2);
    newPage.setTrimBox(CROP_LENGTH, CROP_LENGTH, WIDTH, HEIGHT);
  }

  const defaultProducer = `pdf-print-marks (${packageVersion})`;

  outputPdf.setProducer(defaultProducer);
  outputPdf.setCreator(pdfDoc.getCreator() || defaultProducer);
  outputPdf.setAuthor(pdfDoc.getAuthor() || defaultProducer);

  const pdfBytes = await outputPdf.save();

  fs.writeFileSync(options.output, pdfBytes);
};

export default pdfPrintMarks;
