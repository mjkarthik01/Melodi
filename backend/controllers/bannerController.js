import Banner from "../models/BannerModel.js";
import fs from "fs";
import path from "path";

export const uploadBanner = async (req, res) => {
  try {
    const { title } = req.fields;

    const image = req.files?.image;

    if (!image) {
      return res.status(400).send({
        success: false,
        message: "Image is required",
      });
    }

    // unique filename
    const fileName = `${Date.now()}-${image.name}`;

    const uploadDir = path.join(process.cwd(), "uploads");

    // create uploads folder if missing
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    const uploadPath = path.join(uploadDir, fileName);

    fs.copyFileSync(image.path, uploadPath);

    const banner = await Banner.create({
      title,
      image: `/uploads/${fileName}`,
      isActive: true,
    });

    res.status(200).send({
      success: true,
      message: "Banner uploaded successfully",
      banner,
    });
  } catch (error) {
    console.log(error);

    res.status(500).send({
      success: false,
      message: "Upload failed",
      error,
    });
  }
};

export const getBanners = async (req, res) => {
  try {
    const banners = await Banner.find({}).sort({ createdAt: -1 });

    res.status(200).send({
      success: true,
      banners,
    });
  } catch (error) {
    console.log(error);

    res.status(500).send({
      success: false,
      error,
    });
  }
};

export const deleteBanner = async (req, res) => {
  try {
    const banner = await Banner.findById(req.params.id);

    if (!banner) {
      return res.status(404).send({
        success: false,
        message: "Banner not found",
      });
    }

    const imagePath = path.join(
      process.cwd(),
      banner.image.replace(/^\/+/, ""),
    );

    if (fs.existsSync(imagePath)) {
      fs.unlinkSync(imagePath);
    }

    await Banner.findByIdAndDelete(req.params.id);

    res.status(200).send({
      success: true,
      message: "Banner deleted successfully",
    });
  } catch (error) {
    console.log(error);

    res.status(500).send({
      success: false,
      error,
    });
  }
};

export const toggleBanner = async (req, res) => {
  try {
    const banner = await Banner.findById(req.params.id);

    if (!banner) {
      return res.status(404).send({
        success: false,
        message: "Banner not found",
      });
    }

    banner.isActive = !banner.isActive;

    await banner.save();

    res.status(200).send({
      success: true,
      message: "Banner updated",
    });
  } catch (error) {
    console.log(error);

    res.status(500).send({
      success: false,
      error,
    });
  }
};
