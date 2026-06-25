import braintree from "braintree";
import PaymentConfig from "../models/PaymentConfigModel.js";

const getGateway = async () => {
  const config = await PaymentConfig.findOne();

  if (!config) {
    throw new Error("Braintree configuration not found");
  }

  return new braintree.BraintreeGateway({
    environment:
      config.environment === "Production"
        ? braintree.Environment.Production
        : braintree.Environment.Sandbox,

    merchantId: config.merchantId,

    publicKey: config.publicKey,

    privateKey: config.privateKey,
  });
};

export default getGateway;
