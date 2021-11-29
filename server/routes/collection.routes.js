const controller = require('../controllers/collections');
const { validCollection } = require('../helpers/validation')
const router = require('express').Router();

router.get('/', controller.getCollections)

router.post('/new', validCollection, controller.newCollection);

router.put('/:id', validCollection, controller.editCollection);

router.delete('/:id', controller.removeCollection)

module.exports = router;