/* eslint-disable no-cond-assign */
export function getImages(string: string) {
  const imgRex = /<img.*?src="(.*?)"[^>]+>/g;
  const images = [];
  let img;
  while ((img = imgRex.exec(string))) {
    if (!img[1].startsWith("http")) images.push(img[1]);
  }
  return images;
}
