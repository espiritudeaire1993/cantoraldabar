const express = require('express');
const composerController = require('../controllers/ComposerController');
const ComposerRouter = express.Router();

ComposerRouter.get('/getAllComposers', composerController.getAllComposers);
ComposerRouter.get('/getComposersByName', composerController.getComposersByName);
ComposerRouter.get('/getOneComposerByName', composerController.getOneComposerByName);

ComposerRouter.post('/save_composer', composerController.saveComposer);



module.exports = ComposerRouter;