const controller = require('../controllers/users');
const { validEmail, validKeyPass } = require('../helpers/validation')
const router = require('express').Router();

router.post('/keypass', validEmail, controller.getKeyPass);

router.post('/activate/keypass/:token', validKeyPass, controller.activateKeyPass);

router.post('/login', controller.login);

router.get('/find/edit-mode', controller.findEditModeKey);

router.post('/edit-mode', controller.getEditModeKey);

// router.post('/activate/edit-mode/:token', controller.activateEditMode);

module.exports = router;