const mysql = require('mysql');

// Connection Pool
let connection = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME
});

// view home page
exports.viewMain = (req, res) => {
  res.render('body');
};

// View All Stocks
exports.viewAllStocks = (req, res) => {
  connection.query('SELECT DISTINCT * FROM SFP LIMIT 200', (err, rows) => {
    if (!err) {
      res.render('view-all-stocks', { rows });
    } else {
      res.render('no-results');
      console.log(err);
    }

    console.log('The data from stock table: \n', rows);
  });
}

// Action - view a stock information
exports.viewStock = (req, res) => {
  connection.query('SELECT * FROM SFP WHERE ticker = ?', [req.params.ticker], (err, rows) => {
    if (!err) {
      res.render('view-stock', { rows });
    } else {
      res.render('no-results');
      console.log(err);
    }
    console.log('The data from stock table: \n', rows);
  });
}

// Find Stock by Search
exports.find = (req, res) => {
  let searchTerm = req.body.search;
  // User the connection
  connection.query('SELECT * FROM SFP WHERE ticker LIKE ?', ['%' + searchTerm + '%'], (err, rows) => {
    if (!err) {
      res.render('view-all-stocks', { rows });
    } else {
      console.log(err);
    }
    console.log('The data from user table: \n', rows);
  });
}

// View Form Page
exports.viewForm = (req, res) => {
  res.render('quiz')
}

// Submit Form Query
exports.viewResults = (req, res) => {
  let quizResult = req.body;
  connection.query('SELECT * FROM SFP WHERE ticker LIKE ? and date LIKE ? and open LIKE ? and high LIKE ? and low LIKE ? and close LIKE ? AND lastupdated LIKE ?', ['%' + quizResult.ticker + '%', '%' + quizResult.date + '%', '%' + quizResult.open + '%', '%' + quizResult.high + '%', '%' + quizResult.low + '%', '%' + quizResult.close + '%', '%' + quizResult.lastupdated + '%'], (err, rows) => {
    if (!err) {
      res.render('view-all-stocks', { rows });
    } else {
      console.log(err);
    }
    console.log('The data from user table: \n', rows);
  });
}

// view learn more
exports.viewLearnMore = (req, res) => {
  res.render('learn-more')
}

exports.q1 = (req, res) => {
  connection.query(`
  WITH
    start AS (
    SELECT close AS startPrice, date AS startDate, ticker FROM SEP
    WHERE date = '2018-12-20' AND ticker = 'AMZN'),

    end as (
    SELECT close AS endPrice, date AS endDate, ticker FROM SEP
    WHERE date = '2019-12-20' and ticker = 'AMZN')

  SELECT s.ticker, t.sector, ROUND((e.endPrice - s.startPrice) / s.startPrice * 100, 2) AS percentageChange, s.startDate, e.endDate
  FROM start s JOIN end e JOIN TICKERS t ON s.ticker = e.ticker 
  WHERE t.sector = 'Technology' LIMIT 1;`, (err, rows) => {
    if (!err) {
      res.render('qa', { rows });
    } else {
      res.render('no-results');
      console.log(err);
    }
    console.log('The data from stock table: \n', rows);
  });
}

exports.q2 = (req, res) => {
  connection.query(`
  WITH
    start AS (
    SELECT close AS startPrice, ticker
    FROM SEP
    WHERE date = '2016-01-04'),

    end AS (
    SELECT close AS endPrice, ticker
    FROM SEP
    WHERE date = '2017-01-04'),

    percentages AS (
    SELECT DISTINCT s.ticker, ROUND((e.endPrice - s.startPrice) / s.startPrice * 100, 2) AS percentageChange
    FROM start s JOIN end e ON s.ticker = e.ticker)

  SELECT t.ticker, t.sector, p.percentageChange
  FROM percentages p JOIN TICKERS t ON p.ticker = t.ticker
  GROUP BY t.sector LIMIT 11`, (err, rows) => {
    if (!err) {
      res.render('qa', { rows });
    } else {
      res.render('no-results');
      console.log(err);
    }
    console.log('The data from stock table: \n', rows);
  });
}

exports.q3 = (req, res) => {
  connection.query(`
  WITH
    start AS (
    SELECT close AS startPrice, date AS startDate, ticker FROM SEP
    WHERE date = '2016-11-01'),
    
    end AS (
    SELECT close AS endPrice, date AS endDate, ticker FROM SEP
    WHERE date = '2021-11-01' AND close < 100),
    
    top AS (
       SELECT s.ticker, e.endPrice, ROUND((e.endPrice - s.startPrice) / s.startPrice * 100, 2) AS percentageChange, s.startDate, e.endDate
       FROM start s JOIN end e ON s.ticker = e.ticker
       ORDER BY percentageChange DESC LIMIT 5)

  SELECT DISTINCT t.ticker, t.sector, top.percentageChange, top.startDate, top.endDate
  FROM TICKERS t JOIN top ON t.ticker = top.ticker;`, (err, rows) => {
    if (!err) {
      res.render('qa', { rows });
    } else {
      res.render('no-results');
      console.log(err);
    }
    console.log('The data from stock table: \n', rows);
  });
}
