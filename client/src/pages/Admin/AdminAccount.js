import React, { useEffect, useState } from "react";

import { Card, Col, Row, Form, Input, Button, Select, message } from "antd";

import axios from "axios";

import AdminMenu from "../../components/Layout/AdminMenu";

const AdminAccount = () => {
  const [form] = Form.useForm();

  const [loading, setLoading] = useState(false);

  const getConfig = async () => {
    try {
      const { data } = await axios.get(
        `${process.env.REACT_APP_API}/api/v1/admin/payment-config`,
      );

      if (data.success && data.config) {
        form.setFieldsValue(data.config);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleSubmit = async (values) => {
    try {
      setLoading(true);

      const { data } = await axios.post(
        `${process.env.REACT_APP_API}/api/v1/admin/payment-config`,
        values,
      );

      if (data.success) {
        message.success("Payment settings updated");
      }
    } catch (error) {
      message.error("Error updating");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getConfig();
  });

  return (
    <div className="container-fluid">
      <Row gutter={[16, 16]}>
        <Col xs={24} md={6}>
          <AdminMenu />
        </Col>

        <Col xs={24} md={18}>
          <Card title="💳 Braintree Settings">
            <Form form={form} layout="vertical" onFinish={handleSubmit}>
              <Form.Item
                name="merchantId"
                label="Merchant ID"
                rules={[{ required: true }]}
              >
                <Input />
              </Form.Item>

              <Form.Item
                name="publicKey"
                label="Public Key"
                rules={[{ required: true }]}
              >
                <Input />
              </Form.Item>

              <Form.Item
                name="privateKey"
                label="Private Key"
                rules={[{ required: true }]}
              >
                <Input.Password />
              </Form.Item>

              <Form.Item name="environment" label="Environment">
                <Select>
                  <Select.Option value="Sandbox">Sandbox</Select.Option>

                  <Select.Option value="Production">Production</Select.Option>
                </Select>
              </Form.Item>

              <Button type="primary" htmlType="submit" loading={loading}>
                Save Settings
              </Button>
            </Form>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default AdminAccount;
