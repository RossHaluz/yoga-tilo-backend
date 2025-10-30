const { createPayment, callbackPay } = require('../controllers/payControllers');

const router = require('express').Router();

//Creaete payment 
router.post('/', createPayment);

//Wayforpay callback
router.post("/callback", callbackPay);

module.exports = router;