'use strict';
const express = require('express');
const cors = require('cors');
require('dotenv').config();

const apiRoutes = require('./routes/api.js');
const app = express();

app.use(cors());
app.use(express.json());
app.use('/api', apiRoutes);

const listener = app.listen(process.env.PORT || 3000, () => {
  console.log('Your app is listening on port ' + listener.address().port);
});

module.exports = app;
