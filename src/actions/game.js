import { Firebase, FirebaseRef, StatusRef, RoomsRef } from '../lib/firebase';
// import smartlookClient from 'smartlook-client';

// import ReactGA from 'react-ga';

import { Event } from '../web/components/Tracking';

function getPlayersChild (roomId, dispatch, type, player, key, data, myPos) {
  if (type === 'child_added' || type === 'child_changed') {
    if (key === 'emotion' && myPos === player && data) {
      setTimeout(() => {
        try {
          RoomsRef.child(`rooms/${roomId}/playersList/${player}/emotion`).remove()
          .catch(err => {});
        } catch(err) {
          console.log(err);
        }
      }, 3000);
    }
  }

  let dispatchType;
  if (player === 'player1') {
    dispatchType = 'PLAYERS_1_UPDATE';
  } else if (player === 'player2') {
    dispatchType = 'PLAYERS_2_UPDATE';
  } else if (player === 'player3') {
    dispatchType = 'PLAYERS_3_UPDATE';
  }

  if (dispatchType) {
    if (type === 'child_removed') {
      dispatch({
        type: dispatchType,
        data: null,
        key,
        roomId,
      });
    } else {
      dispatch({
        type: dispatchType,
        data,
        key,
        roomId,
      });
    }
  }
}

export function getCards(roomId) {
  if (Firebase === null) return () => new Promise(resolve => resolve());

  const UID =
    FirebaseRef &&
    Firebase &&
    Firebase.auth() &&
    Firebase.auth().currentUser &&
    Firebase.auth().currentUser.uid
      ? Firebase.auth().currentUser.uid
      : null;

  if (!UID) return () => new Promise(resolve => resolve());

  return dispatch =>
    new Promise(resolve => {
      RoomsRef.child(`rooms/${roomId}/playersList/playerList/${UID}`).on(
        'value',
        playerPosSnapshot => {
          const playerPos = playerPosSnapshot.val() || '';

          RoomsRef.child(
            `rooms/${roomId}/playersList/playerList/${UID}`
          ).off();

          RoomsRef.child(`rooms/${roomId}/players/${playerPos}/cards`).on(
            'value',
            snapshot => {
              const data = snapshot.val() || [];

            //  console.log('CARDS data');
            //  console.log(data);

              /*  FirebaseRef.child(`rooms/${roomId}/players/${playerPos}/cards`).off();

          FirebaseRef.child(`rooms/${roomId}/players/${playerPos}/cards`)
            .on('child_added', (snapshot2) => {
              const data2 = snapshot2.val() || null;
              const { key } = snapshot2;

              console.log('child_added');

              return resolve(dispatch({
                type: 'CARDS_UPDATE', data: data2, roomId, key,
              }));
            });

          FirebaseRef.child(`rooms/${roomId}/players/${playerPos}/cards`)
            .on('child_changed', (snapshot2) => {
              const data2 = snapshot2.val() || null;
              const { key } = snapshot2;

              console.log('child_changed');

              return resolve(dispatch({
                type: 'CARDS_UPDATE', data: data2, roomId, key,
              }));
            });

          FirebaseRef.child(`rooms/${roomId}/players/${playerPos}/cards`)
            .on('child_removed', (snapshot2) => {
              //  const data = snapshot2.val() || null;
              const { key } = snapshot2;

              console.log('child_removed');

              return resolve(dispatch({
                type: 'CARDS_UPDATE', data: null, roomId, key,
              }));
            }); */

              return resolve(dispatch({ type: 'CARDS_REPLACE', data, roomId }));
            },
            (err) => {
              console.log(err);
            }
          );
        }
      )
    }).catch(err => {
      throw err.message;
    });
}

export function getGameSettings() {
  if (Firebase === null) return () => new Promise(resolve => resolve());

  const UID =
    FirebaseRef &&
    Firebase &&
    Firebase.auth() &&
    Firebase.auth().currentUser &&
    Firebase.auth().currentUser.uid
      ? Firebase.auth().currentUser.uid
      : null;

  if (!UID) return () => new Promise(resolve => resolve());

  return dispatch =>
    new Promise(resolve =>
      FirebaseRef.child('gameSettings').once('value', snapshot => {
        const gameSettings = snapshot.val() || {};

        return resolve(dispatch({ type: 'GAME_SETTINGS', data: gameSettings }));
      })
    );
}

export function getCurrentTable(roomId) {
  if (Firebase === null) return () => new Promise(resolve => resolve());

  return dispatch =>
    new Promise(resolve =>
      RoomsRef.child(`rooms/${roomId}/curRnd/currentTable`).on(
        'value',
        snapshot => {
          const data = snapshot.val() || [];

          console.log('currentTable');
          console.log(data);

          return resolve(
            dispatch({ type: 'CURRENT_TABLE_REPLACE', data, roomId })
          );
        }, errorObject => {
          console.log("current Table read failed: " + errorObject.code);
        }
      )
    ).catch(err => {
      throw err.message;
    });
}

export function getCurrentTurn(roomId) {
  if (Firebase === null) return () => new Promise(resolve => resolve());

  return dispatch =>
    new Promise(resolve =>
      RoomsRef.child(`rooms/${roomId}/curRnd/currentTurn`).on(
        'value',
        snapshot => {
          const data = snapshot.val() || null;

          console.log('currentTurn');
          console.log(data);

          return resolve(
            dispatch({ type: 'CURRENT_TURN_REPLACE', data, roomId })
          );
        }, errorObject => {
          console.log("Turn read failed: " + errorObject.code);
        }
      )
    ).catch(err => {
      throw err.message;
    });
}

export function getLargePlayer(roomId) {
  if (Firebase === null) return () => new Promise(resolve => resolve());

  return dispatch =>
    new Promise(resolve =>
      RoomsRef.child(`rooms/${roomId}/curRnd/largePlayer`).on(
        'value',
        snapshot => {
          const data = snapshot.val() || null;

          console.log('largePlayer');
          console.log(data);

          return resolve(
            dispatch({ type: 'LARGE_PLAYER_REPLACE', data, roomId })
          );
        }, errorObject => {
          console.log("Large player read failed: " + errorObject.code);
        }
      )
    ).catch(err => {
      throw err.message;
    });
}

export function getCurrentType(roomId) {
  console.log('getCurrentType');
  console.log(roomId);
  if (Firebase === null) return () => new Promise(resolve => resolve());

  console.log('test1');

  return dispatch =>
    new Promise(resolve => {
      console.log('test2');
      try {
        return RoomsRef.child(`rooms/${roomId}/curRnd/type`).on('value', snapshot => {
          const data = snapshot.val() || null;

          console.log('type');
          console.log(data);

          return resolve(
            dispatch({ type: 'CURRENT_TYPE_REPLACE', data, roomId })
          );
        }, errorObject => {
          console.log("Type read failed: " + errorObject.code);
        })
      } catch (error) {
        console.log(error);
      }
    }
    ).catch(err => {
      console.log(err);
      throw err.message;
    });
}

export function getNextTimeStamp(roomId) {
  if (Firebase === null) return () => new Promise(resolve => resolve());

  return dispatch =>
    new Promise(resolve =>
      RoomsRef.child(`rooms/${roomId}/nextTimestamp`).on(
        'value',
        snapshot => {
          const data = snapshot.val() || null;

        //  console.log('nextTimestamp');
        //  console.log(data);

          return resolve(
            dispatch({ type: 'NEXT_TIMESTAMP_REPLACE', data, roomId })
          );
        }, errorObject => {
          console.log("Timestamp read failed: " + errorObject.code);
        }
      )
    ).catch(err => {
      throw err.message;
    });
}

/* export function getCurrentRound(roomId) {
  if (Firebase === null) return () => new Promise(resolve => resolve());

  return dispatch => new Promise(resolve => FirebaseRef.child(`rooms/${roomId}/curRnd`)
    .on('value', (snapshot) => {
      const data = snapshot.val() || {};
      return resolve(dispatch({ type: 'CURRENT_ROUND_REPLACE', data, roomId }));
    })).catch((err) => { throw err.message; });
} */

export function getGlobalParams(roomId) {
  if (Firebase === null) return () => new Promise(resolve => resolve());
  return dispatch =>
    new Promise(resolve => {
      RoomsRef.child(`rooms/${roomId}/globalParams`).once(
        'value',
        snapshot => {
          const data = snapshot.val() || {};
          dispatch({ type: 'GLOBAL_PARAMS_REPLACE', data, roomId });
        }
      );

      RoomsRef.child(`rooms/${roomId}/globalParams`).on(
        'child_changed',
        snapshot => {
          const roomData = snapshot.val() || null;
          const { key } = snapshot;

          const data = roomData;

          dispatch({
            type: 'GLOBAL_PARAMS_CHANGE',
            data: { roomData: data, key, roomId },
          });
        }
      );

      RoomsRef.child(`rooms/${roomId}/globalParams`).on(
        'child_added',
        snapshot => {
          const roomData = snapshot.val() || null;
          const { key } = snapshot;

          const data = roomData;

          dispatch({
            type: 'GLOBAL_PARAMS_ADDED',
            data: { roomData: data, key, roomId },
          });
        }
      );

      RoomsRef.child(`rooms/${roomId}/globalParams`).on(
        'child_removed',
        snapshot => {
          const { key } = snapshot;

          dispatch({ type: 'GLOBAL_PARAMS_REMOVED', data: { key, roomId } });
        }
      );

      //  resolve();
      /*  FirebaseRef.child(`rooms/${roomId}/globalParams`)
      .once('value', (snapshot) => {
        const data = snapshot.val() || {};
        return resolve(dispatch({ type: 'GLOBAL_PARAMS_REPLACE', data, roomId }));
      }); */

      return resolve();
    }).catch(err => {
      throw err.message;
    });
}

export function getPlayers(roomId) {
  if (Firebase === null) return () => new Promise(resolve => resolve());
  return (dispatch, getState) =>
    new Promise(resolve => {
      RoomsRef.child(`rooms/${roomId}/playersList`).once(
        'value',
        snapshot => {
          const data = snapshot.val() || {};

          return resolve(dispatch({ type: 'PLAYERS_REPLACE', data, roomId }));
        }
      );

      RoomsRef.child(`rooms/${roomId}/playersList/player1`).on(
        'child_added', snapshot => {
          const data = snapshot.val();
          const { key } = snapshot;

          if (key === 'emotion') {
            const { game } = getState();

            getPlayersChild(roomId, dispatch, 'child_added', 'player1', key, data, game.myPos);
          } else {
            getPlayersChild(roomId, dispatch, 'child_added', 'player1', key, data, null);
          }
        }
      );

      RoomsRef.child(`rooms/${roomId}/playersList/player2`).on(
        'child_added', snapshot => {
          const data = snapshot.val();
          const { key } = snapshot;

          if (key === 'emotion') {
            const { game } = getState();

            getPlayersChild(roomId, dispatch, 'child_added', 'player2', key, data, game.myPos);
          } else {
            getPlayersChild(roomId, dispatch, 'child_added', 'player2', key, data, null);
          }
        }
      );

      RoomsRef.child(`rooms/${roomId}/playersList/player3`).on(
        'child_added', snapshot => {
          const data = snapshot.val();
          const { key } = snapshot;

          if (key === 'emotion') {
            const { game } = getState();

            getPlayersChild(roomId, dispatch, 'child_added', 'player3', key, data, game.myPos);
          } else {
            getPlayersChild(roomId, dispatch, 'child_added', 'player3', key, data, null);
          }
        }
      );

      RoomsRef.child(`rooms/${roomId}/playersList/player1`).on(
        'child_changed', snapshot => {
          const data = snapshot.val();
          const { key } = snapshot;

          if (key === 'emotion') {
            const { game } = getState();

            getPlayersChild(roomId, dispatch, 'child_changed', 'player1', key, data, game.myPos);
          } else {
            getPlayersChild(roomId, dispatch, 'child_changed', 'player1', key, data, null);
          }
        }
      );

      RoomsRef.child(`rooms/${roomId}/playersList/player2`).on(
        'child_changed', snapshot => {
          const data = snapshot.val();
          const { key } = snapshot;

          if (key === 'emotion') {
            const { game } = getState();

            getPlayersChild(roomId, dispatch, 'child_changed', 'player2', key, data, game.myPos);
          } else {
            getPlayersChild(roomId, dispatch, 'child_changed', 'player2', key, data, null);
          }
        }
      );

      RoomsRef.child(`rooms/${roomId}/playersList/player3`).on(
        'child_changed', snapshot => {
          const data = snapshot.val();
          const { key } = snapshot;

          if (key === 'emotion') {
            const { game } = getState();

            getPlayersChild(roomId, dispatch, 'child_changed', 'player3', key, data, game.myPos);
          } else {
            getPlayersChild(roomId, dispatch, 'child_changed', 'player3', key, data, null);
          }
        }
      );

      RoomsRef.child(`rooms/${roomId}/playersList/player1`).on(
        'child_removed', snapshot => {
          const { key } = snapshot;

          if (key === 'emotion') {
            const { game } = getState();

            getPlayersChild(roomId, dispatch, 'child_removed', 'player1', key, null, game.myPos);
          } else {
            getPlayersChild(roomId, dispatch, 'child_removed', 'player1', key, null, null);
          }
        }
      );

      RoomsRef.child(`rooms/${roomId}/playersList/player2`).on(
        'child_removed', snapshot => {
          const { key } = snapshot;

          if (key === 'emotion') {
            const { game } = getState();

            getPlayersChild(roomId, dispatch, 'child_removed', 'player2', key, null, game.myPos);
          } else {
            getPlayersChild(roomId, dispatch, 'child_removed', 'player2', key, null, null);
          }
        }
      );

      RoomsRef.child(`rooms/${roomId}/playersList/player3`).on(
        'child_removed', snapshot => {
          const { key } = snapshot;

          if (key === 'emotion') {
            const { game } = getState();

            getPlayersChild(roomId, dispatch, 'child_removed', 'player3', key, null, game.myPos);
          } else {
            getPlayersChild(roomId, dispatch, 'child_removed', 'player3', key, null, null);
          }
        }
      );

      return resolve();

      //  FirebaseRef.child(`rooms/${roomId}/playersList`)
      //    .on('value', (snapshot) => {
      //      const data = snapshot.val() || {};

      //      return resolve(dispatch({ type: 'PLAYERS_REPLACE', data, roomId }));
      //    });
    }).catch(err => {
      throw err.message;
    });
}

export function getPlayerPosition(roomId) {
  if (Firebase === null) return () => new Promise(resolve => resolve());

  const UID =
    FirebaseRef &&
    Firebase &&
    Firebase.auth() &&
    Firebase.auth().currentUser &&
    Firebase.auth().currentUser.uid
      ? Firebase.auth().currentUser.uid
      : null;

  if (!UID) return () => new Promise(resolve => resolve());

  return dispatch =>
    new Promise(resolve =>
      RoomsRef.child(`rooms/${roomId}/playersList/playerList/${UID}`).on(
        'value',
        snapshot => {
          const data = snapshot.val() || null;

          return resolve(
            dispatch({ type: 'PLAYER_POSITION_REPLACE', data, roomId })
          );
        }
      )
    ).catch(err => {
      throw err.message;
    });
}

export function getPoints(roomId) {
  if (Firebase === null) return () => new Promise(resolve => resolve());
  return dispatch =>
    new Promise(resolve => {
      RoomsRef.child(`rooms/${roomId}/points/total`).on(
        'value',
        snapshot => {
          const data = snapshot.val() || {};

          dispatch({ type: 'POINTS_TOTAL', data, roomId });
        }
      );

      RoomsRef.child(`rooms/${roomId}/points/rounds`).on(
        'value',
        snapshot => {
          const data = snapshot.val() || {};

          dispatch({ type: 'POINTS_REPLACE', data, roomId });
        }
      );

      /*
      FirebaseRef.child(`rooms/${roomId}/points/rounds`)
      .on('child_added', (snapshot2) => {
        const data = snapshot2.val() || null;
        const { key } = snapshot2;

        dispatch({
          type: 'POINTS_CHANGE', data, key, roomId,
        });
      });

    FirebaseRef.child(`rooms/${roomId}/points/rounds`)
      .on('child_changed', (snapshot2) => {
        const data = snapshot2.val() || null;
        const { key } = snapshot2;

        dispatch({
          type: 'POINTS_CHANGE', data, key, roomId,
        });
      });
      */

      //  FirebaseRef.child(`rooms/${roomId}/points/rounds`)
      //    .on('child_removed', (snapshot2) => {
      //      const { key } = snapshot2;

      //      dispatch({ type: 'POINTS_REMOVED', data: { key, roomId } });
      //    });

      return resolve();
      //  return resolve(dispatch({ type: 'POINTS_REPLACE', data, roomId }));
    }).catch(err => {
      throw err.message;
    });
}

/*
export function getCardPlayed(roomId) {
  if (Firebase === null) return () => new Promise(resolve => resolve());
  return dispatch =>
    new Promise(resolve =>
      FirebaseRef.child(`rooms/${roomId}/curRnd/cardPlayed`).on(
        'value',
        snapshot => {
          const data = snapshot.val() || null;

          return resolve(dispatch({ type: 'SET_CARD_PLAYED', data, roomId }));
        }
      )
    ).catch(err => {
      throw err.message;
    });
} */

export function getPreviousRound(roomId) {
  if (Firebase === null) return () => new Promise(resolve => resolve());

  return dispatch =>
    new Promise(resolve =>
      RoomsRef.child(`rooms/${roomId}/previousRound`).once(
        'value',
        snapshot => {
          const data = snapshot.val() || {};

          return resolve(
            dispatch({ type: 'SET_PREVIOUS_ROUND_DATA', data, roomId })
          );
        }
      )
    ).catch(err => {
      throw err.message;
    });
}

export function playCard(selectedCard, roomId, init, myPos, gameState) {
  if (Firebase === null) return () => new Promise(resolve => resolve());

  return dispatch =>
    new Promise((resolve, reject) => {
    //  const playCardFunction = Firebase.app()
    //    .functions()
    //    .httpsCallable('playCard');

    //    Firebase.auth().currentUser.getIdToken().then((idToken) => {
    //  FirebaseRef.child(`rooms/${roomId}/globalParams/gameState`).once('value',
    //    snapshot => {
    //      const gameState = snapshot.val() || null;

          if (gameState === 'play' || !gameState) {
          /*  FirebaseRef.child(`rooms/${roomId}/curRnd/cardPlayed`).set(
              selectedCard
            )
            .catch((err) => {
              console.log('playCard err');
              console.log(err);
            }); */

        /*    RoomsRef.child(`rooms/${roomId}/curRnd/cardPlayed2`)
              .transaction(cardPlayed2 => {
              //  console.log('cardPlayed2');
              //  console.log(cardPlayed2);
                if (cardPlayed2 === 0 || cardPlayed2 === '0') {
                  return selectedCard;
                }

                if (cardPlayed2 !== null && cardPlayed2 !== 0 && cardPlayed2 !== '0') {
                  return;
                }

              //  if (cardPlayed === null) {
                  return selectedCard;
              //  }

              //  return;
            }); */

            RoomsRef.child(`rooms/${roomId}/curRnd/cardPlayed2`)
              .transaction(cardPlayed2 => {
                if (cardPlayed2 === 0 || cardPlayed2 === '0') {
                  return selectedCard;
                }

                if (cardPlayed2 !== null && cardPlayed2 !== 0 && cardPlayed2 !== '0') {
                  return;
                }

              //  if (cardPlayed === null) {
                  return selectedCard;
              //  }

              //  return;
              }).then(result => {
                if (!result.committed) {
                  return reject();
                }

                Event("Game", "Play card", null);

                return resolve();
              }).catch((err) => {
                console.log(err);
                return reject();
              });

          //  ReactGA.event({
          //    category: 'Game',
          //    action: 'Play card'
          //  });

          //  return resolve();
          } else if (gameState === 'burry') {
            RoomsRef.child(`rooms/${roomId}/curRnd/cardBurried`)
              .transaction(cardBurried => {
                if (cardBurried === 0 || cardBurried === '0') {
                  return selectedCard;
                }

                if (cardBurried !== null && cardBurried !== 0 && cardBurried !== '0') {
                  return;
                }

                return selectedCard;
              }).then(result => {
                if (!result.committed) {
                  return reject();
                }

                Event("Game", "Burried card", null);

                return resolve();
              }).catch((err) => {
                console.log(err);
                return reject();
              });

          /*  playCardFunction({
              roomId,
              card: selectedCard,
              init,
            })
              .then(res => {
              //  ReactGA.event({
              //    category: 'Game',
              //    action: 'Burried card'
              //  });

                Event("Game", "Burried card", null);

                return resolve(res)
              })
              .catch(err => {
                console.log(err);
                return reject(err);
              }); */
          } else {
            return resolve();
          }
      //  });
    //    }
    //  );
    });
}

export function selectGameType({ selectedType }, roomId, init) {
  if (Firebase === null) return () => new Promise(resolve => resolve());

  const UID =
    FirebaseRef &&
    Firebase &&
    Firebase.auth() &&
    Firebase.auth().currentUser &&
    Firebase.auth().currentUser.uid
      ? Firebase.auth().currentUser.uid
      : null;

  if (!UID) return () => new Promise(resolve => resolve());

  return () => new Promise(() => {
  //  Firebase.auth().currentUser.getIdToken().then(() => {

      const chooseType = Firebase.app()
        .functions()
        .httpsCallable('chooseGameType');

      chooseType({
        roomId,
        selectedType,
        init: !!init,
      });
  //  });

    Event("Game", "Choose game type", null);
  });
}

export function setLastRound(roomId, init) {
  if (Firebase === null) return () => new Promise(resolve => resolve());

  const UID =
    FirebaseRef &&
    Firebase &&
    Firebase.auth() &&
    Firebase.auth().currentUser &&
    Firebase.auth().currentUser.uid
      ? Firebase.auth().currentUser.uid
      : null;

  if (!UID) return () => new Promise(resolve => resolve());

  return () => new Promise(() => {
    const setLastRoundFunction = Firebase.app()
      .functions()
      .httpsCallable('setLastRound');

    setLastRoundFunction({
      roomId,
      init: !!init,
    });

    Event("Game", "Set last round", null);
  });
}

export function quitRound(roomId, init) {
  if (Firebase === null) return () => new Promise(resolve => resolve());

  const UID =
    FirebaseRef &&
    Firebase &&
    Firebase.auth() &&
    Firebase.auth().currentUser &&
    Firebase.auth().currentUser.uid
      ? Firebase.auth().currentUser.uid
      : null;

  if (!UID) return () => new Promise(resolve => resolve());

  return () => new Promise(() => {
    const quitRoundFunction = Firebase.app()
      .functions()
      .httpsCallable('quitRound');

    quitRoundFunction({
      roomId,
      init: !!init,
    });

    Event("Game", "Quit round", null);
  });
}

export function closeResultNotification(roomId, init) {
  if (Firebase === null) return () => new Promise(resolve => resolve());

  const UID =
    FirebaseRef &&
    Firebase &&
    Firebase.auth() &&
    Firebase.auth().currentUser &&
    Firebase.auth().currentUser.uid
      ? Firebase.auth().currentUser.uid
      : null;

  if (!UID) return () => new Promise(resolve => resolve());

  return () => new Promise(() => {
    const closeResultNotificationFunction = Firebase.app()
      .functions()
      .httpsCallable('closeResultNotification2');

    closeResultNotificationFunction({
      roomId,
      init,
    });
  });
}

export function resetGameStore(lastRoom, roomId) {
//  console.log('resetGameStore');
//  console.log(roomId);
//  console.log(lastRoom);

  if (Firebase === null) return () => new Promise(resolve => resolve());

  if (lastRoom) {
    RoomsRef.child(`rooms/${lastRoom}/points`).off();
    RoomsRef.child(`rooms/${lastRoom}/globalParams`).off();
    RoomsRef.child(`rooms/${lastRoom}/playersList`).off();
    RoomsRef.child(`rooms/${lastRoom}/points`).off();
    RoomsRef.child(`rooms/${lastRoom}/curRnd/currentTurn`).off();
    RoomsRef.child(`rooms/${lastRoom}/curRnd/currentTable`).off();
    RoomsRef.child(`rooms/${lastRoom}/curRnd/type`).off();
    RoomsRef.child(`rooms/${lastRoom}/curRnd/largePlayer`).off();
    RoomsRef.child(`rooms/${lastRoom}/curRnd/cardPlayed`).off();
    RoomsRef.child(`rooms/${lastRoom}/gifts`).off();

    return dispatch => new Promise(resolve => resolve(dispatch({ type: 'RESET_STORE', roomId })));
  } else {
    return dispatch => new Promise(resolve => resolve(dispatch({ type: 'RESET_STORE', roomId })));
  }

}
