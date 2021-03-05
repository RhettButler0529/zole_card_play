
const closeResultNotification = (req, res) => {
  const cors = require('cors')({ origin: true });
  const { admin } = require('../admin');

  cors(req, res, () => {
    if (!req.body || !req.body.data) {
      return res.status(200).send({ data: 'no req body data' });
    }

    const {
      roomId,
      init,
    } = req.body.data;

    if (init) {
      admin.database().ref(`rooms/${roomId}/init`).transaction((_init) => {
        const lastInit = _init || false;
        return !lastInit;
      });

      return res.status(200).send({ data: 'initialized' });
    }

    if (req.get('Authorization')) {
    const tokenId = req.get('Authorization').split('Bearer ')[1];

    admin.auth().verifyIdToken(tokenId)
      .then((decoded) => {
      //  log(roomId, `closeResultNotification: decoded.uid: ${decoded.uid}`);

        if (!decoded.uid) {
          return res.status(200).send({ data: 'no auth token' });
        }

        const promise1 = admin.database().ref(`rooms/${roomId}/playersList/playerList`).once('value');
        const promise2 = admin.database().ref(`gameSettings`).once('value');
        const promise3 = admin.database().ref(`rooms/${roomId}/nextTimestamp`).once('value');

        Promise.all([promise1, promise2, promise3]).then((promiseRes) => {
          let players;
          let gameSettings;
          let nextTimestamp;

          promiseRes.map((response, index) => {
            if (index === 0) {
              players = response.val() || {};
            } else if (index === 1) {
              gameSettings = response.val();
            } else if (index === 2) {
              nextTimestamp = response.val() || null;
            }

            return null;
          });

          if (nextTimestamp < Date.now()) {
            admin.database().ref(`rooms/${roomId}/globalParams`).transaction((globalParams) => {
              if (globalParams === null) return globalParams;

            //  log(roomId, `closeResultNotification: gameState: ${globalParams.gameState}`);

              if (globalParams && globalParams.gameState === 'results') {
                const { lowBalPlayers, roomClosed } = globalParams;

                if (lowBalPlayers) {
                  return {
                    ...globalParams,
                    gameResult: null,
                    gameState: 'lowBal',
                    playerQuitRound: null,
                  };
                } else if (roomClosed) {
                  return {
                    ...globalParams,
                    gameResult: null,
                    gameState: null,
                  };
                }
                return {
                  ...globalParams,
                  gameResult: null,
                  gameState: 'choose',
                  playerQuitRound: null,
                  nextRoundAccept: null,
                };
              }

              return;

              // abort
            }).then((result) => {
              if (result.committed) {
                const committedGlobalParams = result.snapshot.val() || {};

                const { lowBalPlayers } = committedGlobalParams;

                if (lowBalPlayers) {
                  admin.database().ref(`rooms/${roomId}/nextTimestamp`).set(Date.now() + 1000 * 15);

                  return res.status(200).send({ data: { status: 'success' } });
                }

                admin.database().ref(`rooms/${roomId}/globalParams/currentHand`).set(1);
                admin.database().ref(`rooms/${roomId}/curRnd/currentTable`).remove();

                //  const promise4 = admin.database().ref(`gameSettings/${committedGlobalParams.fastGame ? 'fastSpeed' : 'normalSpeed'}`).once('value');

                let speed = 15;
                if (committedGlobalParams.fastGame) {
                  speed = gameSettings.fastSpeed;
                } else {
                  speed = gameSettings.normalSpeed;
                }

                if (players) {
                  Object.keys(players).map((key) => {
                    admin.database().ref(`users/${key}`).update({
                      lvlUpNotification: false,
                    });
                  });
                }

                admin.database().ref(`rooms/${roomId}/nextTimestamp`).set((Date.now() + 1000 * speed) + 500);

                return res.status(200).send({ data: { status: 'success' } });
              } else {
                if (result.error) {
                //  log(roomId, 'closeResultNotification: error storing globalParams');
                  return res.status(200).send({ data: { status: 'error', error: 'error storing globalParams' } });
                }

              //  log(roomId, 'closeResultNotification: gameState not results');
                return res.status(200).send({ data: { status: 'error', error: 'gameState not results' } });
              }
            })
              .catch((err) => {
                console.log(err);
              //  log(roomId, `closeResultNotification: err: ${err}`);
                return res.status(200).send({ data: { status: 'error', error: err } });
              });

          } else {
            const playerPosition = players[decoded.uid] || null;

            if (playerPosition) {
              admin.database().ref(`rooms/${roomId}/globalParams`).transaction((globalParams) => {
                if (globalParams === null) return globalParams;

                if (globalParams && globalParams.gameState === 'results' && (!globalParams.nextRoundAccept || !globalParams.nextRoundAccept[playerPosition])) {
                  const { lowBalPlayers, roomClosed, nextRoundAccept } = globalParams;

                  let newNextRoundAccept = { ...nextRoundAccept };

                  if (playerPosition) {
                    if (!nextRoundAccept || (nextRoundAccept && !nextRoundAccept[playerPosition])) {
                      newNextRoundAccept[playerPosition] = true;
                    }
                  }

                  if (lowBalPlayers) {
                  //  return {
                    //  ...globalParams,
                    //  gameResult: null,
                    //  gameState: 'lowBal',
                    //  playerQuitRound: null,
                  //  };
                  } else if (roomClosed) {
                    return {
                      ...globalParams,
                      gameResult: null,
                      gameState: null,
                    };
                  }
                  return {
                    ...globalParams,
                  //  gameResult: null,
                  //  gameState: 'choose',
                  //  playerQuitRound: null,
                    nextRoundAccept: newNextRoundAccept,
                  };
                }

                return;

                // abort
              }).then((result) => {
                if (result.committed) {
                  const committedGlobalParams = result.snapshot.val() || {};

                  const { lowBalPlayers, nextRoundAccept } = committedGlobalParams;

                  if (lowBalPlayers) {
                    admin.database().ref(`rooms/${roomId}/nextTimestamp`).set(Date.now() + 1000 * 15);

                    return res.status(200).send({ data: { status: 'success' } });
                  }

                  if (nextRoundAccept && nextRoundAccept.player1 && nextRoundAccept.player2 && nextRoundAccept.player3) {
                    admin.database().ref(`rooms/${roomId}/globalParams`).update({
                      gameResult: null,
                      gameState: 'choose',
                      playerQuitRound: null,
                      nextRoundAccept: null,
                    });

                    admin.database().ref(`rooms/${roomId}/globalParams/currentHand`).set(1);
                    admin.database().ref(`rooms/${roomId}/curRnd/currentTable`).remove();

                  /*  const promise3 = admin.database().ref(`rooms/${roomId}/playersList/playerList`).once('value');
                    const promise4 = admin.database().ref(`gameSettings/${committedGlobalParams.fastGame ? 'fastSpeed' : 'normalSpeed'}`).once('value');

                    Promise.all([promise3, promise4]).then((promiseRes) => {
                      let players;
                      let speed = 15;

                      promiseRes.map((response, index) => {
                        if (index === 0) {
                          players = response.val();
                        } else if (index === 1) {
                          speed = response.val();
                        }

                        return null;
                      }); */

                      let speed = 15;
                      if (committedGlobalParams.fastGame) {
                        speed = gameSettings.fastSpeed;
                      } else {
                        speed = gameSettings.normalSpeed;
                      }

                      if (players) {
                        Object.keys(players).map((key) => {
                          admin.database().ref(`users/${key}`).update({
                            lvlUpNotification: false,
                          });
                        });
                      }

                    //  admin.database().ref(`rooms/${roomId}`).update({
                    //    nextTimestamp: (Date.now() + 1000 * speed) + 500,
                    //  });

                      admin.database().ref(`rooms/${roomId}/nextTimestamp`).set((Date.now() + 1000 * speed) + 500);

                    //  log(roomId, 'closeResultNotification: > end');

                      return res.status(200).send({ data: { status: 'success' } });
                  //  });
                  } else {
                    return res.status(200).send({ data: { status: 'success' } });
                  }
                } else {
                  if (result.error) {
                  //  log(roomId, 'closeResultNotification: error storing globalParams');
                    return res.status(200).send({ data: { status: 'error', error: 'error storing globalParams' } });
                  }

                //  log(roomId, 'closeResultNotification: gameState not results');
                  return res.status(200).send({ data: { status: 'error', error: 'gameState not results' } });
                }
              })
            .catch((err) => {
              console.log(err);
            //  log(roomId, `closeResultNotification: err: ${err}`);
              return res.status(200).send({ data: { status: 'error', error: err } });
            });
          } else {
              console.log('no player position');
              return res.status(200).send({ data: { status: 'error', error: 'not in room' } })
            }
          }
        }).catch(err => res.status(200).send({ data: { status: 'error', error: err } }));
      }).catch((err) => {
      //  log(roomId, `closeResultNotification: err #2: ${err}`);
        return res.status(200).send({ data: { status: 'error', error: err } });
      });
    } else {
      console.log('no auth');
      console.log(req.body.data);
      console.log(req);

      return res.status(200).send({ data: { status: 'error', message: 'no auth' } });
    }
  });
};

module.exports = closeResultNotification;
