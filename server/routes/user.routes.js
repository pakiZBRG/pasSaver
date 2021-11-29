const controller = require('../controllers/users');
const { validEmail, validKeyPass } = require('../helpers/validation')
const router = require('express').Router();

router.post('/keypass', validEmail, controller.getKeyPass);

router.post('/activate/:token', validKeyPass, controller.activate);

router.post('/login', controller.login);

module.exports = router;