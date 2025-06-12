const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const apiRoutes = require('./routes/api');

const app = express();

// Seguridad y configuraciones
app.use(helmet());
app.use(cors({ origin: '*' }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rutas
app.use('/api', apiRoutes);

// Página principal
app.get('/', (req, res) => {
  res.send('Stock Price Checker is live!');
});

// Iniciar servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(Server running on port ${PORT});
});

module.exports = app;
