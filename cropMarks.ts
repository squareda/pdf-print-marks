import { PDFPage, colorString } from "@cantoo/pdf-lib";

// TODO make background white
const addCropMarks = (page: PDFPage, bleed = 0) => {
  const defaultProps = {
    thickness: 0.25,
    color: colorString("#000").rgb,
  };
  const offset = 21 + bleed;
  const length = 18;
  const pageWidth = page.getWidth();
  const pageHeight = page.getHeight();

  // Top Left
  page.drawLine({
    start: { x: bleed, y: pageHeight - offset },
    end: { x: length + bleed, y: pageHeight - offset },
    ...defaultProps,
  });
  page.drawLine({
    start: { x: offset, y: pageHeight - bleed },
    end: { x: offset, y: pageHeight - length - bleed },
    ...defaultProps,
  });

  // Top Right
  page.drawLine({
    start: { x: pageWidth - bleed, y: pageHeight - offset },
    end: { x: pageWidth - length - bleed, y: pageHeight - offset },
    ...defaultProps,
  });
  page.drawLine({
    start: { x: pageWidth - offset, y: pageHeight - bleed },
    end: { x: pageWidth - offset, y: pageHeight - length - bleed },
    ...defaultProps,
  });
  // Bottom Left
  page.drawLine({
    start: { x: bleed, y: offset },
    end: { x: length + bleed, y: offset },
    ...defaultProps,
  });
  page.drawLine({
    start: { x: offset, y: bleed },
    end: { x: offset, y: length + bleed },
    ...defaultProps,
  });
  // Bottom Right
  page.drawLine({
    start: { x: pageWidth - bleed, y: offset },
    end: { x: pageWidth - length - bleed, y: offset },
    ...defaultProps,
  });
  page.drawLine({
    start: { x: pageWidth - offset, y: bleed },
    end: { x: pageWidth - offset, y: length + bleed },
    ...defaultProps,
  });
};

export default addCropMarks;
