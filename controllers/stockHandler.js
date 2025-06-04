const Stock = require('../models/Stock');
const axios = require('axios');
const crypto = require('crypto');

const hashIP = ip => crypto.createHash('sha256').update(ip).digest('hex');

exports.handleStock = async (req, res) => {
  const { stock, like } = req.query;
  const ip = hashIP(req.ip);

  const fetchStock = async symbol => {
    const response = await axios.get(
      `https://stock-price-checker-proxy.freecodecamp.rocks/v1/stock/${symbol}/quote`
    );
    return {
      stock: response.data.symbol,
      price: response.data.latestPrice,
    };
  };

  if (Array.isArray(stock)) {
    const data = await Promise.all(stock.map(s => fetchStock(s)));
    const docs = await Promise.all(stock.map(s => Stock.findOneAndUpdate(
      { stock: s.toUpperCase() },
      { $setOnInsert: { stock: s.toUpperCase(), likes: [] } },
      { upsert: true, new: true }
    )));

    if (like) {
      docs.forEach(doc => {
        if (!doc.likes.includes(ip)) {
          doc.likes.push(ip);
          doc.save();
        }
      });
    }

    const rel_likes = [
      docs[0].likes.length - docs[1].likes.length,
      docs[1].likes.length - docs[0].likes.length
    ];

    return res.json({
      stockData: data.map((d, i) => ({
        stock: d.stock,
        price: d.price,
        rel_likes: rel_likes[i],
      })),
    });
  } else {
    const { stock: symbol, price } = await fetchStock(stock);
    let doc = await Stock.findOneAndUpdate(
      { stock: symbol },
      { $setOnInsert: { stock: symbol, likes: [] } },
      { upsert: true, new: true }
    );

    if (like && !doc.likes.includes(ip)) {
      doc.likes.push(ip);
      await doc.save();
    }

    return res.json({
      stockData: {
        stock: symbol,
        price,
        likes: doc.likes.length,
      },
    });
  }
};