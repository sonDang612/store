const { writeFileSync, writeFile } = require("fs");
// const province = require("./new-province");

// const newProvince = province
//   .filter((p) => p.IsEnable === 1)
//   .map((p) => {
//     return { ProvinceID: p.ProvinceID, ProvinceName: p.ProvinceName };
//   });
// writeFileSync(
//   "./new-province2.js",
//   `

// module.exports = ${JSON.stringify(newProvince)};
// `,
// );
// const district = require("./new-district");

// const newDistrict = district.map((p) => {
//   return {
//     DistrictID: p.DistrictID,
//     DistrictName: p.DistrictName,
//     ProvinceID: p.ProvinceID,
//   };
// });
// writeFileSync(
//   "./new-district2.js",
//   `

// module.exports = ${JSON.stringify(newDistrict)};
// `,
// );

const run = async (districtId) => {
  let result = await fetch(
    `https://dev-online-gateway.ghn.vn/shiip/public-api/master-data/ward?district_id=${districtId}`,
  );
  result = await result.json();
  console.log("🚀 ~ file: index.js ~ line 38 ~ run ~ result", result);
};
run(3695);
