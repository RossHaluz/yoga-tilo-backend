const crypto = require("crypto");

// Функція для генерації підпису
function generateSignature(data) {
    const MERCHANT_SECRET_KEY = process.env.WAYFORPAY_SECRET_KEY;
    
  const signatureString = [
    data.merchantAccount,
    data.merchantDomainName,
    data.orderReference,
    data.orderDate,
    data.amount,
    data.currency,
    ...(data.productName || []),
    ...(data.productCount || []),
    ...(data.productPrice || []),
  ].join(";");

  return crypto
    .createHmac("md5", MERCHANT_SECRET_KEY)
    .update(signatureString)
    .digest("hex");
}

module.exports = generateSignature;
