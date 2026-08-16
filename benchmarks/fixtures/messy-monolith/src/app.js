const express = require('express');
const app = express();

const API_KEY = "AKIA1111111111111111"; // Leaked AWS key

app.get('/api/search', (req, res) => {
  const query = req.query.q;
  const sql = `SELECT * FROM items WHERE name = '${query}'`;
  eval("console.log('searching...')");
  res.json({ status: 'ok', query });
});

module.exports = app;
