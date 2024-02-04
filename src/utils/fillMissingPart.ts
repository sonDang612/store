function add(arr: any[], object: any, callback: any) {
  const found = arr.find(callback);
  if (!found) {
    arr.push(object);
  }
  return arr;
}
export const fillMissingPart = (
  arr: any[],
  object: any,
  start: number,
  end: number,
  step = 1,
) => {
  const array = [...arr];
  for (let i = start; i <= end; i += step) {
    add(array, object, (el: any) => el.month === i);
  }
  return array;
};
