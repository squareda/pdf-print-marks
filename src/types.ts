export type GetPageOptions = (pageNumber: number) => {
  /** The method to create the bleed for this page. Scale card, mirror edges or none (whitespace)
   * @default: scale */
  bleedMethod: "scale" | "mirror" | "none";
};
