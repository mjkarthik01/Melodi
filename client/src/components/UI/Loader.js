import React from "react";

const Loader = ({ size = "large", className = "" }) => {
  return (
    <div className={`loader-wrap loader--${size} ${className}`.trim()}>
      <div className="loader" aria-hidden="true" />
    </div>
  );
};

export default Loader;
