const mysql = require('mysql');

var pool = mysql.createPool({
    connectionLimit: 100,
    host: 'localhost',
    user: 'root',
    password: 'abc123',
    database: 'grubhub'
});

module.exports = pool;