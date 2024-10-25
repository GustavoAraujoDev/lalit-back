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

// Middleware de CORS - permitindo todas as origens e todos os cabeçalhos
app.use(cors({
  origin: '*', // Permitir todas as origens
  methods: '*', // Permitir todos os métodos
  allowedHeaders: '*' // Permitir todos os cabeçalhos
}));

// Middleware para aceitar JSON
app.use(express.json());

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
