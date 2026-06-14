import React, { useEffect, useState } from "react";
import UserMenu from "../../components/Layout/UserMenu";
import axios from "axios";
import { useAuth } from "../../context/auth";
import moment from "moment";
import Loader from "../../components/UI/Loader";

import { Table, Tag, Card, Row, Col, Typography, Avatar, Space } from "antd";

const { Text } = Typography;

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [auth] = useAuth();

  const getOrders = async () => {
    try {
      setLoading(true);

      const { data } = await axios.get(
        `${process.env.REACT_APP_API}/api/v1/auth/user-orders?page=1&limit=10`,
      );

      setOrders(data?.orders || []);
      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  useEffect(() => {
    if (auth?.token) getOrders();
  }, [auth?.token]);

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
      width: 60,
    },
    {
      title: "Status",
      dataIndex: "status",
      render: (status) => <Tag color={getStatusColor(status)}>{status}</Tag>,
    },
    {
      title: "Buyer",
      render: (_, record) => record?.buyer?.name,
    },
    {
      title: "Date",
      render: (_, record) => moment(record?.createdAt).fromNow(),
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
  ];

  const expandedRowRender = (record) => {
    return (
      <Space orientation="vertical" style={{ width: "100%" }}>
        {record?.products?.map((p) => (
          <Card key={p._id} size="small">
            <Space>
              <Avatar
                shape="square"
                size={70}
                src={`${process.env.REACT_APP_API}/api/v1/product/product-photo/${p._id}`}
              />

              <div>
                <Text strong>{p.name}</Text>
                <br />
                <Text type="secondary">
                  {p.description?.substring(0, 60)}...
                </Text>
                <br />
                <Tag color="gold">${p.price}</Tag>
              </div>
            </Space>
          </Card>
        ))}
      </Space>
    );
  };

  return (
    <div className="container-fluid p-3">
      <Row gutter={[16, 16]}>
        {/* Sidebar */}
        <Col xs={24} md={6}>
          <UserMenu />
        </Col>

        {/* Content */}
        <Col xs={24} md={18} className="dashboard-content">
          <Card
            title="🧾 Your Orders"
            variant="borderless"
            className="dashboard-cards"
          >
            {loading ? (
              <Loader />
            ) : (
              <Table
                rowKey="_id"
                columns={columns}
                dataSource={orders}
                expandable={{
                  expandedRowRender,
                }}
                pagination={{
                  pageSize: 5,
                }}
                scroll={{ x: 800 }}
              />
            )}
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Orders;
