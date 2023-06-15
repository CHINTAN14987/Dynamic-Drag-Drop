import React, { FC } from "react";

import "./CardDetails.css";
interface IProps {
  data: any;
}
const index: FC<IProps> = (props) => {
  const { data } = props;

  const bgColor = ["yellow", "green", "red", "blue"];

  return (
    <div>
      <div
        className="bg-title"
        style={{
          background: bgColor[Math.floor(Math.random() * 3)],
        }}
      >
        <h3> {data.title}</h3>
        <h4>In {data.key} List</h4>
      </div>
      <div>
        <h3>Details</h3>
        <div>
          <span>Start Date</span>
          <h3>
            {data?.label?.startDate &&
              new Date(data?.label?.startDate).toLocaleDateString("en-GB", {
                day: "numeric",
                month: "long",
              })}
          </h3>
        </div>
      </div>
    </div>
  );
};

export default index;
