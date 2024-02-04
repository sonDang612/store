export function removeEmpty(obj: { [k: string]: any }) {
  return Object.fromEntries(Object.entries(obj).filter(([_, v]) => v != null));
}
