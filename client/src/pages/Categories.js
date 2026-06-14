import useCategory from "../hooks/useCategory";
import { Link } from "react-router-dom";
import { Card, Row, Col, Skeleton } from "antd";
import { useState } from "react";

const { Meta } = Card;

const CategoryCard = ({ category }) => {
  const [imgLoaded, setImgLoaded] = useState(false);

  return (
    <Link to={`/category/${category.slug}`}>
      <Card
        hoverable
        className="category-card"
        cover={
          <div
            className="card-image-wrapper"
            style={{ position: "relative", height: 160 }}
          >
            {!imgLoaded && <div className="category-image-skeleton" />}

            <img
              alt={category.name}
              src={`${process.env.REACT_APP_API}/api/v1/category/category-photo/${category._id}`}
              onLoad={() => setImgLoaded(true)}
              onError={() => setImgLoaded(true)}
              className={`category-image ${imgLoaded ? "show" : ""}`}
            />
          </div>
        }
      >
        <Meta
          title={category.name}
          description={`Explore ${category.name} products`}
        />
      </Card>
    </Link>
  );
};

const Categories = () => {
  const [categories, loading] = useCategory();

  return (
    <div className="container py-4">
      <h1 className="text-center mb-5">All Categories</h1>

      {loading ? (
        <Row gutter={[24, 24]}>
          {Array.from({ length: 8 }).map((_, i) => (
            <Col xs={24} sm={12} md={8} lg={6} key={i}>
              <Card className="category-card">
                <div className="category-image-skeleton" />

                <div style={{ marginTop: 16 }}>
                  <Skeleton active title={{ width: "70%" }} paragraph={false} />
                  <Skeleton
                    active
                    paragraph={{ rows: 1, width: "90%" }}
                    title={false}
                  />
                </div>
              </Card>
            </Col>
          ))}
        </Row>
      ) : (
        <Row gutter={[24, 24]}>
          {categories.map((c) => (
            <Col xs={24} sm={12} md={8} lg={6} key={c._id}>
              <CategoryCard category={c} />
            </Col>
          ))}
        </Row>
      )}
    </div>
  );
};

export default Categories;
