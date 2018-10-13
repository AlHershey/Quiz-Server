// Quiz_DB.js

'use strict';

var fs = require('fs');

var express = require('express');
var router = express.Router();

var eah3util = require('./EAH3Util');

// middleware that is specific to this router
router.use(function timeLog (req, res, next) {
    next();
});

router.get('/Hello', function(req, res) {
    res.send('Hello.');
    eah3util.noop();
});

// let timerPulse = setInterval(pulseBeat, 5*1000);
// function pulseBeat() {
//     const _cmd = 'pulseBeat';
//     // console.log(`${_cmd} ${(new Date()).getTime()}`);
// }

const pathRoot = '/Users/hershal/SkyDrive/Mirror TP4F/TestHome/Quiz/v5/TP4FQuizDB';
const bAutoWrite = true;
let bWriteMemOnly = false;

const oDB = {};
function dbRead(pathRoot) {
    dbReadOrgs(pathRoot);
    dbReadUsers(pathRoot);
    dbReadQuizs(pathRoot);
    dbReadTakes(pathRoot);
}
function dbReadOrgs(pathRoot) {
    const _cmd = 'dbReadOrgs';
    const pathOrgs = pathRoot + '/' + 'Orgs.json';
    const jsonOrgs = fs.readFileSync(pathOrgs, { encoding: 'utf8' });
    oDB.oOrgs = JSON.parse(jsonOrgs);
    console.log(`${_cmd}: oDB.oOrgs.aOrgs.length=${oDB.oOrgs.aOrgs.length} oDB.oOrgs.iLastSeqOrgs=${oDB.oOrgs.iLastSeqOrgs}`);
    eah3util.noop();
}
function dbReadUsers(pathRoot) {
    const _cmd = 'dbReadUsers';
    const pathUsers = pathRoot + '/' + 'Users.json';
    const jsonUsers = fs.readFileSync(pathUsers, { encoding: 'utf8' });
    oDB.oUsers = JSON.parse(jsonUsers);
    console.log(`${_cmd}: oDB.oUsers.aUsers.length=${oDB.oUsers.aUsers.length} oDB.oUsers.iLastSeqUsers=${oDB.oUsers.iLastSeqUsers}`);
    eah3util.noop();
}
function dbReadQuizs(pathRoot) {
    const _cmd = 'dbReadQuizs';
    const pathQuizs = pathRoot + '/' + 'Quizs.json';
    const jsonQuizs = fs.readFileSync(pathQuizs, { encoding: 'utf8' });
    oDB.oQuizs = JSON.parse(jsonQuizs);
    console.log(`${_cmd}: oDB.oQuizs.aQuizs.length=${oDB.oQuizs.aQuizs.length} oDB.oQuizs.iLastSeqQuizs=${oDB.oQuizs.iLastSeqQuizs}`);
    eah3util.noop();
}
function dbReadTakes(pathRoot) {
    const _cmd = 'dbReadTakes';
    oDB.oTakes = {};
    oDB.oTakes.aTakes = [];
    const pathTakes = pathRoot + '/' + 'Takes.txt';
    const sAllTakes = fs.readFileSync(pathTakes, { encoding: 'utf8' });
    const aLines = sAllTakes.split('\n');
    for (let indLine = 0; indLine < aLines.length; indLine++) {
        const sLine = aLines[indLine].trim();
        if (sLine.length < 1) {
            continue;
        }
        const aParts = sLine.split('\t');
        if (aParts.length != 5) {
            console.log(`${_cmd}: line ${indLine+1} - wrong #Parts: ${aParts.length}`);
            break;
        }
        const oTake = {};
        oTake._uniqUser = aParts[0];
        const oUser = dbFindUserBy_uniqUser(oTake._uniqUser);
        if (!oUser) {
            console.log(`$(_cmd_: line ${indLine+1} - User(${oTake._uniqUser}) not found? - ignored`);
            continue;
        }
        oTake._uniqQuiz = aParts[1];
        const oQuiz = dbFindQuizBy_uniqQuiz(oTake._uniqQuiz);
        if (!oQuiz) {
            console.log(`$(_cmd_: line ${indLine+1} - Quiz(${oTake._uniqQuiz}) not found? - ignored`);
            continue;
        }
        oTake.sQuestSubId = aParts[2];
        oTake.sQuestTake = aParts[3];
        oTake.bQuestIsGraded = (aParts[4] == 'true') ? true : false;

        oTake._uniqOrg = oQuiz._uniqOrgOwner;

        oDB.oTakes.aTakes.push(oTake);
    } // for indLine
    console.log(`${_cmd}: oDB.oTakes.aTakes.length=${oDB.oTakes.aTakes.length}`);
    eah3util.noop();
}
function dbWrite(pathRoot) {
    dbWriteOrgs(pathRoot);
    dbWriteUsers(pathRoot);
    dbWriteQuizs(pathRoot);
    dbWriteTakes(pathRoot);
}
function dbWriteOrgs(pathRoot) {
    const _cmd = 'dbWriteOrgs';
    console.log(`${_cmd}: oDB.oOrgs.aOrgs.length=${oDB.oOrgs.aOrgs.length} oDB.oOrgs.iLastSeqOrgs=${oDB.oOrgs.iLastSeqOrgs}`);
    const pathOrgs = pathRoot + '/' + 'Orgs.json';
    const jsonOrgs = JSON.stringify(oDB.oOrgs, null, '\t');
    if (bWriteMemOnly) {
        return;
    }
    fs.writeFileSync(pathOrgs, jsonOrgs, { encoding: 'utf8' });
    console.log(`${_cmd}: written`);
    eah3util.noop();
}
function dbWriteUsers(pathRoot) {
    const _cmd = 'dbWriteUsers';
    console.log(`${_cmd}: oDB.oUsers.aUsers.length=${oDB.oUsers.aUsers.length} oDB.oUsers.iLastSeqUsers=${oDB.oUsers.iLastSeqUsers}`);
    const pathUsers = pathRoot + '/' + 'Users.json';
    const jsonUsers = JSON.stringify(oDB.oUsers, null, '\t');
    if (bWriteMemOnly) {
        return;
    }
    fs.writeFileSync(pathUsers, jsonUsers, { encoding: 'utf8' });
    console.log(`${_cmd}: written`);
    eah3util.noop();
}
function dbWriteQuizs(pathRoot) {
    const _cmd = 'dbWriteQuizs';
    console.log(`${_cmd}: oDB.oQuizs.aQuizs.length=${oDB.oQuizs.aQuizs.length} oDB.oQuizs.iLastSeqQuizs=${oDB.oQuizs.iLastSeqQuizs}`);
    const pathQuizs = pathRoot + '/' + 'Quizs.json';
    const jsonQuizs = JSON.stringify(oDB.oQuizs, null, '\t');
    if (bWriteMemOnly) {
        return;
    }
    fs.writeFileSync(pathQuizs, jsonQuizs, { encoding: 'utf8' });
    console.log(`${_cmd}: written`);
    eah3util.noop();
}
function dbWriteTakes(pathRoot) {
    const _cmd = 'dbWriteTakes';
    console.log(`${_cmd}: oDB.oTakes.aTakes.length=${oDB.oTakes.aTakes.length}`);
    const pathTakes = pathRoot + '/' + 'Takes.txt';
    let sAllTakes = '';
    for (const oTake of oDB.oTakes.aTakes) {
        const sLine = `${oTake._uniqUser}\t${oTake._uniqQuiz}\t${oTake.sQuestSubId}\t${oTake.sQuestTake}\t${oTake.bQuestIsGraded}`;
        sAllTakes += sLine + '\n';
    }
    if (bWriteMemOnly) {
        return;
    }
    fs.writeFileSync(pathTakes, sAllTakes, { encoding: 'utf8' });
    console.log(`${_cmd}: written`);
    eah3util.noop();
}

dbRead(pathRoot); // read upon startup

function dbFindOrgBy_uniqOrg(_uniqOrg) {
    const indOrg = dbFindIndOrgBy_uniqOrg(_uniqOrg);
    if (indOrg >= 0) {
        return oDB.oOrgs.aOrgs[indOrg];
    }
    return null;
}
function dbFindIndOrgBy_uniqOrg(_uniqOrg) {
    // for (let indOrg = 0; indOrg < oDB.oOrgs.aOrgs.length; indOrg++) {
    //     const oOrg = oDB.oOrgs.aOrgs[indOrg];
    //     if (oOrg._uniqOrg == _uniqOrg) {
    //         return indOrg;
    //     }
    // } // for indOrg
    // return -1;
    const indOrg = oDB.oOrgs.aOrgs.findIndex(function (oOrg) {
        return (oOrg._uniqOrg == _uniqOrg);
    });
    return indOrg;
}
function dbFindOrgByOrgId(sOrgId) {
    const indOrg = dbFindIndOrgByOrgId(sOrgId);
    if (indOrg >= 0) {
        return oDB.oOrgs.aOrgs[indOrg];
    }
    return null;
}
function dbFindIndOrgByOrgId(sOrgId) {
    // for (let indOrg = 0; indOrg < oDB.oOrgs.aOrgs.length; indOrg++) {
    //     const oOrg = oDB.oOrgs.aOrgs[indOrg];
    //     if (oOrg.sOrgId.toUpperCase() == sOrgId.toUpperCase()) {
    //         return indOrg;
    //     }
    // } // for indOrg
    // return -1;
    const indOrg = oDB.oOrgs.aOrgs.findIndex(function (oOrg) {
        return (oOrg.sOrgId.toUpperCase() == sOrgId.toUpperCase());
    });
    return indOrg;
}

function dbFindUserBy_uniqUser(_uniqUser) {
    const indUser = dbFindIndUserBy_uniqUser(_uniqUser);
    if (indUser >= 0) {
        const oUser = oDB.oUsers.aUsers[indUser];
        return oUser;
    }
    return null;
}
function dbFindIndUserBy_uniqUser(_uniqUser) {
    for (let indUser = 0; indUser < oDB.oUsers.aUsers.length; indUser++) {
        const oUser = oDB.oUsers.aUsers[indUser];
        if (oUser._uniqUser == _uniqUser) {
            return indUser;
        }
    }
    return -1;
}
function dbFindUserByOrgUserEMail(oOrg, sUserEMail) {
    const indUser = dbFindIndUserByOrgUserEMail(oOrg, sUserEMail);
    if (indUser >= 0) {
        const oUser = oDB.oUsers.aUsers[indUser];
        return oUser;
    }
    return null;
}
function dbFindIndUserByOrgUserEMail(oOrg, sUserEMail) {
    for (let indUser = 0; indUser < oDB.oUsers.aUsers.length; indUser++) {
        const oUser = oDB.oUsers.aUsers[indUser];
        if (oUser._uniqOrgOwner == oOrg._uniqOrg &&
            oUser.sUserEMail.toUpperCase() == sUserEMail.toUpperCase()) {
            return indUser;
        }
    }
    return -1;
}
function sanitizedUser(oUser) {
    const oUserUse = eah3util.copyDeep(oUser);
    delete oUserUse.sUserPWHash;
    return oUserUse;
}

function dbFindQuizBy_uniqQuiz(_uniqQuiz) {
    const indQuiz = dbFindIndQuizBy_uniqQuiz(_uniqQuiz);
    if (indQuiz >= 0) {
        return oDB.oQuizs.aQuizs[indQuiz];
    }
    return null;
}
function dbFindIndQuizBy_uniqQuiz(_uniqQuiz) {
    for (let indQuiz = 0; indQuiz < oDB.oQuizs.aQuizs.length; indQuiz++) {
        const oQuiz = oDB.oQuizs.aQuizs[indQuiz];
        if (oQuiz._uniqQuiz == _uniqQuiz) {
            return indQuiz;
        }
    } // for indQuiz
    return -1;
}
function dbFindQuizByQuizId(sQuizId) {
    const indQuiz = dbFindIndQuizByQuizId(sQuizId);
    if (indQuiz >= 0) {
        return oDB.oQuizs.aQuizs[indQuiz];
    }
    return null;
}
function dbFindIndQuizByQuizId(sQuizId) {
    for (let indQuiz = 0; indQuiz < oDB.oQuizs.aQuizs.length; indQuiz++) {
        const oQuiz = oDB.oQuizs.aQuizs[indQuiz];
        if (oQuiz.sQuizId.toUpperCase() == sQuizId.toUpperCase()) {
            return indQuiz;
        }
    } // for indQuiz
    return -1;
}

function dbFindTakes(_uniqOrg, _uniqUser, _uniqQuiz, sQuestSubId) {
    let aTakesRet = [];
    oDB.oTakes.aTakes.forEach(function (oTake) {
        if (_uniqOrg && _uniqOrg != oTake._uniqOrg) {
            return;
        }
        if (_uniqUser && _uniqUser != oTake._uniqUser) {
            return;
        }
        if (_uniqQuiz && _uniqQuiz != oTake._uniqQuiz) {
            return;
        }
        if (sQuestSubId && sQuestSubId != oTake.sQuestSubId) {
            return;
        }
        aTakesRet.push(oTake);
    });
    return aTakesRet;
}
function dbFindIndTake(_uniqUser, _uniqQuiz, sQuestSubId) {
    const indTake = oDB.oTakes.aTakes.findIndex(function (oTake) {
        return (oTake._uniqUser == _uniqUser &&
                oTake._uniqQuiz == _uniqQuiz &&
                oTake.sQuestSubId == sQuestSubId);
    });
    return indTake;
}

router.use('/ReRead', function(req, res) {
    const oRes = {};
    let pathUse = pathRoot;
    dbRead(pathUse);
    oRes.iNumOrgs = oDB.oOrgs.aOrgs.length;
    oRes.iNumUsers = oDB.oUsers.aUsers.length;
    oRes.iNumQuizs = oDB.oQuizs.aQuizs.length;
    oRes.iNumTakes = oDB.oTakes.aTakes.length;
    res.json(oRes);
    eah3util.noop();
});

router.use('/ReWrite', function(req, res) {
    const oRes = {};
    const bMWSave = bWriteMemOnly;
    bWriteMemOnly = false;
    let pathUse = pathRoot;
    dbWrite(pathUse);
    bWriteMemOnly = bMWSave;
    oRes.iNumOrgs = oDB.oOrgs.aOrgs.length;
    oRes.iNumUsers = oDB.oUsers.aUsers.length;
    oRes.iNumQuizs = oDB.oQuizs.aQuizs.length;
    oRes.iNumTakes = oDB.oTakes.aTakes.length;
    res.json(oRes);
    eah3util.noop();
});

router.post('/ListAll', function (req, res) {
    const oRes = {};
    const sBody = req.body;
    const oBody = JSON.parse(sBody);

    // optional
    if (oBody.bIncludeOrgs) {
        oRes.aOrgs = oDB.oOrgs.aOrgs;
    }
    if (oBody.bIncludeUsers) {
        oRes.aUsers = [];
        for (const oUser of oDB.oUsers.aUsers) {
            // special for User
            const oUserUse = sanitizedUser(oUser);
            oRes.aUsers.push(oUserUse);
        } // for oUser
    }
    if (oBody.bIncludeQuizs || oBody.bIncludeQuizLites) {
        oRes.aQuizs = [];
        for (const oQuiz of oDB.oQuizs.aQuizs) {
            if (oBody.bIncludeQuizLites) {
                const oQuizLite = eah3util.copyDeep(oQuiz);
                delete oQuizLite.aQuizQuests;
                oRes.aQuizs.push(oQuizLite);
            } else {
                oRes.aQuizs.push(oQuiz);
            }
        } // for oQuiz
    }
    res.json(oRes);
});

router.post('/Org/Create', function(req, res) {
    const oRes = {};
    const sBody = req.body;
    const oBody = JSON.parse(sBody);
    if (!oBody.oOrg) {
        oRes.err = `BadParms: Invalid parameters`;
        res.json(oRes);
        return;
    }
    const oOrgPar = oBody.oOrg;

    // required
    if (!oOrgPar.sOrgId) {
        oRes.err = `BadParms: Invalid parameters`;
        res.json(oRes);
        return;
    }
    // not allowed
    if (oOrgPar._uniqOrg || oOrgPar._ver) {
        oRes.err = `BadParms: Invalid parameters`;
        res.json(oRes);
        return;
    }
    // check dup OrgId
    const oOrgDup = dbFindOrgByOrgId(oOrgPar.sOrgId);
    if (oOrgDup) {
        oRes.err = 'Dup: Duplicate sOrgId';
        res.json(oRes);
        return;
    }

    // assign things
    oDB.oOrgs.iLastSeqOrgs += 1;
    oOrgPar._uniqOrg = 'Org' + oDB.oOrgs.iLastSeqOrgs;
    oOrgPar._ver = 1;

    // add to db
    oDB.oOrgs.aOrgs.push(oOrgPar);

    if (bAutoWrite) {
        dbWriteOrgs(pathRoot);
    }

    oRes.oOrg = oOrgPar;
    res.json(oRes);
    eah3util.noop();
});
router.post('/Org/Read', function(req, res) {
    const oRes = {};
    const sBody = req.body;
    const oBody = JSON.parse(sBody);
    // required
    let oOrgDB;
    if (oBody._uniqOrg) {
        oOrgDB = dbFindOrgBy_uniqOrg(oBody._uniqOrg);
    } else
    if (oBody.sOrgId) {
        oOrgDB = dbFindOrgByOrgId(oBody.sOrgId);
    } else {
        oRes.err = `BadParms: Invalid parameters`;
        res.json(oRes);
        return;
    }
    if (!oOrgDB) {
        oRes.err = `NotFound: ${oBody._uniqOrg}`;
        res.json(oRes);
        return;
    }
    oRes.oOrg = oOrgDB;

    // optional
    if (oBody.bIncludeUsers) {
        oRes.aUsers = [];
        for (const oUser of oDB.oUsers.aUsers) {
            if (oUser._uniqOrgOwner == oRes.oOrg._uniqOrg) {
                const oUserUse = sanitizedUser(oUser);
                oRes.aUsers.push(oUserUse);
            }
        } // for oUser
    }
    if (oBody.bIncludeQuizs || oBody.bIncludeQuizLites) {
        oRes.aQuizs = [];
        for (const oQuiz of oDB.oQuizs.aQuizs) {
            if (oQuiz._uniqOrgOwner == oRes.oOrg._uniqOrg) {
                if (oBody.bIncludeQuizLites) {
                    const oQuizLite = eah3util.copyDeep(oQuiz);
                    oQuizLite.iQuizNumQuests = oQuizLite.aQuizQuests.length;
                    delete oQuizLite.aQuizQuests;
                    oRes.aQuizs.push(oQuizLite);
                } else {
                    oRes.aQuizs.push(oQuiz);
                }
            }
        } // for oQuiz
    }
    if (oBody.bIncludeTakes) {
        oRes.aTakes = dbFindTakes(oRes.oOrg._uniqOrg, null, null, null);
    }

    res.json(oRes);
    eah3util.noop();
});
router.post('/Org/Update', function(req, res) {
    const oRes = {};
    const sBody = req.body;
    const oBody = JSON.parse(sBody);
    if (!oBody.oOrg) {
        oRes.err = `BadParms: Invalid parameters`;
        res.json(oRes);
        return;
    }
    const oOrgPar = oBody.oOrg;

    // required
    if (!oOrgPar.sOrgId) {
        oRes.err = `BadParms: Invalid parameters`;
        res.json(oRes);
        return;
    }
    // more required
    if (!oOrgPar._uniqOrg || !oOrgPar._ver) {
        oRes.err = `BadParms: Invalid parameters`;
        res.json(oRes);
        return;
    }
    // find old
    const indOrgDB = dbFindIndOrgBy_uniqOrg(oOrgPar._uniqOrg);
    if (indOrgDB < 0) {
        oRes.err = 'NotFound: Org not found';
        res.json(oRes);
        return;
    }
    const oOrgDB = oDB.oOrgs.aOrgs[indOrgDB];

    // check _ver to make sure same before updates
    if (oOrgDB._ver != oOrgPar._ver) {
        oRes.err = 'Expired: Changed while you werent looking';
        res.json(oRes);
        return;
    }
    // check dup OrgId
    if (oOrgDB.sOrgId != oOrgPar.sOrgId) {
        const oOrgDup = dbFindOrgByOrgId(oOrgPar.sOrgId);
        if (oOrgDup && oOrgDup._uniqOrg != oOrgPar._uniqOrg) {
            oRes.err = 'Dup: Duplicate sOrgId';
            res.json(oRes);
            return;
        }
    }

    // update things
    oOrgPar._ver += 1;
    oDB.oOrgs.aOrgs.splice(indOrgDB, 1, oOrgPar);

    if (bAutoWrite) {
        dbWriteOrgs(pathRoot);
    }

    oRes.oOrg = oOrgPar;
    res.json(oRes);
    eah3util.noop();
});
router.post('/Org/Delete', function(req, res) {
    const oRes = {};
    const sBody = req.body;
    const oBody = JSON.parse(sBody);

    // required
    if (!oBody.oOrg) {
        oRes.err = `BadParms: Invalid parameters`;
        res.json(oRes);
        return;
    }
    let oOrgPar = oBody.oOrg;
    if (!oOrgPar._uniqOrg) {
        oRes.err = `BadParms: Invalid parameters`;
        res.json(oRes);
        return;
    }
    const indOrgDB = dbFindIndOrgBy_uniqOrg(oOrgPar._uniqOrg);
    if (indOrgDB < 0) {
        oRes.err = `NotFound: Not Found`;
        res.json(oRes);
        return;
    }
    const oOrgDB = oDB.oOrgs.aOrgs[indOrgDB];
    if (!oOrgPar._ver) {
        oRes.err = `BadParms: Invalid parameters`;
        res.json(oRes);
        return;
    }
    if (oOrgPar._ver != oOrgDB._ver) {
        oRes.err = 'Expired: Changed while you werent looking';
        res.json(oRes);
        return;
    }
    
    // cascading deletes

    let iNumDelUsers = 0;
    for (let indUser = 0; indUser < oDB.oUsers.aUsers.length; indUser++) {
        const oUser = oDB.oUsers.aUsers[indUser];
        if (oUser._uniqOrgOwner == oOrgDB._uniqOrg) {
            oDB.oUsers.aUsers.splice(indUser, 1);
            indUser -= 1;
            iNumDelUsers += 1;
        }
    } // for indUser
    oRes.iNumDelUsers = iNumDelUsers;
    let iNumDelQuizs = 0;
    for (let indQuiz = 0; indQuiz < oDB.oQuizs.aQuizs.length; indQuiz++) {
        const oQuiz = oDB.oQuizs.aQuizs[indQuiz];
        if (oQuiz._uniqOrgOwner == oOrgDB._uniqOrg) {
            oDB.oQuizs.aQuizs.splice(indQuiz, 1);
            indQuiz -= 1;
            iNumDelQuizs += 1;
        }
    } // for indQuiz
    oRes.iNumDelQuizs = iNumDelQuizs;

    if (oBody.bReturnOrg) {
        oRes.oOrg = oOrgDB;
    }

    // actually delete
    oDB.oOrgs.aOrgs.splice(indOrgDB, 1);

    if (bAutoWrite) {
        dbWriteOrgs(pathRoot);
    }

    res.json(oRes);
    eah3util.noop();
});

router.post('/User/Create', function(req, res) {
    const oRes = {};
    const sBody = req.body;
    const oBody = JSON.parse(sBody);
    if (!oBody.oUser) {
        oRes.err = `BadParms: Invalid parameters`;
        res.json(oRes);
        return;
    }
    const oUserPar = oBody.oUser;

    // required
    if (!oUserPar.sUserEMail || !oUserPar.sUserNameFirst || !oUserPar.sUserNameLast) {
        oRes.err = `BadParms: Invalid parameters`;
        res.json(oRes);
        return;
    }
    // not allowed
    if (oUserPar._uniqUser || oUserPar._ver) {
        oRes.err = `BadParms: Invalid parameters`;
        res.json(oRes);
        return;
    }
    // check dup UserEMail
    const oOrgOwner = dbFindOrgBy_uniqOrg(oUserPar._uniqOrgOwner);
    if (!oOrgOwner) {
        // Org not found
        oRes.err = `BadParms: Unknown Org`;
        res.json(oRes);
        return;
    }
    const oUserDup = dbFindUserByOrgUserEMail(oOrgOwner, oUserPar.sUserEMail);
    if (oUserDup) {
        oRes.err = 'Dup: Duplicate sUserEMail';
        res.json(oRes);
        return;
    }

    // assign things
    oDB.oUsers.iLastSeqUsers += 1;
    oUserPar._uniqUser = 'User' + oDB.oUsers.iLastSeqUsers;
    oUserPar._ver = 1;

    // add to db
    oDB.oUsers.aUsers.push(oUserPar);

    if (bAutoWrite) {
        dbWriteUsers(pathRoot);
    }

    oRes.oUser = oUserPar;
    res.json(oRes);
    eah3util.noop();
});
router.post('/User/Read', function(req, res) {
    const oRes = {};
    const sBody = req.body;
    const oBody = JSON.parse(sBody);
    // required
    if (!oBody._uniqUser) {
        oRes.err = `BadParms: Invalid parameters`;
        res.json(oRes);
        return;
    }
    const oUserDB = dbFindUserBy_uniqUser(oBody._uniqUser);
    if (!oUserDB) {
        oRes.err = `NotFound: ${oBody._uniqUser}`;
        res.json(oRes);
        return;
    }

    // special for User
    const oUserUse = sanitizedUser(oUserDB);
    oRes.oUser = oUserUse;

    // optional
    if (oBody.bIncludeOrg) {
        oRes.oOrg = dbFindOrgBy_uniqOrg(oRes.oUser._uniqOrgOwner);
        if (!oRes.oOrg) {
            oRes.err = `Err: User(${oRes.oUser._uniqUser}): OrgOwner(${oRes.oUser._uniqOrgOwner}) not found`;
            res.json(oRes);
            return;
        }
    }

    res.json(oRes);
    eah3util.noop();
});
router.post('/User/Update', function(req, res) {
    const oRes = {};
    const sBody = req.body;
    const oBody = JSON.parse(sBody);
    if (!oBody.oUser) {
        oRes.err = `BadParms: Invalid parameters`;
        res.json(oRes);
        return;
    }
    const oUserPar = oBody.oUser;

    // required
    if (!oUserPar.sUserEMail || !oUserPar.sUserNameFirst || !oUserPar.sUserNameLast) {
        oRes.err = `BadParms: Invalid parameters`;
        res.json(oRes);
        return;
    }
    // more required
    if (!oUserPar._uniqUser || !oUserPar._ver) {
        oRes.err = `BadParms: Invalid parameters`;
        res.json(oRes);
        return;
    }
    // find old
    const indUserDB = dbFindIndUserBy_uniqUser(oUserPar._uniqUser);
    if (indUserDB < 0) {
        oRes.err = 'NotFound: User not found';
        res.json(oRes);
        return;
    }
    const oUserDB = oDB.oUsers.aUsers[indUserDB];

    // check _ver to make sure same before updates
    if (oUserDB._ver != oUserPar._ver) {
        oRes.err = 'Expired: Changed while you werent looking';
        res.json(oRes);
        return;
    }
    // check OrgOwner still valid
    const oOrgOwner = dbFindOrgBy_uniqOrg(oUserPar._uniqOrgOwner);
    if (!oOrgOwner) {
        oRes.err = 'NotFound: OrgOwner not found';
        res.json(oRes);
        return;
    }
    // check dup UserEMail
    if (oUserDB.sUserEMail != oUserPar.sUserEMail) {
        const oUserDup = dbFindUserByOrgUserEMail(oOrgOwner, oUserPar.sUserEMail);
        if (oUserDup && oUserDup._uniqUser != oUserPar._uniqUser) {
            oRes.err = 'Dup: Duplicate sUserEMail';
            res.json(oRes);
            return;
        }
    }

    // update things
    oUserPar._ver += 1;
    oDB.oUsers.aUsers.splice(indUserDB, 1, oUserPar);

    if (bAutoWrite) {
        dbWriteUsers(pathRoot);
    }

    oRes.oUser = oUserPar;
    res.json(oRes);
    eah3util.noop();
});
router.post('/User/Delete', function(req, res) {
    const oRes = {};
    const sBody = req.body;
    const oBody = JSON.parse(sBody);

    // required
    if (!oBody.oUser) {
        oRes.err = `BadParms: Invalid parameters`;
        res.json(oRes);
        return;
    }
    let oUserPar = oBody.oUser;
    if (!oUserPar._uniqUser) {
        oRes.err = `BadParms: Invalid parameters`;
        res.json(oRes);
        return;
    }
    const indUserDB = dbFindIndUserBy_uniqUser(oUserPar._uniqUser);
    if (indUserDB < 0) {
        oRes.err = `NotFound: Not Found`;
        res.json(oRes);
        return;
    }
    const oUserDB = oDB.oUsers.aUsers[indUserDB];
    if (!oUserPar._ver) {
        oRes.err = `BadParms: Invalid parameters`;
        res.json(oRes);
        return;
    }
    if (oUserPar._ver != oUserDB._ver) {
        oRes.err = 'Expired: Changed while you werent looking';
        res.json(oRes);
        return;
    }

    if (oBody.bReturnUser) {
        // special for User
        const oUserUse = sanitizedUser(oUserDB);
        oRes.oUser = oUserUse;
    }

    // actually delete
    oDB.oUsers.aUsers.splice(indUserDB, 1);

    if (bAutoWrite) {
        dbWriteUsers(pathRoot);
    }

    res.json(oRes);
    eah3util.noop();
});

router.post('/User/Check', function(req, res) {
    const oRes = {};
    const sBody = req.body;
    const oBody = JSON.parse(sBody);

    // required
    const sOrgId = oBody.sOrgId;
    if (!sOrgId) {
        oRes.err = `BadParms: Invalid parameters`;
        res.json(oRes);
        return;
    }
    const sUserEMail = oBody.sUserEMail;
    if (!sUserEMail) {
        oRes.err = `BadParms: Invalid parameters`;
        res.json(oRes);
        return;
    }

    // optional
    const sUserPWRaw = oBody.sUserPW;

    const oOrg = dbFindOrgByOrgId(sOrgId);
    if (!oOrg) {
        // Org not found
        oRes.err = `Fail:`;
        res.json(oRes);
        return;
    }
    const oUser = dbFindUserByOrgUserEMail(oOrg, sUserEMail);
    if (!oUser) {
        // User not found
        oRes.err = `Fail:`;
        res.json(oRes);
        return;
    }
    // have oUser - check PW
    if (oUser.sUserPWHash) {
        // PW required
        if (!sUserPWRaw) {
            oRes.err = 'PWRequired:';
            res.json(oRes);
            return;
        }
        pwCompare(sUserPWRaw, oUser.sUserPWHash, function (bResult) {
            if (!bResult) {
                oRes.err = `Fail:`;
                res.json(oRes);
                return;
            }
            oRes.oUser = {
                _uniqUser: oUser._uniqUser
            };
            res.json(oRes);
            return;
        });
    } else {
        // no PW required
        if (sUserPWRaw) {
            oRes.err = 'Fail:';
            res.json(oRes);
            return;
        }
        oRes.oUser = {
            _uniqUser: oUser._uniqUser
        };
        res.json(oRes);
    }
});
function pwCompare(sPW, sPWHash, cb) {
    const bOK = sPW == sPWHash;
    cb (bOK);
}

router.post('/Quiz/Create', function(req, res) {
    const oRes = {};
    const sBody = req.body;
    const oBody = JSON.parse(sBody);
    if (!oBody.oQuiz) {
        oRes.err = `BadParms: Invalid parameters`;
        res.json(oRes);
        return;
    }
    const oQuizPar = oBody.oQuiz;

    // required
    if (!oQuizPar._uniqOrgOwner || !oQuizPar.sQuizId) {
        oRes.err = `BadParms: Invalid parameters`;
        res.json(oRes);
        return;
    }
    // not allowed
    if (oQuizPar._uniqQuiz || oQuizPar._ver) {
        oRes.err = `BadParms: Invalid parameters`;
        res.json(oRes);
        return;
    }
    // check dup QuizId
    const oQuizDup = dbFindQuizByQuizId(oQuizPar.sQuizId);
    if (oQuizDup) {
        oRes.err = 'Dup: Duplicate sQuizId';
        res.json(oRes);
        return;
    }

    // assign things
    oDB.oQuizs.iLastSeqQuizs += 1;
    oQuizPar._uniqQuiz = 'Quiz' + oDB.oQuizs.iLastSeqQuizs;
    oQuizPar._ver = 1;

    // add to db
    oDB.oQuizs.aQuizs.push(oQuizPar);

    if (bAutoWrite) {
        dbWriteQuizs(pathRoot);
    }

    oRes.oQuiz = oQuizPar;
    res.json(oRes);
    eah3util.noop();
});
router.post('/Quiz/Read', function(req, res) {
    const oRes = {};
    const sBody = req.body;
    const oBody = JSON.parse(sBody);
    // required qqsv
    let oQuizDB;
    if (oBody._uniqQuiz) {
        oQuizDB = dbFindQuizBy_uniqQuiz(oBody._uniqQuiz);
    } else
    if (oBody.sQuizId) {
        oQuizDB = dbFindQuizByQuizId(oBody.sQuizId);
    } else {
        oRes.err = `BadParms: Invalid parameters`;
        res.json(oRes);
        return;
    }
    if (!oQuizDB) {
        oRes.err = `NotFound: ${oBody._uniqQuiz}`;
        res.json(oRes);
        return;
    }

    oRes.oQuiz = oQuizDB;

    let bAddTakes = false;
    let _uniqOrg;
    let _uniqUser;
    if (oBody._uniqOrgTakes) {
        _uniqOrg = oBody._uniqOrgTakes;
        _uniqUser = null;
        bAddTakes = true;
    } else if (oBody._uniqUserTakes) {
        _uniqOrg = null;
        _uniqUser = oBody._uniqUserTakes;
        bAddTakes = true;
    } else if (oBody.bAllTakes) {
        _uniqUser = null;
        bAddTakes = true;
    }
    if (bAddTakes) {
        const aTakes = dbFindTakes(_uniqOrg, _uniqUser, oQuizDB._uniqQuiz);
        oRes.aTakes = aTakes;
    }

    // optional

    res.json(oRes);
    eah3util.noop();
});
router.post('/Quiz/Update', function(req, res) {
    const oRes = {};
    const sBody = req.body;
    const oBody = JSON.parse(sBody);
    if (!oBody.oQuiz) {
        oRes.err = `BadParms: Invalid parameters`;
        res.json(oRes);
        return;
    }
    const oQuizPar = oBody.oQuiz;

    // required
    if (!oQuizPar._uniqOrgOwner || !oQuizPar.sQuizId) {
        oRes.err = `BadParms: Invalid parameters`;
        res.json(oRes);
        return;
    }
    // more required
    if (!oQuizPar._uniqQuiz || !oQuizPar._ver) {
        oRes.err = `BadParms: Invalid parameters`;
        res.json(oRes);
        return;
    }
    // find old
    const indQuizDB = dbFindIndQuizBy_uniqQuiz(oQuizPar._uniqQuiz);
    if (indQuizDB < 0) {
        oRes.err = 'NotFound: Quiz not found';
        res.json(oRes);
        return;
    }
    const oQuizDB = oDB.oQuizs.aQuizs[indQuizDB];

    // check _ver to make sure same before updates
    if (oQuizDB._ver != oQuizPar._ver) {
        oRes.err = 'Expired: Changed while you werent looking';
        res.json(oRes);
        return;
    }
    // check dup QuizId
    if (oQuizDB.sQuizId != oQuizPar.sQuizId) {
        const oQuizDup = dbFindQuizByQuizId(oQuizPar.sQuizId);
        if (oQuizDup && oQuizDup._uniqQuiz != oQuizPar._uniqQuiz) {
            oRes.err = 'Dup: Duplicate sQuizId';
            res.json(oRes);
            return;
        }
    }

    // update things
    oQuizPar._ver += 1;
    oDB.oQuizs.aQuizs.splice(indQuizDB, 1, oQuizPar);

    if (bAutoWrite) {
        dbWriteQuizs(pathRoot);
    }

    oRes.oQuiz = oQuizPar;
    res.json(oRes);
    eah3util.noop();
});
router.post('/Quiz/Delete', function(req, res) {
    const oRes = {};
    const sBody = req.body;
    const oBody = JSON.parse(sBody);

    // required
    if (!oBody.oQuiz) {
        oRes.err = `BadParms: Invalid parameters`;
        res.json(oRes);
        return;
    }
    let oQuizPar = oBody.oQuiz;
    if (!oQuizPar._uniqQuiz) {
        oRes.err = `BadParms: Invalid parameters`;
        res.json(oRes);
        return;
    }
    const indQuizDB = dbFindIndQuizBy_uniqQuiz(oQuizPar._uniqQuiz);
    if (indQuizDB < 0) {
        oRes.err = `NotFound: Not Found`;
        res.json(oRes);
        return;
    }
    const oQuizDB = oDB.oQuizs.aQuizs[indQuizDB];
    if (!oQuizPar._ver) {
        oRes.err = `BadParms: Invalid parameters`;
        res.json(oRes);
        return;
    }
    if (oQuizPar._ver != oQuizDB._ver) {
        oRes.err = 'Expired: Changed while you werent looking';
        res.json(oRes);
        return;
    }

    if (oBody.bReturnQuiz) {
        oRes.oQuiz = oQuizDB;
    }

    // actually delete
    oDB.oQuizs.aQuizs.splice(indQuizDB, 1);

    if (bAutoWrite) {
        dbWriteQuizs(pathRoot);
    }

    res.json(oRes);
    eah3util.noop();
});

router.use('/Take/ReRead', function(req, res) {
    const oRes = {};
    let pathUse = pathRoot;
    dbReadTakes(pathUse);
    oRes.iNumTakes = oDB.oTakes.aTakes.length;
    res.json(oRes);
    eah3util.noop();
});
router.use('/Take/ReWrite', function(req, res) {
    const oRes = {};
    const bMWSave = bWriteMemOnly;
    bWriteMemOnly = false;
    let pathUse = pathRoot;
    dbWriteTakes(pathUse);
    bWriteMemOnly = bMWSave;
    oRes.iNumTakes = oDB.oTakes.aTakes.length;
    res.json(oRes);
    eah3util.noop();
});
router.post('/Take/Read', function(req, res) {
    const oRes = {};
    const sBody = req.body;
    const oBody = JSON.parse(sBody);
    if (!oBody.oTake) {
        oRes.err = `BadParms: Invalid parameters`;
        res.json(oRes);
        return;
    }
    const oTakePar = oBody.oTake;

    // required
    // if (!oTakePar._uniqUser || !oTakePar._uniqQuiz || !oTakePar.sQuestSubId) {
    //     oRes.err = `BadParms: Invalid parameters`;
    //     res.json(oRes);
    //     return;
    // }
    // find
    const aTakesDB = dbFindTakes(
        oTakePar._uniqOrg,
        oTakePar._uniqUser, 
        oTakePar._uniqQuiz, 
        oTakePar.sQuestSubId);

    oRes.aTakes = aTakesDB;
    res.json(oRes);
    eah3util.noop();
});
router.post('/Take/UpdateOne', function(req, res) {
    const oRes = {};
    const sBody = req.body;
    const oBody = JSON.parse(sBody);
    if (!oBody.oTake) {
        oRes.err = `BadParms: Invalid parameters`;
        res.json(oRes);
        return;
    }
    const oTakePar = oBody.oTake;

    // required
    if (!oTakePar._uniqUser ||
        !oTakePar._uniqQuiz ||
        !oTakePar.sQuestSubId ||
        typeof(oTakePar.sQuestTake) != typeof('') ||
        typeof(oTakePar.bQuestIsGraded) != typeof(false)) {
        oRes.err = `BadParms: Invalid parameters`;
        res.json(oRes);
        return;
    }
    const oUser = dbFindUserBy_uniqUser(oTakePar._uniqUser);
    if (!oUser) {
        oRes.err = `BadParms: Invalid parameters`;
        res.json(oRes);
        return;
    }
    const oQuiz = dbFindQuizBy_uniqQuiz(oTakePar._uniqQuiz);
    if (!oQuiz) {
        oRes.err = `BadParms: Invalid parameters`;
        res.json(oRes);
        return;
    }

    oTakePar._uniqOrg = oQuiz._uniqOrgOwner;

    // find old
    const indTakeDB = dbFindIndTake(
        oTakePar._uniqUser, 
        oTakePar._uniqQuiz, 
        oTakePar.sQuestSubId);
    if (indTakeDB >= 0) {
        // have existing Take - replace it
        oDB.oTakes.aTakes.splice(indTakeDB, 1, oTakePar);
    } else {
        // no existing Take - add new
        oDB.oTakes.aTakes.push(oTakePar);
    }
    if (bAutoWrite) {
        dbWriteTakes(pathRoot);
    }

    oRes.oTake = oTakePar;
    res.json(oRes);
    eah3util.noop();
});

module.exports = router;
