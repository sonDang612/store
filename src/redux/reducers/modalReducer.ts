import { createSlice } from "@reduxjs/toolkit";

import type { Modal } from "@/src/types/modal";

const initialState: Modal = {
  visible: false,
  head: "Login with email",
  subHead: "Enter your email and account password",
  button: "Login",
  createAccount: "Create Account",
  successful: false,
};
const modalReducer = createSlice({
  name: "modalReducer",
  initialState,
  reducers: {
    showModalLogin: (state) => {
      state.visible = true;
      state.head = "Login with email";
      state.subHead = "Enter your email and account password";
      state.button = "Login";
      state.createAccount = "Create Account";
    },
    showModalRegister: (state) => {
      state.visible = true;
      state.head = "Register with email";
      state.subHead = "Enter your email and account password";
      state.button = "Register";
      state.createAccount = "Login";
    },
    showModalForgotPassword: (state) => {
      state.visible = true;
      state.head = "Forgot password ?";
      state.subHead =
        "Please enter your account email to retrieve your password";
      state.button = "Send to email";
    },

    handleOk: (state) => {
      state.visible = false;
    },
    handleCancel: (state) => {
      state.visible = false;
    },
  },
});

const modalActions = modalReducer.actions;
export { modalActions };
export default modalReducer.reducer;
