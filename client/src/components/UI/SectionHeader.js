import React from "react";

const SectionHeader = ({ title, subtitle, children }) => {
  return (
    <div className="section-header">
      <div>
        <p className="eyebrow">{subtitle}</p>
        <h2>{title}</h2>
      </div>
      {children && <div className="section-header__actions">{children}</div>}
    </div>
  );
};

export default SectionHeader;
