import Banner from "../models/BannerModel.js";
import cloudinary from "../config/cloudinary.js";

// ================= UPLOAD BANNER =================
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

    // upload to Cloudinary
    const result = await cloudinary.uploader.upload(image.path, {
      folder: "banners",
    });

    const banner = await Banner.create({
      title,
      image: result.secure_url, // public URL
      cloudinary_id: result.public_id, // needed for delete
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

// ================= GET BANNERS =================
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

// ================= DELETE BANNER =================
export const deleteBanner = async (req, res) => {
  try {
    const banner = await Banner.findById(req.params.id);

    if (!banner) {
      return res.status(404).send({
        success: false,
        message: "Banner not found",
      });
    }

    // delete from Cloudinary
    if (banner.cloudinary_id) {
      await cloudinary.uploader.destroy(banner.cloudinary_id);
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

// ================= TOGGLE BANNER =================
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
