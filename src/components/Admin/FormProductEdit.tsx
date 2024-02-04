/* eslint-disable prefer-regex-literals */
import {
  FieldNumberOutlined,
  MoneyCollectOutlined,
  PercentageOutlined,
} from "@ant-design/icons";
import {
  Button,
  Col,
  Form,
  FormInstance,
  FormItemProps,
  Input,
  Row,
  Select,
} from "antd";
import dynamic from "next/dynamic";
import React, { useMemo, useRef } from "react";

// import SunEditorCore from "suneditor/src/lib/core";
import { TAG_CATEGORIES } from "@/src/constant";
import { useMutationUpdateProduct } from "@/src/react-query/hooks/product/useMutationUpdateProduct";
import { findMatches } from "@/src/utils/findMatches";
import { regexTable } from "@/src/utils/regex";
import { isNumeric } from "@/utils/isNumeric";

const SunEditor = dynamic(() => import("suneditor-react"), {
  ssr: false,
});
type FormTypeProductEdit = {
  name: string;
  category: string;
  brand: string;
  price: number;
  quantity: number;
  discount: number;
};
type FromElementFilter = FormItemProps<FormTypeProductEdit> & {
  component: React.ReactNode;
  show?: boolean;
};

const FormProductEdit: React.FC<{
  form: FormInstance<any>;
  data?: any;
  create?: boolean;
}> = ({ form, data, create = false }) => {
  // const productInformationRef = useRef(null);
  const { mutate: updateProduct, isLoading } = useMutationUpdateProduct({
    revalidate: true,
  });

  const onFinish = (values: any) => {
    if (!create) {
      const { name, category, brand, price, quantity, discount } = values;
      updateProduct({
        product: {
          _id: data._id,
          name,
          category,
          brand,
          price,
          countInStock: quantity,
          discount: +discount || 0,
        },
      });
    }
  };

  const onFormChangeHandler = (e: any) => {
    const name = e.target.id.split("_")[1];
    const { value } = e.target;

    if (name === "price") {
      if (!isNumeric(value)) {
        // check neu ko trong khoang 0 toi 9
        form.setFieldValue(
          "price",
          value
            .toString()
            .replace(/[^.\d]/g, "")
            .replace(/^(\d*\.?)|(\d*)\.?/g, "$1$2"),
        );
      }
    }

    if (name === "quantity") {
      // check neu ko trong khoang 0 toi 9
      const quantity = Number(
        value
          .toString()
          .replace(/[^.\d]/g, "")
          .replace(/^(\d*\.?)|(\d*)\.?/g, "$1$2"),
      );
      form.setFieldValue("quantity", quantity);
    }
    if (name === "discount") {
      // check neu ko trong khoang 0 toi 9
      const discount = Number(
        value
          .toString()
          .replace(/[^.\d]/g, "")
          .replace(/^(\d*\.?)|(\d*)\.?/g, "$1$2"),
      );
      form.setFieldValue("discount", discount > 99 ? 99 : discount);
    }
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
  // const getSunEditorInstance = (sunEditor: SunEditorCore) => {
  //   productInformationRef!.current = sunEditor;
  // };
  const arrayFormFilter = useMemo<FromElementFilter[]>(
    () => [
      {
        label: "Product Name",
        name: "name",
        rules: [
          {
            required: true,
          },
        ],
        labelAlign: "left",
        className: "",
        component: <Input className="rounded-md" />,
      },
      {
        label: "Category",
        name: "category",
        rules: [
          {
            required: true,
          },
        ],
        labelAlign: "left",
        className: "",
        component: (
          <Select showSearch>
            {TAG_CATEGORIES.map((category, i) => {
              return (
                <Select.Option value={category} key={category}>
                  <span className="text-sm"> {category}</span>
                </Select.Option>
              );
            })}
          </Select>
        ),
      },
      {
        label: "Brand",
        name: "brand",
        rules: [
          {
            required: true,
          },
        ],
        labelAlign: "left",
        className: "",
        component: <Input className="rounded-md" />,
      },
      {
        label: "Price",
        name: "price",
        rules: [
          {
            required: true,
          },
        ],
        labelAlign: "left",
        className: "",
        component: (
          <Input className="rounded-md" prefix={<MoneyCollectOutlined />} />
        ),
      },
      {
        label: "Quantity",
        name: "quantity",
        rules: [
          { required: true },
          {
            pattern: new RegExp(/[0-9]/),
            message: "Quantity must be a number ",
          },
        ],
        labelAlign: "left",
        className: "",
        component: (
          <Input className="rounded-md" prefix={<FieldNumberOutlined />} />
        ),
      },
      {
        label: "Discount",
        name: "discount",
        rules: [
          {
            pattern: new RegExp(
              /^(?!99\.0*[^0\n])(?=.*[0-9])\d{0,2}(?:\.\d{0,10})?$/,
            ),

            message: "Discount must be a number from 0 to 99",
          },
        ],
        labelAlign: "left",
        className: "",
        component: (
          <Input className="rounded-md" prefix={<PercentageOutlined />} />
        ),
      },
      {
        className: "text-center",
        component: !create && (
          <Button
            type="primary"
            htmlType="submit"
            className="rounded-md"
            shape="round"
            loading={isLoading}
          >
            Save
          </Button>
        ),
      },
    ],
    [TAG_CATEGORIES, create],
  );
  const handleSave = async (tableInformation: string) => {
    const [filterTableInformation] = findMatches(regexTable, tableInformation);
    updateProduct({
      product: {
        _id: data._id,
        tableInformation: filterTableInformation,
      },
    });
  };
  return (
    <div className="mx-auto max-w-[83vw]">
      <Row>
        <Col span={12}>
          <div className="pr-20 pl-24">
            <Form
              form={form}
              name="productEdit"
              layout="vertical"
              onChange={onFormChangeHandler}
              onFinish={onFinish}
              initialValues={
                create
                  ? undefined
                  : {
                      name: data.name,
                      category: data.category,
                      brand: data.brand,
                      quantity: data.countInStock,
                      price: data.price,
                      discount: data.discount,
                    }
              }
              size="large"
            >
              {arrayFormFilter.map(renderForm)}
            </Form>
          </div>
        </Col>

        <Col span={12}>
          <div className="pr-20 pl-24">
            <h2 className="mb-5 text-lg font-bold">Product Specifications</h2>
            <SunEditor
              // getSunEditorInstance={getSunEditorInstance}
              defaultValue={data?.tableInformation || ""}
              setDefaultStyle="height:400px"
              setOptions={{
                buttonList: [["undo", "redo", "table", "save"]],
                callBackSave: (des) => {
                  handleSave(des);
                  // if (data.tableInformation !== des) {
                  //   handleSave(des);
                  // }
                },
              }}
            />
          </div>
        </Col>
      </Row>
    </div>
  );
};

export default FormProductEdit;
