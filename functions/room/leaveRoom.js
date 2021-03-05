
const leaveRoom = (req, res) => {
  const cors = require('cors')({ origin: true });
  const { admin, leaderboardDb, adminLogsDb, roomsPublicDb, userStatsDB, roomsDb } = require('../admin');
  const setPulesOnClose = require('../game/setPulesOnClose');

  cors(req, res, () => {
    const {
      roomId,
    } = req.body.data;

    if (req.get('Authorization')) {

    const tokenId = req.get('Authorization').split('Bearer ')[1];

    admin.auth().verifyIdToken(tokenId)
      .then((decoded) => {
        if (!decoded.uid) {
          return res.status(200).send({ data: 'Error creating room (no auth token)' });
        }

        const promise1 = admin.database(roomsDb).ref(`rooms/${roomId}/playersList`).once('value');
        const promise2 = admin.database(roomsDb).ref(`rooms/${roomId}/globalParams`).once('value');

        Promise.all([promise1, promise2]).then((promiseRes) => {
          let players;
          let globalParams;

          promiseRes.map((res2) => {
            if (res2) {
              if (res2.key === 'playersList') {
                players = res2.val();
              } else if (res2.key === 'globalParams') {
                globalParams = res2.val();
              }
            }
            return null;
          });

          if ((players.player1 && players.player1.uid && players.player1.uid.toString() === decoded.uid.toString())
            || (players.player2 && players.player2.uid && players.player2.uid.toString() === decoded.uid.toString())
            || (players.player3 && players.player3.uid && players.player3.uid.toString() === decoded.uid.toString())) {

              const {
                tournamentRoom, tournamentId, gameState, bet, roomClosed, party,
              } = globalParams;

              if (players.player1 && players.player2 && players.player3
                && players.player1.uid && players.player2.uid && players.player3.uid) {
                // Closing filled room

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

                  if (tournamentRoom) {
                    admin.database().ref(`tourPlayers/${tournamentId}/${players.player1.uid}`).update({
                      roomId: null,
                    });

                    admin.database().ref(`tourPlayerData/${players.player1.uid}/${tournamentId}`).update({
                      roomId: null,
                    });

                    admin.database().ref(`tourPlayers/${tournamentId}/${players.player2.uid}`).update({
                      roomId: null,
                    });

                    admin.database().ref(`tourPlayerData/${players.player2.uid}/${tournamentId}`).update({
                      roomId: null,
                    });

                    admin.database().ref(`tourPlayers/${tournamentId}/${players.player3.uid}`).update({
                      roomId: null,
                    });

                    admin.database().ref(`tourPlayerData/${players.player3.uid}/${tournamentId}`).update({
                      roomId: null,
                    });
                  }

                  if (gameState === 'play' || gameState === 'burry') {
                    // Leaving during play

                    let playerName = '';
                    let playerUid = '';
                    if (players.player1.uid === decoded.uid) {
                      playerName = players.player1.name;
                      playerUid = players.player1.uid;
                    } else if (players.player2.uid === decoded.uid) {
                      playerName = players.player2.name;
                      playerUid = players.player2.uid;
                    } else if (players.player3.uid === decoded.uid) {
                      playerName = players.player3.name;
                      playerUid = players.player3.uid;
                    }

                    // Tournament room
                    if (tournamentRoom) {
                      admin.database().ref(`tourPlayers/${tournamentId}/${players.player1.uid}`).update({
                        roomId: null,
                      });

                      admin.database().ref(`tourPlayerData/${players.player1.uid}/${tournamentId}`).update({
                        roomId: null,
                      });

                      admin.database().ref(`tourPlayers/${tournamentId}/${players.player2.uid}`).update({
                        roomId: null,
                      });

                      admin.database().ref(`tourPlayerData/${players.player2.uid}/${tournamentId}`).update({
                        roomId: null,
                      });

                      admin.database().ref(`tourPlayers/${tournamentId}/${players.player3.uid}`).update({
                        roomId: null,
                      });

                      admin.database().ref(`tourPlayerData/${players.player3.uid}/${tournamentId}`).update({
                        roomId: null,
                      });

                      admin.database().ref(`tourPlayers/${tournamentId}`).once('value', (tournamentPlayersSnapshot) => {
                        const tourPlayers = tournamentPlayersSnapshot.val() || {};

                        Object.keys(players).map((key) => {
                          if (decoded.uid === players[key].uid) {
                            admin.database().ref(`tourPlayers/${tournamentId}/${players[key].uid}/bal`)
                              .transaction(bal => (bal || 0) + (-10 * betValue));

                            admin.database().ref(`tourPlayers/${tournamentId}/${players[key].uid}`).update({
                              totalPnts: parseInt(tourPlayers[players[key].uid].totalPnts, 10) - 10,
                              roomId: null,
                            });

                            admin.database().ref(`tourPlayerData/${players[key].uid}/${tournamentId}/bal`)
                              .transaction(bal => (bal || 0) + (-10 * betValue));

                            admin.database().ref(`tourPlayerData/${players[key].uid}/${tournamentId}`).update({
                              totalPnts: parseInt(tourPlayers[players[key].uid].totalPnts, 10) - 10,
                              roomId: null,
                            });

                            admin.database().ref(`tourHistory/${players[key].uid}/${tournamentId}/bal`)
                              .transaction(bal => (bal || 0) + (-10 * betValue));

                            admin.database().ref(`tourHistory/${players[key].uid}/${tournamentId}`).update({
                              totalPnts: parseInt(tourPlayers[players[key].uid].totalPnts, 10) - 10,
                            });
                          }

                          admin.database().ref(`users/${players[key].uid}/joinedRooms/${roomId}`).remove();

                          return null;
                        });

                        admin.database().ref(`rooms/${roomId}/globalParams`).update({
                          roomClosed: true,
                          closeReason: { reason: 'leftRoom', playerName, playerUid },
                        });

                        admin.database(roomsDb).ref(`rooms/${roomId}/globalParams`).update({
                          roomClosed: true,
                          closeReason: { reason: 'leftRoom', playerName, playerUid },
                        });

                        admin.database().ref(`rooms/${roomId}`).update({
                          roomClosed: true,
                        });



                      //  admin.database().ref(`roomsPubInf/${roomId}`).update({
                      //    roomClosed: true,
                      //  });

                        admin.database(roomsPublicDb).ref(`roomsPubInf/${roomId}`).update({
                          roomClosed: true,
                        });

                        admin.database().ref(`activeRooms/${roomId}`).remove();

                        const promise1 = admin.database().ref(`userAchievements/${players.player1.uid}/maxParties`).once('value');
                        const promise2 = admin.database().ref(`userAchievements/${players.player2.uid}/maxParties`).once('value');
                        const promise3 = admin.database().ref(`userAchievements/${players.player3.uid}/maxParties`).once('value');

                        Promise.all([promise1, promise2, promise3])
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

                            if (party > player1MaxParties) {
                              admin.database().ref(`userAchievements/${players.player1.uid}/maxParties`).set(party);
                            }
                            if (party > player2MaxParties) {
                              admin.database().ref(`userAchievements/${players.player2.uid}/maxParties`).set(party);
                            }
                            if (party > player3MaxParties) {
                              admin.database().ref(`userAchievements/${players.player3.uid}/maxParties`).set(party);
                            }
                          });

                        admin.database().ref(`adminLogs/rooms/${roomId}/${party}`).push({
                          time: Date.now(),
                          roomId,
                          type: 'roomClosed',
                          data: {
                            type: 'leftRoom',
                            player: playerName,
                            playerUid,
                          },
                        });

                        admin.database(adminLogsDb).ref(`adminLogs/rooms/${roomId}/${party}`).push({
                          time: Date.now(),
                          roomId,
                          type: 'roomClosed',
                          data: {
                            type: 'leftRoom',
                            player: playerName,
                            playerUid,
                          },
                        });

                        return res.status(200).send({ data: { status: 'success', tournamentId } });
                      }).catch((err) => {
                        console.log(err);
                        return res.status(200).send({ data: { status: 'error', err } });
                      });
                    } else {
                    // Regular room
                      Object.keys(players).map((key) => {
                        if (key !== 'playerList') {
                          admin.database().ref(`users/${players[key].uid}`).once('value', (playerSnapshot) => {
                            const playerData = playerSnapshot.val() || {};

                            if (decoded.uid === players[key].uid) {
                              admin.database().ref(`users/${players[key].uid}/bal`)
                                .transaction(bal => (bal || 0) + (-10 * betValue));

                              admin.database().ref(`users/${players[key].uid}`).update({
                                gPlayed: parseInt(playerData.gPlayed, 10) + 1,
                                totalPnts: parseInt(playerData.totalPnts, 10) - 10,
                              });

                              admin.database().ref(`userBalHistory/${players[key].uid}`).push({
                                time: Date.now(),
                                type: 'leftRoom',
                                roomId,
                                change: -10 * betValue,
                                old: playerData.bal,
                                new: parseInt(playerData.bal, 10) + (-10 * betValue),
                              });

                              admin.database(userStatsDB).ref(`userBalHistory/${players[key].uid}`).push({
                                time: Date.now(),
                                type: 'leftRoom',
                                roomId,
                                change: -10 * betValue,
                                old: playerData.bal,
                                new: parseInt(playerData.bal, 10) + (-10 * betValue),
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

                      admin.database().ref(`rooms/${roomId}/globalParams`).update({
                        roomClosed: true,
                        closeReason: { reason: 'leftRoom', playerName, playerUid },
                      });

                      admin.database(roomsDb).ref(`rooms/${roomId}/globalParams`).update({
                        roomClosed: true,
                        closeReason: { reason: 'leftRoom', playerName, playerUid },
                      });

                      admin.database().ref(`rooms/${roomId}`).update({
                        roomClosed: true,
                      });

                      admin.database().ref(`activeRooms/${roomId}`).remove();

                      if (!tournamentRoom) {
                        admin.database(roomsPublicDb).ref(`roomsPubInf/${roomId}`).remove();

                      //  admin.database().ref(`roomsPubInf/${roomId}`).remove();

                      //  admin.database().ref(`roomsPubInfIds/${roomId}`).remove();

                        admin.database(roomsPublicDb).ref(`roomsPubInfIds/${roomId}`).remove();
                      }

                      setPulesOnClose({ roomId });

                      const promise1 = admin.database().ref(`userAchievements/${players.player1.uid}/maxParties`).once('value');
                      const promise2 = admin.database().ref(`userAchievements/${players.player2.uid}/maxParties`).once('value');
                      const promise3 = admin.database().ref(`userAchievements/${players.player3.uid}/maxParties`).once('value');

                      Promise.all([promise1, promise2, promise3])
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

                          if (party > player1MaxParties) {
                            admin.database().ref(`userAchievements/${players.player1.uid}/maxParties`).set(party);
                          }
                          if (party > player2MaxParties) {
                            admin.database().ref(`userAchievements/${players.player2.uid}/maxParties`).set(party);
                          }
                          if (party > player3MaxParties) {
                            admin.database().ref(`userAchievements/${players.player3.uid}/maxParties`).set(party);
                          }
                        });

                      admin.database().ref(`adminLogs/rooms/${roomId}/${party}`).push({
                        time: Date.now(),
                        roomId,
                        type: 'roomClosed',
                        data: {
                          type: 'leftRoom',
                          player: playerName,
                          playerUid,
                        },
                      });

                      admin.database(adminLogsDb).ref(`adminLogs/rooms/${roomId}/${party}`).push({
                        time: Date.now(),
                        roomId,
                        type: 'roomClosed',
                        data: {
                          type: 'leftRoom',
                          player: playerName,
                          playerUid,
                        },
                      });

                      return res.status(200).send({ data: { status: 'success' } });
                    }
                  } if (gameState === 'lowBal') {
                    let playerName = '';
                    if (players.player1.uid === decoded.uid) {
                      playerName = players.player1.name;
                    } else if (players.player2.uid === decoded.uid) {
                      playerName = players.player2.name;
                    } else if (players.player3.uid === decoded.uid) {
                      playerName = players.player3.name;
                    }

                    if (tournamentRoom) {
                      admin.database().ref(`tourPlayers/${tournamentId}/${players.player1.uid}`).update({
                        roomId: null,
                      });

                      admin.database().ref(`tourPlayers/${tournamentId}/${players.player2.uid}`).update({
                        roomId: null,
                      });

                      admin.database().ref(`tourPlayers/${tournamentId}/${players.player3.uid}`).update({
                        roomId: null,
                      });

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

                    //  admin.database().ref(`rooms/${roomId}/globalParams`).update({
                    //    roomClosed: true,
                    //    closeReason: { reason: 'lowBal', playerName, playerUid: decoded.uid },
                    //  });

                    admin.database(roomsDb).ref(`rooms/${roomId}`).update({
                      roomClosed: true,
                    });

                    admin.database().ref(`rooms/${roomId}`).update({
                      roomClosed: true,
                    });

                  //  admin.database().ref(`roomsPubInf/${roomId}`).update({
                  //    roomClosed: true,
                  //  });

                    admin.database(roomsPublicDb).ref(`roomsPubInf/${roomId}`).update({
                      roomClosed: true,
                    });

                    admin.database().ref(`activeRooms/${roomId}`).remove();

                    Object.keys(players).map((key) => {
                      if (key !== 'playerList') {
                        admin.database().ref(`users/${players[key].uid}/joinedRooms/${roomId}`).remove();
                      }
                      return null;
                    });

                    if (!tournamentRoom) {
                    //  admin.database().ref(`roomsPubInf/${roomId}`).remove();
                      admin.database(roomsPublicDb).ref(`roomsPubInf/${roomId}`).remove();
                    //  admin.database().ref(`roomsPubInfIds/${roomId}`).remove();
                      admin.database(roomsPublicDb).ref(`roomsPubInfIds/${roomId}`).remove();
                    }

                    setPulesOnClose({ roomId });

                    const promise1 = admin.database().ref(`userAchievements/${players.player1.uid}/maxParties`).once('value');
                    const promise2 = admin.database().ref(`userAchievements/${players.player2.uid}/maxParties`).once('value');
                    const promise3 = admin.database().ref(`userAchievements/${players.player3.uid}/maxParties`).once('value');

                    Promise.all([promise1, promise2, promise3])
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

                        if (party > player1MaxParties) {
                          admin.database().ref(`userAchievements/${players.player1.uid}/maxParties`).set(party);
                        }
                        if (party > player2MaxParties) {
                          admin.database().ref(`userAchievements/${players.player2.uid}/maxParties`).set(party);
                        }
                        if (party > player3MaxParties) {
                          admin.database().ref(`userAchievements/${players.player3.uid}/maxParties`).set(party);
                        }
                      });

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

                    if (tournamentRoom) {
                      return res.status(200).send({ data: { status: 'success', tournamentId } });
                    }
                    return res.status(200).send({ data: { status: 'success' } });
                  }

                  // Leaving during choosing game type
                  console.log('Leaving during choosing game type');

                  let playerName = '';
                  let playerUid = '';
                  if (players.player1.uid === decoded.uid) {
                    playerName = players.player1.name;
                    playerUid = players.player1.uid;
                  } else if (players.player2.uid === decoded.uid) {
                    playerName = players.player2.name;
                    playerUid = players.player2.uid;
                  } else if (players.player3.uid === decoded.uid) {
                    playerName = players.player3.name;
                    playerUid = players.player3.uid;
                  }

                  if (tournamentRoom) {
                    Object.keys(players).map((key) => {
                      if (key !== 'playerList') {
                        admin.database().ref(`tourPlayers/${tournamentId}/${players[key].uid}`).once('value', (playerSnapshot) => {
                          const playerData = playerSnapshot.val() || {};

                          if (decoded.uid === players[key].uid) {
                            admin.database().ref(`tourPlayers/${tournamentId}/${players[key].uid}`).update({
                              bal: parseInt(playerData.bal, 10) + (-10 * betValue),
                              roomId: null,
                            });

                            admin.database().ref(`tourPlayerData/${players[key].uid}/${tournamentId}`).update({
                              bal: parseInt(playerData.bal, 10) + (-10 * betValue),
                              roomId: null,
                            });

                            admin.database().ref(`tourHistory/${players[key].uid}/${tournamentId}`).update({
                              bal: parseInt(playerData.bal, 10) + (-10 * betValue),
                            });
                          } else {
                            admin.database().ref(`tourPlayers/${tournamentId}/${players[key].uid}`).update({
                              roomId: null,
                            });

                            admin.database().ref(`tourPlayerData/${players[key].uid}/${tournamentId}`).update({
                              roomId: null,
                            });
                          }

                          admin.database().ref(`users/${players[key].uid}/joinedRooms/${roomId}`).remove();
                        });
                      }
                      return null;
                    });


                    admin.database().ref(`rooms/${roomId}/globalParams`).update({
                      roomClosed: true,
                      closeReason: { reason: 'leftRoom', playerName, playerUid },
                    });

                    admin.database(roomsDb).ref(`rooms/${roomId}/globalParams`).update({
                      roomClosed: true,
                      closeReason: { reason: 'leftRoom', playerName, playerUid },
                    });

                    admin.database().ref(`rooms/${roomId}`).update({
                      roomClosed: true,
                    });

                  //  admin.database().ref(`roomsPubInf/${roomId}`).update({
                  //    roomClosed: true,
                  //  });

                    admin.database(roomsPublicDb).ref(`roomsPubInf/${roomId}`).update({
                      roomClosed: true,
                    });

                    admin.database().ref(`activeRooms/${roomId}`).remove();

                    setPulesOnClose({ roomId });

                    const promise1 = admin.database().ref(`userAchievements/${players.player1.uid}/maxParties`).once('value');
                    const promise2 = admin.database().ref(`userAchievements/${players.player2.uid}/maxParties`).once('value');
                    const promise3 = admin.database().ref(`userAchievements/${players.player3.uid}/maxParties`).once('value');

                    Promise.all([promise1, promise2, promise3])
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

                        if (party > player1MaxParties) {
                          admin.database().ref(`userAchievements/${players.player1.uid}/maxParties`).set(party);
                        }
                        if (party > player2MaxParties) {
                          admin.database().ref(`userAchievements/${players.player2.uid}/maxParties`).set(party);
                        }
                        if (party > player3MaxParties) {
                          admin.database().ref(`userAchievements/${players.player3.uid}/maxParties`).set(party);
                        }
                      });

                    admin.database().ref(`adminLogs/rooms/${roomId}/${party}`).push({
                      time: Date.now(),
                      roomId,
                      type: 'roomClosed',
                      data: {
                        type: 'leftRoom',
                        player: playerName,
                        playerUid,
                      },
                    });

                    admin.database(adminLogsDb).ref(`adminLogs/rooms/${roomId}/${party}`).push({
                      time: Date.now(),
                      roomId,
                      type: 'roomClosed',
                      data: {
                        type: 'leftRoom',
                        player: playerName,
                        playerUid,
                      },
                    });

                    return res.status(200).send({ data: { status: 'success', tournamentId } });
                  }

                  // Regular room
                  admin.database().ref(`rooms/${roomId}/globalParams`).update({
                    roomClosed: true,
                    closeReason: { reason: 'leftRoom', playerName, playerUid },
                  });

                  admin.database(roomsDb).ref(`rooms/${roomId}/globalParams`).update({
                    roomClosed: true,
                    closeReason: { reason: 'leftRoom', playerName, playerUid },
                  });

                  admin.database().ref(`rooms/${roomId}`).update({
                    roomClosed: true,
                  });

                  admin.database().ref(`activeRooms/${roomId}`).remove();

                  Object.keys(players).map((key) => {
                    if (key !== 'playerList') {
                      admin.database().ref(`users/${players[key].uid}`).once('value', (playerSnapshot) => {
                        const playerData = playerSnapshot.val() || {};

                        if (decoded.uid === players[key].uid) {
                          admin.database().ref(`users/${players[key].uid}/bal`)
                            .transaction(bal => (bal || 0) + (-10 * betValue));

                          admin.database().ref(`userBalHistory/${players[key].uid}`).push({
                            time: Date.now(),
                            type: 'leftRoom',
                            roomId,
                            change: -10 * betValue,
                            old: playerData.bal,
                            new: parseInt(playerData.bal, 10) + (-10 * betValue),
                          });

                          admin.database(userStatsDB).ref(`userBalHistory/${players[key].uid}`).push({
                            time: Date.now(),
                            type: 'leftRoom',
                            roomId,
                            change: -10 * betValue,
                            old: playerData.bal,
                            new: parseInt(playerData.bal, 10) + (-10 * betValue),
                          });
                        }

                        admin.database().ref(`users/${players[key].uid}/joinedRooms/${roomId}`).remove();
                      });
                    }
                    return null;
                  });

                  if (!tournamentRoom) {
                  //  admin.database().ref(`roomsPubInf/${roomId}`).remove();
                  //  admin.database().ref(`roomsPubInfIds/${roomId}`).remove();
                    admin.database(roomsPublicDb).ref(`roomsPubInf/${roomId}`).remove();
                    admin.database(roomsPublicDb).ref(`roomsPubInfIds/${roomId}`).remove();
                  }

                  setPulesOnClose({ roomId });

                  const promise1 = admin.database().ref(`userAchievements/${players.player1.uid}/maxParties`).once('value');
                  const promise2 = admin.database().ref(`userAchievements/${players.player2.uid}/maxParties`).once('value');
                  const promise3 = admin.database().ref(`userAchievements/${players.player3.uid}/maxParties`).once('value');

                  Promise.all([promise1, promise2, promise3])
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

                      if (party > player1MaxParties) {
                        admin.database().ref(`userAchievements/${players.player1.uid}/maxParties`).set(party);
                      }
                      if (party > player2MaxParties) {
                        admin.database().ref(`userAchievements/${players.player2.uid}/maxParties`).set(party);
                      }
                      if (party > player3MaxParties) {
                        admin.database().ref(`userAchievements/${players.player3.uid}/maxParties`).set(party);
                      }
                    });

                  admin.database().ref(`adminLogs/rooms/${roomId}/${party}`).push({
                    time: Date.now(),
                    roomId,
                    type: 'roomClosed',
                    data: {
                      type: 'leftRoom',
                      player: playerName,
                      playerUid,
                    },
                  });

                  admin.database(adminLogsDb).ref(`adminLogs/rooms/${roomId}/${party}`).push({
                    time: Date.now(),
                    roomId,
                    type: 'roomClosed',
                    data: {
                      type: 'leftRoom',
                      player: playerName,
                      playerUid,
                    },
                  });

                  return res.status(200).send({ data: { status: 'success' } });
                } if (tournamentRoom) {
                  Object.keys(players).map((key) => {
                    if (key !== 'playerList') {
                      admin.database().ref(`tourPlayers/${tournamentId}/${players[key].uid}`).update({
                        roomId: null,
                      });

                      admin.database().ref(`tourPlayerData/${players[key].uid}/${tournamentId}`).update({
                        roomId: null,
                      });

                      admin.database().ref(`users/${players[key].uid}/joinedRooms/${roomId}`).remove();
                    }
                    return null;
                  });
                  return res.status(200).send({ data: { status: 'success', tournamentId } });
                }

                admin.database().ref(`users/${decoded.uid}/joinedRooms/${roomId}`).remove();

                return admin.database().ref(`users/${decoded.uid}/activeRoom`).remove().then(() => {
                  return res.status(200).send({ data: { status: 'success' } });
                }).catch((err) => {
                  console.log(err);
                  return res.status(200).send({ data: { status: 'success' } });
                });
              }

              if ((players.player1 && (!players.player2 || (players.player2 && !players.player2.uid)) && (!players.player3 || (players.player3 && !players.player3.uid)))
                || ((!players.player1 || (players.player1 && !players.player1.uid)) && players.player2 && (!players.player3 || (players.player3 && !players.player3.uid)))
                || ((!players.player1 || (players.player1 && !players.player1.uid)) && (!players.player2 || (players.player2 && !players.player2.uid)) && players.player3)) {
                // Last player leaves room, close the room

                console.log('Last player leaves room, close the room');

                if (tournamentRoom) {
                  // Tournament room
                  Object.keys(players).map((key) => {
                    if (key !== 'playerList') {
                      admin.database().ref(`tourPlayers/${tournamentId}/${players[key].uid}`).update({
                        roomId: null,
                      });

                      admin.database().ref(`tourPlayerData/${players[key].uid}/${tournamentId}`).update({
                        roomId: null,
                      });

                      admin.database().ref(`users/${players[key].uid}/joinedRooms/${roomId}`).remove();
                    }
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

                //  admin.database().ref(`roomsPubInf/${roomId}`).update({
                //    roomClosed: true,
                //  });

                  admin.database(roomsPublicDb).ref(`roomsPubInf/${roomId}`).update({
                    roomClosed: true,
                  });

                  admin.database().ref(`adminLogs/roomIds/${roomId}`).remove();

                  admin.database().ref(`adminLogs/playerRooms/${decoded.uid}/${roomId}`).remove();

                  admin.database(adminLogsDb).ref(`adminLogs/roomIds/${roomId}`).remove();

                  admin.database(adminLogsDb).ref(`adminLogs/playerRooms/${decoded.uid}/${roomId}`).remove();


                  if (!tournamentRoom) {
                  //  admin.database().ref(`roomsPubInf/${roomId}`).remove();
                  //  admin.database().ref(`roomsPubInfIds/${roomId}`).remove();
                    admin.database(roomsPublicDb).ref(`roomsPubInf/${roomId}`).remove();
                    admin.database(roomsPublicDb).ref(`roomsPubInfIds/${roomId}`).remove();
                  }
                }

                admin.database().ref(`users/${decoded.uid}/joinedRooms/${roomId}`).remove();

                return res.status(200).send({ data: { status: 'success' } });
              }

              // Remove player from room after leaving (not started and not last player)
              if (tournamentRoom) {
                // Tournament room

                admin.database().ref(`tourPlayers/${tournamentId}/${decoded.uid}`).update({
                  roomId: null,
                }).then(() => {
                  Object.keys(players).map((key) => {
                    if (key !== 'playerList') {
                      admin.database().ref(`tourPlayers/${tournamentId}/${players[key].uid}`).update({
                        roomId: null,
                      });

                      admin.database().ref(`tourPlayerData/${players[key].uid}/${tournamentId}`).update({
                        roomId: null,
                      });

                      admin.database().ref(`users/${players[key].uid}/joinedRooms/${roomId}`).remove();
                    }

                    return null;
                  });

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

                  //  admin.database().ref(`roomsPubInf/${roomId}`).update({
                  //    roomClosed: true,
                  //  });

                    admin.database(roomsPublicDb).ref(`roomsPubInf/${roomId}`).update({
                      roomClosed: true,
                    });
                  }

                  return res.status(200).send({ data: { status: 'success' } });
                })
                  .catch(err => res.status(200).send({ data: { status: 'error', message: err } }));
              } else {
                Object.keys(players).map((key) => {
                  if (decoded.uid === players[key].uid) {
                    admin.database().ref(`users/${decoded.uid}/joinedRooms/${roomId}`).remove();
                    admin.database().ref(`rooms/${roomId}/players/${key}`).remove();
                    admin.database().ref(`rooms/${roomId}/playersList/${key}`).remove();
                    admin.database().ref(`rooms/${roomId}/playersList/playerList/${key}`).remove();

                    admin.database(roomsDb).ref(`rooms/${roomId}/players/${key}`).remove();
                    admin.database(roomsDb).ref(`rooms/${roomId}/playersList/${key}`).remove();
                    admin.database(roomsDb).ref(`rooms/${roomId}/playersList/playerList/${key}`).remove();

                  //  admin.database().ref(`roomsPubInf/${roomId}/playersList/${key}`).remove();
                  //  admin.database().ref(`roomsPubInf/${roomId}/playersList/playerList/${key}`).remove();

                    admin.database(roomsPublicDb).ref(`roomsPubInf/${roomId}/playersList/${key}`).remove();
                    admin.database(roomsPublicDb).ref(`roomsPubInf/${roomId}/playersList/playerList/${key}`).remove();

                    admin.database().ref(`adminLogs/rooms/${roomId}/${party}`).push({
                      time: Date.now(),
                      roomId,
                      type: 'playerLeft',
                      data: {
                        playerUid: decoded.uid,
                      },
                    });
                  }
                  return null;
                });

                return res.status(200).send({ data: { status: 'success' } });
              }
          //  });
          } else {
            return res.status(200).send({ data: { status: 'error', message: 'notInRoom' } });
          }
        })
          .catch(err => res.status(200).send({ data: { status: 'error', message: err } }));
      })
      .catch(err => res.status(200).send({ data: { status: 'error', message: err } }));

    } else {
      console.log('no auth');
      console.log(req.body.data);

      return res.status(200).send({ data: { status: 'error', message: 'no auth' } });
    }
  });
};

module.exports = leaveRoom;
