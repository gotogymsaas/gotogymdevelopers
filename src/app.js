const express = require('express');
const userRoutes = require('./user/user.routes');

const app = express();
app.use(express.json());

app.use('/api/user', userRoutes);

app.use((req, res) => {
  res.status(404).json({ error: 'Not found' });
});

module.exports = app;
