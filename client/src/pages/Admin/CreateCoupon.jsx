import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import html2canvas from "html2canvas";

import {
  Button,
  Card,
  Col,
  Form,
  Input,
  Row,
  Table,
  message,
  Tag,
  QRCode,
} from "antd";

import AdminMenu from "../../components/Layout/AdminMenu";

const CreateCoupon = () => {
  const [form] = Form.useForm();
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(false);
  const [creating, setCreating] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [sharing, setSharing] = useState(false);
  const [selectedCoupon, setSelectedCoupon] = useState(null);

  const posterRef = useRef(null);

  const API = process.env.REACT_APP_API;

  // ---------------- FETCH COUPONS ----------------
  const getCoupons = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get(`${API}/api/v1/coupon/all`);
      setCoupons(data.coupons || []);
    } catch (err) {
      message.error("Failed to load coupons");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getCoupons();
  }, []);

  // ---------------- CREATE COUPON ----------------
  const createCoupon = async (values) => {
    setCreating(true);
    try {
      await axios.post(`${API}/api/v1/coupon/create`, values);
      message.success("Coupon created");
      form.resetFields();
      getCoupons();
    } catch (err) {
      message.error("Failed to create coupon");
    } finally {
      setCreating(false);
    }
  };

  // ---------------- DELETE COUPON ----------------
  const deleteCoupon = async (id) => {
    setDeletingId(id);
    try {
      await axios.delete(`${API}/api/v1/coupon/${id}`);
      message.success("Deleted");
      getCoupons();
    } catch (err) {
      message.error("Delete failed");
    } finally {
      setDeletingId(null);
    }
  };

  // ---------------- EXPIRY CHECK ----------------
  const isExpired = (expiryDate) => {
    if (!expiryDate) return false;
    return new Date(expiryDate) < new Date();
  };

  // ---------------- SHARE POSTER ----------------
  const shareCoupon = async (record) => {
    if (sharing) return;

    setSharing(true);

    try {
      setSelectedCoupon(record);

      await new Promise((res) => setTimeout(res, 300));

      const canvas = await html2canvas(posterRef.current, {
        scale: 2,
        useCORS: true,
      });

      const blob = await new Promise((resolve) =>
        canvas.toBlob(resolve, "image/png"),
      );

      if (!blob) throw new Error("Image generation failed");

      const file = new File([blob], `coupon-${record.code}.png`, {
        type: "image/png",
      });

      const text = `🎉 Get ${record.percentage}% OFF!\nUse this coupon:\n${window.location.origin}/coupon/${record.code}`;

      if (navigator.share) {
        await navigator.share({
          title: "Coupon Offer",
          text,
          files: [file],
        });
      }
    } catch (err) {
      // User cancelling share is not really an error
      if (err.name !== "AbortError") {
        console.error(err);
        message.error("Share failed");
      }
    } finally {
      setSharing(false);
    }
  };

  // ---------------- TABLE COLUMNS ----------------
  const columns = [
    {
      title: "Code",
      dataIndex: "code",
    },
    {
      title: "Discount",
      render: (_, r) => <Tag color="green">{r.percentage}%</Tag>,
    },
    {
      title: "Expiry",
      render: (_, r) =>
        r.expiryDate ? (
          isExpired(r.expiryDate) ? (
            <Tag color="red">Expired</Tag>
          ) : (
            <Tag color="blue">{new Date(r.expiryDate).toDateString()}</Tag>
          )
        ) : (
          "-"
        ),
    },
    {
      title: "QR Code",
      render: (_, record) => {
        const expired = isExpired(record.expiryDate);
        return (
          <div id={`qr-${record._id}`} style={{ position: "relative" }}>
            <QRCode
              value={`${window.location.origin}/coupon/${record.code}`}
              size={90}
              status={expired ? "expired" : "active"}
            />
          </div>
        );
      },
    },
    {
      title: "Share",
      render: (_, record) => (
        <Button
          type="primary"
          loading={sharing}
          disabled={isExpired(record.expiryDate) || sharing}
          onClick={() => shareCoupon(record)}
        >
          Share Coupon
        </Button>
      ),
    },
    {
      title: "Action",
      render: (_, record) => (
        <Button
          danger
          loading={deletingId === record._id}
          onClick={() => deleteCoupon(record._id)}
        >
          Delete
        </Button>
      ),
    },
  ];

  return (
    <div className="container-fluid">
      <Row gutter={16}>
        <Col xs={24} md={6}>
          <AdminMenu />
        </Col>

        <Col xs={24} md={18}>
          {/* ---------------- CREATE FORM ---------------- */}
          <Card title="Create Coupon">
            <Form
              form={form}
              layout="vertical"
              onFinish={createCoupon}
              initialValues={{ percentage: 10 }}
            >
              <Form.Item
                label="Discount Percentage"
                name="percentage"
                rules={[{ required: true, message: "Enter discount %" }]}
              >
                <Input type="number" />
              </Form.Item>

              <Form.Item
                shouldUpdate
                label="Expiry Date"
                name="expiryDate"
                rules={[
                  { required: true, message: "Select expiry date" },
                  {
                    validator: (_, value) => {
                      if (!value) return Promise.resolve();

                      const selectedDate = new Date(value);
                      const today = new Date();

                      // reset time for fair comparison (important)
                      today.setHours(0, 0, 0, 0);
                      selectedDate.setHours(0, 0, 0, 0);

                      if (selectedDate < today) {
                        return Promise.reject(
                          new Error("Expiry date cannot be in the past"),
                        );
                      }

                      return Promise.resolve();
                    },
                  },
                ]}
              >
                <Input type="date" />
              </Form.Item>

              <Button type="primary" htmlType="submit" loading={creating}>
                Generate Coupon
              </Button>
            </Form>
          </Card>

          {/* ---------------- TABLE ---------------- */}
          <Card style={{ marginTop: 16 }}>
            <Table
              rowKey="_id"
              dataSource={coupons}
              columns={columns}
              loading={loading}
            />
          </Card>
        </Col>
      </Row>

      {/* ---------------- HIDDEN POSTER TEMPLATE ---------------- */}
      {selectedCoupon && (
        <div
          ref={posterRef}
          style={{
            width: "420px",
            padding: "28px",
            textAlign: "center",
            backgroundImage: "url('/SwiperSlide2.png')",
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
            position: "absolute",
            left: "-9999px",
            top: 0,
            borderRadius: "18px",
            fontFamily: "Arial",
            border: "1px solid #eee",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: "10px",
          }}
        >
          <div
            style={{
              background: "rgba(255, 255, 255, 0.78)",
              borderRadius: "18px",
              zIndex: 0,
              margin: "25px",
              padding: "10px",
            }}
          >
            {/* ---------------- BRAND HEADER ---------------- */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                marginBottom: "10px",
                verticalAlign: "middle",
              }}
            >
              <img
                src="/ShopLogo4.png"
                alt="logo"
                style={{
                  marginRight: "6px",
                  width: "30px",
                  height: "30px",
                  objectFit: "contain",
                }}
              />

              <h3
                style={{
                  fontSize: "16px",
                  fontFamily: "Dancing Script",
                  color: " #f9296b",
                }}
              >
                Sweetie Ayman
              </h3>
            </div>

            {/* TITLE */}
            <h1 style={{ fontSize: "30px", margin: 0, color: "#05197a" }}>
              🎉 {selectedCoupon.percentage}% Discount
            </h1>

            <p style={{ margin: 0, fontSize: "14px", color: "#555" }}>
              Exclusive Limited Time Offer
            </p>

            {/* QR WRAPPER */}
            <div
              style={{
                marginTop: "10px",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                width: "100%",
              }}
            >
              <QRCode
                value={`${window.location.origin}/coupon/${selectedCoupon.code}`}
                size={200}
                level="H"
                color="#510041"
              />
            </div>

            {/* CODE */}
            <p
              style={{
                marginTop: "12px",
                fontWeight: "bold",
                color: "#510041",
              }}
            >
              Code: {selectedCoupon.code}
            </p>

            {/* LINK (VISUAL ONLY) */}
            <p
              style={{
                fontSize: "12px",
                color: "#555",
                wordBreak: "break-word",
                margin: 0,
              }}
            >
              {window.location.origin}/coupon/{selectedCoupon.code}
            </p>

            <p style={{ fontSize: "11px", color: "#888", marginTop: "6px" }}>
              Scan QR or use link to redeem
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default CreateCoupon;
