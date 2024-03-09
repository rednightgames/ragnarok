export const getValidatedLocalID = (localID = "") => {
  if (!localID) {
    return;
  }
  const maybeLocalID = Number.parseInt(localID, 10);
  if (
    Number.isInteger(maybeLocalID) &&
    maybeLocalID >= 0 &&
    maybeLocalID <= 100000000
  ) {
    return maybeLocalID;
  }
};
