const { admin, adminLogsDb, roomsDb } = require('../admin');
const calculateResults = require('./calculateResults');

// Check if game is over
const checkIfGameOver = (roomId, date) => new Promise((resolve, reject) => {

  const promise1 = admin.database(roomsDb).ref(`rooms/${roomId}/players/player1/cards`).once('value');
  const promise2 = admin.database(roomsDb).ref(`rooms/${roomId}/curRnd/type`).once('value');
  const promise3 = admin.database(roomsDb).ref(`rooms/${roomId}/curRnd/largePlayer`).once('value');
  const promise4 = admin.database(roomsDb).ref(`rooms/${roomId}/beatCardPoints/tricks`).once('value');

  Promise.all([promise1, promise2, promise3, promise4])
    .then((promiseRes2) => {
      let cards;
      let type;
      let largePlayer;
      let tricks;
      promiseRes2.map((res2) => {
        if (res2.key === 'cards') {
          cards = res2.val() || [];
        } else if (res2.key === 'type') {
          type = res2.val() || null;
        } else if (res2.key === 'largePlayer') {
          largePlayer = res2.val();
        } else if (res2.key === 'tricks') {
          tricks = res2.val() || {};
        }
        return null;
      });

      if (
        !cards
          || (cards && cards.length === 0)
          || (type === 'maza' && tricks[largePlayer] > 0)
      ) {
        admin.database(roomsDb).ref(`rooms/${roomId}/globalParams/party`).once('value', (partySnapshot) => {
            const party = partySnapshot.val() || 0;

            admin
              .database(adminLogsDb)
              .ref(`adminLogs/rooms/${roomId}/${party}`)
              .push({
                time: Date.now(),
                roomId,
                type: 'roundOver',
              });

            return calculateResults(roomId).then((resp) => {
              if (resp === 'success' || resp === 'already calculated') {
                return resolve('success');
              }
              console.log('error calculate results');
              console.log(resp);
              return reject('error calculate results');
            });
          });
      } else {
        return resolve('not game over');
      }
    })
    .catch((err) => reject(err));
});

module.exports = checkIfGameOver;
