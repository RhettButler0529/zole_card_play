const cors = require('cors')({ origin: true });
const { admin } = require('../admin');
const log = require('../logs/log');

const playCard = (req, res) => {
  cors(req, res, () => {
    if (!req.body || !req.body.data) {
      return res.status(200).send({ data: 'no req body data' });
    }

    const {
      card,
      roomId,
      init,
    } = req.body.data;

    log(roomId, 'playCard: Head');

    if (init) {
      log(roomId, 'playCard: init');

      admin.database().ref(`rooms/${roomId}`).update({
        init: Date.now(),
      });

      return res.status(200).send({ data: 'initialized' });
    }

    const tokenId = req.get('Authorization').split('Bearer ')[1];

    admin.auth().verifyIdToken(tokenId)
      .then((decoded) => {
        if (!decoded.uid) {
          log(roomId, 'playCard: Error with user (no auth token)');
          return res.status(200).send({ data: 'Error with user (no auth token)' });
        }

        admin.database().ref(`rooms/${roomId}/playersList/playerList/${decoded.uid.toString()}`).once('value', (snapshot) => {
          const playerPosition = snapshot.val() || null;

          log(roomId, `playCard: playerPosition: ${playerPosition}`);

          const promise8 = admin.database().ref(`rooms/${roomId}/globalParams/fastGame`).once('value');
          const promise9 = admin.database().ref(`rooms/${roomId}/globalParams/party`).once('value');
          const promise10 = admin.database().ref(`rooms/${roomId}/globalParams/gameState`).once('value');
          const promise1 = admin.database().ref(`rooms/${roomId}/curRnd/firstToGo`).once('value');
          const promise2 = admin.database().ref(`rooms/${roomId}/curRnd/currentTurn`).once('value');
          const promise11 = admin.database().ref(`rooms/${roomId}/curRnd/currentTable`).once('value');
          const promise5 = admin.database().ref('gameSettings').once('value');
          const promise4 = admin.database().ref(`rooms/${roomId}/players/${playerPosition}/cards`).once('value');

          Promise.all([promise10, promise9, promise8, promise1, promise2, promise11, promise5, promise4]).then((results) => {
            let fastGame;
            let party;
            let gameState;
            let firstToGo;
            let currentTurn;
            let currentTable;
            let gameSettings;
            let cards;

            results.forEach((result) => {
              if (result.key === 'firstToGo') {
                firstToGo = result.val() || null;
              } else if (result.key === 'cards') {
                cards = result.val() || [];
              } else if (result.key === 'currentTurn') {
                currentTurn = result.val() || null;
              } else if (result.key === 'currentTable') {
                currentTable = result.val() || null;
              } else if (result.key === 'fastGame') {
                fastGame = result.val() || false;
              } else if (result.key === 'party') {
                party = result.val() || 0;
              } else if (result.key === 'gameState') {
                gameState = result.val() || null;
              } else if (result.key === 'gameSettings') {
                gameSettings = result.val() || null;
              }
            });

            let speed;
            if (fastGame) {
              speed = gameSettings.fastSpeed;
            } else {
              speed = gameSettings.normalSpeed;
            }

            if (playerPosition) {
              let playedCard;
              if (cards) {
                playedCard = cards.find(cardObj => cardObj === card);
              } else {
                playedCard = null;
              }

              log(roomId, `playCard: gameState: ${gameState}`);

              if (gameState === 'burry') {
                if (currentTurn === playerPosition && playedCard) {
                  admin.database().ref(`rooms/${roomId}/players/${playerPosition}/cards`).transaction((cards2) => {
                    if (cards2 && cards2.length) {
                      if (cards2.length && cards2.length <= 8) {
                        log(roomId, 'playCard: already played card #3');
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
                      log(roomId, 'playCard: Failed burry card');
                      return res.status(200).send('Failed burry card');
                    }

                    const newCards = result.snapshot.val() || null;

                    if (!newCards || !newCards.length) {
                      log(roomId, 'playCard: Error, no cards');
                      return res.status(200).send({ data: 'Error, no cards' });
                    }

                    if (newCards.length === 9) {
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

                      admin.database().ref(`rooms/${roomId}/curRnd/beatCardPoints/${playerPosition}`)
                        .transaction(pnts => (pnts || 0) + pointsChange).then((result) => {
                          if (!results.committed) {
                            log(roomId, `playCard: Error updating beatCardPoints, error: ${result.error}`);
                            return res.status(200).send({ data: 'Error updating beatCardPoints' });
                          }

                          admin.database().ref(`adminLogs/rooms/${roomId}/${party}`).push({
                            time: Date.now(),
                            roomId,
                            type: 'burriedCard',
                            data: {
                              burriedCard: playedCard,
                              newPnts: pointsChange,
                            },
                          });

                          log(roomId, 'playCard: Card burried');
                          return res.status(200).send({ data: 'Card burried' });
                        });
                    } if (newCards.length === 8) {
                      const nextPosition = firstToGo;

                      const updates = {};

                      updates.nextTimestamp = (Date.now() + 1000 * speed) + 500;
                      updates['globalParams/gameState'] = 'play';
                      updates['curRnd/currentTurn'] = nextPosition;
                      updates['globalParams/currentHand'] = 1;
                      updates.nextTimestamp = (Date.now() + 1000 * speed) + 500;

                      admin.database().ref(`rooms/${roomId}`).update(updates).then(() => {
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

                        admin.database().ref(`rooms/${roomId}/curRnd/beatCardPoints/${playerPosition}`)
                          .transaction(pnts => (pnts || 0) + pointsChange).then((result) => {
                            if (!results.committed) {
                              log(roomId, `playCard: Error updating beatCardPoints #2, error: ${result.error}`);
                              return res.status(200).send({ data: 'Error updating beatCardPoints #2' });
                            }

                            admin.database().ref(`rooms/${roomId}/players/${firstToGo}/name`).once('value', (snapshot2) => {
                              const nextPlayerName = snapshot2.val() || '';

                              admin.database().ref(`adminLogs/rooms/${roomId}/${party}`).push({
                                time: Date.now(),
                                roomId,
                                type: 'burriedCard',
                                data: {
                                  burriedCard: playedCard,
                                  nextTurn: nextPlayerName,
                                  newPnts: pointsChange,
                                },
                              });

                              log(roomId, 'playCard: Card burried #2');
                              return res.status(200).send({ data: 'Card burried' });
                            });
                          });
                      });
                    }
                  });
                } else {
                  console.log('Is not turn');
                  log(roomId, 'playCard: Is not players turn or played card is not in his hand #3');
                  return res.status(200).send({ data: 'Is not players turn or played card is not in his hand' });
                }
              } else {
                console.log('Cannot currently play card');
                log(roomId, 'playCard: Cannot currently play card #3');
                return res.status(200).send({ data: 'Cannot currently play card' });
              }
            } else {
              console.log('Error playing card');
              log(roomId, 'playCard: Error playing card #4');
              return res.status(200).send({ data: 'Error playing card' });
            }
          }).catch((err) => {
            console.log(err);
            log(roomId, `Error #1: ${err}`);
            return res.status(200).send({ data: 'Error' });
          });
        }).catch((err) => {
          console.log(err);
          log(roomId, `Error #2: ${err}`);
          return res.status(200).send({ data: 'Error' });
        });
      })
      .catch((err) => {
        console.log(err);
        log(roomId, `Error #3: ${err}`);
        return res.status(200).send({ data: 'Error' });
      });
  });
};

module.exports = playCard;
