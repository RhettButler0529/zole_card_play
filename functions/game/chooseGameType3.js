const cors = require('cors')({ origin: true });
const { admin } = require('../admin');
const dealCards = require('./dealCards');
const setPulesOnClose = require('./setPulesOnClose');

const cardOrder = ['♥-9', '♥-K', '♥-10', '♥-A', '♠︎-9', '♠︎-K', '♠︎-10', '♠︎-A', '♣︎-9', '♣︎-K', '♣︎-10', '♣︎-A', '♦︎-7', '♦︎-8', '♦︎-9', '♦︎-K', '♦︎-10', '♦︎-A', '♦︎-J', '♥-J', '♠︎-J', '♣︎-J', '♦︎-Q', '♥-Q', '♠︎-Q', '♣︎-Q'];

const log = require('../logs/log');

const chooseGameType3 = (req, res) => {
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

    //  chooseGameTypeState.isIdle(roomId).then(() => {
    //    const processRequest = () => new Promise((resolve, reject) => {
    log(roomId, `chooseGameType: Head, selectedType: ${selectedType}`);

    if (init) {
      admin.database().ref(`rooms/${roomId}`).update({
        init: Date.now(),
      });

      log(roomId, 'chooseGameType: init');
      return res.status(200).send({ data: 'initialized' });
    }

    const tokenId = req.get('Authorization').split('Bearer ')[1];

    admin.auth().verifyIdToken(tokenId)
      .then((decoded) => {
        //  log(roomId, `chooseGameType: decoded.uid: ${decoded.uid}`);

        if (!decoded.uid) {
          return res.status(200).send({ data: 'Error choosing game type (no auth token)' });
        }

        const promise1 = admin.database().ref(`rooms/${roomId}/globalParams`).once('value');
        const promise2 = admin.database().ref(`users/${decoded.uid.toString()}/name`).once('value');
        const promise3 = admin.database().ref(`rooms/${roomId}/curRnd`).once('value');
        const promise4 = admin.database().ref(`rooms/${roomId}/playersList/playerList/${decoded.uid.toString()}`).once('value');
        const promise5 = admin.database().ref(`rooms/${roomId}/players/player1/uid`).once('value');
        const promise6 = admin.database().ref(`rooms/${roomId}/players/player2/uid`).once('value');
        const promise7 = admin.database().ref(`rooms/${roomId}/players/player3/uid`).once('value');
        const promise8 = admin.database().ref('gameSettings').once('value');


        Promise.all([promise1, promise2, promise3, promise4, promise5, promise6, promise7, promise8])
          .then((promiseRes2) => {
            let globalParams;
            let curRnd;
            let userPos;
            let player1Uid;
            let player2Uid;
            let player3Uid;
            let gameSettings;
            let playerName;

            promiseRes2.map((res2, index) => {
              if (res2.key === 'globalParams') {
                globalParams = res2.val();
              } else if (res2.key === 'name') {
                playerName = res2.val() || '';
              } else if (res2.key === 'curRnd') {
                curRnd = res2.val();
              } else if (res2.key === decoded.uid) {
                userPos = res2.val();
              } else if (res2.key === 'uid' && index === 4) {
                player1Uid = res2.val() ? res2.val().toString() : '';
              } else if (res2.key === 'uid' && index === 5) {
                player2Uid = res2.val() ? res2.val().toString() : '';
              } else if (res2.key === 'uid' && index === 6) {
                player3Uid = res2.val() ? res2.val().toString() : '';
              } else if (res2.key === 'gameSettings') {
                gameSettings = res2.val();
              }
            });

            //  log(roomId, `chooseGameType: playerName: ${playerName}, userPos: ${userPos}, player1Uid: ${player1Uid}, player2Uid: ${player2Uid}, player3Uid: ${player3Uid}`);

            let speed = 20;

            if (gameSettings && globalParams && globalParams.fastGame) {
              speed = gameSettings.fastSpeed || 15;
            } else {
              speed = gameSettings.normalSpeed || 20;
            }

            admin.database().ref(`rooms/${roomId}`).update({
              nextTimestamp: (Date.now() + 1000 * speed) + 500,
            });

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
              //  log(roomId, "chooseGameType: decoded.uid && talkingUser === decoded.uid.toString()");

              admin.database().ref(`rooms/${roomId}`).update({
                nextTimestamp: (Date.now() + 1000 * speed) + 500,
              });


              if (selectedType === 'parasta') {
                //* ************ PARASTA ***************//

                const tableCards = curRnd.cardsOnTable || [];

                admin.database().ref(`rooms/${roomId}/players/${userPos}/cards`)
                  .once('value').then((cardsSnapshot) => {
                    const playerCards = cardsSnapshot.val() || [];

                    if (tableCards && tableCards.cards) {
                      if (playerCards.length && playerCards.length <= 8) {
                        //  log(roomId, `chooseGameType: tableCards: ${tableCards.cards.toString()}`);
                        //  log(roomId, `chooseGameType: playerCards: ${playerCards.toString()}`);

                        const newCards = playerCards.concat(tableCards.cards);

                        newCards.sort((a, b) => cardOrder.indexOf(b) - cardOrder.indexOf(a));

                        log(roomId, `chooseGameType: newCards: ${newCards.toString()}`);

                        admin.database().ref(`rooms/${roomId}/globalParams/gameState`).transaction((gameState) => {
                          if (gameState && gameState !== 'choose') {
                            log(roomId, 'chooseGameType: already chose game state');
                            return; // Abort the transaction.
                          }
                          return 'burry';
                        })
                          .then((result) => {
                            if (!result.committed) {
                              log(roomId, 'chooseGameType: Failed to choose');
                              return res.status(200).send('Failed to choose');
                            }

                            admin.database().ref(`rooms/${roomId}`).update({
                              nextTimestamp: (Date.now() + 1000 * speed) + 500,
                            });

                            admin.database().ref(`rooms/${roomId}/players/${userPos}`).update({
                              cards: newCards,
                            });

                            //  admin.database().ref(`rooms/${roomId}/globalParams`).update({
                            //    gameState: 'burry',
                            //  });

                            admin.database().ref(`adminLogs/rooms/${roomId}/${party}`).push({
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

                            admin.database().ref(`rooms/${roomId}`).update({
                              nextTimestamp: (Date.now() + 1000 * speed) + 500,
                            });

                            log(roomId, 'chooseGameType: success #1');

                            return res.status(200).send({ data: 'success' });
                          });
                      } else {
                        log(roomId, 'chooseGameType: err: cards not dealt');
                        return res.status(200).send({ data: 'err: cards not dealt' });
                      }
                    } else {
                      log(roomId, 'chooseGameType: err: cards not dealt #2');
                      return res.status(200).send({ data: 'err: cards not dealt' });
                    }
                  });
              } else if (selectedType === 'zole') {
                //* ************ ZOLE ***************//

                admin.database().ref(`rooms/${roomId}/globalParams/gameState`).transaction((gameState) => {
                  if (gameState && gameState !== 'choose') {
                    log(roomId, 'chooseGameType: already chose game state #2');
                    return; // Abort the transaction.
                  }
                  return 'play';
                })
                  .then((result) => {
                    if (!result.committed) {
                      log(roomId, 'chooseGameType: Failed to choose');
                      return res.status(200).send('Failed to choose');
                    }

                    admin.database().ref(`rooms/${roomId}`).update({
                      nextTimestamp: (Date.now() + 1000 * speed) + 500,
                    });

                    admin.database().ref(`rooms/${roomId}/curRnd`).update({
                      type: 'zole',
                      largePlayer: userPos,
                      currentTurn: curRnd.firstToGo,
                    });

                    admin.database().ref(`rooms/${roomId}/playersList/${userPos}`).update({
                      largePlayer: true,
                    });

                    admin.database().ref(`rooms/${roomId}/globalParams/gameResult`).remove();

                    admin.database().ref(`adminLogs/rooms/${roomId}/${party}`).push({
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

                    admin.database().ref(`rooms/${roomId}`).update({
                      nextTimestamp: (Date.now() + 1000 * speed) + 500,
                    });

                    log(roomId, 'chooseGameType: success #2');
                    return res.status(200).send({ data: 'success' });
                  })
                  .catch((err) => {
                    log(roomId, `chooseGameType: cards not dealt: ${err}`);
                    return res.status(200).send({ data: 'err: cards not dealt' });
                  });
              } else if (smallGame && selectedType === 'maza') {
                //* ************ MAZĀ ZOLE ***************//

                admin.database().ref(`rooms/${roomId}/globalParams/gameState`).transaction((gameState) => {
                  if (gameState && gameState !== 'choose') {
                    log(roomId, 'chooseGameType: already chose game state #3');
                    return; // Abort the transaction.
                  }
                  return 'play';
                })
                  .then((result) => {
                    if (!result.committed) {
                      log(roomId, 'chooseGameType: Failed to choose #3');
                      return res.status(200).send('Failed to choose');
                    }

                    admin.database().ref(`rooms/${roomId}`).update({
                      nextTimestamp: (Date.now() + 1000 * speed) + 500,
                    });

                    admin.database().ref(`rooms/${roomId}/curRnd`).update({
                      type: 'maza',
                      largePlayer: userPos,
                      currentTurn: curRnd.firstToGo,
                    });

                    admin.database().ref(`rooms/${roomId}/playersList/${userPos}`).update({
                      largePlayer: true,
                    });

                    admin.database().ref(`rooms/${roomId}/globalParams/gameResult`).remove();

                    //  admin.database().ref(`rooms/${roomId}/globalParams`).update({
                    //    gameState: 'play',
                    //    gameResult: null,
                    //  });

                    admin.database().ref(`adminLogs/rooms/${roomId}/${party}`).push({
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

                    admin.database().ref(`rooms/${roomId}`).update({
                      nextTimestamp: (Date.now() + 1000 * speed) + 500,
                    });

                    log(roomId, 'chooseGameType: success #3');
                    return res.status(200).send({ data: 'success' });
                  })
                  .catch((err) => {
                    log(roomId, `chooseGameType: cards not dealt: ${err}`);
                    return res.status(200).send({ data: 'err: cards not dealt' });
                  });
              } else if (selectedType === 'garam') {
                //* ************ GARĀM ***************//
                const firstToGo = curRnd.firstToGo || {};

                if ((userPos === 'player1' && firstToGo === 'player2') || (userPos === 'player2' && firstToGo === 'player3') || (userPos === 'player3' && firstToGo === 'player1')) {
                  //* ************ Pēdējais palaiž garām ***************//

                  //  log(roomId, `chooseGameType: last player garam`);

                  if (gameType === 'G') {
                    admin.database().ref(`rooms/${roomId}`).update({
                      nextTimestamp: (Date.now() + 1000 * speed) + 500,
                    });

                    admin.database().ref(`rooms/${roomId}/curRnd`).update({
                      type: 'galdins',
                      largePlayer: null,
                      currentTurn: curRnd.firstToGo,
                    });

                    admin.database().ref(`rooms/${roomId}/globalParams`).update({
                      gameState: 'play',
                      gameResult: null,
                    });

                    admin.database().ref(`adminLogs/rooms/${roomId}/${party}`).push({
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

                    admin.database().ref(`rooms/${roomId}`).update({
                      nextTimestamp: (Date.now() + 1000 * speed) + 500,
                    });

                    log(roomId, 'chooseGameType: success #4');
                    return res.status(200).send({ data: 'success' });
                  }

                  if (lastRound) {
                    //  log(roomId, `chooseGameType: lastRound`);

                    admin.database().ref(`users/${lastRoundPlayer}/name`).once('value', (snapshot) => {
                      const lastPlayerName = snapshot.val() || '';

                      log(roomId, `chooseGameType: lastPlayerName: ${lastPlayerName}`);

                      admin.database().ref(`rooms/${roomId}/globalParams/roomClosed`).transaction((roomClosedTransaction) => {
                        if (roomClosedTransaction) {
                          log(roomId, 'chooseGameType: roomClosedTransaction: Abort the transaction');
                          return; // Abort the transaction.
                        }
                        return true;
                      })
                        .then((result) => {
                          if (!result.committed) {
                            log(roomId, 'chooseGameType: Failed to select 1');
                            return res.status(200).send({ data: 'Failed to select' });
                          }

                          admin.database().ref(`rooms/${roomId}/globalParams`).update({
                            //  roomClosed: true,
                            closeReason: { reason: 'lastRound', playerName: lastPlayerName, playerUid: lastRoundPlayer },
                          });

                          admin.database().ref(`activeRooms/${roomId}`).remove();

                          setPulesOnClose({ roomId });

                          admin.database().ref(`adminLogs/rooms/${roomId}/${party}`).push({
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

                          admin.database().ref(`rooms/${roomId}/players`).once('value', (playersSnap) => {
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
                              admin.database().ref(`roomsPubInf/${roomId}/globalParams`).update({
                                roomClosed: true,
                              });

                              admin.database().ref(`roomsPubInf/${roomId}`).update({
                                roomClosed: true,
                              });
                            }

                            Object.keys(players).map((key3) => {
                              admin.database().ref(`users/${players[key3].uid}/joinedRooms/${roomId}`).remove();

                            //  admin.database().ref(`status/${players[key3].uid}`).update({
                            //    isWaitingRoom: false,
                            //  });
                              return null;
                            });
                          });

                          log(roomId, 'chooseGameType: success #5');
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

                    admin.database().ref(`rooms/${roomId}/globalParams`).transaction((globalPar) => {
                      if (globalPar && globalPar.gameState === 'results') {
                        console.log('already set to results');
                        log(roomId, 'chooseGameType: already set to results');
                        return; // Abort the transaction.
                      }

                      if (globalPar && (globalPar.gameState === 'burry' || globalPar.gameState === 'play')) {
                        console.log('already set to play or burry');
                        log(roomId, 'chooseGameType: already set to play or burry');
                        return; // Abort the transaction.
                      }

                      if (globalPar && globalPar.talking !== decoded.uid) {
                        console.log('not users turn talking');
                        log(roomId, 'chooseGameType: not users turn talking');
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
                          log(roomId, 'chooseGameType: Failed to select 2');
                          return res.status(200).send({ data: 'Failed to select' });
                        }

                        admin.database().ref(`rooms/${roomId}/curRnd`).update({
                          firstToGo: nextPos,
                          currentTurn: nextPos,
                        /*  beatCardPoints: {
                            player1: 0,
                            player2: 0,
                            player3: 0,
                            tricks: {
                              player1: 0,
                              player2: 0,
                              player3: 0,
                            },
                          }, */
                          cardsOnTable: null,
                          largePlayer: null,
                          type: null,
                        });

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

                        const key = admin.database().ref(`rooms/${roomId}/points/rounds`).push({
                          player1: 0,
                          player2: 0,
                          player3: 0,
                          pule: 'P',
                        }).getKey();

                        admin.database().ref(`rooms/${roomId}/points/pules/common`).push({
                          roundId: key,
                          status: 'active',
                        });

                        admin.database().ref(`rooms/${roomId}`).update({
                          nextTimestamp: (Date.now() + 1000 * speed) + 500,
                        });

                        admin.database().ref(`adminLogs/rooms/${roomId}/${party}`).push({
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
                        dealCards(roomId, party);

                        admin.database().ref(`rooms/${roomId}`).update({
                          nextTimestamp: (Date.now() + 1000 * speed) + 500,
                        });

                        log(roomId, 'chooseGameType: success #6');

                        return res.status(200).send({ data: 'success' });
                      });
                  }

                  //  return res.status(200).send({ data: 'success' });
                  //  } else {
                  //* ************ Ne pēdējais palaiž garām ***************//
                } else if (currentHand < 3) {
                  //  log(roomId, `chooseGameType: currentHand < 3`);

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

                  admin.database().ref(`rooms/${roomId}/globalParams`).transaction((globalPar) => {
                    if (globalPar && globalPar.gameState === 'results') {
                      console.log('already set to results #2');
                      log(roomId, 'chooseGameType: already set to results #2');
                      return; // Abort the transaction.
                    }

                    if (globalPar && (globalPar.gameState === 'burry' || globalPar.gameState === 'play')) {
                      console.log('already set to play or burry #2');
                      log(roomId, 'chooseGameType: already set to play or burry #2');
                      return; // Abort the transaction.
                    }

                    if (globalPar && globalPar.talking !== decoded.uid) {
                      console.log('not users turn talking #2');
                      log(roomId, 'chooseGameType: not users turn talking #2');
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
                        log(roomId, 'chooseGameType: Failed to select 3');
                        return res.status(200).send({ data: 'Failed to select' });
                      }

                      //  admin.database().ref(`rooms/${roomId}/globalParams`).update({
                      //    talking: nextUserUid.toString(),
                      //    currentHand: (currentHand || 1) + 1,
                      //    gameResult: null,
                      //  });

                      admin.database().ref(`rooms/${roomId}`).update({
                        nextTimestamp: (Date.now() + 1000 * speed) + 500,
                      });

                      admin.database().ref(`rooms/${roomId}/curRnd`).update({
                        currentTurn: nextTurn,
                      });

                      admin.database().ref(`adminLogs/rooms/${roomId}/${party}`).push({
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

                      log(roomId, 'chooseGameType: sucess #7');

                      return res.status(200).send({ data: 'success' });
                    });
                } else {
                  log(roomId, 'chooseGameType: Failed to select 6');
                  return res.status(200).send({ data: 'Failed to select' });
                }
                //  }
              } else {
                log(roomId, 'chooseGameType: Failed to select 7');
                return res.status(200).send({ data: 'Failed to select' });
              }
            } else {
              log(roomId, 'chooseGameType: not talking');
              return res.status(200).send({ data: 'not talking' });
            }
          });
      })
      .catch((err) => {
        console.log(err);
        log(roomId, `chooseGameType: error: ${err}`);
        return res.status(200).send({ data: { status: 'error', message: err } });
      });
    //  });

    /*  processRequest().then((r) => {
        chooseGameTypeState.markIdle(roomId).then(() => res.status(200).send(r)).catch(err => res.status(200).send(err));
      }).catch((err) => {
        chooseGameTypeState.markIdle(roomId).then(() => res.status(200).send(err)).catch(err2 => res.status(200).send(err2));
      });
    }).catch((err) => {
      chooseGameTypeState.markIdle(roomId);
      res.status(200).send({ data: { status: 'error', error: err } });
    }); */
  });
};

module.exports = chooseGameType3;
