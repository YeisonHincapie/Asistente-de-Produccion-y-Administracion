//llamamos el servidor configurado
const app = require('./config/server.js');
//const connection = require("./config/dbConnection");
require('./app/routes/rutas.js')(app);

//iniciamos el servidor en el puerto ya configurado
app.listen(app.get('port'), () => {
    console.log("servidor en el puerto: ", app.get("port"));
})