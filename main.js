const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const session = require('express-session');
const cookieParser = require('cookie-parser');


const ComposerRoute = require('./routes/ComposerRoute');
const ListRoute = require('./routes/ListRoute');
const SongRoute = require('./routes/SongRoute');
const UserRoute = require('./routes/UserRoute');
const SongAndComposerRoute = require('./routes/SongAndComposerRoute');

const app = express();

const PORT = 3000;

const user = 'espiritudeaire';
const password = '7080';
const nameDB = 'cantoral';
const dirDB = 'mongodb+srv://espiritudeaire:123@cluster0.lg823yo.mongodb.net/cantoral?retryWrites=true&w=majority'

mongoose.connect(dirDB, {})
    .then(() => {
        console.log('Base de datos conectada');
    })
    .catch((err) => {
        console.log('Error en la conexión a la base de datos', err);
    });

// Configuración de EJS
app.set('view engine', 'ejs');
app.set('views', __dirname + '/views');

app.use(express.static(__dirname + '/public'));
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

app.use(session({
    secret: '123',
    resave: true,
    saveUninitialized: true
}));

app.use((req, res, next) => {
    res.locals.session = req.session;
    next();
});

app.use('/api', ComposerRoute);
app.use('/api', SongRoute);
app.use('/api', SongAndComposerRoute);
app.use('/api', UserRoute);
app.use('/api', ListRoute);

app.get('/', (req, res) => {
    if (!req.session.user) {
        req.session.user = {
            user_name: 'default',
            name: 'default',
            last_name: 'default',
            level: 3
        }
    }
    res.render('index', {
        message: '',
        visible: ''
    });
});

app.get('/cerrar_sesion', (req, res) => {
    req.session.user = {
        user_name: 'default',
        name: 'default',
        last_name: 'default',
        level: 3
    }
    res.redirect('/');
});

app.listen(PORT, () => {
    console.log('Audiens');
});
