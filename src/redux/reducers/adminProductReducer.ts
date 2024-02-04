import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export type AdminProductType = {
  editingKey: string;
  disable: boolean;
  multipleCategory: boolean;
  multipleRating: boolean;
  search: {
    page: number;
    name: any;
    category: any[];
    rating: any[];
    showDeleted: boolean;
  };
};

const initialState: AdminProductType = {
  editingKey: "",
  multipleCategory: false,
  multipleRating: false,
  disable: false,
  search: {
    page: 1,
    name: null,
    category: [],
    rating: [],
    showDeleted: false,
  },
};
const adminProductReducer = createSlice({
  name: "adminProductReducer",
  initialState,
  reducers: {
    resetAdminProductState() {
      return initialState;
    },
    setSearchAdminProductState(
      state,
      actions: PayloadAction<Partial<AdminProductType["search"]>>,
    ) {
      state.search = { ...state.search, ...actions.payload };
    },
    setAdminProductState: (
      state,
      actions: PayloadAction<Partial<AdminProductType>>,
    ) => {
      return { ...state, ...actions.payload };
    },
  },
});

const adminProductActions = adminProductReducer.actions;
export { adminProductActions };
export default adminProductReducer.reducer;
