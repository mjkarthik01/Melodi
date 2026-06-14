import { Spin } from "antd";
import React from "react";

const Loader = ({ size = "large", className = "" }) => {
  return (
    <div className={`loader-wrap loader--${size} ${className}`.trim()}>
      <Spin size={size} />
    </div>
  );
};

export default Loader;
