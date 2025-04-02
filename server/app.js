const express = require('express');
const path = require('path');
const fs = require('fs');
const dataAccess = require('./data/DataAccess');

const configurationsRoutes = require('./routes/configurationsRoutes');
const frontendRoutes = require('./routes/frontendRoutes');
const playersRoutes = require('./routes/playersRoutes');
const questionsRoutes = require('./routes/questionsRoutes');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static(path.join(__dirname, '../client/dist/')));

if (!fs.existsSync(path.join(__dirname, './database')))
  fs.mkdirSync(path.join(__dirname, './database'));
dataAccess.initialize(path.join(__dirname, './database/quiz.sqlite'))

app.use('/api', configurationsRoutes);
app.use('/api', playersRoutes);
app.use('/api', questionsRoutes);
app.use('/', frontendRoutes);

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});