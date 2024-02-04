import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export type AdminOrderType = {
  editingKey: string;
  search: {
    name: any;
    id: any;
    status: any;
    createdAt: any;
    payment: any;
    page: number;
  };
};

const initialState: AdminOrderType = {
  editingKey: "",
  search: {
    name: null,
    id: null,
    status: null,
    createdAt: null,
    payment: null,
    page: 1,
  },
};
const adminOrderReducer = createSlice({
  name: "adminOrderReducer",
  initialState,
  reducers: {
    resetAdminOrderState() {
      return initialState;
    },
    setSearchAdminOrderState(
      state,
      actions: PayloadAction<Partial<AdminOrderType["search"]>>,
    ) {
      state.search = { ...state.search, ...actions.payload };
    },
    setAdminOrderState: (
      state,
      actions: PayloadAction<Partial<AdminOrderType>>,
    ) => {
      return { ...state, ...actions.payload };
    },
  },
});

const adminOrderActions = adminOrderReducer.actions;
export { adminOrderActions };
export default adminOrderReducer.reducer;
