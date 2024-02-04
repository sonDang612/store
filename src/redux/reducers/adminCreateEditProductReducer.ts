import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export type AdminCreateEditProductType = {
  spinning: boolean;
  previewVisible: boolean;
  previewImage: string;
  previewTitle: string;
  fileList: any[];
  cutImage: boolean;
  link: string;
  isCloud: boolean;
};

const initialState: AdminCreateEditProductType = {
  spinning: false,
  previewVisible: false,
  previewImage: "",
  previewTitle: "",
  fileList: [],
  cutImage: true,
  link: "",
  isCloud: true,
};
const adminCreateEditProductReducer = createSlice({
  name: "adminCreateEditProductReducer",
  initialState,
  reducers: {
    resetAdminCreateEditProductState() {
      return initialState;
    },

    setAdminCreateEditProductState: (
      state,
      actions: PayloadAction<Partial<AdminCreateEditProductType>>,
    ) => {
      return { ...state, ...actions.payload };
    },
  },
});

const adminCreateEditProductActions = adminCreateEditProductReducer.actions;
export { adminCreateEditProductActions };
export default adminCreateEditProductReducer.reducer;
