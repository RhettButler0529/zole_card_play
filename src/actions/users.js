import { Firebase, FirebaseRef } from '../lib/firebase';


export function getUserCount() {
  return dispatch => new Promise(resolve => FirebaseRef.child('onlineCount')
    .on('value', (snapshot) => {
      const onlineCount = snapshot.val() || 0;

      resolve(dispatch({
        type: 'USER_COUNT',
        data: onlineCount,
      }));
    }));
}


export function getRoomsCount() {
  if (Firebase === null) return () => new Promise(resolve => resolve());

  return dispatch => new Promise(resolve => FirebaseRef.child('roomsCount')
    .on('value', (snapshot) => {
      const roomsCount = snapshot.val() || 0;

      return resolve(dispatch({ type: 'ROOMS_COUNT', data: roomsCount }));
    })).catch((err) => { throw err.message; });
}


export function getBannedUsers(start, end) {
  if (Firebase === null) return () => new Promise(resolve => resolve());

  return dispatch => new Promise(resolve => FirebaseRef.child('bans')
    .orderByChild('blocked')
    .equalTo(true)
    .limitToFirst(40)
    .on('value', (snapshot) => {
      const bans = snapshot.val() || {};

      return resolve(dispatch({ type: 'BANS_REPLACE', data: bans }));
    })).catch((err) => { throw err.message; });
}


export function getBannedUsersCount() {
  if (Firebase === null) return () => new Promise(resolve => resolve());

  return dispatch => new Promise(resolve => FirebaseRef.child('statistics/bansCount')
    .once('value', (snapshot) => {
      const data = snapshot.val() || {};

      return resolve(dispatch({ type: 'BANS_COUNT_REPLACE', data }));
    })).catch((err) => { throw err.message; });
}


/*
export function getOnlineUsersLazy(sortFilter, sortDirection, lastItem, lastKey) {
  if (Firebase === null) return () => new Promise(resolve => resolve());

  return dispatch => new Promise((resolve) => {
    if (sortDirection === 'asc') {
      if (lastKey) {
        FirebaseRef.child('status')
          .orderByChild(sortFilter)
          .startAt(lastItem, lastKey.toString())
          .limitToFirst(10)
          .on('value', (snapshot) => {
            const users = {};
            let newLastKey = '';
            let newLastItem = '';
            snapshot.forEach((child) => {
              if (child.key !== 'onlineCount') {
                const value = child.val();

                users[child.key] = value;
                newLastKey = child.key;
                newLastItem = value[sortFilter];
              }
            });

            console.log('online users #2');
            console.log(users);

            resolve(dispatch({
              type: 'ONLINE_USERS_LAZY', data: users, lastKey: newLastKey, lastItem: newLastItem,
            }));
          });
      } else {
        FirebaseRef.child('status')
          .orderByChild(sortFilter)
          .startAt('')
          .limitToFirst(15)
          .on('value', (snapshot) => {
            const users = {};
            let newLastKey = '';
            let newLastItem = '';
            snapshot.forEach((child) => {
              if (child.key !== 'onlineCount') {
                const value = child.val();

                users[child.key] = value;
                newLastKey = child.key;
                newLastItem = value[sortFilter];
              }
            });

            console.log('online users #3');
            console.log(users);

            resolve(dispatch({
              type: 'ONLINE_USERS_LAZY', data: users, lastKey: newLastKey, lastItem: newLastItem,
            }));
          });
      }
    } else if (sortDirection === 'desc') {
      if (lastKey) {
        FirebaseRef.child('status')
          .orderByChild(sortFilter)
          .endAt(lastItem, lastKey.toString())
          .limitToLast(10)
          .on('value', (snapshot) => {
            const users = {};
            let newLastKey = '';
            let newLastItem = '';
            snapshot.forEach((child) => {
              if (child.key !== 'onlineCount') {
                const value = child.val();

                users[child.key] = value;

                if (!newLastKey) {
                  newLastKey = child.key;
                  newLastItem = value[sortFilter];
                }
              }
            });

            console.log('online users #4');
            console.log(users);

            resolve(dispatch({
              type: 'ONLINE_USERS_LAZY', data: users, lastKey: newLastKey, lastItem: newLastItem,
            }));
          });
      } else {
        FirebaseRef.child('status')
          .orderByChild(sortFilter)
          .limitToLast(15)
          .on('value', (snapshot) => {
            const users = {};
            let newLastKey = '';
            let newLastItem = '';
            snapshot.forEach((child) => {
              if (child.key !== 'onlineCount') {
                const value = child.val();

                users[child.key] = value;

                if (!newLastKey) {
                  newLastKey = child.key;
                  newLastItem = value[sortFilter];
                }
              }
            });

            console.log('online users #5');
            console.log(users);

            resolve(dispatch({
              type: 'ONLINE_USERS_LAZY', data: users, lastKey: newLastKey, lastItem: newLastItem,
            }));
          });
      }
    }

  //  resolve();
  }).catch((err) => { throw err.message; });
}


export function resetGetOnlineUsersLazy() {
  console.log('resetGetOnlineUsersLazy');
  if (Firebase === null) return () => new Promise(resolve => resolve());

  return dispatch => new Promise((resolve) => {
    FirebaseRef.child('status')
      .off();

    resolve(dispatch({
      type: 'ONLINE_USERS_LAZY_NEW', data: {}, lastKey: '', lastItem: '',
    }));

  //  resolve('success');
  }).catch((err) => { throw err.message; });
}
*/

export function updateOnlineState() {
  if (Firebase === null) return () => new Promise(resolve => resolve());

  return () => new Promise(resolve => Firebase.auth().onAuthStateChanged((user) => {
    if (user) {
      const { uid, providerData } = user;

      FirebaseRef.child('.info/connected')
        .on('value', (connectedSnapshot) => {
          const status = connectedSnapshot.val() || false;
          if (status) {
            FirebaseRef.child(`users/${uid}`)
              .once('value', (playerSnapshot) => {
                const playerData = playerSnapshot.val() || {};

                const {
                  name, photo, lvl, bal,
                } = playerData;

                Firebase.database().ref(`status/${uid}`).onDisconnect().remove();

                Firebase.database().ref(`users/${uid}`).update({
                  lastLogin: Firebase.database.ServerValue.TIMESTAMP,
                });
                let lowerCaseName = '';
                let finalString = name || '';
                if (name) {
                  const punctuationless = name.replace(/[\.,-\/#!$%\^&\*;:{}=\-_`~()@\+\?><\[\]\+]/g, '');
                  finalString = punctuationless.replace(/\s{2,}/g, ' ');

                  lowerCaseName = finalString.toLowerCase();
                }

                if (finalString && uid) {
                  Firebase.database().ref(`status/${uid}`).update({
                    status: true,
                  //  name: finalString,
                  //  lowerCaseName: lowerCaseName || '',
                  //  photo: photo || '',
                  //  lvl,
                  //  bal,
                  //  inRoom: false,
                  //  lastLogin: Firebase.database.ServerValue.TIMESTAMP,
                    lastAction: Firebase.database.ServerValue.TIMESTAMP,
                  });
                }
              });
          }
        });
    }
    return () => new Promise(() => resolve());
  })).catch((err) => { throw err.message; });
}
