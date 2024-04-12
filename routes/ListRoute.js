const express = require('express');

const ListRoute = express.Router();
const ListController = require('../controllers/ListController');

ListRoute.get('/allLists', ListController.allLists);
ListRoute.get('/mis_listas', ListController.openMisListas);
ListRoute.get('/lista', ListController.openListaEspecifica);

ListRoute.put('/deleteList', ListController.deleteList);
ListRoute.put('/removeSongFromList', ListController.removeSongFromList);

ListRoute.post('/createList', ListController.createList);

ListRoute.put('/saveList', ListController.saveList);
ListRoute.put('/saveSongToList', ListController.saveSongToLists);

module.exports = ListRoute;