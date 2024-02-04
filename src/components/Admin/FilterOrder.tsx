import { Button, Form, FormItemProps, Input, Select } from "antd";
import React, { useMemo } from "react";
import { useMediaQuery } from "react-responsive";

import DatePicker from "@/components/DatePicker";
import { ORDER_STATUS } from "@/src/constant";
import { useActions } from "@/src/redux/useActions";
import notEmpty from "@/utils/not-empty";
// import { data } from "@/data/provinces2";

type FormTypeOrder = {
  id: string;
  name: string;
  payment: string;
  status: string;
  rangeDate: Date;
};
type FromElementFilter = FormItemProps<FormTypeOrder> & {
  component: React.ReactNode;
  show?: boolean;
};
const { RangePicker } = DatePicker;
const FilterOrder: React.FC<any> = () => {
  const isBigScreen = useMediaQuery({ query: "(min-width: 1550px)" });
  const actions = useActions();
  const [form] = Form.useForm();
  const onFinish = (values: any) => {
    const { name, id, status, payment, rangeDate } = values;

    actions.setSearchAdminOrderState({
      name,
      id,
      status,
      payment,
      createdAt: notEmpty(rangeDate)
        ? [rangeDate[0].format("YYYY-MM-DD"), rangeDate[1].format("YYYY-MM-DD")]
        : null,
    });
  };
  const onFinishFailed = (errorInfo: any) => {
    // eslint-disable-next-line no-console
    console.log("Failed:", errorInfo);
  };
  const renderForm = (
    { component, ...itemProps }: FromElementFilter,
    i: number,
  ) => {
    return (
      <Form.Item {...itemProps} key={i}>
        {component}
      </Form.Item>
    );
  };
  const arrayFormFilter = useMemo<FromElementFilter[]>(
    () => [
      {
        label: "Order Id",
        name: "id",
        labelAlign: "left",
        className: isBigScreen ? "min-w-[300px]" : "",
        component: <Input size="middle" placeholder="Search Order Id" />,
      },
      {
        label: "Delevery to",
        name: "name",
        labelAlign: "left",
        className: isBigScreen ? "min-w-[300px]" : "",
        component: <Input size="middle" placeholder="Search name" />,
      },
      {
        label: "Payment",
        name: "payment",
        labelAlign: "left",
        className: isBigScreen ? "w-[200px]" : "w-[150px]",
        component: (
          <Select showSearch placeholder="Payment" allowClear>
            {["Cash", "paypal", "Stripe Card", "zaloPay", "MoMo"].map(
              (status, _i) => {
                return (
                  <Select.Option value={status} key={status}>
                    <span className="text-gray-600 capitalize">{status}</span>
                  </Select.Option>
                );
              },
            )}
          </Select>
        ),
      },
      {
        label: "Status",
        name: "status",
        labelAlign: "left",
        className: "w-[200px]",
        component: (
          <Select showSearch placeholder="Choose status" allowClear>
            {ORDER_STATUS.map((status, i) => {
              return (
                <Select.Option value={status} key={status}>
                  <span className="text-gray-600">{status}</span>
                </Select.Option>
              );
            })}
          </Select>
        ),
      },
      {
        label: "Create time",
        name: "rangeDate",
        labelAlign: "left",
        component: <RangePicker format="DD-MM-YYYY" allowClear />,
      },
      {
        className: "mt-[30px]",
        component: (
          <Button type="primary" htmlType="submit">
            Search
          </Button>
        ),
      },
    ],
    [isBigScreen],
  );
  return (
    <div className="py-7 px-5">
      <div className="flex space-x-4">
        <Form
          form={form}
          name="filterOrder"
          initialValues={{ remember: true }}
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
          autoComplete="off"
          layout="vertical"
          className="flex space-x-8"
        >
          {arrayFormFilter.map(renderForm)}
        </Form>
      </div>
      <div className="flex justify-between mt-3">
        <div className="">
          <Button
            type="default"
            onClick={() => {
              form.resetFields();
              actions.resetAdminOrderState();
            }}
          >
            Reset
          </Button>
        </div>
      </div>
    </div>
  );
};

export default FilterOrder;
