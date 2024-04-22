# pdf-print-marks

Add printing marks to a PDF file.

- Crop Marks
- Bleed Marks
- Registration Marks
- Color Bars
- Page Information
- Set bleed margin
- Mirror or zoom pdf edges

<img src="./sample/default.jpg" alt="Sample Image" style="max-width:400px" />

## Installation and Usage

```bash
npm install pdf-print-marks
```

```ts
import pdfPrintMarks from "pdf-print-marks";

pdfPrintMarks({
  input: "input.pdf",
  output: "output.pdf",
  width: 150,
  height: 180,
  bleed: 2, // bleed margin in mm
});
```

## Options

| Name              | Type      | Default | Description                                            |
| ----------------- | --------- | ------- | ------------------------------------------------------ |
| input             | `string`  |         | The input PDF file path                                |
| file              | `string`  |         | The input PDF file buffer if not specifying path       |
| output            | `string`  |         | The output PDF file path                               |
| width             | `number`  |         | The width of the PDF page in mm                        |
| height            | `number`  |         | The height of the PDF page in mm                       |
| bleed             | `number`  | 0       | The bleed margin in mm                                 |
| mirror            | `boolean` | false   | Mirror the edges of the PDF page                       |
| docName           | `string`  |         | Add the document name at the bottom of the page        |
| cropMarks         | `boolean` | true    | Add crop marks to the document                         |
| bleedMarks        | `boolean` | true    | Add bleed marks to the document                        |
| registrationMarks | `boolean` | true    | Add registration marks to the document                 |
| colorBars         | `boolean` | true    | Add color bars to the document                         |
| pageInformation   | `boolean` | true    | Add the document information at the bottom of the page |

## Mark Types

### Crop Marks

Crop marks are lines printed in the corners of the document to show where the page should be trimmed.

### Bleed Marks

Bleed marks are lines that define the extra area of the image outside the defined page size that will be trimmed off.

### Registration Marks

Registration marks are small crosshairs that are printed at the edges of the document to help align the different color plates.

### Color Bars

Color bars are a series of coloured rectangles that are printed on the document to help calibrate the colour of the printer.
