const {  ctrlWrapper, generateSignature, verifySignature } = require("../helpers");
const prismadb = require("../prisma-client");

  const MERCHANT_ACCOUNT = process.env.WAYFORPAY_MERCHANT_ACCOUNT;
  const MERCHANT_DOMAIN = process.env.WAYFORPAY_DOMAIN;

exports.createPayment = ctrlWrapper(async(req, res) => {
  const { tarrifName, amount } = req.body;

  const orderReference = `ORDER_${Date.now()}`;
  const orderDate = Math.floor(Date.now() / 1000);

   const paymentData = {
     merchantAccount: MERCHANT_ACCOUNT,
     merchantDomainName: MERCHANT_DOMAIN,
     orderReference: orderReference,
     orderDate: orderDate,
     amount: amount,
     currency: "UAH",
     productName: [tarrifName],
     productCount: [1],
     productPrice: [amount],
     // URL для редиректу після оплати
     serviceUrl: `${process.env.BACKEND_URL}/api/payment/callback`,
     returnUrl: `${process.env.FRONTEND_URL}/payment/success/${orderReference}`,
   };

    paymentData.merchantSignature = generateSignature(paymentData);

    await prismadb.client.create({
      data: {
        orderReference,
        productName: tarrifName,
        productCount: 1,
        productPrice: amount
      }
    })

  return res.status(201).json(paymentData);
});

exports.callbackPay = ctrlWrapper(async (req, res) =>{
          const paymentData = req.body;
          console.log("Payment callback received:", paymentData);

           if (!verifySignature(paymentData)) {
             console.error("Invalid signature");
             return res.status(400).json({
               orderReference: paymentData.orderReference,
               status: "decline",
               time: Math.floor(Date.now() / 1000),
             });
           }

         if (paymentData.transactionStatus === "Approved") {
           console.log("Payment approved:", paymentData.orderReference);

           
           res.json({
             orderReference: paymentData.orderReference,
             status: "accept",
             time: Math.floor(Date.now() / 1000),
           });
         } else {
           console.log("Payment declined:", paymentData.orderReference);

           res.json({
             orderReference: paymentData.orderReference,
             status: "decline",
             time: Math.floor(Date.now() / 1000),
           });
         }

          await prismadb.client.update({
            where: {
              orderReference: paymentData.orderReference,
            },
            data: {
              transactionStatus: paymentData.transactionStatus,
            },
          });
});

exports.getOrderStatus = ctrlWrapper(async (req, res) => {
  const {orderReference} = req.params;

  const orderStatus = await prismadb.client.findFirst({
    where: {
      orderReference
    }, 
    select: {
      transactionStatus: true
    }
  })

  console.log(orderStatus);

  return res.status(200).json(orderStatus);
})