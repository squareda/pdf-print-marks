import { PDFDocument, PDFPage, PDFEmbeddedPage } from "@cantoo/pdf-lib";
import { GetPageOptions } from "./types";

/**
 * Embed pages but include duplicate pages with bounding box to add mirrored edges
 * Used so we only call `embedPages` once so that the pdf size doesn't increase.
 */
export const mirrorEmbedPages = ({
  outputPdf,
  pages,
  bleedLength,
  getPageOptions,
}: {
  outputPdf: PDFDocument;
  pages: PDFPage[];
  bleedLength: number;
  getPageOptions?: GetPageOptions;
}) => {
  const originalWidth = pages[0].getWidth();
  const originalHeight = pages[0].getHeight();

  const shouldMirror = (page: number) => {
    const bleedMethod = getPageOptions?.(page)?.bleedMethod;
    return bleedMethod === "mirror" || (!bleedMethod && page === 0);
  };

  return outputPdf.embedPages(
    pages.reduce((acc, page, i) => {
      if (shouldMirror(i)) {
        return [...acc, page, page, page, page, page];
      }
      return [...acc, page];
    }, [] as any),
    pages.reduce((acc, page, i) => {
      if (shouldMirror(i)) {
        return [
          ...acc,
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
          undefined,
        ];
      }
      return [...acc, undefined];
    }, [] as any)
  );
};

/**
 * Mirror the edges of the pdf to create the bleed
 */
const mirrorBleed = async ({
  clonedPages,
  pageNumber,
  newPage,
  bleedLength,
  cropLength,
  width,
  height,
}: {
  clonedPages: PDFEmbeddedPage[];
  pageNumber: number;
  newPage: PDFPage;
  bleedLength: number;
  cropLength: number;
  width: number;
  height: number;
}) => {
  //   Corners
  newPage.drawPage(clonedPages[pageNumber + 4], {
    x: cropLength,
    y: cropLength,
    height: height + bleedLength * 2,
    width: width + bleedLength * 2,
  });

  // main card
  newPage.drawPage(clonedPages[pageNumber + 4], {
    x: bleedLength + cropLength,
    y: bleedLength + cropLength,
    width,
    height,
  });

  // Right
  newPage.drawPage(clonedPages[pageNumber + 0], {
    x: width + bleedLength * 2 + cropLength,
    y: cropLength + bleedLength,
    height,
    xScale: -1,
  });

  // Left
  newPage.drawPage(clonedPages[pageNumber + 1], {
    x: bleedLength + cropLength,
    y: cropLength + bleedLength,
    height,
    xScale: -1,
  });

  // Bottom
  newPage.drawPage(clonedPages[pageNumber + 2], {
    x: cropLength + bleedLength,
    y: bleedLength + cropLength,
    width,
    yScale: -1,
  });

  // Top
  newPage.drawPage(clonedPages[pageNumber + 3], {
    x: cropLength + bleedLength,
    y: height + bleedLength + cropLength,
    width,
    yScale: -1,
  });
};

export default mirrorBleed;
