const Composer = require('../models/Composer');
const mongoose = require('mongoose');


const composerController = {
    getAllComposers: async (req, res) => {
        try {
            let composers = await Composer.find();
            res.status(200).send({
                success: true,
                composers
            });
        } catch (error) {
            res.status(400).send({
                success: false,
                message: 'Error al intentar buscar Compositores'
            });
        }
    },
    getOneComposerByName: async (req, res) => {
        try {
            let name = req.query.name;
            let compositor = await Composer.findOne({ name: name });
            res.status(200).send({
                success: true,
                compositor
            })
        } catch (error) {
            res.status(400).send({
                success: false,
                message: error
            })
        }
    },
    getComposersByName: async (req, res) => {
        try {
            let composers = await Composer.find({ name: new RegExp(req.query.name, 'i') });
            res.status(200).send({
                success: true,
                composers
            });
        } catch (error) {
            res.status(400).send({
                success: false,
                message: 'Error al intentar buscar Compositores'
            });
        }
    },
    saveComposer: async (req, res) => {
        try {
            let _id = new mongoose.Types.ObjectId();
            let { name_composer } = req.body;
            let compositor = await Composer.create({ _id, name: name_composer });

            res.status(200).json({
                success: true,
                compositor
            });
        } catch (error) {
            res.status(400).json({
                success: false,
                message: 'Error al intentar guardar el compositor'

            });
        }
    }
};

module.exports = composerController;