const usersRoutes = require('express').Router();

const {
  getUsers,
  createUser,
  findUser,
  updateProfile,
  updateAvatar,
} = require('../contollers/user');

usersRoutes.get('/', getUsers);

usersRoutes.post('/', createUser);

usersRoutes.get('/:_id', findUser);

usersRoutes.patch('/me', updateProfile);

usersRoutes.patch('/me/avatar', updateAvatar);

module.exports = usersRoutes;
