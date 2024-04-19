import { PDFPage } from "@cantoo/pdf-lib";

const addMetadata = (
  page: PDFPage,
  name: string,
  date: Date,
  pageNumber: number,
  bleed = 0
) => {
  page.drawText(`${name}   ${pageNumber}`, {
    x: 24 + bleed,
    y: 10 + bleed,
    size: 6,
  });
  // Format dd/mm/yyyy   HH:MM
  const dateString = `${date.getDate()}/${date.getMonth()}/${date.getFullYear()}   ${date.getHours()}:${date.getMinutes()}`;
  page.drawText(dateString, {
    x: page.getWidth() - 72 - bleed,
    y: 10 + bleed,
    size: 6,
  });
};

export default addMetadata;
