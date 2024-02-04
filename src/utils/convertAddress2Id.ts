import district from "../../server/data/new-district2";
import ward from "../../server/data/new-ward2";
import type { FeePayload } from "../react-query/hooks/order/useCalculateFee";

const convertAddress2Id = ({
  toDistrictName,
  toWardName,
}: {
  toDistrictName: string;
  toWardName: string;
}): FeePayload => {
  const toDistrictId = district.find(
    (d) => d.DistrictName === toDistrictName,
  )?.DistrictID;
  const toWardCode = ward.find((w) => w.WardName === toWardName)?.WardCode;
  return { toDistrictId, toWardCode: +toWardCode };
};
export { convertAddress2Id };
