import React, { useEffect, useState } from "react";
import { WhatsAppOutlined, CloseOutlined } from "@ant-design/icons";
import { useLocation } from "react-router-dom";

const ChatWidget = () => {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");

  const location = useLocation();
  const adminWhatsApp = "918291895854";

  // 🧠 Extract slug from URL
  const getSlugFromURL = () => {
    const parts = location.pathname.split("/");
    if (parts[1] === "product" && parts[2]) {
      return parts[2];
    }
    return null;
  };

  const slug = getSlugFromURL();

  const formatName = (text) => text?.replace(/-/g, " ");

  // 🧠 Generate base message
  const generateMessage = () => {
    if (slug) {
      return `Hi 👋 I'm interested in this product:\n\n🛍️ ${formatName(
        slug,
      )}\n\nPlease give me more details.`;
    }

    if (location.pathname.includes("cart")) {
      return "Hi 👋 I need help with my cart/checkout.";
    }

    return "Hi 👋 I need help regarding your products.";
  };

  // ✅ Update message when route changes
  useEffect(() => {
    setMessage(generateMessage());
  }, [location.pathname]);

  // ⏱ Auto popup after 5 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      setOpen(true);
    }, 5000);

    return () => clearTimeout(timer);
  }, [location.pathname]);

  // 💬 APPEND quick reply instead of replacing
  const addQuickReply = (text) => {
    setMessage((prev) => {
      if (!prev) return text;
      return prev + "\n" + text;
    });
  };

  const quickReplies = [
    "Is this available?",
    "What is the price?",
    "Do you offer delivery?",
    "I want to order this",
  ];

  // 📍 Include page URL in WhatsApp message
  const openWhatsApp = (customMsg) => {
    const finalMessage = customMsg || message;

    const fullMessage = `${finalMessage}

🌐 View Product: ${window.location.href}`;

    const url = `https://wa.me/${adminWhatsApp}?text=${encodeURIComponent(
      fullMessage,
    )}`;

    window.open(url, "_blank", "noopener,noreferrer");
  };

  return (
    <div className="chat-v3-wrapper">
      {/* Floating Button */}
      <div className="chat-fab" onClick={() => setOpen(!open)}>
        {open ? <CloseOutlined /> : <WhatsAppOutlined />}
        <span className="pulse-ring"></span>
      </div>

      {/* Panel */}
      {open && (
        <div className="chat-panel">
          <div className="chat-header">💬 Chat Support</div>

          <div className="chat-body">
            <p className="welcome">👋 Welcome to Sweetie Ayman</p>
            <p className="welcome">Enquire the products before buying</p>

            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={4}
              className="chat-input"
            />

            {/* QUICK REPLIES (APPEND MODE) */}
            <div className="quick-replies">
              {quickReplies.map((q, i) => (
                <button
                  key={i}
                  onClick={() => addQuickReply(q)}
                  className="quick-btn"
                >
                  {q}
                </button>
              ))}
            </div>

            <button className="send-btn" onClick={() => openWhatsApp()}>
              Send on WhatsApp
            </button>

            <p className="note">⚡ Fast reply within minutes</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatWidget;
