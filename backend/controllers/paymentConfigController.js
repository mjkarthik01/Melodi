import PaymentConfig from "../models/PaymentConfigModel.js";

export const getPaymentConfig = async (req, res) => {
  try {
    const config = await PaymentConfig.findOne();

    res.status(200).send({
      success: true,
      config,
    });
  } catch (error) {
    console.log(error);

    res.status(500).send({
      success: false,
      message: "Error loading payment config",
    });
  }
};

export const savePaymentConfig = async (req, res) => {
  try {
    const { merchantId, publicKey, privateKey, environment } = req.body;

    let config = await PaymentConfig.findOne();

    if (config) {
      config = await PaymentConfig.findByIdAndUpdate(
        config._id,
        {
          merchantId,
          publicKey,
          privateKey,
          environment,
        },
        { new: true },
      );
    } else {
      config = await PaymentConfig.create({
        merchantId,
        publicKey,
        privateKey,
        environment,
      });
    }

    res.status(200).send({
      success: true,
      message: "Payment settings updated",
      config,
    });
  } catch (error) {
    console.log(error);

    res.status(500).send({
      success: false,
      message: "Error saving config",
    });
  }
};
