import React, { useEffect, useState } from "react";
import AdminMenu from "../../components/Layout/AdminMenu";
import toast from "react-hot-toast";
import axios from "axios";
import { Card, Col, Row, Select } from "antd";
import { useNavigate } from "react-router-dom";
import { ColorPicker, Button, Tag } from "antd";
const { Option } = Select;

const CreateProduct = () => {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("");
  const [discount, setDiscount] = useState("");
  const [shipping, setShipping] = useState(undefined);
  const [photo, setPhoto] = useState("");
  const [shippingCost, setShippingCost] = useState("");
  const [color, setColor] = useState("#1677ff");
  const [colors, setColors] = useState([]);

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

  const addColor = () => {
    if (!colors.includes(color)) {
      setColors([...colors, color]);
    }
  };

  const removeColor = (colorToRemove) => {
    setColors(colors.filter((c) => c !== colorToRemove));
  };

  useEffect(() => {
    getAllCategory();
  }, []);
  const handleCreate = async (e) => {
    e.preventDefault();

    try {
      const productData = new FormData();

      productData.append("name", name);
      productData.append("description", description);
      productData.append("price", price);
      productData.append("discount", discount);
      productData.append("photo", photo);
      productData.append("category", category);
      productData.append("shipping", shipping);
      productData.append("shippingCost", shippingCost);
      productData.append("colors", JSON.stringify(colors));

      const { data } = await axios.post(
        `${process.env.REACT_APP_API}/api/v1/product/create-product`,
        productData,
      );

      if (data?.success) {
        toast.success(data?.message || "Product Created Successfully");
        navigate("/dashboard/admin/products");
      } else {
        toast.error(data?.message || "Failed to create product");
      }
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
          <Card title="📦 Create Products" className="dashboard-cards">
            <div className="m-1 w-75">
              <Select
                variant="borderless"
                placeholder="select a category"
                size="large"
                showSearch
                className="form-control mb-3"
                onChange={(value) => {
                  setCategory(value);
                }}
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
                {photo && (
                  <div className="text-center">
                    <img
                      src={URL.createObjectURL(photo)}
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

                <div className="mt-3">
                  {colors.map((c) => (
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
              <div className="mb-3">
                <button
                  className="btn btn-primary btn-icon"
                  onClick={handleCreate}
                >
                  <i className="bi bi-plus-circle-fill" />
                  <span>Create Product</span>
                </button>
              </div>
            </div>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default CreateProduct;
