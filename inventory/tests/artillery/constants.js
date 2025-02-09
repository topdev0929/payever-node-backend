const USER = {
  businessId: "37edda36-c346-4b06-9d2c-1e17b9d22ba5",
  userId: "c6e6b1a6-e7c7-48ee-979c-5886904e2f9a",
};

const CONFIG = {
  target: "https://inventory-backend.test.devpayever.com",
  variables: {
    authUrl: "https://auth.test.devpayever.com",
    businessId: "37edda36-c346-4b06-9d2c-1e17b9d22ba5",
    email: "artillery@payever.de",
    plainPassword: "Payever123!",
  },
  configFile: `${__dirname}/processors/config.js`,
  http: {
    timeout: 15,
  },
  default: {
    headers: {
      "content-type": "application/json",
      "user-agent": "Artillery (https://artillery.io)",
    },
  },
};

const ORDER = {
  orderId: "",
};

const PRODUCT = {
  productId: "048d7a3c-5a4e-4e0e-aeab-438de52fa610",
};

const SKU = {
  sku: "BHH-938",
};

const INVENTORY = {
  inventoryId: "",
  inventoryLocationId: "",
};

module.exports = {
  CONFIG,
  USER,
  ORDER,
  PRODUCT,
  SKU,
  INVENTORY,
};
