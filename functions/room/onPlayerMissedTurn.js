
const onPlayerMissedTurn = (snapshot, context) => {
  const { admin, leaderboardDb, adminLogsDb, roomsPublicDb, userStatsDB, roomsDb } = require('../admin');
  const setPulesOnClose = require('../game/setPulesOnClose');
    return new Promise(resolve => {
    const {
      roomId,
    } = context.params;

          const promise1 = admin.database(roomsDb).ref(`rooms/${roomId}/playersList`).once('value');
          const promise2 = admin.database(roomsDb).ref(`rooms/${roomId}/globalParams`).once('value');
          const promise3 = admin.database(roomsDb).ref(`rooms/${roomId}/curRnd/cardPlayed2`).once('value');

          Promise.all([promise1, promise2, promise3]).then((promisesRes) => {
            let players;
            let globalParams;
            let cardPlayed;

            promisesRes.map((promiseRes, index) => {
              if (index === 0) {
                players = promiseRes.val() || {};
              } else if (index === 1) {
                globalParams = promiseRes.val() || {};
              } else if (index === 2) {
                cardPlayed = promiseRes.val() || null;
              } else if (index === 2) {
                cardPlayed = promiseRes.val() || null;
              }
              return null;
            });

                const {
                  talking, tournamentRoom, tournamentId, roomClosed, gameState, bet, party,
                } = globalParams;

                if (!cardPlayed && cardPlayed !== 0) {

                if (players.player1 && players.player2 && players.player3
                    && players.player1.uid && players.player2.uid && players.player3.uid) {
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
                      admin.database(roomsDb).ref(`rooms/${roomId}/curRnd/currentTurn`).once('value', (currentRoundSnapshot) => {
                        const currentTurn = currentRoundSnapshot.val() || null;

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

                          admin.database(roomsDb).ref(`rooms/${roomId}/globalParams`).update({
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

                        //  return res.status(200).send({ data: { status: 'success' } });
                          return resolve('success');
                        }

                        admin.database(roomsDb).ref(`rooms/${roomId}/globalParams/roomClosed`).transaction((roomClosed2) => {
                          if (roomClosed2 === null) {
                            return roomClosed2; // Ignore the transaction.
                          }

                          if (roomClosed2 === true) {
                            return; // Abort the transaction.
                          }

                          return true;
                        })
                          .then((result) => {
                            if (!result.committed) {
                            //  return res.status(200).send({ data: { status: 'already closed' } });
                              console.log('not commited');
                              return resolve('already closed');
                            }
                            if (result.snapshot.val() === null) {
                            //  return res.status(200).send({ data: { status: 'already closed' } });
                              console.log('not result.snapshot.val()');
                              return resolve('already closed');
                            }

                            return admin.database(roomsDb).ref(`rooms/${roomId}/nextTimestamp`).once('value', nextTimestampSnapshot => {
                              const nextTimestamp = nextTimestampSnapshot.val() || null;

                            if (nextTimestamp > Date.now() + 50) {
                              admin.database(roomsDb).ref(`rooms/${roomId}/globalParams/roomClosed`).set(false);

                              admin.database().ref(`rooms/${roomId}/globalParams/missedTurn`).remove();
                              admin.database(roomsDb).ref(`rooms/${roomId}/globalParams/missedTurn`).remove();

                              return resolve('success');
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

                            admin.database(roomsDb).ref(`rooms/${roomId}/globalParams`).update({
                              closeReason: { reason: 'missedTurn', playerName, playerUid },
                            });

                            admin.database().ref(`rooms/${roomId}/globalParams`).update({
                              closeReason: { reason: 'missedTurn', playerName, playerUid },
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

                                    admin.database().ref(`users/${players[key].uid}`).update({
                                      gPlayed: parseInt(playerData.gPlayed, 10) + 1,
                                      totalPnts: parseInt(playerData.totalPnts, 10) + largePoints,
                                      joinedRooms: null,
                                    });

                                    admin.database().ref(`userBalHistory/${players[key].uid}`).push({
                                      time: Date.now(),
                                      type: 'missTurnMe',
                                      roomId,
                                      change: largePoints * betValue,
                                      old: playerData.bal,
                                      new: parseInt(playerData.bal, 10) + (largePoints * betValue),
                                    });

                                    admin.database(userStatsDB).ref(`userBalHistory/${players[key].uid}`).push({
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

                                    admin.database(userStatsDB).ref(`userBalHistory/${players[key].uid}`).push({
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
                                  }
                                  admin.database().ref(`users/${players[key].uid}/joinedRooms/${roomId}`).remove();
                                });
                              }
                              return null;
                            });

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
                              admin.database(roomsPublicDb).ref(`roomsPubInf/${roomId}`).remove();
                              admin.database(roomsPublicDb).ref(`roomsPubInfIds/${roomId}`).remove();
                            }

                            return resolve('success');

                            })
                            .catch((err) => {
                              return resolve('error');
                            });
                          })
                          .catch((err) => {
                            return resolve('error');
                          });
                      });
                    } else if (gameState === 'choose') {
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
                          admin.database(roomsPublicDb).ref(`roomsPubInf/${roomId}`).remove();
                          admin.database(roomsPublicDb).ref(`roomsPubInfIds/${roomId}`).remove();
                        }

                      //  return res.status(200).send({ data: { status: 'success' } });
                        return resolve('success');
                      }

                      admin.database(roomsDb).ref(`rooms/${roomId}/globalParams/roomClosed`).transaction((roomClosed2) => {
                        if (roomClosed2 === null) {
                          return roomClosed2; // Ignore the transaction.
                        }

                        if (roomClosed2 === true) {
                          return; // Abort the transaction.
                        }

                        return true;
                      })
                        .then((result) => {
                          if (!result.committed) {
                          //  return res.status(200).send({ data: { status: 'already closed' } });
                            return resolve('already closed');
                          }
                          if (result.snapshot.val() === null) {
                          //  return res.status(200).send({ data: { status: 'already closed' } });
                          return resolve('already closed');
                          }

                          return admin.database(roomsDb).ref(`rooms/${roomId}/nextTimestamp`).once('value', nextTimestampSnapshot => {
                            const nextTimestamp = nextTimestampSnapshot.val() || null;

                          if (nextTimestamp > Date.now() + 50) {
                            admin.database(roomsDb).ref(`rooms/${roomId}/globalParams/roomClosed`).set(false);

                            admin.database().ref(`rooms/${roomId}/globalParams/missedTurn`).remove();
                            admin.database(roomsDb).ref(`rooms/${roomId}/globalParams/missedTurn`).remove();

                            return resolve('success');
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

                          admin.database(roomsDb).ref(`rooms/${roomId}/globalParams`).update({
                            closeReason: { reason: 'missedTurn', playerName, playerUid },
                          });

                          admin.database().ref(`rooms/${roomId}/globalParams`).update({
                            closeReason: { reason: 'missedTurn', playerName, playerUid },
                            roomClosed: true,
                          });

                          admin.database(roomsPublicDb).ref(`roomsPubInf/${roomId}`).update({
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

                                  admin.database(userStatsDB).ref(`userBalHistory/${players[key].uid}`).push({
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

                                  admin.database(userStatsDB).ref(`userBalHistory/${players[key].uid}`).push({
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
                            admin.database(roomsPublicDb).ref(`roomsPubInf/${roomId}`).remove();
                            admin.database(roomsPublicDb).ref(`roomsPubInfIds/${roomId}`).remove();
                          }

                        //  return res.status(200).send({ data: { status: 'success' } });
                          return resolve('success');
                        })
                        .catch((err) => {
                          return resolve('error');
                        });
                      })
                      .catch((err) => {
                        return resolve('error');
                      });
                    } else {
                    //  admin.database(roomsPublicDb).ref(`roomsStatus/${roomId}/roomClosed`).remove();
                      console.log('no game state');
                      admin.database().ref(`rooms/${roomId}/globalParams/missedTurn`).remove();
                      admin.database(roomsDb).ref(`rooms/${roomId}/globalParams/missedTurn`).remove();
                      return resolve('no game state');
                    //  return res.status(200).send({ data: { status: 'no game state' } });
                    }

                } else {
                //  admin.database(roomsPublicDb).ref(`roomsStatus/${roomId}/roomClosed`).remove();
                //  return res.status(200).send({ data: { status: 'error', message: 'Room not filled' } });
                  admin.database().ref(`rooms/${roomId}/globalParams/missedTurn`).remove();
                  admin.database(roomsDb).ref(`rooms/${roomId}/globalParams/missedTurn`).remove();
                  return resolve('Room not filled');
                }
              } else {
              //  admin.database(roomsPublicDb).ref(`roomsStatus/${roomId}/roomClosed`).remove();
              //  return res.status(200).send({ data: { status: 'error', message: 'Room not filled' } });
                console.log('Card has been played');
                admin.database().ref(`rooms/${roomId}/globalParams/missedTurn`).remove();
                admin.database(roomsDb).ref(`rooms/${roomId}/globalParams/missedTurn`).remove();
                return resolve('Card has been played');
              }
        })
        .catch((err) => {
          admin.database().ref(`rooms/${roomId}/globalParams/missedTurn`).remove();
          admin.database(roomsDb).ref(`rooms/${roomId}/globalParams/missedTurn`).remove();
          return resolve('already closed');
        //  return res.status(200).send({ data: { status: 'error', message: err } });
        });
      });
};

module.exports = onPlayerMissedTurn;
