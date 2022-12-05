const mongoose = require('mongoose');

const dateNow = new Date();

const cardSchema = new mongoose.Schema({
  name: {
    type: String, // имя — это строка
    required: true, // оно должно быть обязательно у каждой карточки
    minlength: 2, // минимальная длина имени — 2 символа
    maxlength: 30, // а максимальная — 30 символов
  },
  link: {
    type: String, // ссылка — это строка
    required: true, // оно должно быть у каждого пользователя, так что имя — обязательное поле
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
    required: true,
  },
  likes: {
    default: mongoose.Schema.Types.ObjectId,
  },
  createdAt: {
    type: Date,
    default: dateNow.now(),
  },
});

module.exports = mongoose.model('card', cardSchema);
