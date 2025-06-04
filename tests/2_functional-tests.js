const chaiHttp = require('chai-http');
const chai = require('chai');
const assert = chai.assert;
const server = require('../server');

chai.use(chaiHttp);

suite('Functional Tests', () => {
  let likes;

  test('1 stock', done => {
    chai
      .request(server)
      .get('/api/stock-prices')
      .query({ stock: 'GOOG' })
      .end((err, res) => {
        assert.equal(res.status, 200);
        assert.property(res.body.stockData, 'stock');
        assert.property(res.body.stockData, 'price');
        assert.property(res.body.stockData, 'likes');
        likes = res.body.stockData.likes;
        done();
      });
  });

  test('1 stock with like', done => {
    chai
      .request(server)
      .get('/api/stock-prices')
      .query({ stock: 'GOOG', like: true })
      .end((err, res) => {
        assert.isAbove(res.body.stockData.likes, likes);
        done();
      });
  });

  test('Same stock with like again (no double count)', done => {
    chai
      .request(server)
      .get('/api/stock-prices')
      .query({ stock: 'GOOG', like: true })
      .end((err, res) => {
        assert.equal(res.body.stockData.likes, likes + 1);
        done();
      });
  });

  test('2 stocks', done => {
    chai
      .request(server)
      .get('/api/stock-prices')
      .query({ stock: ['GOOG', 'MSFT'] })
      .end((err, res) => {
        assert.isArray(res.body.stockData);
        assert.property(res.body.stockData[0], 'rel_likes');
        assert.property(res.body.stockData[1], 'rel_likes');
        done();
      });
  });

  test('2 stocks with like', done => {
    chai
      .request(server)
      .get('/api/stock-prices')
      .query({ stock: ['GOOG', 'MSFT'], like: true })
      .end((err, res) => {
        assert.isArray(res.body.stockData);
        assert.property(res.body.stockData[0], 'rel_likes');
        done();
      });
  });
});