'use strict';
const configs = require('../config.js')
const mysql = require('mysql');
const config = mysql.createConnection({
    host: configs.mysql.host,
    user: configs.mysql.user,
    password: configs.mysql.pass,
    database: configs.mysql.db,
    port: 3306
});
config.connect();
module.exports = {config:config};