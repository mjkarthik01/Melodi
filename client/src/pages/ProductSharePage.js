import React, { useEffect, useState } from "react";
import { Helmet } from "react-helmet";
import { useParams } from "react-router-dom";
import axios from "axios";
import Loader from "../components/UI/Loader";

const ProductSharePage = () => {
  const { slug } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const { data } = await axios.get(
          `${process.env.REACT_APP_API}/api/v1/product/get-product/${slug}`,
        );

        setProduct(data?.product || null);
      } catch (error) {
        console.error("Failed to fetch shared product", error);
      } finally {
        setLoading(false);
      }
    };

    if (slug) {
      fetchProduct();
    }
  }, [slug]);

  if (loading) {
    return (
      <div className="container section">
        <Loader />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="container section">
        <h2>Product not found</h2>
      </div>
    );
  }

  const imageUrl = `${process.env.REACT_APP_API}/api/v1/product/product-photo/${product._id}`;
  const shareUrl = `${window.location.origin}/share/product/${product.slug}`;
  const description = `Price: ₹${product.price}\nColor: ${product.colors?.[0] || "Not selected"}\n${product.description?.substring(0, 120) || "Premium product"}`;

  return (
    <>
      <Helmet>
        <title>{product.name}</title>
        <meta property="og:title" content={product.name} />
        <meta property="og:description" content={description} />
        <meta property="og:image" content={imageUrl} />
        <meta property="og:url" content={shareUrl} />
        <meta property="og:type" content="product" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={product.name} />
        <meta name="twitter:description" content={description} />
        <meta name="twitter:image" content={imageUrl} />
      </Helmet>

      <div className="container section">
        <div className="row align-items-center">
          <div className="col-md-6">
            <img
              src={imageUrl}
              alt={product.name}
              style={{ width: "100%", borderRadius: "12px" }}
            />
          </div>
          <div className="col-md-6">
            <h2>{product.name}</h2>
            <p className="text-muted">{product.description}</p>
            <p>
              <strong>Price:</strong> ₹{product.price}
            </p>
            <p>
              <strong>Color:</strong> {product.colors?.[0] || "Not selected"}
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default ProductSharePage;
