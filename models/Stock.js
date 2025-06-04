const mongoose = require('mongoose');

const stockSchema = new mongoose.Schema({
  stock: String,
  likes: [String],
});

module.exports = mongoose.model('Stock', stockSchema);