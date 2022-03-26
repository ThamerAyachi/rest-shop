const express = require('express');
const router = express.Router();

const UserService = require('../service/User.Service');

const userService = new UserService();

router.post('/signup', (req, res, next) => {
    userService.signUp(req, res);
});

router.delete('/:id', (req, res, next) => {
    userService.deleteUser(req, res);
});

module.exports = router;