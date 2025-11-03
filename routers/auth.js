const { current, login } = require('../controllers/authController');
const { checkAuth } = require('../middlwars/checkAuth');

const router = require('express').Router();

//Login 
router.post('/login', login);

//Curent user
router.get('/current', checkAuth, current);

module.exports = router