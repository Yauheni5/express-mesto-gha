// controllers/users.js
// файл контроллеров
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const ConflictError = require('../errors/conflict-err');
const GeneralError = require('../errors/general-err');
const NotFoundError = require('../errors/not-found-err');
const ValidationError = require('../errors/validation-err');
const User = require('../models/User');

/* if (err.name === 'DocumentNotFoundError') {
  return new NotFoundError({ message: 'Карточка по переданному Id не найдена' });
} if (err.name === 'CastError' || 'ValidationError') {
  return new ValidationError({ message: 'Переданы некорректные данные в метод' });
}
return new GeneralError({ message: 'Произошла ошибка' }); */

module.exports.createUser = async (req, res) => {
  const {
    email, password, name, about, avatar,
  } = req.body;

  try {
    const hash = await bcrypt.hash(password, 10);
    const user = await User.create({
      email,
      password: hash,
      name,
      about,
      avatar,
    });
    return res.status(201).send({ data: user });
  } catch (err) {
    if (err.code === 11000) {
      return new ConflictError({ message: 'Пользователь с таким email уже зарегистрирован' });
    } if (err.name === 'ValidationError') {
      return new ValidationError({ message: 'Переданы некорректные данные в метод' });
    }
    return new GeneralError({ message: 'Произошла ошибка' });
  }
};

module.exports.login = async (req, res, next) => {
  const { email, password } = req.body;
  try {
    const user = await User.findUserByCredentials(email, password);
    if (!user) {
      next(new Error('Неправильный логин или пароль'));
    }
    const token = jwt.sign({ _id: user._id }, 'super-strong-secret', { expiresIn: '7d' });
    return res.status(200).send({ token });
  } catch (err) {
    if (err) {
      return res.status(401).send({ message: err.message });
    }
    return new GeneralError({ message: 'Произошла ошибка' });
  }
};

module.exports.getUserInfo = async (req, res) => {
  const userId = req.user._id;
  try {
    const user = await User.findById(userId);
    return res.status(200).send({ data: user });
  } catch (err) {
    if (err.name) {
      return new NotFoundError({ message: 'Пользователь не найден' });
    }
    return new GeneralError({ message: 'Произошла ошибка' });
  }
};

module.exports.findUser = (req, res, next) => {
  User.findById(req.params._id)
    .orFail()
    .then((user) => {
      if (user) {
        res.status(200).send({ data: user });
      }
      next();
    })
    .catch((err) => {
      if (err.name === 'DocumentNotFoundError') {
        return new NotFoundError({ message: 'Пользователь по переданному Id не найден' });
      }
      if (err.name === 'CastError') {
        return new ValidationError({ message: 'Переданы некорректные данные в метод' });
      }
      return new GeneralError({ message: 'Произошла ошибка' });
    });
};

module.exports.getUsers = (req, res) => {
  User.find({})
    .then((user) => res.status(200).send({ data: user }))
    .catch(() => new GeneralError({ message: 'Произошла ошибка' }));
};

module.exports.updateProfile = (req, res, next) => {
  const userID = req.user._id;
  const { name, about } = req.body;
  User.findByIdAndUpdate(
    userID,
    { name, about },
    { new: true, runValidators: true },
  )
    .orFail()
    .then((user) => {
      if (user) {
        res.status(200).send({ data: user });
      }
      next();
    })
    .catch((err) => {
      if (err.name === 'DocumentNotFoundError') {
        return new NotFoundError({ message: 'Пользователь по переданному Id не найден' });
      }
      if (err.name === 'CastError' || 'ValidationError') {
        return new ValidationError({ message: 'Переданы некорректные данные в метод обновления аватара' });
      }
      return new GeneralError({ message: 'Произошла ошибка' });
    });
};

module.exports.updateAvatar = (req, res, next) => {
  const userID = req.user._id;
  const { avatar } = req.body;
  User.findByIdAndUpdate(
    userID,
    { avatar },
    { new: true, runValidators: true },
  )
    .orFail()
    .then((user) => {
      if (user) {
        res.status(200).send({ data: user });
      }
      next();
    })
    .catch((err) => {
      if (err.name === 'DocumentNotFoundError') {
        return new NotFoundError({ message: 'Пользователь по переданному Id не найден' });
      }
      if (err.name === 'CastError' || 'ValidationError') {
        return new ValidationError({ message: 'Переданы некорректные данные в метод обновления аватара' });
      }
      return new GeneralError({ message: 'Произошла ошибка' });
    });
};
