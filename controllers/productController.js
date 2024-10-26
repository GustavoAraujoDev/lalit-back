// controllers/produtoController.js
const Produto = require('../models/productModel');
const ProdutoService = require('../services/productService');
const logger = require('../config/logger'); // Importando o logger

class produtoController {
  static async create(req, res) {
    try {
      const { nome, descricao, preco, precovenda, quantidade } = req.body;

      const produto = new Produto(
        nome,
        descricao,
        preco,
        precovenda,
        quantidade,
      );
      logger.info(produto)
      await ProdutoService.save(produto);
      res
        .status(201)
        .json({ message: 'Produto adicionado com sucesso!', produto });
    } catch (error) {
      logger.error('Erro ao adicionar produto:', error);
      res
        .status(500)
        .json({ message: 'Erro ao adicionar produto', error: error.message });
    }
  }

  static async findAll(req, res) {
    try {
      const produtos = await ProdutoService.findAll();
      res.status(200).json(produtos);
    } catch (error) {
      logger.error('Erro ao buscar produtos:', error);
      res
        .status(500)
        .json({ message: 'Erro ao buscar produtos', error: error.message });
    }
  }

  static async findById(req, res) {
    const { productid } = req.params;
    try {
      const produto = await ProdutoService.getById(productid);
      res.status(200).json(produto);
    } catch (error) {
      logger.error('Erro ao buscar o produto:', error);
      res
        .status(404)
        .json({ message: 'Produto não encontrado', error: error.message });
    }
  }

  static async update(req, res) {
    try {
      const { nome, descricao, preco, precovenda, quantidade } = req.body;
      const productid = req.params.productid;
      logger.info(productid);
      const produto = {
        productid,
        nome,
        descricao,
        preco,
        precovenda,
        quantidade,
      };
      logger.info(produto);
      await ProdutoService.update(produto);
      res
        .status(200)
        .json({ message: 'Produto atualizado com sucesso!', produto });
    } catch (error) {
      logger.error('Erro ao atualizar produto:', error);
      res
        .status(500)
        .json({ message: 'Erro ao atualizar produto', error: error.message });
    }
  }

  static async delete(req, res) {
    logger.info(req.params);
    const {productid} = req.params;
    logger.info(productid);
    try {
      await ProdutoService.delete(productid);
      res.status(200).json({ message: 'Produto deletado com sucesso!' });
    } catch (error) {
      logger.error('Erro ao deletar produto:', error);
      res
        .status(500)
        .json({ message: 'Erro ao deletar produto', error: error.message });
    }
  }
}

module.exports = produtoController;
