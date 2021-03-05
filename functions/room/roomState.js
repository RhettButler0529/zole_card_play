const { admin } = require('../admin');

const isIdle = (roomId, checkInterval = 500, checkLimit = 3) => new Promise((resolve, reject) => {
    var tries = 0;
    var timer = null;

    const check = () => {
        tries++;

        if (tries > checkLimit) {
            reject("room busy to long");
        }

        if (tries >= 2) {
          console.log(`tries is ${tries}`);
        }

        admin.database().ref(`rooms/${roomId}/roomIsBusy`).transaction((value) => {
            if (value === null) return value; // Special handler

            var busy = value || false;

            if (busy) {
                return;
            } else {
                return true;
            }
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
        }).catch(err => {
          if (timer) clearTimeout(timer);
          resolve();
        });
    }

    check();
});

const markIdle = (roomId) => new Promise((resolve, reject) => {
    admin.database().ref(`rooms/${roomId}/roomIsBusy`).transaction((value) => {
        if (value === null) return value; // Special handler
        return false;
    }).then((result) => {
        if (!result.committed) {
            reject("Cant mark idle");
        } else {
            resolve();
        }
    });
});


module.exports = {
    isIdle,
    markIdle
}
