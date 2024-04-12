const express = require('express');
const SongAndComposerController = require('../controllers/SongAndComposerController');
const SongAndComposerRoute = express.Router();

SongAndComposerRoute.get('/general_search', SongAndComposerController.busquedaGeneral);
SongAndComposerRoute.get('/general_search_limit', SongAndComposerController.busquedaGeneralLimitada);

module.exports = SongAndComposerRoute;