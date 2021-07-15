//traer los moulos
const express = require('express');
const morgan = require('morgan');
const path = require('path');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const bcryptjs = require('bcryptjs');
const session = require('express-session');


const app = express(); //inicia el servidor

//configurar servidor
//1. configuramos los puertos
app.set('port', process.env.PORT || 3000);
//2. configuramos el motor de plantillas
app.set('view engine', 'ejs');
//3. configramos la carpeta de vistas
app.set('views', path.join(__dirname, '../app/views'));
//4. configuramos el body-parser para recibir solo datos
app.use(bodyParser.urlencoded({ extended: false }));

//5. Milddleware (pra recibir datos facilmente de los formularios)
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(morgan('dev')); //la app usa morgan y con "dev" envia siertos mensajes a consola (opcional)

//6.Configurar dotenv (variables del entorno)
dotenv.config({ path: path.join(__dirname, '../env/.env') });

//7. configuramos la ruta de public (se le pone /resources/ a la ruta de os archivos a llamar )
app.use('/resources', express.static(path.join(__dirname, '../public')));

//8.Configurar el manejo de sesiones
app.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true
}))


// EXPORTAMOS
module.exports = app;