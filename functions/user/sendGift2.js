const sendGift2 = (req, res) => {
  const cors = require('cors')({ origin: true });
  const { admin, userStatsDB, roomsDb } = require('../admin');
  cors(req, res, () => {
    const {
      giftId,
      players,
      comment,
      roomId,
    } = req.body.data;

    const tokenId = req.get('Authorization').split('Bearer ')[1];

    admin.auth().verifyIdToken(tokenId)
      .then((decoded) => {
        if (!decoded.uid) {
          return res.status(200).send({ data: 'no auth token' });
        }

        if (players && giftId && roomId) {
          admin.database(roomsDb).ref(`rooms/${roomId}/playersList/playerList`)
            .once('value', (playersListSnapshot) => {
              const playersList = playersListSnapshot.val() || {};

              if (playersList && playersList[decoded.uid]) {
                const promise1 = admin.database().ref(`users/${decoded.uid}/name`).once('value');
                const promise2 = admin.database().ref(`users/${decoded.uid}/bal`).once('value');

                Promise.all([promise1, promise2]).then((promiseRes) => {
                  let fromName = '';
                  let fromBal = 0;
                  promiseRes.map((res2) => {
                    if (res2) {
                      const { key } = res2;
                      if (key === 'name') {
                        fromName = res2.val();
                      } else if (key === 'bal') {
                        fromBal = res2.val();
                      }
                    }
                    return null;
                  });

                  admin.database().ref(`gifts2/${giftId}`)
                    .once('value', (giftSnapshot) => {
                      const gift = giftSnapshot.val() || {};
                      let totalSum = 0;

                      players.map((user) => {
                        if (playersList[user]) {
                          totalSum += parseInt(gift.price, 10);
                        }
                        return null;
                      });

                      if (fromBal > totalSum) {
                        players.map((user) => {
                          if (playersList[user]) {
                            const striped = comment.replace(/[^A-Za-z0-9\s!?\u0020-\u0080\u0400-\u04FF\u0080-\u024F]/g, '');
                            const trimmed = striped.substring(0, 500);

                            admin.database().ref(`rooms/${roomId}/gifts/${user}`).update({
                              giftId,
                              from: decoded.uid,
                              fromName,
                              comment: trimmed,
                              date: admin.database.ServerValue.TIMESTAMP,
                            });

                            admin.database(roomsDb).ref(`rooms/${roomId}/gifts/${user}`).update({
                              giftId,
                              from: decoded.uid,
                              fromName,
                              comment: trimmed,
                              date: admin.database.ServerValue.TIMESTAMP,
                            });

                            admin.database().ref(`userAchievements/${decoded.uid}/giftsSent`).transaction(score => (score || 0) + 1);
                            admin.database().ref(`userAchievements/${user}/giftsReceived`).transaction(score => (score || 0) + 1);

                            admin.database().ref(`users/${decoded.uid}/bal`)
                              .transaction(bal => (bal - parseInt(gift.price, 10)));
                          }
                          return null;
                        });

                        admin.database().ref(`userBalHistory/${decoded.uid}`).push({
                          time: Date.now(),
                          type: 'giftsSent',
                          change: -totalSum,
                          old: fromBal,
                          new: parseInt(fromBal, 10) - parseInt(totalSum, 10),
                        });

                        admin.database(userStatsDB).ref(`userBalHistory/${decoded.uid}`).push({
                          time: Date.now(),
                          type: 'giftsSent',
                          change: -totalSum,
                          old: fromBal,
                          new: parseInt(fromBal, 10) - parseInt(totalSum, 10),
                        });

                        return res.status(200).send({ data: { status: 'success' } });
                      }
                      return res.status(200).send({ data: { status: 'error', message: 'low balance' } });
                    })
                    .catch(err => res.status(200).send({ data: { status: 'error', message: err } }));
                });
              } else {
                return res.status(200).send({ data: { status: 'error', message: 'not in room' } });
              }
            });
        } else {
          return res.status(200).send({ data: { status: 'error', message: 'missing data' } });
        }
      })
      .catch(err => res.status(200).send({ data: { status: 'error', message: err } }));
  });
};

module.exports = sendGift2;
