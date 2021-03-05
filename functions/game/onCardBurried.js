const erci = ['♥-9', '♥-K', '♥-10', '♥-A'];
const kreisti = ['♣︎-9', '♣︎-K', '♣︎-10', '♣︎-A'];
const piki = ['♠︎-9', '♠︎-K', '♠︎-10', '♠︎-A'];
const trumpji = ['♦︎-7', '♦︎-8', '♦︎-9', '♦︎-K', '♦︎-10', '♦︎-A', '♦︎-J', '♥-J', '♠︎-J', '♣︎-J', '♦︎-Q', '♥-Q', '♠︎-Q', '♣︎-Q'];

const { admin, adminLogsDb, roomsDb } = require('../admin');
const log = require('../logs/log');

const onCardBurried = (snapshot, context) => new Promise(((resolve, reject) => {
  const burriedCard = snapshot.val() || null;
  const { roomId } = context.params;
  const { eventId } = context;

  const date = Date.now();

  if (burriedCard) {
  const validEventId = eventId.replace('/', '')

  admin.database(roomsDb).ref(`lastEventIds/${roomId}`)
    .transaction(id => {
      if (id && validEventId === id) {
        return;
      }

      return validEventId;
    }).then(result => {
      if (!result.committed) {
        return resolve();
      }

    //  admin.database(roomsDb).ref(`rooms/${roomId}/curRnd/currentTurn`).once('value', (snapshot) => {
    //    const playerPosition = snapshot.val() || null;

        const promise1 = admin.database(roomsDb).ref(`rooms/${roomId}/globalParams/fastGame`).once('value');
        const promise2 = admin.database(roomsDb).ref(`rooms/${roomId}/globalParams/party`).once('value');
        const promise3 = admin.database(roomsDb).ref(`rooms/${roomId}/globalParams/gameState`).once('value');
        const promise4 = admin.database(roomsDb).ref(`rooms/${roomId}/curRnd/firstToGo`).once('value');
        const promise5 = admin.database(roomsDb).ref(`rooms/${roomId}/curRnd/currentTurn`).once('value');
        const promise6 = admin.database(roomsDb).ref(`rooms/${roomId}/players`).once('value');
        const promise7 = admin.database(roomsDb).ref('gameSettings').once('value');
      //  const promise8 = admin.database(roomsDb).ref(`rooms/${roomId}/players/${playerPosition}/cards`).once('value');

        Promise.all([promise1, promise2, promise3, promise4, promise5, promise6, promise7]).then((results) => {
          let fastGame;
          let party;
          let gameState;
          let firstToGo;
          let gameSettings;
          let cards;

          let playerPosition;
          let players;

          results.forEach((result) => {
            if (result.key === 'firstToGo') {
              firstToGo = result.val() || null;
          //  } else if (result.key === 'cards') {
          //    cards = result.val() || [];
            } else if (result.key === 'fastGame') {
              fastGame = result.val() || false;
            } else if (result.key === 'party') {
              party = result.val() || 0;
            } else if (result.key === 'gameState') {
              gameState = result.val() || null;
            } else if (result.key === 'gameSettings') {
              gameSettings = result.val() || null;
            } else if (result.key === 'currentTurn') {
              playerPosition = result.val() || null;
            } else if (result.key === 'players') {
              players = result.val() || null;
            }
          });

          if (players && playerPosition) {
            cards = players[playerPosition].cards;
          }

          let speed;
          if (fastGame) {
            speed = gameSettings.fastSpeed;
          } else {
            speed = gameSettings.normalSpeed;
          }

          if (playerPosition && cards) {
            let playedCard;
            if (cards) {
              playedCard = cards.find(cardObj => cardObj === burriedCard);
            } else {
              playedCard = null;
            }

            if (gameState === 'burry') {
              if (playerPosition && playedCard) {
                admin.database(roomsDb).ref(`rooms/${roomId}/players/${playerPosition}/cards`).transaction((cards2) => {
                  if (cards2 && cards2.length) {
                    if (cards2.length && cards2.length <= 8) {
                      console.log('playCard: already played card #3');
                      return; // Abort the transaction.
                    }

                    const index = cards2.indexOf(playedCard);
                    if (index === -1) {
                      return; // Abort the transaction.
                    }

                    cards2.splice(index, 1);
                  }
                  return cards2;
                }).then((result) => {
                  if (!result.committed) {
                    console.log(roomId, 'playCard: Failed burry card');

                    admin.database().ref(`rooms/${roomId}/curRnd/cardBurried`).set(0);
                    admin.database(roomsDb).ref(`rooms/${roomId}/curRnd/cardBurried`).set(0);
                    return reject();
                  }

                  const newCards = result.snapshot.val() || null;

                  if (!newCards || !newCards.length) {
                    admin.database().ref(`rooms/${roomId}/curRnd/cardBurried`).set(0);
                    admin.database(roomsDb).ref(`rooms/${roomId}/curRnd/cardBurried`).set(0);

                    return reject();
                  }

                //  admin.database().ref(`rooms/${roomId}/players/${playerPosition}/cards`).set(newCards);

                  if (newCards.length === 9) {
                  //  console.log('length = 9');
                    let pointsChange = 0;
                    if (playedCard.includes('J')) {
                      pointsChange = 2;
                    } else if (playedCard.includes('Q')) {
                      pointsChange = 3;
                    } else if (playedCard.includes('K')) {
                      pointsChange = 4;
                    } else if (playedCard.includes('10')) {
                      pointsChange = 10;
                    } else if (playedCard.includes('A')) {
                      pointsChange = 11;
                    }

                    admin.database(roomsDb).ref(`rooms/${roomId}/beatCardPoints/${playerPosition}`)
                      .transaction(pnts => (pnts || 0) + pointsChange).then((result2) => {
                      //  console.log('result2.committed');
                      //  console.log(result2.committed);

                        if (!result2.committed) {
                          console.log('no result2.committed');
                          return reject();
                        }

                      //  console.log('result2.snapshot.val()');
                      //  console.log(result2.snapshot.val());

                      //  admin.database().ref(`rooms/${roomId}/beatCardPoints/${playerPosition}`)
                      //    .transaction(pnts => (pnts || 0) + pointsChange)


                        admin.database().ref(`rooms/${roomId}/curRnd/cardBurried`).set(0);
                        admin.database(roomsDb).ref(`rooms/${roomId}/curRnd/cardBurried`).set(0);

                      /*  admin.database().ref(`adminLogs/rooms/${roomId}/${party}`).push({
                          time: Date.now(),
                          roomId,
                          type: 'burriedCard',
                          data: {
                            burriedCard: playedCard,
                            newPnts: pointsChange,
                          },
                        }); */

                        admin.database(adminLogsDb).ref(`adminLogs/rooms/${roomId}/${party}`).push({
                          time: Date.now(),
                          roomId,
                          type: 'burriedCard',
                          data: {
                            burriedCard: playedCard,
                            newPnts: pointsChange,
                          },
                        });

                        return resolve();
                      });
                  } if (newCards.length === 8) {
                    const nextPosition = firstToGo;

                //  console.log('length = 8');

                    const updates = {};

                    updates.nextTimestamp = (Date.now() + 1000 * speed) + 500;
                    updates['globalParams/gameState'] = 'play';
                    updates['curRnd/currentTurn'] = nextPosition;
                    updates['globalParams/currentHand'] = 1;
                    updates['curRnd/cardBurried'] = 0;

                  //  admin.database().ref(`rooms/${roomId}`).update(updates);

                    admin.database(roomsDb).ref(`rooms/${roomId}`).update(updates).then(() => {
                      let pointsChange = 0;
                      if (playedCard.includes('J')) {
                        pointsChange = 2;
                      } else if (playedCard.includes('Q')) {
                        pointsChange = 3;
                      } else if (playedCard.includes('K')) {
                        pointsChange = 4;
                      } else if (playedCard.includes('10')) {
                        pointsChange = 10;
                      } else if (playedCard.includes('A')) {
                        pointsChange = 11;
                      }

                      admin.database(roomsDb).ref(`rooms/${roomId}/beatCardPoints/${playerPosition}`)
                        .transaction(pnts => (pnts || 0) + pointsChange).then((result2) => {
                      //    console.log('result2.committed');
                      //    console.log(result2.committed);

                          if (!result2.committed) {
                            return reject();
                          }

                        //  console.log('result2.snapshot.val()');
                        //  console.log(result2.snapshot.val());

                        //  admin.database().ref(`rooms/${roomId}/beatCardPoints/${playerPosition}`)
                        //    .transaction(pnts => (pnts || 0) + pointsChange);

                          admin.database(roomsDb).ref(`rooms/${roomId}/players/${firstToGo}/name`).once('value', (snapshot2) => {
                            const nextPlayerName = snapshot2.val() || '';

                            admin.database().ref(`chat/${roomId}/messages`).push({
                              roomId,
                              message: 'Lielais noraka kārtis',
                              userUid: 'game',
                              time: Date.now(),
                            });

                        /*    admin.database().ref(`adminLogs/rooms/${roomId}/${party}`).push({
                              time: Date.now(),
                              roomId,
                              type: 'burriedCard',
                              data: {
                                burriedCard: playedCard,
                                nextTurn: nextPlayerName,
                                newPnts: pointsChange,
                              },
                            });  */

                            admin.database(adminLogsDb).ref(`adminLogs/rooms/${roomId}/${party}`).push({
                              time: Date.now(),
                              roomId,
                              type: 'burriedCard',
                              data: {
                                burriedCard: playedCard,
                                nextTurn: nextPlayerName,
                                newPnts: pointsChange,
                              },
                            });

                            return resolve();
                          });
                        });
                    });
                  }
                });
              } else {
                console.log('Is not turn');
                return reject();
              }
            } else {
              console.log('game state not burry');
              return reject();
            }
          } else {
            console.log('Error playing card');
            return reject();
          }
        }).catch((err) => {
          console.log(err);
          return res.status(200).send({ data: 'Error' });
        });
    //  }).catch((err) => {
    //    console.log(err);
    //    return res.status(200).send({ data: 'Error' });
    //  });
    }).catch(err => {
      console.log(err);
      return resolve();
    });
  } else {
    return resolve();
  }
}));

module.exports = onCardBurried;
