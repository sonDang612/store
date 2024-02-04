/* eslint-disable react/display-name */
import { DeleteFilled, EditFilled } from "@ant-design/icons";
import {
  Button,
  Form,
  Input,
  message,
  Popconfirm,
  Table,
  TableProps,
  Tag,
} from "antd";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import React, { useState } from "react";
import { useSelector } from "react-redux";

import DatePicker from "@/components/DatePicker";
import { useDeleteCoupon } from "@/src/react-query/hooks/coupon/useDeleteCoupon";
import { useListCoupon } from "@/src/react-query/hooks/coupon/useListCoupon";
import { useMutationUpdateCoupon } from "@/src/react-query/hooks/coupon/useMutationUpdateCoupon";
import { AdminCouponType } from "@/src/redux/reducers/adminCouponReducer";
import { RootState } from "@/src/redux/store";
import { useActions } from "@/src/redux/useActions";
import { COLOR } from "@/utils/Color";
import isEmpty from "@/utils/is-empty";

dayjs.extend(relativeTime);
const EditableCell: React.FC<any> = ({
  editing,
  dataIndex,
  title,

  inputType,
  record,
  index,
  children,
  ...restProps
}) => {
  const inputNode =
    dataIndex === "expiry" ? (
      <DatePicker format="DD-MM-YYYY" size="small" />
    ) : (
      <Input size="small" />
    );
  return (
    <td {...restProps}>
      {editing ? (
        <Form.Item
          name={dataIndex}
          style={{
            margin: 0,
          }}
          // rules={[{ required: true }]}
        >
          {inputNode}
        </Form.Item>
      ) : (
        children
      )}
    </td>
  );
};
const TableCoupon: React.FC<any> = () => {
  const actions = useActions();
  const { name, expiry, discount, quantity, search, page } = useSelector<
    RootState,
    AdminCouponType["search"]
  >((state) => state.adminCoupon.search);

  const [editingKey, setEditingKey] = useState("");
  const [form] = Form.useForm();
  const isEditing = (record: any) => record._id === editingKey;
  const { mutate: updateCoupon } = useMutationUpdateCoupon(setEditingKey);
  const { mutate: deleteCoupon } = useDeleteCoupon();
  const { data, isLoading, isFetching, isSuccess } = useListCoupon({
    name,
    expiry,
    discount,
    quantity,
    search,
    page,
  });
  const edit = (record: any) => {
    form.setFieldsValue({
      name: record.name,
      discount: +record.discount,
      quantity: +record.quantity,
      expiry: dayjs(record.expiry),
    });
    //   console.log(form.getFieldValue());
    setEditingKey(record._id);
  };
  const save = (row: any) => {
    const { name, quantity, discount, expiry }: any = form.getFieldsValue();
    if (
      isEmpty(name) ||
      isEmpty(quantity) ||
      isEmpty(discount) ||
      isEmpty(expiry)
    ) {
      return message.error("Please fill in all fields");
    }

    updateCoupon({
      coupon: {
        _id: row._id,
        name,
        quantity,
        discount,
        expiry: expiry.format("YYYY-MM-DD"),
      },
    });
  };
  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      sorter: true,

      editable: true,
      render: (text: any) => <Tag>{text} </Tag>,
    },
    {
      title: "Discount",
      dataIndex: "discount",
      editable: true,

      sorter: true,
      render: (discount: any) => <Tag color="magenta">$ {discount} </Tag>,
    },
    {
      title: "Quantity",
      dataIndex: "quantity",
      editable: true,

      sorter: true,

      render: (quantity: any) => {
        return <div>{quantity}</div>;
      },
    },
    {
      title: "Expiry",
      dataIndex: "expiry",
      sorter: true,
      editable: true,

      render: (expiry: any) => {
        const dayLeft = parseInt(
          dayjs(expiry).diff(Date.now(), "day").toString(),
          10,
        );
        return (
          <Tag color={dayLeft > 0 ? "green" : "red"}>
            {dayjs(expiry).format("DD-MM-YYYY")}
          </Tag>
        );
      },
    },
    {
      title: "Day left",
      dataIndex: "expiry",

      render: (expiry: any) => {
        const dayLeft = parseInt(
          dayjs(expiry).diff(Date.now(), "day").toString(),
          10,
        );
        return (
          <Tag color={dayLeft > 0 ? "green" : "red"}>
            {dayLeft > 0 ? dayLeft : 0}
          </Tag>
        );
      },
    },

    {
      title: "CreateTime",
      dataIndex: "createdAt",

      render: (createdAt: any) => {
        const createTime = dayjs(createdAt);

        return (
          <Tag color={COLOR[createTime.get("month")]}>
            {createTime.format("DD-MM-YYYY")}
          </Tag>
        );
      },
    },
    {
      title: "Latest update",
      dataIndex: "updatedAt",

      render: (updatedAt: any) => {
        return <Tag>{dayjs(updatedAt).fromNow()}</Tag>;
      },
    },
    {
      title: "Operation",
      dataIndex: "operation",
      width: "5%",
      render: (text: any, record: any, index: any) => {
        const editable = isEditing(record);
        return editable ? (
          <div className=" flex">
            <Button
              type="link"
              // onClick={() => save(record._id, userId)}
              onClick={() => save(record)}
              size="small"
              className="text-xs"
            >
              Save
            </Button>

            <Button
              type="link"
              size="small"
              className="text-xs"
              onClick={() => setEditingKey("")}
            >
              Cancel
            </Button>
          </div>
        ) : (
          <div className="flex space-x-5">
            <Button
              type="ghost"
              onClick={() => edit(record)}
              icon={<EditFilled style={{ color: "blue" }} />}
              size="small"
              className=" text-xs"
            />
            <Popconfirm
              title="Sure to delete this coupon?"
              onConfirm={() => deleteCoupon(record._id)}
              okText="Yes"
              cancelText="No"
            >
              <Button
                type="ghost"
                size="small"
                icon={<DeleteFilled style={{ color: "red" }} />}
                className=" text-xs"
              />{" "}
            </Popconfirm>
          </div>
        );
      },
    },
  ];
  const mergedColumns: TableProps<any>["columns"] = columns.map((col) => {
    if (!col.editable) {
      return col;
    }

    return {
      ...col,
      onCell: (record: any) => {
        return {
          record,
          inputType: col.dataIndex,

          dataIndex: col.dataIndex,
          title: col.title,

          editing: isEditing(record),
        };
      },
    };
  });

  const handleTableChange = (pagination: any, filters: any, sorter: any) => {
    actions.setSearchAdminCouponState({
      page: +pagination.current,
      [sorter.field]:
        // eslint-disable-next-line no-nested-ternary
        sorter.order === "descend"
          ? `-${[sorter.field]}`
          : sorter.order === "ascend"
          ? sorter.field
          : null,
    });
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
  };
  return (
    <div>
      <Form form={form} name="couponAdmin" onChange={onFormChangeHandler}>
        <Table
          bordered
          rowKey="_id"
          components={{
            body: {
              cell: EditableCell,
            },
          }}
          onChange={handleTableChange}
          loading={isLoading || isFetching || !isSuccess}
          columns={mergedColumns}
          dataSource={data?.coupons}
          pagination={{
            defaultCurrent: 1,
            total: data?.totalCoupon || 1,
            current: data?.currentPage || 2,
            showTotal: (total) => `Total ${total} coupons`,
            pageSize: data?.couponPerPage || 8,
            pageSizeOptions: ["8"],
            showSizeChanger: true,
            position: ["topRight"],
          }}
        />
      </Form>
    </div>
  );
};

export default TableCoupon;
