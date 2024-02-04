import {
  Button,
  Checkbox,
  Divider,
  Form,
  FormItemProps,
  Input,
  Select,
  Tag,
} from "antd";
import React, { useMemo } from "react";
import { useSelector } from "react-redux";

import { AdminReviewType } from "@/src/redux/reducers/adminReviewReducer";
import { RootState } from "@/src/redux/store";
import { useActions } from "@/src/redux/useActions";

type FormTypeReview = {
  type: string;
  search: string;
};
type FromElementFilter = FormItemProps<FormTypeReview> & {
  component: React.ReactNode;
  show?: boolean;
};
const { CheckableTag } = Tag;
const tagsRating = ["1", "2", "3", "4", "5"];
const FilterReview: React.FC<any> = () => {
  const actions = useActions();
  const [form] = Form.useForm();
  const {
    search: { selectedRating },
    multipleRating,
  } = useSelector<RootState, AdminReviewType>((state) => state.adminReview);

  const handleChangeRating = (tag: string, checked: boolean) => {
    let nextSelectedRating;
    if (multipleRating) {
      nextSelectedRating = checked
        ? [...selectedRating, tag]
        : selectedRating.filter((t: any) => t !== tag);
    } else nextSelectedRating = checked ? [tag] : [];
    actions.setSearchAdminReviewState({ selectedRating: nextSelectedRating });
  };
  const onFinish = (values: any) => {
    const { type, search } = values;
    const objectSearch: AdminReviewType["search"] = {
      page: 1,
    } as AdminReviewType["search"];
    if (type === "pdName") {
      objectSearch.search = `product.name[]${search}`;
    } else if (type === "pdId") {
      objectSearch.search = `product._id[]${search}`;
    } else if (type === "rvName") {
      objectSearch.search = `user.name[]${search}`;
    }
    actions.setSearchAdminReviewState({ ...objectSearch });
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
        name: "type",
        labelAlign: "left",
        className: "!m-0",
        component: (
          <Select style={{ width: 140 }}>
            <Select.Option value="pdName">
              <span className="text-xs">Product name</span>
            </Select.Option>

            <Select.Option value="rvName">
              <span className="text-xs">Reviewer name</span>
            </Select.Option>
            <Select.Option value="pdId">
              <span className="text-xs">Product Id</span>
            </Select.Option>
          </Select>
        ),
      },
      {
        name: "search",
        labelAlign: "left",
        className: "!m-0 w-[40%] ",
        component: <Input placeholder="Search review" allowClear />,
      },
      {
        className: "ml-[10px]",
        component: (
          <Button type="primary" htmlType="submit">
            Search
          </Button>
        ),
      },
    ],
    [],
  );
  return (
    <div className="py-7 px-5">
      <div className="mb-6">
        <Form
          form={form}
          name="filterOrder"
          initialValues={{ type: "pdName" }}
          onFinish={onFinish}
          layout="inline"
        >
          {arrayFormFilter.map(renderForm)}
        </Form>
      </div>
      <div className="flex items-center pl-1">
        <span style={{ marginRight: 40 }} className="text-gray-600">
          Rating:
        </span>
        {tagsRating.map((tag) => {
          return (
            <div key={tag}>
              <CheckableTag
                checked={selectedRating.indexOf(tag) > -1}
                onChange={(checked) => handleChangeRating(tag, checked)}
              >
                <div className=" flex items-center space-x-1">
                  <span className=" ">{tag}</span>
                  <span>star</span>
                </div>
              </CheckableTag>
              <Divider type="vertical" />
            </div>
          );
        })}
        <Button
          type="primary"
          size="small"
          onClick={() =>
            actions.setSearchAdminReviewState({ selectedRating: [] })
          }
          className="mr-5 text-xs"
        >
          {" "}
          Clear
        </Button>
        <Checkbox
          onChange={() =>
            actions.setAdminReviewState({ multipleRating: !multipleRating })
          }
          checked={multipleRating}
        >
          Multiple
        </Checkbox>
      </div>
    </div>
  );
};

export default FilterReview;
