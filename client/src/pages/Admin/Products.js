import { Card, Col, Row, Pagination } from "antd";
import axios from "axios";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Link } from "react-router-dom";
import AdminMenu from "../../components/Layout/AdminMenu";
import ProductCard from "../../components/UI/ProductCard";

const Products = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(0);
  const limit = 12;

  const getAllProducts = async (currentPage = 1) => {
    try {
      setLoading(true);

      const { data } = await axios.get(
        `${process.env.REACT_APP_API}/api/v1/product/get-product?page=${currentPage}&limit=${limit}`,
      );

      setProducts(data?.products || []);
      setPages(data?.pages || 0);
      setPage(currentPage);
    } catch (error) {
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    getAllProducts(1);
  }, []);

  return (
    <div className="container-fluid">
      <Row gutter={[16, 16]}>
        <Col xs={24} md={6}>
          <AdminMenu />
        </Col>

        <Col xs={24} md={18} className="dashboard-content">
          <Card title="🛍️ All Products" className="dashboard-cards">
            <div className="product-grid">
              {loading
                ? Array.from({ length: 8 }).map((_, i) => (
                    <ProductCard key={i} loading={true} />
                  ))
                : products.map((product) => (
                    <Link
                      key={product._id}
                      to={`/dashboard/admin/product/${product.slug}`}
                    >
                      <ProductCard product={product} loading={false} />
                    </Link>
                  ))}
            </div>

            {/* Pagination */}
            <div style={{ marginTop: 20, textAlign: "center" }}>
              <Pagination
                current={page}
                pageSize={limit}
                total={pages * limit}
                onChange={(p) => getAllProducts(p)}
              />
            </div>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Products;
