function findMatches(regex, str, matches = []) {
  const res = regex.exec(str);
  res && matches.push(res) && findMatches(regex, str, matches);
  return matches;
}
const a = /<div><strong>(.*?)<\/strong><br><\/div>/g;
const x = `<table class="se-table-size-100"><tbody><tr><td><div><strong>Product's   name</strong><br></div></td><td><div>iPhone 11 Pro Max 64GB GOLD GRAY SILVER<br></div></td></tr><tr><td><div><strong>Country   of Origin</strong><br></div></td><td><div>US</div></td></tr><tr><td><div><strong>Debut   year</strong><br></div></td><td><div>2021<br></div></td></tr><tr><td><div><strong>Guarantee</strong><br></div></td><td><div>12 months<br></div></td></tr><tr><td><div><strong>Screen</strong><br></div></td><td><div>1242 x   2688 pixels, 6.5 inches<br></div></td></tr><tr><td><div><strong>Operating   System</strong><br></div></td><td><div>iOS 13<br></div></td></tr><tr><td><div><strong>CPU</strong><br></div></td><td><div>Apple A13   Bionic<br></div></td></tr><tr><td><div><strong>Front   Camera</strong><br></div></td><td><div>12 MP<br></div></td></tr><tr><td><div><strong>Rear   Camera</strong><br></div></td><td><div>12 MP + 12   MP + 12 MP<br></div></td></tr><tr><td><div><strong>RAM</strong><br></div></td><td><div>4 GB<br></div></td></tr><tr><td><div><strong>ROM</strong><br></div></td><td><div>64 GB<br></div></td></tr><tr><td><div><strong>Weight</strong><br></div></td><td><div>1.15Kg<br></div></td></tr><tr><td><div><strong>Battery</strong><br></div></td><td><div>4000 mAh<br></div></td></tr></tbody></table>`;
const b = x.match(a);
// console.log(b)
findMatches(a, x).forEach((v) => {
  console.log(v[1]);
});

// function findMatches(regex, str, matches = []) {
//   const res = regex.exec(str);
//   res && matches.push(res) && findMatches(regex, str, matches);
//   return matches;
// }
// const a = /(?<=<td>)(.*?)(?=<\/td>)/gm;
// const x = `<table class="se-table-size-100"><tbody><tr><td><div><strong>Product's   name</strong><br></div></td><td><div>iPhone 11 Pro Max 64GB GOLD GRAY SILVER<br></div></td></tr><tr><td><div><strong>Country   of Origin</strong><br></div></td><td><div>US</div></td></tr><tr><td><div><strong>Debut   year</strong><br></div></td><td><div>2021<br></div></td></tr><tr><td><div><strong>Guarantee</strong><br></div></td><td><div>12 months<br></div></td></tr><tr><td><div><strong>Screen</strong><br></div></td><td><div>1242 x   2688 pixels, 6.5 inches<br></div></td></tr><tr><td><div><strong>Operating   System</strong><br></div></td><td><div>iOS 13<br></div></td></tr><tr><td><div><strong>CPU</strong><br></div></td><td><div>Apple A13   Bionic<br></div></td></tr><tr><td><div><strong>Front   Camera</strong><br></div></td><td><div>12 MP<br></div></td></tr><tr><td><div><strong>Rear   Camera</strong><br></div></td><td><div>12 MP + 12   MP + 12 MP<br></div></td></tr><tr><td><div><strong>RAM</strong><br></div></td><td><div>4 GB<br></div></td></tr><tr><td><div><strong>ROM</strong><br></div></td><td><div>64 GB<br></div></td></tr><tr><td><div><strong>Weight</strong><br></div></td><td><div>1.15Kg<br></div></td></tr><tr><td><div><strong>Battery</strong><br></div></td><td><div>4000 mAh<br></div></td></tr></tbody></table>`;
// const b = x.match(a);
// // console.log(b)
// findMatches(a, x)
//   .filter((v) => !v[1].includes("<strong>"))
//   .forEach((v) => {
//     console.log(v[1]);
//   });
// const a=/(?<=<td>)(.*?)(?=<\/td>)/gm
// const x=`<table class="se-table-size-100"><tbody><tr><td><div><strong>Product's   name</strong><br></div></td><td><div>iPhone 11 Pro Max 64GB GOLD GRAY SILVER<br></div></td></tr><tr><td><div><strong>Country   of Origin</strong><br></div></td><td><div>US</div></td></tr><tr><td><div><strong>Debut   year</strong><br></div></td><td><div>2021<br></div></td></tr><tr><td><div><strong>Guarantee</strong><br></div></td><td><div>12 months<br></div></td></tr><tr><td><div><strong>Screen</strong><br></div></td><td><div>1242 x   2688 pixels, 6.5 inches<br></div></td></tr><tr><td><div><strong>Operating   System</strong><br></div></td><td><div>iOS 13<br></div></td></tr><tr><td><div><strong>CPU</strong><br></div></td><td><div>Apple A13   Bionic<br></div></td></tr><tr><td><div><strong>Front   Camera</strong><br></div></td><td><div>12 MP<br></div></td></tr><tr><td><div><strong>Rear   Camera</strong><br></div></td><td><div>12 MP + 12   MP + 12 MP<br></div></td></tr><tr><td><div><strong>RAM</strong><br></div></td><td><div>4 GB<br></div></td></tr><tr><td><div><strong>ROM</strong><br></div></td><td><div>64 GB<br></div></td></tr><tr><td><div><strong>Weight</strong><br></div></td><td><div>1.15Kg<br></div></td></tr><tr><td><div><strong>Battery</strong><br></div></td><td><div>4000 mAh<br></div></td></tr></tbody></table>`
// const b=x.match(a)
// // console.log(b)
// findMatches(a,x).filter(v=>true).forEach(v=>{
//     console.log(v)
// })
export {};
