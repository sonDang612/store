import { createSlice, PayloadAction } from "@reduxjs/toolkit";

import { getCities } from "@/src/utils/getProvinces";

export interface ModalAddressType {
  visible: boolean;
  city: any[];
  district: any[];
  ward: any[];
  addressId: string;
  defaultAddress: boolean;
}

const initialState: ModalAddressType = {
  visible: false,
  city: getCities(),
  district: [],
  ward: [],
  addressId: "",
  defaultAddress: false,
};
const modalAddressReducer = createSlice({
  name: "modalAddressReducer",
  initialState,
  reducers: {
    hideModalAddress: (state) => {
      state.visible = false;
    },
    openModalAddress: (state) => {
      state.visible = true;
    },
    setModalAddressState: (
      state,
      actions: PayloadAction<Partial<ModalAddressType>>,
    ) => {
      return { ...state, ...actions.payload };
    },
  },
});

const modalAddressActions = modalAddressReducer.actions;
export { modalAddressActions };
export default modalAddressReducer.reducer;
