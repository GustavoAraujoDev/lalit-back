const VendaService = require('../services/salesService'); // Importando o serviço de Venda
const ItemVenda = require('../models/Itensvendas');
const Venda = require('../models/salesModel');
const logger = require('../config/logger'); // Importando o logger

class VendaController {
  // Método para criar uma nova venda
  static async create(req, res) {
    console.log(req.body);
    const { totalprice, pagamento, situacao, productids, clientid, items } =
      req.body;
    const venda = new Venda(
      totalprice,
      pagamento,
      situacao,
      productids,
      clientid,
    );
    try {
      await VendaService.create(venda);
      await VendaController.createItem(items, venda.Vendaid, res);
      logger.info(`Venda criada com sucesso: ${JSON.stringify(venda)}`);
      return res
        .status(201)
        .json({ message: 'Venda adicionado com sucesso!', venda });
    } catch (error) {
      logger.error(`Erro ao criar venda: ${error.message}`);
      return res
        .status(500)
        .json({ message: 'Erro ao criar venda', error: error.message });
    }
  }

  // Método para obter todas as vendas
  static async getAll(req, res) {
    try {
      const vendas = await VendaService.getAll();
      logger.info('Todas as vendas recuperadas com sucesso');
      return res.status(200).json(vendas);
    } catch (error) {
      logger.error(`Erro ao buscar vendas: ${error.message}`);
      return res
        .status(500)
        .json({ message: 'Erro ao buscar vendas', error: error.message });
    }
  }

  // Método para obter uma venda específica por ID
  static async getById(req, res) {
    const { vendaId } = req.params;

    try {
      const venda = await VendaService.getById(vendaId);
      logger.info(`Venda recuperada com sucesso: ${JSON.stringify(venda)}`);
      return res.status(200).json(venda);
    } catch (error) {
      logger.error(`Erro ao buscar a venda: ${error.message}`);
      return res
        .status(404)
        .json({ message: 'Venda não encontrada', error: error.message });
    }
  }

  // Método para atualizar uma venda
  static async update(req, res) {
    const {Vendaid, situacao} = req.body;

    try {
      const venda = {
        Vendaid, situacao
      }
      await VendaService.update(venda);
      logger.info(
        `Venda atualizada com sucesso: ${JSON.stringify(venda)}`,
      );
      return res.status(200).json({ message: 'Venda atualizada com sucesso:', venda });
    } catch (error) {
      logger.error(`Erro ao atualizar venda: ${error.message}`);
      return res
        .status(500)
        .json({ message: 'Erro ao atualizar venda', error: error.message });
    }
  }

  // Método para deletar uma venda
  static async delete(req, res) {
    const { vendaId } = req.params;

    try {
      await VendaService.delete(vendaId);
      logger.info(`Venda deletada com sucesso: ${vendaId}`);
      return res.status(204).send(); // Retorna 204 No Content
    } catch (error) {
      logger.error(`Erro ao deletar venda: ${error.message}`);
      return res
        .status(500)
        .json({ message: 'Erro ao deletar venda', error: error.message });
    }
  }

  // Método para adicionar itens à venda
  static async createItem(items, vendaid, res) {
    try {
      for (const item of items) {
        const { productid, nome, descricao, preco, precovenda, quantidade } =
          item;

        const itemVenda = new ItemVenda(
          productid,
          nome,
          descricao,
          preco,
          precovenda,
          quantidade,
        );

        // Adicionar item à venda no serviço
        await VendaService.createsItem(vendaid, itemVenda);
        logger.info(
          `Item adicionado à venda ${vendaid}: ${JSON.stringify(itemVenda)}`,
        );
      }

      // Responder sucesso após adicionar todos os itens
      res.status(201).json({ message: 'Itens adicionados com sucesso!' });
    } catch (error) {
      logger.error(`Erro ao adicionar itens à venda: ${error.message}`);
      return res
        .status(500)
        .json({
          message: 'Erro ao adicionar itens à venda',
          error: error.message,
        });
    }
  }

  // Método para obter todos os itens de uma venda
  static async getItems(req, res) {
    const { id } = req.params;

    try {
      const itens = await VendaService.getItems(id);
      logger.info(`Itens da venda ${id} recuperados com sucesso`);
      return res.status(200).json(itens);
    } catch (error) {
      logger.error(`Erro ao buscar itens da venda: ${error.message}`);
      return res
        .status(500)
        .json({
          message: 'Erro ao buscar itens da venda',
          error: error.message,
        });
    }
  }

  // Método para atualizar um item da venda
  static async updateItem(req, res) {
    const { vendaId } = req.params;
    const item = req.body;

    try {
      const itemAtualizado = await VendaService.updateItem(vendaId, item);
      logger.info(
        `Item da venda ${vendaId} atualizado com sucesso: ${JSON.stringify(
          itemAtualizado,
        )}`,
      );
      return res.status(200).json(itemAtualizado);
    } catch (error) {
      logger.error(`Erro ao atualizar item da venda: ${error.message}`);
      return res
        .status(500)
        .json({
          message: 'Erro ao atualizar item da venda',
          error: error.message,
        });
    }
  }

  // Método para deletar um item da venda
  static async deleteItem(req, res) {
    const { vendaId, itemId } = req.params;

    try {
      await VendaService.deleteItem(vendaId, itemId);
      logger.info(`Item ${itemId} da venda ${vendaId} deletado com sucesso`);
      return res.status(204).send(); // Retorna 204 No Content
    } catch (error) {
      logger.error(`Erro ao deletar item da venda: ${error.message}`);
      return res
        .status(500)
        .json({
          message: 'Erro ao deletar item da venda',
          error: error.message,
        });
    }
  }
}

module.exports = VendaController;
