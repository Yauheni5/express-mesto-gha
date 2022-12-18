const usersRoutes = require('express').Router();

const { celebrate, Joi } = require('celebrate');
const { urlRegex } = require('../constants/constants');
const {
  getUsers,
  findUser,
  updateProfile,
  updateAvatar,
  getUserInfo,
} = require('../contollers/users');

usersRoutes.get('/', getUsers);

usersRoutes.get('/me', getUserInfo);

usersRoutes.get('/:_id', celebrate({
  params: Joi.object().keys({
    _id: Joi.string().required().hex().length(24),
  }),
}), findUser);

usersRoutes.patch('/me', celebrate({
  params: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
  }),
}), updateProfile);

usersRoutes.patch('/me/avatar', celebrate({
  body: Joi.object().keys({
    avatar: Joi.string().pattern(urlRegex),
  }),
}), updateAvatar);

module.exports = usersRoutes;
