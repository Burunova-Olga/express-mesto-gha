const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const helmet = require('helmet');
const { errors, celebrate, Joi } = require('celebrate');
const auth = require('./middlewares/auth');
const { createUser, login } = require('./controllers/users');
const NotFoundError = require('./errors/not-found-error');

const { PORT = 3000, DB_URL = 'mongodb://127.0.0.1:27017/mestod' } = process.env;
const app = express();

mongoose.connect(DB_URL)
  .then(() => {
    console.log('MongoDB connected');
  });

app.use(helmet());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const regex = /(http|https):\/\/(w{3}.)?[a-zA-Z0-9\-_]+\.[a-zA-Z0-9-._~:/?#[\]@!$&'()*+,;=/]+/;
app.post('/signup', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().min(8),
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
    avatar: Joi.string().pattern(regex),
  }),
}), createUser);

app.post('/signin', celebrate({
  body: Joi.object().keys({
    email: Joi.string().email().required(),
    password: Joi.string().required().min(8),
  }),
}), login);

app.use(auth);

app.use('/users', require('./routes/users'));
app.use('/cards', require('./routes/cards'));

app.use((req, res, next) => {
  next(new NotFoundError('Неверный путь'));
});

app.use(errors());

app.use((err, req, res, next) => {
  const { statusCode = 500, message } = err;
  if (res.headersSent) return next(err);

  return res
    .status(statusCode)
    .send({
    // проверяем статус и выставляем сообщение в зависимости от него
      message: statusCode === 500
        ? 'На сервере произошла ошибка'
        : message,
    })
    .end();
});

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
