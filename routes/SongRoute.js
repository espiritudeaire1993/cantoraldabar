const express = require('express');

const SongRoute = express.Router();
const songController = require('../controllers/SongController');

SongRoute.get('/getSong', songController.obtenerCancion);
SongRoute.get('/aportar_canto', songController.abrirFormularioCrearCancion);
SongRoute.get('/cancionesde', songController.obtenerCancionesPorCompositor);
SongRoute.get('/busqueda_especial', songController.abrirBusquedaEspecial);
SongRoute.get('/modificar_song', songController.openUpdateSong);
SongRoute.get('/busqueda_avanzada_filtros', songController.openBusquedaAvanzada);
SongRoute.get('/filteredSearching', songController.busquedaAvanzada);
SongRoute.get('/busqueda_para_lista', songController.obtenerCanciones);
SongRoute.get('/cambiarCompositor', songController.cambiarUnknownADesconocido);


SongRoute.post('/guardar_canto', songController.guardarCancion);

SongRoute.delete('/eliminar_song', songController.deleteOneSong);

SongRoute.put('/modificar_song', songController.updateOneSong);

module.exports = SongRoute;