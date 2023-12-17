const mongoose = require('mongoose');
const validator = require('validator');

const userSchema = new mongoose.Schema({
  name:
  {
    type: String,
    required: [true, 'Поле должно быть заполнено'],
    minlength: [2, 'Минимальная длина поля 2 символа'],
    maxlength: [30, 'Максимальная длина поля 30 символов'],
  },
  about:
  {
    type: String,
    required: [true, 'Поле должно быть заполнено'],
    minlength: [2, 'Минимальная длина поля 2 символа'],
    maxlength: [30, 'Максимальная длина поля 30 символов'],
  },
  avatar:
  {
    type: String,
    required: [true, 'Поле должно быть заполнено'],
  },
  email:
  {
    type: String,
    required: [true, 'Поле должно быть заполнено'],
    unique: [true, 'Такой email уже зарегестрирован'],
    validate: [validator.isEmail, 'Строка не email'],
  },
  password:
  {
    type: String,
    required: [true, 'Поле должно быть заполнено'],
    minlength: [8, 'Минимальная длина поля 8 символов'],
    select: false,
  },
}, { versionKey: false });

module.exports = mongoose.model('user', userSchema);
