import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export type HeaderType = {
  search: string;
  open: boolean;
  flag: string;
};

const initialState: HeaderType = {
  search: "",
  open: true,
  flag: "",
};
const headerReducer = createSlice({
  name: "headerReducer",
  initialState,
  reducers: {
    resetHeaderState() {
      return initialState;
    },

    setHeaderState: (state, actions: PayloadAction<Partial<HeaderType>>) => {
      return { ...state, ...actions.payload };
    },
  },
});

const headerActions = headerReducer.actions;
export { headerActions };
export default headerReducer.reducer;
