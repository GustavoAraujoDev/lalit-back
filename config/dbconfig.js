const { initializeApp } = require('firebase/app');
const { getDatabase, ref, set } = require('firebase/database');
require('dotenv').config();

// Carregando variáveis de ambiente do arquivo .env

// Sua configuração do Firebase
const firebaseConfig = {
  apiKey: 'AIzaSyAXDfdRG9H2rK2mEnCUaXLMVuHObWfvCsE',
  authDomain: 'testes-19dc4.firebaseapp.com',
  projectId: 'testes-19dc4',
  storageBucket: 'testes-19dc4.appspot.com',
  messagingSenderId: '400866154921',
  appId: '1:400866154921:web:ba0e427bf2243030334cb8',
};

// Inicializando o Firebase
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

// Exportando a instância do banco de dados
module.exports = db;
