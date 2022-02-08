const controller = require('../controllers/users');
const { validEmail, validKeyPass } = require('../helpers/validation')
const router = require('express').Router();

router.post('/keypass', validEmail, controller.getKeyPass);

router.post('/activate/keypass/:token', validKeyPass, controller.activateKeyPass);

router.get('/find/edit-mode/:id', controller.findEditModeKey);

router.post('/edit-mode', controller.getEditModeKey);

router.post('/activate/edit-mode/:token', controller.activateEditMode);

router.post('/edit-mode/:id', controller.turnOnEditMode);

router.post('/recover/edit-mode', controller.recoverEditKey)

router.post('/reset/edit-mode', controller.resetEditKey);

router.post('/login', controller.login);

router.post('/forgot-password', controller.forgotPassword);

router.post('/reset-password', controller.resetPassword);

router.post('/logged-users', controller.getLoggedUsers)

module.exports = router;