const fs = require('fs');
const path = require('path');
const express = require('express');
const routesProduct = require('./Routes/ProductRoutes');
const routesVendas = require('./Routes/VendasRoutes');
const routesCliente = require('./Routes/ClienteRoutes');
const errorHandler = require('./middleware/errorHandler');
const PORT = 6060;
const sequelize = require('./config/dbconfig');
const Logger = require('./config/logger');
const http = require('http');

const app = express();

// Middleware de CORS manual
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "https://lalita-sigma.vercel.app"); // Substitua pela URL do seu frontend
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept"); // Removido 'Authorization'
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS"); // Adicionei o método OPTIONS
  next();
});

// Responde automaticamente às requisições OPTIONS
app.options('*', (req, res) => {
  res.sendStatus(200);
});

// Middleware para aceitar JSON
app.use(express.json());

// Rotas
app.use('/Produtos', routesProduct);
app.use('/Vendas', routesVendas);
app.use('/Clientes', routesCliente);
app.use(errorHandler);

// Rota 404 para rotas inexistentes
app.use((req, res) => {
  res.status(404).json({ message: 'Rota não encontrada' });
});

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
