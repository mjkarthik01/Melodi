import React from "react";
import { Link } from "react-router-dom";

const EmptyState = ({ title, description, cta, to }) => {
  return (
    <div className="empty-state">
      <div className="empty-state__content">
        <p className="eyebrow">Nothing here yet</p>
        <h3>{title}</h3>
        <p>{description}</p>
        {cta && (
          <Link to={to || "/"} className="btn btn-primary empty-state__button">
            {cta}
          </Link>
        )}
      </div>
    </div>
  );
};

export default EmptyState;
