// EAH3Util.js

'use strict';

module.exports = {

    datetimeToFormat: function (datetimeThis, sFormat) {
    var sRes = sFormat;
    do {
        var bAgain = false;
        var sPat;
        var indPat;
        var sSub;

        sPat = "[YYYY]";
        indPat = sRes.indexOf(sPat);
        if (indPat >= 0) {
            bAgain = true;
            sSub = "" + datetimeThis.getFullYear();
            sRes = sRes.substr(0, indPat) + sSub + sRes.substr(indPat + sPat.length);
        }

        sPat = "[YY]";
        indPat = sRes.indexOf(sPat);
        if (indPat >= 0) {
            bAgain = true;
            sSub = "" + (datetimeThis.getFullYear() % 100);
            sRes = sRes.substr(0, indPat) + sSub + sRes.substr(indPat + sPat.length);
        }

        sPat = "[MMMM]";
        indPat = sRes.indexOf(sPat);
        if (indPat >= 0) {
            bAgain = true;
            var aMMMM = [
                "January", "Februaru", "March", "April", "May", "June",
                "July", "August", "September", "October", "November", "December"
            ];
            var iM = datetimeThis.getMonth();
            sSub = aMMMM[iM];
            sRes = sRes.substr(0, indPat) + sSub + sRes.substr(indPat + sPat.length);
        }

        sPat = "[MMM]";
        indPat = sRes.indexOf(sPat);
        if (indPat >= 0) {
            bAgain = true;
            var aMMM = [
                "Jan", "Feb", "Mar", "Apr", "May", "Jun",
                "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
            ];
            var iM = datetimeThis.getMonth();
            sSub = aMMM[iM];
            sRes = sRes.substr(0, indPat) + sSub + sRes.substr(indPat + sPat.length);
        }

        sPat = "[MM]";
        indPat = sRes.indexOf(sPat);
        if (indPat >= 0) {
            bAgain = true;
            sSub = "" + (datetimeThis.getMonth() + 1);
            while (sSub.length < 2) { sSub = "0" + sSub; }
            sRes = sRes.substr(0, indPat) + sSub + sRes.substr(indPat + sPat.length);
        }

        sPat = "[M]";
        indPat = sRes.indexOf(sPat);
        if (indPat >= 0) {
            bAgain = true;
            sSub = "" + (datetimeThis.getMonth() + 1);
            sRes = sRes.substr(0, indPat) + sSub + sRes.substr(indPat + sPat.length);
        }

        sPat = "[DD]";
        indPat = sRes.indexOf(sPat);
        if (indPat >= 0) {
            bAgain = true;
            sSub = "" + datetimeThis.getDate();
            while (sSub.length < 2) { sSub = "0" + sSub; }
            sRes = sRes.substr(0, indPat) + sSub + sRes.substr(indPat + sPat.length);
        }

        sPat = "[D]";
        indPat = sRes.indexOf(sPat);
        if (indPat >= 0) {
            bAgain = true;
            sSub = "" + datetimeThis.getDate();
            sRes = sRes.substr(0, indPat) + sSub + sRes.substr(indPat + sPat.length);
        }

        sPat = "[dddd]";
        indPat = sRes.indexOf(sPat);
        if (indPat >= 0) {
            bAgain = true;
            var adddd = [
                "Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"
            ];
            var iW = datetimeThis.getDay();
            sSub = adddd[iW];
            sRes = sRes.substr(0, indPat) + sSub + sRes.substr(indPat + sPat.length);
        }

        sPat = "[ddd]";
        indPat = sRes.indexOf(sPat);
        if (indPat >= 0) {
            bAgain = true;
            var addd = [
                "Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"
            ];
            var iW = datetimeThis.getDay();
            sSub = addd[iW];
            sRes = sRes.substr(0, indPat) + sSub + sRes.substr(indPat + sPat.length);
        }

        sPat = "[HH]";
        indPat = sRes.indexOf(sPat);
        if (indPat >= 0) {
            bAgain = true;
            sSub = "" + datetimeThis.getHours();
            while (sSub.length < 2) { sSub = "0" + sSub; }
            sRes = sRes.substr(0, indPat) + sSub + sRes.substr(indPat + sPat.length);
        }

        sPat = "[H]";
        indPat = sRes.indexOf(sPat);
        if (indPat >= 0) {
            bAgain = true;
            sSub = "" + datetimeThis.getHours();
            sRes = sRes.substr(0, indPat) + sSub + sRes.substr(indPat + sPat.length);
        }

        sPat = "[hh]";
        indPat = sRes.indexOf(sPat);
        if (indPat >= 0) {
            bAgain = true;
            var iHours = datetimeThis.getHours();
            if (iHours > 12) { iHours -= 12; }
            if (iHours == 0) { iHours = 12; }
            sSub = "" + iHours;
            while (sSub.length < 2) { sSub = "0" + sSub; }
            sRes = sRes.substr(0, indPat) + sSub + sRes.substr(indPat + sPat.length);
        }

        sPat = "[h]";
        indPat = sRes.indexOf(sPat);
        if (indPat >= 0) {
            bAgain = true;
            var iHours = datetimeThis.getHours();
            if (iHours > 12) { iHours -= 12; }
            if (iHours == 0) { iHours = 12; }
            sSub = "" + iHours;
            sRes = sRes.substr(0, indPat) + sSub + sRes.substr(indPat + sPat.length);
        }

        sPat = "[mm]";
        indPat = sRes.indexOf(sPat);
        if (indPat >= 0) {
            bAgain = true;
            sSub = "" + datetimeThis.getMinutes();
            while (sSub.length < 2) { sSub = "0" + sSub; }
            sRes = sRes.substr(0, indPat) + sSub + sRes.substr(indPat + sPat.length);
        }

        sPat = "[m]";
        indPat = sRes.indexOf(sPat);
        if (indPat >= 0) {
            bAgain = true;
            sSub = "" + datetimeThis.getMinutes();
            sRes = sRes.substr(0, indPat) + sSub + sRes.substr(indPat + sPat.length);
        }

        sPat = "[ss]";
        indPat = sRes.indexOf(sPat);
        if (indPat >= 0) {
            bAgain = true;
            sSub = "" + datetimeThis.getSeconds();
            while (sSub.length < 2) { sSub = "0" + sSub; }
            sRes = sRes.substr(0, indPat) + sSub + sRes.substr(indPat + sPat.length);
        }

        sPat = "[s]";
        indPat = sRes.indexOf(sPat);
        if (indPat >= 0) {
            bAgain = true;
            sSub = "" + datetimeThis.getSeconds();
            sRes = sRes.substr(0, indPat) + sSub + sRes.substr(indPat + sPat.length);
        }

        sPat = "[ms]";
        indPat = sRes.indexOf(sPat);
        if (indPat >= 0) {
            bAgain = true;
            sSub = "" + datetimeThis.getMilliseconds();
            while (sSub.length < 3) { sSub = "0" + sSub; }
            sRes = sRes.substr(0, indPat) + sSub + sRes.substr(indPat + sPat.length);
        }

        sPat = "[aa]";
        indPat = sRes.indexOf(sPat);
        if (indPat >= 0) {
            bAgain = true;
            var iHours = datetimeThis.getHours();
            sSub = (iHours < 12) ? "am" : "pm";
            while (sSub.length < 2) { sSub = "0" + sSub; }
            sRes = sRes.substr(0, indPat) + sSub + sRes.substr(indPat + sPat.length);
        }

        sPat = "[a]";
        indPat = sRes.indexOf(sPat);
        if (indPat >= 0) {
            bAgain = true;
            var iHours = datetimeThis.getHours();
            sSub = (iHours < 12) ? "a" : "p";
            sRes = sRes.substr(0, indPat) + sSub + sRes.substr(indPat + sPat.length);
        }

    } while (bAgain);
    return sRes;
},

    copyDeep: function (oFrom, replacer, reviver) {
        // ECMA 6 assign only does a shallow copy
        const jsonTemp = JSON.stringify(oFrom, replacer);
        const oTo = JSON.parse(jsonTemp, reviver);
        return oTo;
    },


    // do nothing...
    noop: function () {}

};