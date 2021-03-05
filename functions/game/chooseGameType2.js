const cors = require('cors')({ origin: true });
const { admin, adminLogsDb, roomsPublicDb, roomsDb } = require('../admin');
const dealCards = require('./dealCards');
const setPulesOnClose = require('./setPulesOnClose');

const cardOrder = ['♥-9', '♥-K', '♥-10', '♥-A', '♠︎-9', '♠︎-K', '♠︎-10', '♠︎-A', '♣︎-9', '♣︎-K', '♣︎-10', '♣︎-A', '♦︎-7', '♦︎-8', '♦︎-9', '♦︎-K', '♦︎-10', '♦︎-A', '♦︎-J', '♥-J', '♠︎-J', '♣︎-J', '♦︎-Q', '♥-Q', '♠︎-Q', '♣︎-Q'];

const chooseGameType2 = (req, res) => {
//  const chooseGameTypeState = require('./chooseGameTypeState');

  cors(req, res, () => {
    if (!req.body || !req.body.data) {
      return res.status(200).send({ data: 'no req body data' });
    }

    const {
      roomId,
      selectedType,
      init,
    } = req.body.data;

    if (init) {
      admin.database().ref(`rooms/${roomId}`).update({
        init: Date.now(),
      });

      return res.status(200).send({ data: 'initialized' });
    }

    if (req.get('Authorization')) {
    const tokenId = req.get('Authorization').split('Bearer ')[1];

    admin.auth().verifyIdToken(tokenId)
      .then((decoded) => {

        if (!decoded.uid) {
          return res.status(200).send({ data: 'Error choosing game type (no auth token)' });
        }

        const promise1 = admin.database(roomsDb).ref(`rooms/${roomId}/globalParams`).once('value');
      //  const promise2 = admin.database().ref(`users/${decoded.uid.toString()}/name`).once('value');
        const promise3 = admin.database(roomsDb).ref(`rooms/${roomId}/curRnd/cardsOnTable`).once('value');
        const promise4 = admin.database(roomsDb).ref(`rooms/${roomId}/playersList/playerList/${decoded.uid.toString()}`).once('value');
      //  const promise5 = admin.database().ref(`rooms/${roomId}/players/player1/uid`).once('value');
      //  const promise6 = admin.database().ref(`rooms/${roomId}/players/player2/uid`).once('value');
      //  const promise7 = admin.database().ref(`rooms/${roomId}/players/player3/uid`).once('value');
        const promise8 = admin.database(roomsDb).ref('gameSettings').once('value');
        const promise9 = admin.database(roomsDb).ref(`rooms/${roomId}/curRnd/firstToGo`).once('value');
        const promise10 = admin.database(roomsDb).ref(`rooms/${roomId}/players`).once('value');


        Promise.all([promise1, promise3, promise4, promise8, promise9, promise10])
          .then((promiseRes2) => {
            let globalParams;
            let cardsOnTable;
            let userPos;
            let player1Uid;
            let player2Uid;
            let player3Uid;
            let gameSettings;
            let playerName = '';
            let firstToGo;
            let players;

            promiseRes2.map((res2, index) => {
              if (res2.key === 'globalParams') {
                globalParams = res2.val();
            //  } else if (res2.key === 'name') {
            //    playerName = res2.val() || '';
              } else if (res2.key === 'cardsOnTable') {
                cardsOnTable = res2.val();
              } else if (res2.key === decoded.uid) {
                userPos = res2.val();
            //  } else if (res2.key === 'uid' && index === 4) {
              //  player1Uid = res2.val() ? res2.val().toString() : '';
            //  } else if (res2.key === 'uid' && index === 5) {
              //  player2Uid = res2.val() ? res2.val().toString() : '';
            //  } else if (res2.key === 'uid' && index === 6) {
              //  player3Uid = res2.val() ? res2.val().toString() : '';
              } else if (res2.key === 'gameSettings') {
                gameSettings = res2.val();
              } else if (res2.key === 'firstToGo') {
                firstToGo = res2.val();
              } else if (res2.key === 'players') {
                players = res2.val() || {};
              }
            });

            if (players.player1) {
              player1Uid = players.player1.uid.toString();
            }
            if (players.player2) {
              player2Uid = players.player2.uid.toString();
            }
            if (players.player3) {
              player3Uid = players.player3.uid.toString();
            }

            if (player1Uid === decoded.uid) {
              playerName = players.player1.name;
            } else if (player2Uid === decoded.uid) {
              playerName = players.player2.name;
            } else if (player3Uid === decoded.uid) {
              playerName = players.player3.name;
            }

            let speed = 20;

            if (gameSettings && globalParams && globalParams.fastGame) {
              speed = gameSettings.fastSpeed || 15;
            } else {
              speed = gameSettings.normalSpeed || 20;
            }

          //  admin.database().ref(`rooms/${roomId}`).update({
          //    nextTimestamp: (Date.now() + 1000 * speed) + 500,
          //  });

          //  admin.database().ref(`rooms/${roomId}/nextTimestamp`).set((Date.now() + 1000 * speed) + 500);

            const talkingUser = globalParams.talking.toString();
            const {
              gameType,
              lastRoundPlayer,
              lastRound,
              tournamentRoom,
              tournamentId,
              party,
              smallGame,
              currentHand,
            } = globalParams;

            if (decoded.uid && talkingUser === decoded.uid.toString()) {
            //  admin.database().ref(`rooms/${roomId}/nextTimestamp`).set((Date.now() + 1000 * speed) + 500);

              if (selectedType === 'parasta') {
                //* ************ PARASTA ***************//

                const tableCards = cardsOnTable || {};

              //  admin.database().ref(`rooms/${roomId}/players/${userPos}/cards`)
              //    .once('value').then((cardsSnapshot) => {
                    const playerCards = players[userPos].cards;

                    if (tableCards && tableCards.cards) {
                      if (playerCards.length && playerCards.length <= 8) {
                        const newCards = playerCards.concat(tableCards.cards);

                        newCards.sort((a, b) => cardOrder.indexOf(b) - cardOrder.indexOf(a));

                        admin.database(roomsDb).ref(`rooms/${roomId}/globalParams/gameState`).transaction((gameState) => {
                          if (gameState && gameState !== 'choose') {
                            return; // Abort the transaction.
                          }
                          return 'burry';
                        })
                          .then((result) => {
                            if (!result.committed) {
                              return res.status(200).send('Failed to choose');
                            }

                            admin.database().ref(`rooms/${roomId}/globalParams/gameState`).set('burry');

                            admin.database().ref(`rooms/${roomId}/nextTimestamp`).set((Date.now() + 1000 * speed) + 500);

                            admin.database().ref(`rooms/${roomId}/players/${userPos}`).update({
                              cards: newCards,
                            });

                            admin.database(roomsDb).ref(`rooms/${roomId}/nextTimestamp`).set((Date.now() + 1000 * speed) + 500);

                            admin.database(roomsDb).ref(`rooms/${roomId}/players/${userPos}`).update({
                              cards: newCards,
                            });

                            admin.database(adminLogsDb).ref(`adminLogs/rooms/${roomId}/${party}`).push({
                              time: Date.now(),
                              roomId,
                              type: 'selectType',
                              data: {
                                type: 'parasta',
                                player: playerName,
                                playerUid: decoded.uid,
                              },
                            });


                            if (roomId) {
                              admin.database().ref(`chat/${roomId}/messages`).push({
                                roomId,
                                message: `${playerName} paņēma galdu`,
                                userUid: 'game',
                                time: Date.now(),
                              });
                            }

                            admin.database().ref(`rooms/${roomId}/globalParams/gameResult`).remove();

                            admin.database().ref(`rooms/${roomId}/playersList/${userPos}`).update({
                              largePlayer: true,
                            });

                            admin.database().ref(`rooms/${roomId}/curRnd`).update({
                              type: 'parasta',
                              largePlayer: userPos,
                              currentTurn: userPos,
                            });

                            admin.database(roomsDb).ref(`rooms/${roomId}/globalParams/gameResult`).remove();

                            admin.database(roomsDb).ref(`rooms/${roomId}/playersList/${userPos}`).update({
                              largePlayer: true,
                            });

                            admin.database(roomsDb).ref(`rooms/${roomId}/curRnd`).update({
                              type: 'parasta',
                              largePlayer: userPos,
                              currentTurn: userPos,
                            });

                            return res.status(200).send({ data: 'success' });
                          });
                      } else {
                        return res.status(200).send({ data: 'err: cards not dealt' });
                      }
                    } else {
                      return res.status(200).send({ data: 'err: cards not dealt' });
                    }
                //  });
              } else if (selectedType === 'zole') {
                //* ************ ZOLE ***************//

                admin.database(roomsDb).ref(`rooms/${roomId}/globalParams/gameState`).transaction((gameState) => {
                  if (gameState && gameState !== 'choose') {
                    return; // Abort the transaction.
                  }
                  return 'play';
                })
                  .then((result) => {
                    if (!result.committed) {
                      return res.status(200).send('Failed to choose');
                    }

                    admin.database().ref(`rooms/${roomId}/globalParams/gameState`).set('play');

                    admin.database().ref(`rooms/${roomId}/nextTimestamp`).set((Date.now() + 1000 * speed) + 500);

                    admin.database().ref(`rooms/${roomId}/curRnd`).update({
                      type: 'zole',
                      largePlayer: userPos,
                      currentTurn: firstToGo,
                    });

                    admin.database().ref(`rooms/${roomId}/playersList/${userPos}`).update({
                      largePlayer: true,
                    });

                    admin.database().ref(`rooms/${roomId}/globalParams/gameResult`).remove();
                    admin.database().ref(`rooms/${roomId}/globalParams/currentHand`).set(1);

                    admin.database(roomsDb).ref(`rooms/${roomId}/nextTimestamp`).set((Date.now() + 1000 * speed) + 500);

                      admin.database(roomsDb).ref(`rooms/${roomId}/curRnd`).update({
                        type: 'zole',
                        largePlayer: userPos,
                        currentTurn: firstToGo,
                      });

                      admin.database(roomsDb).ref(`rooms/${roomId}/playersList/${userPos}`).update({
                        largePlayer: true,
                      });

                      admin.database(roomsDb).ref(`rooms/${roomId}/globalParams/gameResult`).remove();
                      admin.database(roomsDb).ref(`rooms/${roomId}/globalParams/currentHand`).set(1);

                    admin.database(adminLogsDb).ref(`adminLogs/rooms/${roomId}/${party}`).push({
                      time: Date.now(),
                      roomId,
                      type: 'selectType',
                      data: {
                        type: 'zole',
                        player: playerName,
                        playerUid: decoded.uid,
                      },
                    });


                    if (roomId) {
                      admin.database().ref(`chat/${roomId}/messages`).push({
                        roomId,
                        message: `${playerName} paņēma zoli`,
                        userUid: 'game',
                        time: Date.now(),
                      });
                    }

                    return res.status(200).send({ data: 'success' });
                  })
                  .catch((err) => {
                    return res.status(200).send({ data: 'err: cards not dealt' });
                  });
              } else if (smallGame && selectedType === 'maza') {
                //* ************ MAZĀ ZOLE ***************//

                admin.database(roomsDb).ref(`rooms/${roomId}/globalParams/gameState`).transaction((gameState) => {
                  if (gameState && gameState !== 'choose') {
                    return; // Abort the transaction.
                  }
                  return 'play';
                })
                  .then((result) => {
                    if (!result.committed) {
                      return res.status(200).send('Failed to choose');
                    }

                    admin.database().ref(`rooms/${roomId}/globalParams/gameState`).set('play');

                    admin.database().ref(`rooms/${roomId}/nextTimestamp`).set((Date.now() + 1000 * speed) + 500);

                    admin.database().ref(`rooms/${roomId}/curRnd`).update({
                      type: 'maza',
                      largePlayer: userPos,
                      currentTurn: firstToGo,
                    });

                    admin.database().ref(`rooms/${roomId}/playersList/${userPos}`).update({
                      largePlayer: true,
                    });

                    admin.database().ref(`rooms/${roomId}/globalParams/gameResult`).remove();
                    admin.database().ref(`rooms/${roomId}/globalParams/currentHand`).set(1);

                    admin.database(roomsDb).ref(`rooms/${roomId}/nextTimestamp`).set((Date.now() + 1000 * speed) + 500);

                    admin.database(roomsDb).ref(`rooms/${roomId}/curRnd`).update({
                      type: 'maza',
                      largePlayer: userPos,
                      currentTurn: firstToGo,
                    });

                    admin.database(roomsDb).ref(`rooms/${roomId}/playersList/${userPos}`).update({
                      largePlayer: true,
                    });

                    admin.database(roomsDb).ref(`rooms/${roomId}/globalParams/gameResult`).remove();
                    admin.database(roomsDb).ref(`rooms/${roomId}/globalParams/currentHand`).set(1);

                    admin.database(adminLogsDb).ref(`adminLogs/rooms/${roomId}/${party}`).push({
                      time: Date.now(),
                      roomId,
                      type: 'selectType',
                      data: {
                        type: 'maza',
                        player: playerName,
                        playerUid: decoded.uid,
                      },
                    });

                    if (roomId) {
                      admin.database().ref(`chat/${roomId}/messages`).push({
                        roomId,
                        message: `${playerName} paņēma mazo zoli`,
                        userUid: 'game',
                        time: Date.now(),
                      });
                    }

                    return res.status(200).send({ data: 'success' });
                  })
                  .catch((err) => {
                    return res.status(200).send({ data: 'err: cards not dealt' });
                  });
              } else if (selectedType === 'garam') {
                //* ************ GARĀM ***************//
                if ((userPos === 'player1' && firstToGo === 'player2') || (userPos === 'player2' && firstToGo === 'player3') || (userPos === 'player3' && firstToGo === 'player1')) {
                  //* ************ Pēdējais palaiž garām ***************//

                  if (gameType === 'G') {

                    admin.database().ref(`rooms/${roomId}/nextTimestamp`).set((Date.now() + 1000 * speed) + 500);

                    admin.database().ref(`rooms/${roomId}/curRnd`).update({
                      type: 'galdins',
                      largePlayer: null,
                      currentTurn: firstToGo,
                    });

                    admin.database().ref(`rooms/${roomId}/globalParams`).update({
                      gameState: 'play',
                      gameResult: null,
                      currentHand: 1,
                    });

                    admin.database(roomsDb).ref(`rooms/${roomId}/nextTimestamp`).set((Date.now() + 1000 * speed) + 500);

                    admin.database(roomsDb).ref(`rooms/${roomId}/curRnd`).update({
                      type: 'galdins',
                      largePlayer: null,
                      currentTurn: firstToGo,
                    });

                    admin.database(roomsDb).ref(`rooms/${roomId}/globalParams`).update({
                      gameState: 'play',
                      gameResult: null,
                      currentHand: 1,
                    });

                    admin.database(adminLogsDb).ref(`adminLogs/rooms/${roomId}/${party}`).push({
                      time: Date.now(),
                      roomId,
                      type: 'selectType',
                      data: {
                        type: 'garam',
                        action: 'galdins',
                        player: playerName,
                        playerUid: decoded.uid,
                      },
                    });

                    if (roomId) {
                      admin.database().ref(`chat/${roomId}/messages`).push({
                        roomId,
                        message: `${playerName} palaida garām, sākas galdiņš`,
                        userUid: 'game',
                        time: Date.now(),
                      });
                    }

                    return res.status(200).send({ data: 'success' });
                  }

                  if (lastRound) {
                    admin.database().ref(`users/${lastRoundPlayer}/name`).once('value', (snapshot) => {
                      const lastPlayerName = snapshot.val() || '';

                      admin.database(roomsDb).ref(`rooms/${roomId}/globalParams/roomClosed`).transaction((roomClosedTransaction) => {
                        if (roomClosedTransaction) {
                          return; // Abort the transaction.
                        }
                        return true;
                      })
                        .then((result) => {
                          if (!result.committed) {
                            return res.status(200).send({ data: 'Failed to select' });
                          }

                          admin.database().ref(`rooms/${roomId}/globalParams/roomClosed`).set(true);

                          admin.database().ref(`rooms/${roomId}/globalParams`).update({
                            closeReason: { reason: 'lastRound', playerName: lastPlayerName, playerUid: lastRoundPlayer },
                          });

                          admin.database(roomsDb).ref(`rooms/${roomId}/globalParams`).update({
                            closeReason: { reason: 'lastRound', playerName: lastPlayerName, playerUid: lastRoundPlayer },
                          });

                          admin.database().ref(`activeRooms/${roomId}`).remove();

                          setPulesOnClose({ roomId });

                          admin.database(adminLogsDb).ref(`adminLogs/rooms/${roomId}/${party}`).push({
                            time: Date.now(),
                            roomId,
                            type: 'roomClosed',
                            data: {
                              type: 'lastRound',
                              player: lastPlayerName,
                              playerUid: lastRoundPlayer,
                            },
                          });


                          if (roomId) {
                            admin.database().ref(`chat/${roomId}/messages`).push({
                              roomId,
                              message: `${playerName} palaida garām, istaba tiks aizvērta jo ${lastPlayerName} spēlēja pēdējo partiju`,
                              userUid: 'game',
                              time: Date.now(),
                            });
                          }

                          admin.database().ref(`rooms/${roomId}`).update({
                            roomClosed: true,
                          });

                          admin.database(roomsDb).ref(`rooms/${roomId}/players`).once('value', (playersSnap) => {
                            const players = playersSnap.val() || {};

                            if (tournamentRoom) {
                              Object.keys(players).map((key2) => {
                                admin.database().ref(`tourPlayers/${tournamentId}/${players[key2].uid}`).update({
                                  roomId: null,
                                });

                                admin.database().ref(`tourPlayerData/${players[key2].uid}/${tournamentId}`).update({
                                  roomId: null,
                                });
                                return null;
                              });
                            } else {
                              admin.database(roomsPublicDb).ref(`roomsPubInf/${roomId}/globalParams`).update({
                                roomClosed: true,
                              });

                              admin.database(roomsPublicDb).ref(`roomsPubInf/${roomId}`).update({
                                roomClosed: true,
                              });
                            }

                            Object.keys(players).map((key3) => {
                              admin.database().ref(`users/${players[key3].uid}/joinedRooms/${roomId}`).remove();
                              return null;
                            });
                          });

                          return res.status(200).send({ data: 'success' });
                        });
                    });
                  } else {
                    const curPos = firstToGo;
                    let nextPos;
                    let nextUserUid;
                    if (curPos === 'player1') {
                      nextPos = 'player2';
                      nextUserUid = player2Uid;
                    } else if (curPos === 'player2') {
                      nextPos = 'player3';
                      nextUserUid = player3Uid;
                    } else {
                      nextPos = 'player1';
                      nextUserUid = player1Uid;
                    }

                    const winStatus = {
                      winner: '',
                      largePlayer: '',
                      type: 'pass',
                      scoreType: '',
                      largePoints: null,
                      largeTricks: null,
                    };

                    admin.database(roomsDb).ref(`rooms/${roomId}/globalParams`).transaction((globalPar) => {
                      if (globalPar && globalPar.gameState === 'results') {
                        console.log('already set to results');
                        return; // Abort the transaction.
                      }

                      if (globalPar && (globalPar.gameState === 'burry' || globalPar.gameState === 'play')) {
                        console.log('already set to play or burry');
                        return; // Abort the transaction.
                      }

                      if (globalPar && globalPar.talking !== decoded.uid) {
                        console.log('not users turn talking');
                        return; // Abort the transaction.
                      }

                      let newGlobalParams;
                      if (globalPar) {
                        newGlobalParams = {
                          ...globalPar,
                          gameResult: winStatus,
                          gameState: 'results',
                          talking: nextUserUid.toString(),
                          currentHand: 1,
                        };
                      } else {
                        newGlobalParams = globalPar;
                      }
                      return newGlobalParams;
                    })
                      .then((result) => {
                        if (!result.committed) {
                          return res.status(200).send({ data: 'Failed to select' });
                        }

                        if (!result.snapshot.val()) {
                          return res.status(200).send({ data: 'Failed to select' });
                        }

                        admin.database().ref(`rooms/${roomId}/globalParams`).set(result.snapshot.val())

                        admin.database().ref(`rooms/${roomId}/curRnd`).update({
                          firstToGo: nextPos,
                          currentTurn: nextPos,
                          cardsOnTable: null,
                          largePlayer: null,
                          type: null,
                        });

                        admin.database().ref(`rooms/${roomId}/cardsOnTable`).remove();

                        admin.database().ref(`rooms/${roomId}/beatCardPoints`).set({
                            player1: 0,
                            player2: 0,
                            player3: 0,
                            tricks: {
                              player1: 0,
                              player2: 0,
                              player3: 0,
                            },
                        });



                        admin.database(roomsDb).ref(`rooms/${roomId}/curRnd`).update({
                          firstToGo: nextPos,
                          currentTurn: nextPos,
                          cardsOnTable: null,
                          largePlayer: null,
                          type: null,
                        });

                        admin.database(roomsDb).ref(`rooms/${roomId}/cardsOnTable`).remove();

                        admin.database(roomsDb).ref(`rooms/${roomId}/beatCardPoints`).set({
                            player1: 0,
                            player2: 0,
                            player3: 0,
                            tricks: {
                              player1: 0,
                              player2: 0,
                              player3: 0,
                            },
                        });



                        const key = admin.database().ref(`rooms/${roomId}/points/rounds`).push({
                          player1: 0,
                          player2: 0,
                          player3: 0,
                          pule: 'P',
                        }).getKey();

                        admin.database(roomsDb).ref(`rooms/${roomId}/points/rounds/${key}`).set({
                          player1: 0,
                          player2: 0,
                          player3: 0,
                          pule: 'P',
                        })

                        const key2 = admin.database().ref(`rooms/${roomId}/points/pules/common`).push({
                          roundId: key,
                          status: 'active',
                        }).getKey();

                        admin.database(roomsDb).ref(`rooms/${roomId}/points/pules/common/${key2}`).set({
                          roundId: key,
                          status: 'active',
                        })

                        admin.database().ref(`rooms/${roomId}/nextTimestamp`).set((Date.now() + 1000 * 8));

                        admin.database(roomsDb).ref(`rooms/${roomId}/nextTimestamp`).set((Date.now() + 1000 * 8));

                        admin.database(adminLogsDb).ref(`adminLogs/rooms/${roomId}/${party}`).push({
                          time: Date.now(),
                          roomId,
                          type: 'selectType',
                          data: {
                            type: 'garam',
                            action: 'nextRound',
                            player: playerName,
                            playerUid: decoded.uid,
                          },
                        });


                        if (roomId) {
                          admin.database().ref(`chat/${roomId}/messages`).push({
                            roomId,
                            message: `${playerName} palaida garām, sākas nākošā partija`,
                            userUid: 'game',
                            time: Date.now(),
                          });
                        }

                        admin.database().ref(`rooms/${roomId}/globalParams/party`)
                          .transaction(partyy => ((partyy || 1) + 1));

                        admin.database(roomsDb).ref(`rooms/${roomId}/globalParams/party`)
                          .transaction(partyy => ((partyy || 1) + 1));

                        dealCards(roomId, party);

                        return res.status(200).send({ data: 'success' });
                      });
                  }

                  //  return res.status(200).send({ data: 'success' });
                  //  } else {

                  //* ************ Ne pēdējais palaiž garām ***************//
                } else if (currentHand < 3) {
                  let nextUserUid;
                  let nextTurn;
                  if (userPos === 'player1') {
                    nextUserUid = player2Uid;
                    nextTurn = 'player2';
                  }
                  if (userPos === 'player2') {
                    nextUserUid = player3Uid;
                    nextTurn = 'player3';
                  }
                  if (userPos === 'player3') {
                    nextUserUid = player1Uid;
                    nextTurn = 'player1';
                  }

                  //  admin.database().ref(`rooms/${roomId}/playersList/${nextPos}/uid`).once('value', (uidSnap) => {
                  //    const nextUserUid = uidSnap.val() || '';

                  admin.database(roomsDb).ref(`rooms/${roomId}/globalParams`).transaction((globalPar) => {
                    if (globalPar && globalPar.gameState === 'results') {
                      console.log('already set to results #2');
                      return; // Abort the transaction.
                    }

                    if (globalPar && (globalPar.gameState === 'burry' || globalPar.gameState === 'play')) {
                      console.log('already set to play or burry #2');
                      return; // Abort the transaction.
                    }

                    if (globalPar && globalPar.talking !== decoded.uid) {
                      console.log('not users turn talking #2');
                      return; // Abort the transaction.
                    }

                    let newGlobalParams;
                    if (globalPar) {
                      newGlobalParams = {
                        ...globalPar,
                        gameResult: null,
                        //  gameState: 'results',
                        talking: nextUserUid.toString(),
                        currentHand: (currentHand || 1) + 1,
                        //  currentTurn: nextTurn || globalPar.currentTurn,
                      };
                    } else {
                      newGlobalParams = globalPar;
                    }

                    return newGlobalParams;
                  })
                    .then((result) => {
                      if (!result.committed) {
                        return res.status(200).send({ data: 'Failed to select' });
                      }

                      if (!result.snapshot.val()) {
                        return res.status(200).send({ data: 'Failed to select' });
                      }

                      admin.database().ref(`rooms/${roomId}/globalParams`).set(result.snapshot.val());

                      //  admin.database().ref(`rooms/${roomId}/globalParams`).update({
                      //    talking: nextUserUid.toString(),
                      //    currentHand: (currentHand || 1) + 1,
                      //    gameResult: null,
                      //  });

                      admin.database().ref(`rooms/${roomId}/nextTimestamp`).set((Date.now() + 1000 * speed) + 500);

                      admin.database().ref(`rooms/${roomId}/curRnd/currentTurn`).set(nextTurn);

                      admin.database(roomsDb).ref(`rooms/${roomId}/nextTimestamp`).set((Date.now() + 1000 * speed) + 500);

                      admin.database(roomsDb).ref(`rooms/${roomId}/curRnd/currentTurn`).set(nextTurn);

                  /*    admin.database().ref(`adminLogs/rooms/${roomId}/${party}`).push({
                        time: Date.now(),
                        roomId,
                        type: 'selectType',
                        data: {
                          type: 'garam',
                          action: 'next',
                          player: playerName,
                          playerUid: decoded.uid,
                        },
                      });  */

                      admin.database(adminLogsDb).ref(`adminLogs/rooms/${roomId}/${party}`).push({
                        time: Date.now(),
                        roomId,
                        type: 'selectType',
                        data: {
                          type: 'garam',
                          action: 'next',
                          player: playerName,
                          playerUid: decoded.uid,
                        },
                      });


                      if (roomId) {
                        admin.database().ref(`chat/${roomId}/messages`).push({
                          roomId,
                          message: `${playerName} palaida garām`,
                          userUid: 'game',
                          time: Date.now(),
                        });
                      }

                      return res.status(200).send({ data: 'success' });
                    });
                } else {
                  return res.status(200).send({ data: 'Failed to select' });
                }
                //  }
              } else {
                return res.status(200).send({ data: 'Failed to select' });
              }
            } else {
              return res.status(200).send({ data: 'not talking' });
            }
          });
      })
      .catch((err) => {
        console.log(err);
        return res.status(200).send({ data: { status: 'error', message: err } });
      });
    //  });

  } else {
    console.log('no auth');
    console.log(req.body.data);

    return res.status(200).send({ data: { status: 'error', message: 'no auth' } });
  }
  });
};

module.exports = chooseGameType2;
