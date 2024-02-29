const allSettledSafe = async <T>(promises: Promise<T>[]) => {
  const results = await Promise.allSettled(promises);
  const values: T[] = [];

  for (const result of results) {
    if (result.status === `rejected`) {
      throw result.reason;
    } else {
      values.push(result.value);
    }
  }

  return values;
};

export default allSettledSafe;
