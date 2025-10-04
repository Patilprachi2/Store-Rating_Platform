require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { sequelize, User, Store, Rating } = require('./models');
const routes = require('./routes');

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use('/api', routes);

const PORT = process.env.PORT || 4000;
(async () => {
  try {
    await sequelize.authenticate();
    console.log('DB connected');
    // For demo, sync models. In production use migrations.
    await sequelize.sync({ alter: true });
    console.log('Models synced');

    app.listen(PORT, () => console.log('Server listening on', PORT));
  } catch (err) {
    console.error('Failed to start', err);
  }
})();
