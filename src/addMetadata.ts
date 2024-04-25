import {
  PDFPage,
  rgb,
  TextRenderingMode,
  PDFPageDrawTextOptions,
} from "@cantoo/pdf-lib";

const padDate = (date: number) => date.toString().padStart(2, "0");

const SPACING_X = 24;
const SPACING_Y = 10;

const addMetadata = (
  page: PDFPage,
  name: string,
  date: Date,
  pageNumber: number,
  bleed = 0
) => {
  const outlinedText: Partial<PDFPageDrawTextOptions> = {
    strokeWidth: 0.15,
    strokeColor: rgb(1, 1, 1),
    renderMode: TextRenderingMode.FillAndOutline,
    size: 6,
  };
  page.drawText(`${name}   ${pageNumber}`, {
    x: SPACING_X + bleed,
    y: 10 + bleed,
    ...outlinedText,
  });

  // Format dd/mm/yyyy   HH:MM
  const dateString = `${padDate(date.getDate())}/${padDate(
    date.getMonth() + 1
  )}/${date.getFullYear()}   ${padDate(date.getHours())}:${padDate(
    date.getMinutes()
  )}`;
  const font = page.getFont()[0];
  const textWidth = font.widthOfTextAtSize(dateString, outlinedText.size!);
  page.drawText(dateString, {
    x: page.getWidth() - SPACING_X - textWidth - bleed,
    y: SPACING_Y + bleed,
    ...outlinedText,
  });
};

export default addMetadata;
