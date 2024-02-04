import {
  Button,
  Checkbox,
  Form,
  FormInstance,
  FormItemProps,
  Input,
  Select,
} from "antd";
import React, { useCallback, useMemo } from "react";
import { useSelector } from "react-redux";

import { useMutationAddUserAddress } from "@/src/react-query/hooks/user/useMutationAddAddress";
import { useMutationUpdateUserAddress } from "@/src/react-query/hooks/user/useMutationUpdateAddress";
import { useUserData } from "@/src/react-query/hooks/user/useUserData";
import { ModalAddressType } from "@/src/redux/reducers/modalAddressReducer";
import { RootState } from "@/src/redux/store";
import { useActions } from "@/src/redux/useActions";
import { getDistricts, getWards } from "@/utils/getProvinces";

type FormTypeAddress = {
  fullName: string;
  phoneNumber: string;
  city: string;
  district: string;
  ward: string;
};
type FromElementFilter = FormItemProps<FormTypeAddress> & {
  component: React.ReactNode;
  show?: boolean;
};

const validateMessages = {
  required: "${label} is required !",
  types: {
    email: "${label} is not a valid email !",
  },
  string: {
    len: "Invalid '${label}'",
  },
};
const FormAddress: React.FC<{ form: FormInstance<any> }> = ({ form }) => {
  const { data: user } = useUserData(false, false);
  const { city, district, ward, addressId, defaultAddress } = useSelector<
    RootState,
    ModalAddressType
  >((state) => state.modalAddress);
  const actions = useActions();
  const { mutate: addAddress, isLoading: isLoadingAddAddress } =
    useMutationAddUserAddress();
  const { mutate: updateAddress, isLoading: isLoadingUpdateAddress } =
    useMutationUpdateUserAddress();
  const onChangeAddressHandler = (e: any) => {
    const name = e.target.id;
    const value = e.target.value.toString().replace(/[^0-9]/g, "");
    if (name === "address_phoneNumber") {
      if (/[^0-9]/g.test(e.target.value)) {
        // check neu ko trong khoang 0 toi 9
        form.setFieldValue("phoneNumber", value);
      }
    }
  };

  const handleChangeCity = useCallback(
    (city: string) => {
      actions.setModalAddressState({ district: getDistricts(city), ward: [] });
      form.setFieldsValue({
        ...form.getFieldsValue(),
        district: null,
        ward: null,
      });
    },
    [actions, form],
  );

  const handleChangeDistrict = useCallback(
    (district: string) => {
      actions.setModalAddressState({
        ward: getWards(form.getFieldValue("city"), district),
      });
      form.setFieldValue("ward", null);
    },
    [actions, form],
  );

  const onFinishAddress = (data: any) => {
    const address = {
      name: data.fullName,
      phone: data.phoneNumber,
      city: data.city,
      district: data.district,
      ward: data.ward,
      address: data.address,
      _id: addressId || undefined,
      defaultAddress: data.defaultAddress,
    };

    if (addressId) {
      updateAddress({
        address,
      });
      actions.setModalAddressState({
        addressId: undefined,
        visible: false,
      });
      return;
    }
    addAddress({ address });
  };
  const onFinishFailed = (errorInfo: any) => {
    console.log(errorInfo);
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
        label: "Full Name",
        name: "fullName",
        rules: [
          {
            required: true,
          },
          {
            pattern: new RegExp(/^[A-Za-z\s\u00AA-\uFFDC]+$/),
            message: "Full Name do not include special characters and numbers",
          },
        ],
        labelAlign: "left",
        className: "",
        component: <Input className="rounded-md" />,
      },
      {
        label: "Phone Number",
        name: "phoneNumber",
        rules: [
          {
            required: true,
          },
          { len: 10 },
        ],
        labelAlign: "left",
        className: "",
        component: <Input className="rounded-md" />,
      },
      {
        label: "City",
        name: "city",
        rules: [
          {
            required: true,
          },
        ],
        labelAlign: "left",
        className: "",
        component: (
          <Select
            className="rounded-md"
            options={city}
            onChange={handleChangeCity}
            placeholder="Select a city"
            showSearch
            filterOption={(input: any, option: any) => {
              return (
                option.label.toLowerCase().indexOf(input.toLowerCase()) >= 0
              );
            }}
            filterSort={(optionA: any, optionB: any) => {
              // console.log(optionA, optionB);
              return optionA.label
                .toLowerCase()
                .localeCompare(optionB.label.toLowerCase());
            }}
          />
        ),
      },
      {
        label: "District",
        name: "district",
        rules: [
          {
            required: true,
          },
        ],
        labelAlign: "left",
        className: "",
        component: (
          <Select
            className="rounded-md"
            options={district}
            onChange={handleChangeDistrict}
            placeholder="Select a district"
            showSearch
            filterOption={(input: any, option: any) => {
              return (
                option.label.toLowerCase().indexOf(input.toLowerCase()) >= 0
              );
            }}
            filterSort={(optionA: any, optionB: any) =>
              optionA.label
                .toLowerCase()
                .localeCompare(optionB.label.toLowerCase())
            }
          />
        ),
      },
      {
        label: "Ward",
        name: "ward",
        rules: [
          {
            required: true,
          },
        ],
        labelAlign: "left",
        className: "",
        component: (
          <Select
            className="rounded-md"
            options={ward}
            placeholder="Select a ward"
            showSearch
            filterOption={(input: any, option: any) => {
              return (
                option.label.toLowerCase().indexOf(input.toLowerCase()) >= 0
              );
            }}
            filterSort={(optionA: any, optionB: any) =>
              optionA.label
                .toLowerCase()
                .localeCompare(optionB.label.toLowerCase())
            }
          />
        ),
      },
      {
        label: "Address",
        name: "address",
        rules: [
          {
            required: true,
          },
        ],
        labelAlign: "left",
        className: "",
        component: <Input.TextArea rows={4} className="rounded-md" />,
      },
      {
        name: "defaultAddress",
        valuePropName: "checked",
        className: "ml-[120px]",
        component: user.addressList.length > 0 && !defaultAddress && (
          <Checkbox>Set as default address</Checkbox>
        ),
      },
      {
        wrapperCol: { offset: 6, span: 16 },
        component: (
          <Button
            type="primary"
            htmlType="submit"
            className="rounded-md"
            loading={isLoadingUpdateAddress || isLoadingAddAddress}
          >
            {addressId ? "Update" : "Save"}
          </Button>
        ),
      },
    ],
    [
      city,
      handleChangeCity,
      district,
      handleChangeDistrict,
      ward,
      user,
      defaultAddress,
      isLoadingUpdateAddress,
      isLoadingAddAddress,
      addressId,
    ],
  );
  return (
    <Form
      form={form}
      // name="address"
      labelCol={{ span: 6 }}
      wrapperCol={{ span: 18 }}
      onChange={onChangeAddressHandler}
      onFinish={onFinishAddress}
      validateMessages={validateMessages}
      onFinishFailed={onFinishFailed}
      autoComplete="off"
    >
      {arrayFormFilter.map(renderForm)}
    </Form>
  );
};

export default FormAddress;
