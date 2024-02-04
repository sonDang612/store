import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export type AdminReviewType = {
  responseText: string;
  review: any;
  isModalVisible: boolean;
  multipleRating: boolean;
  search: {
    selectedRating: any[];
    search: string;
    page: number;
  };
};

const initialState: AdminReviewType = {
  responseText: "",
  review: {},
  multipleRating: false,
  isModalVisible: false,
  search: {
    selectedRating: [],
    search: "",
    page: 1,
  },
};
const adminReviewReducer = createSlice({
  name: "adminReviewReducer",
  initialState,
  reducers: {
    openModalReviewAdmin(state) {
      state.isModalVisible = true;
    },
    hideModalReviewAdmin(state) {
      state.isModalVisible = false;
    },
    resetAdminReviewState() {
      return initialState;
    },
    setSearchAdminReviewState(
      state,
      actions: PayloadAction<Partial<AdminReviewType["search"]>>,
    ) {
      state.search = { ...state.search, ...actions.payload };
    },
    setAdminReviewState: (
      state,
      actions: PayloadAction<Partial<AdminReviewType>>,
    ) => {
      return { ...state, ...actions.payload };
    },
  },
});

const adminReviewActions = adminReviewReducer.actions;
export { adminReviewActions };
export default adminReviewReducer.reducer;
