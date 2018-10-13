// QuizServer.js

'use strict';

var fs = require('fs');

var express = require('express');
var app     = express();

var eah3util = require('./EAH3Util');

// body-parser
var bodyParser = require('body-parser');
//app.use(bodyParser.urlencoded({ extended: false }));
//app.use(bodyParser.json());
app.use(bodyParser.text({
    limit: 2 * 1024 * 1024
}));

// allow XMLHttpRequests from other sites
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
    next();
});

// log requests
app.use(function(req, res, next) {
    var dtNow = new Date();
    var sNow = eah3util.datetimeToFormat(dtNow, '[YYYY]-[MM]-[DD] [HH]:[mm]:[ss].[ms]');

    // to console
    var sShow = sNow + ' ' + req.method + ' ' + req.originalUrl;
    if (req.method == 'POST' || req.method == 'PUT') {
        sShow += ' ' + 'req.body.length=' + req.body.length;
    }
    console.log(sShow);

    // to log file
    let bIsLocalHost = true;
    const sReferer = req.headers.referer;
    if (sReferer) {
        bIsLocalHost = (sReferer.indexOf('localhost:') >= 0);
    } else {
        const sHost = req.headers.host;
        if (sHost) {
            bIsLocalHost = (sHost.indexOf('localhost:') >= 0);
        } else {
            bIsLocalHost = true;
        }
    }
    if (bIsLocalHost) {
        // don't bother
    } else {
        const pathRoot = '/Users/hershal/SkyDrive/Mirror TP4F/TestHome/Quiz/v5/TP4FQuizDB';
        const sLogLine = `\
${sNow}\t\
${req.ip}\t\
${req.headers.referer}\t\
${req.method}\t\
${req.originalUrl}\t\
${req.body}\
\n`;
        const pathLog = pathRoot + '/' + 'Log.txt';
        fs.appendFileSync(pathLog, sLogLine, { encoding: 'utf8' });
    }

    next();
});

app.get('/Hello', function(req, res) {
    res.send('Hello.');
    noop();
});

app.get('/Echo', function(req, res) {
    const oRes = {};
    const oQuery = {};
    for (const sPar in req.query) {
        oQuery[sPar] = req.query[sPar];
    } // for sPar
    oRes.oQuery = oQuery;
    res.json(oRes);
    eah3util.noop();
});

app.post('/Echo', function(req, res) {
    const oRes = {};
    const sBody = req.body;
    var oBody = JSON.parse(sBody);
    oRes.oBody = oBody;
    res.json(oRes);
    eah3util.noop();
});

const sPort = '8085';
app.listen(sPort);
console.log('Magic happens on port ' + sPort);

module.exports = app;

var routeDB = require('./Quiz_DB');
app.use('/DB', routeDB);

var routeMigrate = require('./Quiz_Migrate');
app.use('/Migrate', routeMigrate);

//#region utilities

// polyfill

function noop() {}

//#endregion

