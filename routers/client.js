const { getAllClients } = require('../controllers/clientController');
const { checkAuth, authorizationRole } = require('../middlwars/checkAuth');
const router = require('express').Router();

router.use(checkAuth);
router.use(authorizationRole("ADMIN"));

//Get all clients 
router.get('/', getAllClients);

module.exports = router;