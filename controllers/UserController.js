const mongoose = require('mongoose');
const User = require('../models/User');

const UserController = {
    authentication: async (req, res) => {
        try {
            let { user_name, password } = req.body
            //console.log(req.body, user_name, password);
            let user = await User.findOne({ user_name }, '_id name last_name level user_name password');
            if (user) {
                if (password === user.password) {
                    console.log("INFORMACIÓN CORRECTA DEL USUARIO");
                    req.session.user = {
                        _id: user._id,
                        user_name,
                        name: user.name,
                        last_name: user.last_name,
                        level: user.level
                    }
                    res.status(200).redirect('/');
                } else {
                    console.log("contraseña incorrecta");
                    res.status(400).render('index', {
                        message: 'Contraseña incorrecta',
                        visible: '_on'
                    });
                }
            } else {
                console.log("no existe el usuario");
                res.status(400).render('index', {
                    message: 'No existe el usuario',
                    visible: '_on'
                });
            }
        } catch (error) {
            res.status(400).send({
                message: error,
                success: false
            });
        }
    },
    getAllLists: async (req, res) => {
        try {

            let allLists = await User.findOne({ user_name: req.session.user.user_name }, 'lists')
                .populate({
                    path: 'lists',
                    populate: { path: 'songs' }
                });
            res.status(200).json({
                allLists,
                success: true
            });
        } catch (error) {
            res.status(400).json({
                message: error,
                success: false
            });
        }
    },
    saveList: async (req, res) => {
        try {
            let id_Song = req.query.id_song;

        } catch (error) {
            res.status(400).send({
                message: error,
                success: false
            });
        }
    }
};

module.exports = UserController;