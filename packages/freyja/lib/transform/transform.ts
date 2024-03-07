import {isBetween} from "@rednight/utils";
import * as cssTree from "css-tree";
import prettier from "prettier";
import tiny, {Instance as Color} from "tinycolor2";
import tinycolor from "tinycolor2";

import {AUTO_GENERATE_DISCLAIMER} from "../constants";
import {
  Config,
  Sources,
  StepOptions,
  ThemeType,
  TransformedSource,
} from "../types";
import {shade, tint} from "./helpers";

export interface TransformOptions extends Omit<StepOptions, "logger"> {
  sources: Sources;
}

export class Transform {
  static async transform({config, sources}: TransformOptions) {
    const transform = new Transform({config});
    const promises: TransformedSource[] = [];

    transform.config.themes?.map((theme) => {
      let generatedCssFiles = sources.get(theme.output)?.map((source) => {
        return transform.generateTheme(source);
      }) as string[];

      let cssFile = [AUTO_GENERATE_DISCLAIMER, ...generatedCssFiles].join(
        "\n\n",
      );

      promises.push({
        promise: prettier.format(cssFile, {parser: "css"}),
        dist: theme.output,
      });
    });

    return promises;
  }

  private readonly config: Config;

  constructor({config}: Omit<StepOptions, "logger">) {
    this.config = config;
  }

  generateTheme({source, type}: {source: string; type: ThemeType}) {
    const buttonShadeNames = [
      "-minor-2",
      "-minor-1",
      "",
      "-major-1",
      "-major-2",
      "-major-3",
      "-contrast",
    ];

    const ast = cssTree.parse(source);

    const buttonBases = [...(this.config.buttons as string[])];

    cssTree.walk(ast, (node, item, list) => {
      if (node.type !== "Declaration") {
        return;
      }

      if (node.value.type !== "Raw") {
        return;
      }

      const baseName = node.property.substring(2);

      if (!buttonBases.includes(baseName)) {
        return;
      }

      /*
       * make sure we don't visit the same base name again
       * by removing it from the array of button base names
       */
      buttonBases.splice(buttonBases.indexOf(baseName), 1);

      const isLight = type === "light";

      const base = tiny(node.value.value);

      const buttonShades = Transform.genButtonShades(base, isLight);

      /* here we don't use tiny.mostReadable to prioritize white against black color. */
      const buttonContrast = tiny(
        tiny.isReadable(base, "white", {level: "AA", size: "large"})
          ? "white"
          : "black",
      );

      // use original input when color contains alpha channel (opacity, e.g. rgba)
      const declarations = [...buttonShades, buttonContrast].map((color, i) =>
        list.createItem({
          type: "Declaration",
          important: false,
          property: "--" + baseName + buttonShadeNames[i],
          value: {
            type: "Raw",
            value:
              color.getAlpha() === 1 ? color.toHexString() : color.toString(),
          },
        }),
      );

      if (!item.next) {
        for (const declaration of declarations) {
          list.append(declaration);
        }
      } else {
        /* list.insert() inserts after the next element, so we reverse insertion order */
        for (let i = declarations.length - 1; i >= 0; i--) {
          list.insert(declarations[i], item.next);
        }
      }

      /* base is consumed, we don't need it anymore, and we don't want to re-visit */
      list.remove(item);
    });

    return cssTree.generate(ast);
  }

  private static genButtonShades(base: Color, light: boolean) {
    const hsv = base.toHsv();

    if (hsv.s <= 0.3) {
      if (light) {
        return [70, 50, 0, -5, -10, -15].map(
          Transform.genMutation(base),
        ) as tinycolor.Instance[];
      }
      return [-70, -50, 0, 10, 20, 30].map(
        Transform.genMutation(base),
      ) as tinycolor.Instance[];
    }

    if (isBetween(hsv.h, 30, 60)) {
      if (light) {
        const tinted = [90, 80, 0].map(this.genMutation(base));

        const shaded = [-5, -10, -15]
          .map(this.genMutation(base))
          .map((c, i) => {
            const hsl = c.toHsl();
            hsl.h = hsl.h - 5 * (i + 1);
            return tinycolor(hsl);
          });

        return [...tinted, ...shaded];
      }

      const shaded = [-80, -70].map(this.genMutation(base)).map((c) => {
        const hsl = c.toHsl();
        hsl.h = hsl.h - 15;
        return tinycolor(hsl);
      });

      const tinted = [0, 10, 20, 30].map(this.genMutation(base));

      return [...shaded, ...tinted];
    }

    if (light) {
      return [90, 80, 0, -10, -20, -30].map(this.genMutation(base));
    }
    return [-80, -70, 0, 10, 20, 30].map(this.genMutation(base));
  }

  private static genMutation(color: Color) {
    return (mutation: number) => {
      const clone = color.clone();

      return mutation > 0
        ? tint(clone, mutation)
        : shade(clone, Math.abs(mutation));
    };
  }
}
