export const convertCategory = (category: string) => {
  return category
    .replace(/-/g, " ")
    .replace(/(^\w{1})|(\s+\w{1})/g, (letter) => letter.toUpperCase());
};
