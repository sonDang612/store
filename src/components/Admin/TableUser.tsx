import {
  BarsOutlined,
  BranchesOutlined,
  DeleteOutlined,
  DownOutlined,
  EditOutlined,
  ExclamationCircleOutlined,
} from "@ant-design/icons";
import {
  Button,
  Dropdown,
  Form,
  Menu,
  Modal,
  Popconfirm,
  Table,
  Tag,
} from "antd";
import { ItemType } from "antd/lib/menu/hooks/useItems";
import { ColumnsType } from "antd/lib/table";
import dayjs from "dayjs";
import React from "react";
import { useSelector } from "react-redux";

import { useListUser } from "@/src/react-query/hooks/user/useListUser";
import { useMutationDeleteUserAdmin } from "@/src/react-query/hooks/user/useMutationDeleteUserAdmin";
import { AdminUserType } from "@/src/redux/reducers/adminUserReducer";
import { RootState } from "@/src/redux/store";
import { useActions } from "@/src/redux/useActions";
import { COLOR } from "@/utils/Color";

import FormUser from "./FormUser";
import TableAddress from "./TableAddress";

const TableUser: React.FC<any> = () => {
  const actions = useActions();
  const { remove, page, search, expandRecord, visible } = useSelector<
    RootState,
    AdminUserType
  >((state) => state.adminUser);

  const { data, isLoading, isSuccess, isFetching } = useListUser({
    page,
    name: search.name,
    ward: search.ward,
    district: search.district,
    city: search.city,
    createdAt: search.createdAt,
    active: !search.showDeleted,
  });
  const [form] = Form.useForm();

  const { mutate: deleteUser } = useMutationDeleteUserAdmin(() => {
    actions.setAdminUserState({ remove: [] });
  });
  const menu = (record: any) => {
    const optionMenuMain: ItemType[] = [
      {
        key: "update",
        className: "text-sm",
        label: (
          <div
            className=" flex items-center space-x-2"
            onClick={() => {
              actions.openModalUserAdmin();
              form.setFieldsValue({
                fullName: record?.name,
                email: record?.email,
                phoneNumber: record?.phone,
                gender: record?.gender,
                dob: dayjs(new Date(record.dob)),
                _id: record?._id,
              });
            }}
          >
            <EditOutlined style={{ color: "#3B82F6" }} />{" "}
            <div className="text-gray-600">Update</div>
          </div>
        ),
      },
      {
        key: "delete",
        className: "text-sm",
        label: (
          <div
            className="flex items-center space-x-2"
            onClick={() => {
              Modal.confirm({
                title: "Do you really want to delete this user ?",
                icon: <ExclamationCircleOutlined />,
                onOk() {
                  deleteUser({
                    userId: record?._id,
                  });
                },
                // onCancel() {},
              });
            }}
          >
            <DeleteOutlined style={{ color: "#EF4444" }} />{" "}
            <div className="text-gray-600"> Delete</div>
          </div>
        ),
      },
    ];
    return <Menu items={optionMenuMain} />;
  };
  const columns: ColumnsType<any> = [
    {
      title: "Name",
      dataIndex: "name",
      render: (text: any, row: any) => (
        <div className={row.active ? "" : "text-red-500"}>{text} </div>
      ),
    },
    {
      title: "Email",
      dataIndex: "email",
      render: (email: any) => (
        <div className="text-[#40a9ff] cursor-pointer">{email}</div>
      ),
    },
    {
      title: "Day of birth",
      dataIndex: "dob",
      width: "10%",
      render: (dob: any) => {
        const dob2 = dayjs(dob);

        return (
          <Tag color={COLOR[dob2.get("month")]}>
            {dob2.format("DD-MM-YYYY")}
          </Tag>
        );
      },
    },
    {
      title: "Gender",
      dataIndex: "gender",
      width: "5%",
      render: (gender: any) => {
        return (
          <Tag
            color={
              gender === "male"
                ? "blue"
                : gender === "other"
                ? "purple"
                : "magenta"
            }
          >
            <span className="capitalize">{gender}</span>
          </Tag>
        );
      },
    },
    {
      title: "Phone",
      dataIndex: "phone",
      width: "8%",
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
      width: "5%",
    },
    {
      title: "Operation",
      dataIndex: "operation",
      width: "5%",
      render: (text: any, record: any, index: any) => {
        // console.log(text, record, index);
        if (!record.active) {
          return (
            <Popconfirm
              title="Are you sure to restore this deleted user?"
              onConfirm={() => {
                deleteUser({
                  userId: record?._id,
                });
              }}
              // okButtonProps={{ loading: isLoadingDeleteAddressUser }}
              okText="Sure"
              cancelText="No"
            >
              <Button
                type="ghost"
                // disabled={editingKey !== ""}
                size="small"
                icon={<BranchesOutlined style={{ color: "green" }} />}
                className=" text-xs"
              />
            </Popconfirm>
          );
        }
        return (
          <div>
            <Dropdown
              overlay={menu(record)}
              //    {...dropdownProps}
              //    overlayClassName="w-[150px]"
            >
              <Button style={{ border: "none" }}>
                <BarsOutlined style={{ marginRight: 2 }} />
                <DownOutlined />
              </Button>
            </Dropdown>
          </div>
        );
      },
    },
  ];

  const rowSelection = {
    onChange: (selectedRowKeys: any, _selectedRows: any) => {
      actions.setAdminUserState({ remove: [...selectedRowKeys] });
    },
    selectedRowKeys: remove,
    getCheckboxProps: (record: any) => ({
      disabled: !record.active,
    }),
  };
  return (
    <div className="tableUser">
      {/* <Divider /> */}
      <Modal
        open={visible}
        centered
        maskClosable={false}
        title="Edit User"
        onOk={() => {
          actions.hideModalUserAdmin();
        }}
        onCancel={() => {
          actions.hideModalUserAdmin();
        }}
        footer={null}
        className=" rounded-sm"
      >
        <FormUser form={form} />
      </Modal>

      <Table
        rowSelection={{
          type: "checkbox",
          ...rowSelection,
        }}
        expandable={{
          expandedRowRender: (record) => <TableAddress record={record} />,

          onExpandedRowsChange: (expandedRowsId) => {
            actions.setAdminUserState({ expandRecord: [...expandedRowsId] });
          },

          expandedRowKeys: expandRecord,
          rowExpandable: (record) => record.addressList.length !== 0,
        }}
        bordered
        rowKey="_id"
        loading={isLoading || isFetching}
        columns={columns}
        dataSource={data?.users || []}
        pagination={
          !isLoading &&
          isSuccess && {
            defaultCurrent: 1,
            total: data.totalUser,
            current: data.currentPage,
            defaultPageSize: data.userPerPage,
            showTotal: (total) => `Total ${total} users`,
            pageSize: data.userPerPage,
            pageSizeOptions: ["8"],
            showSizeChanger: true,
            onChange: (newPage, pageSize) => {
              actions.setAdminUserState({ page: newPage });
            },
            position: ["topRight"],
          }
        }
      />
    </div>
  );
};

export default TableUser;
