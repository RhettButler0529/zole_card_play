import { Firebase, FirebaseRef, RoomsPublicRef, RoomsRef } from '../lib/firebase';

// import ReactGA from 'react-ga';

import { Event } from '../web/components/Tracking';

export function getRooms() {
  if (Firebase === null) return () => new Promise(resolve => resolve());

  return dispatch => new Promise((resolve) => {
        new Promise((resolve2) => {
          return resolve2(dispatch({ type: 'ROOMS_REPLACE', data: {} }));
        }).then(() => {
          RoomsPublicRef.child('roomsPubInfIds')
            .orderByChild('open')
            .equalTo(true)
            .on('child_removed', (snapshot2) => {
              const roomKey = snapshot2.key;

              RoomsPublicRef.child(`roomsPubInf/${roomKey}`).off();
              dispatch({ type: 'ROOMS_REPLACE_REMOVE', data: null, roomKey });
            });

            RoomsPublicRef.child('roomsPubInfIds')
              .orderByChild('open')
              .equalTo(true)
              .on('child_added', (snapshot2) => {
                const roomKey = snapshot2.key;

              //  console.log('roomsPubInfIds added');
              //  console.log(roomKey);

                RoomsPublicRef.child(`roomsPubInf/${roomKey}`)
                  .on('child_added', (snapshot3) => {
                    const data2 = snapshot3.val();
                    const childKey = snapshot3.key;

                  //  if ((childKey === 'filled' && data2 === true)) {
                  //    console.log('filled = true');
                  //    console.log(roomKey);
                  //  }

                    if ((childKey === 'playersList' && data2 === null) || (childKey === 'roomClosed' && data2 === true) || (childKey === 'filled' && data2 === true)) {
                      RoomsPublicRef.child(`roomsPubInf/${roomKey}`).off('child_added', () => {
                        dispatch({ type: 'ROOMS_REPLACE_REMOVE', data: null, roomKey });
                      });

                      RoomsPublicRef.child(`roomsPubInf/${roomKey}`).off('child_changed', () => {
                        dispatch({ type: 'ROOMS_REPLACE_REMOVE', data: null, roomKey });
                      });
                    } else {
                      dispatch({ type: 'ROOMS_REPLACE_CHANGE', data: data2, childKey, roomKey });
                    }
                });

                RoomsPublicRef.child(`roomsPubInf/${roomKey}`)
                  .on('child_changed', (snapshot3) => {
                    const data2 = snapshot3.val();
                    const childKey = snapshot3.key;

                  //  if ((childKey === 'filled' && data2 === true)) {
                  //    console.log('filled = true');
                  //    console.log(roomKey);
                  //  }

                    if ((childKey === 'playersList' && data2 === null) || (childKey === 'roomClosed' && data2 === true)  || (childKey === 'filled' && data2 === true)) {
                    //  FirebaseRef.child(`roomsPubInf/${roomKey}`).off();
                      RoomsPublicRef.child(`roomsPubInf/${roomKey}`).off('child_added', () => {
                        dispatch({ type: 'ROOMS_REPLACE_REMOVE', data: null, roomKey });
                      });

                      RoomsPublicRef.child(`roomsPubInf/${roomKey}`).off('child_changed', () => {
                        dispatch({ type: 'ROOMS_REPLACE_REMOVE', data: null, roomKey });
                      });

                    //  dispatch({ type: 'ROOMS_REPLACE_REMOVE', data: null, roomKey });
                    } else {
                      dispatch({ type: 'ROOMS_REPLACE_CHANGE', data: data2, childKey, roomKey });
                    }
                });

              /*  FirebaseRef.child(`roomsPubInf/${roomKey}`)
                  .on('child_removed', (snapshot3) => {
                    const childKey = snapshot3.key;

                    dispatch({ type: 'ROOMS_REPLACE_CHILD_REMOVE', data: null, childKey, roomKey });
                }); */

                return resolve();
              });

              RoomsPublicRef.child('roomsPubInf')
                .orderByChild('filled')
                .equalTo(null)
                .once('value', (snapshot3) => {
                  const data = snapshot3.val() || {};

                  dispatch({ type: 'ROOMS_REPLACE', data });

                  return resolve();
                });

            //  return resolve();

        /*

          FirebaseRef.child('roomsPubInf')
            .orderByChild('filled')
            .equalTo(null)
            .on('child_changed', (snapshot2) => {
              const data2 = snapshot2.val() || {};
              const { key } = snapshot2;

              console.log('roomsPubInf child_changed');
              console.log(key);
              console.log(data2);

              if (data2 && data2.playersList) {
                dispatch({ type: 'ROOMS_REPLACE_CHANGE', data: data2, key });
              } else {
                dispatch({ type: 'ROOMS_REPLACE_REMOVE', data: null, key });
              }
            });

          FirebaseRef.child('roomsPubInf')
            .orderByChild('filled')
            .equalTo(null)
            .on('child_removed', (snapshot2) => {
            //  const data = snapshot2.val() || {};
              const { key } = snapshot2;

              //  if (data && data.playersList && !(data.playersList.player1 && data.playersList.player2 && data.playersList.player3)) {
              dispatch({ type: 'ROOMS_REPLACE_REMOVE', data: null, key });
            //  }
            });

            FirebaseRef.child('roomsPubInf')
              .orderByChild('filled')
              .equalTo(null)
              .on('child_added', (snapshot2) => {
                const data2 = snapshot2.val() || {};
                const { key } = snapshot2;

                console.log('roomsPubInf child_added');
                console.log(key);
                console.log(data2);

                //  if (data && data.playersList && !(data.playersList.player1 && data.playersList.player2 && data.playersList.player3)) {
                return resolve(dispatch({ type: 'ROOMS_REPLACE_CHANGE', data: data2, key }));
              //  }
            });  */

        //  return resolve();
        });
  }).catch((err) => { throw err.message; });
}


export function cancelRoomsListeners() {
  console.log('cancelRoomsListeners');

  if (Firebase === null) return () => new Promise(resolve => resolve());

  return (dispatch, getState) => new Promise(resolve => {
    const { rooms } = getState();

    if (rooms.rooms) {
      Object.keys(rooms.rooms).map(key => {
        RoomsPublicRef.child(`roomsPubInf/${key}`).off();
        RoomsPublicRef.child(`roomsPubInf/${key}`).off('child_added');
        RoomsPublicRef.child(`roomsPubInf/${key}`).off('child_changed');
      })
    }

  //  FirebaseRef.child('roomsPubInf').off();
    RoomsPublicRef.child('roomsPubInfIds').off();

    RoomsPublicRef.child('roomsPubInfIds').off('child_added', (snapshot2) => {
      return resolve(dispatch({ type: 'RESET_ROOMS' }))
    });

    RoomsPublicRef.child('roomsPubInfIds').off('child_removed', (snapshot2) => {
      return resolve(dispatch({ type: 'RESET_ROOMS' }))
    });

  //  return resolve(dispatch({ type: 'RESET_ROOMS' }))
  });
}



export function getMyRooms() {
  if (Firebase === null) return () => new Promise(resolve => resolve());

  return dispatch => new Promise((resolve) => {
    const UID = (
      FirebaseRef
        && Firebase
        && Firebase.auth()
        && Firebase.auth().currentUser
        && Firebase.auth().currentUser.uid
    ) ? Firebase.auth().currentUser.uid : null;

    if (UID) {
      FirebaseRef.child(`users/${UID}/joinedRooms`)
        .on('value', (snapshot) => {
          const joinedRooms = snapshot.val() || {};

          let joinedRoomKey;
          Object.keys(joinedRooms).map((key, index) => {
            if (index === 0) {
              joinedRoomKey = key;
            }
            return null;
          });

          if (joinedRoomKey) {
            RoomsPublicRef.child(`roomsPubInf/${joinedRoomKey}`)
              .on('value', (snapshot2) => {
                const data2 = snapshot2.val() || {};
                const { key } = snapshot2;

                if (data2 && data2.globalParams) {
                  dispatch({ type: 'ROOMS_REPLACE_CHANGE', data: data2, key });
                  dispatch({ type: 'MY_ROOMS_REPLACE_CHANGE', data: data2, key });
                } else {
                  dispatch({ type: 'ROOMS_REPLACE_REMOVE', data: null, key });
                  dispatch({ type: 'MY_ROOMS_REPLACE_REMOVE', data: null, key });
                }
              });

            /*   FirebaseRef.child(`roomsPubInf/${joinedRoomKey}`)
              .on('child_changed', (snapshot2) => {
                const data2 = snapshot2.val() || {};
                const { key } = snapshot2;

                console.log('getMyRooms child_changed');
                console.log(data2);

                if (data2 && data2.globalParams) {
                  dispatch({ type: 'ROOMS_REPLACE_CHANGE', data: data2, key });
                } else {
                  dispatch({ type: 'ROOMS_REPLACE_REMOVE', data: null, key });
                }
              });

            FirebaseRef.child(`roomsPubInf/${joinedRoomKey}`)
              .on('child_removed', (snapshot2) => {
                const { key } = snapshot2;

                dispatch({ type: 'ROOMS_REPLACE_REMOVE', data: null, key });
              });  */
          }

          return resolve();
        });
    } else {
      return resolve();
    }
  }).catch((err) => { throw err.message; });
}

export function resetRoomsList() {
  if (Firebase === null) return () => new Promise(resolve => resolve());

//  RoomsPublicRef.child('roomsPubInf').off();

  return dispatch => new Promise(resolve => resolve(dispatch({ type: 'RESET_ROOMS' })));
}


export function joinRoom(roomId, position, password) {
  if (Firebase === null) return () => new Promise(resolve => resolve());

  return dispatch => new Promise(resolve => Firebase.auth().onAuthStateChanged((user) => {
    if (user) {
      const joinRoomFunction = Firebase.app().functions().httpsCallable('joinRoom3');

      joinRoomFunction({
        roomId,
      //  position,
        userPassword: password,
      }).then((result) => {
      //  ReactGA.event({
      //    category: 'Room',
      //    action: 'Join room'
      //  });

        Event("Room", "Join room", null);

        return resolve(dispatch({ type: 'JOINED_ROOM', data: result, roomId }));
      });
    }
  }));
}

export function createRoom(parasta, G, atra, pro, bet, maza, privateRoom) {
  if (Firebase === null) return () => new Promise(resolve => resolve());

  const createRoomFunction = Firebase.app().functions().httpsCallable('createRoom');
  return dispatch => new Promise(resolve => createRoomFunction({
    parasta,
    G,
    atra,
    pro,
    bet,
    maza,
    privateRoom,
  }).then((result) => {
  //  ReactGA.event({
  //    category: 'Room',
  //    action: 'Create room'
  //  });

    Event("Room", "Create room", null);

    return resolve(dispatch({ type: 'CREATED_ROOM', data: result }));
  }));
}

let endRoomCalled = false;

export function endRoom(roomId) {
  if (Firebase === null) return () => new Promise(resolve => resolve());

  return dispatch => new Promise(resolve => Firebase.auth().onAuthStateChanged((user) => {
    if (user) {
      const promise1 = RoomsRef.child(`rooms/${roomId}/globalParams/roomClosed`).once('value');
      const promise2 = RoomsRef.child(`rooms/${roomId}/nextTimestamp`).once('value');
      const promise3 = Firebase.database().ref('.info/serverTimeOffset').once('value');

    //  FirebaseRef.child(`rooms/${roomId}/globalParams/roomClosed`)

      Promise.all([promise1, promise2, promise3]).then(promisesRes => {

    //    .once('value', (snapshot) => {
        //  const roomClosed = snapshot.val() || false;

        const roomClosed = promisesRes[0].val() || false;
        const nextTimestamp = promisesRes[1].val();
        const serverTimeOffset = promisesRes[2].val();

          console.log('roomClosed');
          console.log(roomClosed);

          console.log('nextTimestamp');
          console.log(nextTimestamp);
          console.log(Date.now() + serverTimeOffset);

          if (!roomClosed && nextTimestamp > (Date.now() + serverTimeOffset)) {
            return resolve('refetch');
          }

          if (!roomClosed && !endRoomCalled) {
            const endRoomFunction = Firebase.app().functions().httpsCallable('endRoom2');

            endRoomCalled = true;

            endRoomFunction({
              roomId,
            }).then((result) => {
              setTimeout(() => {
                endRoomCalled = false;
              }, 1500);

            //  ReactGA.event({
            //    category: 'Room',
            //    action: 'End room'
            //  });

              Event("Room", "End room", null);

              resolve(dispatch({ type: 'END_ROOM', data: result }));
            }).catch(() => {
              setTimeout(() => {
                endRoomCalled = false;
              }, 800);
              resolve();
            })
          } else {
            console.log('endRoom already called');

            resolve();
          }
        });
    }
  }));
}



export function endRoom2(roomId) {
  console.log('endRoom2');
  console.log(roomId);
  if (Firebase === null) return () => new Promise(resolve => resolve());

  return dispatch => new Promise(resolve => {
    try {
    /*  RoomsRef.child(`rooms/${roomId}/globalParams/missedTurn`).transaction((missedTurn) => {
        if (missedTurn) {
          return;
        }

        return true;
      }); */

      RoomsRef.child(`rooms/${roomId}/globalParams/missedTurn`).transaction((missedTurn) => {
        if (missedTurn) {
          return;
        }

        return true;
      }).then(res => {
        console.log('endRoom2 res');
        console.log(res);

        return resolve();
      }).catch(err => {
        console.log('endRoom2 transaction err');
        console.log(err);
      })
    } catch(err2) {
      console.log('endRoom2 err');
      console.log(err2);

      return resolve();
    }
  });
}



export function leaveRoom(roomId) {
  if (Firebase === null) return () => new Promise(resolve => resolve());

  return dispatch => new Promise(resolve => Firebase.auth().onAuthStateChanged((user) => {
    if (user) {
      const leaveRoomFunction = Firebase.app().functions().httpsCallable('leaveRoom2');

      leaveRoomFunction({
        roomId,
      }).then((result) => {
      //  ReactGA.event({
      //    category: 'Room',
      //    action: 'Leave room'
      //  });

        Event("Room", "Leave room", null);

        return resolve(dispatch({ type: 'END_ROOM', data: result.data }));
      });
    }
  }));
}


export function leaveRoomMenu(roomId) {
  if (Firebase === null) return () => new Promise(resolve => resolve());

  return dispatch => new Promise(resolve => Firebase.auth().onAuthStateChanged((user) => {
    if (user) {
      const leaveRoomMenuFunction = Firebase.app().functions().httpsCallable('leaveRoomMenu');

      leaveRoomMenuFunction({
        roomId,
      }).then((result) => {
      //  ReactGA.event({
      //    category: 'Room',
      //    action: 'Leave room Menu'
      //  });

        Event("Room", "Leave room Menu", null);

        resolve(dispatch({ type: 'LEAVE_ROOM_MENU', data: result.data }));
      });
    }
  }));
}


export function sendChatMsg(roomId, message, name, uid, photo) {
  console.log('sendChatMessage');
  let trimmedMessage = message.trim();
  if (Firebase === null || !roomId || !message || !trimmedMessage) return () => new Promise(resolve => resolve({ status: 'error' }));

  return () => new Promise(resolve => FirebaseRef.child(`chat/${roomId}/messages`).push({
    roomId,
    message: trimmedMessage,
    userName: name || '',
    userUid: uid || '',
    userPhoto: photo || '',
    time: Firebase.database.ServerValue.TIMESTAMP,
  }).then(() => {
    FirebaseRef.child(`chat/${roomId}/status`).set({
      [uid]: true,
    });

  //  ReactGA.event({
  //    category: 'Chat',
  //    action: 'Send chat message'
  //  });

    Event("Chat", "Send chat message", null);

    resolve({ status: 'success' });
  }).catch((err) => {
    resolve({ status: 'error', mesage: err });
  }));
}

export function setChatAsRead(roomId) {
  if (Firebase === null) return () => new Promise(resolve => resolve({ status: 'error' }));

  const UID = (
    FirebaseRef
      && Firebase
      && Firebase.auth()
      && Firebase.auth().currentUser
      && Firebase.auth().currentUser.uid
  ) ? Firebase.auth().currentUser.uid : null;

  if (!UID) return () => new Promise(resolve => resolve({ status: 'error' }));

  return () => new Promise(resolve => FirebaseRef.child(`chat/${roomId}/status`).update({
    [UID]: true,
  }).then(() => {
    resolve({ status: 'success' });
  }).catch((err) => {
    resolve({ status: 'error', mesage: err });
  }));
}

export function readChat(roomId) {
  console.log('readChat');
  console.log(roomId);
  if (Firebase === null || !roomId) return () => new Promise(resolve => resolve());

  return dispatch => new Promise((resolve) => {
    FirebaseRef.child(`chat/${roomId}/messages`)
      .on('value', (snapshot) => {
        const messages = snapshot.val() || {};

        dispatch({ type: 'ROOM_CHAT_MESSAGES', data: { messages, roomId } });

        FirebaseRef.child(`chat/${roomId}/messages`).off();

        FirebaseRef.child(`chat/${roomId}/messages`)
          .on('child_added', (snapshot2) => {
            const message = snapshot2.val() || null;
            const { key } = snapshot2;

            return resolve(dispatch({ type: 'ROOM_CHAT_MESSAGE_ADDED', data: { message, messageId: key, roomId } }));
          });

      //  return resolve();
      }).catch((err) => {
        console.log(err);
        return resolve();
      });

  //  return resolve();
  });
}

export function getGifts() {
  if (Firebase === null) return () => new Promise(resolve => resolve());

  return dispatch => new Promise(resolve => FirebaseRef.child('gifts2')
    .once('value', (snapshot) => {
      const gifts = snapshot.val() || {};

      resolve(dispatch({
        type: 'GIFTS',
        data: gifts,
      }));
    }));
}


export function getEmotions() {
  if (Firebase === null) return () => new Promise(resolve => resolve());

  return dispatch => new Promise(resolve => FirebaseRef.child('emotions')
    .once('value', (snapshot) => {
      const emotions = snapshot.val() || {};

      resolve(dispatch({
        type: 'EMOTIONS',
        data: emotions,
      }));
    }));
}


export function getRoomGifts(roomId) {
  if (Firebase === null) return () => new Promise(resolve => resolve());

  return dispatch => new Promise(resolve => RoomsRef.child(`rooms/${roomId}/gifts`)
    .on('value', (snapshot) => {
      const roomGifts = snapshot.val() || {};

      resolve(dispatch({
        type: 'ROOM_GIFTS',
        data: { data: roomGifts, roomId },
      }));
    }));
}

export function sendGift(roomId, giftId, comment, players) {
  if (Firebase === null) return () => new Promise(resolve => resolve());

  const UID = (
    FirebaseRef
      && Firebase
      && Firebase.auth()
      && Firebase.auth().currentUser
      && Firebase.auth().currentUser.uid
  ) ? Firebase.auth().currentUser.uid : null;

  if (!UID) return () => new Promise(resolve => resolve());

  return dispatch => new Promise((resolve) => {
    const sendGiftFunction = Firebase.app().functions('europe-west1').httpsCallable('sendGift2');

    sendGiftFunction({
      roomId,
      giftId,
      comment,
      players,
    }).then((result) => {
    //  ReactGA.event({
    //    category: 'Chat',
    //    action: 'Send Gift'
    //  });

      Event("Chat", "Send Gift", null);

      resolve(dispatch({ type: 'SEND_GIFT', data: result, roomId }));
    });
  });
}


export function setEmotion(roomId, emotion) {
  if (Firebase === null) return () => new Promise(resolve => resolve());

  const UID = (
    FirebaseRef
      && Firebase
      && Firebase.auth()
      && Firebase.auth().currentUser
      && Firebase.auth().currentUser.uid
  ) ? Firebase.auth().currentUser.uid : null;

  if (!UID || !emotion || !roomId) return () => new Promise(resolve => resolve());

  return dispatch => new Promise((resolve) => {
    const setEmotionFunction = Firebase.app().functions('europe-west1').httpsCallable('setEmotion');

    setEmotionFunction({
      roomId,
      emotion,
    }).then((result) => {
    //  ReactGA.event({
    //    category: 'Chat',
    //    action: 'Set Emotion'
    //  });

      Event("Chat", "Set Emotion", null);

      resolve(dispatch({ type: 'SEND_GIFT', data: result, roomId }));
    });
  });
}

export function toggleNewGameParam(param) {
//  console.log('toggleNewGameParam');
//  console.log(param);
  if (param) {
    return dispatch => new Promise(resolve => resolve(dispatch({ type: 'TOGGLE_NEW_GAME_PARAM', data: param })));
  }
  return () => new Promise(resolve => resolve());
}
