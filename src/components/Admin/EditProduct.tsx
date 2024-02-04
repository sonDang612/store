export {};
// import { EditorState, Modifier, convertToRaw, ContentState } from "draft-js";
// import dynamic from "next/dynamic";
// import { useEffect, useState } from "react";
// import draftToHtml from "draftjs-to-html";
// import htmlToDraft from "html-to-draftjs";
// // import ReactHtmlParser from "react-html-parser";

// const Editor = dynamic(
//    () => import("react-draft-wysiwyg").then((mod) => mod.Editor),
//    { ssr: false }
// );
// import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
// import { Button, message, Modal, Switch, Checkbox } from "antd";
// import axios from "axios";

// import { useMutationUpdateProduct } from "@/hook/product/useMutationUpdateProduct";
// import Demo from "./Demo";
// import { getBase64 } from "@/utils/getBase64";
// import { getImages } from "@/utils/getImages";
// import { BlockPicker } from "react-color";

// const ratio = 1.7777;
// // const blockRenderMap = DefaultDraftBlockRenderMap.set("p", {
// //    element: "p",
// // });
// //!!de day mot coi
// // ContentState.createFromBlockArray(
// //    convertFromHTML(rawJsText3, getSafeBodyFromHTML, blockRenderMap)
// // )

// //!align image
// // ContentState.createFromBlockArray(
// //    htmlToDraft(description, (nodeName, node) => {
// //       const textAlign = node.parentElement.style.textAlign;
// //       // console.log(nodeName, node.parentNode, textAlign);
// //       if (nodeName === "img") {
// //          return {
// //             type: "IMAGE",
// //             mutability: "MUTABLE",
// //             data: {
// //                ...node.style,
// //                src: node.src,
// //                alt: node.src,

// //                alignment: textAlign
// //                   ? textAlign === "left"
// //                      ? "center"
// //                      : textAlign
// //                   : "center",
// //                // alignment: textAlign,
// //                // ? textAlign === "none"
// //                //    ? "center"
// //                //    : textAlign
// //                // : "center",
// //             },
// //          };
// //       }
// //    })
// // )

// const EditProduct = ({
//    id,
//    handleCreateProduct,
//    reset,
//    description = "",
//    create = false,
// }) => {
//    const [isModalVisible, setIsModalVisible] = useState(false);
//    // const [fileList, setFileList] = useState([]);
//    const [show, setShow] = useState(true);
//    const [isCloud, setIsCloud] = useState(true);

//    const showModal = () => {
//       setIsModalVisible(true);
//    };

//    const handleOk = () => {
//       setIsModalVisible(false);
//    };

//    const handleCancel = () => {
//       setIsModalVisible(false);
//    };
//    // const [editorState, setEditorState] = useState(
//    //    EditorState.createWithContent(convertFromRaw(JSON.parse(rawJsText)))
//    // );
//    // console.log("truoc", description);
//    // console.log("sau", draftToHtml(htmlToDraft(description).contentBlocks));
//    const { mutate: updateProduct, isLoading } = useMutationUpdateProduct();

//    const [editorState, setEditorState] = useState(
//       create
//          ? EditorState.createEmpty()
//          : EditorState.createWithContent(
//               ContentState.createFromBlockArray(htmlToDraft(description))
//            )
//    );

//    // const [editorState, setEditorState] = useState(EditorState.createEmpty());

//    const onEditorStateChange = (editorState2) => {
//       setEditorState(editorState2);
//    };

//    async function uploadImageCallBack(file) {
//       // console.log(file);
//       // setFileList([...fileList, file]);
//       return Promise.resolve({ data: { link: await getBase64(file) } });
//       // return new Promise((resolve, reject) => {
//       // try {
//       //    const url = `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/upload`;
//       //    const data = new FormData();
//       //    data.append("file", file);
//       //    data.append(
//       //       "upload_preset",
//       //       process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET
//       //    );
//       //    axios.post(url, data).then(({ data }) => {
//       //       // resolve(data.url);
//       //       resolve({ data: { link: data.url } });
//       //    });
//       // } catch (error) {
//       //    message.error(JSON.stringify(error));
//       //    reject(error);
//       // }
//       // });
//    }
//    const onTabHandle = (e) => {
//       const tabCharacter = "\u00A0\u00A0\u00A0\u00A0";
//       e.preventDefault();

//       let currentState = editorState;
//       let newContentState = Modifier.replaceText(
//          currentState.getCurrentContent(),
//          currentState.getSelection(),
//          tabCharacter
//       );
//       setEditorState(
//          EditorState.push(currentState, newContentState, "insert-characters")
//       );
//    };
//    const embedVideoCallBack = (link) => {
//       if (link.indexOf("youtube") >= 0) {
//          link = link.replace("watch?v=", "embed/");
//          link = link.replace("/watch/", "/embed/");
//          link = link.replace("youtu.be/", "youtube.com/embed/");
//       }
//       return link;
//    };
//    const handleSave = async () => {
//       let dataSave = draftToHtml(convertToRaw(editorState.getCurrentContent()));
//       if (isCloud) {
//          const imageUpload = getImages(dataSave);

//          // eslint-disable-next-line no-unused-vars
//          const newArrayImage = await Promise.all(
//             imageUpload.map(async (urlBase64) => {
//                const formData = new FormData();
//                formData.append("file", urlBase64);
//                formData.append(
//                   "upload_preset",
//                   process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET
//                );

//                try {
//                   const { data } = await axios.post(
//                      `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/upload`,
//                      formData
//                   );
//                   dataSave = dataSave.replace(urlBase64, data.url);

//                   return data.url;
//                } catch (error) {
//                   console.log(error);

//                   message.error(JSON.stringify(error));
//                }
//             })
//          );
//          // console.log(newArrayImage);
//          // console.log(dataSave);
//       }
//       if (!create) {
//          updateProduct({
//             product: {
//                _id: id,
//                description: convertImages(dataSave),
//             },
//          });
//       }
//    };

//    const convertImages = (htmlText) => {
//       // return htmlText.replaceAll(
//       //    'style="text-align:none;"',
//       //    'style="text-align:center;"'
//       // );
//       // return htmlText;
//       return htmlText.replace(/<img\s+[^>]*src="([^"]*)"[^>]*>/g, (match) => {
//          // console.log(match);
//          return `<div  style="text-align:center;" >${match}</div>`;
//       });
//    };

//    // function getImages(string) {
//    //    const imgRex = /<img.*?src="(.*?)"[^>]+>/g;
//    //    const images = [];
//    //    let img;
//    //    while ((img = imgRex.exec(string))) {
//    //       images.push(img[1]);
//    //    }
//    //    return images;
//    // }
//    useEffect(() => {
//       if (reset?.clear) {
//          setEditorState(EditorState.createEmpty());
//          console.count("EditorState");
//       }
//    }, [reset]);
//    return (
//       <div className=" py-2 px-6 modalDraft">
//          <div className="flex justify-between items-center">
//             <h2 className=" py-3 text-lg">Description </h2>
//             <div className=" space-x-4">
//                <Checkbox
//                   onChange={() => setIsCloud((old) => !old)}
//                   checked={isCloud}
//                >
//                   Upload images to the cloud
//                </Checkbox>
//                <Checkbox onChange={() => setShow((old) => !old)} checked={show}>
//                   Expand
//                </Checkbox>
//             </div>
//          </div>
//          <div
//             className="overflow-y-scroll w-full border-2 border-gray-200 border-solid"
//             style={{ height: show ? undefined : 300 }}
//          >
//             <Editor
//                wrapperClassName="demo-wrapper"
//                editorClassName="demo-editor p-3 min-h-[300px]"
//                editorState={editorState}
//                onEditorStateChange={onEditorStateChange}
//                onTab={onTabHandle}
//                toolbar={{
//                   options: [
//                      "inline",
//                      "image",
//                      "embedded",
//                      "link",
//                      "blockType",
//                      "textAlign",
//                      "fontSize",
//                      "fontFamily",
//                      "list",

//                      "colorPicker",
//                      "emoji",
//                      "remove",
//                      "history",
//                   ],
//                   inline: {
//                      inDropdown: true,
//                   },
//                   textAlign: {
//                      inDropdown: true,
//                   },
//                   list: {
//                      inDropdown: true,
//                   },
//                   link: {
//                      inDropdown: true,
//                   },
//                   // inline: {
//                   //    visible: true,
//                   //    inDropdown: false,
//                   //    bold: { visible: true },
//                   //    italic: { visible: true },
//                   //    underline: { visible: true },
//                   //    strikeThrough: { visible: true },
//                   //    monospace: { visible: false },
//                   // },
//                   image: {
//                      urlEnabled: true,
//                      uploadEnabled: true,
//                      uploadCallback: uploadImageCallBack,
//                      previewImage: true,
//                      alignmentEnabled: false,
//                      alt: { present: true, mandatory: false },
//                      // defaultSize: {
//                      //    height: "500px",
//                      //    width: "500px",
//                      // },
//                      inputAccept:
//                         "image/gif,image/jpeg,image/jpg,image/png,image/svg",
//                   },

//                   embedded: {
//                      embedCallback: embedVideoCallBack,

//                      defaultSize: {
//                         height: "478px",
//                         width: "850px",
//                         // height: "394px",
//                         // width: "700px",
//                         // height: "315px",
//                         // width: "560px",
//                      },
//                   },
//                }}
//             />
//          </div>
//          <div className=" flex justify-center items-center py-4 ml-auto w-[55%]">
//             <Button
//                // size="small"
//                type="dashed"
//                shape="round"
//                onClick={showModal}
//                danger
//             >
//                See demo
//             </Button>
//             <div className="flex-1 text-right">
//                {!create ? (
//                   <Button
//                      type="primary"
//                      shape="round"
//                      onClick={handleSave}
//                      loading={isLoading}
//                      // className="ml-auto"
//                   >
//                      Save Description
//                   </Button>
//                ) : (
//                   <Button
//                      type="primary"
//                      shape="round"
//                      onClick={() =>
//                         handleCreateProduct(
//                            draftToHtml(
//                               convertToRaw(editorState.getCurrentContent())
//                            ),
//                            isCloud
//                         )
//                      }
//                      // loading={isLoading}
//                      // className="ml-auto"
//                   >
//                      Create Product
//                   </Button>
//                )}
//             </div>
//          </div>
//          <Modal
//             title="Preview Description"
//             visible={isModalVisible}
//             onOk={handleOk}
//             onCancel={handleCancel}
//             maskClosable={false}
//             className=" z-50 !w-[1000px]"
//             centered
//          >
//             <Demo
//                html={convertImages(
//                   draftToHtml(convertToRaw(editorState.getCurrentContent()))
//                )}
//             />
//          </Modal>
//          {/* <div
//             dangerouslySetInnerHTML={{
//                __html: draftToHtml(
//                   convertToRaw(editorState.getCurrentContent() )
//                ),
//             }}
//          /> */}
//          {/* <textarea
//             className="w-full h-72"
//             disabled
//             value={convertImages(
//                draftToHtml(convertToRaw(editorState.getCurrentContent()))
//             )}
//          /> */}
//          {/* <div className="mt-52 w-full mainDescription">
//             <textarea
//                className="w-full h-72"
//                disabled
//                value={convertImages(
//                   draftToHtml(convertToRaw(editorState.getCurrentContent()))
//                )}
//             />

//             <div className=" max-w-full prose lg:prose-base">
//                {ReactHtmlParser(
//                   convertImages(
//                      draftToHtml(convertToRaw(editorState.getCurrentContent()))
//                   )
//                )}
//             </div>
//          </div> */}
//       </div>
//    );
// };

// export default EditProduct;
