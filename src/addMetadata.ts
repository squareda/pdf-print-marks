import {
  PDFPage,
  rgb,
  setFillingColor,
  setStrokingColor,
  setLineWidth,
  popGraphicsState,
  pushGraphicsState,
  setTextRenderingMode,
  TextRenderingMode,
  PDFPageDrawTextOptions,
} from "@cantoo/pdf-lib";

const padDate = (date: number) => date.toString().padStart(2, "0");

const drawOutlinedText = (
  page: PDFPage,
  text: string,
  options: PDFPageDrawTextOptions
) => {
  page.pushOperators(
    pushGraphicsState(),
    setFillingColor(rgb(0, 0, 0)),
    setStrokingColor(rgb(1, 1, 1)),
    setTextRenderingMode(TextRenderingMode.FillAndOutline),
    setLineWidth((options.size || 25) / 25)
  );

  page.drawText(text, options);

  page.pushOperators(popGraphicsState());
};

const addMetadata = (
  page: PDFPage,
  name: string,
  date: Date,
  pageNumber: number,
  bleed = 0
) => {
  drawOutlinedText(page, `${name}   ${pageNumber}`, {
    x: 24 + bleed,
    y: 10 + bleed,
    size: 6,
  });
  // Format dd/mm/yyyy   HH:MM
  const dateString = `${padDate(date.getDate())}/${padDate(
    date.getMonth() + 1
  )}/${date.getFullYear()}   ${padDate(date.getHours())}:${padDate(
    date.getMinutes()
  )}`;
  drawOutlinedText(page, dateString, {
    x: page.getWidth() - 74 - bleed,
    y: 10 + bleed,
    size: 6,
  });
};

export default addMetadata;
