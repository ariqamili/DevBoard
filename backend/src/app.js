const express = require('express');
const cors = require('cors');

const app = express();

app.use(cors());
app.use(express.json());

app.get('/health', (req, res)=>{
    res.json({status: 'DevBoard API is running'});
});

module.exports = app;