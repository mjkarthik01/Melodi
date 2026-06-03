import React, { useState } from "react";
import Layout from "../components/Layout/Layout";
import { useCart } from "../context/cart";
import { useAuth } from "../context/auth";
import { useNavigate } from "react-router-dom";
import DropIn from "braintree-web-drop-in-react";
import axios from "axios";
import { useEffect } from "react";
import toast from "react-hot-toast";

const CartPage = () => {
  const [cart, setCart] = useCart();
  const [auth] = useAuth();
  const [clientToken, setClientToken] = useState("");
  const [instance, setInstance] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const totalPrice = () => {
    try {
      let total = 0;
      cart?.forEach((item) => {
        const qty = item.quantity || 1;
        total += Number(item.price) * qty;
      });
      return total.toLocaleString("en-US", {
        style: "currency",
        currency: "USD",
      });
    } catch (error) {}
  };

  const removeCartItem = (pid) => {
    try {
      let myCart = [...cart];
      let index = myCart.findIndex((item) => item._id === pid);
      myCart.splice(index, 1);
      setCart(myCart);
      localStorage.setItem("cart", JSON.stringify(myCart));
    } catch (error) {}
  };

  const updateQuantity = (pid, qty) => {
    try {
      if (qty < 1) return;
      const updated = cart.map((item) =>
        item._id === pid ? { ...item, quantity: qty } : item,
      );
      setCart(updated);
      localStorage.setItem("cart", JSON.stringify(updated));
    } catch (error) {
      console.error(error);
    }
  };

  const getToken = async () => {
    try {
      const { data } = await axios.get(
        `${process.env.REACT_APP_API}/api/v1/product/braintree/token`,
      );
      setClientToken(data?.clientToken);
    } catch (error) {}
  };

  useEffect(() => {
    getToken();
  }, [auth?.token]);

  const handlePayment = async () => {
    try {
      setLoading(true);
      const { nonce } = await instance.requestPaymentMethod();
      await axios.post(
        `${process.env.REACT_APP_API}/api/v1/product/braintree/payment`,
        {
          nonce,
          cart,
        },
      );
      setLoading(false);
      localStorage.removeItem("cart");
      setCart([]);
      navigate("/dashboard/user/orders");
      toast.success("Payment Completed successfully");
    } catch (error) {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div className="container">
        <div className="row">
          <div className="col-md-12">
            <h1 className="text-center bg-light p-2 mb-1">
              {`Hi ${auth?.token && auth?.user?.name}`}
            </h1>
            <h4 className="text-center">
              {cart?.length >= 1
                ? `You have ${cart.length} item in your cart ${auth?.token ? "" : "please login to checkout"}`
                : "Your cart is empty"}
            </h4>
          </div>
        </div>
        <div className="row">
          <div className="col-md-8">
            {cart?.map((p) => (
              <div
                className="row m-2 p-2 card flex-row align-items-center"
                key={p._id}
              >
                <div className="col-3 col-md-2">
                  <img
                    src={`${process.env.REACT_APP_API}/api/v1/product/product-photo/${p._id}`}
                    alt={p.name}
                    className="cart-item__image"
                  />
                </div>
                <div className="col-9 col-md-7">
                  <h5>{p.name}</h5>
                  <p className="muted">{p.description.substring(0, 60)}</p>
                  <div className="d-flex gap-2 align-items-center">
                    <div className="quantity-control">
                      <button
                        className="btn btn-light"
                        onClick={() =>
                          updateQuantity(p._id, (p.quantity || 1) - 1)
                        }
                        disabled={(p.quantity || 1) <= 1}
                      >
                        -
                      </button>
                      <span className="mx-2">{p.quantity || 1}</span>
                      <button
                        className="btn btn-light"
                        onClick={() =>
                          updateQuantity(p._id, (p.quantity || 1) + 1)
                        }
                      >
                        +
                      </button>
                    </div>
                    <strong className="ms-3">
                      {(Number(p.price) * (p.quantity || 1)).toLocaleString(
                        "en-US",
                        { style: "currency", currency: "USD" },
                      )}
                    </strong>
                  </div>
                </div>
                <div className="col-12 col-md-3 text-end">
                  <button
                    className="btn btn-danger"
                    onClick={() => removeCartItem(p._id)}
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>
          {cart?.length >= 1 ? (
            <div className="col-md-4 text-center">
              <h2>Cart Summary</h2>
              <p>Total | Checkout | Payment</p>
              <hr />
              <h4>Total :{totalPrice()}</h4>
              {auth?.user?.address ? (
                <>
                  <div className="mb-3">
                    <h4>Current Address</h4>
                    <h5>{auth?.user?.address}</h5>
                    <button
                      className="btn btn-outline-warning"
                      onClick={() => navigate("/dashboard/user/profile")}
                    >
                      Update Address
                    </button>
                  </div>
                </>
              ) : (
                <div className="mb-3">
                  {auth?.token ? (
                    <button
                      className="btn btn-outline-warning"
                      onClick={() => navigate("/dashboard/user/profile")}
                    >
                      Update Address
                    </button>
                  ) : (
                    <button
                      className="btn btn-outline-warning"
                      onClick={() => navigate("/login", { state: "/cart" })}
                    >
                      Please Login to Checkout
                    </button>
                  )}
                </div>
              )}
              <div className="mt-2">
                {!clientToken || !cart?.length ? (
                  ""
                ) : (
                  <>
                    <DropIn
                      options={{
                        authorization: clientToken,
                        paypal: {
                          flow: "vault",
                        },
                      }}
                      onInstance={(instance) => setInstance(instance)}
                    />

                    <button
                      className="btn btn-primary mb-3"
                      disabled={loading || !instance || !auth?.user?.address}
                      onClick={handlePayment}
                    >
                      {loading ? "Processing ..." : "Make Payment"}
                    </button>
                  </>
                )}
              </div>
            </div>
          ) : (
            ""
          )}
        </div>
      </div>
    </Layout>
  );
};

export default CartPage;
