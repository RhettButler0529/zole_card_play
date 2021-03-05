const { admin, userStatsDB, roomsDb } = require('../admin');

const setPulesOnClose = ({ roomId }) => {
  if (roomId) {
    const promise1 = admin.database(roomsDb).ref(`rooms/${roomId}/globalParams/tournamentId`).once('value');
    const promise2 = admin.database(roomsDb).ref(`rooms/${roomId}/globalParams/tournamentRoom`).once('value');
    const promise3 = admin.database(roomsDb).ref(`rooms/${roomId}/globalParams/bet`).once('value');
    const promise4 = admin.database(roomsDb).ref(`rooms/${roomId}/globalParams/party`).once('value');
    const promise5 = admin.database(roomsDb).ref(`rooms/${roomId}/points/pules/private`).once('value');
    const promise6 = admin.database(roomsDb).ref(`rooms/${roomId}/players/player1/uid`).once('value');
    const promise7 = admin.database(roomsDb).ref(`rooms/${roomId}/players/player2/uid`).once('value');
    const promise8 = admin.database(roomsDb).ref(`rooms/${roomId}/players/player3/uid`).once('value');


    Promise.all([promise1, promise2, promise3, promise4, promise5, promise6, promise7, promise8])
      .then((promiseRes) => {
        let tournamentId = '';
        let tournamentRoom = false;
        let bet = '';
        let party = null;
        let pules = {};
        let player1Uid = '';
        let player2Uid = '';
        let player3Uid = '';
        promiseRes.map((res) => {
          if (res) {
            if (res.key === 'tournamentId') {
              tournamentId = res.val() || null;
            } else if (res.key === 'tournamentRoom') {
              tournamentRoom = res.val() || false;
            } else if (res.key === 'bet') {
              bet = res.val() || null;
            } else if (res.key === 'party') {
              party = res.val() || null;
            } else if (res.key === 'private') {
              pules = res.val() || {};
            } else if (res.key === 'uid') {
              const parentKey = res.ref.parent.key;
              if (parentKey === 'player1') {
                player1Uid = res.val() || null;
              }
              if (parentKey === 'player2') {
                player2Uid = res.val() || null;
              }
              if (parentKey === 'player3') {
                player3Uid = res.val() || null;
              }
            }
          }
          return null;
        });

        if (roomId && player1Uid && player2Uid && player3Uid) {
          if (pules && Object.keys(pules).length > 0) {
            let betValue;
            if (bet === '1:1') {
              betValue = 1;
            } else if (bet === '1:5') {
              betValue = 5;
            } else if (bet === '1:10') {
              betValue = 10;
            } else if (bet === '1:25') {
              betValue = 25;
            } else if (bet === '1:50') {
              betValue = 50;
            } else if (bet === '1:100') {
              betValue = 100;
            } else if (bet === '1:500') {
              betValue = 500;
            } else if (bet === '1:1000') {
              betValue = 1000;
            } else if (bet === '1:5000') {
              betValue = 5000;
            } else if (bet === '1:10000') {
              betValue = 10000;
            }

            let points = {
              player1: 0,
              player2: 0,
              player3: 0,
            };

            Object.keys(pules).map((key) => {
              const { player } = pules[key];

              if (player === 'player1') {
                points = {
                  player1: points.player1 - 2,
                  player2: points.player2 + 1,
                  player3: points.player3 + 1,
                };
              }
              if (player === 'player2') {
                points = {
                  player1: points.player1 + 1,
                  player2: points.player2 - 2,
                  player3: points.player3 + 1,
                };
              }
              if (player === 'player3') {
                points = {
                  player1: points.player1 + 1,
                  player2: points.player2 + 1,
                  player3: points.player3 - 2,
                };
              }
              return null;
            });

            Object.keys(points).map((key) => {
              let uid;
              if (key === 'player1') {
                uid = player1Uid;
              }
              if (key === 'player2') {
                uid = player2Uid;
              }
              if (key === 'player3') {
                uid = player3Uid;
              }

              if (tournamentRoom) {
                admin.database().ref(`tourPlayers/${tournamentId}/${uid}/bal`)
                  .transaction(bal => (parseInt(bal, 10) || 0) + (points[key] * betValue));

                admin.database().ref(`tourPlayers/${tournamentId}/${uid}/totalPnts`)
                  .transaction(pnts => (parseInt(pnts, 10) || 0) + points[key])
                  .then(() => {
                    admin.database().ref(`tourPlayerData/${uid}/${tournamentId}/bal`)
                      .transaction(bal => (parseInt(bal, 10) || 0) + (points[key] * betValue));

                    admin.database().ref(`tourPlayerData/${uid}/${tournamentId}/totalPnts`)
                      .transaction(pnts => (parseInt(pnts, 10) || 0) + points[key]);

                    admin.database().ref(`tourHistory/${uid}/${tournamentId}/bal`)
                      .transaction(bal => (parseInt(bal, 10) || 0) + (points[key] * betValue));

                    admin.database().ref(`tourHistory/${uid}/${tournamentId}/totalPnts`)
                      .transaction(pnts => (parseInt(pnts, 10) || 0) + points[key]);
                  });
              } else {
                  const promise10 = admin.database().ref(`users/${uid}/totalPnts`).once('value');
                  const promise11 = admin.database().ref(`users/${uid}/bal`).once('value');

                  Promise.all([promise10, promise11])
                    .then((promiseRes2) => {
                      let userTotalPnts;
                      let balance;

                      promiseRes2.map((res2) => {
                        if (res2) {
                          if (res2.key === 'totalPnts') {
                            userTotalPnts = res2.val() || 0;
                          } else if (res.key === 'bal') {
                            balance = res2.val() || 0;
                          }
                        }
                        return null;
                      });

              //  admin.database().ref(`users/${uid}/bal`).once('value', (snapshot) => {
              //    const balance = snapshot.val() || 0;

                  admin.database().ref(`users/${uid}/totalPnts`)
                    .transaction(pnts => (parseInt(pnts, 10) || 0) + points[key]);

                  admin.database().ref(`users/${uid}/bal`)
                    .transaction(bal => (parseInt(bal, 10) || 0) + (points[key] * betValue));

                  if (balance) {
                    admin.database().ref(`userBalHistory/${uid}`).push({
                      time: Date.now(),
                      type: 'endRoomPules',
                      roomId,
                      change: points[key] * betValue,
                      old: parseInt(balance, 10),
                      new: (parseInt(balance, 10) || 0) + (points[key] * betValue),
                    });

                    admin.database(userStatsDB).ref(`userBalHistory/${uid}`).push({
                      time: Date.now(),
                      type: 'endRoomPules',
                      roomId,
                      change: points[key] * betValue,
                      old: parseInt(balance, 10),
                      new: (parseInt(balance, 10) || 0) + (points[key] * betValue),
                    });

                    admin.database(userStatsDB).ref(`userPointsHistory/${uid}`).push({
                      time: Date.now(),
                      type: 'game',
                      roomId,
                      change: points[key],
                      old: parseInt(userTotalPnts, 10),
                      new: (parseInt(userTotalPnts, 10) || 0) + points[key],
                    });
                  }
                });
              }

              return null;
            });

            admin.database().ref(`adminLogs/rooms/${roomId}/${party}`).push({
              time: Date.now(),
              roomId,
              type: 'endRoomPules',
              data: {
                player1: { uid: player1Uid, points: points.player1 },
                player2: { uid: player2Uid, points: points.player2 },
                player3: { uid: player3Uid, points: points.player3 },
              },
            });
          }
        }

        return null;
      });
  }
};

module.exports = setPulesOnClose;
