import { FillRule, colorString, PDFPage } from "@cantoo/pdf-lib";

const paths = [
  {
    path: "M0.5 14.5L14.5 14.5L14.5 0.5L0.5 0.5L0.5 14.5z",
    color: "#fff500",
    greyscale: "#0a0b0c",
  },
  {
    path: "M14.5 14.5L28.5 14.5L28.5 0.5L14.5 0.5L14.5 14.5z",
    color: "#dd137b",
    greyscale: "#131113",
  },
  {
    path: "M28.5 14.5L42.5 14.5L42.5 0.5L28.5 0.5L28.5 14.5z",
    color: "#0093dd",
    greyscale: "#1d1a1b",
  },
  {
    path: "M42.5 14.5L56.5 14.5L56.5 0.5L42.5 0.5L42.5 14.5z",
    color: "#28166f",
    greyscale: "#2a2525",
  },
  {
    path: "M56.5 14.5L70.5 14.5L70.5 0.5L56.5 0.5L56.5 14.5z",
    color: "#00923f",
    greyscale: "#3a3534",
  },
  {
    path: "M70.5 14.5L84.5 14.5L84.5 0.5L70.5 0.5L70.5 14.5z",
    color: "#da251d",
    greyscale: "#4d4846",
  },
  {
    path: "M84.5 14.5L98.5 14.5L98.5 0.5L84.5 0.5L84.5 14.5z",
    color: "#1f1a17",
    greyscale: "#635d5c",
  },
  {
    path: "M98.5 14.5L112.5 14.5L112.5 0.5L98.5 0.5L98.5 14.5z",
    color: "#fffa88",
    greyscale: "#7c7674",
  },
  {
    path: "M112.5 14.5L126.5 14.5L126.5 0.5L112.5 0.5L112.5 14.5z",
    color: "#ed88b1",
    greyscale: "#9a9493",
  },
  {
    path: "M126.5 14.5L140.5 14.5L140.5 0.5L126.5 0.5L126.5 14.5z",
    color: "#56bbed",
    greyscale: "#c5c1c0",
  },
  {
    path: "M140.5 14.5L154.5 14.5L154.5 0.5L140.5 0.5L140.5 14.5z",
    color: "#838281",
    greyscale: "#fff",
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
      borderColor: colorString("#322d2c").rgb,
      borderWidth: 1,
      x,
      y,
    });
  });
};

const COLOR_BAR_WIDTH = 14;
const COLOR_BAR_COUNT = 11;
const BORDER_WIDTH = 0.5;
const BAR_OFFSET = 5;
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
