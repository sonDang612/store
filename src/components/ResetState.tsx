import { useRouter } from "next/dist/client/router";
import { useEffect } from "react";

import { useActions } from "../redux/useActions";

const arrayUrl = [
  "/admin/dashboard",
  "/admin/user",
  "/admin/orders",
  "/admin/products",
  "/admin/reviews",
  "/admin/coupon",
];
const ResetState = () => {
  const dynamicRoute = useRouter().asPath;

  const actions = useActions();
  // Reset count to 0 on dynamic route change.
  useEffect(() => {
    if (arrayUrl.includes(dynamicRoute)) {
      actions.resetAdminUserState();
      actions.resetAdminReviewState();
      actions.resetAdminCouponState();
      actions.resetAdminOrderState();
      actions.resetAdminProductState();
      actions.resetAdminCreateEditProductState();
    }
  }, [actions, dynamicRoute]);
  return <span></span>;
};

export default ResetState;
