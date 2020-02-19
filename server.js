'use strict'

const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
var request = require('request');
const port = 8080;

const urlData = 'http://z.bokus.ru/user.json';

const server=express();

server.use(express.static('.'));
server.use(bodyParser.json());
server.use(cors());

server.get('/data', (req, res) => {
    request(urlData, function (error, response, body) {
    if (!error && response.statusCode == 200) {
        var importedJSON = JSON.parse(body);
        res.send(importedJSON);
    }
    })
   })

server.listen(port, () => {console.log(`Server listening at port ${port}`)})

