const express = require('express');
const dotenv = require('dotenv');
const app = express();
dotenv.config();
const port = 3000;
const APIKEY = process.env.APIKEY;

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/public/index.html');
});


app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
});