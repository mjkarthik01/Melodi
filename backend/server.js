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
import cors from "cors";

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

app.get("/", (req, res) => {
  res.send("<h1>Welcome to ecommerce app<h1>");
});

const PORT = process.env.PORT || 8080;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`.bgCyan.black);
});
