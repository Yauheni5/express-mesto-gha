// controllers/users.js
// файл контроллеров

const User = require('../models/User');

module.exports.createUser = (req, res) => {
  const { name, about, avatar } = req.body;
  User.create({ name, about, avatar })
    .then((user) => res.status(200).send({ data: user }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(400).send({ message: `Произошла ошибка: ${err.name}. Переданы некорректные данные` });
      } else {
        res.status(500).send({ message: `Произошла ошибка: ${err.name}` });
      }
    });
};

module.exports.findUser = (req, res) => {
  User.findById(req.user._id)
    .then((user) => res.status(200).send({ data: user }))
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(404).send({ message: `Произошла ошибка: ${err.name}. Пользователя с таким ID не найден` });
      } else {
        res.status(500).send({ message: `Произошла ошибка: ${err.name}` });
      }
    });
};

module.exports.getUsers = (req, res) => {
  User.find({})
    .then((user) => res.status(200).send({ data: user }))
    .catch((err) => {
      res.status(500).send({ message: `Произошла ошибка: ${err.name}` });
    });
};

module.exports.updateProfile = (req, res) => {
  const userID = req.user._id;
  const { name, about } = req.body;
  User.findByIdAndUpdate(userID, { name, about }, { new: true })
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      res.status(500).send({ message: `Произошла ошибка: ${err.name}` });
    });
};

module.exports.updateAvatar = (req, res) => {
  const userID = req.user._id;
  const { avatar } = req.body;
  User.findByIdAndUpdate({ userID, $set: { avatar } })
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      console.log(err.name);
      if (err.name === 'Error') {
        res.status(400).send({ message: `Произошла ошибка: ${err.name}. Переданы некорректные данные при обновлении аватара.` });
      } else if (err.name === 'CastError') {
        res.status(404).send({ message: `Произошла ошибка: ${err.name}. Пользователь с указанным _id не найден.` });
      } else {
        res.status(500).send({ message: `Произошла ошибка: ${err.name}` });
      }
    });
};
