// services/produtoService.js
const produto = require('../models/productModel');
const { ref, set, get, update, remove } = require('firebase/database');
const db = require('../config/dbconfig'); // Importando a configuração do Firebase
const logger = require('../config/logger'); // Importando o logger

class ProdutoService {
  // Método para salvar o produto
  static async save(produto) {
    logger.info(produto);
    const produtoRef = ref(db, `produtos/${produto.productid}`);
    try {
      await set(produtoRef, produto);
      logger.info('Produto salvo com sucesso!');
      return produto; // Retorna o produto salvo
    } catch (error) {
      logger.error('Erro ao salvar o produto:', error);
      throw error;
    }
  }

  // Método para obter todos os produtos
  static async findAll() {
    const produtosRef = ref(db, 'produtos');
    try {
      const snapshot = await get(produtosRef);
      if (snapshot.exists()) {
        return snapshot.val(); // Retorna todos os produtos
      } else {
        logger.info('Nenhum produto encontrado.');
        return null;
      }
    } catch (error) {
      logger.error('Erro ao buscar produtos:', error);
      throw error;
    }
  }

  // Método para obter um produto específico
  static async getById(productid) {
    const produtoRef = ref(db, `produtos/${productid}`);
    try {
      const snapshot = await get(produtoRef);
      if (snapshot.exists()) {
        return snapshot.val(); // Retorna o produto encontrado
      } else {
        throw new Error('Produto não encontrado');
      }
    } catch (error) {
      logger.error('Erro ao buscar o produto:', error);
      throw error;
    }
  }

  // Método para atualizar o produto
  static async update(produto) {
    const produtoRef = ref(db, `produtos/${produto.productid}`);
    produto.updatedAt = new Date().toISOString(); // Atualiza a data de modificação
    try {
      await update(produtoRef, {
        nome: produto.nome,
        descricao: produto.descricao,
        preco: produto.preco,
        precovenda: produto.precovenda,
        quantidade: produto.quantidade,
        updatedAt: produto.updatedAt,
      });
      logger.info('Produto atualizado com sucesso!');
      return produto; // Retorna o produto atualizado
    } catch (error) {
      logger.error('Erro ao atualizar o produto:', error);
      throw error;
    }
  }

  // Método para deletar o produto
  static async delete(productid) {
    const produtoRef = ref(db, `produtos/${productid}`);
    try {
      await remove(produtoRef);
      logger.info('Produto deletado com sucesso!');
    } catch (error) {
      logger.error('Erro ao deletar o produto:', error);
      throw error;
    }
  }
}

module.exports = ProdutoService;
