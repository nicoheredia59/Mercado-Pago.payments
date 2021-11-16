const dotenv = require("dotenv");
dotenv.config();
const express = require("express");
const mercadopago = require("mercadopago");
const cors = require("cors");
const {json} = require("express");

const a = {
  items: [
    {
      id: "123712371623",
      category_id: "graphic cards",
      description: "its a graphic card",
      title: "RTX 3080ti",
      currency_id: "USD",
      unit_price: 1,
      quantity: 20,
    },
  ],
};

const main = async () => {
  const app = express();
  app.use(express({urlencoded: true}));
  app.use(json());
  app.use(cors());

  app.get("/", (req, res) => {
    res.send("hello");
  });

  mercadopago.configure({
    access_token: process.env.ACCESS_TOKEN,
  });

  let preference = {
    items: [a.items[0]],
    back_urls: {
      success: "http://localhost:4000/feedback",
      failure: "http://localhost:4000/feedback",
      pending: "http://localhost:4000/feedback",
    },
    auto_return: "approved",
  };

  app.post("/pay", async (res, req) => {
    const response = await mercadopago.preferences.create(preference);
    console.log(response);
    req.send({response});
  });

  app.get("/feedback", (req, res) => {
    res.json({
      Payment: req.query.payment_id,
      Status: req.query.status,
      MerchantOrder: req.query.merchant_order_id,
    });
  });

  app.listen({port: process.env.PORT || 4000}, () => {
    console.log(`server running on http://localhost:4000 🚀`);
  });
};

main();
