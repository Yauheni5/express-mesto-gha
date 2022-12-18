// controllers/users.js
// файл контроллеров
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { statusCode } = require('../constants/constants');
const {
  ConflictError,
  BadRequestError,
  InternalServerError,
  AuthError,
  NotFoundError,
} = require('../errors');

const User = require('../models/User');

module.exports.createUser = async (req, res, next) => {
  try {
    const {
      email, password, name, about, avatar,
    } = req.body;
    const hash = await bcrypt.hash(password, 10);
    const user = await User.create({
      email,
      password: hash,
      name,
      about,
      avatar,
    });
    delete user.password;
    return res.status(statusCode.Created).send({ data: user });
  } catch (err) {
    if (err.code === 11000) {
      return next(new ConflictError('Пользователь с таким email уже зарегистрирован'));
    } if (err.name === 'ValidationError') {
      return next(new BadRequestError('Переданы некорректные данные в метод'));
    }
    return next(new InternalServerError('Произошла ошибка'));
  }
};

module.exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.findUserByCredentials(email, password);
    const token = jwt.sign({ _id: user._id }, 'super-strong-secret', { expiresIn: '7d' });
    return res.status(statusCode.OK).send({ token });
  } catch (err) {
    return next(err);
  }
};

module.exports.getUserInfo = async (req, res, next) => {
  try {
    const user = await User.findOne({ _id: req.user._id });
    return res.status(statusCode.OK).send({ data: user });
  } catch (err) {
    /* if (err.name === 'CastError') {
      return next(new NotFoundError('Переданы некорректные данные в метод'));
    } */
    return next(new InternalServerError('Произошла ошибка'));
  }
};

module.exports.findUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params._id);
    if (!user) {
      return next(new NotFoundError('Пользователь по переданному Id не найден'));
    }
    return res.status(statusCode.OK).send({ data: user });
  } catch (err) {
    /*  if (err.name === 'DocumentNotFoundError') {
      return next(new NotFoundError('Пользователь по переданному Id не найден'));
    } */
    if (err.name === 'CastError') {
      return next(new BadRequestError('Переданы некорректные данные в метод'));
    }
    return next(new InternalServerError('Произошла ошибка'));
  }
};

module.exports.getUsers = async (req, res, next) => {
  try {
    const user = await User.find({});
    return res.status(statusCode.OK).send({ data: user });
  } catch (err) {
    return next(new InternalServerError('Произошла ошибка'));
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
    return res.status(statusCode.OK).send({ data: user });
  } catch (err) {
    /* if (err.name === 'DocumentNotFoundError') {
      return next(new NotFoundError('Пользователь по переданному Id не найден'));
    } */
    /*  if (err.name === 'CastError' || 'ValidationError') {
  return next(new BadRequestError('Переданы некорректные данные в метод обновления пользователя'));
    } */
    return next(new InternalServerError('Произошла ошибка'));
  }
};

module.exports.updateAvatar = async (req, res, next) => {
  try {
    const userID = req.user._id;
    const { avatar } = req.body;
    const user = await User.findByIdAndUpdate(
      userID,
      { avatar },
      { new: true, runValidators: true },
    );
    return res.status(statusCode.OK).send({ data: user });
  } catch (err) {
    /*  if (err.name === 'DocumentNotFoundError') {
      return next(new NotFoundError('Пользователь по переданному Id не найден'));
    } */
    /* if (err.name === 'CastError' || 'ValidationError') {
      return next(new BadRequestError('Переданы некорректные данные в метод обновления аватара'));
    } */
    return next(new InternalServerError('Произошла ошибка'));
  }
};
