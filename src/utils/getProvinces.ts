// import { provinces } from "@/data/provinces";

// export const getCities = () => {
//   const cities = provinces.map((city: any) => {
//     return { label: city.name, value: city.name };
//   });
//   return cities.sort((a, b) => a.value.localeCompare(b.value));
// };
// export const getDistricts = (cityName: string) => {
//   if (!cityName) return [];
//   const city: any = provinces.find((city: any) => city.name === cityName);
//   const districts: any = city.districts.map((district: any) => {
//     return { label: district.name, value: district.name };
//   });
//   return districts.sort((a: any, b: any) => {
//     const a2 = Number(a.value.split(" ")[1]);
//     const b2 = Number(b.value.split(" ")[1]);
//     if (a2 && b2) return a2 - b2;
//     return a.value.localeCompare(b.value);
//   });
// };
// export const getWards = (cityName: string, districtName: string) => {
//   if (!cityName || !districtName) return [];
//   const city: any = provinces.find((city: any) => city.name === cityName);
//   const district = city.districts.find(
//     (district: any) => district.name === districtName,
//   );
//   const wards = district.wards.map((ward: any) => {
//     return { label: ward, value: ward };
//   });

//   return wards.sort((a: any, b: any) => a.value.localeCompare(b.value));
// };
import district from "@/data/new-district2";
import province from "@/data/new-province2";
import ward from "@/data/new-ward2";

type Province = { ProvinceID: number; ProvinceName: string };
type District = {
  DistrictID: number;
  DistrictName: string;
  ProvinceID: number;
};
type Ward = {
  WardCode: string;
  WardName: string;
  DistrictID: number;
};
export const getCities = () => {
  const cities = province.map((city: Province) => {
    return { label: city.ProvinceName, value: city.ProvinceName };
  });
  return cities.sort((a, b) => a.value.localeCompare(b.value));
};
export const getDistricts = (cityName: string) => {
  if (!cityName) return [];
  const cityId = province.find((p) => p.ProvinceName === cityName)?.ProvinceID;
  if (!cityId) return [];
  const districtFilter = district.filter((d) => d.ProvinceID === cityId);
  const districts = districtFilter.map((d: District) => {
    return { label: d.DistrictName, value: d.DistrictName };
  });
  return districts.sort((a, b) => {
    const a2 = Number(a.value.split(" ")[1]);
    const b2 = Number(b.value.split(" ")[1]);
    if (a2 && b2) return a2 - b2;
    return a.value.localeCompare(b.value);
  });
};
export const getWards = (cityName: string, districtName: string) => {
  if (!cityName) return [];
  const cityId = province.find((p) => p.ProvinceName === cityName)?.ProvinceID;
  const districtId = district.find(
    (d) => d.DistrictName === districtName && d.ProvinceID === cityId,
  )?.DistrictID;
  if (!districtId) return [];
  const wardFilter = ward.filter((w) => w.DistrictID === districtId);
  const wards = wardFilter.map((ward: Ward) => {
    return { label: ward.WardName, value: ward.WardName };
  });
  return wards.sort((a, b) => a.value.localeCompare(b.value));
};
