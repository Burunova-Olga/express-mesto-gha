const mongoose = require('mongoose');
const validator = require('validator');

const userSchema = new mongoose.Schema({
  name:
  {
    type: String,
    minlength: [2, 'Минимальная длина поля 2 символа'],
    maxlength: [30, 'Максимальная длина поля 30 символов'],
    default: 'Жак-Ив Кусто',
  },
  about:
  {
    type: String,
    minlength: [2, 'Минимальная длина поля 2 символа'],
    maxlength: [30, 'Максимальная длина поля 30 символов'],
    default: 'Исследователь',
  },
  avatar:
  {
    type: String,
    required: [true, 'Поле должно быть заполнено'],
    validate: [validator.isURL, 'Строка не ссылка'],
    default: 'https://pictures.s3.yandex.net/resources/jacques-cousteau_1604399756.png',
  },
  email:
  {
    type: String,
    required: [true, 'Поле должно быть заполнено'],
    unique: [true, 'Такой email уже зарегестрирован'],
    validate: [validator.isEmail, 'Строка не email'],
    useCreateIndex: true,
    autoIndex: true,
  },
  password:
  {
    type: String,
    required: [true, 'Поле должно быть заполнено'],
    select: false,
  },
}, { versionKey: false });

module.exports = mongoose.model('user', userSchema);
