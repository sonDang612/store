import { configureStore } from "@reduxjs/toolkit";
import {
  FLUSH,
  PAUSE,
  PERSIST,
  PersistConfig,
  persistReducer,
  persistStore,
  PURGE,
  REGISTER,
  REHYDRATE,
} from "redux-persist";
import createWebStorage from "redux-persist/lib/storage/createWebStorage";

import adminCouponReducer from "./reducers/adminCouponReducer";
import adminCreateEditProductReducer from "./reducers/adminCreateEditProductReducer";
import adminOrderReducer from "./reducers/adminOrderReducer";
import adminProductReducer from "./reducers/adminProductReducer";
import adminReviewReducer from "./reducers/adminReviewReducer";
import adminSidebarReducer, {
  AdminSidebarType,
} from "./reducers/adminSidebarReducer";
import adminUserReducer from "./reducers/adminUserReducer";
import chatGPTReducer, { ChatGPTResponse } from "./reducers/chatGPTReducer";
import compareProductReducer, {
  CompareProductType,
} from "./reducers/compareProductReducer";
import couponReducer from "./reducers/couponReducer";
import headerReducer from "./reducers/headerReducer";
import modalAddressReducer from "./reducers/modalAddressReducer";
import modalReducer from "./reducers/modalReducer";

const createNoopStorage = () => {
  return {
    getItem(_key: any) {
      return Promise.resolve(null);
    },
    setItem(_key: any, value: any) {
      return Promise.resolve(value);
    },
    removeItem(_key: any) {
      return Promise.resolve();
    },
  };
};

const storage =
  typeof window !== "undefined"
    ? createWebStorage("local")
    : createNoopStorage();

const persistAdminSidebarConfig: PersistConfig<AdminSidebarType> = {
  key: "adminSidebar",
  storage,
};
const persistAdminSidebarReducer = persistReducer(
  persistAdminSidebarConfig,
  adminSidebarReducer,
);
const persistChatGPTConfig: PersistConfig<ChatGPTResponse> = {
  key: "chatGPT",
  storage,
};
const persistChatGPTReducer = persistReducer(
  persistChatGPTConfig,
  chatGPTReducer,
);
const persistCompareProductConfig: PersistConfig<CompareProductType> = {
  key: "compareProduct",
  storage,
};
const persistCompareProducteducer = persistReducer(
  persistCompareProductConfig,
  compareProductReducer,
);
const store = configureStore({
  reducer: {
    modal: modalReducer,
    coupon: couponReducer,
    modalAddress: modalAddressReducer,
    adminUser: adminUserReducer,
    adminReview: adminReviewReducer,
    adminCoupon: adminCouponReducer,
    adminOrder: adminOrderReducer,
    adminProduct: adminProductReducer,
    adminCreateEditProduct: adminCreateEditProductReducer,
    header: headerReducer,
    adminSidebar: persistAdminSidebarReducer,
    chatGPT: persistChatGPTReducer,
    compareProduct: persistCompareProducteducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});
const persistor = persistStore(store);
export { store, persistor };
export type RootState = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;
