// controllers/users.js
// файл контроллеров
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const ConflictError = require('../errors/conflict-err');
const GeneralError = require('../errors/general-err');
const NotFoundError = require('../errors/not-found-err');
const ValidationError = require('../errors/validation-err');
const User = require('../models/User');

module.exports.createUser = async (req, res, next) => {
  try {
    const {
      email, password, name, about, avatar,
    } = req.body;
    const hash = await bcrypt.hash(password, 10);
    await User.create({
      email,
      password: hash,
      name,
      about,
      avatar,
    });
    res.status(201).send({ message: 'Пользователь успешно зарегистрирован' });
  } catch (err) {
    if (err.code === 11000) {
      next(new ConflictError('Пользователь с таким email уже зарегистрирован'));
    } if (err.name === 'ValidationError') {
      next(new ValidationError('Переданы некорректные данные в метод'));
    }
    next(new GeneralError('Произошла ошибка'));
  }
};

module.exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.findUserByCredentials(email, password);
    const token = jwt.sign({ _id: user._id }, 'super-strong-secret', { expiresIn: '7d' });
    res.status(200).send({ token });
  } catch (err) {
    next(new NotFoundError('Неправильные почта или пароль'));
  }
};

module.exports.getUserInfo = async (req, res, next) => {
  try {
    const user = await User.findOne({ _id: req.user._id });
    res.status(200).send({ data: user });
  } catch (err) {
    if (err.name === 'CastError') {
      next(new NotFoundError('Переданы некорректные данные в метод'));
    }
    next(new GeneralError('Произошла ошибка'));
  }
};

module.exports.findUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params._id);
    if (user) {
      res.status(200).send({ data: user });
    }
    next();
  } catch (err) {
    if (err.name === 'DocumentNotFoundError') {
      next(new NotFoundError({ message: 'Пользователь по переданному Id не найден' }));
    }
    if (err.name === 'CastError') {
      next(new ValidationError({ message: 'Переданы некорректные данные в метод' }));
    }
    next(new GeneralError({ message: 'Произошла ошибка' }));
  }
};

module.exports.getUsers = async (req, res, next) => {
  try {
    const user = await User.find({});
    res.status(200).send({ data: user });
  } catch (err) {
    next(new GeneralError('Произошла ошибка'));
  }
};

module.exports.updateProfile = async (req, res, next) => {
  try {
    const userID = req.user._id;
    const { name, about } = req.body;
    const user = await User.findByIdAndUpdate(
      userID,
      { name, about },
      { new: true, runValidators: true },
    );
    if (user) {
      res.status(200).send({ data: user });
    }
    next();
  } catch (err) {
    if (err.name === 'DocumentNotFoundError') {
      next(new NotFoundError('Пользователь по переданному Id не найден'));
    }
    if (err.name === 'CastError' || 'ValidationError') {
      next(new ValidationError('Переданы некорректные данные в метод обновления аватара'));
    }
    next(new GeneralError('Произошла ошибка'));
  }
};

module.exports.updateAvatar = async (req, res, next) => {
  try {
    const userID = req.user._id;
    const { avatar } = req.body;
    const user = User.findByIdAndUpdate(
      userID,
      { avatar },
      { new: true, runValidators: true },
    );
    if (user) {
      res.status(200).send({ data: user });
    }
    next();
  } catch (err) {
    if (err.name === 'DocumentNotFoundError') {
      next(new NotFoundError('Пользователь по переданному Id не найден'));
    }
    if (err.name === 'CastError' || 'ValidationError') {
      next(new ValidationError('Переданы некорректные данные в метод обновления аватара'));
    }
    next(new GeneralError('Произошла ошибка'));
  }
};
