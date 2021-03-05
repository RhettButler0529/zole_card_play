
const buyTournamentMoney = (req, res) => {
  const cors = require('cors')({ origin: true });
  const { admin } = require('../admin');

  cors(req, res, () => {
    const {
      roomId,
      init,
    } = req.body.data;

    //  console.log('buyTournamentMoney');
    //  console.log(roomId);

    const tokenId = req.get('Authorization').split('Bearer ')[1];

    admin.auth().verifyIdToken(tokenId)
      .then((decoded) => {
        if (!decoded.uid) {
          return res.status(200).send({ data: 'Error buying money (no auth token)' });
        }

        if (init) {
          admin.database().ref(`rooms/${roomId}/init`).once('value', (snapshot) => {
            const lastInit = snapshot.val() || false;

            admin.database().ref(`rooms/${roomId}`).update({
              init: !lastInit,
            });
          });

          return res.status(200).send({ data: 'initialized' });
        }

        admin.database().ref(`rooms/${roomId}`).once('value', (roomSnapshot) => {
          const roomData = roomSnapshot.val() || {};

          const { tournamentId, playersList, globalParams } = roomData;
          const { lowBalPlayers, bet } = globalParams;

          const playerPos = playersList.playerList[decoded.uid];

          if (tournamentId && playerPos && lowBalPlayers && lowBalPlayers[playerPos]) {
            admin.database().ref(`users/${decoded.uid}/bal`).once('value', (userSnapshot) => {
              const userBal = userSnapshot.val() || {};

              if (userBal >= 100) {
                let betValue;
                if (bet === '1:1') {
                  betValue = 20;
                } else if (bet === '1:5') {
                  betValue = 100;
                } else if (bet === '1:10') {
                  betValue = 200;
                } else if (bet === '1:25') {
                  betValue = 500;
                } else if (bet === '1:50') {
                  betValue = 1000;
                } else if (bet === '1:100') {
                  betValue = 2000;
                } else if (bet === '1:500') {
                  betValue = 10000;
                } else if (bet === '1:1000') {
                  betValue = 20000;
                } else if (bet === '1:5000') {
                  betValue = 100000;
                } else if (bet === '1:10000') {
                  betValue = 200000;
                }

                admin.database().ref(`users/${decoded.uid}/bal`)
                  .transaction(bal => (bal - 100));

                admin.database().ref(`userBalHistory/${decoded.uid}`).push({
                  time: Date.now(),
                  type: 'buyTournamentMoney',
                  change: -100,
                  old: userBal,
                  new: userBal - 100,
                });

                admin.database().ref(`tourPlayers/${decoded.uid}/${tournamentId}/bal`)
                  .transaction(bal2 => (bal2 + 300));

                admin.database().ref(`rooms/${roomId}/players/${playerPos}/bal`)
                  .transaction(bal3 => (bal3 + 300));

                admin.database().ref(`rooms/${roomId}/playersList/${playerPos}/bal`)
                  .transaction(bal4 => (bal4 + 300));

                admin.database().ref(`tournaments/${tournamentId}/totalBank`)
                  .transaction(totalBank => (totalBank + 300));

                admin.database().ref(`rooms/${roomId}/globalParams/lowBalPlayers/${playerPos}`).remove().then(() => {
                  admin.database().ref(`rooms/${roomId}/globalParams/lowBalPlayers`).once('value', (lowBalSnapshot) => {
                    const lowBalPl = lowBalSnapshot.val() || null;

                    if (!lowBalPl) {
                      admin.database().ref(`rooms/${roomId}/globalParams`).update({
                        gameState: 'choose',
                      });

                      //  admin.database().ref(`rooms/${roomId}`).update({
                      //    nextTimestamp: Date.now() + 1000 * 30,
                      //  });

                      admin.database().ref(`gameSettings/${globalParams.fastGame ? 'fastSpeed' : 'normalSpeed'}`)
                        .once('value').then((speedSnapshot) => {
                          const speed = speedSnapshot.val() || 15;

                          admin.database().ref(`rooms/${roomId}`).update({
                            nextTimestamp: (Date.now() + 1000 * speed) + 500,
                          });
                        });

                      return res.status(200).send({ data: { status: 'success' } });
                    }
                    return res.status(200).send({ data: { status: 'success' } });
                  }).catch(err => res.status(200).send({ data: { status: 'error', error: err } }));
                })
                  .catch(err => res.status(200).send({ data: { status: 'error', error: err } }));
              } else {
                return res.status(200).send({ data: { status: 'error', error: 'insufficient bal' } });
              }
            })
              .catch(err => res.status(200).send({ data: { status: 'error', error: err } }));
          } else {
            return res.status(200).send({ data: { status: 'error', error: 'wrong data' } });
          }
        })
          .catch((err) => {
            res.status(200).send({ data: { status: 'error', error: err } });
          });
      });
  });
};

module.exports = buyTournamentMoney;
