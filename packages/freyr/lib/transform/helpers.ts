import tiny, {Instance as Color} from "tinycolor2";
import {percentOf} from "@rednight/utils";

export const tint = (color: Color, percent: number) => {
  const rgb = color.toRgb();

  rgb.r = rgb.r + percentOf(percent, 255 - rgb.r);
  rgb.g = rgb.g + percentOf(percent, 255 - rgb.g);
  rgb.b = rgb.b + percentOf(percent, 255 - rgb.b);

  return tiny(rgb);
};

export const shade = (color: Color, percent: number) => {
  const rgb = color.toRgb();

  rgb.r = percentOf(100 - percent, rgb.r);
  rgb.g = percentOf(100 - percent, rgb.g);
  rgb.b = percentOf(100 - percent, rgb.b);

  return tiny(rgb);
};
