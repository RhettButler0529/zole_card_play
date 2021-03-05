// import { errorMessages } from '../constants/messages';
import {
  Firebase,
  FirebaseRef,
  AdminLogsRef,
  RoomsRef
} from '../lib/firebase';

export function getUserCount() {
  if (Firebase === null) return () => new Promise(resolve => resolve());


  return dispatch => new Promise(resolve => FirebaseRef.child('statistics/userCount')
    .on('value', (snapshot) => {
      const userCount = snapshot.val() || {};

      return resolve(dispatch({ type: 'ADMIN_USER_COUNT', data: userCount }));
    })).catch((err) => { throw err.message; });
}


export function getUsersRange(start, end) {
  if (Firebase === null) return () => new Promise(resolve => resolve());


  return dispatch => new Promise((resolve) => {
    FirebaseRef.child('users')
      .orderByChild('userIndex')
      .startAt(start)
      .endAt(end)
      .on('child_changed', (snapshot) => {
        const user = snapshot.val() || {};
        const { key } = snapshot;

        dispatch({ type: 'ADMIN_USER_REPLACE', data: { user, key } });
      });

    FirebaseRef.child('users')
      .orderByChild('userIndex')
      .startAt(start)
      .endAt(end)
      .once('value', (snapshot) => {
        const users = snapshot.val() || {};

        console.log('users');
        console.log(users);

        return resolve(dispatch({ type: 'ADMIN_USERS_REPLACE', data: users }));
      });
  }).catch((err) => { throw err.message; });
}


export function getFilteredUsers(filter, filterType) {
  if (Firebase === null) return () => new Promise(resolve => resolve());

  if (!filterType || !filter) return dispatch => new Promise(resolve => resolve(dispatch({ type: 'ADMIN_FILTERED_USERS', data: null })));

  if (filterType === 'lowerCaseName') {
    return dispatch => new Promise(resolve => FirebaseRef.child('users')
      .orderByChild(filterType)
      .startAt(filter.toLowerCase())
      .endAt(`${filter.toLowerCase()}\uf8ff`)
      .limitToFirst(40)
      .once('value', (snapshot) => {
        const data = snapshot.val() || {};

        return resolve(dispatch({ type: 'ADMIN_FILTERED_USERS', data }));
      })).catch((err) => { throw err.message; });
  }

  if (filterType === 'uid') {
    return dispatch => new Promise(resolve => FirebaseRef.child('users')
      .orderByKey()
      .equalTo(filter.toString())
      .limitToFirst(1)
      .once('value', (snapshot) => {
        const data = snapshot.val() || {};

        return resolve(dispatch({ type: 'ADMIN_FILTERED_USERS', data }));
      })).catch((err) => { throw err.message; });
  }

  return new Promise(resolve => resolve());
}

export function getRoomLogCount() {
  if (Firebase === null) return () => new Promise(resolve => resolve());


  return dispatch => new Promise(resolve => FirebaseRef.child('statistics/roomsPlayed2')
    .on('value', (snapshot) => {
      const roomsPlayed = snapshot.val() || 0;

      return resolve(dispatch({ type: 'ADMIN_ROOM_LOGS_COUNT', data: roomsPlayed }));
    })).catch((err) => { throw err.message; });
}


export function getRoomLogsRange(start, end) {
  console.log('getRoomLogsRange');
  console.log(start);
  console.log(end);
  if (Firebase === null) return () => new Promise(resolve => resolve());

  // Set FirebaseRef to AdminLogsRef
  return dispatch => new Promise(resolve => AdminLogsRef.child('adminLogs/roomIds')
    .orderByChild('index')
    .startAt(start)
    .endAt(end)
    .on('value', (snapshot) => {
      const roomLogs = snapshot.val() || {};

      console.log('roomLogs');
      console.log(roomLogs);

      return resolve(dispatch({ type: 'ADMIN_ROOM_LOGS_REPLACE', data: roomLogs }));
    }, (err) => { console.log(err) })).catch((err) => { console.log(err) });
}


export function getFilteredRoomLogs(filter, filterType) {
  if (Firebase === null) return () => new Promise(resolve => resolve());

  if (!filterType || !filter) return dispatch => new Promise(resolve => resolve(dispatch({ type: 'ADMIN_FILTERED_ROOM_LOGS', data: null })));

  if (filterType === 'roomId') {
    // Set FirebaseRef to AdminLogsRef
    return dispatch => new Promise(resolve => AdminLogsRef.child('adminLogs/roomIds')
      .orderByKey()
      .startAt(filter)
      .endAt(`${filter}\uf8ff`)
      .limitToFirst(250)
      .once('value', (snapshot) => {
        const data = snapshot.val() || {};

        return resolve(dispatch({ type: 'ADMIN_FILTERED_ROOM_LOGS', data }));
      })).catch((err) => { throw err.message; });
  }

  if (filterType === 'userId') {
    // Set FirebaseRef to AdminLogsRef
    return dispatch => new Promise(resolve => AdminLogsRef.child(`adminLogs/playerRooms/${filter}`)
    //  .orderByKey()
    //  .startAt(filter)
    //  .endAt(`${filter}\uf8ff`)
      .limitToLast(250)
      .once('value', (snapshot) => {
        const data = snapshot.val() || {};

        return resolve(dispatch({ type: 'ADMIN_FILTERED_ROOM_LOGS', data }));
      })).catch((err) => { throw err.message; });
  }

  // Set FirebaseRef to AdminLogsRef
  return dispatch => new Promise(resolve => AdminLogsRef.child('adminLogs/roomIds')
    .orderByChild(filterType)
    .startAt(filter)
    .endAt(`${filter}\uf8ff`)
    .limitToFirst(250)
    .once('value', (snapshot) => {
      const data = snapshot.val() || {};

      return resolve(dispatch({ type: 'ADMIN_FILTERED_ROOM_LOGS', data }));
    })).catch((err) => { throw err.message; });
}


export function getPaymentsRange(start, end) {
  if (Firebase === null) return () => new Promise(resolve => resolve());

  return dispatch => new Promise(resolve => FirebaseRef.child('initiatedPayments')
    .orderByChild('index')
    .startAt(start)
    .endAt(end)
    .on('value', (snapshot) => {
      const initiatedPayments = snapshot.val() || {};

      console.log('initiatedPayments');
      console.log(initiatedPayments);

      return resolve(dispatch({ type: 'ADMIN_PAYMENTS_REPLACE', data: initiatedPayments }));
    })).catch((err) => { throw err.message; });
}


export function getPaymentsCount() {
  if (Firebase === null) return () => new Promise(resolve => resolve());


  return dispatch => new Promise(resolve => FirebaseRef.child('initiatedPaymentsCount/count')
    .on('value', (snapshot) => {
      const paymentsCount = snapshot.val() || 0;

      return resolve(dispatch({ type: 'ADMIN_PAYMENTS_COUNT', data: paymentsCount }));
    })).catch((err) => { throw err.message; });
}


export function getAllUsers() {
  if (Firebase === null) return () => new Promise(resolve => resolve());

  return dispatch => new Promise(resolve => FirebaseRef.child('users')
    .once('value', (snapshot) => {
      const data = snapshot.val() || {};

      return resolve(dispatch({ type: 'ADMIN_USERS_REPLACE', data }));
    })).catch((err) => { throw err.message; });
}


export function getUserMessages(uid) {
  if (Firebase === null) return () => new Promise(resolve => resolve());

  const UID = (
    FirebaseRef
    && Firebase
    && Firebase.auth()
    && Firebase.auth().currentUser
    && Firebase.auth().currentUser.uid
  ) ? Firebase.auth().currentUser.uid : null;

  if (!UID) return () => new Promise(resolve => resolve());

  return dispatch => new Promise(resolve => FirebaseRef.child(`supportChat/messages/${uid.toString()}`)
    .on('value', (snapshot) => {
      const messages = snapshot.val() || {};

      resolve(dispatch({
        type: 'USER_CHATS',
        data: messages,
      }));
    }));
}

export function cancelUserMessages(uid) {
  if (Firebase === null) return () => new Promise(resolve => resolve());

  const UID = (
    FirebaseRef
    && Firebase
    && Firebase.auth()
    && Firebase.auth().currentUser
    && Firebase.auth().currentUser.uid
  ) ? Firebase.auth().currentUser.uid : null;

  if (!UID) return () => new Promise(resolve => resolve());

  return dispatch => new Promise(resolve => {
  //  FirebaseRef.child(`supportChat/messages/${uid.toString()}`).off();

    FirebaseRef.child(`supportChat/messages/${uid.toString()}`).off();
    return resolve(dispatch({
      type: 'USER_CHATS',
      data: {},
    }));
  });
}



/*
export function getActiveMessages() {
  if (Firebase === null) return () => new Promise(resolve => resolve());

  return dispatch => new Promise((resolve) => {
    FirebaseRef.child('supportChat/activeChats')
      .orderByChild('responded').equalTo(false).on('value', (unreadChatsSnapshot) => {
        const unreadChats = unreadChatsSnapshot.val() || {};

        FirebaseRef.child('supportChat/activeChats')
          .orderByChild('responded').equalTo(true).on('value', (readChatsSnapshot) => {
            const readChats = readChatsSnapshot.val() || {};

            resolve(dispatch({
              type: 'ACTIVE_MESSAGES',
              data: { readChats, unreadChats },
            }));
          });
      });
  });
} */

export function getActiveReadMessages() {
  if (Firebase === null) return () => new Promise(resolve => resolve());

  return dispatch => new Promise((resolve) => {
  //  FirebaseRef.child('supportChat/activeChats')
  //    .orderByChild('responded').equalTo(false).on('value', (unreadChatsSnapshot) => {
  //      const unreadChats = unreadChatsSnapshot.val() || {};

    FirebaseRef.child('supportChat/activeChats')
      .orderByChild('responded').equalTo(true).once('value', (readChatsSnapshot) => {
        const readChats = readChatsSnapshot.val() || {};

      //  console.log('readChats');
      //  console.log(readChats);

        resolve(dispatch({
          type: 'ACTIVE_READ_MESSAGES',
          data: readChats,
        }));
      });
    //  });
  });
}

export function getActiveUnreadMessages() {
  if (Firebase === null) return () => new Promise(resolve => resolve());

  return dispatch => new Promise((resolve) => {
    FirebaseRef.child('supportChat/activeChats')
      .orderByChild('responded').equalTo(false).once('value', (unreadChatsSnapshot) => {
        const unreadChats = unreadChatsSnapshot.val() || {};

      //  console.log('unreadChats');
      //  console.log(unreadChats);

        FirebaseRef.child('supportChat/activeChats')
          .orderByChild('responded').equalTo(false).on('child_added', (unreadChatsSnapshot) => {
            const unreadChats = unreadChatsSnapshot.val() || {};
            const { key } = unreadChatsSnapshot;

            dispatch({
              type: 'ACTIVE_UNREAD_MESSAGE_CHANGE',
              data: unreadChats,
              key,
            });
          });

        FirebaseRef.child('supportChat/activeChats')
          .orderByChild('responded').equalTo(false).on('child_changed', (unreadChatsSnapshot) => {
            const unreadChats = unreadChatsSnapshot.val() || {};
            const { key } = unreadChatsSnapshot;

            dispatch({
              type: 'ACTIVE_UNREAD_MESSAGE_CHANGE',
              data: unreadChats,
              key,
            });
          });

        FirebaseRef.child('supportChat/activeChats')
          .orderByChild('responded').equalTo(false).on('child_removed', (unreadChatsSnapshot) => {
            //const unreadChats = unreadChatsSnapshot.val() || {};
            const { key } = unreadChatsSnapshot;

            dispatch({
              type: 'ACTIVE_UNREAD_MESSAGES_REMOVE',
            //  data: unreadChats,
              key,
            });
          });

          resolve(dispatch({
            type: 'ACTIVE_UNREAD_MESSAGES',
            data: unreadChats,
          }));
      });

    //  resolve();
  });
}

export function getActiveMessages2() {
  if (Firebase === null) return () => new Promise(resolve => resolve());

  const UID = (
    FirebaseRef
    && Firebase
    && Firebase.auth()
    && Firebase.auth().currentUser
    && Firebase.auth().currentUser.uid
  ) ? Firebase.auth().currentUser.uid : null;

  if (!UID) return () => new Promise(resolve => resolve());

  return dispatch => new Promise(resolve => FirebaseRef.child('supportChat/activeChats')
    .orderByChild('active').equalTo(true).on('value', (snapshot) => {
      const activeChats = snapshot.val() || {};

      resolve(dispatch({
        type: 'ACTIVE_MESSAGES',
        data: activeChats,
      }));
    }));
}

export function answerSupportMessage({ uid, message }) {
  if (!message || !uid) return () => new Promise(resolve => resolve());

  if (Firebase === null) return () => new Promise(resolve => resolve());

  return () => new Promise(resolve => FirebaseRef.child(`supportChat/messages/${uid.toString()}`).push({
    message,
    date: Firebase.database.ServerValue.TIMESTAMP,
  }).then((snap) => {
    const { key } = snap;

    console.log(key);

    FirebaseRef.child(`supportChat/activeChats/${uid.toString()}`).update({
    //  active: true,
      responded: true,
      lastResponse: Firebase.database.ServerValue.TIMESTAMP,
      read: false,
    });

    resolve({ status: 'success' });
  }).catch((err) => {
    resolve({ status: 'error', mesage: err });
  }));
}


export function setSupportMessageAsResponded({ uid }) {
  if (!uid) return () => new Promise(resolve => resolve());

  if (Firebase === null) return () => new Promise(resolve => resolve());

  return () => new Promise(resolve => FirebaseRef.child(`supportChat/activeChats/${uid.toString()}`).update({
    responded: true,
  }).then(() => {
    resolve({ status: 'success' });
  }).catch((err) => {
    resolve({ status: 'error', mesage: err });
  }));
}


export function messageAll(message) {
  if (Firebase === null || !message) return () => new Promise(resolve => resolve());

  return dispatch => new Promise(resolve => Firebase.auth().onAuthStateChanged((user) => {
    if (user) {
      const messageAllFunction = Firebase.app().functions('europe-west1').httpsCallable('messageAll');

      messageAllFunction({
        message,
      }).then((result) => {
        resolve(dispatch({ type: 'LEAVE_TOURNAMENT', data: result }));
      });
    }
  }));
}


export function getUsersCount() {
  if (Firebase === null) return () => new Promise(resolve => resolve());

  return dispatch => new Promise(resolve => FirebaseRef.child('users_count')
    .once('value', (snapshot) => {
      const data = snapshot.val() || {};

      return resolve(dispatch({ type: 'USERS_COUNT_REPLACE', data }));
    })).catch((err) => { throw err.message; });
}


export function getAllVipUsers() {
  if (Firebase === null) return () => new Promise(resolve => resolve());

  return dispatch => new Promise(resolve => FirebaseRef.child('users')
    .orderByChild('vip')
    .equalTo(true)
    .on('value', (snapshot) => {
      const data = snapshot.val() || {};

      return resolve(dispatch({ type: 'ADMIN_VIP_REPLACE', data }));
    })).catch((err) => { throw err.message; });
}


export function getAllBans() {
  if (Firebase === null) return () => new Promise(resolve => resolve());

  return dispatch => new Promise(resolve => FirebaseRef.child('bans')
    .on('value', (snapshot) => {
      const data = snapshot.val() || {};

      return resolve(dispatch({ type: 'ADMIN_BANS2_REPLACE', data }));
    })).catch((err) => { throw err.message; });
}


export function getBansRange(start, end) {
  if (Firebase === null) return () => new Promise(resolve => resolve());

  return dispatch => new Promise(resolve => FirebaseRef.child('bans')
    .orderByChild('index')
    .startAt(start)
    .endAt(end)
    .on('value', (snapshot) => {
      const bans = snapshot.val() || {};

      console.log('bans');
      console.log(bans);

      return resolve(dispatch({ type: 'ADMIN_BANS_REPLACE', data: bans }));
    })).catch((err) => { throw err.message; });
}


export function getBansCount() {
  if (Firebase === null) return () => new Promise(resolve => resolve());

  return dispatch => new Promise(resolve => FirebaseRef.child('statistics/bansCount')
    .once('value', (snapshot) => {
      const data = snapshot.val() || {};

      return resolve(dispatch({ type: 'BANS_COUNT_REPLACE', data }));
    })).catch((err) => { throw err.message; });
}

export function getAllTransactions() {
  if (Firebase === null) return () => new Promise(resolve => resolve());

  return dispatch => new Promise(resolve => FirebaseRef.child('transactions')
    .on('value', (snapshot) => {
      const data = snapshot.val() || {};

      return resolve(dispatch({ type: 'ADMIN_TRANSACTIONS_REPLACE', data }));
    })).catch((err) => { throw err.message; });
}


export function getAllTournaments() {
  if (Firebase === null) return () => new Promise(resolve => resolve());

  return dispatch => new Promise(resolve => FirebaseRef.child('tournaments')
    .on('value', (snapshot) => {
      const data = snapshot.val() || {};

      console.log(data);

      return resolve(dispatch({ type: 'ADMIN_TOURNAMENTS_REPLACE', data }));
    })).catch((err) => { throw err.message; });
}

export function getTournamentPlayers(tournamentId) {
  if (Firebase === null) return () => new Promise(resolve => resolve());

  return dispatch => new Promise(resolve => FirebaseRef.child(`tourPlayers/${tournamentId}`)
    .on('value', (snapshot) => {
      const data = snapshot.val() || {};

      console.log(data);


      return resolve(dispatch({ type: 'TOURNAMENT_PLAYERS', data: { tournamentPlayers: data, tournamentId } }));
    })).catch((err) => { throw err.message; });
}


export function deleteUser(uid) {
  if (Firebase === null) return () => new Promise(resolve => resolve());

  return () => new Promise(resolve => Firebase.auth().onAuthStateChanged((user) => {
    if (user) {
      const deleteUserFunction = Firebase.app().functions('europe-west1').httpsCallable('deleteUser');

      deleteUserFunction({
        uid: uid.toString(),
      }).then((result) => {
        resolve(result);
      });
    }
  }));
}

export function toggleLogRocket(uid) {
  if (Firebase === null) return () => new Promise(resolve => resolve());

  if (!uid) { return () => new Promise(resolve => resolve({ status: 'error', message: 'Nav id' })); }

  return (dispatch) => new Promise(resolve => FirebaseRef.child(`users/${uid.toString()}/enableLogRocket`)
    .once('value', (userSnapshot) => {
      const enableLogRocket = userSnapshot.val() || false;

        FirebaseRef.child(`users/${uid.toString()}`).update({
          enableLogRocket: !enableLogRocket,
        })
        .then(() => {
          dispatch({ type: 'CHANGE_LOGROCKET', data: { status: 'success', enabled: !enableLogRocket, uid } })

          return resolve({ status: 'success', enabled: !enableLogRocket });
        })
        .catch((err) => {
          return resolve({ status: 'error', message: err });
        });
    }));
}


export function blockUser(uid, endDate, reason) {
  if (Firebase === null) return () => new Promise(resolve => resolve());

  const endDate2 = new Date(endDate);

  const endDateParsed = Date.parse(endDate2);

  if (!uid) { return () => new Promise(resolve => resolve({ status: 'error', message: 'Nav id' })); }
  if (!reason) { return () => new Promise(resolve => resolve({ status: 'error', message: 'Nav iemesla' })); }
  if (!endDateParsed || !(endDate2 instanceof Date)) { return () => new Promise(resolve => resolve({ status: 'error', message: 'Nav beigu laika' })); }

  return () => new Promise(resolve => FirebaseRef.child(`users/${uid.toString()}`)
    .once('value', (userSnapshot) => {
      const bannedUser = userSnapshot.val() || {};

      FirebaseRef.child(`bans/${uid.toString()}`).update({
        blocked: true,
        uid: uid.toString(),
        name: bannedUser.name || '',
        endDate: endDateParsed,
        //  endTime: endDateParsed,
        reason,
      })
        .then(() => {
          FirebaseRef.child(`users/${uid.toString()}`).update({
            blocked: true,
            banEndDate: endDateParsed,
            banReason: reason,
          })
            .then(() => {
              resolve({ status: 'success' });
            })
            .catch((err) => {
              resolve({ status: 'error', message: err });
            });
        })
        .catch((err) => {
          resolve({ status: 'error', message: err });
        });
    }));
}


export function unblockUser(uid) {
  if (Firebase === null) return () => new Promise(resolve => resolve());

  if (!uid) { return () => new Promise(resolve => resolve({ status: 'error', message: 'Nav id' })); }

  return () => new Promise(resolve => FirebaseRef.child(`bans/${uid.toString()}`).update({
    blocked: false,
  })
    .then(() => {
      console.log('then unban');
      FirebaseRef.child(`users/${uid.toString()}`).update({
        blocked: false,
      })
        .then(() => {
          resolve({ status: 'success' });
        })
        .catch((err) => {
          resolve({ status: 'error', message: err });
        });
    })
    .catch((err) => {
      resolve({ status: 'error', message: err });
    }));
}


export function editUser(uid, bal, lvl, gPlayed, totalPnts) {
  if (Firebase === null) return () => new Promise(resolve => resolve());

  if (!bal && bal !== 0) { return () => new Promise(resolve => resolve({ status: 'error', message: 'Nav bilances' })); }
  if (!lvl && lvl !== 0) { return () => new Promise(resolve => resolve({ status: 'error', message: 'Nav līmeņa' })); }
  if (!totalPnts && totalPnts !== 0) { return () => new Promise(resolve => resolve({ status: 'error', message: 'Nav punktu' })); }
  if (!gPlayed && gPlayed !== 0) { return () => new Promise(resolve => resolve({ status: 'error', message: 'Nav izspēlēto spēļu' })); }
  //  if (Number.isNaN(Number(bal)) || bal < 0) { return () => new Promise(resolve => resolve({ status: 'error', message: 'Bilancei jābūt pozitīvam skaitlim' })); }
  if (Number.isNaN(Number(lvl)) || lvl < 0) { return () => new Promise(resolve => resolve({ status: 'error', message: 'Līmenim jābūt pozitīvam skaitlim' })); }
  if (Number.isNaN(Number(gPlayed)) || gPlayed < 0) { return () => new Promise(resolve => resolve({ status: 'error', message: 'Izspēlētajām spēlēm jābūt pozitīvam skaitlim' })); }

  return () => new Promise((resolve) => {
    FirebaseRef.child(`users/${uid.toString()}/bal`)
      .once('value', (userBalSnapshot) => {
        const userOldBal = userBalSnapshot.val() || 0;

        FirebaseRef.child(`users/${uid.toString()}`).update({
          bal: parseInt(bal, 10),
          lvl,
          gPlayed,
          totalPnts,
        }).then((res) => {
          console.log('res');
          console.log(res);

        //  FirebaseRef.child(`users/${uid.toString()}`).update({
        //    bal: parseInt(bal, 10),
        //    lvl,
        //    gPlayed,
        //  });

          FirebaseRef.child(`userBalHistory/${uid.toString()}`).push({
            time: Firebase.database.ServerValue.TIMESTAMP,
            type: 'adminChange',
            change: bal - userOldBal,
            old: userOldBal,
            new: bal,
          });

          resolve({ status: 'success' });
        }).catch((err) => {
          resolve({ status: 'error', message: 'Neizdevās labot' });
        });


      }).catch((err) => {
        resolve({ status: 'error', message: 'Neizdevās labot' });
      });
  });
}

export function editBan(uid, endDate, reason) {
  if (Firebase === null) return () => new Promise(resolve => resolve());

  const endDate2 = new Date(endDate);

  const endDateParsed = Date.parse(endDate2);

  if (!uid) { return () => new Promise(resolve => resolve({ status: 'error', message: 'Nav id' })); }
  if (!reason) { return () => new Promise(resolve => resolve({ status: 'error', message: 'Nav iemesla' })); }
  if (!endDateParsed || !(endDate2 instanceof Date)) { return () => new Promise(resolve => resolve({ status: 'error', message: 'Nav beigu laika' })); }

  let blocked = false;
  if (endDate > Date.now()) {
    blocked = true;
  }

  return () => new Promise(resolve => FirebaseRef.child(`bans/${uid.toString()}`).update({
    endDate: endDateParsed,
    reason,
    blocked,
  }).then(() => {
    FirebaseRef.child(`users/${uid}`).update({
      banEndDate: endDateParsed,
      banReason: reason,
      blocked,
    });

    resolve({ status: 'success' });
  }).catch((err) => {
    resolve({ status: 'error', message: err });
  }));
}


export function addTournament(data) {
  console.log('addTournament');
  console.log(data);
  if (Firebase === null) return () => new Promise(resolve => resolve());

  const UID = (
    FirebaseRef
    && Firebase
    && Firebase.auth()
    && Firebase.auth().currentUser
    && Firebase.auth().currentUser.uid
  ) ? Firebase.auth().currentUser.uid : null;

  if (!UID) return false;

  const {
    name,
    bet,
    entryFee,
    chipsOnEnter,
    //  winningPot,
    bonus,
    everyDay,
    startTime,
    endTime,
    startDate,
    endDate,
    registrationStart,
    registrationEnd,
    //  registrationStartTime,
    //  registrationEndTime,
    winnerPercent,
    minPlayers,
    parasta,
    MG,
    atra,
    pro,
    // smallGame,
    maxPlayers,
    maxRndRoom,
    maxRndTourn,
  } = data;

  // Future edit - Remove and pass from data
  const smallGame = false;

  console.log(startTime);
  console.log(endTime);
  console.log(startDate);
  console.log(endDate);

  const startTimeParsed = Date.parse(startTime);
  const endTimeParsed = Date.parse(endTime);
  const startDateParsed = Date.parse(startDate);
  const endDateParsed = Date.parse(endDate);
  const registrationStartParsed = Date.parse(registrationStart);
  const registrationEndParsed = Date.parse(registrationEnd);
  //  const registrationStartTimeParsed = Date.parse(registrationStartTime);
  //  const registrationEndTimeParsed = Date.parse(registrationEndTime);

  console.log(startDateParsed);
  console.log(endDateParsed);
  //  console.log(registrationStartTimeParsed);
  //  console.log(registrationEndTimeParsed);

  if (!name) { return () => new Promise(resolve => resolve({ status: 'error', message: 'Nav nosaukuma' })); }
  if (!bet) { return () => new Promise(resolve => resolve({ status: 'error', message: 'Nav Likmes' })); }
  if (!entryFee) { return () => new Promise(resolve => resolve({ status: 'error', message: 'Nav ieejas maksas' })); }
  if (!chipsOnEnter) { return () => new Promise(resolve => resolve({ status: 'error', message: 'Nav sākuma žetonu' })); }
  //  if (!winningPot) { return () => new Promise(resolve => resolve({ status: 'error', message: 'Nav laimesta' })); }
  if (!bonus) { return () => new Promise(resolve => resolve({ status: 'error', message: 'Nav bonusa' })); }
  if (!winnerPercent) { return () => new Promise(resolve => resolve({ status: 'error', message: 'Nav uzvaras procenta' })); }
  if (!minPlayers) { return () => new Promise(resolve => resolve({ status: 'error', message: 'Nav min spēlētāju' })); }

  if (Number.isNaN(Number(entryFee)) || parseInt(entryFee, 10) <= 0) { return () => new Promise(resolve => resolve({ status: 'error', message: 'Ieejas maksai jābūt pozitīvam skaitlim' })); }
  if (Number.isNaN(Number(chipsOnEnter)) || parseInt(chipsOnEnter, 10) <= 0) { return () => new Promise(resolve => resolve({ status: 'error', message: 'Sākuma žetoniem jābūt pozitīvam skaitlim' })); }
  //  if (Number.isNaN(Number(winningPot)) || parseInt(winningPot, 10) <= 0) { return () => new Promise(resolve => resolve({ status: 'error', message: 'Laimestam jābūt pozitīvam skaitlim' })); }
  if (Number.isNaN(Number(bonus)) || parseInt(bonus, 10) < 0) { return () => new Promise(resolve => resolve({ status: 'error', message: 'Bonusam jābūt pozitīvam skaitlim' })); }
  if (!startTimeParsed || !(startTime instanceof Date)) { return () => new Promise(resolve => resolve({ status: 'error', message: 'Nav sākuma laika' })); }
  if (!endTimeParsed || !(endTime instanceof Date)) { return () => new Promise(resolve => resolve({ status: 'error', message: 'Nav beigu laika' })); }
  if (!registrationStartParsed || !(registrationStart instanceof Date)) { return () => new Promise(resolve => resolve({ status: 'error', message: 'Nav reģistrācijas sākuma laika' })); }
  if (!registrationEndParsed || !(registrationEnd instanceof Date)) { return () => new Promise(resolve => resolve({ status: 'error', message: 'Nav reģistrācijas beigu laika' })); }
  if (Number.isNaN(Number(winnerPercent)) || parseInt(winnerPercent, 10) <= 0 || parseInt(winnerPercent, 10) > 100) { return () => new Promise(resolve => resolve({ status: 'error', message: 'Uzvaras procentam jābūt pozitīvam skaitlim' })); }
  if (Number.isNaN(Number(minPlayers)) || parseInt(minPlayers, 10) <= 0) { return () => new Promise(resolve => resolve({ status: 'error', message: 'Min spēlētājiem jābūt pozitīvam skaitlim' })); }

  if (minPlayers % 3 !== 0) { return () => new Promise(resolve => resolve({ status: 'error', message: 'Min spēlētaju skaitam jādalās ar 3' })); }

  let gameType = 'P';
  if (parasta) {
    gameType = 'P';
  } else if (MG) {
    gameType = 'G';
  }

  // return () => new Promise(resolve => resolve({ status: 'success' }));

  return () => new Promise(resolve => FirebaseRef.child('tournaments').push({
    name,
    bet,
    entryFee,
    chipsOnEnter,
    //  winningPot,
    bonus,
    everyDay,
    startTime: startTimeParsed,
    endTime: endTimeParsed,
    startDate: startDateParsed,
    endDate: endDateParsed,
    registrationStart: registrationStartParsed,
    registrationEnd: registrationEndParsed,
    winnerPercent,
    minPlayers,
    gameType,
    smallGame,
    atra,
    pro,
    maxPlayers: maxPlayers || null,
    maxRndRoom: maxRndRoom || null,
    maxRndTourn: maxRndTourn || null,
    totalBank: 0,
    completed: false,
  }).then(() => {
    resolve({ status: 'success' });
  }).catch((err) => {
    resolve({ status: 'error', message: err });
  }));
}


export function editTournament(data) {
  console.log('editTournament');
  console.log(data);
  if (Firebase === null) return () => new Promise(resolve => resolve());

  const {
    tournamentToEdit,
    name,
    bet,
    entryFee,
    chipsOnEnter,
    //  winningPot,
    bonus,
    everyDay,
    startTime,
    endTime,
    startDate,
    endDate,
    registrationStart,
    registrationEnd,
    winnerPercent,
    minPlayers,
    parasta,
    MG,
    atra,
    pro,
    maxPlayers,
    maxRndRoom,
    maxRndTourn,

  //  smallGame,
  } = data;

  const smallGame = false;

  const startTimeParsed = Date.parse(startTime);
  const endTimeParsed = Date.parse(endTime);
  const startDateParsed = Date.parse(startDate);
  const endDateParsed = Date.parse(endDate);
  const registrationStartParsed = Date.parse(registrationStart);
  const registrationEndParsed = Date.parse(registrationEnd);

  if (!tournamentToEdit) { return () => new Promise(resolve => resolve({ status: 'error', message: 'Kļūda labojot turnīru' })); }
  if (!name) { return () => new Promise(resolve => resolve({ status: 'error', message: 'Nav nosaukuma' })); }
  if (!bet) { return () => new Promise(resolve => resolve({ status: 'error', message: 'Nav Likmes' })); }
  if (!entryFee) { return () => new Promise(resolve => resolve({ status: 'error', message: 'Nav ieejas maksas' })); }
  if (!chipsOnEnter) { return () => new Promise(resolve => resolve({ status: 'error', message: 'Nav sākuma žetonu' })); }
  //  if (!winningPot) { return () => new Promise(resolve => resolve({ status: 'error', message: 'Nav laimesta' })); }
  if (!bonus) { return () => new Promise(resolve => resolve({ status: 'error', message: 'Nav bonusa' })); }
  if (!winnerPercent) { return () => new Promise(resolve => resolve({ status: 'error', message: 'Nav uzvaras procenta' })); }
  if (!minPlayers) { return () => new Promise(resolve => resolve({ status: 'error', message: 'Nav min spēlētāju' })); }

  if (Number.isNaN(Number(entryFee)) || parseInt(entryFee, 10) <= 0) { return () => new Promise(resolve => resolve({ status: 'error', message: 'Ieejas maksai jābūt pozitīvam skaitlim' })); }
  if (Number.isNaN(Number(chipsOnEnter)) || parseInt(chipsOnEnter, 10) <= 0) { return () => new Promise(resolve => resolve({ status: 'error', message: 'Sākuma žetoniem jābūt pozitīvam skaitlim' })); }
  //  if (Number.isNaN(Number(winningPot)) || parseInt(winningPot, 10) <= 0) { return () => new Promise(resolve => resolve({ status: 'error', message: 'Laimestam jābūt pozitīvam skaitlim' })); }
  if (Number.isNaN(Number(bonus)) || parseInt(bonus, 10) < 0) { return () => new Promise(resolve => resolve({ status: 'error', message: 'Bonusam jābūt pozitīvam skaitlim' })); }
  if (!startTimeParsed || !(startTime instanceof Date)) { return () => new Promise(resolve => resolve({ status: 'error', message: 'Nav sākuma laika' })); }
  if (!endTimeParsed || !(endTime instanceof Date)) { return () => new Promise(resolve => resolve({ status: 'error', message: 'Nav beigu laika' })); }
  if (!startDateParsed || !(startDate instanceof Date)) { return () => new Promise(resolve => resolve({ status: 'error', message: 'Nav sākuma datuma' })); }
  if (!endDateParsed || !(endDate instanceof Date)) { return () => new Promise(resolve => resolve({ status: 'error', message: 'Nav beigu datuma' })); }
  if (!registrationStartParsed || !(registrationStart instanceof Date)) { return () => new Promise(resolve => resolve({ status: 'error', message: 'Nav reģistrācijas sākuma laika' })); }
  if (!registrationEndParsed || !(registrationEnd instanceof Date)) { return () => new Promise(resolve => resolve({ status: 'error', message: 'Nav reģistrācijas beigu laika' })); }
  if (Number.isNaN(Number(winnerPercent)) || parseInt(winnerPercent, 10) <= 0 || parseInt(winnerPercent, 10) > 100) { return () => new Promise(resolve => resolve({ status: 'error', message: 'Uzvaras procentam jābūt pozitīvam skaitlim' })); }
  if (Number.isNaN(Number(minPlayers)) || parseInt(minPlayers, 10) <= 0) { return () => new Promise(resolve => resolve({ status: 'error', message: 'Min spēlētājiem jābūt pozitīvam skaitlim' })); }

  if (minPlayers % 3 !== 0) { return () => new Promise(resolve => resolve({ status: 'error', message: 'Min spēlētaju skaitam jādalās ar 3' })); }

  let gameType = 'P';
  if (parasta) {
    gameType = 'P';
  } else if (MG) {
    gameType = 'G';
  }


  return () => new Promise(resolve => FirebaseRef.child(`tournaments/${tournamentToEdit}`).update({
    name,
    bet,
    entryFee,
    chipsOnEnter,
    //  winningPot,
    bonus,
    everyDay,
    startTime: startTimeParsed,
    endTime: endTimeParsed,
    startDate: startDateParsed,
    endDate: endDateParsed,
    registrationStart: registrationStartParsed,
    registrationEnd: registrationEndParsed,
    winnerPercent,
    minPlayers,
    gameType,
    atra,
    smallGame,
    pro,
    maxPlayers: maxPlayers || null,
    maxRndRoom: maxRndRoom || null,
    maxRndTourn: maxRndTourn || null,
  }).then(() => {
    resolve({ status: 'success' });
  }).catch((err) => {
    resolve({ status: 'error', message: err });
  }));
}

export function deleteTournament(tournamentId) {
  if (Firebase === null) return () => new Promise(resolve => resolve());

  return () => new Promise(resolve => Firebase.auth().onAuthStateChanged((user) => {
    if (user) {
      FirebaseRef.child(`tournaments/${tournamentId}`).remove().then((result) => {
        resolve({ status: 'success' });
      }).catch((err) => {
        resolve({ status: 'error', message: err });
      });
    }
  }));
}

/*
export function getAllRoomsLogs() {
  if (Firebase === null) return () => new Promise(resolve => resolve());

  return dispatch => new Promise(resolve => FirebaseRef.child('adminLogs/roomIds')
    .once('value', (snapshot) => {
      const data = snapshot.val() || {};

      return resolve(dispatch({ type: 'ADMIN_LOGS_ROOMS', data }));
    })).catch((err) => { throw err.message; });
} */


export function getRoomLog(roomId) {
  console.log('getRoomLog');
  console.log(roomId);
  if (Firebase === null) return () => new Promise(resolve => resolve());

  // Set FirebaseRef to AdminLogsRef
  return dispatch => new Promise(resolve => AdminLogsRef.child(`adminLogs/rooms/${roomId}`)
    .once('value', (snapshot) => {
      const data = snapshot.val() || {};

      console.log('data');
      console.log(data);

      return resolve(dispatch({ type: 'ADMIN_ROOM_LOGS', data, roomId }));
    }, (err) => { console.log(err) })).catch((err) => { throw err.message; });
}


export function getUserBalanceHistory(userId) {
  if (Firebase === null) return () => new Promise(resolve => resolve());

  const UID = (
    FirebaseRef
    && Firebase
    && Firebase.auth()
    && Firebase.auth().currentUser
    && Firebase.auth().currentUser.uid
  ) ? Firebase.auth().currentUser.uid : null;

  if (!UID) return () => new Promise(resolve => resolve());

  const startAt = Date.now() - (1000 * 60 * 60 * 24 * 7);
  const endAt = Date.now();
  return dispatch => new Promise(resolve => FirebaseRef.child(`userBalHistory/${userId.toString()}`)
    .orderByChild('time')
    .startAt(startAt)
    .endAt(endAt)
    .once('value', (snapshot) => {
      const history = snapshot.val() || {};

      console.log(history);

      resolve(dispatch({
        type: 'USER_BAL_HISTORY',
        data: history,
      }));
    }));
}

export function setNextDealCards(roomId, cards) {
  if (Firebase === null) return () => new Promise(resolve => resolve());

  const UID = (
    FirebaseRef
    && Firebase
    && Firebase.auth()
    && Firebase.auth().currentUser
    && Firebase.auth().currentUser.uid
  ) ? Firebase.auth().currentUser.uid : null;

  if (!UID) return () => new Promise(resolve => resolve());

  return () => new Promise((resolve) => {
    const setNextDealCardsFunction = Firebase.app().functions().httpsCallable('setNextDealCards');

    setNextDealCardsFunction({
      roomId,
      cards,
    }).then((result) => {
      console.log(result);
      resolve(result);
    });
  });
}

export function setUserBal(roomId, userId, userPos, newBal) {
  if (Firebase === null || !roomId || !userId || !userPos || !newBal) return () => new Promise(resolve => resolve());

  if (Number.isNaN(newBal)) return () => new Promise(resolve => resolve());

  const UID = (
    FirebaseRef
    && Firebase
    && Firebase.auth()
    && Firebase.auth().currentUser
    && Firebase.auth().currentUser.uid
  ) ? Firebase.auth().currentUser.uid : null;

  if (!UID) return () => new Promise(resolve => resolve());

  return () => new Promise((resolve) => {
    RoomsRef.child(`rooms/${roomId}/players/${userPos}`).update({
      bal: parseInt(newBal, 10),
    });

    RoomsRef.child(`rooms/${roomId}/playersList/${userPos}`).update({
      bal: parseInt(newBal, 10),
    });

    FirebaseRef.child(`users/${userId}`).update({
      bal: parseInt(newBal, 10),
    });

    //  FirebaseRef.child(`leaderboard/${userId}`).update({
    //    bal: newBal,
    //  });

    resolve('success');
  });
}


export function setUserTournamentBal(roomId, tournamentId, userId, userPos, newBal) {
//  console.log(roomId);
//  console.log(tournamentId);
//  console.log(userId);
//  console.log(userPos);
//  console.log(newBal);

  if (Firebase === null || !roomId || !userId || !userPos || !newBal) return () => new Promise(resolve => resolve());

  if (Number.isNaN(newBal)) return () => new Promise(resolve => resolve());

  const UID = (
    FirebaseRef
    && Firebase
    && Firebase.auth()
    && Firebase.auth().currentUser
    && Firebase.auth().currentUser.uid
  ) ? Firebase.auth().currentUser.uid : null;

  if (!UID) return () => new Promise(resolve => resolve());

  return () => new Promise((resolve) => {
    RoomsRef.child(`rooms/${roomId}/players/${userPos}`).update({
      bal: parseInt(newBal, 10),
    });

    RoomsRef.child(`rooms/${roomId}/playersList/${userPos}`).update({
      bal: parseInt(newBal, 10),
    });

    FirebaseRef.child(`tourPlayerData/${userId}/${tournamentId}`).update({
      bal: parseInt(newBal, 10),
    });

    FirebaseRef.child(`tourPlayers/${tournamentId}/${userId}`).update({
      bal: parseInt(newBal, 10),
    });

    resolve('success');
  });
}

export function disableTimer(roomId) {
  if (Firebase === null) return () => new Promise(resolve => resolve());

  const UID = (
    FirebaseRef
    && Firebase
    && Firebase.auth()
    && Firebase.auth().currentUser
    && Firebase.auth().currentUser.uid
  ) ? Firebase.auth().currentUser.uid : null;

  if (!UID) return () => new Promise(resolve => resolve());

  return () => new Promise(resolve => RoomsRef.child(`rooms/${roomId}/globalParams/disableTimer`).once('value', (disabledSnapshot) => {
    const disabled = disabledSnapshot.val() || false;
    RoomsRef.child(`rooms/${roomId}/globalParams`).update({
      disableTimer: !disabled,
    });

    resolve('success');
  }));
}

export function getSmartLookEnabled() {
  if (Firebase === null) return () => new Promise(resolve => resolve());

  return dispatch => new Promise(resolve => FirebaseRef.child(`smartLookEnabled`)
  .on('value', (snapshot) => {
    const smartLookEnabled = snapshot.val() || false;

    resolve(dispatch({
      type: 'SMARTLOOK_STATUS',
      data: smartLookEnabled,
    }));
  }));
}

export function changeSmartLook(value) {
  if (Firebase === null) return () => new Promise(resolve => resolve());
  return () => new Promise(resolve => {
    FirebaseRef.child(`smartLookEnabled`).set(value);

    return resolve();
  });
}



export function getCardPlayedLog(roomId) {
  if (Firebase === null) return () => new Promise(resolve => resolve());


  return dispatch => new Promise((resolve) => {
    FirebaseRef.child(`cardPlayedLog4/${roomId}`).once('value', (snapshot) => {
        const cardPlayedLog4 = snapshot.val() || {};

        console.log('cardPlayedLog4');
        console.log(cardPlayedLog4);

        return resolve();
      });
  }).catch((err) => { throw err.message; });
}

/* export function getCardPlayedLog2() {
  if (Firebase === null) return () => new Promise(resolve => resolve());


  return dispatch => new Promise((resolve) => {
    FirebaseRef.child(`cardPlayedLog5`).once('value', (snapshot) => {
        const cardPlayedLog5 = snapshot.val() || {};

        console.log('cardPlayedLog5');
        console.log(cardPlayedLog5);

        return resolve();
      });
  }).catch((err) => { throw err.message; });
}  */
