export const arrayOf = (start, end) => {
  const result = [];

  while (start < end) {
    result.push(start++);
  }

  return result;
};
