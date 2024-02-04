import { Tag } from "antd";
import { useRouter } from "next/router";
import React from "react";

const TagFilter: React.FC<any> = ({ handleFilter }) => {
  const router = useRouter();
  const filterName = (key: string, originalName: string) => {
    // const name = originalName.replace(/[^\w\s^,]/gi, "");
    const name = originalName.trim();

    return `${key} : ${name.replace(",", " - ")}`;
  };
  return (
    <div>
      {Object.entries(router.query)
        .filter(([key, _value]) => !["page", "category", "sort"].includes(key))
        .map(([key, value]) => {
          return (
            <Tag
              closable
              className="rounded-md"
              key={key}
              onClose={() => handleFilter(key, null)}
            >
              {filterName(key, value as string)}
            </Tag>
          );
        })}
    </div>
  );
};

export default TagFilter;
