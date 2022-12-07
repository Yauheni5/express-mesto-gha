// controllers/users.js
// файл контроллеров

const User = require('../models/User');

module.exports.createUser = (req, res) => {
  const { name, about, avatar } = req.body;
  User.create({ name, about, avatar })
    .then((user) => res.status(200).send({ data: user }))
    .catch((err) => {
      if (err.name === 'CastError' || 'ValidationError') {
        res.status(400).send({ message: 'Переданы некорректные данные в метод' });
      } else {
        res.status(500).send({ message: 'Произошла ошибка' });
      }
    });
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
        next(res.status(404).send({ message: 'Пользователь по переданному Id не найден' }));
      } else {
        res.status(500).send({ message: 'Произошла ошибка' });
      }
    });
};

module.exports.getUsers = (req, res) => {
  User.find({})
    .then((user) => res.status(200).send({ data: user }))
    .catch((err) => {
      if (err.name === 'CastError' || 'ValidationError') {
        res.status(400).send({ message: 'Переданы некорректные данные в метод' });
      } else {
        res.status(500).send({ message: 'Произошла ошибка' });
      }
    });
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
        next(res.status(404).send({ message: 'Пользователь по переданному Id не найден' }));
      } else if (err.name === 'CastError' || 'ValidationError') {
        res.status(400).send({ message: 'Переданы некорректные данные в метод обновления профиля' });
      } else {
        res.status(500).send({ message: 'Произошла ошибка' });
      }
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
        next(res.status(404).send({ message: 'Пользователь по переданному Id не найден' }));
      } else if (err.name === 'CastError' || 'ValidationError') {
        res.status(400).send({ message: 'Переданы некорректные данные в метод обновления аватара' });
      } else {
        res.status(500).send({ message: 'Произошла ошибка' });
      }
    });
};
