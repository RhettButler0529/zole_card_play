const { admin } = require('../admin');

const isIdle = (roomId, checkInterval = 500, checkLimit = 10) => new Promise((resolve, reject) => {
  let tries = 0;
  let timer = null;

  const check = () => {
    tries++;

    if (tries > checkLimit) {
      reject('room busy to long');
    }

    admin.database().ref(`rooms/${roomId}/globalParams/chooseGameTypeBusy`).transaction((value) => {
      if (value === null) return value; // Special handler

      const busy = value || false;

      if (busy) {
        return;
      }
      return true;
    }).then((result) => {
      if (!result.committed) {
        clearTimeout(timer);
        timer = setTimeout(() => {
          check();
        }, checkInterval);
      } else {
        if (timer) clearTimeout(timer);
        resolve();
      }
    });
  };

  check();
});

const markIdle = roomId => new Promise((resolve, reject) => {
  admin.database().ref(`rooms/${roomId}/globalParams/chooseGameTypeBusy`).transaction((value) => {
    if (value === null) return value; // Special handler
    return false;
  }).then((result) => {
    if (!result.committed) {
      reject('Cant mark idle');
    } else {
      resolve();
    }
  });
});


module.exports = {
  isIdle,
  markIdle,
};
