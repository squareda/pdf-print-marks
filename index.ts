import pdfPrintMarks from "./src/pdf";

pdfPrintMarks({
  bleed: 2,
  width: 148,
  height: 185,
  docName: "group-cards.indd",
  mirror: true,
  output: "output.pdf",
  input: "test.pdf",
});
