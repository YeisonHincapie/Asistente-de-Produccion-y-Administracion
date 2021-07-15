//modulo para conectarnos a  la base de datos
const mysql = require('mysql');

/*/configurar credenciales de ingreso
module.exports = () => {
    return mysql.createConnection({
        host: "localhost",
        user: "root",
        database: "sayfre"
    })
}*/

const Connection = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE
});

//Verificamos que la conexion sea correcta
Connection.connect((err) => {
    if (err) {
        console.log("Error de conexión a DB es: " + err);
        return;
    }
    console.log("Conectado exitosamente a log DB");
});

module.exports = Connection;