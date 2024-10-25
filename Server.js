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

const app = express();

// Middleware de CORS
const corsOptions = {
  origin: '*', // Permitir todas as origens
  methods: '*', // Métodos permitidos
  allowedHeaders: '*', 
  preflightContinue: false,
  optionsSuccessStatus: 204, // Cabeçalhos permitidos
};

// Aplicar o middleware CORS
app.use(cors(corsOptions));
app.options('*', cors(corsOptions)); // Responder a todas as OPTIONS

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
