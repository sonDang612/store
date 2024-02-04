import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export type AdminCouponType = {
  search: {
    name: any;
    expiry: any;
    discount: any;
    quantity: any;
    search: any;
    page: number;
  };
};

const initialState: AdminCouponType = {
  search: {
    name: null,
    expiry: null,
    discount: null,
    quantity: null,
    search: null,
    page: 1,
  },
};
const adminCouponReducer = createSlice({
  name: "adminCouponReducer",
  initialState,
  reducers: {
    resetAdminCouponState() {
      return initialState;
    },
    setSearchAdminCouponState(
      state,
      actions: PayloadAction<Partial<AdminCouponType["search"]>>,
    ) {
      state.search = { ...state.search, ...actions.payload };
    },
    setAdminCouponState: (
      state,
      actions: PayloadAction<Partial<AdminCouponType>>,
    ) => {
      return { ...state, ...actions.payload };
    },
  },
});

const adminCouponActions = adminCouponReducer.actions;
export { adminCouponActions };
export default adminCouponReducer.reducer;
