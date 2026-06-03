import CategoryModel from "../models/CategoryModel.js";
import slugify from "slugify";

export const createCategoryController = async (req, res) => {
  try {
    const { name } = req.body;
    if (!name) {
      return res.status(401).send({ message: "Name is required" });
    }
    // Let unique constraint handle duplicates
    const category = await new CategoryModel({
      name,
      slug: slugify(name),
    }).save();
    res.status(200).send({
      success: true,
      message: "New category created",
      category,
    });
  } catch (error) {
    res.status.send({
      success: false,
      message: "Error in Category",
    });
  }
};

export const updateCategoryController = async (req, res) => {
  try {
    const { name } = req.body;
    const { id } = req.params;
    const category = await CategoryModel.findByIdAndUpdate(
      id,
      { name, slug: slugify(name) },
      { new: true },
    );
    res.status(200).send({
      success: true,
      message: "Category updated successfully",
      category,
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: "Error while updating category",
      error,
    });
  }
};

export const categorController = async (req, res) => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    const category = await CategoryModel.find({})
      .lean()
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });

    const total = await CategoryModel.countDocuments();

    res.status(200).send({
      success: true,
      message: "Fetched Category successfully",
      total,
      page,
      pages: Math.ceil(total / limit),
      category,
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: "Error fetching Category",
      error,
    });
  }
};
export const singleCategorController = async (req, res) => {
  try {
    const category = await CategoryModel.findOne({
      slug: req.params.slug,
    }).lean();
    res.status(200).send({
      success: true,
      message: "Fetched single Category successfully",
      category,
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: "Error fetching single Category",
      error,
    });
  }
};

export const deleteCategoryController = async (req, res) => {
  try {
    const { id } = req.params;
    await CategoryModel.findByIdAndDelete(id);
    res.status(200).send({
      success: true,
      message: "Category deleted successfully",
    });
  } catch (error) {
    res
      .status(500)
      .send({ success: false, message: "Error deleting category", error });
  }
};
