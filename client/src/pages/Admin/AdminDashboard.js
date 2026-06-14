import { Card, Col, Row } from "antd";
import AdminMenu from "../../components/Layout/AdminMenu";
import { useAuth } from "../../context/auth";

const AdminDashboard = () => {
  const [auth] = useAuth();
  return (
    <div className="container-fluid">
      <Row gutter={[16, 16]}>
        <Col xs={24} md={6}>
          <AdminMenu />
        </Col>
        <Col xs={24} md={18} className="dashboard-content">
          <Card title="Admin Dashboard" className="dashboard-cards">
            <h3>Admin Name : {auth?.user?.name}</h3>
            <h3>Admin Email : {auth?.user?.email}</h3>
            <h3>Admin Contact : {auth?.user?.phone}</h3>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default AdminDashboard;
