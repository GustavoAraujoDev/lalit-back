const { initializeApp } = require('firebase/app');
const { getDatabase, ref, set } = require('firebase/database');
require('dotenv').config();

// Carregando variáveis de ambiente do arquivo .env

// Sua configuração do Firebase
const firebaseConfig = {
  apiKey: "AIzaSyDBt24CSYkeY1_bPnePe6Ht_FY2BtNImos",
  authDomain: "lalitaapp-97f70.firebaseapp.com",
  projectId: "lalitaapp-97f70",
  storageBucket: "lalitaapp-97f70.appspot.com",
  messagingSenderId: "885008069777",
  appId: "1:885008069777:web:0bb922fc096c6c52433b30"
};

// Inicializando o Firebase
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

// Exportando a instância do banco de dados
module.exports = db;
