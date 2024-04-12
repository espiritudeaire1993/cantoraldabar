const mongoose = require('mongoose');
const unorm = require('unorm');
const Song = require('../models/Song');
const Tag = require('../models/Tag');

const Composer = require('../models/Composer');
const User = require('../models/User');

async function getUserToAllSongs(res, req) {
    try {
        let user_espiritudeaire = await User.findOne({ user_name: 'espiritudeaire' });
        let allSongs = await Song.find();
        allSongs.forEach(async (s) => {
            let u = await Song.findByIdAndUpdate(s._id, { creator: user_espiritudeaire._id });

        });
    } catch (error) {
        res.status(400).send({
            message: error
        });
    }

}

const songController = {
    obtenerCanciones: async (req, res) => {
        try {
            let { busqueda } = req.query
            // console.log(unorm.nfd(req.query.general_search));
            let songs = await Song.find
                ({
                    $or: [
                        { name: new RegExp(busqueda, 'i') },
                        { lyric: new RegExp(busqueda, 'i') }]
                })
                .limit(20)
                .populate('composerId');
            res.status(200).json({
                success: true,
                songs
            });
        } catch (error) {
            res.status(404).send({
                success: false,
                message: error
            });
        }
    },
    obtenerCancion: async (req, res) => {
        try {
            let ifLista = {
                bandera: false
            };
            let song = await Song.findOne({ _id: new mongoose.Types.ObjectId(req.query.id) })
                .populate('composerId')
                .populate('creator');
            if (req.query.idLista) {
                let user_name = req.session.user.user_name;
                let { idLista } = req.query;
                let lista = await User.findOne({ user_name, 'lists._id': new mongoose.Types.ObjectId(idLista) }, { 'lists.$': 1 })
                    .populate({
                        path: 'lists',
                        populate: {
                            path: 'songs'
                        }
                    });
                let indexSong = lista.lists[0].songs.findIndex(i => i._id.equals(new mongoose.Types.ObjectId(req.query.id)));
                ifLista.indexSong = indexSong;
                ifLista.bandera = true;
                ifLista.lista = lista.lists[0]
                //console.log(ifLista.lista.songs[2]._id);

            }

            res.status(200).render('canto', {
                success: true,
                id: song._id,
                nameSong: song.name,
                nameComposer: song.composerId.name,
                lyric: song.lyric,
                tags: song.tags,
                user_name: song.creator.user_name,
                ifLista
            });
        } catch (error) {
            res.status(404).send({
                success: false,
                message: error
            });
        }
    },
    cambiarUnknownADesconocido: async (req, res) => {
        try {
            let id_unknown = await Composer.findOne({ name: 'unknown' }).select('_id');
            let id_UNKNOWN = await Composer.findOne({ name: 'UNKNOWN' });;
            let id_DESCONOCIDO = await Composer.findOne({ name: 'DESCONOCIDO' });
            // console.log(id_unknown);
            // console.log(await Song.find({ composerId: id_unknown }));
            let songs1 = await Song.updateMany({ composerId: id_unknown }, { composerId: id_DESCONOCIDO })
            let songs2 = await Song.updateMany({ composerId: id_UNKNOWN }, { composerId: id_DESCONOCIDO })
            //console.log(songs1, songs2);
            res.status(200).render('index', {
                success: true,
                //songs,
            });
        } catch (error) {
            res.status(404).send({
                success: false,
                message: error
            });
        }
    },
    obtenerCancionesPorCompositor: async (req, res) => {
        try {
            let songs = await Song.find({ composerId: new mongoose.Types.ObjectId(req.query.composerId) });
            let composer = await Composer.findOne({ _id: new mongoose.Types.ObjectId(req.query.composerId) })
            //console.log(songs,composer);
            res.status(200).render('lista_cantos_por_compositor', {
                success: true,
                songs,
                nameComposer: composer.name
            });
        } catch (error) {
            res.status(400).send({
                success: false,
                message: error
            });
        }
    },
    abrirFormularioCrearCancion: async (req, res) => {
        try {

            let tags = await Tag.find();
            res.status(200).render('crear_canto', {
                success: true,
                tags,
                type_function: 1 // 1 representa la función de guardar un canto
            });
        } catch (error) {
            res.status(404).send({
                success: false,
                message: error
            });
        }
    },
    abrirBusquedaEspecial: async (req, res) => {
        try {
            let count = await Song.countDocuments();
            let { limit, pag } = req.query;
            let skip = ((pag - 1) * limit);
            let totalPaginas = Math.ceil(count / limit);
            let songs = await Song.find().limit(limit).skip(skip).sort({ name: 1 })
                .populate('composerId')
                .populate('creator');

            res.status(200).render('busqueda_especial', {
                success: true,
                songs,
                count,
                totalPaginas,
                current_page: pag
            });
        } catch (error) {
            res.status(404).send({
                success: false,
                message: error
            });
        }
    },
    abrirMisListas: (req, res) => {
        try {
            res.status(200).render('mis_listas', {});
        } catch (error) {
            res.status(404).send({
                success: false,
                message: error
            });
        }
    },
    guardarCancion: async (req, res) => {
        try {
            let { name, lyric, composerId, tags } = req.body;
            let _id = new mongoose.Types.ObjectId();

            //console.log(_id, 'asdas', name, lyric, composerId, tags);
            let resultado = await Song.create({ _id, name, lyric, composerId, tags, creator: req.session.user._id });

            res.status(200).json({
                success: true,
                resultado
            });
        } catch (error) {
            res.status(400).json({
                success: false,
                message: error
            });
        }
    },
    deleteOneSong: async (req, res) => {
        try {
            let { id } = req.body
            let result = await Song.findOneAndDelete({ _id: new mongoose.Types.ObjectId(id) });
            //console.log(result);
            res.status(200).send({
                success: true,
                result
            });
        } catch (error) {
            res.status(400).send({
                success: false
            });
        }
    },
    updateOneSong: async (req, res) => {
        try {
            let { _id, name, lyric, tags, composerId } = req.body
            let songUpdated = await Song.findOneAndUpdate({ _id: new mongoose.Types.ObjectId(_id) }, { name, lyric, composerId: new mongoose.Types.ObjectId(composerId), tags });
            res.status(200).send({
                success: true,
                resultado: songUpdated
            });
        } catch (error) {
            res.status(400).send({
                success: false
            });
        }
    },
    openUpdateSong: async (req, res) => {
        try {
            let { id } = req.query;
            let song = await Song.findOne({ _id: new mongoose.Types.ObjectId(id) })
                .populate('composerId')
                .populate('creator');
            let tags = await Tag.find();
            res.status(200).render('crear_canto', {
                success: true,
                song,
                tags,
                type_function: 2 // 2 representa la función de modificar una canción
            });
        } catch (error) {
            res.status(400).send({
                success: false
            });
        }
    },
    openBusquedaAvanzada: async (req, res) => {
        try {
            let tags = await Tag.find();
            res.status(200).render('busqueda_avanzada', {
                success: true,
                tags
            });
        } catch (error) {
            res.status(400).send({
                success: false
            });
        }
    },
    busquedaAvanzada: async (req, res) => {
        try {
            let objectSearch = {};
            let { tags, title, composer } = req.query;
            if (tags !== undefined) {
                let tagsArray = tags.split(',');
                objectSearch.tags = { $all: tagsArray };
            };
            if (title !== undefined) objectSearch.name = new RegExp(title, 'i');
            let songs = await Song.find(objectSearch)
                .populate('composerId')
                .populate('creator');
            if (composer !== undefined) {
                let matchComposer = [];
                songs.forEach(song => {
                    if ((song.composerId.name).match(new RegExp(composer, 'i'))) {
                        matchComposer.push(song);
                    }
                });
                songs = matchComposer
            }
            res.status(200).send({
                success: true,
                songs
            });
        } catch (error) {
            res.status(400).send({
                success: false,
                message: error
            });
        }
    }
}


module.exports = songController;