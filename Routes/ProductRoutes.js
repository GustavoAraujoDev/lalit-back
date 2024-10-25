const express = require('express');
const produtoController = require('../controllers/productController');
const validate = require('../middleware/validateRequest');
const produtoSchema = require('../middleware/productValidation');
const router = express.Router();

router.post('/', validate(produtoSchema), produtoController.create);
router.get('/', produtoController.findAll);
router.get('/:productid', produtoController.findById);
router.put('/:productid', validate(produtoSchema), produtoController.update);
router.delete('/:productid', produtoController.delete);

module.exports = router;
