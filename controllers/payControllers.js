const { ctrlWrapper, httpError } = require("../helpers");
const prismadb = require("../prisma-client");
const crypto = require("crypto");

const MERCHANT_ACCOUNT = process.env.WAYFORPAY_MERCHANT_ACCOUNT;
const MERCHANT_DOMAIN = process.env.WAYFORPAY_DOMAIN;
const MERCHANT_SECRET_KEY = process.env.WAYFORPAY_SECRET_KEY;

// Генерація підпису для WayForPay
function generateSignature(data) {
  const signatureString = [
    data.merchantAccount,
    data.merchantDomainName,
    data.orderReference,
    data.orderDate,
    data.amount,
    data.currency,
    data.productName,
    data.productCount,
    data.productPrice,
  ].join(";");

  console.log(signatureString);

  return crypto
    .createHmac("md5", MERCHANT_SECRET_KEY)
    .update(signatureString)
    .digest("hex");
}

// Верифікація підпису від WayForPay
function verifySignature(data) {
  const signatureString = [
    data.merchantAccount,
    data.orderReference,
    data.amount,
    data.currency,
    data.authCode,
    data.cardPan,
    data.transactionStatus,
    data.reasonCode,
  ].join(";");

  const calculatedSignature = crypto
    .createHmac("md5", MERCHANT_SECRET_KEY)
    .update(signatureString)
    .digest("hex");

  return calculatedSignature === data.merchantSignature;
}

// Створення платежу
exports.createPayment = ctrlWrapper(async (req, res) => {
  const { tarrifName, amount } = req.body;

  const orderReference = `ORDER_${Date.now()}`;
  const orderDate = Math.floor(Date.now() / 1000);

  const paymentData = {
    merchantAccount: MERCHANT_ACCOUNT,
    merchantDomainName: MERCHANT_DOMAIN,
    orderReference,
    orderDate,
    amount,
    currency: "UAH",
    productName: tarrifName,
    productCount: 1,
    productPrice: amount,
    serviceUrl: `${process.env.BACKEND_URL}/api/wayforpay/callback`,
    returnUrl: `${process.env.FRONTEND_URL}/payment/success/${orderReference}`,
  };

  paymentData.merchantSignature = generateSignature(paymentData);

  await prismadb.client.create({
    data: {
      orderDate,
      orderReference,
      productName: tarrifName,
      productCount: 1,
      productPrice: amount,
      transactionStatus: "pending",
    },
  });

  console.log('Payment success created');

  res.status(201).json(paymentData);
});

// Callback від WayForPay
exports.callbackPay = ctrlWrapper(async (req, res) => {
  let paymentData = req.body;

   if (
     Object.keys(paymentData).length === 1 &&
     paymentData[Object.keys(paymentData)[0]] === ""
   ) {
     paymentData = JSON.parse(Object.keys(paymentData)[0]);
   }

     console.log("Payment callback received:", paymentData);

  if (!verifySignature(paymentData)) {
    console.error("Invalid signature");
    return res.status(400).json({
      orderReference: paymentData.orderReference,
      status: "decline",
      time: Math.floor(Date.now() / 1000),
    });
  }

  const status =
    paymentData.transactionStatus === "Approved" ? "accept" : "decline";

  // Оновлюємо статус у БД
 const updateClient = await prismadb.client.update({
    where: { orderReference: paymentData.orderReference },
    data: { transactionStatus: paymentData.transactionStatus },
  });

  if(!updateClient) throw httpError(400, "Something went wrong");

   console.log("✅ Payment status updated in DB");

  res.json({
    orderReference: paymentData.orderReference,
    status,
    time: Math.floor(Date.now() / 1000),
  });
});

// Отримання статусу замовлення
exports.getOrderStatus = ctrlWrapper(async (req, res) => {
  const { orderReference } = req.params;

  const orderStatus = await prismadb.client.findFirst({
    where: { orderReference },
    select: { transactionStatus: true },
  });

  res.status(200).json(orderStatus);
});
