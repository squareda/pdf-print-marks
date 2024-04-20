import { PDFDocument, PDFPage, PDFEmbeddedPage } from "@cantoo/pdf-lib";

/**
 * Mirror the edges of the pdf to create the bleed
 */
const mirrorBleed = async ({
  currentPage,
  page,
  outputPdf,
  newPage,
  bleedLength,
  cropLength,
  width,
  height,
}: {
  currentPage: PDFEmbeddedPage;
  page: PDFPage;
  outputPdf: PDFDocument;
  newPage: PDFPage;
  bleedLength: number;
  cropLength: number;
  width: number;
  height: number;
}) => {
  const originalWidth = page.getWidth();
  const originalHeight = page.getHeight();
  const clonedPage1 = await outputPdf.embedPages(
    [page, page, page, page, page],
    [
      // Right
      {
        top: originalHeight,
        bottom: 0,
        left: originalWidth - bleedLength,
        right: originalWidth,
      },
      // Left
      {
        top: originalHeight,
        bottom: 0,
        left: 0,
        right: bleedLength,
      },
      // Bottom
      {
        top: bleedLength,
        bottom: 0,
        left: 0,
        right: originalWidth,
      },
      // Top
      {
        top: originalHeight - bleedLength,
        bottom: originalHeight,
        left: 0,
        right: originalWidth,
      },
    ]
  );

  //   Corners
  newPage.drawPage(clonedPage1[4], {
    x: cropLength,
    y: cropLength,
    height: height + bleedLength * 2,
    width: width + bleedLength * 2,
  });

  // main card
  newPage.drawPage(currentPage, {
    x: bleedLength + cropLength,
    y: bleedLength + cropLength,
    width,
    height,
  });

  // Right
  newPage.drawPage(clonedPage1[0], {
    x: width + bleedLength * 2 + cropLength,
    y: cropLength + bleedLength,
    height,
    xScale: -1,
  });

  // Left
  newPage.drawPage(clonedPage1[1], {
    x: bleedLength + cropLength,
    y: cropLength + bleedLength,
    height,
    xScale: -1,
  });

  // Bottom
  newPage.drawPage(clonedPage1[2], {
    x: cropLength + bleedLength,
    y: bleedLength + cropLength,
    width,
    yScale: -1,
  });

  // Top
  newPage.drawPage(clonedPage1[3], {
    x: cropLength + bleedLength,
    y: height + bleedLength + cropLength,
    width,
    yScale: -1,
  });
};

export default mirrorBleed;
