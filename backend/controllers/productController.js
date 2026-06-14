import ProductModel from "../models/ProductModel.js";
import fs from "fs";
import { promises as fsPromises } from "fs";
import slugify from "slugify";
import CategoryModel from "../models/CategoryModel.js";
import braintree from "braintree";
import OrderModel from "../models/OrderModel.js";
import gateway from "../config/braintree.js";

export const createProductController = async (req, res) => {
  try {
    const {
      name,
      slug,
      description,
      price,
      category,
      discount,
      shipping,
      shippingCost,
      colors,
    } = req.fields;
    const { photo } = req.files;

    switch (true) {
      case !name:
        return res.status(500).send({ error: "name is required" });
      case !description:
        return res.status(500).send({ error: "description is required" });
      case !price:
        return res.status(500).send({ error: "price is required" });
      case !category:
        return res.status(500).send({ error: "category is required" });
      case !discount:
        return res.status(500).send({ error: "discount is required" });

      case photo && photo.size > 1000000:
        return res
          .status(500)
          .send({ error: "Photo is required and should be less than 1MB " });
    }

    const products = await ProductModel({
      ...req.fields,
      colors: colors ? JSON.parse(colors) : [],
      slug: slugify(name),
    });
    if (photo) {
      products.photo.data = await fsPromises.readFile(photo.path);
      products.photo.contentType = photo.type;
    }
    await products.save();
    res.status(201).send({
      success: true,
      message: "Product created successful",
      products,
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: "Error in creating products",
      error,
    });
  }
};

export const getProductController = async (req, res) => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 12;
    const skip = (page - 1) * limit;

    const products = await ProductModel.find({})
      .populate("category")
      .select("-photo")
      .lean()
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });

    const total = await ProductModel.countDocuments();

    res.status(200).send({
      success: true,
      message: "Fetched all products",
      total,
      totalProducts: total,
      page,
      pages: Math.ceil(total / limit),
      products,
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: "Error fetching products",
      error,
    });
  }
};

export const getSingleProductController = async (req, res) => {
  try {
    const product = await ProductModel.findOne({ slug: req.params.slug })
      .select("-photo")
      .populate("category")
      .lean();
    res.status(200).send({
      success: true,
      message: "Fetched single Product successfully",
      product,
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: "Error getting single Product",
      error,
    });
  }
};

export const productPhotoController = async (req, res) => {
  try {
    const product = await ProductModel.findById(req.params.pid).select("photo");
    if (product.photo.data) {
      res.set("content-type", product.photo.contentType);
      return res.status(200).send(product.photo.data);
    }
  } catch (error) {
    res.status(500).send({
      success: false,
      message: "Error Loading Photo",
      error,
    });
  }
};

export const deleteProductController = async (req, res) => {
  try {
    await ProductModel.findByIdAndDelete(req.params.pid).select("-photo");
    res.status(200).send({
      success: true,
      message: "Product deleted successfully",
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: "Error deleting product",
      error,
    });
  }
};

export const updateProductController = async (req, res) => {
  try {
    const {
      name,
      slug,
      description,
      price,
      category,
      discount,
      shipping,
      shippingCost,
      colors,
    } = req.fields;
    const { photo } = req.files;

    switch (true) {
      case !name:
        return res.status(500).send({ error: "name is required" });
      case !description:
        return res.status(500).send({ error: "description is required" });
      case !price:
        return res.status(500).send({ error: "price is required" });
      case !category:
        return res.status(500).send({ error: "category is required" });
      case !discount:
        return res.status(500).send({ error: "discount is required" });

      case photo && photo.size > 1000000:
        return res
          .status(500)
          .send({ error: "Photo is required and should be less than 1MB " });
    }

    const products = await ProductModel.findByIdAndUpdate(
      req.params.pid,
      {
        ...req.fields,
        colors: colors ? JSON.parse(colors) : [],
        slug: slugify(name),
      },
      { new: true },
    );
    if (photo) {
      products.photo.data = await fsPromises.readFile(photo.path);
      products.photo.contentType = photo.type;
    }
    await products.save();
    res.status(201).send({
      success: true,
      message: "Product updated successful",
      products,
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: "Error in updating products",
      error,
    });
  }
};

export const productFiltersController = async (req, res) => {
  try {
    const { checked, radio } = req.body;
    const page = Number(req.body.page) || 1;
    const limit = Number(req.body.limit) || 12;
    const skip = (page - 1) * limit;

    let args = {};
    if (checked.length > 0) args.category = checked;
    if (radio.length) args.price = { $gte: radio[0], $lte: radio[1] };

    const products = await ProductModel.find(args)
      .select("-photo")
      .lean()
      .skip(skip)
      .limit(limit);

    const total = await ProductModel.countDocuments(args);

    res.status(200).send({
      success: true,
      products,
      total,
      page,
      pages: Math.ceil(total / limit),
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: "Error Filtering data",
      error,
    });
  }
};

export const productCountController = async (req, res) => {
  try {
    const total = await ProductModel.find({}).estimatedDocumentCount();
    res.status(200).send({
      success: true,
      total,
    });
  } catch (error) {
    res.status(400).send({
      success: false,
      message: "Error in Product count",
      error,
    });
  }
};

export const productListController = async (req, res) => {
  try {
    const perPage = 3;
    const page = Number(req.params.page) || 1;
    const products = await ProductModel.find({})
      .select("-photo")
      .lean()
      .skip((page - 1) * perPage)
      .limit(perPage)
      .sort({ createdAt: -1 });
    res.status(200).send({
      success: true,
      products,
    });
  } catch (error) {
    res.status(400).send({
      success: false,
      message: "Error in per page ctrl",
      error,
    });
  }
};

export const searchProductController = async (req, res) => {
  try {
    const { keyword } = req.params;
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 12;
    const skip = (page - 1) * limit;

    const result = await ProductModel.find({
      $or: [
        {
          name: { $regex: keyword, $options: "i" },
        },
        {
          description: { $regex: keyword, $options: "i" },
        },
      ],
    })
      .select("-photo")
      .lean()
      .skip(skip)
      .limit(limit);

    const total = await ProductModel.countDocuments({
      $or: [
        { name: { $regex: keyword, $options: "i" } },
        { description: { $regex: keyword, $options: "i" } },
      ],
    });

    res.json({
      success: true,
      total,
      page,
      pages: Math.ceil(total / limit),
      result,
    });
  } catch (error) {
    res.status(400).send({
      success: false,
      message: "Error searching Product",
      error,
    });
  }
};

export const relatedProductController = async (req, res) => {
  try {
    const { pid, cid } = req.params;
    const products = await ProductModel.find({
      category: cid,
      _id: { $ne: pid },
    })
      .select("-photo")
      .lean()
      .limit(3)
      .populate("category");
    res.status(200).send({
      success: true,
      products,
    });
  } catch (error) {
    res.status(400).send({
      success: false,
      message: "Error loading similar products",
      error,
    });
  }
};
export const productCategoryController = async (req, res) => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 12;
    const skip = (page - 1) * limit;

    const category = await CategoryModel.findOne({
      slug: req.params.slug,
    }).lean();
    const products = await ProductModel.find({ category: category._id })
      .select("-photo")
      .lean()
      .skip(skip)
      .limit(limit)
      .populate("category");

    const total = await ProductModel.countDocuments({ category: category._id });
    res.status(200).send({
      success: true,
      category,
      products,
      total,
      page,
      pages: Math.ceil(total / limit),
    });
  } catch (error) {
    res.status(400).send({
      success: false,
      message: "Error getting Product category",
      error,
    });
  }
};

export const braintreeTokenController = async (req, res) => {
  try {
    gateway.clientToken.generate({}, function (err, response) {
      if (err) {
        res.status(500).send(err);
      } else {
        res.send(response);
      }
    });
  } catch (error) {}
};
export const braintreePaymentController = async (req, res) => {
  try {
    const { cart, nonce } = req.body;
    let total = 0;

    cart.forEach((item) => {
      const qty = item.discount || 1;

      // Product total
      total += Number(item.price) * qty;

      // Shipping total
      if (item.shipping) {
        total += Number(item.shippingCost || 0) * qty;
      }
    });
    let newTransaction = gateway.transaction.sale(
      {
        amount: total,
        paymentMethodNonce: nonce,
        options: {
          submitForSettlement: true,
        },
      },
      function (error, result) {
        if (result) {
          const order = new OrderModel({
            products: cart,
            payment: result,
            buyer: req.user._id,
          }).save();
          res.json({ ok: true });
        } else {
          res.status(500).send(error);
        }
      },
    );
  } catch (error) {}
};
