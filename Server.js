const fs = require('fs');
const path = require('path');
const express = require('express');
const cors = require('cors'); // Adicionando o middleware CORS
const routesProduct = require('./Routes/ProductRoutes');
const routesVendas = require('./Routes/VendasRoutes');
const routesCliente = require('./Routes/ClienteRoutes');
const errorHandler = require('./middleware/errorHandler');
const PORT = 6060;
const sequelize = require('./config/dbconfig');
const Logger = require('./config/logger');
const http = require('http');
const bodyParser = require('body-parser');

const app = express();
// Middleware para fazer o parsing do corpo da requisição
app.use(bodyParser.json());

// Lista de origens permitidas
const allowedOrigins = [
    'https://lalita-sigma.vercel.app',
    '*' // Adicione mais origens conforme necessário
];

// Middleware para CORS manual
app.use((req, res, next) => {
    const origin = req.headers.origin;

    // Verifica se a origem da requisição é permitida
    if (allowedOrigins.includes(origin)) {
        res.setHeader('Access-Control-Allow-Origin', origin);
    }

    // Permitir métodos
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    
    // Permitir cabeçalhos
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

    // Se for uma requisição preflight, responder com 204
    if (req.method === 'OPTIONS') {
        return res.sendStatus(204);
    }

    // Prosseguir com o próximo middleware ou rota
    next();
});

// Aplicar o middleware CORS
app.use(cors()); // Responder a todas as OPTIONS

// Middleware para aceitar JSON
app.use(express.json());

// Middleware para tratamento de preflight (OPTIONS)
app.options('*', (req, res) => {
  res.header('Access-Control-Allow-Origin', '*'); // Permitir todas as origens
  res.header('Access-Control-Allow-Methods', '*'); // Métodos permitidos
  res.header('Access-Control-Allow-Headers', '*'); // Cabeçalhos permitidos
  res.sendStatus(204); // Resposta OK sem conteúdo
});

// Rotas
app.use('/Produtos', routesProduct);
app.use('/Vendas', routesVendas);
app.use('/Clientes', routesCliente);

// Middleware de tratamento de erros
app.use(errorHandler);

// Rota 404 para rotas inexistentes
app.use((req, res) => {
  res.status(404).json({ message: 'Rota não encontrada' });
});

// Inicialização do servidor
const startServer = async () => {
  try {
    const controlFilePath = path.join(__dirname, 'db_initialized.txt');

    if (!fs.existsSync(controlFilePath)) {
      await sequelize.sync({ force: true }) // Forçar a recriação das tabelas
        .then(() => {
          Logger.info('Database synchronized');
          fs.writeFileSync(controlFilePath, 'Database initialized.');
        })
        .catch((err) => {
          Logger.error('Error synchronizing database:', err);
        });
    } else {
      Logger.info('Database already initialized.');
    }

    http.createServer(app).listen(PORT, () => {
      Logger.info(`Server is running on http://localhost:${PORT}`);
    });
  } catch (error) {
    Logger.error('Unable to connect to the database:', error);
  }
};

startServer();
