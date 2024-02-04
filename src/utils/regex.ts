export const regexTable = /(<table[\s\w\W]*<\/table>)/gm;
export const regexTableText = /(?<=<td>)(.*?)(?=<\/td>)/gm;
export const regexTableContent = /(?<=<div>)(.*?)(<br>)?(?=<\/div>)/gm;
export const regexTableHeader =
  /(?<=<div>)<strong>(.*?)<\/strong>(<br>)?(?=<\/div>)/gm;
export const regexGetText = /(?<=>)([\w\s]+)(?=<\/)/gm;
