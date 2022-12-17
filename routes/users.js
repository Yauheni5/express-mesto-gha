const usersRoutes = require('express').Router();

const {
  getUsers,
  findUser,
  updateProfile,
  updateAvatar,
  getUserInfo,
} = require('../contollers/users');

usersRoutes.get('/', getUsers);

usersRoutes.get('/me', getUserInfo);

usersRoutes.get('/:_id', findUser);

usersRoutes.patch('/me', updateProfile);

usersRoutes.patch('/me/avatar', updateAvatar);

module.exports = usersRoutes;
