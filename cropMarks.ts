import { PDFPage, colorString } from "@cantoo/pdf-lib";

const addCropMarks = (
  page: PDFPage,
  bleed = 0,
  markType: "bleed" | "crop" = "crop"
) => {
  const offset = 21 + bleed;
  const length = markType === "bleed" ? 18 : 15;
  const pageWidth = page.getWidth();
  const pageHeight = page.getHeight();

  const draw = (startX: number, startY: number, endX: number, endY: number) => {
    const position = {
      start: { x: startX, y: startY },
      end: { x: endX, y: endY },
    };
    // Background
    page.drawLine({
      ...position,
      thickness: 1,
      color: colorString("#fff").rgb,
    });
    // line
    page.drawLine({
      ...position,
      thickness: 0.25,
      color: colorString("#000").rgb,
    });
  };

  // Top Left
  draw(bleed, pageHeight - offset, length + bleed, pageHeight - offset);
  draw(offset, pageHeight - bleed, offset, pageHeight - length - bleed);

  // Top Right
  draw(
    pageWidth - bleed,
    pageHeight - offset,
    pageWidth - length - bleed,
    pageHeight - offset
  );
  draw(
    pageWidth - offset,
    pageHeight - bleed,
    pageWidth - offset,
    pageHeight - length - bleed
  );

  // Bottom Left
  draw(bleed, offset, length + bleed, offset);
  draw(offset, bleed, offset, length + bleed);

  // Bottom Right
  draw(pageWidth - bleed, offset, pageWidth - length - bleed, offset);
  draw(pageWidth - offset, bleed, pageWidth - offset, length + bleed);
};

export default addCropMarks;
