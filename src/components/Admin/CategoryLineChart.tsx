import { Select } from "antd";
import dayjs from "dayjs";
import React, { useState } from "react";
import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { COLOR, PRODUCT_CATEGORY } from "@/src/constant";
import { useCategorySell } from "@/src/react-query/hooks/statistic/useCategorySell";

const { Option } = Select;
const CURRENT_YEAR = dayjs().get("year");
const START_YEAR = 2021;

const CategoryLineChart = () => {
  const [year, setYear] = useState(CURRENT_YEAR);
  const { data: categorySell, isLoading } = useCategorySell(year);

  return (
    <div className="py-5 px-10 mt-5 bg-white rounded-sm">
      <div className="text-right">
        <Select
          value={year}
          className="text-center"
          style={{ width: 100 }}
          loading={isLoading}
          onChange={(value) => {
            setYear(value);
          }}
        >
          {Array(CURRENT_YEAR - START_YEAR + 1)
            .fill(START_YEAR)
            .map((_, i) => {
              return (
                <Option value={START_YEAR + i} key={START_YEAR + i}>
                  {START_YEAR + i}
                </Option>
              );
            })}
        </Select>
      </div>
      <div className="flex items-center text-lg text-center">
        <h1 className="" style={{ flex: "1 0 0" }}>
          Yearly Sales (product)
        </h1>
      </div>
      <ResponsiveContainer width="100%" aspect={2.75}>
        <LineChart
          data={isLoading ? [] : categorySell}
          margin={{ top: 5, right: 30, left: 10, bottom: 5 }}
        >
          <Legend
            verticalAlign="top"
            content={(prop) => {
              const { payload } = prop;
              return (
                <ul
                  className=" flex justify-end items-center py-5 space-x-3 text-sm"
                  style={{ color: "#999" }}
                >
                  {payload.map((item, key) => (
                    <li key={key} className="inline-block h-12">
                      <span
                        className="inline-block mr-2 w-3 h-3 rounded-[50%]"
                        style={{ background: item.color }}
                      />
                      {item.value}
                    </li>
                  ))}
                </ul>
              );
            }}
          />
          <XAxis
            dataKey="month"
            axisLine={{ stroke: COLOR.borderBase, strokeWidth: 1 }}
            tickLine={false}
            label={{
              value: "Month",
              angle: 0,
              position: "insideBottom",
            }}
          />
          <YAxis
            axisLine={false}
            tickLine={false}
            label={{
              value: "Product",
              angle: -90,
              position: "insideLeft",
            }}
            // tickCount={5}
            // minTickGap={1}
            allowDecimals={false}
            // tickFormatter={(number) => {
            //    return `${Math.ceil(number)}`;
            // }}
          />
          <CartesianGrid
            vertical={false}
            stroke={COLOR.borderBase}
            strokeDasharray="3 3"
          />
          <Tooltip
            wrapperStyle={{
              border: "none",
              boxShadow: "4px 4px 40px rgba(0, 0, 0, 0.05)",
            }}
            content={(content) => {
              if (!content.payload) return;
              const list = content.payload.map((item, key) => (
                <li key={key} className="h-8 text-xs text-gray-500">
                  <span
                    className="inline-block mr-2 w-3 h-3 rounded-[50%]"
                    style={{ background: item.color }}
                  />
                  {`${item.name}: ${item.value}`}
                </li>
              ));
              return (
                <div className="p-3 text-sm bg-white">
                  <p className="mb-2 text-base font-bold">{content.label}</p>
                  {content.payload && <ul>{list}</ul>}
                  {/* {content.payload && <ul>{list}</ul>} */}
                </div>
              );
            }}
          />
          {PRODUCT_CATEGORY.map((cat, i) => {
            return (
              <Line
                key={cat.name}
                type="monotone"
                dataKey={cat.name}
                stroke={cat.color}
                strokeWidth={1.5}
                // dot={{ fill: cat.color }}
                // activeDot={{ r: 1, strokeWidth: 0 }}
              />
            );
          })}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default CategoryLineChart;
