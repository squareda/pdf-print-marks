import fs from "fs";
import pdfPrintMarks from "../index";

if (!fs.existsSync("out")) {
  fs.mkdirSync("out");
}

const defaultOptions = {
  bleed: 2,
  width: 148,
  height: 185,
  docName: "64f4d3c7c0b714bef1e3c6da.pdf",
  mirror: false,
  input: "sample/test.pdf",
};

pdfPrintMarks({
  ...defaultOptions,
  output: "out/default.pdf",
});

pdfPrintMarks({
  ...defaultOptions,
  bleed: 0,
  output: "out/no-bleed.pdf",
});

pdfPrintMarks({
  ...defaultOptions,
  bleed: 4,
  output: "out/bleed-4.pdf",
});

pdfPrintMarks({
  ...defaultOptions,
  mirror: true,
  output: "out/mirror.pdf",
});

pdfPrintMarks({
  ...defaultOptions,
  bleed: 4,
  mirror: true,
  output: "out/mirror-bleed-4.pdf",
});

pdfPrintMarks({
  ...defaultOptions,
  width: defaultOptions.width * 2,
  height: defaultOptions.height * 2,
  output: "out/2x.pdf",
});

pdfPrintMarks({
  ...defaultOptions,
  width: defaultOptions.width * 4,
  height: defaultOptions.height * 4,
  output: "out/4x.pdf",
});

pdfPrintMarks({
  ...defaultOptions,
  width: defaultOptions.width * 0.5,
  height: defaultOptions.height * 0.5,
  output: "out/0.5x.pdf",
});

pdfPrintMarks({
  ...defaultOptions,
  colorBars: false,
  bleedMarks: false,
  cropMarks: false,
  registrationMarks: false,
  pageInformation: false,
  output: "out/no-marks.pdf",
});
