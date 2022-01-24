const isArrayUnique = (arr: []) =>
  Array.isArray(arr) && new Set(arr).size === arr.length;

export default isArrayUnique;
