import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export type AdminUserType = {
  district: any[];
  ward: any[];
  expandRecord: string[];
  remove: any[];
  page: number;
  visible: boolean;
  enabled: boolean;
  search: {
    name: any;
    city: any;
    district: any;
    ward: any;
    createdAt: any;
    showDeleted: boolean;
  };
};

const initialState: AdminUserType = {
  district: [],
  ward: [],
  expandRecord: [""],
  remove: [],
  page: 1,
  visible: false,
  enabled: true,
  search: {
    name: null,
    city: null,
    district: null,
    ward: null,
    createdAt: null,
    showDeleted: false,
  },
};
const adminUserReducer = createSlice({
  name: "adminUserReducer",
  initialState,
  reducers: {
    openModalUserAdmin(state) {
      state.visible = true;
    },
    hideModalUserAdmin(state) {
      state.visible = false;
    },
    resetAdminUserState() {
      return initialState;
    },
    setAdminUserState: (
      state,
      actions: PayloadAction<Partial<AdminUserType>>,
    ) => {
      return { ...state, ...actions.payload };
    },
  },
});

const adminUserActions = adminUserReducer.actions;
export { adminUserActions };
export default adminUserReducer.reducer;
