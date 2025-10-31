const crypto = require("crypto");

// Функція для верифікації підпису від WayForPay
function verifySignature(data) {
  const MERCHANT_SECRET_KEY = "flk3409refn54t54t*FNJRET";

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

module.exports = verifySignature;
