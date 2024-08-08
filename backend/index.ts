import express from 'express';
import mysql, { createPool } from 'mysql2';
import cors from 'cors';
import crypto from 'crypto';

const PORT = 8080;
const app = express();

app.use(cors());
app.use(express.json());

const pool = createPool({
  host: 'localhost',
  user: 'muneeb',
  password: '#1Godisgreat',
  database: 'URLS',
  connectionLimit: 10
});

const shorten = (): string => {
  return crypto.randomBytes(4).toString('hex'); 
};

app.get('/:shorturl', (req, res) => {
  const { shorturl } = req.params;
  const QUERY = 'SELECT * FROM urls WHERE shorturl = ?';

  pool.query(QUERY, [shorturl], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    if (results.length === 0) return res.status(404).json({ error: 'Not found' });

    const { url, count } = results[0];
    
    const UPDATE_QUERY = 'UPDATE urls SET count = ? WHERE shorturl = ?';
    pool.query(UPDATE_QUERY, [count + 1, shorturl], (err) => {
      if (err) return res.status(500).json({ error: err.message });
      res.redirect(url);
    });
  });
});

app.post('/shorten', (req, res) => {
  const { url } = req.body;
  const shorturl = shorten(); 

  const QUERY = 'INSERT INTO urls (url, shorturl, count) VALUES (?, ?, ?)';
  pool.query(QUERY, [url, shorturl, 0], (err) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ shorturl: `http://localhost:8080/${shorturl}` });
  });
});

app.get('/', (req, res) => {
  const QUERY = 'SELECT * FROM urls';
  pool.query(QUERY, (err, data) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(data);
  });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
