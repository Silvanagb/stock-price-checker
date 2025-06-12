const fetch = require('node-fetch');

const likesDatabase = {};

function getClientIP(req) {
  return req.headers['x-forwarded-for'] || req.connection.remoteAddress;
}

async function handleStock(req, res) {
  const { stock, like } = req.query;
  const ip = getClientIP(req);
  
  if (!stock) return res.status(400).json({ error: 'Stock parameter is required' });

  const stocks = Array.isArray(stock) ? stock : [stock];
  
  try {
    const data = await Promise.all(
      stocks.map(async (sym) => {
        const response = await fetch(`https://stock-price-checker-proxy.freecodecamp.rocks/v1/stock/${sym}/quote`);
        const json = await response.json();
        const symbol = json.symbol?.toUpperCase();

        if (!symbol || !json.latestPrice) {
          throw new Error('Invalid stock symbol');
        }

        if (!likesDatabase[symbol]) {
          likesDatabase[symbol] = new Set();
        }

        if (like === 'true') {
          likesDatabase[symbol].add(ip);
        }

        return {
          stock: symbol,
          price: json.latestPrice,
          likes: likesDatabase[symbol].size
        };
      })
    );

    if (data.length === 1) {
      return res.json({ stockData: data[0] });
    } else {
      const [stock1, stock2] = data;
      return res.json({
        stockData: [
          {
            stock: stock1.stock,
            price: stock1.price,
            rel_likes: stock1.likes - stock2.likes
          },
          {
            stock: stock2.stock,
            price: stock2.price,
            rel_likes: stock2.likes - stock1.likes
          }
        ]
      });
    }
  } catch (error) {
    return res.status(500).json({ error: 'Failed to fetch stock data' });
  }
}

module.exports = { handleStock };
