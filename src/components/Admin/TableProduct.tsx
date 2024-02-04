/* eslint-disable no-nested-ternary */
/* eslint-disable react/display-name */
import {
  BranchesOutlined,
  DeleteFilled,
  EditFilled,
  ThunderboltFilled,
} from "@ant-design/icons";
import {
  Button,
  Form,
  Input,
  message,
  Popconfirm,
  Select,
  Table,
  Tag,
  Tooltip,
} from "antd";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import React from "react";
import { useSelector } from "react-redux";
import { useMediaQuery } from "react-responsive";

import { useMounted } from "@/hook/useMounted";
import { PRODUCT_CATEGORY_COLOR, TAG_CATEGORIES } from "@/src/constant";
import { useListProductsAdmin } from "@/src/react-query/hooks/product/useListProductsAdmin";
import { useMutationDeleteProduct } from "@/src/react-query/hooks/product/useMutationDeleteProduct";
import { useMutationUpdateProduct } from "@/src/react-query/hooks/product/useMutationUpdateProduct";
import { AdminProductType } from "@/src/redux/reducers/adminProductReducer";
import { RootState } from "@/src/redux/store";
import { useActions } from "@/src/redux/useActions";
import isEmpty from "@/utils/is-empty";
import { isNumeric } from "@/utils/isNumeric";

import ImageFallBackImgTag from "../ImageFallBackImgTag";

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
    dataIndex === "category" ? (
      <Select size="small" showSearch>
        {TAG_CATEGORIES.map((category: any, _i: any) => {
          return (
            <Select.Option value={category} key={category}>
              <span className="text-xs"> {category}</span>
            </Select.Option>
          );
        })}
      </Select>
    ) : (
      <Input size="small" />
    );
  // const inputNode = <Input size="middle" className="text-xs" />;
  return (
    <td {...restProps}>
      {editing ? (
        dataIndex === "currentPrice" ? (
          <>
            <Form.Item
              name={dataIndex}
              style={{
                margin: 0,
              }}
              // rules={[{ required: true }]}
            >
              <Input size="small" placeholder="Price" />
            </Form.Item>
            <Form.Item
              name="discount"
              style={{
                margin: 0,
              }}
              // rules={[{ required: true }]}
            >
              <Input size="small" placeholder="Discount" />
            </Form.Item>
          </>
        ) : (
          <Form.Item
            name={dataIndex}
            style={{
              margin: 0,
            }}
            // rules={[{ required: true }]}
          >
            {inputNode}
          </Form.Item>
        )
      ) : (
        children
      )}
    </td>
  );
};
const TableProduct: React.FC<any> = () => {
  const { hasMounted } = useMounted();
  const { page, name, category, rating, showDeleted } = useSelector<
    RootState,
    AdminProductType["search"]
  >((state) => state.adminProduct.search);
  const editingKey = useSelector<RootState, AdminProductType["editingKey"]>(
    (state) => state.adminProduct.editingKey,
  );
  const actions = useActions();
  const isBigScreen = useMediaQuery({ query: "(min-width: 1550px)" });

  const router = useRouter();
  const [form] = Form.useForm();
  const { data, isLoading, isFetching } = useListProductsAdmin(
    { page, name, category, rating, showDeleted },
    router.isReady,
  );
  const { mutate: updateProduct, isLoading: isLoadingUpdateProduct } =
    useMutationUpdateProduct({ isAdmin: true, revalidate: true });
  const { mutate: deleteProduct, isLoading: isLoadingDeleteProduct } =
    useMutationDeleteProduct();

  const isEditing = (record: any) => record._id === editingKey;
  const edit = (record: any) => {
    form.setFieldsValue({
      category: record.category,
      brand: record.brand,
      currentPrice: +record.price,
      countInStock: +record.countInStock,
      discount: +record.discount,
    });
    actions.setAdminProductState({ editingKey: record._id });
  };
  const handleDeleteProduct = (product: any) => {
    deleteProduct({ product });
  };
  const save = (row: any) => {
    const { category, brand, countInStock, currentPrice, discount } =
      form.getFieldsValue();
    if (
      isEmpty(category) ||
      isEmpty(brand) ||
      isEmpty(countInStock) ||
      isEmpty(currentPrice)
    ) {
      return message.error("Please fill in all fields");
    }
    updateProduct({
      product: {
        _id: row._id,
        category,
        brand,
        countInStock: +countInStock,
        price: +currentPrice,
        discount: discount === "" ? 0 : discount,
      },
    });
  };

  const columns = [
    {
      title: "Product Id",
      dataIndex: "_id",
      render: (_id: any, row: any) => (
        <div
          style={{ width: isBigScreen ? "auto" : 62 }}
          // target="_blank"
          className=" text-[11px] font-semibold text-blue-500 underline cursor-pointer"
        >
          <Link href={`/product/${_id}?slug=${row.slug}`}>
            <a>{`#${_id}`}</a>
          </Link>
        </div>
      ),
    },
    {
      title: "Image",
      dataIndex: "image",
      width: "6%",
      render: (image: string[]) => {
        return (
          <ImageFallBackImgTag
            src={image.at(0)}
            alt={image.at(0)}
            width={50}
            height={50}
          />
        );
      },
    },

    {
      title: "Product name",
      dataIndex: "name",
      width: "10%",
      render: (name: any, row: any) => {
        return (
          <Tooltip
            placement="topLeft"
            title={name}
            color={PRODUCT_CATEGORY_COLOR[row.category]}
          >
            <h2
              style={{ color: row.active ? undefined : "red" }}
              className="max-w-[300px] text-sm font-medium truncate"
            >
              {name}
            </h2>
          </Tooltip>
        );
      },
    },
    {
      title: "Category",
      dataIndex: "category",

      editable: true,
      render: (categoryName: any) => {
        return (
          <Tag
            color={PRODUCT_CATEGORY_COLOR[categoryName]}
            className="capitalize"
          >
            {categoryName}
          </Tag>
        );
      },
    },

    {
      title: "Brand",
      dataIndex: "brand",
      editable: true,

      render: (brand: any) => {
        return <Tag className="capitalize">{brand}</Tag>;
      },
    },

    {
      title: "Rating",
      dataIndex: "averageRating",
      render: (averageRating: any) => {
        return <div className=" ml-1">{averageRating}</div>;
      },
    },
    {
      title: "Quantity",
      dataIndex: "countInStock",
      editable: true,
      render: (countInStock: any) => {
        return <div>{countInStock}</div>;
      },
    },
    {
      title: "Price",
      dataIndex: "currentPrice",
      editable: true,
      render: (currentPrice: any, row: any) => {
        const discount = row.discount > 0 ? row.discount : 0;
        return (
          <div className="relative">
            {discount > 0 ? (
              <Tag color="red" className=" text-sm font-medium capitalize">
                ${currentPrice}
              </Tag>
            ) : (
              <div className="font-medium">${row.price}</div>
            )}
            <div className=" absolute">
              {discount > 0 && (
                <span className=" mt-1 ml-1 text-xs text-center text-gray-600 line-through">
                  ${row.price}
                </span>
              )}
            </div>
          </div>
        );
      },
    },
    {
      title: "Operation",
      dataIndex: "operation",
      key: "operation",
      render: (_: any, record: any, index: any) => {
        const editable = isEditing(record);
        if (!record.active) {
          return (
            <Popconfirm
              title="Are you sure to restore this deleted product?"
              onConfirm={() => {
                updateProduct({
                  product: {
                    _id: record._id,
                    active: true,
                  },
                });
              }}
              okText="Sure"
              cancelText="No"
            >
              <Button
                type="ghost"
                size="small"
                icon={<BranchesOutlined style={{ color: "green" }} />}
                className=" text-xs"
              />
            </Popconfirm>
          );
        }
        return editable ? (
          <div className=" flex space-x-1">
            <Button
              type="link"
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
              onClick={() => actions.setAdminProductState({ editingKey: "" })}
            >
              Cancel
            </Button>
          </div>
        ) : (
          <div className=" flex space-x-2">
            <Button
              type="ghost"
              onClick={() => edit(record)}
              icon={<ThunderboltFilled style={{ color: "yellow" }} />}
              size="small"
              className=" text-xs"
            />{" "}
            <Link
              href={`/admin/products/${record._id}/edit`}
              passHref
              className=" z-20 text-xs"
            >
              <div className="px-1 rounded-sm border-[1.5px] border-gray-300 hover:border-[#1890ff] border-solid duration-500 cursor-pointer">
                <EditFilled style={{ color: "blue" }} />
              </div>
            </Link>
            <Popconfirm
              title="Sure to delete this product?"
              onConfirm={() => handleDeleteProduct(record)}
              okText="Yes"
              cancelText="No"
            >
              <Button
                type="ghost"
                size="small"
                icon={<DeleteFilled style={{ color: "red" }} />}
                className=" text-xs"
              />
            </Popconfirm>
          </div>
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

  const onFormChangeHandler = (e: any) => {
    const name = e.target.id.split("_")[1];
    const { value } = e.target;

    if (name === "countInStock") {
      if (/[^0-9]/g.test(e.target.value)) {
        // check neu ko trong khoang 0 toi 9
        form.setFieldValue(
          "countInStock",
          Number(value.replace(/[^0-9]/g, "")),
        );
      }
    }

    if (name === "currentPrice") {
      if (!isNumeric(e.target.value)) {
        // check neu ko trong khoang 0 toi 9
        form.setFieldValue(
          "currentPrice",
          value
            .toString()
            .replace(/[^.\d]/g, "")
            .replace(/^(\d*\.?)|(\d*)\.?/g, "$1$2"),
        );
      }
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
  return (
    <div>
      {hasMounted && (
        <Form form={form} name="productAdmin" onChange={onFormChangeHandler}>
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
            dataSource={data?.products || []}
            pagination={
              !isLoading && data?.products.length > 0
                ? {
                    defaultCurrent: 1,
                    total: data.totalProduct,
                    current: data.currentPage,
                    defaultPageSize: data.productPerPage,
                    showTotal: (total) => `Total ${total} products`,
                    pageSize: data.productPerPage,
                    pageSizeOptions: ["8"],
                    showSizeChanger: true,
                    showQuickJumper: true,
                    onChange: (newPage, pageSize) => {
                      actions.setSearchAdminProductState({ page: newPage });
                    },
                    position: ["topRight"],
                  }
                : {}
            }
          />
        </Form>
      )}
    </div>
  );
};

export default TableProduct;
