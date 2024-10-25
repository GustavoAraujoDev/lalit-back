const db = require('../config/dbconfig');
const Cliente = require('../models/clientModel');
const { ref, set, get, update, remove } = require('firebase/database');
const logger = require('../config/logger'); // Importando o logger

class ClienteService {
  static async save(clienteData) {
    const clienteRef = ref(db, `Clientes/${clienteData.clientid}`);
    try {
      await set(clienteRef, clienteData);
      logger.info('Cliente salvo com sucesso!');
      return clienteData; // Retorna o produto salvo
    } catch (error) {
      logger.error('Erro ao salvar o produto:', error);
      throw error;
    }
  }

  static async findById(clientid) {
    const ClienteRef = ref(db, `Clientes/${clientid}`);
    try {
      const snapshot = await get(ClienteRef);
      if (snapshot.exists()) {
        return snapshot.val(); // Retorna o Cliente encontrado
      } else {
        throw new Error('Cliente não encontrado');
      }
    } catch (error) {
      logger.error('Erro ao buscar o Cliente:', error);
      throw error;
    }
  }

  static async findAll() {
    const ClientesRef = ref(db, 'Clientes');
    try {
      const snapshot = await get(ClientesRef);
      if (snapshot.exists()) {
        return snapshot.val(); // Retorna todos os Clientes
      } else {
        logger.info('Nenhum produto encontrado.');
        return null;
      }
    } catch (error) {
      logger.error('Erro ao buscar Clientes:', error);
      throw error;
    }
  }

  static async update(id, clienteData) {
    const cliente = new Cliente(
      clienteData.nome,
      clienteData.email,
      clienteData.cpf,
      clienteData.telefone,
    );

    // Validações
    Cliente.validarEmail(cliente.email);
    Cliente.validarCpf(cliente.cpf);
    Cliente.validarTelefone(cliente.telefone);

    const clienteRef = ref(db, `clientes/${id}`);
    await update(clienteRef, {
      nome: cliente.nome,
      email: cliente.email,
      cpf: cliente.cpf,
      telefone: cliente.telefone,
      updatedAt: new Date().toISOString(),
    });
    return id; // Retorna o ID atualizado
  }

  static async delete(clientid) {
    const ClienteRef = ref(db, `Clientes/${clientid}`);
    try {
      await remove(ClienteRef);
      logger.info('Cliente deletado com sucesso!');
    } catch (error) {
      logger.error('Erro ao deletar o Cliente:', error);
      throw error;
    }
  }
}

module.exports = ClienteService;
