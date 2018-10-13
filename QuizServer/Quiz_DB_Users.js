// Quiz_DB_Users.js

'use strict';

var fs = require('fs');

var express = require('express');
var router = express.Router();

var eah3util = require('./EAH3Util');

router.get('/', function (req, res) {
    res.send('aUsers.length=' + aUsers.length)
});

router.get('/Hello', function(req, res) {
    eah3util.noop();
    res.send('Hello.');
});

router.get('/init', function (req, res) {
    aUsers.push('aa');
    aUsers.push('bb');
    res.send('aUsers.length=' + aUsers.length)
});

router.get('/add', function (req, res) {
    aUsers.push('' + aUsers.length);
    res.send('aUsers.length=' + aUsers.length)
});

module.exports = router;
