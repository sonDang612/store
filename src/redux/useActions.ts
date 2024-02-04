import { useMemo } from "react";
import { useDispatch } from "react-redux";
import { bindActionCreators } from "redux";

import { adminCouponActions } from "./reducers/adminCouponReducer";
import { adminCreateEditProductActions } from "./reducers/adminCreateEditProductReducer";
import { adminOrderActions } from "./reducers/adminOrderReducer";
import { adminProductActions } from "./reducers/adminProductReducer";
import { adminReviewActions } from "./reducers/adminReviewReducer";
import { adminSidebarActions } from "./reducers/adminSidebarReducer";
import { adminUserActions } from "./reducers/adminUserReducer";
import { chatGPTActions } from "./reducers/chatGPTReducer";
import { compareProductActions } from "./reducers/compareProductReducer";
import { couponActions } from "./reducers/couponReducer";
import { headerActions } from "./reducers/headerReducer";
import { modalAddressActions } from "./reducers/modalAddressReducer";
import { modalActions } from "./reducers/modalReducer";

export function useActions() {
  const dispatch = useDispatch();
  return useMemo(
    () =>
      bindActionCreators(
        {
          ...couponActions,
          ...modalActions,
          ...modalAddressActions,
          ...adminSidebarActions,
          ...adminUserActions,
          ...adminReviewActions,
          ...adminCouponActions,
          ...adminOrderActions,
          ...adminProductActions,
          ...adminCreateEditProductActions,
          ...headerActions,
          ...chatGPTActions,
          ...compareProductActions,
        },
        dispatch,
      ),
    [dispatch],
  );
}
