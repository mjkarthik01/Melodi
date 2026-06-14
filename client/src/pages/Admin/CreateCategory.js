import { Modal, Table, Button, Space, Card, Popconfirm, Row, Col } from "antd";

import CategoryForm from "../../components/Form/CategoryForm";

import { EditOutlined, DeleteOutlined } from "@ant-design/icons";
import AdminMenu from "../../components/Layout/AdminMenu";
import { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import Loader from "../../components/UI/Loader";

const CreateCategory = () => {
  const [categories, setCategories] = useState([]);
  const [name, setName] = useState("");
  const [visible, setVisible] = useState(false);
  const [selected, setSelected] = useState(null);
  const [updatedName, setUpdatedName] = useState("");
  const [loading, setLoading] = useState(false);
  const [image, setImage] = useState("");
  const [updatedImage, setUpdatedImage] = useState("");
  const [refreshKey, setRefreshKey] = useState(Date.now());

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const categoryData = new FormData();

      categoryData.append("name", name);

      if (image) {
        categoryData.append("image", image);
      }

      const { data } = await axios.post(
        `${process.env.REACT_APP_API}/api/v1/category/create-category`,
        categoryData,
      );

      if (data.success) {
        setRefreshKey(Date.now());
        getAllCategory();
      }
    } catch (error) {
      toast.error("Error creating category");
    }
  };

  const getAllCategory = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(
        `${process.env.REACT_APP_API}/api/v1/category/get-category`,
      );

      if (data?.success) {
        setCategories(data?.category);
        setLoading(false);
      }
    } catch (error) {
      toast.error("Can't Get Category, Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getAllCategory();
  }, [updatedImage]);

  const handleUpdate = async (e) => {
    e.preventDefault();

    try {
      const categoryData = new FormData();

      categoryData.append("name", updatedName);

      if (updatedImage) {
        categoryData.append("image", updatedImage);
      }

      const { data } = await axios.put(
        `${process.env.REACT_APP_API}/api/v1/category/update-category/${selected._id}`,
        categoryData,
      );

      if (data.success) {
        toast.success("Category updated");
        setVisible(false);
        getAllCategory();
      }
    } catch (error) {
      toast.error("Something went wrong");
    }
  };
  const handleDelete = async (pId) => {
    try {
      const { data } = await axios.delete(
        `${process.env.REACT_APP_API}/api/v1/category/delete-category/${pId}`,
      );
      if (data.success) {
        const updatedCategories = categories.map((cat) =>
          cat._id === selected._id ? { ...cat, name: updatedName } : cat,
        );

        setCategories(updatedCategories);

        setVisible(false);
        toast.success("Category updated");

        getAllCategory();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error("something went wrong");
    }
  };

  const columns = [
    {
      title: "#",
      key: "index",
      width: 80,
      render: (_, __, index) => index + 1,
    },
    {
      title: "Image",
      key: "image",
      width: 120,
      render: (_, record) => (
        <img
          src={`${process.env.REACT_APP_API}/api/v1/category/category-photo/${record._id}?v=${record.updatedAt}`}
          alt={record.name}
          style={{
            width: 70,
            height: 70,
            objectFit: "cover",
            borderRadius: 8,
          }}
        />
      ),
    },
    {
      title: "Category Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Actions",
      key: "actions",
      width: 220,
      render: (_, record) => (
        <Space>
          <Button
            type="primary"
            icon={<EditOutlined />}
            onClick={() => {
              setVisible(true);
              setSelected(record);
              setUpdatedName(record.name);
              setUpdatedImage(null);
            }}
          >
            Edit
          </Button>

          <Popconfirm
            title="Delete Category"
            description="Are you sure you want to delete this category?"
            okText="Yes"
            cancelText="No"
            onConfirm={() => handleDelete(record._id)}
          >
            <Button danger icon={<DeleteOutlined />}>
              Delete
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div className="container-fluid">
      <Row gutter={[16, 16]}>
        <Col xs={24} md={6}>
          <AdminMenu />
        </Col>
        <Col xs={24} md={18} className="dashboard-content">
          <Card title="📂 Manage Categories">
            <div className="mb-3">
              <label className="btn btn-outline-secondary col-md-12">
                {image ? image.name : "Upload image"}
                <input
                  type="file"
                  name="image"
                  accept="image/*"
                  onChange={(e) => setImage(e.target.files[0])}
                  hidden
                />
              </label>
            </div>
            <div className="mb-3">
              {image && (
                <div className="text-center">
                  <img
                    src={URL.createObjectURL(image)}
                    alt="product_photo"
                    height={"200px"}
                    className="img img-responsive"
                  />
                </div>
              )}
            </div>
            <CategoryForm
              handleSubmit={handleSubmit}
              value={name}
              setValue={setName}
            />
          </Card>

          <Card className="dashboard-cards">
            {loading ? (
              <Loader />
            ) : (
              <Table
                rowKey="_id"
                columns={columns}
                dataSource={categories}
                pagination={{
                  pageSize: 8,
                  showSizeChanger: false,
                }}
              />
            )}
          </Card>
        </Col>

        <Modal open={visible} footer={null} onCancel={() => setVisible(false)}>
          <div className="mb-3">
            <label className="btn btn-outline-secondary col-md-12">
              {updatedImage?.name || "Upload image"}

              <input
                type="file"
                hidden
                accept="image/*"
                onChange={(e) => setUpdatedImage(e.target.files[0])}
              />
            </label>
          </div>

          {updatedImage instanceof File && (
            <img
              src={URL.createObjectURL(updatedImage)}
              alt="preview"
              height="150"
            />
          )}

          <CategoryForm
            value={updatedName}
            setValue={setUpdatedName}
            handleSubmit={handleUpdate}
          />
        </Modal>
      </Row>
    </div>
  );
};

export default CreateCategory;
