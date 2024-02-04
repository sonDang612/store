import React from "react";

const Demo: React.FC<any> = ({ html }) => {
  return (
    <div
      className=" overflow-y-scroll p-3 !max-w-full !max-h-[70vh] text-base text-gray-600 unreset"
      // className=" overflow-y-scroll p-3 !max-w-full !max-h-[70vh] text-base text-gray-600 prose lg:prose-base mainDescription "
      dangerouslySetInnerHTML={{
        // __html: stateToHTML(editorState.getCurrentContent()),
        __html: html,
      }}
    />
  );
};

export default Demo;
