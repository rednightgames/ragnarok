import {percentOf} from "@rednight/utils";
import tiny, {Instance as Color} from "tinycolor2";

const shade = (color: Color, percent: number) => {
  const rgb = color.toRgb();

  rgb.r = percentOf(100 - percent, rgb.r);
  rgb.g = percentOf(100 - percent, rgb.g);
  rgb.b = percentOf(100 - percent, rgb.b);

  return tiny(rgb);
};

export default shade;
