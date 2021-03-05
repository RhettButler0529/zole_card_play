
const endRoom = (req, res) => {
  const cors = require('cors')({ origin: true });
  const { admin, leaderboardDb, adminLogsDb } = require('../admin');
  const setPulesOnClose = require('../game/setPulesOnClose');
  const log = require('../logs/log');

  cors(req, res, () => {
    const {
      roomId,
    } = req.body.data;

    log(roomId, 'endRoom: Head');

    if (req.get('Authorization')) {
      const tokenId = req.get('Authorization').split('Bearer ')[1];

      admin.auth().verifyIdToken(tokenId)
        .then((decoded) => {
          if (!decoded.uid) {
            log(roomId, 'endRoom: Error creating room (no auth token)');
            return res.status(200).send({ data: 'Error creating room (no auth token)' });
          }

          const promise1 = admin.database().ref(`rooms/${roomId}/nextTimestamp`).once('value');
          const promise2 = admin.database().ref(`rooms/${roomId}/playersList`).once('value');
          const promise3 = admin.database().ref(`rooms/${roomId}/globalParams`).once('value');
          const promise4 = admin.database().ref(`rooms/${roomId}/curRnd/cardPlayed`).once('value');

          Promise.all([promise1, promise2, promise3, promise4]).then((promisesRes) => {
            let nextTimestamp;
            let players;
            let globalParams;
            let cardPlayed;

            promisesRes.map((promiseRes, index) => {
              if (index === 0) {
                nextTimestamp = promiseRes.val() || 0;
              } else if (index === 1) {
                players = promiseRes.val() || {};
              } else if (index === 2) {
                globalParams = promiseRes.val() || {};
              } else if (index === 3) {
                cardPlayed = promiseRes.val() || null;
              }
              return null;
            });

            //  log(roomId, `endRoom: nextTimestamp: ${nextTimestamp}, cardPlayed: ${cardPlayed}`);

            if (Date.now() > nextTimestamp + 1000 && !cardPlayed && !globalParams.disableTimer) {
              if ((players.player1 && players.player1.uid && players.player1.uid.toString() === decoded.uid.toString())
              || (players.player2 && players.player2.uid && players.player2.uid.toString() === decoded.uid.toString())
              || (players.player3 && players.player3.uid && players.player3.uid.toString() === decoded.uid.toString())) {
                const {
                  talking, tournamentRoom, tournamentId, roomClosed, gameState, bet, party,
                } = globalParams;


                if (players.player1 && players.player2 && players.player3
                    && players.player1.uid && players.player2.uid && players.player3.uid) {
                  if (!roomClosed) {
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

                    if (gameState === 'play' || gameState === 'burry') {
                      log(roomId, "endRoom: gameState === 'play' || gameState === 'burry'");

                      admin.database().ref(`rooms/${roomId}/curRnd/currentTurn`).once('value', (currentRoundSnapshot) => {
                        const currentTurn = currentRoundSnapshot.val() || null;

                      //  const { currentTurn } = currentRound;

                        const largePoints = -10;
                        //  if (type === 'parasta') {
                        //    largePoints = -10;
                        //  } else if (type === 'zole') {
                        //    largePoints = -16;
                        //  } else if (type === 'maza') {
                        //    largePoints = -14;
                        //  } else {
                        //    largePoints = -4;
                        //  }

                        if (tournamentRoom) {
                          Object.keys(players).map((key) => {
                            if (key !== 'playerList') {
                              admin.database().ref(`tourPlayers/${tournamentId}/${players[key].uid}`).once('value', (playerSnapshot) => {
                                const playerData = playerSnapshot.val() || [];

                                if (currentTurn === key) {
                                  admin.database().ref(`tourPlayers/${tournamentId}/${players[key].uid}`).update({
                                    bal: parseInt(playerData.bal, 10) + (largePoints * betValue),
                                    totalPnts: parseInt(playerData.totalPnts, 10) + largePoints,
                                    roomId: null,
                                  });

                                  admin.database().ref(`tourPlayerData/${players[key].uid}/${tournamentId}`).update({
                                    bal: parseInt(playerData.bal, 10) + (largePoints * betValue),
                                    totalPnts: parseInt(playerData.totalPnts, 10) + largePoints,
                                    roomId: null,
                                  });

                                  admin.database().ref(`tourHistory/${players[key].uid}/${tournamentId}`).update({
                                    bal: parseInt(playerData.bal, 10) + (largePoints * betValue),
                                    totalPnts: parseInt(playerData.totalPnts, 10) + largePoints,
                                  });
                                } else {
                                  admin.database().ref(`tourPlayers/${tournamentId}/${players[key].uid}`).update({
                                    bal: parseInt(playerData.bal, 10) + (1 * betValue),
                                    totalPnts: parseInt(playerData.totalPnts, 10) + 1,
                                    roomId: null,
                                  });

                                  admin.database().ref(`tourPlayerData/${players[key].uid}/${tournamentId}`).update({
                                    bal: parseInt(playerData.bal, 10) + (1 * betValue),
                                    totalPnts: parseInt(playerData.totalPnts, 10) + 1,
                                    roomId: null,
                                  });

                                  admin.database().ref(`tourHistory/${players[key].uid}/${tournamentId}`).update({
                                    bal: parseInt(playerData.bal, 10) + (1 * betValue),
                                    totalPnts: parseInt(playerData.totalPnts, 10) + 1,
                                  });
                                }

                                admin.database().ref(`users/${players[key].uid}/joinedRooms/${roomId}`).remove();
                              });
                            }

                            return null;
                          });

                          setPulesOnClose({ roomId });

                          let playerName = '';
                          let playerUid = '';
                          if (currentTurn === 'player1') {
                            playerName = players.player1.name || '';
                            playerUid = players.player1.uid || '';
                          } else if (currentTurn === 'player2') {
                            playerName = players.player2.name || '';
                            playerUid = players.player2.uid || '';
                          } else if (currentTurn === 'player3') {
                            playerName = players.player3.name || '';
                            playerUid = players.player3.uid || '';
                          }

                          admin.database().ref(`rooms/${roomId}/globalParams`).update({
                            //  roomClosed: true,
                            closeReason: { reason: 'missedTurn', playerName, playerUid },
                          });

                          const promise5 = admin.database().ref(`userAchievements/${players.player1.uid}/maxParties`).once('value');
                          const promise6 = admin.database().ref(`userAchievements/${players.player2.uid}/maxParties`).once('value');
                          const promise7 = admin.database().ref(`userAchievements/${players.player3.uid}/maxParties`).once('value');

                          Promise.all([promise5, promise6, promise7])
                            .then((promiseRes2) => {
                              let player1MaxParties;
                              let player2MaxParties;
                              let player3MaxParties;
                              promiseRes2.map((res2, index) => {
                                if (index === 0) {
                                  player1MaxParties = res2.val();
                                } else if (index === 1) {
                                  player2MaxParties = res2.val();
                                } else if (index === 2) {
                                  player3MaxParties = res2.val();
                                }
                                return null;
                              });

                              const updates = {};

                              if (party > player1MaxParties) {
                                updates[`${players.player1.uid}/maxParties`] = party;
                              }
                              if (party > player2MaxParties) {
                                updates[`${players.player2.uid}/maxParties`] = party;
                              }
                              if (party > player3MaxParties) {
                                updates[`${players.player3.uid}/maxParties`] = party;
                              }

                              admin.database().ref('userAchievements').update(updates);
                            });

                          admin.database().ref(`adminLogs/rooms/${roomId}/${party}`).push({
                            time: Date.now(),
                            roomId,
                            type: 'roomClosed',
                            data: {
                              type: 'missedTurn',
                              player: playerName,
                              playerUid,
                            },
                          });

                          admin.database(adminLogsDb).ref(`adminLogs/rooms/${roomId}/${party}`).push({
                            time: Date.now(),
                            roomId,
                            type: 'roomClosed',
                            data: {
                              type: 'missedTurn',
                              player: playerName,
                              playerUid,
                            },
                          });


                          log(roomId, 'endRoom: success #1');

                          return res.status(200).send({ data: { status: 'success' } });
                        }

                        log(roomId, 'endRoom: before regular room');

                        admin.database().ref(`rooms/${roomId}/globalParams/roomClosed`).transaction((roomClosed2) => {
                          if (roomClosed2 === true) {
                            log(roomId, 'endRoom: room alredy closed, ABORT');
                            return; // Abort the transaction.
                          }

                          return true;
                        })
                          .then((result) => {
                            if (!result.committed) {
                              log(roomId, 'endRoom: alredy closed');
                              return res.status(200).send({ data: { status: 'alredy closed' } });
                            }
                            if (result.snapshot.val() === null) {
                              log(roomId, 'endRoom: alredy closed #2');
                              return res.status(200).send({ data: { status: 'alredy closed' } });
                            }

                            let playerName = '';
                            let playerUid = '';
                            if (currentTurn === 'player1') {
                              playerName = players.player1.name || '';
                              playerUid = players.player1.uid || '';
                            } else if (currentTurn === 'player2') {
                              playerName = players.player2.name || '';
                              playerUid = players.player2.uid || '';
                            } else if (currentTurn === 'player3') {
                              playerName = players.player3.name || '';
                              playerUid = players.player3.uid || '';
                            }

                            admin.database().ref(`rooms/${roomId}/globalParams`).update({
                              closeReason: { reason: 'missedTurn', playerName, playerUid },
                            });

                            admin.database().ref(`rooms/${roomId}`).update({
                              roomClosed: true,
                            });

                            admin.database().ref(`roomsPubInf/${roomId}`).update({
                              roomClosed: true,
                            });

                          //  admin.database().ref('roomsCount')
                          //    .transaction(roomsCount => (parseInt(roomsCount, 10) || 0) - 1);

                            admin.database().ref(`rooms/${roomId}/globalParams`).update({
                              roomClosed: true,
                            });

                            admin.database().ref(`activeRooms/${roomId}`).remove();

                            Object.keys(players).map((key) => {
                              if (key !== 'playerList') {
                                admin.database().ref(`users/${players[key].uid}`).once('value', (playerSnapshot) => {
                                  const playerData = playerSnapshot.val() || {};

                                  if (currentTurn === key) {
                                    admin.database().ref(`users/${players[key].uid}/bal`)
                                      .transaction(bal => (bal || 0) + (largePoints * betValue));

                                    admin.database().ref(`users/${players[key].uid}/joinedRooms/${roomId}`).remove();

                                    admin.database().ref(`users/${players[key].uid}`).update({
                                      gPlayed: parseInt(playerData.gPlayed, 10) + 1,
                                      totalPnts: parseInt(playerData.totalPnts, 10) + largePoints,
                                    });

                                    admin.database().ref(`userBalHistory/${players[key].uid}`).push({
                                      time: Date.now(),
                                      type: 'missTurnMe',
                                      roomId,
                                      change: largePoints * betValue,
                                      old: playerData.bal,
                                      new: parseInt(playerData.bal, 10) + (largePoints * betValue),
                                    });

                                    admin.database(leaderboardDb).ref(`leaderboard/allTime/${players[key].uid}`).update({
                                      gPlayed: parseInt(playerData.gPlayed, 10) + 1,
                                    });

                                    admin.database(leaderboardDb).ref(`leaderboard/daily/${players[key].uid}/gPlayed`)
                                      .transaction(gPlayed => (gPlayed || 0) + 1);

                                    admin.database(leaderboardDb).ref(`leaderboard/week/${players[key].uid}/gPlayed`)
                                      .transaction(gPlayed => (gPlayed || 0) + 1);

                                    admin.database(leaderboardDb).ref(`leaderboard/month/${players[key].uid}/gPlayed`)
                                      .transaction(gPlayed => (gPlayed || 0) + 1);

                                    admin.database(leaderboardDb).ref(`leaderboard/year/${players[key].uid}/gPlayed`)
                                      .transaction(gPlayed => (gPlayed || 0) + 1);

                                    if (playerData && playerData.joinedRooms) {
                                      Object.keys(playerData.joinedRooms).map((key3) => {
                                        const {
                                          position, tourRoom,
                                        } = playerData.joinedRooms[key3];

                                        if (key3 !== roomId) {
                                          if (!tourRoom) {
                                            admin.database().ref(`rooms/${key3}/players/${position}`).update({
                                              gPlayed: parseInt(playerData.gPlayed, 10) + 1,
                                              totalPnts: parseInt(playerData.totalPnts, 10) + largePoints,
                                            });

                                            admin.database().ref(`rooms/${key3}/playersList/${position}`).update({
                                              gPlayed: parseInt(playerData.gPlayed, 10) + 1,
                                              totalPnts: parseInt(playerData.totalPnts, 10) + largePoints,
                                            });
                                          }
                                        }
                                        return null;
                                      });
                                    }
                                  } else {
                                    admin.database().ref(`users/${players[key].uid}/bal`)
                                      .transaction(bal => (bal || 0) + (1 * betValue));

                                    admin.database().ref(`users/${players[key].uid}`).update({
                                      gPlayed: parseInt(playerData.gPlayed, 10) + 1,
                                      totalPnts: parseInt(playerData.totalPnts, 10) + 1,
                                    });

                                    admin.database().ref(`userBalHistory/${players[key].uid}`).push({
                                      time: Date.now(),
                                      type: 'missTurnOther',
                                      roomId,
                                      change: betValue,
                                      old: playerData.bal,
                                      new: parseInt(playerData.bal, 10) + betValue,
                                    });

                                    admin.database(leaderboardDb).ref(`leaderboard/allTime/${players[key].uid}`).update({
                                      gPlayed: parseInt(playerData.gPlayed, 10) + 1,
                                    });

                                    admin.database(leaderboardDb).ref(`leaderboard/daily/${players[key].uid}/gPlayed`)
                                      .transaction(gPlayed => (gPlayed || 0) + 1);

                                    admin.database(leaderboardDb).ref(`leaderboard/week/${players[key].uid}/gPlayed`)
                                      .transaction(gPlayed => (gPlayed || 0) + 1);

                                    admin.database(leaderboardDb).ref(`leaderboard/month/${players[key].uid}/gPlayed`)
                                      .transaction(gPlayed => (gPlayed || 0) + 1);

                                    admin.database(leaderboardDb).ref(`leaderboard/year/${players[key].uid}/gPlayed`)
                                      .transaction(gPlayed => (gPlayed || 0) + 1);

                                    if (playerData && playerData.joinedRooms) {
                                      Object.keys(playerData.joinedRooms).map((key3) => {
                                        const {
                                          position, tourRoom,
                                        } = playerData.joinedRooms[key3];

                                        if (key3 !== roomId) {
                                          if (!tourRoom) {
                                            admin.database().ref(`rooms/${key3}/players/${position}`).update({
                                              gPlayed: parseInt(playerData.gPlayed, 10) + 1,
                                              totalPnts: parseInt(playerData.totalPnts, 10) + 1,
                                            });

                                            admin.database().ref(`rooms/${key3}/playersList/${position}`).update({
                                              gPlayed: parseInt(playerData.gPlayed, 10) + 1,
                                              totalPnts: parseInt(playerData.totalPnts, 10) + 1,
                                            });
                                          }
                                        }
                                        return null;
                                      });
                                    }
                                  }
                                  admin.database().ref(`users/${players[key].uid}/joinedRooms/${roomId}`).remove();
                                });
                              }
                              return null;
                            });

                            log(roomId, 'endRoom: setPulesOnClose');

                            setPulesOnClose({ roomId });

                            if (!tournamentRoom) {
                              admin.database().ref('rooms/roomCount')
                                .transaction(roomCount => (roomCount - 1));
                            }

                            const promise5 = admin.database().ref(`userAchievements/${players.player1.uid}/maxParties`).once('value');
                            const promise6 = admin.database().ref(`userAchievements/${players.player2.uid}/maxParties`).once('value');
                            const promise7 = admin.database().ref(`userAchievements/${players.player3.uid}/maxParties`).once('value');

                            Promise.all([promise5, promise6, promise7])
                              .then((promiseRes2) => {
                                let player1MaxParties;
                                let player2MaxParties;
                                let player3MaxParties;
                                promiseRes2.map((res2, index) => {
                                  if (index === 0) {
                                    player1MaxParties = res2.val();
                                  } else if (index === 1) {
                                    player2MaxParties = res2.val();
                                  } else if (index === 2) {
                                    player3MaxParties = res2.val();
                                  }
                                  return null;
                                });

                                const updates = {};

                                if (party > player1MaxParties) {
                                  updates[`${players.player1.uid}/maxParties`] = party;
                                }
                                if (party > player2MaxParties) {
                                  updates[`${players.player2.uid}/maxParties`] = party;
                                }
                                if (party > player3MaxParties) {
                                  updates[`${players.player3.uid}/maxParties`] = party;
                                }

                                admin.database().ref('userAchievements').update(updates);
                              });

                            admin.database().ref(`adminLogs/rooms/${roomId}/${party}`).push({
                              time: Date.now(),
                              roomId,
                              type: 'roomClosed',
                              data: {
                                type: 'missedTurn',
                                player: playerName,
                                playerUid,
                              },
                            });

                            admin.database(adminLogsDb).ref(`adminLogs/rooms/${roomId}/${party}`).push({
                              time: Date.now(),
                              roomId,
                              type: 'roomClosed',
                              data: {
                                type: 'missedTurn',
                                player: playerName,
                                playerUid,
                              },
                            });

                            if (!tournamentRoom) {
                              admin.database().ref(`roomsPubInf/${roomId}`).remove();
                              admin.database().ref(`roomsPubInfIds/${roomId}`).remove();
                            }

                            log(roomId, 'endRoom: success #2');
                            return res.status(200).send({ data: { status: 'success' } });
                          })
                          .catch((err) => {
                            log(roomId, `endRoom: error: ${err}`);
                            return res.status(200).send({ data: { status: 'error', err } });
                          });
                      });
                    } else if (gameState === 'lowBal') {
                      log(roomId, "endRoom: gameState === 'lowBal'");

                      let playerName = '';
                      if (players.player1.uid === decoded.uid) {
                        playerName = players.player1.name;
                      } else if (players.player2.uid === decoded.uid) {
                        playerName = players.player2.name;
                      } else if (players.player3.uid === decoded.uid) {
                        playerName = players.player3.name;
                      }

                      if (tournamentRoom) {
                        Object.keys(players).map((key) => {
                          if (key !== 'playerList') {
                            admin.database().ref(`tourPlayers/${tournamentId}/${players[key].uid}`).update({
                              roomId: null,
                            });

                            admin.database().ref(`tourPlayerData/${players[key].uid}/${tournamentId}`).update({
                              roomId: null,
                            });
                          }
                          return null;
                        });
                      }

                      admin.database().ref(`rooms/${roomId}/globalParams/roomClosed`).transaction((roomClosed2) => {
                        if (roomClosed2 === true) {
                          return; // Abort the transaction.
                        }

                        return true;
                      })
                        .then((result) => {
                          if (!result.committed) {
                            log(roomId, 'endRoom: alredy closed #1');
                            return res.status(200).send({ data: { status: 'alredy closed' } });
                          }
                          if (result.snapshot.val() === null) {
                            log(roomId, 'endRoom: alredy closed #2');
                            return res.status(200).send({ data: { status: 'alredy closed' } });
                          }

                          admin.database().ref(`rooms/${roomId}/globalParams`).update({
                            roomClosed: true,
                            closeReason: { reason: 'lowBal', playerName, playerUid: decoded.uid },
                            gameState: 'lowBal',
                          });

                          admin.database().ref(`rooms/${roomId}`).update({
                            roomClosed: true,
                          });

                          admin.database().ref(`roomsPubInf/${roomId}`).update({
                            roomClosed: true,
                          });

                        //  admin.database().ref('roomsCount')
                        //    .transaction(roomsCount => (parseInt(roomsCount, 10) || 0) - 1);

                          admin.database().ref(`activeRooms/${roomId}`).remove();

                          Object.keys(players).map((key) => {
                            if (key !== 'playerList') {
                              admin.database().ref(`users/${players[key].uid}/joinedRooms/${roomId}`).remove();
                            }
                            return null;
                          });

                          if (!tournamentRoom) {
                            admin.database().ref(`roomsPubInf/${roomId}`).remove();
                            admin.database().ref(`roomsPubInfIds/${roomId}`).remove();
                          }

                          setPulesOnClose({ roomId });

                          const promise5 = admin.database().ref(`userAchievements/${players.player1.uid}/maxParties`).once('value');
                          const promise6 = admin.database().ref(`userAchievements/${players.player2.uid}/maxParties`).once('value');
                          const promise7 = admin.database().ref(`userAchievements/${players.player3.uid}/maxParties`).once('value');

                          Promise.all([promise5, promise6, promise7])
                            .then((promiseRes2) => {
                              let player1MaxParties;
                              let player2MaxParties;
                              let player3MaxParties;
                              promiseRes2.map((res2, index) => {
                                if (index === 0) {
                                  player1MaxParties = res2.val();
                                } else if (index === 1) {
                                  player2MaxParties = res2.val();
                                } else if (index === 2) {
                                  player3MaxParties = res2.val();
                                }
                                return null;
                              });

                              const updates = {};

                              if (party > player1MaxParties) {
                                updates[`${players.player1.uid}/maxParties`] = party;
                              }
                              if (party > player2MaxParties) {
                                updates[`${players.player2.uid}/maxParties`] = party;
                              }
                              if (party > player3MaxParties) {
                                updates[`${players.player3.uid}/maxParties`] = party;
                              }

                              admin.database().ref('userAchievements').update(updates);

                              admin.database().ref(`adminLogs/rooms/${roomId}/${party}`).push({
                                time: Date.now(),
                                roomId,
                                type: 'roomClosed',
                                data: {
                                  type: 'lowBal',
                                  player: playerName,
                                  playerUid: decoded.uid,
                                },
                              });

                              admin.database(adminLogsDb).ref(`adminLogs/rooms/${roomId}/${party}`).push({
                                time: Date.now(),
                                roomId,
                                type: 'roomClosed',
                                data: {
                                  type: 'lowBal',
                                  player: playerName,
                                  playerUid: decoded.uid,
                                },
                              });

                              //  });

                              if (tournamentRoom) {
                                log(roomId, 'endRoom: success #3');
                                return res.status(200).send({ data: { status: 'success', tournamentId } });
                              }

                              log(roomId, 'endRoom: success #4');
                              return res.status(200).send({ data: { status: 'success' } });
                            }).catch((err) => {
                              log(roomId, `endRoom: err #3: ${err}`);
                              return res.status(200).send({ data: { status: 'error', error: err } });
                            });
                        });
                    } else if (gameState === 'choose') {
                      log(roomId, 'endRoom: state is choose');

                      if (tournamentRoom) {
                        Object.keys(players).map((key) => {
                          if (key !== 'playerList') {
                            admin.database().ref(`tourPlayers/${tournamentId}/${players[key].uid}`).once('value', (playerSnapshot) => {
                              const playerData = playerSnapshot.val() || [];

                              if (talking.toString() === players[key].uid.toString()) {
                                admin.database().ref(`tourPlayers/${tournamentId}/${players[key].uid}`).update({
                                  bal: parseInt(playerData.bal, 10) + (-10 * betValue),
                                  totalPnts: parseInt(playerData.totalPnts, 10) + (-10),
                                  roomId: null,
                                });

                                admin.database().ref(`tourPlayerData/${players[key].uid}/${tournamentId}`).update({
                                  bal: parseInt(playerData.bal, 10) + (-10 * betValue),
                                  totalPnts: parseInt(playerData.totalPnts, 10) + (-10),
                                  roomId: null,
                                });

                                admin.database().ref(`tourHistory/${players[key].uid}/${tournamentId}`).update({
                                  bal: parseInt(playerData.bal, 10) + (-10 * betValue),
                                  totalPnts: parseInt(playerData.totalPnts, 10) + (-10),
                                });
                              } else {
                                admin.database().ref(`tourPlayers/${tournamentId}/${players[key].uid}`).update({
                                  bal: parseInt(playerData.bal, 10) + (1 * betValue),
                                  totalPnts: parseInt(playerData.totalPnts, 10) + (1),
                                  roomId: null,
                                });

                                admin.database().ref(`tourPlayerData/${players[key].uid}/${tournamentId}`).update({
                                  bal: parseInt(playerData.bal, 10) + (1 * betValue),
                                  totalPnts: parseInt(playerData.totalPnts, 10) + (1),
                                  roomId: null,
                                });

                                admin.database().ref(`tourHistory/${players[key].uid}/${tournamentId}`).update({
                                  bal: parseInt(playerData.bal, 10) + (1 * betValue),
                                  totalPnts: parseInt(playerData.totalPnts, 10) + (1),
                                });
                              }

                              admin.database().ref(`users/${players[key].uid}/joinedRooms/${roomId}`).remove();
                            });
                          }

                          return null;
                        });

                        log(roomId, 'endRoom: setPulesOnClose #2');

                        setPulesOnClose({ roomId });

                        let playerName = '';
                        let playerUid = '';
                        if (players.player1.uid.toString() === talking.toString()) {
                          playerName = players.player1.name || '';
                          playerUid = players.player1.uid || '';
                        } else if (players.player2.uid.toString() === talking.toString()) {
                          playerName = players.player2.name || '';
                          playerUid = players.player2.uid || '';
                        } else if (players.player3.uid.toString() === talking.toString()) {
                          playerName = players.player3.name || '';
                          playerUid = players.player3.uid || '';
                        }

                        admin.database().ref(`rooms/${roomId}/globalParams`).update({
                          closeReason: { reason: 'missedTurn', playerName, playerUid },
                        });

                        if (!tournamentRoom) {
                          admin.database().ref('rooms/roomCount')
                            .transaction(roomCount => (roomCount - 1));
                        }

                        const promise5 = admin.database().ref(`userAchievements/${players.player1.uid}/maxParties`).once('value');
                        const promise6 = admin.database().ref(`userAchievements/${players.player2.uid}/maxParties`).once('value');
                        const promise7 = admin.database().ref(`userAchievements/${players.player3.uid}/maxParties`).once('value');

                        Promise.all([promise5, promise6, promise7])
                          .then((promiseRes2) => {
                            let player1MaxParties;
                            let player2MaxParties;
                            let player3MaxParties;
                            promiseRes2.map((res2, index) => {
                              if (index === 0) {
                                player1MaxParties = res2.val();
                              } else if (index === 1) {
                                player2MaxParties = res2.val();
                              } else if (index === 2) {
                                player3MaxParties = res2.val();
                              }
                              return null;
                            });

                            const updates = {};

                            if (party > player1MaxParties) {
                              updates[`${players.player1.uid}/maxParties`] = party;
                            }
                            if (party > player2MaxParties) {
                              updates[`${players.player2.uid}/maxParties`] = party;
                            }
                            if (party > player3MaxParties) {
                              updates[`${players.player3.uid}/maxParties`] = party;
                            }

                            admin.database().ref('userAchievements').update(updates);
                          });

                        admin.database().ref(`adminLogs/rooms/${roomId}/${party}`).push({
                          time: Date.now(),
                          roomId,
                          type: 'roomClosed',
                          data: {
                            type: 'missedTurn',
                            player: playerName,
                            playerUid,
                          },
                        });

                        admin.database(adminLogsDb).ref(`adminLogs/rooms/${roomId}/${party}`).push({
                          time: Date.now(),
                          roomId,
                          type: 'roomClosed',
                          data: {
                            type: 'missedTurn',
                            player: playerName,
                            playerUid,
                          },
                        });


                        if (!tournamentRoom) {
                          admin.database().ref(`roomsPubInf/${roomId}`).remove();
                          admin.database().ref(`roomsPubInfIds/${roomId}`).remove();
                        }

                        log(roomId, 'endRoom: success #5');
                        return res.status(200).send({ data: { status: 'success' } });
                      }

                      log(roomId, 'endRoom: before regular room #2');

                      admin.database().ref(`rooms/${roomId}/globalParams/roomClosed`).transaction((roomClosed2) => {
                        if (roomClosed2 === true) {
                          return; // Abort the transaction.
                        }

                        return true;
                      })
                        .then((result) => {
                          if (!result.committed) {
                            log(roomId, 'endRoom: alredy closed #4');
                            return res.status(200).send({ data: { status: 'alredy closed' } });
                          }
                          if (result.snapshot.val() === null) {
                            log(roomId, 'endRoom: alredy closed #5');
                            return res.status(200).send({ data: { status: 'alredy closed' } });
                          }

                          let playerName = '';
                          let playerUid = '';
                          if (players.player1.uid.toString() === talking.toString()) {
                            playerName = players.player1.name;
                            playerUid = players.player1.uid;
                          } else if (players.player2.uid.toString() === talking.toString()) {
                            playerName = players.player2.name;
                            playerUid = players.player2.uid;
                          } else if (players.player3.uid.toString() === talking.toString()) {
                            playerName = players.player3.name;
                            playerUid = players.player3.uid;
                          }

                          admin.database().ref(`rooms/${roomId}/globalParams`).update({
                            closeReason: { reason: 'missedTurn', playerName, playerUid },
                          });

                          admin.database().ref(`rooms/${roomId}`).update({
                            roomClosed: true,
                          });

                          admin.database().ref(`roomsPubInf/${roomId}`).update({
                            roomClosed: true,
                          });

                        //  admin.database().ref('roomsCount')
                        //    .transaction(roomsCount => (parseInt(roomsCount, 10) || 0) - 1);

                          admin.database().ref(`rooms/${roomId}/globalParams`).update({
                            roomClosed: true,
                          });

                          admin.database().ref(`activeRooms/${roomId}`).remove();

                          Object.keys(players).map((key) => {
                            if (key !== 'playerList') {
                              admin.database().ref(`users/${players[key].uid}`).once('value', (playerSnapshot) => {
                                const playerData = playerSnapshot.val() || [];

                                if (talking.toString() === players[key].uid.toString()) {
                                  admin.database().ref(`users/${players[key].uid}/bal`)
                                    .transaction(bal => (bal || 0) + (-10 * betValue));

                                  log(roomId, 'endRoom: set missed turn');

                                  admin.database().ref(`users/${players[key].uid}`).update({
                                    totalPnts: parseInt(playerData.totalPnts, 10) + (-10),
                                  });

                                  admin.database().ref(`userBalHistory/${players[key].uid}`).push({
                                    time: Date.now(),
                                    type: 'missTurnMe',
                                    roomId,
                                    change: -10 * betValue,
                                    old: playerData.bal,
                                    new: parseInt(playerData.bal, 10) + (-10 * betValue),
                                  });
                                } else {
                                  admin.database().ref(`users/${players[key].uid}/bal`)
                                    .transaction(bal => (bal || 0) + (1 * betValue));

                                  admin.database().ref(`users/${players[key].uid}`).update({
                                    totalPnts: parseInt(playerData.totalPnts, 10) + (1),
                                  });

                                  admin.database().ref(`userBalHistory/${players[key].uid}`).push({
                                    time: Date.now(),
                                    type: 'missTurnOther',
                                    roomId,
                                    change: betValue,
                                    old: playerData.bal,
                                    new: parseInt(playerData.bal, 10) + betValue,
                                  });
                                }

                                admin.database().ref(`users/${players[key].uid}/joinedRooms/${roomId}`).remove();
                              });
                            }
                            return null;
                          });

                          log(roomId, 'endRoom: setPulesOnClose #3');

                          setPulesOnClose({ roomId });

                          if (!tournamentRoom) {
                            admin.database().ref('rooms/roomCount')
                              .transaction(roomCount => (roomCount - 1));
                          }

                          const promise5 = admin.database().ref(`userAchievements/${players.player1.uid}/maxParties`).once('value');
                          const promise6 = admin.database().ref(`userAchievements/${players.player2.uid}/maxParties`).once('value');
                          const promise7 = admin.database().ref(`userAchievements/${players.player3.uid}/maxParties`).once('value');

                          Promise.all([promise5, promise6, promise7])
                            .then((promiseRes2) => {
                              let player1MaxParties;
                              let player2MaxParties;
                              let player3MaxParties;
                              promiseRes2.map((res2, index) => {
                                if (index === 0) {
                                  player1MaxParties = res2.val();
                                } else if (index === 1) {
                                  player2MaxParties = res2.val();
                                } else if (index === 2) {
                                  player3MaxParties = res2.val();
                                }
                                return null;
                              });

                              const updates = {};

                              if (party > player1MaxParties) {
                                updates[`${players.player1.uid}/maxParties`] = party;
                              }
                              if (party > player2MaxParties) {
                                updates[`${players.player2.uid}/maxParties`] = party;
                              }
                              if (party > player3MaxParties) {
                                updates[`${players.player3.uid}/maxParties`] = party;
                              }

                              admin.database().ref('userAchievements').update(updates);
                            });

                          admin.database().ref(`adminLogs/rooms/${roomId}/${party}`).push({
                            time: Date.now(),
                            roomId,
                            type: 'roomClosed',
                            data: {
                              type: 'missedTurn',
                              player: playerName,
                              playerUid,
                            },
                          });

                          admin.database(adminLogsDb).ref(`adminLogs/rooms/${roomId}/${party}`).push({
                            time: Date.now(),
                            roomId,
                            type: 'roomClosed',
                            data: {
                              type: 'missedTurn',
                              player: playerName,
                              playerUid,
                            },
                          });

                          if (!tournamentRoom) {
                            admin.database().ref(`roomsPubInf/${roomId}`).remove();
                            admin.database().ref(`roomsPubInfIds/${roomId}`).remove();
                          }

                          log(roomId, 'endRoom: success #7');
                          return res.status(200).send({ data: { status: 'success' } });
                        });
                    } else {
                      log(roomId, 'endRoom: no game state');
                      return res.status(200).send({ data: { status: 'no game state' } });
                    }
                  } else {
                    log(roomId, 'endRoom: Room already closed #8');
                    return res.status(200).send({ data: { status: 'Room already closed' } });
                  }
                } else {
                  log(roomId, 'endRoom: Room not filled');
                  return res.status(200).send({ data: { status: 'error', message: 'Room not filled' } });
                }
              } else {
                log(roomId, 'endRoom: notInRoom');
                return res.status(200).send({ data: { status: 'error', message: 'notInRoom' } });
              }
            } else {
              log(roomId, 'endRoom: Turn not over');
              return res.status(200).send({ data: { status: 'error', message: 'Turn not over' } });
            }
          })
            .catch((err) => {
              log(roomId, `endRoom: error #1: ${err}`);
              return res.status(200).send({ data: { status: 'error', message: err } });
            });
        })
        .catch((err) => {
          log(roomId, `endRoom: error #2: ${err}`);
          return res.status(200).send({ data: { status: 'error', message: err } });
        });
    } else {
      log(roomId, 'endRoom: No auth');
      return res.status(200).send({ data: { status: 'error', message: 'No auth' } });
    }
  });
};

module.exports = endRoom;
