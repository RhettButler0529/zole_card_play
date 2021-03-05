const erci = ['♥-9', '♥-K', '♥-10', '♥-A'];
const kreisti = ['♣︎-9', '♣︎-K', '♣︎-10', '♣︎-A'];
const piki = ['♠︎-9', '♠︎-K', '♠︎-10', '♠︎-A'];
const trumpji = ['♦︎-7', '♦︎-8', '♦︎-9', '♦︎-K', '♦︎-10', '♦︎-A', '♦︎-J', '♥-J', '♠︎-J', '♣︎-J', '♦︎-Q', '♥-Q', '♠︎-Q', '♣︎-Q'];

const playCard = (req, res) => {
  const cors = require('cors')({ origin: true });
  const { admin } = require('../admin');

  cors(req, res, () => {
    if (!req.body || !req.body.data) {
      return res.status(200).send({ data: 'no req body data' });
    }

    const {
      card,
      roomId,
      init,
    } = req.body.data;

    if (init) {
      admin.database().ref(`rooms/${roomId}`).update({
        init: Date.now(),
      });

      return res.status(200).send({ data: 'initialized' });
    }

    const tokenId = req.get('Authorization').split('Bearer ')[1];

    admin.auth().verifyIdToken(tokenId)
      .then((decoded) => {
        if (!decoded.uid) {
          return res.status(200).send({ data: 'Error with user (no auth token)' });
        }

        const promise1 = admin.database().ref(`rooms/${roomId}/globalParams`).once('value');
        const promise2 = admin.database().ref(`rooms/${roomId}/curRnd`).once('value');
        const promise3 = admin.database().ref(`rooms/${roomId}/playersList/playerList/${decoded.uid.toString()}`).once('value');

        Promise.all([promise1, promise2, promise3]).then((results) => {
          let globalParams;
          let playerPosition;
          let currentStatus;

          results.forEach((result) => {
            if (result.key === 'globalParams') {
              globalParams = result.val() || {};
            } else if (result.key === 'curRnd') {
              currentStatus = result.val() || {};
            } else {
              playerPosition = result.val() || null;
            }
          });

          const { firstToGo } = currentStatus;
          const { playerCount } = globalParams;
          if (playerCount && playerCount === 4) {
            // 4 player room
            const { dealer } = globalParams;
            if (playerPosition) {
              const promise4 = admin.database().ref(`rooms/${roomId}/players/${playerPosition}/cards`).once('value');
              const promise5 = admin.database().ref(`gameSettings/${globalParams.fastGame ? 'fastSpeed' : 'normalSpeed'}`).once('value');
              const promise6 = admin.database().ref(`rooms/${roomId}/players/${firstToGo}/name`).once('value');
              const promise7 = admin.database().ref(`rooms/${roomId}/players/${playerPosition}/name`).once('value');

              Promise.all([promise4, promise5, promise6, promise7]).then((results2) => {
                let cards;
                let speed;
                let nextPlayerName;
                let name;
                results2.forEach((result, index) => {
                  if (index === 0) {
                    cards = result.val() || {};
                  } else if (index === 1) {
                    speed = result.val() || 15;
                  } else if (index === 2) {
                    nextPlayerName = result.val() || '';
                  } else if (index === 3) {
                    name = result.val() || '';
                  }
                });

                const { party } = globalParams;

                let playedCard;
                if (cards) {
                  playedCard = cards.find(cardObj => cardObj === card);
                } else {
                  playedCard = null;
                }

                if (globalParams.gameState === 'play') {
                  if (currentStatus.currentTurn === playerPosition && playedCard) {
                    if (!currentStatus.currentTable) {
                      const newCards = cards;
                      const index = newCards.indexOf(playedCard);

                      if (index !== -1) newCards.splice(index, 1);

                      let nextPosition;
                      if (dealer === 'player1') {
                        if (playerPosition === 'player2') {
                          nextPosition = 'player3';
                        } else if (playerPosition === 'player3') {
                          nextPosition = 'player4';
                        } else if (playerPosition === 'player4') {
                          nextPosition = 'player2';
                        }
                      } else if (dealer === 'player2') {
                        if (playerPosition === 'player1') {
                          nextPosition = 'player3';
                        } else if (playerPosition === 'player3') {
                          nextPosition = 'player4';
                        } else if (playerPosition === 'player4') {
                          nextPosition = 'player1';
                        }
                      } else if (dealer === 'player3') {
                        if (playerPosition === 'player1') {
                          nextPosition = 'player2';
                        } else if (playerPosition === 'player2') {
                          nextPosition = 'player4';
                        } else if (playerPosition === 'player4') {
                          nextPosition = 'player1';
                        }
                      } else if (dealer === 'player4') {
                        if (playerPosition === 'player1') {
                          nextPosition = 'player2';
                        } else if (playerPosition === 'player2') {
                          nextPosition = 'player3';
                        } else if (playerPosition === 'player3') {
                          nextPosition = 'player1';
                        }
                      }

                      let playedCards;
                      if (currentStatus.currentTable === undefined) {
                        playedCards = 0;
                      } else if (Object.keys(currentStatus.currentTable).length === 1) {
                        playedCards = 1;
                      } else if (Object.keys(currentStatus.currentTable).length === 2) {
                        playedCards = 2;
                      }

                      admin.database().ref(`rooms/${roomId}/curRnd/currentTurn`).transaction((currentTurn) => {
                        if (currentTurn && currentTurn !== playerPosition) {
                          console.log('already played card');
                          return; // Abort the transaction.
                        }
                        return nextPosition;
                      })
                        .then((result) => {
                          if (!result.committed) {
                            return res.status(200).send('Failed to play card');
                          }

                          const updates = {};

                          updates.nextTimestamp = (Date.now() + 1000 * speed) + 500;
                          updates[`players/${playerPosition}/cards`] = newCards;
                          updates[`curRnd/currentTable/${playedCards}/card`] = playedCard;
                          updates[`curRnd/currentTable/${playedCards}/player`] = playerPosition;

                          admin.database().ref(`rooms/${roomId}`).update(updates);

                          admin.database().ref(`adminLogs/rooms/${roomId}/${party}`).push({
                            time: Date.now(),
                            roomId,
                            type: 'cardPlayed',
                            data: {
                              player: name,
                              playerUid: decoded.uid,
                              playedCard,
                            },
                          });

                          return res.status(200).send({ data: 'Card played' });
                        });
                    } else if (Object.keys(currentStatus.currentTable).length < 3) {
                    //  console.log('cur table has cards and less than 3');
                      let playerHasCards;

                      if (kreisti.indexOf(currentStatus.currentTable[0].card) !== -1) {
                        playerHasCards = cards.filter(value => kreisti.includes(value));
                      } else if (erci.indexOf(currentStatus.currentTable[0].card) !== -1) {
                        playerHasCards = cards.filter(value => erci.includes(value));
                      } else if (piki.indexOf(currentStatus.currentTable[0].card) !== -1) {
                        playerHasCards = cards.filter(value => piki.includes(value));
                      } else {
                        playerHasCards = cards.filter(value => trumpji.includes(value));
                      }

                      if (playerHasCards !== null && playerHasCards !== undefined
                            && playerHasCards && playerHasCards.length > 0) {
                        if (!playerHasCards.includes(playedCard)) {
                          return res.status(200).send({ data: 'Cannot play that card' });
                        }
                      }

                      const newCards = cards;
                      const index = newCards.indexOf(playedCard);
                      if (index !== -1) newCards.splice(index, 1);


                      let nextPosition;
                      if (dealer === 'player1') {
                        if (playerPosition === 'player2') {
                          nextPosition = 'player3';
                        } else if (playerPosition === 'player3') {
                          nextPosition = 'player4';
                        } else if (playerPosition === 'player4') {
                          nextPosition = 'player2';
                        }
                      } else if (dealer === 'player2') {
                        if (playerPosition === 'player1') {
                          nextPosition = 'player3';
                        } else if (playerPosition === 'player3') {
                          nextPosition = 'player4';
                        } else if (playerPosition === 'player4') {
                          nextPosition = 'player1';
                        }
                      } else if (dealer === 'player3') {
                        if (playerPosition === 'player1') {
                          nextPosition = 'player2';
                        } else if (playerPosition === 'player2') {
                          nextPosition = 'player4';
                        } else if (playerPosition === 'player4') {
                          nextPosition = 'player1';
                        }
                      } else if (dealer === 'player4') {
                        if (playerPosition === 'player1') {
                          nextPosition = 'player2';
                        } else if (playerPosition === 'player2') {
                          nextPosition = 'player3';
                        } else if (playerPosition === 'player3') {
                          nextPosition = 'player1';
                        }
                      }

                      let playedCards = 0;

                      if (Object.keys(currentStatus.currentTable).length === 1) {
                        playedCards = 1;
                      } else if (Object.keys(currentStatus.currentTable).length === 2) {
                        playedCards = 2;
                        nextPosition = null;
                      }

                      admin.database().ref(`rooms/${roomId}/curRnd/currentTurn`).transaction((currentTurn) => {
                        if (currentTurn && currentTurn !== playerPosition) {
                        //  console.log('already played card');
                          return; // Abort the transaction.
                        }
                        return nextPosition;
                      })
                        .then((result) => {
                          if (!result.committed) {
                            return res.status(200).send('Failed to play card');
                          }

                          const updates = {};

                          updates.nextTimestamp = (Date.now() + 1000 * speed) + 500;
                          updates[`players/${playerPosition}/cards`] = newCards;
                          updates[`curRnd/currentTable/${playedCards}/card`] = playedCard;
                          updates[`curRnd/currentTable/${playedCards}/player`] = playerPosition;

                          admin.database().ref(`rooms/${roomId}`).update(updates);

                          admin.database().ref(`adminLogs/rooms/${roomId}/${party}`).push({
                            time: Date.now(),
                            roomId,
                            type: 'cardPlayed',
                            data: {
                              player: name,
                              playerUid: decoded.uid,
                              playedCard,
                            },
                          });

                          return res.status(200).send({ data: 'Card played' });
                        });
                    } else {
                      return res.status(200).send({ data: 'Already 3 cards on table' });
                    }
                  } else {
                    return res.status(200).send({ data: 'Is not players turn or played card is not in his hand' });
                  }
                } else if (globalParams.gameState === 'burry') {
                  if (currentStatus.currentTurn === playerPosition && playedCard) {
                    admin.database().ref(`rooms/${roomId}/players/${playerPosition}/cards`).transaction((cards2) => {
                      if (cards2 && cards2.length) {
                        if (cards2.length && cards2.length <= 8) {
                          console.log('already played card');
                          return; // Abort the transaction.
                        }

                        const index = cards2.indexOf(playedCard);
                        if (index === -1) {
                          return; // Abort the transaction.
                        }

                        cards2.splice(index, 1);
                      }
                      return cards2;
                    })
                      .then((result) => {
                        if (!result.committed) {
                          return res.status(200).send('Failed burry card');
                        }

                        const newCards = result.snapshot.val() || null;

                        if (!newCards) {
                          console.log('Error no newCards');
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
                            .transaction(pnts => (pnts || 0) + pointsChange);

                          admin.database().ref(`adminLogs/rooms/${roomId}/${party}`).push({
                            time: Date.now(),
                            roomId,
                            type: 'burriedCard',
                            data: {
                              burriedCard: playedCard,
                              newPnts: pointsChange,
                            },
                          });
                          return res.status(200).send({ data: 'Card burried' });
                        } if (newCards.length === 8) {
                          const nextPosition = firstToGo;

                          const updates = {};

                          updates.nextTimestamp = (Date.now() + 1000 * speed) + 500;
                          updates['globalParams/gameState'] = 'play';
                          updates['curRnd/currentTurn'] = nextPosition;
                        //  updates.nextTimestamp = (Date.now() + 1000 * speed) + 500;

                          admin.database().ref(`rooms/${roomId}`).update(updates);

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
                            .transaction(pnts => (pnts || 0) + pointsChange);

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

                          return res.status(200).send({ data: 'Card burried' });
                        }
                      });
                  } else {
                    return res.status(200).send({ data: 'Is not players turn or played card is not in his hand' });
                  }
                } else {
                  return res.status(200).send({ data: 'Cannot currently play card' });
                }

              //  });
              })
                .catch((err) => {
                  console.log(err);
                  return res.status(200).send({ data: 'Error' });
                });
            } else {
              return res.status(200).send({ data: 'Error playing card' });
            }
          } else {
            // Regular rooms

            // eslint-disable-next-line
            if (playerPosition) {
              const promise4 = admin.database().ref(`rooms/${roomId}/players/${playerPosition}/cards`).once('value');
              const promise5 = admin.database().ref(`gameSettings/${globalParams.fastGame ? 'fastSpeed' : 'normalSpeed'}`).once('value');
              const promise6 = admin.database().ref(`rooms/${roomId}/players/${firstToGo}/name`).once('value');
              const promise7 = admin.database().ref(`rooms/${roomId}/players/${playerPosition}/name`).once('value');

              Promise.all([promise4, promise5, promise6, promise7]).then((results2) => {
                let cards;
                let speed;
                let nextPlayerName;
                let name;
                results2.forEach((result, index) => {
                  if (index === 0) {
                    cards = result.val() || {};
                  } else if (index === 1) {
                    speed = result.val() || 15;
                  } else if (index === 2) {
                    nextPlayerName = result.val() || '';
                  } else if (index === 3) {
                    name = result.val() || '';
                  }
                });

                const { party } = globalParams;

                let playedCard;
                if (cards) {
                  playedCard = cards.find(cardObj => cardObj === card);
                } else {
                  playedCard = null;
                }

                if (globalParams.gameState === 'play') {
                  if (currentStatus.currentTurn === playerPosition && playedCard) {
                    if (!currentStatus.currentTable) {
                      const newCards = cards;
                      const index = newCards.indexOf(playedCard);

                      if (index !== -1) newCards.splice(index, 1);

                      let nextPosition;
                      if (playerPosition === 'player1') {
                        nextPosition = 'player2';
                      } else if (playerPosition === 'player2') {
                        nextPosition = 'player3';
                      } else if (playerPosition === 'player3') {
                        nextPosition = 'player1';
                      }

                      let playedCards;
                      if (currentStatus.currentTable === undefined) {
                        playedCards = 0;
                      } else if (Object.keys(currentStatus.currentTable).length === 1) {
                        playedCards = 1;
                      } else if (Object.keys(currentStatus.currentTable).length === 2) {
                        playedCards = 2;
                      }

                      admin.database().ref(`rooms/${roomId}/curRnd/currentTurn`).transaction((currentTurn) => {
                        if (currentTurn && currentTurn !== playerPosition) {
                          console.log('already played card');
                          return; // Abort the transaction.
                        }
                        return nextPosition;
                      })
                        .then((result) => {
                          if (!result.committed) {
                            return res.status(200).send('Failed to play card');
                          }

                          const updates = {};

                          updates.nextTimestamp = (Date.now() + 1000 * speed) + 500;
                          updates[`players/${playerPosition}/cards`] = newCards;
                          updates[`curRnd/currentTable/${playedCards}/card`] = playedCard;
                          updates[`curRnd/currentTable/${playedCards}/player`] = playerPosition;

                          admin.database().ref(`rooms/${roomId}`).update(updates);

                          admin.database().ref(`adminLogs/rooms/${roomId}/${party}`).push({
                            time: Date.now(),
                            roomId,
                            type: 'cardPlayed',
                            data: {
                              player: name,
                              playerUid: decoded.uid,
                              playedCard,
                            },
                          });

                          return res.status(200).send({ data: 'Card played' });
                        });
                    } else if (Object.keys(currentStatus.currentTable).length < 3) {
                      //  console.log('cur table has cards and less than 3');
                      let playerHasCards;

                      if (kreisti.indexOf(currentStatus.currentTable[0].card) !== -1) {
                        playerHasCards = cards.filter(value => kreisti.includes(value));
                      } else if (erci.indexOf(currentStatus.currentTable[0].card) !== -1) {
                        playerHasCards = cards.filter(value => erci.includes(value));
                      } else if (piki.indexOf(currentStatus.currentTable[0].card) !== -1) {
                        playerHasCards = cards.filter(value => piki.includes(value));
                      } else {
                        playerHasCards = cards.filter(value => trumpji.includes(value));
                      }

                      if (playerHasCards !== null && playerHasCards !== undefined
                          && playerHasCards && playerHasCards.length > 0) {
                        if (!playerHasCards.includes(playedCard)) {
                          return res.status(200).send({ data: 'Cannot play that card' });
                        }
                      }

                      const newCards = cards;
                      const index = newCards.indexOf(playedCard);
                      if (index !== -1) newCards.splice(index, 1);


                      let nextPosition;
                      if (playerPosition === 'player1') {
                        nextPosition = 'player2';
                      } else if (playerPosition === 'player2') {
                        nextPosition = 'player3';
                      } else if (playerPosition === 'player3') {
                        nextPosition = 'player1';
                      }

                      let playedCards = 0;

                      if (Object.keys(currentStatus.currentTable).length === 1) {
                        playedCards = 1;
                      } else if (Object.keys(currentStatus.currentTable).length === 2) {
                        playedCards = 2;
                        nextPosition = null;
                      }

                      admin.database().ref(`rooms/${roomId}/curRnd/currentTurn`).transaction((currentTurn) => {
                        if (currentTurn && currentTurn !== playerPosition) {
                          //  console.log('already played card');
                          return; // Abort the transaction.
                        }
                        return nextPosition;
                      })
                        .then((result) => {
                          if (!result.committed) {
                            return res.status(200).send('Failed to play card');
                          }

                          const updates = {};

                          updates.nextTimestamp = (Date.now() + 1000 * speed) + 500;
                          updates[`players/${playerPosition}/cards`] = newCards;
                          updates[`curRnd/currentTable/${playedCards}/card`] = playedCard;
                          updates[`curRnd/currentTable/${playedCards}/player`] = playerPosition;

                          admin.database().ref(`rooms/${roomId}`).update(updates);

                          admin.database().ref(`adminLogs/rooms/${roomId}/${party}`).push({
                            time: Date.now(),
                            roomId,
                            type: 'cardPlayed',
                            data: {
                              player: name,
                              playerUid: decoded.uid,
                              playedCard,
                            },
                          });

                          return res.status(200).send({ data: 'Card played' });
                        });
                    } else {
                      return res.status(200).send({ data: 'Already 3 cards on table' });
                    }
                  } else {
                    return res.status(200).send({ data: 'Is not players turn or played card is not in his hand' });
                  }
                } else if (globalParams.gameState === 'burry') {
                  if (currentStatus.currentTurn === playerPosition && playedCard) {
                    admin.database().ref(`rooms/${roomId}/players/${playerPosition}/cards`).transaction((cards2) => {
                      if (cards2 && cards2.length) {
                        if (cards2.length && cards2.length <= 8) {
                          console.log('already played card');
                          return; // Abort the transaction.
                        }

                        const index = cards2.indexOf(playedCard);
                        if (index === -1) {
                          return; // Abort the transaction.
                        }

                        cards2.splice(index, 1);
                      }
                      return cards2;
                    })
                      .then((result) => {
                        if (!result.committed) {
                          return res.status(200).send('Failed burry card');
                        }

                        const newCards = result.snapshot.val() || null;

                        if (!newCards) {
                          console.log('Error no newCards');
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
                            .transaction(pnts => (pnts || 0) + pointsChange);

                          admin.database().ref(`adminLogs/rooms/${roomId}/${party}`).push({
                            time: Date.now(),
                            roomId,
                            type: 'burriedCard',
                            data: {
                              burriedCard: playedCard,
                              newPnts: pointsChange,
                            },
                          });
                          return res.status(200).send({ data: 'Card burried' });
                        } if (newCards.length === 8) {
                          const nextPosition = firstToGo;

                          const updates = {};

                          updates.nextTimestamp = (Date.now() + 1000 * speed) + 500;
                          updates['globalParams/gameState'] = 'play';
                          updates['curRnd/currentTurn'] = nextPosition;
                        //  updates.nextTimestamp = (Date.now() + 1000 * speed) + 500;

                          admin.database().ref(`rooms/${roomId}`).update(updates);

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
                            .transaction(pnts => (pnts || 0) + pointsChange);

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

                          return res.status(200).send({ data: 'Card burried' });
                        }
                      });
                  } else {
                    return res.status(200).send({ data: 'Is not players turn or played card is not in his hand' });
                  }
                } else {
                  return res.status(200).send({ data: 'Cannot currently play card' });
                }

                //  });
              })
                .catch((err) => {
                  console.log(err);
                  return res.status(200).send({ data: 'Error' });
                });


            //  return res.status(200).send({ data: 'Error playing card' });
            } else {
              return res.status(200).send({ data: 'Error playing card' });
            }
          }
        //  });
          //    });
          //  });
        })
          .catch((err) => {
            console.log(err);
            return res.status(200).send({ data: 'Error' });
          });
      })
      .catch((err) => {
        console.log(err);
        return res.status(200).send({ data: 'Error' });
      });
  });
};

module.exports = playCard;
