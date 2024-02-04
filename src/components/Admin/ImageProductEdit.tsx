/* eslint-disable @next/next/no-img-element */
import { PlusOutlined, ScissorOutlined } from "@ant-design/icons";
import { Button, Input, message, Modal, Switch, Tooltip, Upload } from "antd";
import { UploadFile } from "antd/lib/upload";
import ImgCrop from "antd-img-crop";
import type { TargetType } from "dnd-core";
import update from "immutability-helper";
import isImage from "is-image";
import React, { useCallback, useEffect, useRef } from "react";
import { DndProvider, useDrag, useDrop } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { useSelector } from "react-redux";

import { useMutationUpdateProduct } from "@/src/react-query/hooks/product/useMutationUpdateProduct";
import { AdminCreateEditProductType } from "@/src/redux/reducers/adminCreateEditProductReducer";
import { RootState } from "@/src/redux/store";
import { useActions } from "@/src/redux/useActions";
import { checkValidImage } from "@/utils/checkValidImage";
import { getBase64 } from "@/utils/getBase64";
import notEmpty from "@/utils/not-empty";
import { uploadImageToCloudinary } from "@/utils/uploadImageToCloudinary";

const type: TargetType = "DragableUploadList";
const DragableUploadListItem: React.FC<any> = ({
  originNode,
  moveRow,
  file,
  fileList,
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const index = fileList.indexOf(file);
  const [{ isOver, dropClassName }, drop] = useDrop({
    accept: type,
    collect: (monitor: any) => {
      const { index: dragIndex } = monitor.getItem() || {};
      if (dragIndex === index) {
        return {};
      }
      return {
        isOver: monitor.isOver(),
        dropClassName:
          dragIndex < index ? " drop-over-downward" : " drop-over-upward",
      };
    },
    drop: (item: any) => {
      moveRow(item.index, index);
    },
  });
  const [, drag] = useDrag({
    type,
    item: { index },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });
  drop(drag(ref));
  const errorNode = (
    <Tooltip title="Upload Error">{originNode.props.children}</Tooltip>
  );
  return (
    <div
      ref={ref}
      className={`ant-upload-draggable-list-item ${
        isOver ? dropClassName : ""
      }`}
      style={{ cursor: "move" }}
    >
      {file.status === "error" ? errorNode : originNode}
    </div>
  );
};

const ImageProductEdit: React.FC<{
  image?: any[];
  id?: string;
  create?: boolean;
}> = ({ image, id, create = false }) => {
  const {
    previewVisible,
    previewImage,
    previewTitle,
    fileList,
    cutImage,
    link,
  } = useSelector<RootState, AdminCreateEditProductType>(
    (state) => state.adminCreateEditProduct,
  );
  const actions = useActions();

  const { mutate: updateProduct, isLoading } = useMutationUpdateProduct({
    isAdmin: false,
    revalidate: true,
  });

  const handleCancel = () => {
    actions.setAdminCreateEditProductState({ previewVisible: false });
  };

  const handlePreview = async (file: any) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj);
    }
    actions.setAdminCreateEditProductState({
      previewImage: file.url || file.preview,
      previewVisible: true,
      previewTitle:
        file.name || file.url.substring(file.url.lastIndexOf("/") + 1),
    });
  };
  const handleRemove = (file: UploadFile<any>) => {
    actions.setAdminCreateEditProductState({
      fileList: fileList.filter(({ uid }) => uid !== file.uid),
    });
  };
  const handleCustomRequest = async ({ file }: any) => {
    const url = await getBase64(file);
    file.preview = url;
    actions.setAdminCreateEditProductState({
      fileList: [
        ...fileList,

        {
          uid: file.uid,
          name: file.name,
          status: "done",
          url,
          new: true,
        },
      ],
    });
  };

  const handleUploadLink = () => {
    const valid = isImage(link);

    if (!valid) return message.error("Invalid url for image");
    const newFileList = [
      ...fileList,
      {
        uid: `${link}${Date.now().toString()}`,
        name: link,
        status: "done",
        url: link,
      },
    ];
    actions.setAdminCreateEditProductState({ fileList: newFileList });
  };

  const uploadButton = (
    <div>
      <PlusOutlined />
      <div style={{ marginTop: 8 }}>Upload</div>
    </div>
  );

  const moveRow = useCallback(
    (dragIndex: any, hoverIndex: any) => {
      const dragRow = fileList[dragIndex];
      actions.setAdminCreateEditProductState({
        fileList: update(fileList, {
          $splice: [
            [dragIndex, 1],
            [hoverIndex, 0, dragRow],
          ],
        }),
      });
    },
    [actions, fileList],
  );
  useEffect(() => {
    if (notEmpty(image)) {
      actions.setAdminCreateEditProductState({
        fileList: image.map((img: string) => {
          return {
            uid: img,
            name: img,
            status: "done",
            url: img,
          };
        }),
      });
    }
  }, [actions, image]);
  const handleSaveImage = async () => {
    const newArrayImage = await uploadImageToCloudinary(fileList);

    if (!create) {
      updateProduct({
        product: {
          _id: id,
          image: newArrayImage,
        },
      });
    }
  };
  return (
    <div className="uploadProduct">
      <div className=" ">
        <div className=" ml-28">
          <div className=" flex mb-5 space-x-5 text-lg">
            <span> Upload image</span>{" "}
            {!create && (
              <Button
                type="dashed"
                onClick={() => {
                  actions.setAdminCreateEditProductState({
                    fileList: image.map((img: string) => {
                      return {
                        uid: img,
                        name: img,
                        status: "done",
                        url: img,
                      };
                    }),
                  });
                }}
              >
                Reset
              </Button>
            )}
            <div className="flex w-1/2">
              <Input
                addonBefore="URL"
                value={link}
                onChange={(e) =>
                  actions.setAdminCreateEditProductState({
                    link: e.target.value,
                  })
                }
                allowClear
                placeholder="Enter image url"
              />
              <Button type="primary" onClick={handleUploadLink}>
                Add image
              </Button>
            </div>
          </div>
          <DndProvider backend={HTML5Backend}>
            {cutImage ? (
              <ImgCrop rotate minZoom={0} beforeCrop={checkValidImage}>
                <Upload
                  listType="picture-card"
                  fileList={fileList}
                  onPreview={handlePreview}
                  itemRender={(originNode, file, currFileList) => (
                    <DragableUploadListItem
                      originNode={originNode}
                      file={file}
                      fileList={currFileList}
                      moveRow={moveRow}
                    />
                  )}
                  onRemove={handleRemove}
                  beforeUpload={checkValidImage}
                  customRequest={handleCustomRequest}
                >
                  {fileList.length >= 8 ? null : uploadButton}
                </Upload>
              </ImgCrop>
            ) : (
              <Upload
                listType="picture-card"
                fileList={fileList}
                onPreview={handlePreview}
                onRemove={handleRemove}
                beforeUpload={checkValidImage}
                customRequest={handleCustomRequest}
                itemRender={(originNode, file, currFileList) => (
                  <DragableUploadListItem
                    originNode={originNode}
                    file={file}
                    fileList={currFileList}
                    moveRow={moveRow}
                  />
                )}
                accept="image/*"
              >
                {fileList.length >= 8 ? null : uploadButton}
              </Upload>
            )}
          </DndProvider>
        </div>
        <div className=" flex justify-center items-center py-4 space-x-3 text-lg">
          <Switch
            checked={cutImage}
            checkedChildren={<ScissorOutlined />}
            onChange={() => {
              actions.setAdminCreateEditProductState({ cutImage: !cutImage });
            }}
          />

          {!create && (
            <Button
              type="primary"
              className="text-center"
              shape="round"
              loading={isLoading}
              onClick={handleSaveImage}
            >
              Save Image
            </Button>
          )}
        </div>
      </div>
      <Modal
        open={previewVisible}
        title={previewTitle}
        footer={null}
        onCancel={handleCancel}
      >
        <img alt="example" style={{ width: "100%" }} src={previewImage} />
      </Modal>
    </div>
  );
};

export default ImageProductEdit;
