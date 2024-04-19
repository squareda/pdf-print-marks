import { FillRule, PDFPage, colorString } from "@cantoo/pdf-lib";

const paths = [
  {
    path: "M11 6c0 2.76-2.24 5-5 5S1 8.76 1 6s2.24-5 5-5 5 2.24 5 5zM0 6h12M6 0v12m3-6c0 1.66-1.34 3-3 3S3 7.66 3 6s1.34-3 3-3 3 1.34 3 3z",
    stroke: "#fff",
    strokeWidth: 1.25,
  },
  {
    path: "M11 6c0 2.76-2.24 5-5 5S1 8.76 1 6s2.24-5 5-5 5 2.24 5 5zM0 6h12M6 0v12",
    stroke: "#0a0b0c",
    strokeWidth: 0.25,
  },
  {
    path: "M9 6c0 1.66-1.34 3-3 3S3 7.66 3 6s1.34-3 3-3 3 1.34 3 3z",
    fill: "#0a0b0c",
    fillRule: FillRule.EvenOdd,
  },
  {
    path: "M3 6h6M6 3v6",
    stroke: "#fff",
    strokeWidth: 0.25,
  },
];

const drawRegistrationMark = (
  page: PDFPage,
  options: {
    x: number;
    y: number;
  }
) => {
  const y = page.getHeight() - options.y;
  paths.forEach((path, i) => {
    page.drawSvgPath(path.path, {
      color: path.fill ? colorString(path.fill).rgb : undefined,
      fillRule: path.fillRule,
      borderWidth: path.strokeWidth,
      borderColor: path.stroke ? colorString(path.stroke).rgb : undefined,
      x: options.x,
      y,
    });
  });
};

export const addRegistrationMarks = (page: PDFPage, offset = 0) => {
  const markSize = 12.5;
  const markPadding = 1 + offset;
  const middleX = page.getWidth() / 2 - markSize / 2;
  const middleY = page.getHeight() / 2 - markSize / 2;

  // Top
  drawRegistrationMark(page, {
    x: middleX,
    y: markPadding,
  });

  // Bottom
  drawRegistrationMark(page, {
    x: middleX,
    y: page.getHeight() - markSize - markPadding,
  });

  // Left
  drawRegistrationMark(page, {
    x: markPadding,
    y: middleY,
  });

  // Right
  drawRegistrationMark(page, {
    x: page.getWidth() - markSize - markPadding,
    y: middleY,
  });
};

export default drawRegistrationMark;
