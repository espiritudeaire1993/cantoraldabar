const express = require('express');

const UserRoute = express.Router();
const UserController = require('../controllers/UserController');

UserRoute.post('/authentication', UserController.authentication);
UserRoute.get('/getAllLists', UserController.getAllLists);

module.exports = UserRoute;