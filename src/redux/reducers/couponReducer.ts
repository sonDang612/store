import { createSlice, PayloadAction } from "@reduxjs/toolkit";

import type { Coupon } from "@/src/types/coupon";

const initialState: { coupon: Coupon | {} } = { coupon: {} };
const couponReducer = createSlice({
  name: "couponReducer",
  initialState,
  reducers: {
    setCouponReducer: (state, action: PayloadAction<Coupon | {}>) => {
      state.coupon = action.payload;
    },
  },
});

const couponActions = couponReducer.actions;
export { couponActions };
export default couponReducer.reducer;
