const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const { default: isEmail } = require('validator/lib/isEmail');
const AuthError = require('../errors/auth-err');
const GeneralError = require('../errors/general-err');

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator: (v) => isEmail(v),
      message: 'Неправильный формат почты',
    },
  },
  password: {
    type: String,
    required: true,
    minlength: 8,
    select: false,
  },
  name: {
    type: String, // имя — это строка
    minlength: 2, // минимальная длина имени — 2 символа
    maxlength: 30, // а максимальная — 30 символов
    default: 'Жак-Ив Кусто',
  },
  about: {
    type: String, // ссылка — это строка
    minlength: 2, // минимальная длина имени — 2 символа
    maxlength: 30, // а максимальная — 30 символов
    default: 'Исследователь',
  },
  avatar: {
    type: String,
    default: 'https://pictures.s3.yandex.net/resources/jacques-cousteau_1604399756.png',
  },
});

userSchema.statics.findUserByCredentials = async function (email, password) {
  try {
    const user = await this.findOne({ email }).select('+password');
    if (!user) {
      return Promise.reject(new AuthError('Неправильные почта или пароль'));
    }
    const matched = await bcrypt.compare(password, user.password);

    if (!matched) {
      return Promise.reject(new AuthError('Неправильные почта или пароль'));
    }
    return user;
  } catch (err) {
    return new GeneralError('Произошла ошибка');
  }
};
module.exports = mongoose.model('User', userSchema);
