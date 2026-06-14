import React from "react";
import { Link } from "react-router-dom";

const PageNotFound = () => {
  return (
    <section className="container section section--centered page-notfound">
      <div className="page-notfound__panel">
        <span className="page-notfound__code">404</span>
        <h1>Page Not Found</h1>
        <p>The page you are looking for may have moved or no longer exists.</p>
        <Link to="/" className="btn btn-primary page-notfound__button">
          Return to Home
        </Link>
      </div>
    </section>
  );
};

export default PageNotFound;
