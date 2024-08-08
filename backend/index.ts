import express from 'express';
import mysql, { ConnectionOptions, createConnection, createPool } from 'mysql2';
import cors from 'cors';
import exp from 'constants';

const PORT = 8080;

const app = express();

app.use(cors());
app.use(express.json());

async function connect() {
    const connection = await createPool({
        host: 'localhost',
        user: 'muneeb',
        password: '#1Godisgreat',
        database: 'URLS',
        connectionLimit: 10
    });

    return connection;
}


app.get('/', async (req, res) => {
    const QUERY = "SELECT * FROM urls"
    const conn = await connect();
    conn.query(QUERY, (err, data) => {
        if (err) return res.json(err);
        return res.json(data);
    });
});

app.post('/', async (req, res) => {
    const newUrl = req.body;
    console.log(newUrl);
    const QUERY = `INSERT INTO urls VALUES (?,?, ?)`
    const conn = await connect();
    conn.query(QUERY, [newUrl.url, newUrl.shorturl, newUrl.count], (err, data) => {
        if (err) return res.json(err);
        console.log("Created");
    });
});




app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`);
})