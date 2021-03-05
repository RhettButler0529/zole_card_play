import { Firebase, FirebaseRef } from '../lib/firebase';

export function getRooms() {
  if (Firebase === null) return () => new Promise(resolve => resolve());

  return dispatch =>
    new Promise(resolve =>
      FirebaseRef.child('roomsPubInf')
        .orderByChild('roomClosed')
        .equalTo(false)
        .on('value', snapshot => {
          const data = snapshot.val() || {};

          return resolve(dispatch({ type: 'ROOMS_REPLACE', data }));
        })
    ).catch(err => {
      throw err.message;
    });
}

export function toggleNewGameParam(param, uid) {
  if (param && uid) {
    return dispatch =>
      new Promise(resolve =>
        resolve(dispatch({ type: 'TOGGLE_NEW_GAME_PARAM', data: param, uid }))
      );
  }
  return () => new Promise(resolve => resolve());
}

export function setNewGameBet(bet, uid) {
  if (bet && uid) {
    return dispatch =>
      new Promise(resolve =>
        resolve(dispatch({ type: 'SET_NEW_GAME_BET', data: bet, uid }))
      );
  }
  return () => new Promise(resolve => resolve());
}

export function toggleSound(uid) {
  if (uid) {
    return dispatch =>
      new Promise(resolve =>
        resolve(dispatch({ type: 'TOGGLE_SOUND', uid }))
      );
  }
  return () => new Promise(resolve => resolve());
}
