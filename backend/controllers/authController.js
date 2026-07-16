import { comparePassword, hashPassword } from "./../helpers/authHelper.js";
import UserModel from "../models/UserModel.js";
import JWT from "jsonwebtoken";
import OrderModel from "../models/OrderModel.js";
import { transporter } from "../config/mail.js";

export const registerController = async (req, res) => {
  try {
    const { name, email, password, phone, address, answer } = req.body;
    if (!name) {
      return res.send({ message: "Name is Required" });
    }
    if (!email) {
      return res.send({ message: "Email is Required" });
    }
    if (!password) {
      return res.send({ message: "Password is Required" });
    }
    if (!phone) {
      return res.send({ message: "Phone Number is Required" });
    }
    if (!address) {
      return res.send({ message: "Address is Required" });
    }
    if (!answer) {
      return res.send({ message: "Secret key is Required" });
    }

    const existingUser = await UserModel.findOne({ email });
    if (existingUser) {
      return res.status(200).send({
        success: false,
        message: "Already Registered, Please Login",
      });
    }

    const hashedPassword = await hashPassword(password);
    const user = await new UserModel({
      name,
      email,
      phone,
      currentAddress: address,
      addresses: [address],
      password: hashedPassword,
      answer,
    }).save();

    res.status(201).send({
      success: true,
      message: "User Registered Successfully",
      user,
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: "Error in Registration",
      error,
    });
  }
};

export const loginController = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await UserModel.findOne({ email });

    if (!user) {
      return res.status(404).send({
        success: false,
        message: "Email not registered",
      });
    }

    const match = await comparePassword(password, user.password);

    if (!match) {
      return res.send({
        success: false,
        message: "Invalid password",
      });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    user.otp = otp;
    user.otpExpiry = Date.now() + 5 * 60 * 1000;

    await user.save();

    try {
      await transporter.sendMail({
        from: process.env.EMAIL,
        to: user.email,
        subject: "Login OTP",
        html: `
          <div style="font-family:Arial,sans-serif;padding:20px">
            <h2>Login Verification</h2>

            <p>Your verification code is:</p>

            <h1 style="
                letter-spacing:8px;
                color:#0d6efd;
                font-size:36px;
            ">
              ${otp}
            </h1>

            <p>
              This OTP will expire in <strong>5 minutes</strong>.
            </p>

            <p>
              If you didn't request this code, please ignore this email.
            </p>
          </div>
        `,
      });
    } catch (emailError) {
      console.error("Email sending error:", emailError.message);
      // Still allow login to proceed even if email fails
      console.error("OTP saved but email failed to send. OTP:", otp);
    }

    return res.send({
      success: true,
      otpSent: true,
      message: "OTP sent successfully",
      email,
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).send({
      success: false,
      message: "Error in login",
      error:
        process.env.DEV_MODE === "development" ? error.message : "Server error",
    });
  }
};

export const verifyOTPController = async (req, res) => {
  try {
    const { email, otp } = req.body;

    const user = await UserModel.findOne({ email });

    if (!user) {
      return res.send({
        success: false,
        message: "User not found",
      });
    }

    if (String(user.otp).trim() !== String(otp).trim()) {
      return res.send({
        success: false,
        message: "Invalid OTP",
      });
    }

    if (!user.otpExpiry || user.otpExpiry.getTime() < Date.now()) {
      return res.send({
        success: false,
        message: "OTP Expired",
      });
    }

    user.otp = null;
    user.otpExpiry = null;

    await user.save();

    const token = JWT.sign({ _id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    res.send({
      success: true,
      message: "Login Successful",
      token,
      user: {
        name: user.name,
        email: user.email,
        phone: user.phone,
        currentAddress: user.currentAddress,
        addresses: user.addresses,
        role: user.role,
      },
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: "OTP verification failed",
    });
  }
};

export const resendOTPController = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).send({
        success: false,
        message: "Email is required",
      });
    }

    const user = await UserModel.findOne({ email });

    if (!user) {
      return res.status(404).send({
        success: false,
        message: "User not found",
      });
    }

    // Generate new 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // Save OTP
    user.otp = otp;
    user.otpExpiry = new Date(Date.now() + 5 * 60 * 1000);

    await user.save();

    // Send email
    try {
      await transporter.sendMail({
        from: process.env.EMAIL,
        to: user.email,
        subject: "Your New Login OTP",
        html: `
          <div style="font-family:Arial,sans-serif;padding:20px">
            <h2>Login Verification</h2>

            <p>Your new verification code is:</p>

            <h1 style="
                letter-spacing:8px;
                color:#0d6efd;
                font-size:36px;
            ">
              ${otp}
            </h1>

            <p>
              This OTP will expire in <strong>5 minutes</strong>.
            </p>

            <p>
              If you didn't request this code, please ignore this email.
            </p>
          </div>
        `,
      });
    } catch (emailError) {
      console.error("Email sending failed:", emailError.message);
      // Continue even if email fails
    }

    res.status(200).send({
      success: true,
      message: "OTP sent successfully",
    });
  } catch (error) {
    console.error("Resend OTP error:", error);

    res.status(500).send({
      success: false,
      message: "Failed to resend OTP",
      error: process.env.DEV_MODE === "development" ? error.message : "Server error",
    });
  }
};

export const forgotPasswordController = async (req, res) => {
  try {
    const { email, answer, newPassword } = req.body;
    if (!email) {
      res.status(400).send({ message: "Email is required" });
    }
    if (!answer) {
      res.status(400).send({ message: "answer is required" });
    }
    if (!newPassword) {
      res.status(400).send({ message: "New password is required" });
    }
    const user = await UserModel.findOne({ email, answer });
    if (!user) {
      return res.status(404).send({
        success: false,
        message: "Wrong Email or Answer",
      });
    }
    const hashed = await hashPassword(newPassword);
    await UserModel.findByIdAndUpdate(user._id, { password: hashed });
    res.status(200).send({
      success: true,
      message: "Password Reset Sucessfully",
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: "Something went wrong",
      error,
    });
  }
};

export const testController = async (req, res) => {
  res.send("Protected Route");
};

export const updateProfileController = async (req, res) => {
  try {
    const { name, email, password, address, phone } = req.body;
    const user = await UserModel.findById(req.user._id);
    if (password && password.length < 6) {
      return res.json({
        error: "Password is Required and should have atleast 6 characters",
      });
    }
    const hashedPassword = password ? await hashPassword(password) : undefined;
    if (address && address !== user.currentAddress) {
      user.currentAddress = address;

      if (!user.addresses.includes(address)) {
        user.addresses.push(address);
      }
    }

    user.name = name || user.name;
    user.phone = phone || user.phone;
    user.password = hashedPassword || user.password;

    await user.save();

    res.status(200).send({
      success: true,
      message: "Profile updated Successfully",
      updatedUser: user,
    });
  } catch (error) {
    res.status(400).send({
      success: false,
      message: "Error while updating Profile",
      error,
    });
  }
};

export const getOrdersController = async (req, res) => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const orders = await OrderModel.find({ buyer: req.user._id })
      .populate("products", "-photo")
      .populate("buyer", "name")
      .lean()
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });

    const total = await OrderModel.countDocuments({ buyer: req.user._id });

    res.json({
      success: true,
      total,
      page,
      pages: Math.ceil(total / limit),
      orders,
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: "Error getting Orders",
      error,
    });
  }
};

export const getAllOrdersController = async (req, res) => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    const orders = await OrderModel.find({})
      .populate("products", "-photo")
      .populate("buyer", "name")
      .lean()
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });

    const total = await OrderModel.countDocuments();

    res.json({
      success: true,
      total,
      page,
      pages: Math.ceil(total / limit),
      orders,
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: "Error getting Orders",
      error,
    });
  }
};

export const orderStatusController = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { status } = req.body;
    const orders = await OrderModel.findByIdAndUpdate(
      orderId,
      { status },
      { new: true },
    );
    res.json(orders);
  } catch (error) {
    res.status(500).send({
      success: false,
      message: "Error Updating Orders",
      error,
    });
  }
};

export const getMonthlySalesController = async (req, res) => {
  try {
    const orders = await OrderModel.find({
      status: "Delivered",
    })
      .populate("products", "price")
      .lean();

    const monthlySales = {};

    orders.forEach((order) => {
      const date = new Date(order.createdAt);

      const month = date.toLocaleString("default", {
        month: "short",
      });

      const year = date.getFullYear();

      const key = `${month} ${year}`;

      const orderTotal = order.products.reduce(
        (sum, product) => sum + (product.price || 0),
        0,
      );

      monthlySales[key] = (monthlySales[key] || 0) + orderTotal;
    });

    const result = Object.keys(monthlySales).map((month) => ({
      month,
      sales: monthlySales[month],
    }));

    res.status(200).send({
      success: true,
      sales: result,
    });
  } catch (error) {
    console.log(error);

    res.status(500).send({
      success: false,
      message: "Error fetching sales data",
      error,
    });
  }
};

export const getAllUsersController = async (req, res) => {
  try {
    const users = await UserModel.find({})
      .select("name phone")
      .sort({ createdAt: -1 });

    res.status(200).send({
      success: true,
      users,
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: "Error fetching users",
      error,
    });
  }
};
