import React, { useEffect, useState } from "react";
import AdminMenu from "../../components/Layout/AdminMenu";
import { Card, Col, Row, Table } from "antd";
import axios from "axios";
import Loader from "../../components/UI/Loader";
import toast from "react-hot-toast";

const User = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);

  const getAllUsers = async () => {
    try {
      setLoading(true);

      const { data } = await axios.get(
        `${process.env.REACT_APP_API}/api/v1/auth/all-users`,
      );

      if (data?.success) {
        setUsers(data.users);
      }
    } catch (error) {
      toast.error("Can't get Users List");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getAllUsers();
  }, []);

  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Phone Number",
      dataIndex: "phone",
      key: "phone",
    },
  ];

  return (
    <div className="container-fluid">
      <Row gutter={[16, 16]}>
        <Col xs={24} md={6}>
          <AdminMenu />
        </Col>

        <Col xs={24} md={18}>
          <Card title="👤 All Users">
            {loading ? (
              <Loader />
            ) : (
              <Table
                columns={columns}
                dataSource={users}
                rowKey="_id"
                pagination={{ pageSize: 10 }}
              />
            )}
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default User;
