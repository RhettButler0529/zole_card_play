
const leaveRoomMenu = (req, res) => {
  const cors = require('cors')({ origin: true });
  const { admin, adminLogsDb, roomsPublicDb, roomsDb } = require('../admin');
  const log = require('../logs/log');
  const roomState = require('./roomState');

  cors(req, res, () => {
    if (!req.body || !req.body.data) {
      return res.status(200).send({ data: 'no req body data' });
    }

    const {
      roomId,
    } = req.body.data;

    roomState.isIdle(roomId).then(() => {
      const processRequest = () => new Promise((resolve, reject) => {
        const tokenId = req.get('Authorization').split('Bearer ')[1];

        admin.auth().verifyIdToken(tokenId)
          .then((decoded) => {
            if (!decoded.uid) {
              return reject({ data: 'Error leaving room (no auth token)' });
            }

            return admin.database(roomsDb).ref(`rooms/${roomId}/players`).once('value', (snapshot) => {
              const players = snapshot.val() || {};

              if ((players.player1 && players.player1.uid) && (players.player2 && players.player2.uid) && (players.player3 && players.player3.uid)) {
                // All players ready, can't leave atm
                return reject({ data: { status: 'aborted leaving room' } });
              }

              if ((players.player1 && players.player1.uid && players.player1.uid.toString() === decoded.uid.toString())
                || (players.player2 && players.player2.uid && players.player2.uid.toString() === decoded.uid.toString())
                || (players.player3 && players.player3.uid && players.player3.uid.toString() === decoded.uid.toString())) {
                admin.database(roomsDb).ref(`rooms/${roomId}/globalParams`).once('value', (globalParamsSnapshot) => {
                  const globalParams = globalParamsSnapshot.val() || {};

                  const {
                    tournamentRoom, tournamentId, roomClosed,
                  } = globalParams;

                  if ((players.player1 && (!players.player2 || (players.player2 && !players.player2.uid)) && (!players.player3 || (players.player3 && !players.player3.uid)))
                    || ((!players.player1 || (players.player1 && !players.player1.uid)) && players.player2 && (!players.player3 || (players.player3 && !players.player3.uid)))
                    || ((!players.player1 || (players.player1 && !players.player1.uid)) && (!players.player2 || (players.player2 && !players.player2.uid)) && players.player3)) {
                    if (tournamentRoom) {
                      // Tournament room
                      Object.keys(players).map((key) => {
                        admin.database().ref(`tourPlayers/${tournamentId}/${players[key].uid}`).update({
                          roomId: null,
                        });

                        admin.database().ref(`tourPlayerData/${players[key].uid}/${tournamentId}`).update({
                          roomId: null,
                        });

                        admin.database().ref(`users/${players[key].uid}/joinedRooms/${roomId}`).remove();

                        return null;
                      });
                    }

                    if (!roomClosed) {
                      admin.database().ref(`rooms/${roomId}/globalParams`).update({
                        roomClosed: true,
                      });

                      admin.database(roomsDb).ref(`rooms/${roomId}/globalParams`).update({
                        roomClosed: true,
                      });

                      admin.database().ref(`rooms/${roomId}`).update({
                        roomClosed: true,
                      });

                      admin.database().ref(`activeRooms/${roomId}`).remove();

                      admin.database(adminLogsDb).ref(`adminLogs/roomIds/${roomId}`).remove();

                      admin.database(adminLogsDb).ref(`adminLogs/playerRooms/${decoded.uid}/${roomId}`).remove();

                      if (!tournamentRoom) {
                        admin.database(roomsPublicDb).ref(`roomsPubInf/${roomId}`).remove();
                        admin.database(roomsPublicDb).ref(`roomsPubInfIds/${roomId}`).remove();

                        admin.database().ref('roomsCount')
                          .transaction(roomsCount => (parseInt(roomsCount, 10) || 0) - 1);
                      }
                    }

                    admin.database().ref(`users/${decoded.uid}/joinedRooms/${roomId}`).remove();

                    return resolve({ data: { status: 'success' } });
                  }

                  // Remove player from room after leaving (not started and not last player)
                  if (tournamentRoom) {
                    // Tournament room

                    admin.database().ref(`tourPlayers/${tournamentId}/${decoded.uid}`).update({
                      roomId: null,
                    }).then(() => {
                      Object.keys(players).map((key) => {
                        admin.database().ref(`tourPlayers/${tournamentId}/${players[key].uid}`).update({
                          roomId: null,
                        });

                        admin.database().ref(`tourPlayerData/${players[key].uid}/${tournamentId}`).update({
                          roomId: null,
                        });

                        admin.database().ref(`users/${players[key].uid}/joinedRooms/${roomId}`).remove();

                        return null;
                      });

                      admin.database().ref(`activeRooms/${roomId}`).remove();

                      if (!roomClosed) {
                        admin.database().ref(`rooms/${roomId}/globalParams`).update({
                          roomClosed: true,
                        });

                        admin.database(roomsDb).ref(`rooms/${roomId}/globalParams`).update({
                          roomClosed: true,
                        });

                        admin.database().ref(`rooms/${roomId}`).update({
                          roomClosed: true,
                        });

                        admin.database(roomsPublicDb).ref(`roomsPubInf/${roomId}`).update({
                          roomClosed: true,
                        });
                      }

                      return resolve({ data: { status: 'success' } });
                    })
                      .catch(err => reject({ data: { status: 'error', message: err } }));
                  } else if ((players.player1 && players.player1.uid && decoded.uid === players.player1.uid)
                    || (players.player2 && players.player2.uid && decoded.uid === players.player2.uid)
                    || (players.player3 && players.player3.uid && decoded.uid === players.player3.uid)) {

                    let playerPos;
                    if (players.player1 && decoded.uid === players.player1.uid) {
                      playerPos = 'player1';
                    } else if (players.player2 && decoded.uid === players.player2.uid) {
                      playerPos = 'player2';
                    } else if (players.player3 && decoded.uid === players.player3.uid) {
                      playerPos = 'player3';
                    }

                    if (playerPos) {
                      admin.database(roomsDb).ref(`rooms/${roomId}/players`).transaction((playersTrans) => {
                        if (playersTrans && (!playersTrans[playerPos] || playersTrans[playerPos].uid !== decoded.uid)) {
                          console.log('not player in position');
                          return; // Abort the transaction.
                        }

                        if (playersTrans && (playersTrans.player1 && playersTrans.player2
                          && playersTrans.player3 && playersTrans.player1.uid
                          && playersTrans.player2.uid && playersTrans.player3.uid)) {
                          console.log('room alredy filled');
                          return; // Abort the transaction.
                        }

                        const newPlayers = playersTrans;
                        if (playerPos && playersTrans) {
                          delete newPlayers[playerPos];
                        }

                        return newPlayers;
                      })
                        .then((result) => {
                          if (!result.committed) {
                            return reject({ data: { status: 'aborted removing room' } });
                          }

                          admin.database().ref(`rooms/${roomId}/players`).transaction((playersTrans) => {
                            if (playersTrans && (!playersTrans[playerPos] || playersTrans[playerPos].uid !== decoded.uid)) {
                              return; // Abort the transaction.
                            }

                            if (playersTrans && (playersTrans.player1 && playersTrans.player2
                              && playersTrans.player3 && playersTrans.player1.uid
                              && playersTrans.player2.uid && playersTrans.player3.uid)) {
                              return; // Abort the transaction.
                            }

                            const newPlayers = playersTrans;
                            if (playerPos && playersTrans) {
                              delete newPlayers[playerPos];
                            }

                            return newPlayers;
                          });

                          const players2 = result.snapshot.val() || {};

                          admin.database().ref(`users/${decoded.uid}/joinedRooms/${roomId}`).remove();
                          admin.database().ref(`rooms/${roomId}/playersList/${playerPos}`).remove();
                          admin.database().ref(`rooms/${roomId}/playersList/playerList/${decoded.uid}`).remove();
                          admin.database(roomsDb).ref(`rooms/${roomId}/playersList/${playerPos}`).remove();
                          admin.database(roomsDb).ref(`rooms/${roomId}/playersList/playerList/${decoded.uid}`).remove();
                          admin.database(roomsPublicDb).ref(`roomsPubInf/${roomId}/playersList/${playerPos}`).remove();
                          admin.database(adminLogsDb).ref(`adminLogs/playerRooms/${decoded.uid}/${roomId}`).remove();

                          admin.database(roomsDb).ref(`rooms/${roomId}/globalParams/party`).once('value', (partySnapshot) => {
                            const party2 = partySnapshot.val() || {};

                            admin.database(adminLogsDb).ref(`adminLogs/rooms/${roomId}/${party2}`).push({
                              time: Date.now(),
                              roomId,
                              type: 'playerLeft',
                              data: {
                                playerUid: decoded.uid,
                              },
                            });
                          });

                          return resolve({ data: { status: 'success' } });
                        });
                    } else {
                      return reject({ data: { status: 'aborted removing room' } });
                    }
                  } else {
                    return reject({ data: { status: 'aborted removing room' } });
                  }
                });
              } else {
                return reject({ data: { status: 'error', message: 'notInRoom' } });
              }
            }).catch(err => reject({ data: { status: 'error', message: err } }));
          }).catch(err => reject({ data: { status: 'error', message: err } }));
      //  return reject({ data: { status: 'unknown', message: 'nothing else happened' } });
      });

      processRequest().then((r) => {
        roomState.markIdle(roomId).then(() => res.status(200).send(r)).catch(err => res.status(200).send(err));
      }).catch((err) => {
        roomState.markIdle(roomId).then(() => res.status(200).send(err)).catch(err2 => res.status(200).send(err2));
      });
    }).catch((err) => {
      roomState.markIdle(roomId);
      res.status(200).send({ data: { status: 'error', error: err } });
    });
  });
};

module.exports = leaveRoomMenu;
