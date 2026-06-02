import React, { useEffect, useState } from "react";
import Layout from "../components/Layout/Layout";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";

const ProductDetails = () => {
  const params = useParams();
  const [product, setProduct] = useState({});
  const [relatedProducts, setRelatedProducts] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    if (params?.slug) getProduct();
  }, [params?.slug]);
  const getProduct = async () => {
    try {
      const { data } = await axios.get(
        `${process.env.REACT_APP_API}/api/v1/product/get-product/${params.slug}`,
      );
      setProduct(data?.product);
      getSimilarProduct(data?.product._id, data?.product.category._id);
    } catch (error) {}
  };

  const getSimilarProduct = async (pid, cid) => {
    try {
      const { data } = await axios.get(
        `${process.env.REACT_APP_API}/api/v1/product/related-product/${pid}/${cid}`,
      );
      setRelatedProducts(data?.products);
    } catch (error) {}
  };

  return (
    <Layout>
      <div className="container">
        <div className="row">
          <div className="col-md-6">
            <img
              className="product-img"
              src={`${process.env.REACT_APP_API}/api/v1/product/product-photo/${product._id}`}
              alt={product.name}
            />
          </div>
          <div className="col-md-6">
            <h1>Product Details</h1>
            <h6>Name :{product.name}</h6>
            <h6>Description :{product.description}</h6>
            <h6>Price :{product.price}</h6>
            <h6>Category:{product.category?.name}</h6>
            <h6>Shipping: {product.shipping ? "Yes" : "No"}</h6>
            <button className="btn btn-secondary ms-1">ADD TO CART</button>
          </div>
        </div>
      </div>
      <hr />
      {relatedProducts.length > 1 && (
        <div className="container">
          <h1>Similar Products</h1>
          <div className="d-flex flex-wrap">
            {relatedProducts?.map((p) => (
              <div className="card m-3" style={{ width: "18rem" }} key={p._id}>
                <img
                  className="card-img-top"
                  src={`${process.env.REACT_APP_API}/api/v1/product/product-photo/${p._id}`}
                  alt={p.name}
                />
                <div className="card-body">
                  <h5 className="card-title">{p.name}</h5>
                  <p className="card-text">{p.description.substring(0, 30)}</p>
                  <p className="card-text">$ {p.price}</p>
                  <button
                    className="btn btn-primary ms-1"
                    onClick={() => navigate(`/product/${p.slug}`)}
                  >
                    More Details
                  </button>
                  <button className="btn btn-secondary ms-1">
                    ADD TO CART
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </Layout>
  );
};

export default ProductDetails;
