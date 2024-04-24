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
    setLineWidth((options.size || 20) / 40)
  );

  page.drawText(text, options);

  page.pushOperators(popGraphicsState());
};

const SPACING_X = 24;
const SPACING_Y = 10;

const addMetadata = (
  page: PDFPage,
  name: string,
  date: Date,
  pageNumber: number,
  bleed = 0
) => {
  const size = 6;
  drawOutlinedText(page, `${name}   ${pageNumber}`, {
    x: SPACING_X + bleed,
    y: 10 + bleed,
    size,
  });
  // Format dd/mm/yyyy   HH:MM
  const dateString = `${padDate(date.getDate())}/${padDate(
    date.getMonth() + 1
  )}/${date.getFullYear()}   ${padDate(date.getHours())}:${padDate(
    date.getMinutes()
  )}`;
  const font = page.getFont()[0];
  const textWidth = font.widthOfTextAtSize(dateString, size);
  drawOutlinedText(page, dateString, {
    x: page.getWidth() - SPACING_X - textWidth - bleed,
    y: SPACING_Y + bleed,
    size,
  });
};

export default addMetadata;
