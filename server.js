'use strict';
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();

const apiRoutes = require('./routes/api.js');
const app = express();

app.use(cors());
app.use(express.json());
app.use('/api', apiRoutes);

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const listener = app.listen(process.env.PORT || 3000, () => {
  console.log('Listening on port ' + listener.address().port);
});

module.exports = app;