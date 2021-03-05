const { admin } = require('../admin');
const dateStrFn = require('./common');

const log = (roomid, text, snapshot) => {

    if (!roomid || (!text && !snapshot)) {
        return;
    }

    var dateTimeFn = function (date) {
        var hh = (date.getUTCHours()).toString();
        var mm = (date.getUTCMinutes()).toString();
        var ss = (date.getUTCSeconds()).toString();
        var ms = (date.getUTCMilliseconds()).toString();

        return [(hh[1] ? hh : "0" + hh[0]), (mm[1] ? mm : "0" + mm[0]), (ss[1] ? ss : "0" + ss[0]), ms];
    };

  //  const date = new Date();
  //  const dateStr = dateStrFn(date);
  //  const timeParts = dateTimeFn(date);

    if (snapshot) {
      //  admin.database().ref(`detailedLogs/${dateStr}/${roomid}/${timeParts[0]}/${timeParts[1]}/${timeParts[2]}/${timeParts[3]}`).push(snapshot);
      //  admin.database().ref(`detailedLogs/datekeys/${dateStr}`).set(true);
    } else if (text) {
      //  admin.database().ref(`detailedLogs/${dateStr}/${roomid}/${timeParts[0]}/${timeParts[1]}/${timeParts[2]}/${timeParts[3]}`).push({ "msg": text });
      //  admin.database().ref(`detailedLogs/datekeys/${dateStr}`).set(true);
    }
};

module.exports = log;
