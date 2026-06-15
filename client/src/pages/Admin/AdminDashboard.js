import React, { useEffect, useState } from "react";
import { Card, Col, Row, Statistic } from "antd";
import { Column } from "@ant-design/plots";
import axios from "axios";

import AdminMenu from "../../components/Layout/AdminMenu";
import { useAuth } from "../../context/auth";

const AdminDashboard = () => {
  const [auth] = useAuth();

  const [salesData, setSalesData] = useState([]);
  const [totalSales, setTotalSales] = useState(0);

  const getMonthlySales = async () => {
    try {
      const { data } = await axios.get(
        `${process.env.REACT_APP_API}/api/v1/auth/monthly-sales`,
      );

      if (data?.success) {
        setSalesData(data.sales);

        const total = data.sales.reduce((sum, item) => sum + item.sales, 0);

        setTotalSales(total);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (auth?.token) {
      getMonthlySales();
    }
  }, [auth?.token]);

  const config = {
    data: salesData,
    xField: "month",
    yField: "sales",
    label: {
      position: "top",
    },
    tooltip: {
      items: [
        (datum) => ({
          name: "Sales",
          value: `₹${datum.sales}`,
        }),
      ],
    },
  };

  return (
    <div className="container-fluid">
      <Row gutter={[16, 16]}>
        <Col xs={24} md={6}>
          <AdminMenu />
        </Col>

        <Col xs={24} md={18}>
          <Card title="Admin Dashboard">
            <h3>Admin Name : {auth?.user?.name}</h3>
            <h3>Admin Email : {auth?.user?.email}</h3>
            <h3>Admin Contact : {auth?.user?.phone}</h3>
          </Card>

          <Row gutter={[16, 16]} style={{ marginTop: 20 }}>
            <Col xs={24} md={12}>
              <Card>
                <Statistic
                  title="Total Delivered Sales"
                  value={totalSales}
                  prefix="₹"
                />
              </Card>
            </Col>
          </Row>

          <Card title="Monthly Sales Report" style={{ marginTop: 20 }}>
            <Column {...config} />
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default AdminDashboard;
