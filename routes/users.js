const usersRoutes = require('express').Router();

const { celebrate, Joi } = require('celebrate');
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

usersRoutes.patch('/me', updateProfile);

usersRoutes.patch('/me/avatar', updateAvatar);

module.exports = usersRoutes;
