const Joi = require('joi');

const clienteSchema = Joi.object({
  nome: Joi.string().required(),
  email: Joi.string().email().required(),
  cpf: Joi.string()
    .pattern(/^\d{3}\.\d{3}\.\d{3}\-\d{2}$|^\d{11}$/)
    .required(), // CPF com ou sem formatação
  telefone: Joi.string()
    .pattern(/^\d{10,11}$/)
    .required(), // Apenas números, 10 ou 11 dígitos
});

module.exports = clienteSchema;
