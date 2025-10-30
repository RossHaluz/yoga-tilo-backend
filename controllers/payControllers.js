const { httpError, ctrlWrapper } = require("../helpers");
const prismadb = require("../prisma-client");
const crypto = require('crypto');

exports.createPayment = ctrlWrapper(async(req, res) => {
    const { tarrifName, amount } = req.body;

      const merchantAccount = process.env.WAYFORPAY_MERCHANT_ACCOUNT;
    const merchantSecret = process.env.WAYFORPAY_SECRET_KEY;
    const merchantDomainName = process.env.FRONTEND_URL.replace(
      /^https?:\/\//,
      ""
    ); 

      const orderReference = `ORDER_${Date.now()}`;
      const orderDate = Math.floor(Date.now() / 1000);

      const productName = [tarrifName];
      const productCount = ["1"];
      const productPrice = [Number(amount).toFixed(2)];

        const signatureArray = [
          merchantAccount,
          merchantDomainName,
          orderReference,
          String(orderDate),
          Number(amount).toFixed(2),
          "UAH",
          ...productName,
          ...productCount,
          ...productPrice,
        ];

        const signatureString = signatureArray.join(";");

        const merchantSignature = crypto
          .createHmac("md5", merchantSecret)
          .update(signatureString)
          .digest("hex");

        const paymentData = {
          merchantAccount,
          merchantDomainName,
          orderReference,
          orderDate,
          amount: Number(amount).toFixed(2),
          currency: "UAH",
          productName,
          productCount,
          productPrice,
          merchantSignature,
          serviceUrl: `${process.env.BACKEND_URL}/api/wayforpay/callback`,
          returnUrl: `${process.env.FRONTEND_URL}/payment-result`,
        };

        return res.status(201).json(paymentData);
});

exports.callbackPay = ctrlWrapper(async (req, res) =>{
        const body = req.body;
        console.log("WAYFORPAY CALLBACK BODY:", body);

        const { transactionStatus, orderReference, reason } = body;

        return res
          .status(200)
          .json({ orderReference, status: transactionStatus, reason });
});