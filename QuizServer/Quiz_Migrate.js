// Quiz_Migrate.js
'use strict';

var fs = require('fs');

var express = require('express');
var router = express.Router();

var eah3util = require('./EAH3Util');

router.get('/Hello', function(req, res) {
    res.send('Hello.');
    eah3util.noop();
});

router.get('/Now', function(req, res) {
    const oRes = {};
    dbV4ToV5();
    res.json(oRes);
    eah3util.noop();
});

function dbV4ToV5() {
    const bDoOrgs = true;
    const bDoUsers = true;
    const bDoQuizs = true;
    if (!bDoOrgs && !bDoUsers && !bDoQuizs) {
        return;
    }

    const pathOldRoot = '/Users/hershal/SkyDrive/Mirror TP4F/TestHome/Quiz/v4/TP4FQuizDB';
    const pathOldIndex = pathOldRoot + '/' + 'index.json';
    const jsonIndex = fs.readFileSync(pathOldIndex, { encoding: 'utf8' });
    const oIndex = JSON.parse(jsonIndex);
    console.log('initDB' + ':' +
        ' oIndex.indexOrgOKeys.length=' + oIndex.indexOrgOKeys.length +
        ' oIndex.indexUserOKeys.length=' + oIndex.indexUserOKeys.length +
        ' oIndex.indexQuizOKeys.length=' + oIndex.indexQuizOKeys.length);
    eah3util.noop();

    const pathNewRoot = '/Users/hershal/SkyDrive/Mirror TP4F/TestHome/Quiz/v5/TP4FQuizDB';

    // Orgs
    if (bDoOrgs) {
        const pathMyOrgs = pathOldRoot + '/' + 'orgs';
        let oNewOrgs = {
            iLastSeqOrgs: oIndex.indexLastSeqOrgs,
            aOrgs: []
        };
        for (const oOrgOKey of oIndex.indexOrgOKeys) {
            const pathThisOrg = pathMyOrgs + '/' + oOrgOKey._uniq + '.json';
            const jsonOrg = fs.readFileSync(pathThisOrg, { encoding: 'utf8' });
            const oOldOrg = JSON.parse(jsonOrg);
            const oNewOrg = {};
            oNewOrg._uniqOrg = oOldOrg._uniq;
            oNewOrg._ver = 1;
            oNewOrg.sOrgId = oOldOrg.orgId;
            //oNewOrg.sOrgName = oOldOrg.orgName;
            for (const sProp in oOldOrg) {
                switch (sProp) {
                    case '_path':
                    case '_ver':
                    case 'orgParentOrg_uniq':
                        // ignore
                        break;
                    case '_uniq':
                    case 'orgId':
                    case 'orgName':
                        // above
                        break;
                    default:
                        console.log(`Org ${oOldOrg._uniq} unknown Prop: ${sProp}`);
                } // switch sProp
            } // for sProp
            oNewOrgs.aOrgs.push(oNewOrg);
            eah3util.noop();
        } // for oOrgOKey
        console.log('initDB' + ':' + ' oNewOrgs.aOrgs.length=' + oNewOrgs.aOrgs.length);
        eah3util.noop();

        const pathNewOrgs = pathNewRoot + '/' + 'Orgs.json';
        const jsonOrgs = JSON.stringify(oNewOrgs, null, '\t');
        fs.writeFileSync(pathNewOrgs, jsonOrgs, { encoding: 'utf8' });
    }

    // Users
    if (bDoUsers) {
        const pathMyUsers = pathOldRoot + '/' + 'users';
        let oNewUsers = {
            iLastSeqUsers: oIndex.indexLastSeqUsers,
            aUsers: []
        };
        var dictUsersByEMail = {};
        for (const oUserOKey of oIndex.indexUserOKeys) {
            const pathThisUser = pathMyUsers + '/' + oUserOKey._uniq + '.json';
            const jsonUser = fs.readFileSync(pathThisUser, { encoding: 'utf8' });
            const oOldUser = JSON.parse(jsonUser);
            const oNewUser = {};
            oNewUser._uniqUser = oOldUser._uniq;
            oNewUser._ver = 1;
            oNewUser.sUserEMail = oOldUser.userEMail;
            oNewUser.sUserNameFirst = oOldUser.userNameFirst;
            oNewUser.sUserNameLast = oOldUser.userNameLast;
            oNewUser._uniqOrgOwner = oOldUser.userOwnerOrg_uniq;
            if (oOldUser.userEMail == 'na@mail.com') {
                const aMailParts = oOldUser.userEMail.split('@');
                oNewUser.sUserEMail = oOldUser.userId + '@' + aMailParts[1];
            }
            const sUEMU = `${oNewUser._uniqOrgOwner}\t${oNewUser.sUserEMail}`.toUpperCase();
            const oUDup = dictUsersByEMail[sUEMU];
            if (oUDup) {
                console.log(`Dup: ${oUDup._uniqOrgOwner} ${oUDup._uniqUser} ${oNewUser._uniqUser} ${oNewUser.sUserEMail}`);
                continue;
            } else {
                dictUsersByEMail[sUEMU] = oNewUser;
            }
            for (const sProp in oOldUser) {
                switch (sProp) {
                    case '_path':
                    case '_ver':
                    case 'userId':
                        // ignore
                        break;
                    case '_uniq':
                    case 'userEMail':
                    case 'userNameFirst':
                    case 'userNameLast':
                    case 'userOwnerOrg_uniq':
                        // above
                        break;
                    case 'userIsAdmin':
                        oNewUser.bUserIsAdmin = oOldUser.userIsAdmin;
                        break;
                    case 'userIsSuperAdmin':
                        oNewUser.bUserIsSuperAdmin = oOldUser.userIsSuperAdmin;
                        break;
                    case 'userIsEditor':
                        oNewUser.bUserIsEditor = oOldUser.userIsEditor;
                        break;
                    case 'userIsSuperEditor':
                        oNewUser.bUserIsSuperEditor = oOldUser.userIsSuperEditor;
                        break;
                    case 'userIsTeacher':
                        oNewUser.bUserIsTeacher = oOldUser.userIsTeacher;
                        break;
                    case 'userIsSuperTeacher':
                        oNewUser.bUserIsSuperTeacher = oOldUser.userIsSuperTeacher;
                        break;
                    case 'userIsGuest':
                        oNewUser.bUserIsGuest = oOldUser.userIsGuest;
                        break;
                    default:
                        console.log(`User ${oOldUser._uniq} unknown Prop: ${sProp}`);
                } // switch sProp
            } // for sProp
            oNewUsers.aUsers.push(oNewUser);
            eah3util.noop();
        } // for oUserOKey
        console.log('initDB' + ':' + ' oNewUsers.aUsers.length=' + oNewUsers.aUsers.length);
        eah3util.noop();

        const pathNewUsers = pathNewRoot + '/' + 'Users.json';
        const jsonUsers = JSON.stringify(oNewUsers, null, '\t');
        fs.writeFileSync(pathNewUsers, jsonUsers, { encoding: 'utf8' });
    }

    // Quizs
    if (bDoQuizs) {
        const pathMyQuizs = pathOldRoot + '/' + 'quizs';
        let oNewQuizs = {
            iLastSeqQuizs: oIndex.indexLastSeqQuizs,
            aQuizs: []
        };
        for (const oQuizOKey of oIndex.indexQuizOKeys) {
            const pathThisQuiz = pathMyQuizs + '/' + oQuizOKey._uniq + '.json';
            const jsonQuiz = fs.readFileSync(pathThisQuiz, { encoding: 'utf8' });
            const oOldQuiz = JSON.parse(jsonQuiz);
            const oNewQuiz = {};
            oNewQuiz._uniqQuiz = oOldQuiz._uniq;
            oNewQuiz._ver = 1;
            oNewQuiz.sQuizId = oOldQuiz.quizId;
            oNewQuiz.sQuizName = oOldQuiz.quizName;
            oNewQuiz._uniqOrgOwner = oOldQuiz.quizOwnerOrg_uniq;
            for (const sQuizProp in oOldQuiz) {
                switch (sQuizProp) {
                    case '_path':
                    case '_ver':
                        // ignore
                        break;
                    case '_uniq':
                    case 'quizId':
                    case 'quizName':
                    case 'quizOwnerOrg_uniq':
                        // above
                        break;
                    case 'quizIsPublished':
                        oNewQuiz.bQuizIsPublished = oOldQuiz.quizIsPublished;
                        break;
                    case 'quizQSects':
                        oNewQuiz.aQuizQuests = [];
                        for (const oOldQSect of oOldQuiz.quizQSects) {
                            for (const sQSectProp in oOldQSect) {
                                switch (sQSectProp) {
                                    case 'qsectShort':
                                    case 'qsectText':
                                        // ignore
                                        break;
                                    case 'qsectQuests':
                                        for (const oOldQuest of oOldQSect.qsectQuests) {
                                            const oNewQuest = {};
                                            if (oOldQuest.questIsPoll) {
                                                oNewQuest.bQuestIsPoll = oOldQuest.questIsPoll;
                                            }
                                            oNewQuest.sQuestText = oOldQuest.questText;
                                            oNewQuest.sQuestHints = oOldQuest.questHints;
                                            oNewQuest.sQuestExplain = oOldQuest.questExplain;
                                            oNewQuest.eQuestType = oOldQuest.questType;
                                            for (const sQuestProp in oOldQuest) {
                                                switch (sQuestProp) {
                                                    case 'questShort':
                                                        // ignore
                                                        break;
                                                    case 'questText':
                                                    case 'questHints':
                                                    case 'questExplain':
                                                    case 'questType':
                                                        // above
                                                        break;
                                                    case 'questCorrect':
                                                        // special
                                                        break;
                                                    case 'questIsPoll':
                                                        // above
                                                        break;
                                                    case 'questAnss':
                                                        switch (oNewQuest.eQuestType) {
                                                            case 'MC1':
                                                            case 'MCM':
                                                            case 'TF':
                                                            case 'YN':
                                                                oNewQuest.aQuestAnss = [];
                                                                for (const oOldAns of oOldQuest.questAnss) {
                                                                    const oNewAns = {};
                                                                    oNewAns.sAnsShort = oOldAns.ansShort;
                                                                    oNewAns.sAnsText = oOldAns.ansText;
                                                                    if (!oNewQuest.bQuestIsPoll) {
                                                                        if (oNewQuest.eQuestType == 'MCM') {
                                                                            oNewAns.bAnsIsCorrect = oOldQuest.questCorrect.includes(oOldAns.ansShort);
                                                                        } else {
                                                                            oNewAns.bAnsIsCorrect = (oOldAns.ansShort == oOldQuest.questCorrect);
                                                                        }
                                                                    }
                                                                    oNewQuest.aQuestAnss.push(oNewAns);
                                                                }
                                                                break;
                                                            case 'FIN':
                                                            case 'FIT':
                                                                if (!oNewQuest.bQuestIsPoll) {
                                                                    oNewQuest.sQuestCorrect = oOldQuest.questCorrect;
                                                                }
                                                                break;
                                                            case 'QNA':
                                                                break;
                                                            default:
                                                                console.log(`Quiz ${oOldQuiz._uniq} Quest ${oOldQuest.questShort} unknown eQuestType: ${oNewQuest.eQuestType}`);
                                                        }
                                                        break;
                                                    default:
                                                        console.log(`Quiz ${oOldQuiz._uniq} Quest ${oOldQuest.questShort} unknown Prop: ${sQuestProp}`);
                                                } // switch sQuestProp
                                            } // for sQuestProp
                                            oNewQuiz.aQuizQuests.push(oNewQuest);
                                        } // for oOldQuest
                                        break;
                                    default:
                                        console.log(`Quiz ${oOldQuiz._uniq} QSect ${oOldQSect.qsectShort} unknown Prop: ${sQSectProp}`);
                                } // switch sQSectProp
                            } // for sQSectProp
                        } // for oOldQSect
                        break;
                    default:
                        console.log(`Quiz ${oOldQuiz._uniq} unknown Prop: ${sQuizProp}`);
                } // switch sQuizProp
            } // for sQuizProp
            oNewQuizs.aQuizs.push(oNewQuiz);
            eah3util.noop();
        } // for oQuizOKey
        console.log('initDB' + ':' + ' oNewQuizs.aQuizs.length=' + oNewQuizs.aQuizs.length);
        eah3util.noop();

        const pathNewQuizs = pathNewRoot + '/' + 'Quizs.json';
        const jsonQuizs = JSON.stringify(oNewQuizs, null, '\t');
        fs.writeFileSync(pathNewQuizs, jsonQuizs, { encoding: 'utf8' });
    }
}

module.exports = router;
