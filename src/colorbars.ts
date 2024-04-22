import { FillRule, colorString, PDFPage } from "@cantoo/pdf-lib";

const paths = [
  {
    path: "M0.5 14.5L14.5 14.5L14.5 0.5L0.5 0.5L0.5 14.5z",
    color: "#fff34a",
    greyscale: "#000000",
  },
  {
    path: "M14.5 14.5L28.5 14.5L28.5 0.5L14.5 0.5L14.5 14.5z",
    color: "#d92d8a",
    greyscale: "#1a1a1a",
  },
  {
    path: "M28.5 14.5L42.5 14.5L42.5 0.5L28.5 0.5L28.5 14.5z",
    color: "#00aae9",
    greyscale: "#333333",
  },
  {
    path: "M42.5 14.5L56.5 14.5L56.5 0.5L42.5 0.5L42.5 14.5z",
    color: "#2f308d",
    greyscale: "#4d4d4d",
  },
  {
    path: "M56.5 14.5L70.5 14.5L70.5 0.5L56.5 0.5L56.5 14.5z",
    color: "#00a359",
    greyscale: "#666666",
  },
  {
    path: "M70.5 14.5L84.5 14.5L84.5 0.5L70.5 0.5L70.5 14.5z",
    color: "#da3832",
    greyscale: "#808080",
  },
  {
    path: "M84.5 14.5L98.5 14.5L98.5 0.5L84.5 0.5L84.5 14.5z",
    color: "#000000",
    greyscale: "#999999",
  },
  {
    path: "M98.5 14.5L112.5 14.5L112.5 0.5L98.5 0.5L98.5 14.5z",
    color: "#fff8a5",
    greyscale: "#b2b2b2",
  },
  {
    path: "M112.5 14.5L126.5 14.5L126.5 0.5L112.5 0.5L112.5 14.5z",
    color: "#e79ec0",
    greyscale: "#cccccc",
  },
  {
    path: "M126.5 14.5L140.5 14.5L140.5 0.5L126.5 0.5L126.5 14.5z",
    color: "#86cdf2",
    greyscale: "#e5e5e5",
  },
  {
    path: "M140.5 14.5L154.5 14.5L154.5 0.5L140.5 0.5L140.5 14.5z",
    color: "#949598",
    greyscale: "#ffffff",
  },
];

const borderPaths = [
  { path: "M0.5 0.5L14.5 0.5L14.5 14.5L0.5 14.5L0.5 0.5z" },
  { path: "M14.5 0.5L28.5 0.5L28.5 14.5L14.5 14.5L14.5 0.5z" },
  { path: "M28.5 0.5L42.5 0.5L42.5 14.5L28.5 14.5L28.5 0.5z" },
  { path: "M42.5 0.5L56.5 0.5L56.5 14.5L42.5 14.5L42.5 0.5z" },
  { path: "M56.5 0.5L70.5 0.5L70.5 14.5L56.5 14.5L56.5 0.5z" },
  { path: "M70.5 0.5L84.5 0.5L84.5 14.5L70.5 14.5L70.5 0.5z" },
  { path: "M84.5 0.5L98.5 0.5L98.5 14.5L84.5 14.5L84.5 0.5z" },
  { path: "M98.5 0.5L112.5 0.5L112.5 14.5L98.5 14.5L98.5 0.5z" },
  { path: "M112.5 0.5L126.5 0.5L126.5 14.5L112.5 14.5L112.5 0.5z" },
  { path: "M126.5 0.5L140.5 0.5L140.5 14.5L126.5 14.5L126.5 0.5z" },
  { path: "M140.5 0.5L154.5 0.5L154.5 14.5L140.5 14.5L140.5 0.5z" },
];

const BORDER_COLOR = "#595959";

const drawColorBars = (
  page: PDFPage,
  options: {
    x: number;
    y: number;
    type: "color" | "greyscale";
  }
) => {
  const y = page.getHeight() - options.y;
  const x = options.x;
  paths.forEach(({ path, color, greyscale }, i) => {
    page.drawSvgPath(path, {
      color: colorString(options.type === "color" ? color : greyscale).rgb,
      fillRule: FillRule.EvenOdd,
      x,
      y,
    });
    page.drawSvgPath(borderPaths[i].path, {
      borderColor: colorString(BORDER_COLOR).rgb,
      borderWidth: 1,
      x,
      y,
    });
  });
};

const COLOR_BAR_WIDTH = 14;
const COLOR_BAR_COUNT = 11;
const BORDER_WIDTH = 0.5;
const BAR_OFFSET = 6;
const CENTER_OFFSET = 12;
const WIDTH = COLOR_BAR_WIDTH * COLOR_BAR_COUNT + BORDER_WIDTH * 2;

export const colorBarsTooBigForPage = (
  pageWidth: number,
  pagePadding: number
) => {
  return WIDTH * 2 > pageWidth - (pagePadding * 2 + BAR_OFFSET * 2);
};

export const addColorBars = (
  page: PDFPage,
  pagePadding: number,
  bleedLength: number
) => {
  const centerAlign = colorBarsTooBigForPage(page.getWidth(), pagePadding);

  const center = page.getWidth() / 2;
  drawColorBars(page, {
    x: centerAlign
      ? center + CENTER_OFFSET
      : page.getWidth() - WIDTH - pagePadding - BAR_OFFSET,
    y: bleedLength,
    type: "color",
  });

  drawColorBars(page, {
    x: centerAlign ? center - WIDTH - CENTER_OFFSET : pagePadding + BAR_OFFSET,
    y: bleedLength,
    type: "greyscale",
  });
};

export default drawColorBars;
