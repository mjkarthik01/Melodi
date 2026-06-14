import React, { useEffect, useState } from "react";
import AdminMenu from "../../components/Layout/AdminMenu";
import axios from "axios";
import moment from "moment";
import { useAuth } from "../../context/auth";

import {
  Table,
  Select,
  Tag,
  Card,
  Space,
  Typography,
  Avatar,
  Collapse,
  Row,
  Col,
} from "antd";

import { Grid } from "antd";
import Loader from "../../components/UI/Loader";

const { useBreakpoint } = Grid;

const { Option } = Select;
const { Text } = Typography;

const AdminOrders = () => {
  const screens = useBreakpoint();
  const isMobile = !screens.md;
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [auth] = useAuth();

  const statusList = [
    "Not Process",
    "Processing",
    "Shipped",
    "Delivered",
    "Canceled",
  ];

  const getOrders = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(
        `${process.env.REACT_APP_API}/api/v1/auth/all-orders?page=1&limit=20`,
      );

      setOrders(data?.orders || []);
      setLoading(false);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (auth?.token) {
      getOrders();
    }
  }, [auth?.token]);

  const handleChange = async (orderId, value) => {
    try {
      await axios.put(
        `${process.env.REACT_APP_API}/api/v1/auth/order-status/${orderId}`,
        { status: value },
      );

      getOrders();
    } catch (error) {
      console.log(error);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Delivered":
        return "green";
      case "Shipped":
        return "blue";
      case "Processing":
        return "orange";
      case "Canceled":
        return "red";
      default:
        return "default";
    }
  };

  const columns = [
    {
      title: "#",
      render: (_, __, index) => index + 1,
      width: 40,
    },
    {
      title: "Order ID",
      dataIndex: "_id",
      render: (id) => <Text copyable>{id.slice(-8)}</Text>,
    },
    {
      title: "Buyer",
      render: (_, record) => record?.buyer?.name,
    },
    {
      title: "Date",
      render: (_, record) =>
        moment(record?.createdAt).format("DD MMM YYYY HH:mm"),
    },
    {
      title: "Payment",
      render: (_, record) =>
        record?.payment[0]?.success ? (
          <Tag color="green">Success</Tag>
        ) : (
          <Tag color="red">Failed</Tag>
        ),
    },
    {
      title: "Products",
      render: (_, record) => record?.products?.length,
    },
    {
      title: "Status",
      render: (_, record) => (
        <Select
          value={record?.status}
          style={{ width: 105 }}
          onChange={(value) => handleChange(record._id, value)}
        >
          {statusList.map((status) => (
            <Option key={status} value={status}>
              {status}
            </Option>
          ))}
        </Select>
      ),
    },
    {
      title: "Current Status",
      render: (_, record) => (
        <Tag color={getStatusColor(record?.status)}>{record?.status}</Tag>
      ),
    },
  ];

  const expandedRowRender = (record) => (
    <Space orientation="vertical" style={{ width: "100%" }}>
      {record?.products?.map((product) => (
        <Card key={product._id} size="small">
          <Space align="start">
            <Avatar
              shape="square"
              size={80}
              src={`${process.env.REACT_APP_API}/api/v1/product/product-photo/${product._id}`}
            />

            <div>
              <h5>{product.name}</h5>
              <p>{product.description?.substring(0, 100)}...</p>

              <Tag color="gold"> &#8377; {product.price}</Tag>
            </div>
          </Space>
        </Card>
      ))}
    </Space>
  );

  return (
    <div className="container-fluid">
      <Row gutter={[16, 16]}>
        <Col xs={24} md={6}>
          <AdminMenu />
        </Col>

        <Col xs={24} md={18} className="dashboard-content">
          <Card
            title="🛒 All Orders"
            variant="borderless"
            className="dashboard-cards"
          >
            {loading ? (
              <Loader />
            ) : (
              <>
                {isMobile ? (
                  <Space
                    orientation="vertical"
                    size="middle"
                    style={{ width: "100%" }}
                  >
                    {orders?.map((order, index) => (
                      <Card
                        key={order._id}
                        title={`Order #${index + 1}`}
                        size="small"
                      >
                        <Space orientation="vertical" style={{ width: "100%" }}>
                          <div>
                            <strong>Buyer:</strong> {order?.buyer?.name}
                          </div>

                          <div>
                            <strong>Date:</strong>{" "}
                            {moment(order?.createdAt).fromNow()}
                          </div>

                          <div>
                            <strong>Payment:</strong>{" "}
                            {order?.payment[0]?.success ? (
                              <Tag color="green">Success</Tag>
                            ) : (
                              <Tag color="red">Failed</Tag>
                            )}
                          </div>

                          <div>
                            <strong>Status:</strong>
                            <br />
                            <Select
                              value={order?.status}
                              style={{ width: "100%", marginTop: 8 }}
                              onChange={(value) =>
                                handleChange(order._id, value)
                              }
                            >
                              {statusList.map((status) => (
                                <Option key={status} value={status}>
                                  {status}
                                </Option>
                              ))}
                            </Select>
                          </div>

                          <Collapse
                            items={[
                              {
                                key: "1",
                                label: `Products (${order?.products?.length})`,
                                children: (
                                  <Space
                                    orientation="vertical"
                                    style={{ width: "100%" }}
                                  >
                                    {order?.products?.map((product) => (
                                      <Card key={product._id} size="small">
                                        <Space align="start">
                                          <Avatar
                                            shape="square"
                                            size={70}
                                            src={`${process.env.REACT_APP_API}/api/v1/product/product-photo/${product._id}`}
                                          />

                                          <div>
                                            <strong>{product.name}</strong>

                                            <div>
                                              {product.description?.substring(
                                                0,
                                                50,
                                              )}
                                            </div>

                                            <Tag color="gold">
                                              &#8377; {product.price}
                                            </Tag>
                                          </div>
                                        </Space>
                                      </Card>
                                    ))}
                                  </Space>
                                ),
                              },
                            ]}
                          />
                        </Space>
                      </Card>
                    ))}
                  </Space>
                ) : (
                  <Table
                    rowKey="_id"
                    columns={columns}
                    dataSource={orders}
                    expandable={{
                      expandedRowRender,
                    }}
                    pagination={{
                      pageSize: 10,
                    }}
                    // scroll={{ x: 1000 }}
                  />
                )}
              </>
            )}
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default AdminOrders;
