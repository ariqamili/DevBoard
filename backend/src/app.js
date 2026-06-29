const express = require('express');
const cors = require('cors');
const jobRoutes = require('./routes/jobRoutes');

const app = express();

app.use(cors());
app.use(express.json());

app.get('/health', (req, res) => {
  res.json({ status: 'DevBoard API is running' });
});

app.use('/api/jobs', jobRoutes);

module.exports = app;