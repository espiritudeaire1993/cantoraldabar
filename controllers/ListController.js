const mongoose = require('mongoose');
const User = require('../models/User');

async function getOneList(idLista, user_name) {
    return await User.findOne({ user_name, 'lists._id': new mongoose.Types.ObjectId(idLista) },
        { 'lists.$': 1 }
    )
        .populate({
            path: 'lists',
            populate: {
                path: 'songs'
            }
        });
}

async function getAllLists(req) {
    let user_name = req.session.user.user_name;

    let allLists = await User.findOne({ user_name }, 'lists')
        .populate({
            path: 'lists',
            populate: { path: 'songs' }
        });
    return allLists;
}

const ListController = {
    openMisListas: async (req, res) => {
        try {
            let allLists = await getAllLists(req);
            console.log(allLists);
            res.status(200).render('mis_listas', {
                allLists,
                length: allLists.lists.length,
                success: true
            });
        } catch (error) {
            res.status(400).send({
                success: false,
                message: error
            });
        }
    },
    getSongsFromList: async (req, res) => {
        try {
            let user_name = req.session.user.user_name;

            let { idLista } = req.query;

            let lista = await getOneList(idLista, user_name);
            console.log(lista, lista.songs);

            res.status(200).json({
                success: true,
                lista,
                idLista
            });
        } catch (error) {
            res.status(400).send({
                success: false,
                message: error
            });
        }
    },
    openListaEspecifica: async (req, res) => {
        try {
            let user_name = req.session.user.user_name;

            let { idLista } = req.query;
            let lista = await getOneList(idLista, user_name);
            console.log(lista, lista.songs);

            res.status(200).render('listaEspecifica', {
                success: true,
                lista,
                idLista
            });
        } catch (error) {
            res.status(400).send({
                success: false,
                message: error
            });
        }
    },
    allLists: async (req, res) => {
        try {
            let allLists = await getAllLists(req);
            res.status(200).json({
                allLists,
                success: true
            });
        } catch (error) {
            res.status(400).send({
                success: false,
                message: error
            });
        }
    },
    saveSongToLists: async (req, res) => {
        try {
            let user_name = req.session.user.user_name;
            let { idLista, idSong } = req.body;
            let resultado = await User.findOneAndUpdate({ user_name, 'lists._id': new mongoose.Types.ObjectId(idLista) },

                { $push: { 'lists.$.songs': new mongoose.Types.ObjectId(idSong) } },
                { new: true }
            )
            // let resultado = await lista.set({ $push: { songs: { _id: new mongoose.Types.ObjectId(idSong) } } });

            res.status(200).json({
                success: true,
                resultado
            });
        } catch (error) {
            res.status(400).send({
                success: false,
                message: error
            });
        }
    },
    removeSongFromList: async (req, res) => {
        try {
            let user_name = req.session.user.user_name;
            let { idLista, idSong } = req.body;
            console.log(idLista, idSong);
            // let resultado = await User.findOneAndUpdate({ user_name, 'lists._id': idLista },
            //     { $pull: { 'lists.$.songs': { _id: new mongoose.Types.ObjectId(idSong) } } },
            //     { new: true }
            // );
            let resultado = await User.findOneAndUpdate(
                { user_name, 'lists._id': new mongoose.Types.ObjectId(idLista) },
                { $pull: { 'lists.$.songs': new mongoose.Types.ObjectId(idSong) } },
                { new: true }
            );
            //console.log(resultado);
            res.status(200).json({
                success: true,
                resultado
            });
        } catch (error) {
            res.status(400).send({
                success: false,
                message: error
            });
        }
    },
    saveList: async (req, res) => {
        try {
            let user_name = req.session.user.user_name;

            let { lists } = req.body;
            lists._id = new mongoose.Types.ObjectId(lists._id)
            console.log("####################", lists);
            let respuesta = await User.findOneAndUpdate({ user_name }, { lists });

            res.status(200).json({
                respuesta,
                success: true
            });
        } catch (error) {
            res.status(400).send({
                success: false,
                message: error
            });
        }
    },
    createList: async (req, res) => {
        try {
            let user_name = req.session.user.user_name;

            let { new_list_name } = req.body;
            let _id = new mongoose.Types.ObjectId();
            let respuesta = await User.findOneAndUpdate(
                { user_name },
                { $push: { lists: { _id, name: new_list_name, songs: [] } } },
                { new: true });
            res.status(200).json({
                respuesta,
                _id,
                success: true
            });
        } catch (error) {
            res.status(400).send({
                success: false,
                message: error
            });
        }
    },
    deleteList: async (req, res) => {
        try {
            let user_name = req.session.user.user_name;

            let { idListaEliminar } = req.body;
            let id = new mongoose.Types.ObjectId(idListaEliminar)

            let respuesta = await User.findOneAndUpdate(
                { user_name },
                { $pull: { lists: { _id: id } } },
                { new: true });
            res.status(200).json({
                respuesta,
                success: true
            });
        } catch (error) {
            res.status(400).send({
                success: false,
                message: error
            });
        }
    }
};

module.exports = ListController;