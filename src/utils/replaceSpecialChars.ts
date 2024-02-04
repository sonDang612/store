export const replaceSpecialChars = (str: string) =>
  // eslint-disable-next-line no-useless-escape
  str.replace(/[&\/\\#,+()$~%.'":*?<>{}]/gi, (c) => `\\${c}`);
