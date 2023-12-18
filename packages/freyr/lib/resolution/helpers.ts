export const stripFilename = (path: string) => {
  const index = path.lastIndexOf("/");
  if (index !== -1) {
    return path.substring(0, index);
  } else {
    return path;
  }
}
