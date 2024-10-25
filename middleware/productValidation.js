const Joi = require('joi');

const produtoSchema = Joi.object({
  productid: Joi.number().integer().positive().optional(),
  nome: Joi.string().required(),
  descricao: Joi.string().optional(),
  preco: Joi.number().positive().required(),
  precovenda: Joi.number().positive().optional(),
  quantidade: Joi.number().integer().positive().optional(),
});

module.exports = produtoSchema;
