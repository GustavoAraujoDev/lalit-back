const clienteService = require('../services/clientService');
const Cliente = require('../models/clientModel');
const logger = require('../config/logger'); // Importando o logger
class ClienteController {
  static async create(req, res) {
    try {
      const { nome, email, cpf, telefone } = req.body;
      const cliente = new Cliente(nome, email, cpf, telefone);
      await clienteService.save(cliente);
      res
        .status(201)
        .json({ message: 'Cliente adicionado com sucesso!', cliente });
    } catch (error) {
      logger.error('Erro ao adicionar Cliente:', error);
      res
        .status(500)
        .json({ message: 'Erro ao adicionar Cliente', error: error.message });
    }
  }

  static async findById(req, res) {
    try {
      const cliente = await clienteService.findById(req.params.id);
      if (!cliente) {
        return res.status(404).json({ message: 'Cliente não encontrado' });
      }
      res.json(cliente);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  static async findAll(req, res) {
    try {
      const clientes = await clienteService.findAll();
      res.json(clientes);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  static async update(req, res) {
    try {
      const clienteId = await clienteService.update(req.params.id, req.body);
      res.json({ message: 'Cliente atualizado com sucesso', id: clienteId });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  static async delete(req, res) {
    logger.info(req.params);
    const { clientid } = req.params;
    logger.info(clientid);
    try {
      await clienteService.delete(clientid);
      res.status(200).json({ message: 'Cliente deletado com sucesso!' });
    } catch (error) {
      logger.error('Erro ao deletar Cliente:', error);
      res
        .status(500)
        .json({ message: 'Erro ao deletar Cliente', error: error.message });
    }
  }
}

module.exports = ClienteController;
