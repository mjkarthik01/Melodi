import axios from "axios";
import DropIn from "braintree-web-drop-in-react";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import EmptyState from "../components/UI/EmptyState";
import SectionHeader from "../components/UI/SectionHeader";
import { useAuth } from "../context/auth";
import { useCart } from "../context/cart";

const CartPage = () => {
  const { cart, setCart } = useCart();
  const [auth] = useAuth();
  const [clientToken, setClientToken] = useState("");
  const [instance, setInstance] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const getSubtotal = () => {
    return cart.reduce(
      (sum, item) => sum + Number(item.price) * (item.quantity || 1),
      0,
    );
  };

  const getShippingTotal = () => {
    return cart.reduce((sum, item) => {
      if (item.shipping) {
        return sum + Number(item.shippingCost || 0);
      }
      return sum;
    }, 0);
  };

  const getGrandTotal = () => {
    return getSubtotal() + getShippingTotal();
  };

  const formatCurrency = (amount) => {
    return amount.toLocaleString("en-IN", {
      style: "currency",
      currency: "INR",
    });
  };

  const removeCartItem = (pid, color) => {
    const updatedCart = cart.filter(
      (item) => !(item._id === pid && item.selectedColor === color),
    );
    toast.success("Removed Item Successfully");
    setCart(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart));
  };
  const updateQuantity = (pid, color, qty) => {
    if (qty < 1) return;

    const updated = cart.map((item) =>
      item._id === pid && item.selectedColor === color
        ? { ...item, quantity: qty }
        : item,
    );

    setCart(updated);
    localStorage.setItem("cart", JSON.stringify(updated));
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
    <div className="container">
      <div className="row">
        <div className="col-md-12">
          <h1
            className="text-center p-2 mb-4"
            style={{ background: "#b3def5be", color: "#4a386c" }}
          >
            {`Hi ${auth?.token && auth?.user?.name}`}
          </h1>
        </div>
      </div>
      <div className="d-flex align-items-center justify-content-between">
        <SectionHeader title="Cart" subtitle="Checkout Now" />
        <p className="text-center p-0 m-0 text-success">
          You have {cart.length} items in your cart
        </p>
      </div>
      {cart.length === 0 ? (
        <EmptyState
          title="Your Cart is empty"
          description="Browse products and Checkout Now."
          cta="Browse categories"
          to="/categories"
        />
      ) : (
        <div className="row">
          <div className="col-md-8">
            <AnimatePresence>
              {cart?.map((p) => (
                <motion.div
                  key={`${p._id}-${p.selectedColor}`}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{
                    opacity: 0,
                    x: 100,
                    transition: { duration: 0.3 },
                  }}
                  transition={{
                    layout: {
                      duration: 0.3,
                      ease: "easeInOut",
                    },
                  }}
                >
                  <div
                    key={`${p._id}-${p.selectedColor}`}
                    className={`row m-2 p-2 card flex-row align-items-center cart-item 
                    `}
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

                      <div className="mb-3">
                        <div className="d-flex gap-2 mt-2">
                          <strong className="text-muted">Color</strong>
                          <div
                            style={{
                              width: 30,
                              height: 30,
                              borderRadius: "50%",
                              background: p.selectedColor,
                              cursor: "pointer",
                            }}
                          ></div>
                        </div>
                      </div>

                      <div className="mb-2">
                        <div className="quantity-control">
                          <button
                            className="btn btn-light"
                            onClick={() =>
                              updateQuantity(
                                p._id,
                                p.selectedColor,
                                (p.quantity || 1) - 1,
                              )
                            }
                            disabled={(p.quantity || 1) <= 1}
                          >
                            -
                          </button>
                          <span className="mx-2">{p.quantity || 1}</span>
                          <button
                            className="btn btn-light"
                            onClick={() =>
                              updateQuantity(
                                p._id,
                                p.selectedColor,
                                (p.quantity || 1) + 1,
                              )
                            }
                          >
                            +
                          </button>
                        </div>

                        <strong className="ms-3 text-danger">
                          {(
                            Number(p.price) * (p.quantity || 1) +
                            p.shippingCost
                          ).toLocaleString("en-US", {
                            style: "currency",
                            currency: "INR",
                          })}
                        </strong>
                      </div>
                      <div className="mb-2">
                        <small>
                          Product Price: {formatCurrency(Number(p.price))}
                        </small>

                        {p.shipping && (
                          <small className="text-muted d-block">
                            Shipping: ₹{p.shippingCost || 0}
                          </small>
                        )}
                      </div>
                    </div>
                    <div className="col-12 col-md-3 text-end">
                      <button
                        className="btn btn-danger"
                        onClick={() => removeCartItem(p._id, p.selectedColor)}
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
          {cart?.length >= 1 ? (
            <div className="col-md-4 text-center">
              <h2>Cart Summary</h2>
              <p>Total | Checkout | Payment</p>
              <hr />
              <h5>
                Subtotal :
                {getSubtotal().toLocaleString("en-IN", {
                  style: "currency",
                  currency: "INR",
                })}
              </h5>

              <h5>
                Shipping :
                {getShippingTotal().toLocaleString("en-IN", {
                  style: "currency",
                  currency: "INR",
                })}
              </h5>

              <hr />

              <h4 className="text-danger">
                Total :
                {getGrandTotal().toLocaleString("en-IN", {
                  style: "currency",
                  currency: "INR",
                })}
              </h4>
              {auth?.user?.address ? (
                <>
                  <div className="mb-3">
                    <h4 className="text-info-emphasis text-decoration-underline">
                      Current Address
                    </h4>
                    <h5>{auth?.user?.address}</h5>
                    <button
                      className="btn btn-outline-warning mt-2"
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
                      className="btn btn-outline-warning mt-2"
                      onClick={() => navigate("/dashboard/user/profile")}
                    >
                      Update Address
                    </button>
                  ) : (
                    <button
                      className="btn btn-outline-warning mt-2"
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
      )}
    </div>
  );
};

export default CartPage;
