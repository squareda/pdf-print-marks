import { PDFPage } from "@cantoo/pdf-lib";

const padDate = (date: number) => date.toString().padStart(2, "0");

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
  const dateString = `${padDate(date.getDate())}/${padDate(
    date.getMonth() + 1
  )}/${date.getFullYear()}   ${padDate(date.getHours())}:${padDate(
    date.getMinutes()
  )}`;
  page.drawText(dateString, {
    x: page.getWidth() - 74 - bleed,
    y: 10 + bleed,
    size: 6,
  });
};

export default addMetadata;
