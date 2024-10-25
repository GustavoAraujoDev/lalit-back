const { ref, set, get, update, remove } = require('firebase/database');
const db = require('../config/dbconfig'); // Importando a configuração do Firebase
const Venda = require('../models/salesModel'); // Importando o modelo Venda
const ItemVenda = require('../models/Itensvendas'); // Importando o modelo ItemVenda
const logger = require('../config/logger'); // Importando o logger

class VendaService {
  // Método para criar uma nova venda
  static async create(Venda) {
    logger.info(Venda)
    const VendaRef = ref(db, `Vendas/${Venda.Vendaid}`);
    try {
      await set(VendaRef, Venda);
      logger.info('Venda criada com sucesso!');
      return Venda; // Retorna a Venda criada
    } catch (error) {
      logger.error('Erro ao criar Venda:', error);
      throw error;
    }
  }

  // Método para obter todas as Vendas
  static async getAll() {
    const VendasRef = ref(db, 'Vendas');
    try {
      const snapshot = await get(VendasRef);
      if (snapshot.exists()) {
        return snapshot.val(); // Retorna todas as Vendas
      } else {
        logger.info('Nenhuma Venda encontrada.');
        return {};
      }
    } catch (error) {
      logger.error('Erro ao buscar Vendas:', error);
      throw error;
    }
  }

  // Método para obter uma Venda específica
  static async getById(Vendaid) {
    const VendaRef = ref(db, `Vendas/${Vendaid}`);
    try {
      const snapshot = await get(VendaRef);
      if (snapshot.exists()) {
        return snapshot.val(); // Retorna a Venda encontrada
      } else {
        throw new Error('Venda não encontrada');
      }
    } catch (error) {
      logger.error('Erro ao buscar a Venda:', error);
      throw error;
    }
  }

  // Método para atualizar a Venda
  static async update(Venda) {
    const VendaRef = ref(db, `Vendas/${Venda.Vendaid}`);
    Venda.updatedAt = new Date().toISOString(); // Atualiza a data de modificação
    try {
      await update(VendaRef, {
        situacao: Venda.situacao,
        updatedAt: Venda.updatedAt,
      });
      logger.info('Venda atualizada com sucesso!');
      return Venda; // Retorna a Venda atualizada
    } catch (error) {
      logger.error('Erro ao atualizar a Venda:', error);
      throw error;
    }
  }

  // Método para deletar a Venda
  static async delete(Vendaid) {
    const VendaRef = ref(db, `Vendas/${Vendaid}`);
    try {
      await remove(VendaRef);
      logger.info('Venda deletada com sucesso!');
    } catch (error) {
      logger.error('Erro ao deletar Venda:', error);
      throw error;
    }
  }

  // Métodos para gerenciar os itens de Venda

  // Método para adicionar um item à Venda
  static async createsItem(VendaId, itemVenda) {
    const itemRef = ref(db, `Vendas/${VendaId}/itens/${itemVenda.itemId}`);
    try {
      await set(itemRef, itemVenda);
      logger.info('Item adicionado à Venda com sucesso!');
      return itemVenda; // Retorna o item adicionado
    } catch (error) {
      logger.error('Erro ao adicionar item à Venda:', error);
      throw error;
    }
  }

  // Método para obter todos os itens de uma Venda
  static async getItems(VendaId) {
    const itensRef = ref(db, `Vendas/${VendaId}/itens`);
    try {
      const snapshot = await get(itensRef);
      if (snapshot.exists()) {
        return snapshot.val(); // Retorna todos os itens da Venda
      } else {
        logger.info('Nenhum item encontrado para esta Venda.');
        return {};
      }
    } catch (error) {
      logger.error('Erro ao buscar itens da Venda:', error);
      throw error;
    }
  }

  // Método para atualizar um item de Venda
  static async updateItem(VendaId, item) {
    const itemRef = ref(db, `Vendas/${VendaId}/itens/${item.itemId}`);
    try {
      await update(itemRef, {
        quantidade: item.quantidade,
        precoUnitario: item.precoUnitario,
      });
      logger.info('Item da Venda atualizado com sucesso!');
      return item; // Retorna o item atualizado
    } catch (error) {
      logger.error('Erro ao atualizar item da Venda:', error);
      throw error;
    }
  }

  // Método para deletar um item de Venda
  static async deleteItem(VendaId, itemId) {
    const itemRef = ref(db, `Vendas/${VendaId}/itens/${itemId}`);
    try {
      await remove(itemRef);
      logger.info('Item da Venda deletado com sucesso!');
    } catch (error) {
      logger.error('Erro ao deletar item da Venda:', error);
      throw error;
    }
  }
}

module.exports = VendaService;
