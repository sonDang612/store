import { Button, Form, FormItemProps, Input, message } from "antd";
import React, { useMemo } from "react";

import DatePicker from "@/components/DatePicker";
import { useCreateCoupon } from "@/src/react-query/hooks/coupon/useCreateCoupon";
import { useActions } from "@/src/redux/useActions";

type FormTypeCoupon = {
  name: string;
  couponName: string;
  discount: number;
  quantity: number;
  expiry: Date;
};
type FromElementFilter = FormItemProps<FormTypeCoupon> & {
  component: React.ReactNode;
  show?: boolean;
};
const FilterCoupon: React.FC<any> = () => {
  const [form] = Form.useForm();
  const actions = useActions();
  const { mutate: createCoupon } = useCreateCoupon(form);

  const onFinish = (values: any) => {
    actions.setSearchAdminCouponState({ search: values.name, page: 1 });
  };
  const onFormChangeHandler = (e: any) => {
    const name = e.target.id.split("_")[1];
    const { value } = e.target;
    if (name === "quantity" || name === "discount") {
      if (/[^0-9]/g.test(e.target.value)) {
        // check neu ko trong khoang 0 toi 9
        form.setFieldValue(name, Number(value.replace(/[^0-9]/g, "")));
      }
    }
    if (name === "couponName") {
      if (/[^0-9]/g.test(e.target.value)) {
        // check neu ko trong khoang 0 toi 9
        form.setFieldValue("couponName", value.toUpperCase());
      }
    }
  };
  const handleCreateCoupon = () => {
    const coupon = form.getFieldsValue();
    if (
      !coupon.quantity ||
      !coupon.discount ||
      !coupon?.expiry?.format("YYYY-MM-DD") ||
      !coupon.couponName
    ) {
      return message.error("Please fill all the fields");
    }
    if (coupon.couponName.length < 6 || coupon.couponName.length > 12) {
      return message.error("Coupon must be between 6 and 12 characters");
    }
    createCoupon({
      quantity: coupon.quantity,
      discount: coupon.discount,
      expiry: coupon.expiry?.format("YYYY-MM-DD"),
      name: coupon.couponName,
    });
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
        label: "Name",
        name: "name",
        labelAlign: "left",
        className: "min-w-[400px]",
        component: <Input size="middle" placeholder="Search coupon name" />,
      },
      {
        className: "mt-[30px]",
        component: (
          <Button type="primary" htmlType="submit">
            Search
          </Button>
        ),
      },
      {
        label: "Coupon Name",
        name: "couponName",
        labelAlign: "left",
        className: "",
        component: <Input size="middle" />,
      },
      {
        label: "Discount",
        name: "discount",
        labelAlign: "left",
        className: "",
        component: <Input size="middle" />,
      },
      {
        label: "Quantity",
        name: "quantity",
        labelAlign: "left",
        className: "",
        component: <Input size="middle" />,
      },
      {
        label: "Expiry",
        name: "expiry",
        labelAlign: "left",
        className: "",
        component: <DatePicker format="DD-MM-YYYY" size="middle" />,
      },
    ],
    [],
  );
  return (
    <div className="py-7 px-5">
      <Form
        form={form}
        name="filterCoupon"
        onChange={onFormChangeHandler}
        onFinish={onFinish}
        layout="vertical"
        className="flex space-x-8"
      >
        {arrayFormFilter.map(renderForm)}
      </Form>
      <div className="text-right">
        <Button type="primary" onClick={handleCreateCoupon}>
          Create Coupon
        </Button>
      </div>
    </div>
  );
};

export default FilterCoupon;
