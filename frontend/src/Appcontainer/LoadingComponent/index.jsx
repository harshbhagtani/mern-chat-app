import { Spin } from "antd";
import React from "react";

const Loading = ({ text = "Loading" }) => {
  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        justifyContent: "center",
        alignItems: "center"
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center"
        }}
      >
        <Spin></Spin>
        <p>{text}</p>
      </div>
    </div>
  );
};

export default Loading;
