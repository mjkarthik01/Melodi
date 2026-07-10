import React from "react";
import { Navigate, useParams } from "react-router-dom";

const ProductSharePage = () => {
  const { slug } = useParams();

  if (!slug) {
    return <Navigate to="/" replace />;
  }

  return <Navigate to={`/product/${slug}`} replace />;
};

export default ProductSharePage;
