import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface AdminSidebarType {
  theme: "light" | "dark";
  collapsed: boolean;
}

const initialState: AdminSidebarType = {
  theme: "light",
  collapsed: false,
};
const adminSidebarReducer = createSlice({
  name: "adminSidebarReducer",
  initialState,
  reducers: {
    toggleCollapse(state) {
      state.collapsed = !state.collapsed;
    },
    setAdminSidebarState: (
      state,
      actions: PayloadAction<Partial<AdminSidebarType>>,
    ) => {
      return { ...state, ...actions.payload };
    },
  },
});

const adminSidebarActions = adminSidebarReducer.actions;
export { adminSidebarActions };
export default adminSidebarReducer.reducer;
