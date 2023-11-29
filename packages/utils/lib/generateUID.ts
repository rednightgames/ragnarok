let current = 0;

export const generateUID = (prefix?: string) => `${prefix || "id"}_${current++}`;
