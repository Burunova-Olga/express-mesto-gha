const mongoose = require('mongoose');

const cardSchema = new mongoose.Schema({
  name:
  {
    type: String,
    required: [true, 'Поле должно быть заполнено'],
    minlength: [2, 'Минимальная длина поля 2 символа'],
    maxlength: [30, 'Максимальная длина поля 30 символа'],
  },
  link:
  {
    type: String,
    required: [true, 'Поле должно быть заполнено'],
  },
  owner:
  {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
  likes:
    [mongoose.Schema.Types.ObjectId],
  createdAt:
  {
    type: Date,
    default: Date.now,
  },
}, { versionKey: false });

module.exports = mongoose.model('card', cardSchema);
