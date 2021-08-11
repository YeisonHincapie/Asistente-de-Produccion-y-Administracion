let mysql = require('mysql');
let config = require('./config.js');

let connection = mysql.createConnection(config);

// DELETE statment
let sql = `DELETE FROM todos WHERE id = ?`;

// delete a row with id 1
connection.query(sql, 1, (error, results, fields) => {
    if (error)
        return console.error(error.message);

    console.log('Deleted Row(s):', results.affectedRows);
});

connection.end();