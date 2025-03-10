const paypal = require("paypal-rest-sdk");

paypal.configure({
  mode: "sandbox",
  client_id: "Aa1Ed0WJfCXYLJGApm6mZFmvPvnMfLXIDME1lI83ojM94bcf8jySBL1eyvnbqP5NQ8wL5WNx1QKVWP3J",
  client_secret: "ECD0UXoPIzyLh_kc3uhNGyuKCnvs1uGTmhrTL_R0j7G-NEGJzUCLpTc6YZ2y8fyIg8mBQ15dusiBiwx7",
});

module.exports = paypal;
const express = require('express');
const router = express.Router();

router.post('/api/payment', (_req, res) => {
  // Temporary response for testing without PayPal
  res.json({ success: true, message: 'Payment processing skipped for now.' });
});
module.exports = router;