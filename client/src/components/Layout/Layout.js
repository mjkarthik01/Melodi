import React from "react";
import Header from "./Header";
import Footer from "./Footer";
import { Helmet } from "react-helmet";
import { Toaster } from "react-hot-toast";

const Layout = ({
  children,
  title = "Sweetie Ayman - Shop Now",
  description = "Premium bag marketplace",
  keywords = "bag, handbag, wallet, accessories",
  author = "Sweetie Ayman",
}) => {
  return (
    <div className="app-shell">
      <Helmet>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="description" content={description} />
        <meta name="keywords" content={keywords} />
        <meta name="author" content={author} />
        <title>{title}</title>
      </Helmet>
      <Header />
      <main className="app-main">
        <Toaster position="top-right" />
        {children}
      </main>
      <Footer />
    </div>
  );
};

export default Layout;
