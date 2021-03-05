// const cors = require('cors')({ origin: true });

// const { admin } = require('../admin');

const cors = require('cors')({ origin: true });
const { admin, adminLogsDb, roomsDb } = require('../admin');
// const log = require('../logs/log');

const setLastRound = (req, res) => {
  cors(req, res, () => {
    if (!req.body || !req.body.data) {
      return res.status(200).send({ data: 'no req body data' });
    }

    const {
      roomId,
      init,
    } = req.body.data;

  //  log(roomId, `setLastRound: Head`);

  /*  if (init) {
    //  admin.database().ref(`rooms/${roomId}/init`).once('value', (snapshot) => {
    //    const lastInit = snapshot.val() || false;

    //  log(roomId, `setLastRound: init`);

      admin.database().ref(`rooms/${roomId}`).update({
        init: Date.now(),
      });
      //  });

      return res.status(200).send({ data: 'initialized' });
    }  */

    const tokenId = req.get('Authorization').split('Bearer ')[1];

    admin.auth().verifyIdToken(tokenId)
      .then((decoded) => {
        if (!decoded.uid) {
        //  log(roomId, `setLastRound: no auth token`);
          return res.status(200).send({ data: 'no auth token' });
        }

        const promise1 = admin.database(roomsDb).ref(`rooms/${roomId}/globalParams/lastRound`).once('value');
        const promise2 = admin.database(roomsDb).ref(`rooms/${roomId}/globalParams/party`).once('value');
        const promise3 = admin.database().ref(`users/${decoded.uid}/name`).once('value');

        Promise.all([promise1, promise2, promise3]).then((promiseRes) => {
          let lastRound = false;
          let party = null;
          let name = '';
          promiseRes.map((res2) => {
            if (res2) {
              if (res2.key === 'lastRound') {
                lastRound = res2.val() || false;
              } else if (res2.key === 'party') {
                party = res2.val();
              } else if (res2.key === 'name') {
                name = res2.val() || '';
              }
            }
            return null;
          });

          //  admin.database().ref(`rooms/${roomId}/globalParams/lastRound`).once('value', (snapshot) => {
          //    const lastRound = snapshot.val() || false;

          if (!lastRound) {
            admin.database().ref(`rooms/${roomId}/globalParams`).update({
              lastRound: true,
              lastRoundPlayer: decoded.uid,
            });

            admin.database(roomsDb).ref(`rooms/${roomId}/globalParams`).update({
              lastRound: true,
              lastRoundPlayer: decoded.uid,
            });

            //  admin.database().ref(`rooms/${roomId}/globalParams/party`).once('value', (partySnapshot) => {
            //    const party = partySnapshot.val() || {};

            admin.database(adminLogsDb).ref(`adminLogs/rooms/${roomId}/${party}`).push({
              time: Date.now(),
              roomId,
              type: 'setLast',
              data: {
                playerUid: decoded.uid,
              },
            });

            if (roomId) {
              admin.database().ref(`chat/${roomId}/messages`).push({
                roomId,
                message: `${name} spēlē pēdējo partiju`,
                userUid: 'game',
                time: Date.now(),
              });
            }
            //    });

          //  log(roomId, `setLastRound: success`);
            return res.status(200).send({ data: { status: 'success' } });
          }

        //  log(roomId, `setLastRound: already set to last round`);
          return res.status(200).send({ data: { status: 'error', error: 'already set to last round' } });
        });
      })
      .catch((err) => {
      //  log(roomId, `setLastRound: error: ${error}`);
        return res.status(200).send({ data: { status: 'error', error: err } });
      });
  });
};

module.exports = setLastRound;
