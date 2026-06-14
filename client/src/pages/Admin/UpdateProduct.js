import React, { useEffect, useState } from "react";
import AdminMenu from "../../components/Layout/AdminMenu";
import { Button, Card, Col, ColorPicker, Row, Select, Tag } from "antd";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
const { Option } = Select;

const UpdateProduct = () => {
  const navigate = useNavigate();
  const params = useParams();
  const [categories, setCategories] = useState([]);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("");
  const [discount, setDiscount] = useState("");
  const [shipping, setShipping] = useState("");
  const [photo, setPhoto] = useState("");
  const [shippingCost, setShippingCost] = useState(0);
  const [color, setColor] = useState("#1677ff");
  const [colors, setColors] = useState([]);
  const [id, setId] = useState("");

  const getSingleProduct = async () => {
    try {
      const { data } = await axios.get(
        `${process.env.REACT_APP_API}/api/v1/product/get-product/${params.slug}`,
      );
      setName(data.product.name);
      setId(data.product._id);
      setDescription(data.product.description);
      setPrice(data.product.price);
      setDiscount(data.product.discount);
      setShipping(data.product.shipping);
      setShippingCost(data.product.shippingCost || 0);
      setCategory(data.product.category._id);
      setColors(Array.isArray(data.product.colors) ? data.product.colors : []);
    } catch (error) {}
  };

  const addColor = () => {
    if (!colors.includes(color)) {
      setColors([...colors, color]);
    }
  };

  const removeColor = (colorToRemove) => {
    setColors(colors.filter((c) => c !== colorToRemove));
  };

  useEffect(() => {
    getSingleProduct();
    // eslint-disable-next-line
  }, []);

  const getAllCategory = async () => {
    try {
      const { data } = await axios.get(
        `${process.env.REACT_APP_API}/api/v1/category/get-category`,
      );

      if (data?.success) {
        setCategories(data?.category);
      }
    } catch (error) {
      toast.error("Can't Get Category, Something went wrong");
    }
  };

  useEffect(() => {
    getAllCategory();
  }, []);

  const handleUpdate = async (e) => {
    e.preventDefault();

    try {
      const productData = new FormData();
      productData.append("name", name);
      productData.append("description", description);
      productData.append("price", price);
      productData.append("discount", discount);
      productData.append("category", category);
      productData.append("shipping", shipping);
      productData.append("shippingCost", shippingCost);
      productData.append("colors", JSON.stringify(colors));

      if (photo) productData.append("photo", photo);

      const { data } = await axios.put(
        `${process.env.REACT_APP_API}/api/v1/product/update-product/${id}`,
        productData,
      );

      if (data.success) {
        toast.success("Product Updated Successfully");
        navigate("/dashboard/admin/products");
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error("Something went wrong");
    }
  };

  const handleDelete = async () => {
    try {
      await axios.delete(
        `${process.env.REACT_APP_API}/api/v1/product/delete-product/${id}`,
      );
      toast.success("Product Deleted Successfully");
      navigate("/dashboard/admin/products");
    } catch (error) {
      toast.error("Something went wrong");
    }
  };
  return (
    <div className="container-fluid">
      <Row gutter={[16, 16]}>
        <Col xs={24} md={6}>
          <AdminMenu />
        </Col>
        <Col xs={24} md={18} className="dashboard-content">
          <Card title="📦 Update Product" className="dashboard-cards">
            <div className="m-1 w-75">
              <Select
                variant="borderless"
                placeholder="select a category"
                size="large"
                showSearch
                className="form-select mb-3"
                onChange={(value) => {
                  setCategory(value);
                }}
                value={category}
              >
                {categories?.map((c) => (
                  <Option key={c._id} value={c._id}>
                    {c.name}
                  </Option>
                ))}
              </Select>
              <div className="mb-3">
                <label className="btn btn-outline-secondary col-md-12">
                  {photo ? photo.name : "Upload Photo"}
                  <input
                    type="file"
                    name="photo"
                    accept="image/*"
                    onChange={(e) => setPhoto(e.target.files[0])}
                    hidden
                  />
                </label>
              </div>
              <div className="mb-3">
                {photo ? (
                  <div className="text-center">
                    <img
                      src={URL.createObjectURL(photo)}
                      alt="product_photo"
                      height={"200px"}
                      className="img img-responsive"
                    />
                  </div>
                ) : (
                  <div className="text-center">
                    <img
                      src={`${process.env.REACT_APP_API}/api/v1/product/product-photo/${id}`}
                      alt="product_photo"
                      height={"200px"}
                      className="img img-responsive"
                    />
                  </div>
                )}
              </div>
              <div className="mb-3">
                <input
                  type="text"
                  value={name}
                  placeholder="Product Name"
                  className="form-control"
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
              <div className="mb-3">
                <input
                  type="text"
                  value={description}
                  placeholder="Description"
                  className="form-control"
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>
              <div className="mb-3">
                <input
                  type="text"
                  value={price}
                  placeholder="Price"
                  className="form-control"
                  onChange={(e) => setPrice(e.target.value)}
                />
              </div>
              <div className="mb-3">
                <input
                  type="text"
                  value={discount}
                  placeholder="Discount"
                  className="form-control"
                  onChange={(e) => setDiscount(e.target.value)}
                />
              </div>
              <div className="mb-3 d-flex">
                <Select
                  value={shipping}
                  size="large"
                  placeholder="Select Shipping"
                  className="form-control w-50"
                  onChange={(value) => setShipping(value)}
                  options={[
                    {
                      value: false,
                      label: "No",
                    },
                    {
                      value: true,
                      label: "Yes",
                    },
                  ]}
                />

                {shipping === true && (
                  <div className="mx-3 w-25">
                    <input
                      type="number"
                      value={shippingCost}
                      placeholder="Shipping Cost"
                      className="form-control"
                      onChange={(e) => setShippingCost(e.target.value)}
                    />
                  </div>
                )}
              </div>
              <div className="mb-3">
                <h6>Available Colors</h6>

                <div className="d-flex align-items-center gap-2">
                  <ColorPicker
                    value={color}
                    onChange={(value) => setColor(value.toHexString())}
                  />

                  <Button onClick={addColor}>Add Color</Button>
                </div>

                <div className="mt-3 d-flex align-items-center justify-content-start gap-2">
                  {colors?.map((c) => (
                    <Tag
                      key={c}
                      closable
                      onClose={() => removeColor(c)}
                      style={{
                        background: c,
                        color: "#fff",
                        border: "none",
                        margin: 8,
                      }}
                    >
                      {c}
                    </Tag>
                  ))}
                </div>
              </div>
              <div className="d-flex align-items-center gap-4 justify-content-lg-start">
                <div className="mb-3">
                  <button
                    className="btn btn-primary btn-icon"
                    onClick={handleUpdate}
                  >
                    <i className="bi bi-pencil-square" />
                    <span>Update Product</span>
                  </button>
                </div>
                <div className="mb-3">
                  <button
                    className="btn btn-danger btn-icon"
                    onClick={handleDelete}
                  >
                    <i className="bi bi-trash-fill" />
                    <span>Delete Product</span>
                  </button>
                </div>
              </div>
            </div>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default UpdateProduct;
