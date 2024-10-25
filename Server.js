const fs = require('fs');
const path = require('path');
const { Sequelize } = require('sequelize');
const express = require('express');
const cors = require('cors');
const routesProduct = require('./Routes/ProductRoutes');
const routesVendas = require('./Routes/VendasRoutes');
const routesCliente = require('./Routes/ClienteRoutes');
const errorHandler = require('./middleware/errorHandler');
const PORT = 6060;
const sequelize = require('./config/dbconfig');
const Logger = require('./config/logger');
const http = require('http');

const app = express();

const corsOptions = {
  origin: '*',
  optionsSuccessStatus: 200,
};

app.use(cors(corsOptions));
app.use(express.json());
app.use('/Produtos', routesProduct);
app.use('/Vendas', routesVendas);
app.use('/Clientes', routesCliente);
app.use(errorHandler);
app.use((req, res) => {
  res.status(404).json({ message: 'Rota não encontrada' });
});

const startServer = async () => {
  try {
    const controlFilePath = path.join(__dirname, 'db_initialized.txt');

    if (!fs.existsSync(controlFilePath)) {
      await sequelize
        .sync({ force: true }) // Se deseja forçar a recriação das tabelas
        .then(() => {
          console.log('Database synchronized');
          fs.writeFileSync(controlFilePath, 'Database initialized.');
        })
        .catch((err) => {
          console.error('Error synchronizing database:', err);
        });
    } else {
      console.log('Database already initialized.');
    }

    
    http.createServer(app).listen(PORT, () => {
      Logger.info(`Server is running on https://localhost:${PORT}`);
    });
  } catch (error) {
    Logger.error('Unable to connect to the database:', error);
  }
};

startServer();