/* eslint-disable no-underscore-dangle */
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { message } from "antd";
import { zipObject } from "lodash";

import { Product } from "@/src/types/product";
import { findMatches } from "@/src/utils/findMatches";
import notEmpty from "@/src/utils/not-empty";
import {
  regexGetText,
  regexTable,
  regexTableContent,
  regexTableHeader,
  regexTableText,
} from "@/src/utils/regex";

type ProductType = Product & {
  tableData: Record<string, string>;
};
export interface CompareProductType {
  list: ProductType[];
  showCompareMini: boolean;
  hasHeader: number;
}

const initialState: CompareProductType = {
  list: [],
  showCompareMini: true,
  hasHeader: 0,
};
const compareProductReducer = createSlice({
  name: "compareProductReducer",
  initialState,
  reducers: {
    addCompareProduct: (state, actions: PayloadAction<ProductType>) => {
      const tableData = findMatches(
        regexTableText,
        (findMatches(regexTable, actions.payload.tableInformation) || [
          null,
        ])[0],
      );

      const tableHeader: string[] = [];
      const tableContent: string[] = [];
      tableData.forEach((d, i) => {
        if ((i + 1) % 2 === 1) {
          const [convertHeader] = findMatches(
            regexGetText,
            d.replace(/&nbsp;/g, ""),
          );
          tableHeader.push(convertHeader.trim());
        } else tableContent.push(d);
      });
      //     .map((data) => findMatches(regexTableHeader, data).join("")) || []
      // ).map((c) => c.trim()

      // .map((data) =>
      //   findMatches(regexTableContent, data).join("").trim(),
      // ) || [];
      // const tableHeader = tableData.filter((x) => x.includes("<strong>"));
      // //     .map((data) => findMatches(regexTableHeader, data).join("")) || []
      // // ).map((c) => c.trim()
      // const tableContent = tableData.filter((x) => !x.includes("<strong>"));
      // // .map((data) =>
      // //   findMatches(regexTableContent, data).join("").trim(),
      // // ) || [];

      if (state.list.length < 3) {
        if (
          state.list.length > 0 &&
          state.list[0].category !== actions.payload.category
        ) {
          state.list = [
            {
              ...actions.payload,
              tableData: zipObject(tableHeader, tableContent),
            },
          ];
        } else {
          const productFound = state.list.find(
            (p) => p._id === actions.payload._id,
          );
          if (!productFound) {
            state.list.push({
              ...actions.payload,
              tableData: zipObject(tableHeader, tableContent),
            });
          } else {
            state.list = state.list.filter((p) => p._id !== productFound._id);
          }
        }
        state.showCompareMini = false;
      } else {
        const productFound = state.list.find(
          (p) => p._id === actions.payload._id,
        );
        if (productFound) {
          state.list = state.list.filter((p) => p._id !== productFound._id);
          state.showCompareMini = false;
        } else if (
          state.list.length > 0 &&
          state.list[0].category !== actions.payload.category
        ) {
          state.list = [
            {
              ...actions.payload,
              tableData: zipObject(tableHeader, tableContent),
            },
          ];
          state.showCompareMini = false;
        } else {
          message.info("Please remove products to continue comparing!");
        }
      }
      const [productHeader] = state.list
        .filter((x) => notEmpty(x?.tableData))
        .sort(
          (a, b) =>
            Object.keys(b?.tableData).length - Object.keys(a?.tableData).length,
        );
      const index = state.list.findIndex((x) => x?._id === productHeader?._id);
      state.hasHeader = Math.max(0, index);
    },
    removeCompareProduct: (state, actions: PayloadAction<Product>) => {
      state.list = state.list.filter((p) => p._id !== actions.payload._id);
      const [productHeader] = state.list
        .filter((x) => notEmpty(x.tableData))
        .sort(
          (a, b) =>
            Object.keys(b.tableData).length - Object.keys(a.tableData).length,
        );
      const index = state.list.findIndex((x) => x?._id === productHeader?._id);
      state.hasHeader = Math.max(0, index);
    },
    toggleMiniCompareProduct: (state) => {
      state.showCompareMini = !state.showCompareMini;
    },
    setMiniCompareProduct: (state, actions: PayloadAction<boolean>) => {
      state.showCompareMini = actions.payload;
    },
    setHasHeader: (state, actions: PayloadAction<number>) => {
      state.hasHeader = actions.payload;
    },
    clearCompareProduct: (_state) => {
      return initialState;
    },
  },
});

const compareProductActions = compareProductReducer.actions;
export { compareProductActions };
export default compareProductReducer.reducer;
