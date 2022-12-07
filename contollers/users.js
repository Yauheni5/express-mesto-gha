// controllers/users.js
// файл контроллеров

const User = require('../models/User');

const errorHandler = (err, res) => {
  if (err.name === 'DocumentNotFoundError') {
    res.status(404).send({ message: 'Данные по переданному Id не найдены' });
  } else if (err.name === 'CastError' || 'ValidationError') {
    res.status(400).send({ message: 'Переданы некорректные данные в метод' });
  } else {
    res.status(500).send({ message: 'Произошла ошибка' });
  }
};

module.exports.createUser = (req, res) => {
  const { name, about, avatar } = req.body;
  User.create({ name, about, avatar })
    .orFail()
    .then((user) => res.status(200).send({ data: user }))
    .catch((err) => {
      errorHandler(err, res);
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
      errorHandler(err, res);
    });
};

module.exports.getUsers = (req, res) => {
  User.find({})
    .orFail()
    .then((user) => res.status(200).send({ data: user }))
    .catch((err) => {
      errorHandler(err, res);
    });
};

module.exports.updateProfile = (req, res) => {
  const userID = req.user._id;
  const { name, about } = req.body;
  User.findByIdAndUpdate(
    userID,
    { name, about },
    { new: true, runValidators: true },
  )
    .orFail()
    .then((user) => res.status(200).send({ data: user }))
    .catch((err) => {
      errorHandler(err, res);
    });
};

module.exports.updateAvatar = (req, res) => {
  const userID = req.user._id;
  const { avatar } = req.body;
  User.findByIdAndUpdate(
    userID,
    { avatar },
    { new: true, runValidators: true },
  )
    .orFail()
    .then((user) => res.status(200).send({ data: user }))
    .catch((err) => {
      errorHandler(err, res);
    });
};
