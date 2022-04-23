"use strict";
exports.__esModule = true;
var express_1 = require("express");
var app = (0, express_1["default"])();
var port = 3000;
var hostname = '127.0.0.1';
require('dotenv').config();
var pg_1 = require("pg");
var client = new pg_1.Client();
client.connect();
app.listen(port, hostname, function () {
    console.log("Server running at http://".concat(hostname, ":").concat(port, "/"));
});
app.get('/foo/bar', function (request, response) {
    response.send("foo");
});
app.get('/api/times', function (request, response) {
    client.query('SELECT * FROM public."time"', [], function (err, res) {
        //console.log(res.rows.at(0))        
        //console.log(res.rows.at(0).startTime)
        client.end();
        response.send(res.rows);
    });
});
