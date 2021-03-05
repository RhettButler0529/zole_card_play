const erci = ['♥-9', '♥-K', '♥-10', '♥-A'];
const kreisti = ['♣︎-9', '♣︎-K', '♣︎-10', '♣︎-A'];
const piki = ['♠︎-9', '♠︎-K', '♠︎-10', '♠︎-A'];
const trumpji = ['♦︎-7', '♦︎-8', '♦︎-9', '♦︎-K', '♦︎-10', '♦︎-A', '♦︎-J', '♥-J', '♠︎-J', '♣︎-J', '♦︎-Q', '♥-Q', '♠︎-Q', '♣︎-Q'];

const { admin, adminLogsDb, roomsDb } = require('../admin');
const log = require('../logs/log');

const onCardPlayed = (snapshot, context) => new Promise(((resolve, reject) => {
  const playedCard = snapshot.val() || null;
  const { roomId } = context.params;
  const { eventId } = context;

  const date = Date.now();

  if (playedCard) {
  const validEventId = eventId.replace('/', '')

  admin.database(roomsDb).ref(`lastEventIds/${roomId}`)
    .transaction(id => {
      if (id && validEventId === id) {
        return;
      }

      return validEventId;
    }).then(result => {
      if (!result.committed) {
        console.log('event not commited');
        return resolve();
      }

      if (date + 2500 < Date.now()) {
        console.log('second');
        console.log(Date.now() - date);
      }

    //  admin.database(roomsDb).ref(`rooms/${roomId}/curRnd/currentTurn`).once('value', (snapshot2) => {
    //    const currentTurn = snapshot2.val() || null;

      //  if (currentTurn) {
          const promise1 = admin.database(roomsDb).ref(`rooms/${roomId}/globalParams/fastGame`).once('value');
          const promise2 = admin.database(roomsDb).ref(`rooms/${roomId}/globalParams/party`).once('value');
          const promise3 = admin.database(roomsDb).ref(`rooms/${roomId}/curRnd/currentTable`).once('value');
          const promise4 = admin.database(roomsDb).ref('gameSettings').once('value');
          const promise5 = admin.database(roomsDb).ref(`rooms/${roomId}/players`).once('value');
        //  const promise5 = admin.database(roomsDb).ref(`rooms/${roomId}/players/${currentTurn}/cards`).once('value');
        //  const promise6 = admin.database(roomsDb).ref(`rooms/${roomId}/playersList/${currentTurn}/name`).once('value');
          const promise7 = admin.database(roomsDb).ref(`rooms/${roomId}/globalParams/roomClosed`).once('value');
          const promise8 = admin.database(roomsDb).ref(`rooms/${roomId}/globalParams/currentHand`).once('value');
          const promise6 = admin.database(roomsDb).ref(`rooms/${roomId}/curRnd/currentTurn`).once('value');

          Promise.all([promise1, promise2, promise3, promise4, promise5, promise6, promise7, promise8]).then((results) => {
            let fastGame;
            let party;
            let currentTable;
            let gameSettings;
          //  let cards;
          //  let playerName;
            let roomClosed;
            let currentHand;
            let players;
            let currentTurn;

            results.forEach((result) => {
              if (result.key === 'name') {
                playerName = result.val() || '';
              } else if (result.key === 'cards') {
                cards = result.val() || [];
              } else if (result.key === 'players') {
                players = result.val() || [];
              } else if (result.key === 'currentTable') {
                currentTable = result.val() || null;
              } else if (result.key === 'fastGame') {
                fastGame = result.val() || false;
              } else if (result.key === 'party') {
                party = result.val() || 0;
              } else if (result.key === 'gameSettings') {
                gameSettings = result.val() || null;
              } else if (result.key === 'roomClosed') {
                roomClosed = result.val() || false;
              } else if (result.key === 'currentHand') {
                currentHand = result.val() || null;
              } else if (result.key === 'currentTurn') {
                currentTurn = result.val() || null;
              }
            });

            const cards = players[currentTurn].cards;
            const playerName = players[currentTurn].name;

            if (date + 3500 < Date.now()) {
              console.log('delayed function');
              console.log(roomId);
              console.log(Date.now() - date);
            }

            let speed;
            if (fastGame) {
              speed = gameSettings.fastSpeed || 15;
            } else {
              speed = gameSettings.normalSpeed || 25;
            }

            if (currentTurn && !roomClosed) {
            //  console.log(roomId);
              if (!currentTable || currentTable.length === 0) {
                const newCards = cards;
                const index = newCards.indexOf(playedCard);

              //  console.log('table 0');

                if (index !== -1) {
                  newCards.splice(index, 1);
                } else {
                  admin.database().ref(`rooms/${roomId}/curRnd/cardPlayed2`).transaction((cardPlayed) => {
                    if (cardPlayed && cardPlayed === playedCard) {
                      return 0;
                    }

                    return cardPlayed;
                  });

                  admin.database(roomsDb).ref(`rooms/${roomId}/curRnd/cardPlayed2`).transaction((cardPlayed) => {
                    if (cardPlayed && cardPlayed === playedCard) {
                      return 0;
                    }

                    return cardPlayed;
                  });

                  return resolve();
                }

                let nextPosition;
                if (currentTurn === 'player1') {
                  nextPosition = 'player2';
                } else if (currentTurn === 'player2') {
                  nextPosition = 'player3';
                } else if (currentTurn === 'player3') {
                  nextPosition = 'player1';
                }

                let updates = {};

                admin.database(roomsDb).ref(`rooms/${roomId}/globalParams/party`).once('value', (snapshot3) => {
                  const party2 = snapshot3.val() || null;

                  if (party2 === party) {

                updates[`players/${currentTurn}/cards`] = newCards;
                updates['curRnd/currentTurn'] = nextPosition;
                updates['curRnd/currentTable/0'] = { card: playedCard, player: currentTurn };
              //  updates['curRnd/cardPlayed'] = null;
                updates['curRnd/cardPlayed2'] = 0;
                updates['globalParams/currentHand'] = 2;
                updates.nextTimestamp = (Date.now() + 1000 * speed) + 500;

              //  console.log(updates);

            /*  admin.database().ref(`rooms/${roomId}/players/${currentTurn}/cards`).set(newCards);

              admin.database(roomsDb).ref(`rooms/${roomId}/players/${currentTurn}/cards`).set(newCards);

            //  admin.database().ref(`rooms/${roomId}/curRnd/currentTurn`).set(nextPosition);

            //  admin.database().ref(`rooms/${roomId}/curRnd/currentTable/0`).set({ card: playedCard, player: currentTurn });

            //  admin.database().ref(`rooms/${roomId}/curRnd/cardPlayed`).remove();


              admin.database().ref(`rooms/${roomId}/globalParams/currentHand`).set(2);

              admin.database().ref(`rooms/${roomId}/globalParams/currentHand`).set(2);

              updates['currentTurn'] = nextPosition;
              updates['currentTable/0'] = { card: playedCard, player: currentTurn };
              updates['cardPlayed2'] = 0;

              admin.database().ref(`rooms/${roomId}/curRnd`).update(updates); */




            //  admin.database().ref(`rooms/${roomId}`).update(updates);




              admin.database(roomsDb).ref(`rooms/${roomId}`).update(updates);

            //  admin.database(roomsDb).ref(`cardPlayedEventIds/${validEventId}`).remove();

                admin.database().ref(`activeRooms/${roomId}`).update({
                  time: Date.now(),
                });

              //  admin.database().ref(`rooms/${roomId}/nextTimestamp`).set((Date.now() + 1000 * speed) + 500);

              /*  admin.database().ref(`adminLogs/rooms/${roomId}/${party}`).push({
                  time: Date.now(),
                  roomId,
                  type: 'cardPlayed',
                  data: {
                    player: playerName || '',
                    //  playerUid: decoded.uid,
                    playedCard,
                  },
                });  */

                admin.database(adminLogsDb).ref(`adminLogs/rooms/${roomId}/${party}`).push({
                  time: Date.now(),
                  roomId,
                  type: 'cardPlayed',
                  data: {
                    player: playerName || '',
                    //  playerUid: decoded.uid,
                    playedCard,
                  },
                });

              /*  admin.database().ref(`cardPlayedLog4/${roomId}/${party}`).push({
                  c: playedCard || null,
                  tur: currentTurn || null,
                  nTur: nextPosition || null,
                  h: currentHand || null,
                  t: currentTable ? currentTable.length : null,
                  type: 1,
                });

                if (currentHand && currentHand !== 1) {
                  admin.database().ref(`cardPlayedLog5/${roomId}/${party}`).push({
                    c: playedCard || null,
                    h: currentHand || null,
                    t: currentTable ? currentTable.length : null,
                    type: 1,
                  });
                } */

                //  admin.database().ref(`rooms/${roomId}`).update({
                //    nextTimestamp: (Date.now() + 1000 * speed) + 500,
                //  }).then(() => {
              //  admin.database().ref(`rooms/${roomId}`).update(updates);
              //  .then(() => {
              //    log(roomId, 'onCardPlayed: First card played');

                  return resolve();
              //  })
              //    .catch((err) => {
              //      console.log(err);
              //      return resolve();
              //    });



              //  })
              //    .catch((err) => {
              //      console.log(err);
              //      return resolve();
              //    });
                }

              //  admin.database().ref(`rooms/${roomId}/curRnd/cardPlayed2`).set(0);
                return resolve();
              });

              } else if (Object.keys(currentTable).length === 1) {
                let playerHasCards;

              //  console.log('table 1');

              //  log(roomId, 'onCardPlayed: Second card');
              //  log(roomId, 'onCardPlayed', playedCard);

                if (currentTable[0]) {
                  if (kreisti.indexOf(currentTable[0].card) !== -1) {
                    playerHasCards = cards.filter(value => kreisti.includes(value));
                  } else if (erci.indexOf(currentTable[0].card) !== -1) {
                    playerHasCards = cards.filter(value => erci.includes(value));
                  } else if (piki.indexOf(currentTable[0].card) !== -1) {
                    playerHasCards = cards.filter(value => piki.includes(value));
                  } else {
                    playerHasCards = cards.filter(value => trumpji.includes(value));
                  }

                //  log(roomId, `onCardPlayed: playerHasCards: ${playerHasCards.toString()}`);

                  if (playerHasCards !== null && playerHasCards !== undefined
                && playerHasCards && playerHasCards.length > 0) {
                    if (!playerHasCards.includes(playedCard)) {
                      console.log('played wrong card');

                    //  log(roomId, `onCardPlayed: played wrong card: ${playedCard}`);
                      admin.database().ref(`rooms/${roomId}/curRnd/cardPlayed2`).set(0);

                      admin.database(roomsDb).ref(`rooms/${roomId}/curRnd/cardPlayed2`).set(0);
                      return resolve();
                    }
                  }

                  const newCards = cards;
                  const index = newCards.indexOf(playedCard);
                  if (index !== -1) {
                    newCards.splice(index, 1);
                  } else {
                    admin.database().ref(`rooms/${roomId}/curRnd/cardPlayed2`).transaction((cardPlayed) => {
                      if (cardPlayed && cardPlayed === playedCard) {
                        return 0;
                      }

                      return cardPlayed;
                    });

                    admin.database(roomsDb).ref(`rooms/${roomId}/curRnd/cardPlayed2`).transaction((cardPlayed) => {
                      if (cardPlayed && cardPlayed === playedCard) {
                        return 0;
                      }

                      return cardPlayed;
                    });
                    return resolve();
                  }


                  let nextPosition;
                  if (currentTurn === 'player1') {
                    nextPosition = 'player2';
                  } else if (currentTurn === 'player2') {
                    nextPosition = 'player3';
                  } else if (currentTurn === 'player3') {
                    nextPosition = 'player1';
                  }

                  let updates = {};

                  admin.database(roomsDb).ref(`rooms/${roomId}/globalParams/party`).once('value', (snapshot3) => {
                    const party2 = snapshot3.val() || null;

                    if (party2 === party) {
                      updates.nextTimestamp = (Date.now() + 1000 * speed) + 500;
                      updates[`players/${currentTurn}/cards`] = newCards;
                      updates['curRnd/currentTurn'] = nextPosition;
                      updates['curRnd/currentTable/1'] = { card: playedCard, player: currentTurn };
                    //  updates['curRnd/cardPlayed'] = null;
                      updates['curRnd/cardPlayed2'] = 0;
                      updates['globalParams/currentHand'] = 3;

                  /*    admin.database().ref(`rooms/${roomId}/players/${currentTurn}/cards`).set(newCards);

                      admin.database().ref(`rooms/${roomId}/nextTimestamp`).set((Date.now() + 1000 * speed) + 500);

                    //  admin.database().ref(`rooms/${roomId}/curRnd/currentTurn`).set(nextPosition);

                    //  admin.database().ref(`rooms/${roomId}/curRnd/currentTable/1`).set({ card: playedCard, player: currentTurn });

                    //  admin.database().ref(`rooms/${roomId}/curRnd/cardPlayed`).remove();

                      admin.database().ref(`rooms/${roomId}/globalParams/currentHand`).set(3);

                    //  admin.database().ref(`rooms/${roomId}`).update(updates);

                      updates['currentTurn'] = nextPosition;
                      updates['currentTable/1'] = { card: playedCard, player: currentTurn };
                      updates['cardPlayed2'] = 0;

                      admin.database().ref(`rooms/${roomId}/curRnd`).update(updates); */

                    //  console.log(updates);





                    //  admin.database().ref(`rooms/${roomId}`).update(updates);





                      admin.database(roomsDb).ref(`rooms/${roomId}`).update(updates);

                    //  admin.database(roomsDb).ref(`cardPlayedEventIds/${validEventId}`).remove();

                    //  admin.database().ref(`activeRooms/${roomId}`).update({
                    //    time: Date.now(),
                    //  });

                    /*  admin.database().ref(`adminLogs/rooms/${roomId}/${party}`).push({
                        time: Date.now(),
                        roomId,
                        type: 'cardPlayed',
                        data: {
                          player: playerName || '',
                          playedCard,
                        },
                      });   */

                      admin.database(adminLogsDb).ref(`adminLogs/rooms/${roomId}/${party}`).push({
                        time: Date.now(),
                        roomId,
                        type: 'cardPlayed',
                        data: {
                          player: playerName || '',
                          playedCard,
                        },
                      });

                    /*  admin.database().ref(`cardPlayedLog4/${roomId}/${party}`).push({
                        c: playedCard || null,
                        h: currentHand || null,
                        tur: currentTurn || null,
                        nTur: nextPosition || null,
                        t: currentTable ? currentTable.length : null,
                        type: 2,
                      });

                      if (currentHand && currentHand !== 2) {
                        admin.database().ref(`cardPlayedLog5/${roomId}/${party}`).push({
                          c: playedCard || null,
                          h: currentHand || null,
                          t: currentTable ? currentTable.length : null,
                          type: 2,
                        });
                      }  */


                      //  admin.database().ref(`rooms/${roomId}`).update({
                      //    nextTimestamp: (Date.now() + 1000 * speed) + 500,
                      //  }).then(() => {
                    //  admin.database().ref(`rooms/${roomId}`).update(updates);
                    //  .then(() => {
                    //    log(roomId, 'onCardPlayed: Second card played');
                        return resolve();
                    //  })
                    //    .catch((err) => {
                    //      console.log(err);
                    //      return resolve();
                    //    });



                      //  })
                      //    .catch((err) => {
                      //      console.log(err);
                      //      return resolve();
                      //    });

                    //  log(roomId, 'onCardPlayed: Second card played #2');
                    //  return resolve();
                    }

                    //  log(roomId, 'onCardPlayed: Second card played #3');
                  //  admin.database().ref(`rooms/${roomId}/curRnd/cardPlayed2`).set(0);
                    return resolve();
                  });
                } else {
                  admin.database().ref(`rooms/${roomId}/curRnd/cardPlayed2`).set(0);
                  return resolve();
                }
              } else if (Object.keys(currentTable).length === 2) {

              //  console.log('table 2');

                let playerHasCards;

                if (currentTable[0]) {
                  if (kreisti.indexOf(currentTable[0].card) !== -1) {
                    playerHasCards = cards.filter(value => kreisti.includes(value));
                  } else if (erci.indexOf(currentTable[0].card) !== -1) {
                    playerHasCards = cards.filter(value => erci.includes(value));
                  } else if (piki.indexOf(currentTable[0].card) !== -1) {
                    playerHasCards = cards.filter(value => piki.includes(value));
                  } else {
                    playerHasCards = cards.filter(value => trumpji.includes(value));
                  }

                  if (playerHasCards !== null && playerHasCards !== undefined
                && playerHasCards && playerHasCards.length > 0) {
                    if (!playerHasCards.includes(playedCard)) {
                    //  log(roomId, `onCardPlayed: played wrong card: ${playedCard}`);
                      admin.database().ref(`rooms/${roomId}/curRnd/cardPlayed2`).set(0);

                      admin.database(roomsDb).ref(`rooms/${roomId}/curRnd/cardPlayed2`).set(0);
                      return resolve();
                    }
                  }

                  const newCards = cards;
                  const index = newCards.indexOf(playedCard);

                  if (index !== -1) {
                    newCards.splice(index, 1);
                  } else {
                    admin.database().ref(`rooms/${roomId}/curRnd/cardPlayed2`).transaction((cardPlayed) => {
                      if (cardPlayed && cardPlayed === playedCard) {
                        return 0;
                      }

                      return cardPlayed;
                    });

                    admin.database(roomsDb).ref(`rooms/${roomId}/curRnd/cardPlayed2`).transaction((cardPlayed) => {
                      if (cardPlayed && cardPlayed === playedCard) {
                        return 0;
                      }

                      return cardPlayed;
                    });
                    return resolve();
                  }

                  let updates = {};

                  admin.database(roomsDb).ref(`rooms/${roomId}/globalParams/party`).once('value', (snapshot3) => {
                    const party2 = snapshot3.val() || null;

                  //  console.log('party2');
                  //  console.log(party2);

                    if (party2 === party) {
                      updates.nextTimestamp = (Date.now() + 1000 * speed) + 500;
                      updates[`players/${currentTurn}/cards`] = newCards;
                      updates['curRnd/currentTurn'] = null;
                      updates['curRnd/currentTable/2'] = { card: playedCard, player: currentTurn };
                    //  updates['curRnd/cardPlayed'] = null;
                      updates['curRnd/cardPlayed2'] = 0;

                    //  admin.database().ref(`rooms/${roomId}/nextTimestamp`).set((Date.now() + 1000 * speed) + 500);

                  /*    admin.database().ref(`rooms/${roomId}/nextTimestamp`).remove();

                      admin.database().ref(`rooms/${roomId}/players/${currentTurn}/cards`).set(newCards);

                    //  admin.database().ref(`rooms/${roomId}/curRnd/currentTurn`).remove();

                    //  admin.database().ref(`rooms/${roomId}/curRnd/currentTable/2`).set({ card: playedCard, player: currentTurn });

                    //  admin.database().ref(`rooms/${roomId}/curRnd/cardPlayed`).remove();

                    //  admin.database().ref(`rooms/${roomId}`).update(updates);

                      updates['currentTurn'] = null;
                      updates['currentTable/2'] = { card: playedCard, player: currentTurn };
                      updates['cardPlayed2'] = 0;

                      admin.database().ref(`rooms/${roomId}/curRnd`).update(updates);  */

                    //  console.log(updates);






                    //  admin.database().ref(`rooms/${roomId}`).update(updates);






                      admin.database(roomsDb).ref(`rooms/${roomId}`).update(updates);

                    //  admin.database(roomsDb).ref(`cardPlayedEventIds/${validEventId}`).remove();

                    //  admin.database().ref(`activeRooms/${roomId}`).update({
                    //    time: Date.now(),
                    //  });

                    /*  admin.database().ref(`adminLogs/rooms/${roomId}/${party}`).push({
                        time: Date.now(),
                        roomId,
                        type: 'cardPlayed',
                        data: {
                          player: playerName || '',
                          playedCard,
                        },
                      });  */

                      admin.database(adminLogsDb).ref(`adminLogs/rooms/${roomId}/${party}`).push({
                        time: Date.now(),
                        roomId,
                        type: 'cardPlayed',
                        data: {
                          player: playerName || '',
                          playedCard,
                        },
                      });

                    /*  admin.database().ref(`cardPlayedLog4/${roomId}/${party}`).push({
                        c: playedCard || null,
                        h: currentHand || null,
                        tur: currentTurn || null,
                        t: currentTable ? currentTable.length : null,
                        type: 3,
                      });

                      if (currentHand && currentHand !== 3) {
                        admin.database().ref(`cardPlayedLog5/${roomId}/${party}`).push({
                          c: playedCard || null,
                          h: currentHand || null,
                          t: currentTable ? currentTable.length : null,
                          type: 3,
                        });
                      } */

                      //  admin.database().ref(`rooms/${roomId}`).update({
                      //    nextTimestamp: (Date.now() + 1000 * speed) + 500,
                      //  }).then(() => {
                    //  admin.database().ref(`rooms/${roomId}`).update(updates);
                    //  .then(() => {
                      //  log(roomId, 'onCardPlayed: Third card played');
                        return resolve();
                    //  })
                    //    .catch((err) => {
                    //      console.log(err);
                    //      return resolve();
                    //    });




                      //  })
                      //    .catch((err) => {
                      //      console.log(err);
                      //      return resolve();
                      //    });

                      //    log(roomId, 'onCardPlayed: 3rd card played #2');
                    //  return resolve();
                    }

                    //  log(roomId, 'onCardPlayed: 3rd card played #3');
                    admin.database().ref(`rooms/${roomId}/curRnd/cardPlayed2`).set(0);
                    admin.database(roomsDb).ref(`rooms/${roomId}/curRnd/cardPlayed2`).set(0);
                    return resolve();
                  });
                } else {
                //  console.log('no currentTable[0]');
                //  console.log(roomId);
                //  console.log(currentTable);
                //  console.log(playedCard);

                  admin.database().ref(`rooms/${roomId}/curRnd/cardPlayed2`).set(0);
                  admin.database(roomsDb).ref(`rooms/${roomId}/curRnd/cardPlayed2`).set(0);
                  return resolve();
                }
              } else {
              //  console.log('Already 3 cards');
              //  console.log(roomId);
              //  console.log(playedCard);

              //  log(roomId, 'onCardPlayed: Already 3 cards');
                admin.database().ref(`rooms/${roomId}/curRnd/cardPlayed2`).set(0);
                admin.database(roomsDb).ref(`rooms/${roomId}/curRnd/cardPlayed2`).set(0);
                return resolve();
              }
            } else {
            //  console.log('Error playing card #1');
            //  console.log(roomId);
            //  console.log(playedCard);
            //  console.log(currentTurn);
            //  console.log(roomClosed);

            //  log(roomId, 'onCardPlayed: Error playing card');
              admin.database().ref(`rooms/${roomId}/curRnd/cardPlayed2`).set(0);
              admin.database(roomsDb).ref(`rooms/${roomId}/curRnd/cardPlayed2`).set(0);
              return reject();
            }
          })
            .catch((err) => {
            //  console.log('error #1');
            //  console.log(err);
            //  log(roomId, `onCardPlayed: err: ${err}`);
              admin.database().ref(`rooms/${roomId}/curRnd/cardPlayed2`).set(0);
              admin.database(roomsDb).ref(`rooms/${roomId}/curRnd/cardPlayed2`).set(0);
              return reject();
            });
      /*  } else {
        //  console.log('Error playing card #2');
        //  console.log(roomId);
        //  console.log(playedCard);
        //  console.log(currentTurn);

        //  log(roomId, 'onCardPlayed: Error playing card #2');
          admin.database().ref(`rooms/${roomId}/curRnd/cardPlayed2`).set(0);
          admin.database(roomsDb).ref(`rooms/${roomId}/curRnd/cardPlayed2`).set(0);
          return reject();
        } */
    /*  }).catch((err) => {
      //  console.log(err);
      //  console.log('error #2');
      //  log(roomId, `onCardPlayed: err: ${err}`);
        admin.database().ref(`rooms/${roomId}/curRnd/cardPlayed2`).set(0);
        admin.database(roomsDb).ref(`rooms/${roomId}/curRnd/cardPlayed2`).set(0);
        return reject();
      });  */
    }).catch(err => {
      console.log(err);
      console.log(roomId);
      admin.database().ref(`rooms/${roomId}/curRnd/cardPlayed2`).set(0);
      admin.database(roomsDb).ref(`rooms/${roomId}/curRnd/cardPlayed2`).set(0);
      return reject();
    });
  } else {
  //  admin.database().ref(`rooms/${roomId}/curRnd/cardPlayed`).remove();
  //  console.log('no playedCard');
  //  log(roomId, 'onCardPlayed: no playedCard');
    return resolve();
  }
}));

module.exports = onCardPlayed;
