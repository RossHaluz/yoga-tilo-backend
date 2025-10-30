const { createPayment, callbackPay, getOrderStatus } = require('../controllers/payControllers');

const router = require('express').Router();

//Creaete payment 
router.post('/', createPayment);

//Wayforpay callback
router.post("/callback", callbackPay);

//Get status by order
router.get("/status/:orderReference", getOrderStatus);

module.exports = router;