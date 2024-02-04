export function saveDataToLocalStorage(key: string, data: any) {
  if (Array.isArray(data)) {
    return localStorage.setItem(key, JSON.stringify(data));
  }
  const keyWord = JSON.parse(localStorage.getItem(key) || "[]") || [];
  if (keyWord.includes(data)) {
    const index = keyWord.indexOf(data);
    if (index > -1) {
      keyWord.splice(index, 1);
    }
    keyWord.unshift(data);
  } else {
    keyWord.push(data);
  }

  localStorage.setItem(key, JSON.stringify(keyWord));
}
