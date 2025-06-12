const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const apiRoutes = require('./routes/api');

const app = express();

// Seguridad: Content Security Policy estricta
app.use(
  helmet.contentSecurityPolicy({
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'"],
      styleSrc: ["'self'"]
    }
  })
);

// CORS y parsing
app.use(cors({ origin: '*' }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rutas API
app.use('/api', apiRoutes);

// Página principal - debe devolver JSON (no HTML) para evitar el error de freeCodeCamp
app.get('/', (req, res) => {
  res.json({ message: 'Stock Price Checker is live!' });
});

// Iniciar servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(Server running on port ${PORT});
});

module.exports = app;
