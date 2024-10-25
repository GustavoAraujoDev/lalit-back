const express = require('express');
const vendaController = require('../controllers/salesController');
const { vendaSchema } = require('../middleware/salesValidation');
const validate = require('../middleware/validateRequest');
const router = express.Router();

router.post('/', validate(vendaSchema), vendaController.create);
router.post('/itens', validate(vendaSchema), vendaController.createItem);
router.get('/', vendaController.getAll);
router.get('/:Vendaid', vendaController.getById);
router.get('/itens/:Vendaid', vendaController.getItems);
router.put('/:Vendaid', vendaController.update);
router.delete('/:Vendaid', vendaController.delete);
router.delete('/itens/:Vendaid', vendaController.deleteItem);
module.exports = router;
