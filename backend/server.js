import dotenv from "dotenv";
dotenv.config();

import express from "express";
import colors from "colors";
import morgan from "morgan";
import compression from "compression";
import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoute.js";
import categoryRoute from "./routes/categoryRoute.js";
import productRoute from "./routes/productRoute.js";
import bannerRoute from "./routes/bannerRoute.js";
import paymentConfigRoutes from "./routes/paymentConfigRoutes.js";
import couponRoute from "./routes/couponRoute.js";
import cors from "cors";
import path from "path";
import ProductModel from "./models/ProductModel.js";

connectDB();

const app = express();

// Enable gzip compression
app.use(compression());

app.use(cors());
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));
app.use(morgan("dev"));

app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/category", categoryRoute);
app.use("/api/v1/product", productRoute);
app.use("/api/v1/banner", bannerRoute);
app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));

app.use("/api/v1/admin", paymentConfigRoutes);

app.use("/api/v1/coupon", couponRoute);

const renderProductMetaHtml = (product, siteUrl, routeType = "product") => {
  const productImageUrl = `${siteUrl}/api/v1/product/product-photo/${product._id}`;
  const shareUrl = `${siteUrl}/${routeType === "share" ? "share/product" : "product"}/${product.slug}`;
  const description = `${product.description || "Premium product"}`
    .replace(/\s+/g, " ")
    .trim();

  return `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>${product.name}</title>
    <meta property="og:title" content="${product.name}" />
    <meta property="og:description" content="${description}" />
    <meta property="og:image" content="${productImageUrl}" />
    <meta property="og:url" content="${shareUrl}" />
    <meta property="og:type" content="product" />
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="${product.name}" />
    <meta name="twitter:description" content="${description}" />
    <meta name="twitter:image" content="${productImageUrl}" />
    <meta name="description" content="${description}" />
    <link rel="canonical" href="${shareUrl}" />
  </head>
  <body>
    <h1>${product.name}</h1>
    <p>${description}</p>
    <img src="${productImageUrl}" alt="${product.name}" style="max-width: 400px;" />
  </body>
</html>`;
};

const sendNotFoundHtml = (res) => {
  res.status(404).type("html").send(`<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Product not found</title>
  </head>
  <body>
    <h1>Product not found</h1>
  </body>
</html>`);
};

app.get("/product/:slug", async (req, res) => {
  try {
    const slug = req.params.slug;
    const escapedSlug = slug.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

    const product = await ProductModel.findOne({
      slug: { $regex: new RegExp(`^${escapedSlug}$`, "i") },
    }).lean();

    if (!product) {
      return sendNotFoundHtml(res);
    }

    const siteUrl =
      process.env.CLIENT_URL ||
      process.env.APP_URL ||
      "https://sweetieayman.com";

    res.status(200).type("html").send(renderProductMetaHtml(product, siteUrl));
  } catch (error) {
    console.error("Product route error", error);
    res.status(500).type("html").send(`<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Product error</title>
  </head>
  <body>
    <h1>Unable to load product</h1>
  </body>
</html>`);
  }
});

app.get("/share/product/:slug", async (req, res) => {
  try {
    const slug = req.params.slug;
    const escapedSlug = slug.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

    const product = await ProductModel.findOne({
      slug: { $regex: new RegExp(`^${escapedSlug}$`, "i") },
    }).lean();

    if (!product) {
      return sendNotFoundHtml(res);
    }

    const siteUrl =
      process.env.CLIENT_URL ||
      process.env.APP_URL ||
      "https://sweetieayman.com";

    res
      .status(200)
      .type("html")
      .send(renderProductMetaHtml(product, siteUrl, "share"));
  } catch (error) {
    console.error("Share route error", error);
    res.status(500).type("html").send(`<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Product error</title>
  </head>
  <body>
    <h1>Unable to load product</h1>
  </body>
</html>`);
  }
});

app.get("/", (req, res) => {
  res.send("<h1>Welcome to ecommerce app<h1>");
});

const PORT = process.env.PORT || 8080;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`.bgCyan.black);
});
