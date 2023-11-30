const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const { PORT = 3000 } = process.env;
const app = express();

mongoose.connect('mongodb://127.0.0.1:27017/mestodb')
  .then(() =>
  {
    console.log("MongoDB connected");
  });

app.use((req, res, next) =>
  {
    req.user = { id: '656649c00c0a707031f10b4a'};

    next();
  });

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use('/users', require('./routes/users'));
app.use('/cards', require('./routes/cards'));


app.listen(PORT, () =>
{
  console.log(`App listening on port ${PORT}`)
});