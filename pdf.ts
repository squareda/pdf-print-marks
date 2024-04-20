import fs from "fs";
import { PDFDocument } from "@cantoo/pdf-lib";
import { addColorBars } from "./colorbars";
import { addRegistrationMarks } from "./registrationMark";
import addCropMarks from "./cropMarks";
import addMetadata from "./addMetadata";
import mirrorBleed from "./mirrorBleed";

const mmToPoints = (mm: number) => mm * 2.83465;

const CROP_LENGTH = 21;

const run = async (options: {
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
  const WIDTH = mmToPoints(options.width);
  const HEIGHT = mmToPoints(options.height);

  //   console.log(pdfDoc.getPage(0).getSize());
  //   console.log(pdfDoc.getPage(0).getWidth());
  //   console.log(pdfDoc.getPage(0).getArtBox());
  //   console.log(pdfDoc.getPage(0).getBleedBox());
  //   console.log(pdfDoc.getPage(0).getCropBox());
  //   console.log(pdfDoc.getPage(0).getTrimBox());

  //   { width: 461.528, height: 566.409 }
  // 461.528
  // { x: 21, y: 21, width: 419.528, height: 524.409 }
  // { x: 21, y: 21, width: 419.528, height: 524.409 }
  // { x: 0, y: 0, width: 461.528, height: 566.409 }
  // { x: 21, y: 21, width: 419.528, height: 524.409 }
  //   const pdfDoc = await PDFDocument.create();
  //   pdfDoc.addPage([595.28, 841.89]);

  const pages = pdfDoc.getPages();
  const firstPage = pages[0];
  //   const { width, height } = firstPage.getSize();

  const outputPdf = await PDFDocument.create();
  const bleedLength = options?.bleed ? mmToPoints(options.bleed) : 0;

  const pagePadding = bleedLength + CROP_LENGTH;

  const date = new Date();

  const clonedPages = await outputPdf.embedPages(pdfDoc.getPages());
  for (let i = 0; i < pages.length; i++) {
    const newPage = outputPdf.addPage([
      WIDTH + pagePadding * 2,
      HEIGHT + pagePadding * 2,
    ]);
    const mirror = options.mirror && i === 0;

    if (mirror) {
      await mirrorBleed({
        currentPage: clonedPages[i],
        page: pdfDoc.getPage(i),
        outputPdf,
        newPage,
        bleedLength,
        cropLength: CROP_LENGTH,
        width: WIDTH,
        height: HEIGHT,
      });
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
  }

  const pdfBytes = await outputPdf.save();

  fs.writeFileSync(options.output, pdfBytes);
};

run({
  bleed: 2,
  width: 148,
  height: 185,
  docName: "group-cards.indd",
  mirror: true,
  output: "output.pdf",
  input: "test.pdf",
});
