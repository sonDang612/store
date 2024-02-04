/* eslint-disable react/display-name */
import { Button, Cascader, Form, Input, Popconfirm, Table } from "antd";
import React, { useState } from "react";

import { data } from "@/data/provinces2";
import { useMutationDeleteAddressUserAdmin } from "@/src/react-query/hooks/user/useMutationDeleteAddressUserAdmin";
import { useMutationUpdateUserAdmin } from "@/src/react-query/hooks/user/useMutationUpdateUserAdmin";

const rules: any = {
  name: [
    {
      required: true,
      message: "Name is required !",
    },
    {
      pattern: new RegExp(/^[A-Za-z\s\u00AA-\uFFDC]+$/),

      message: "Full Name do not include special characters and numbers",
    },
  ],
  phone: [
    {
      required: true,
      message: "Phone is required !",
    },
    {
      pattern: new RegExp(/^[0-9]\d*$/g),

      message: "Invalid phone",
      validateTrigger: "onSubmit",
    },
    { len: 10, message: "Invalid phone", validateTrigger: "onSubmit" },
    // { type: "number" },
  ],
  address: [
    {
      required: true,
      message: "Ward - District - City is required !",
    },
  ],
  addressDetail: [
    {
      required: true,
      message: "Address is required !",
    },
  ],
};

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
    dataIndex === "address" ? (
      <Cascader
        options={data}
        // onChange={onChange}
        size="small"
        placeholder="Please pick an address"
        className="text-xs"
      />
    ) : (
      <Input size="middle" className="text-xs" />
    );
  // const inputNode = <Input size="middle" className="text-xs" />;
  return (
    <td {...restProps}>
      {editing ? (
        <Form.Item
          validateFirst
          name={dataIndex}
          style={{
            margin: 0,
          }}
          rules={rules[dataIndex]}
        >
          {inputNode}
        </Form.Item>
      ) : (
        children
      )}
    </td>
  );
};
const TableAddress: React.FC<any> = ({ record }) => {
  const userId = record._id;
  const formAddress = Form.useForm()[0];
  const [editingKey, setEditingKey] = useState("");

  const { mutate: updateUserAddress, isLoading: isLoadingUpdateUserAddress } =
    useMutationUpdateUserAdmin(setEditingKey);
  const { mutate: deleteAddressUser, isLoading: isLoadingDeleteAddressUser } =
    useMutationDeleteAddressUserAdmin();
  const isEditing = (record: any) => record._id === editingKey;
  const edit = (record: any) => {
    const address = record.address.split(", ");
    const { name, phone, addressDetail } = record;
    const reversed = [...address].reverse();
    // console.log(record, reversed);
    formAddress.setFieldsValue({
      name,
      phone,
      addressDetail,
      address: reversed,
    });
    setEditingKey(record._id);
  };
  const cancel = () => {
    setEditingKey("");
  };
  const save = async (addressId: string, userId: string) => {
    try {
      const values = formAddress.getFieldsValue();

      // console.log(values, key);
      await formAddress.validateFields();
      const userUpdate = {
        city: values.address.at(0),
        district: values.address.at(1),
        ward: values.address.at(2),
        nameAddress: values.name,
        phoneAddress: values.phone,
        addressDetail: values.addressDetail,
        addressId,
        _id: userId,
      };

      updateUserAddress({ userUpdate });
    } catch (errInfo) {
      console.log("Validate Failed:", errInfo);
    }
  };
  const handleDeleteAddress = (addressId: string, userId: string) => {
    deleteAddressUser({ addressId, userId });
  };

  const dataAddress = record.addressList.map((address: any) => {
    return {
      _id: address._id,
      name: address.name,
      phone: address.phone,
      addressDetail: address.address,
      address: `${address.ward}, ${address.district}, ${address.city}`,
    };
  });

  const columnsAddress = [
    {
      title: "",
      dataIndex: "_id",
      width: "51px",

      render: (_text: any, _record: any, index: number) => (
        <div className="text-xs text-center">{index + 1} </div>
      ),
    },
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      editable: true,
      render: (name: string) => <div className="text-xs">{name} </div>,
    },
    {
      title: "Phone",
      dataIndex: "phone",
      key: "phone",
      width: "13%",
      editable: true,
      render: (phone: string) => <div className=" text-xs">{phone} </div>,
    },
    {
      title: "Address",
      dataIndex: "addressDetail",
      key: "addressDetail",
      width: "12%",
      editable: true,
      render: (addressDetail: string) => (
        <div className="text-xs">{addressDetail} </div>
      ),
    },
    {
      title: "Ward - District - City",
      dataIndex: "address",
      key: "address",
      editable: true,
      render: (address: any) => {
        return <div className=" text-xs truncate">{address}</div>;
      },
    },
    {
      title: "Operation",
      dataIndex: "operation",
      key: "operation",
      render: (_: any, row: any, _index: any) => {
        const editable = isEditing(row);
        return editable ? (
          <div>
            <Button
              type="link"
              onClick={() => save(row._id, userId)}
              // onClick={() => save(row._id)}
              size="small"
              className="text-xs"
            >
              Save
            </Button>

            <Popconfirm title="Sure to cancel?" onConfirm={cancel}>
              <Button type="link" size="small" className="text-xs">
                Cancel
              </Button>
            </Popconfirm>
          </div>
        ) : (
          <div>
            <Button
              type="link"
              disabled={editingKey !== ""}
              onClick={() => edit(row)}
              size="small"
              className="text-xs"
            >
              Edit
            </Button>
            <Popconfirm
              title="Sure to delete this address?"
              onConfirm={() => handleDeleteAddress(row._id, userId)}
              okButtonProps={{ loading: isLoadingDeleteAddressUser }}
              okText="Yes"
              cancelText="No"
            >
              <Button
                type="link"
                disabled={editingKey !== ""}
                size="small"
                className="text-xs"
              >
                Delete
              </Button>
            </Popconfirm>
          </div>
        );
      },
      // width: "30%",
    },
  ];
  const mergedColumns = columnsAddress.map((col) => {
    if (!col.editable) {
      return col;
    }

    return {
      ...col,
      onCell: (record: any) => {
        // console.log(record);
        return {
          record,
          inputType: col.dataIndex,
          // inputType: col.dataIndex === 'phone' ? 'number' : 'text',

          dataIndex: col.dataIndex,
          title: col.title,

          editing: isEditing(record),
        };
      },
    };
  });
  return (
    <Form form={formAddress} component={false}>
      <Table
        rowClassName="editable-row"
        components={{
          body: {
            cell: EditableCell,
          },
        }}
        // size="small"
        rowKey="_id"
        columns={mergedColumns}
        dataSource={dataAddress}
        pagination={false}
      />
    </Form>
  );
};

export default TableAddress;
