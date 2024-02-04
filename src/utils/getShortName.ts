export const getShortName = (name: string) => {
  const arrayName = name.replace(/\s+/g, " ").trim().split(" ");
  const lengthName = arrayName.length;
  if (lengthName === 1) return arrayName[0][0].toUpperCase();

  return `${arrayName[lengthName - 2][0].toUpperCase()}${arrayName[
    lengthName - 1
  ][0].toUpperCase()}`;
};
