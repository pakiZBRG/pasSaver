const controller = require('../controllers/passwords');
const { validPassword } = require('../helpers/validation')
const router = require('express').Router();

router.get('/', controller.getPasswords)

router.post('/new', validPassword, controller.newPassword);

router.put('/:id', validPassword, controller.editPassword);

router.delete('/:id', controller.removePassword);

module.exports = router;