import {
  Button,
  Divider,
  Input,
  message,
  Modal,
  Popconfirm,
  Rate,
  Table,
  Tag,
  Typography,
} from "antd";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import { useSelector } from "react-redux";
import { useMediaQuery } from "react-responsive";

import { REVIEW_STATUS } from "@/src/constant";
import { useListReview } from "@/src/react-query/hooks/review/useListReview";
import { useMutationHideReview } from "@/src/react-query/hooks/review/useMutationHideReview";
import { useMutationReplyReview } from "@/src/react-query/hooks/review/useMutationReplyReview";
import { AdminReviewType } from "@/src/redux/reducers/adminReviewReducer";
import { RootState } from "@/src/redux/store";
import { useActions } from "@/src/redux/useActions";
import notEmpty from "@/utils/not-empty";

import ImageFallBackImgTag from "../ImageFallBackImgTag";

const TableReview: React.FC<any> = () => {
  const isBigScreen = useMediaQuery({ query: "(min-width: 1550px)" });
  const actions = useActions();
  const { responseText, review, isModalVisible, search } = useSelector<
    RootState,
    AdminReviewType
  >((state) => state.adminReview);

  const { mutate: replyReview, isLoading: isLoadingReplyReview } =
    useMutationReplyReview(null, null, null, null, null, true);
  const { mutate: hideReview } = useMutationHideReview({
    page: search.page,
    rating: search.selectedRating,
    search: search.search,
  });
  const showModal = (record: any) => {
    actions.setAdminReviewState({
      isModalVisible: true,
      review: {
        userName: record.user.name,
        id: record._id,
        productName: record.product.name,
        image: record.product.image,
        comment: record.comment,
        rating: record.rating,
      },
    });
  };

  const handleOk = () => {
    if (!responseText) return message.info("You didn't write anything");
    replyReview({
      id: review.id,
      comment: responseText,
      isAdmin: true,
    });
  };

  const handleCancel = () => {
    actions.hideModalReviewAdmin();
  };
  const { data, isLoading, isFetching } = useListReview({
    page: search.page,
    rating: search.selectedRating,
    search: search.search,
  });
  const columns: any = [
    {
      title: "Review Id",
      dataIndex: "_id",
      fixed: "left",
      render: (_id: any, row: any) => (
        <div
          style={{ width: isBigScreen ? "auto" : 62 }}
          className=" text-[11px] font-semibold text-blue-500 underline"
        >
          {`#${_id}`}
        </div>
      ),
      width: "100px",
    },
    {
      title: "Product",
      dataIndex: "product",
      width: "340px",
      fixed: "left",
      render: (product: any) => {
        return (
          <div className=" flex">
            <div style={{ flex: "0 0 60px" }}>
              <ImageFallBackImgTag
                src={product.image}
                alt={product.image}
                width={50}
                height={50}
              />
            </div>
            <div>
              <h2 className=" mt-1 text-xs imageProductReview">
                {product.name}
              </h2>
              <>
                <Link
                  passHref
                  href={`/product/${product._id}?slug=${product.slug}`}
                >
                  <a target="_blank">
                    <Typography.Paragraph
                      copyable
                      className="mt-2 text-xs text-blue-500 !inline-block imageProductReview"
                    >
                      {product._id}
                    </Typography.Paragraph>
                  </a>
                </Link>
              </>
            </div>
          </div>
        );
      },
    },

    {
      title: "Rating",
      dataIndex: "rating",

      fixed: "left",
      width: "140px",
      render: (rating: any) => {
        return (
          <div>
            <h2>
              {" "}
              <Rate
                allowHalf
                value={rating}
                disabled
                style={{ fontSize: 14 }}
              />
            </h2>
            <h4 className="mt-1 text-xs font-medium text-gray-600">{`${rating}/5`}</h4>
          </div>
        );
      },
    },
    {
      title: "Content",
      dataIndex: "comment",

      render: (comment: any, row: any) => {
        return (
          <div className="text-xs">
            {" "}
            <h2 className="mb-1 text-sm font-medium">
              {REVIEW_STATUS[row.rating - 1]}
            </h2>
            <p>{comment}</p>
          </div>
        );
      },
    },

    {
      title: "Reviewer",
      dataIndex: "user",

      render: (user: any) => {
        return <h2 className="text-xs">{user.name}</h2>;
      },
    },

    {
      title: "Received",
      dataIndex: "possessed",
      render: (possessed: any) => {
        return (
          <Tag color={possessed ? "green" : "red"}>
            {possessed ? "Ok" : "Not yet"}
          </Tag>
        );
      },
      width: "80px",
    },

    {
      title: "Operation",
      dataIndex: "operation",
      key: "operation",
      fixed: "right",
      width: "120px",
      render: (_: any, record: any, index: any) => {
        return (
          <div className=" flex items-center space-x-1">
            <Button
              type="link"
              onClick={() => showModal(record)}
              size="small"
              className="text-xs"
            >
              Reply
            </Button>
            <Divider type="vertical" className="!m-0" />
            <Popconfirm
              title={
                record.hide
                  ? "Sure to unhide this review?"
                  : '"Sure to hide this review?"'
              }
              onConfirm={() => hideReview(record._id)}
              okText="Sure"
              cancelText="No"
            >
              <Button
                type="link"
                size="small"
                danger={record.hide}
                className=" text-xs"
              >
                {record.hide ? "Unhide" : "Hide"}
              </Button>
            </Popconfirm>
          </div>
        );
      },
    },
  ];
  return (
    <div>
      <Modal
        title={
          <div className=" pr-2 truncate">
            Reply Review <Divider type="vertical" />
            <span className=" text-gray-600">{review.userName}</span>
          </div>
        }
        okText="Reply"
        maskClosable={false}
        confirmLoading={isLoadingReplyReview}
        open={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        {notEmpty(review) && (
          <div>
            <div className=" flex">
              <div style={{ flex: "0 0 60px" }}>
                <Image
                  src={review.image}
                  alt={review.image}
                  width={50}
                  height={50}
                />
              </div>
              <div>
                <h2 className=" mt-1 text-xs imageProductReview">
                  {review.productName}
                </h2>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="-mt-1">
                <Rate
                  allowHalf
                  value={review.rating}
                  disabled
                  style={{ fontSize: 17 }}
                />
              </div>
              <span className="text-base font-medium">
                {REVIEW_STATUS.at(review.rating - 1)}
              </span>
            </div>

            <p className=" mt-3 text-xs">{review.comment}</p>
            <Divider className="" />
            <div className=" mt-2">
              <h4 className="my-2 font-medium">Your Reply</h4>
              <Input.TextArea
                rows={4}
                value={responseText}
                onChange={(e) =>
                  actions.setAdminReviewState({ responseText: e.target.value })
                }
                className="rounded-md"
              />
            </div>
          </div>
        )}
      </Modal>
      <Table
        bordered
        rowKey="_id"
        loading={isLoading || isFetching}
        columns={columns}
        dataSource={data?.reviews || []}
        pagination={
          !isLoading && data?.reviews.length > 0
            ? {
                defaultCurrent: 1,
                total: data.totalReview,
                current: data.currentPage,
                defaultPageSize: data.reviewPerPage,
                showTotal: (total) => `Total ${total} reviews`,
                pageSize: data.reviewPerPage,
                pageSizeOptions: ["8"],
                showSizeChanger: true,
                showQuickJumper: true,
                onChange: (newPage, pageSize) => {
                  actions.setSearchAdminReviewState({ page: newPage });
                },
                position: ["topRight"],
              }
            : {}
        }
      />
    </div>
  );
};

export default TableReview;
