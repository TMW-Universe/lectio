import Hex from "crypto-js/enc-hex";
import sha256 from "crypto-js/sha256";

export class ColorHelper {
  // Without #
  color: string;

  constructor(color: string) {
    this.color = ColorHelper.cleanColor(color);
  }

  static cleanColor = (color: string) => {
    const withoutNoise = color.replace(" ", "");
    if (withoutNoise.startsWith("#")) return withoutNoise.substring(1);
    return withoutNoise;
  };

  static fromString = (text: string) =>
    new ColorHelper(Hex.stringify(sha256(text)).substring(0, 6));

  // Inner functionality

  setColor = (color: string) => {
    this.color = ColorHelper.cleanColor(color);
  };

  getRawColor = () => this.color;

  getRBGA = () => ({
    r: parseInt(this.color.substring(0, 2), 16),
    g: parseInt(this.color.substring(2, 4), 16),
    b: parseInt(this.color.substring(4, 6), 16),
    a: parseInt(this.color.substring(6, 8), 16),
  });

  getContrastColor = () => {
    const { r, g, b } = this.getRBGA();
    const yiq = (r * 299 + g * 587 + b * 114) / 1000;
    return new ColorHelper(yiq >= 128 ? "000000" : "FFFFFF");
  };

  toString = () => `#${this.getRawColor()}`;
}
