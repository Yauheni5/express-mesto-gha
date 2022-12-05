const router = require('express').Router();

const { getUsers, createUser, findUser } = require('../contollers/users');

router.get('/', getUsers);

router.post('/', createUser);

router.get('/:userId', findUser);

module.exports = router;
