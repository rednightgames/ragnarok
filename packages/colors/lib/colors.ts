export enum ThemeColor {
  Primary = "primary",
  Secondary = "secondary",
  Danger = "danger",
  Warning = "warning",
  Success = "success",
}

export const InvertThemeColors: string[] = [
  ThemeColor.Warning,
  ThemeColor.Success,
];

export type ThemeColorUnion = `${ThemeColor}`;
