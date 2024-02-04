import { Select } from "antd";
import dayjs from "dayjs";
import React, { useState } from "react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { useTotalRevenue } from "@/src/react-query/hooks/statistic/useTotalRevenue";

const { Option } = Select;

const CURRENT_YEAR = dayjs().get("year");
const START_YEAR = 2021;
const CURRENT_MONTH = dayjs().get("month") + 1;
const CustomTooltip: React.FC<any> = ({ active, payload, label }) => {
  if (!payload) return null;
  if (active) {
    return (
      <div className="p-2 bg-white border-2 border-blue-100">
        <h4>{dayjs(label).format("dddd, DD MMM YYYY")}</h4>
        <p>${payload[0].value.toFixed(2)} USD</p>
      </div>
    );
  }
  return null;
};
export default function Home() {
  const [year, setYear] = useState(CURRENT_YEAR);
  const [month, setMonth] = useState(CURRENT_MONTH);
  const { data: totalRevenue, isLoading } = useTotalRevenue(year, month);
  return (
    <div className="p-2 mt-5">
      <div className="flex justify-end items-center m-3 space-x-3">
        <div className="">
          <Select
            value={year}
            style={{ width: 120 }}
            placeholder="year"
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
        <div className="">
          <Select
            value={month}
            style={{ width: 120 }}
            loading={isLoading}
            placeholder="month"
            onChange={(value) => {
              setMonth(value);
            }}
          >
            {Array(12)
              .fill(1)
              .map((_, i) => {
                return (
                  <Option value={i + 1} key={i + 1}>
                    {i + 1}
                  </Option>
                );
              })}
          </Select>
        </div>
      </div>
      <div className="flex items-center py-2 text-lg font-normal text-center">
        <h1 className="" style={{ flex: "1 0 0" }}>
          Total revenue in {dayjs(`2021-${month}-01`).format("MMMM")} {year}
        </h1>
      </div>
      <ResponsiveContainer width="100%" aspect={3.2}>
        {/* <ResponsiveContainer width="100%" height={400}> */}
        <AreaChart
          data={isLoading ? [] : totalRevenue}
          margin={{ top: 20, right: 30, left: 20, bottom: 0 }}
        >
          <defs>
            <linearGradient id="color" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#2451B7" stopOpacity={0.4} />
              <stop offset="75%" stopColor="#2451B7" stopOpacity={0.09} />
            </linearGradient>
          </defs>

          <Area
            type="monotone"
            dataKey="value"
            stroke="#2451B7"
            fill="url(#color)"
          />

          <XAxis
            dataKey="date"
            axisLine={false}
            tickLine={false}
            tickFormatter={(str) => {
              return dayjs(str).get("date").toString();
            }}
          />

          <YAxis
            dataKey="value"
            axisLine={false}
            tickLine={false}
            tickCount={7}
            tickFormatter={(number) => {
              return `$ ${number}`;
            }}
            // tickFormatter={(number) => `$ ${number.toFixed(2)}`}
          />

          <Tooltip content={<CustomTooltip />} />

          <CartesianGrid opacity={0.2} vertical={false} />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
