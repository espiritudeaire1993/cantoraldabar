const Composer = require('../models/Composer');
const Song = require('../models/Song');
const unorm = require('unorm');

function getSpanResaltado(r) {
    return `<span class='busqueda_resaltado'>${r}</span>`
}

const SongAndComposerController = {
    busquedaGeneral: async (req, res) => {
        try {
            //console.log(unorm.nfd(req.query.general_search));
            let skip;
            let totalPaginas;
            let general_search = req.query.general_search;

            let { limit, pag } = req.query;
            skip = ((pag - 1) * limit);

            let songs = await Song.find(
                {
                    $or: [
                        { name: new RegExp(general_search, 'i') },
                        { lyric: new RegExp(general_search, 'i') }]
                })
                .limit(limit)
                .skip(skip)
                .sort({ name: 1 })
                .populate('composerId');

            let composers = await Composer.find({ name: new RegExp(general_search, 'i') });
            let spanResaltado = ``;

            songs.forEach(song => {
                song.lyric = song.lyric.replace(new RegExp(general_search, 'gi'), (c) => { return getSpanResaltado(c) })
                song.name = song.name.replace(new RegExp(general_search, 'gi'), (c) => { return getSpanResaltado(c) })
            });
            composers.forEach(composer => {
                composer.name = composer.name.replace(new RegExp(general_search, 'gi'), (c) => { return getSpanResaltado(c) })
            });

            let count = await Song.countDocuments({
                $or: [
                    { name: new RegExp(general_search, 'i') },
                    { lyric: new RegExp(general_search, 'i') }]
            });
            
            totalPaginas = Math.ceil(count / limit);

            console.log(count, totalPaginas, limit, skip, pag);

            res.status(200).render('resultados_busqueda', {
                success: true,
                songs,
                composers,
                general_search,
                skip,
                totalPaginas,
                currentPag: pag,
                count
            });
        } catch (error) {
            res.status(404).send({
                success: false,
                message: error
            });
        }
    },
    busquedaGeneralLimitada: async (req, res) => {
        try {
            //console.log(unorm.nfd(req.query.general_search));
            let songs = await Song.find({ name: new RegExp(unorm.nfd(req.query.general_search), 'i') }).limit(5)
                .populate('composerId');
            let composers = await Composer.find({ name: new RegExp(req.query.general_search, 'i') }).limit(5);
            res.status(200).send({
                success: true,
                songs,
                composers
            });
        } catch (error) {
            res.status(404).send({
                success: false,
                message: error
            });
        }
    }
}

module.exports = SongAndComposerController;