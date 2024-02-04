import { ExclamationCircleOutlined } from "@ant-design/icons";
import {
  Button,
  Checkbox,
  Form,
  FormItemProps,
  Input,
  Modal,
  Select,
} from "antd";
import React, { useCallback, useMemo } from "react";
import { useSelector } from "react-redux";
import { useMediaQuery } from "react-responsive";

import DatePicker from "@/components/DatePicker";
import { useMutationDeleteUserAdmin } from "@/src/react-query/hooks/user/useMutationDeleteUserAdmin";
import { AdminUserType } from "@/src/redux/reducers/adminUserReducer";
import { RootState } from "@/src/redux/store";
import { useActions } from "@/src/redux/useActions";
import { getCities, getDistricts, getWards } from "@/utils/getProvinces";
import isEmpty from "@/utils/is-empty";
import notEmpty from "@/utils/not-empty";

type FormTypeFilter = {
  name: string;
  city: string;
  district: string;
  ward: string;
  rangeDate: Date;
};
type FromElementFilter = FormItemProps<FormTypeFilter> & {
  component: React.ReactNode;
  show?: boolean;
};
const { RangePicker } = DatePicker;
const Filter: React.FC<any> = () => {
  const { remove, ward, district } = useSelector<RootState, AdminUserType>(
    (state) => state.adminUser,
  );
  const { search } = useSelector<RootState, AdminUserType>(
    (state) => state.adminUser,
  );
  const actions = useActions();
  const isBigScreen = useMediaQuery({ query: "(min-width: 1550px)" });
  const { mutate: deleteMultipleUser, isLoading: isLoadingDeleteMultipleUser } =
    useMutationDeleteUserAdmin(() => {
      actions.setAdminUserState({ remove: [] });
    });

  const [form] = Form.useForm();
  const onFinish = (values: any) => {
    const { rangeDate } = values;
    actions.setAdminUserState({
      search: {
        name: values.name,
        city: values.city,
        district: values.district,
        ward: values.ward,
        createdAt: notEmpty(rangeDate)
          ? [
              rangeDate[0].format("YYYY-MM-DD"),
              rangeDate[1].format("YYYY-MM-DD"),
            ]
          : null,
        showDeleted: search.showDeleted,
      },
    });
  };
  const onFinishFailed = (errorInfo: any) => {
    console.log("Failed:", errorInfo);
  };
  const handleRemoveMultipleUser = () => {
    Modal.confirm({
      title: "Do you really want to delete this selected user ?",
      icon: <ExclamationCircleOutlined />,
      onOk() {
        deleteMultipleUser({
          userId: remove,
        });
      },
    });
  };

  const handleChangeCity = useCallback(
    (city: string) => {
      actions.setAdminUserState({ district: getDistricts(city), ward: [] });

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
      actions.setAdminUserState({
        ward: getWards(form.getFieldValue("city"), district),
      });

      form.setFieldValue("ward", null);
    },
    [actions, form],
  );
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
        className: isBigScreen ? "min-w-[400px]" : "",
        component: <Input size="middle" placeholder="Search name" />,
      },
      {
        label: "City",
        name: "city",
        labelAlign: "left",
        className: "min-w-[200px]",
        component: (
          <Select
            className="rounded-md"
            options={getCities()}
            onChange={handleChangeCity}
            placeholder="Select a city"
            showSearch
            allowClear
            filterOption={(input, option) => {
              return (
                option.label.toLowerCase().indexOf(input.toLowerCase()) >= 0
              );
            }}
            filterSort={(optionA, optionB) => {
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
        labelAlign: "left",
        className: "min-w-[200px]",
        component: (
          <Select
            className="rounded-md"
            options={district}
            onChange={handleChangeDistrict}
            placeholder="Select a district"
            showSearch
            allowClear
            filterOption={(input, option) => {
              return (
                option.label.toLowerCase().indexOf(input.toLowerCase()) >= 0
              );
            }}
            filterSort={(optionA, optionB) =>
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
        labelAlign: "left",
        className: "min-w-[200px]",
        component: (
          <Select
            className="rounded-md"
            options={ward}
            placeholder="Select a ward"
            showSearch
            allowClear
            filterOption={(input, option) => {
              return (
                option.label.toLowerCase().indexOf(input.toLowerCase()) >= 0
              );
            }}
            filterSort={(optionA, optionB) =>
              optionA.label
                .toLowerCase()
                .localeCompare(optionB.label.toLowerCase())
            }
          />
        ),
      },
      {
        label: "Create time",
        name: "rangeDate",
        labelAlign: "left",
        className: "",
        component: <RangePicker format="DD-MM-YYYY" />,
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
    [isBigScreen, handleChangeCity, district, ward, handleChangeDistrict],
  );
  return (
    <div className="py-7 px-5">
      <div className="flex space-x-4">
        <Form
          form={form}
          name="filterUser"
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
        <div>
          <Button
            type="primary"
            disabled={isEmpty(remove)}
            onClick={handleRemoveMultipleUser}
            loading={isLoadingDeleteMultipleUser}
          >
            Remove
          </Button>
        </div>
        <div className="">
          <Checkbox
            onChange={() =>
              actions.setAdminUserState({
                search: {
                  ...search,
                  showDeleted: !search.showDeleted,
                },
              })
            }
            checked={search.showDeleted}
            className=" mr-6"
          >
            Show deleted user
          </Checkbox>
          <Button
            type="default"
            onClick={() => {
              form.resetFields();
              actions.setAdminUserState({
                name: null,
                city: null,
                district: null,
                ward: null,
                createdAt: null,
                remove: [],
                expandRecord: [""],
                search: {
                  showDeleted: false,
                },
              });
            }}
          >
            Reset
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Filter;
