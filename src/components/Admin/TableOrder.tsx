/* eslint-disable react/display-name */

import { SaveOutlined } from "@ant-design/icons";
import { Button, Divider, Form, Select, Table, Tag } from "antd";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import Link from "next/link";
import React from "react";
import { useSelector } from "react-redux";
import { useMediaQuery } from "react-responsive";

import {
  ORDER_STATUS_COLOR,
  ORDER_STATUS_WITHOUT_CANCEL,
  PAYMENT_COLOR,
} from "@/src/constant";
import { useListOrder } from "@/src/react-query/hooks/order/useListOrder";
import { useMutationUpdateStatusOrder } from "@/src/react-query/hooks/order/useMutationUpdateStatusOrder";
import { AdminOrderType } from "@/src/redux/reducers/adminOrderReducer";
import { RootState } from "@/src/redux/store";
import { useActions } from "@/src/redux/useActions";
import { User } from "@/src/types/user";
import { COLOR } from "@/utils/Color";

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
  const indexStatus = ORDER_STATUS_WITHOUT_CANCEL.findIndex(
    (status) => status === record?.status,
  );

  const inputNode =
    dataIndex === "status" ? (
      <Select size="small" showSearch>
        {ORDER_STATUS_WITHOUT_CANCEL.map((status, i) => {
          return (
            <Select.Option
              value={status}
              key={status}
              disabled={!(i === indexStatus || i === indexStatus + 1)}
            >
              <span className="text-xs"> {status}</span>
            </Select.Option>
          );
        })}
      </Select>
    ) : (
      <div></div>
    );

  return (
    <td {...restProps}>
      {editing ? (
        <Form.Item
          name={dataIndex}
          style={{
            margin: 0,
          }}
        >
          {inputNode}
        </Form.Item>
      ) : (
        children
      )}
    </td>
  );
};
const TableOrder: React.FC<any> = () => {
  const [form] = Form.useForm();
  const actions = useActions();
  const isBigScreen = useMediaQuery({ query: "(min-width: 1550px)" });
  const { name, id, status, createdAt, payment, page } = useSelector<
    RootState,
    AdminOrderType["search"]
  >((state) => state.adminOrder.search);
  const editingKey = useSelector<RootState, AdminOrderType["editingKey"]>(
    (state) => state.adminOrder.editingKey,
  );
  const { data, isLoading, isSuccess, isFetching } = useListOrder({
    name,
    id,
    status,
    createdAt,
    payment,
    page,
  });

  const { mutate: updateStatusOrder } = useMutationUpdateStatusOrder(true);

  const isEditing = (record: any) => record._id === editingKey;
  const edit = (record: any) => {
    form.setFieldsValue({
      status: record.status,
    });
    actions.setAdminOrderState({ editingKey: record._id });
  };
  const save = (row: any) => {
    const values = form.getFieldsValue();
    if (row.status === values.status) {
      actions.setAdminOrderState({ editingKey: "" });
      return;
    }
    updateStatusOrder({ orderId: row._id, status: values.status });
  };
  const columns = [
    {
      title: "Order Id",
      dataIndex: "_id",
      render: (_id: any) => (
        <Link href={`/admin/orders/${_id}`}>
          <a
            style={{ width: isBigScreen ? "auto" : 60 }}
            className=" inline-block text-[11px] font-semibold text-blue-500 cursor-pointer"
          >
            {`#${_id}`}
          </a>
        </Link>
      ),
      width: "100px",
    },
    {
      title: "Customer",
      dataIndex: "user",

      render: (user: User, row: any) => {
        return (
          <div className={row.user.active === false ? "text-red-400" : ""}>
            {user.name}
          </div>
        );
      },
    },

    {
      title: "Total",
      dataIndex: "total",

      render: (total: any) => {
        return <h2 className="font-bold">{`$${total}`}</h2>;
      },
    },
    {
      title: "Payment",
      dataIndex: "paymentMethod",

      render: (paymentMethod: any) => {
        return (
          <Tag color={PAYMENT_COLOR[paymentMethod]} className="capitalize">
            {paymentMethod}
          </Tag>
        );
      },
    },

    {
      title: "Status",
      dataIndex: "status",
      editable: true,
      // width: "15%",
      render: (status: any) => {
        return (
          <Tag color={ORDER_STATUS_COLOR[status]} className="capitalize">
            {status}
          </Tag>
        );
      },
    },

    {
      title: "Created",
      dataIndex: "createdAt",
      render: (createdAt: any) => {
        const createTime = dayjs(createdAt);

        return (
          <Tag color={COLOR[createTime.get("month")]}>
            {createTime.format("MMMM D, YYYY")}
          </Tag>
        );
      },
    },
    {
      title: "Last updated",
      dataIndex: "updatedAt",
      render: (updatedAt: any) => {
        const createTime = dayjs(updatedAt);

        return <Tag>{createTime.fromNow()}</Tag>;
      },
    },
    {
      title: "Operation",
      dataIndex: "operation",
      width: "5%",
      render: (text: any, row: any, index: any) => {
        const editable = isEditing(row);
        if (
          row.status === "Delivered" ||
          row.status === "Cancelled" ||
          row.user.active === false
        ) {
          return <div></div>;
        }
        return (
          <>
            {editable ? (
              <div className=" flex items-center">
                <div
                  style={{ color: "#0b74e5" }}
                  onClick={() => save(row)}
                  className=" mr-3 text-sm text-center cursor-pointer"
                  // className="mr-3 text-xs text-left cursor-pointer"
                >
                  <SaveOutlined />
                </div>
                <div
                  style={{ color: "#0b74e5" }}
                  onClick={() => actions.setAdminOrderState({ editingKey: "" })}
                  className=" text-xs text-right cursor-pointer"
                >
                  Cancel
                </div>
              </div>
            ) : (
              <Button
                type="link"
                onClick={() => edit(row)}
                disabled={editingKey !== ""}
                size="small"
                className="text-xs"
              >
                Update
              </Button>
            )}
          </>
        );
      },
    },
  ];
  const mergedColumns = columns.map((col) => {
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
  return (
    <Form form={form} component={false}>
      <Table
        bordered
        components={{
          body: {
            cell: EditableCell,
          },
        }}
        rowKey="_id"
        loading={isLoading || isFetching}
        columns={mergedColumns}
        dataSource={data?.orders || []}
        expandable={{
          expandedRowRender: (record) => {
            const { address } = record;
            return (
              <div className=" ml-10">
                <div className=" flex items-center mt-2 space-x-2">
                  <h1 className="text-xs font-medium">Delivery to: </h1>
                  <h2 className="text-xs">
                    {record.paymentResult.receipt_name}
                  </h2>
                  <Divider type="vertical" />
                  <h2 className="text-xs">{record.phone}</h2>

                  <Divider type="vertical" />
                  <h2 className="text-xs">
                    {record.paymentResult.receipt_email}
                  </h2>
                  <div className="w-20"></div>
                  <h3 className="mt-1 text-xs text-gray-700 break-words">
                    <span className="mr-3 text-xs font-medium">Address</span>:{" "}
                    <span className="pl-1">{address}</span>
                  </h3>
                </div>
              </div>
            );
          },
        }}
        pagination={
          !isLoading && isSuccess
            ? {
                defaultCurrent: 1,
                total: data.totalOrder,
                current: data.currentPage,
                defaultPageSize: data.orderPerPage,
                showTotal: (total) => `Total ${total} orders`,
                pageSize: data.orderPerPage,
                pageSizeOptions: ["8"],
                showSizeChanger: true,
                onChange: (newPage, pageSize) => {
                  actions.setAdminOrderState({ editingKey: "" });
                  actions.setSearchAdminOrderState({ page: newPage });
                },
                position: ["topRight"],
              }
            : {}
        }
      />
    </Form>
  );
};

export default TableOrder;
