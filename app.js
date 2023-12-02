const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const helmet = require('helmet');

const { PORT = 3000, DB_URL = 'mongodb://127.0.0.1:27017/mestod' } = process.env;
const app = express();

mongoose.connect(DB_URL)
  .then(() =>
  {
    console.log("MongoDB connected");
  });

app.use((req, res, next) =>
  {
    req.user = { id: '656b27ccff1562b67ce42c37'};

    next();
  });

app.use(helmet());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use('/users', require('./routes/users'));
app.use('/cards', require('./routes/cards'));

app.use((req, res, next) =>
{
  res.status(404).send({message: "Неверный путь"});
});

app.listen(PORT, () =>
{
  console.log(`App listening on port ${PORT}`)
});