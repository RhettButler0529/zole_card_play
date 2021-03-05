import { Firebase, FirebaseRef } from '../lib/firebase';


export function getTournamentRooms() {
  if (Firebase === null) return () => new Promise(resolve => resolve());

  return dispatch => new Promise(resolve => FirebaseRef.child('tournamentRooms')
    .on('value', (snapshot) => {
      const data = snapshot.val() || {};

      return resolve(dispatch({ type: 'TOURNAMENT_ROOMS_REPLACE', data }));
    })).catch((err) => { throw err.message; });
}

export function getTournamentPlayers(tournamentId) {
  if (Firebase === null) return () => new Promise(resolve => resolve());

  return dispatch => new Promise(resolve => FirebaseRef.child(`tourPlayers/${tournamentId}`)
    .on('value', (snapshot) => {
      const players = snapshot.val() || {};

      return resolve(dispatch({ type: 'TOURNAMENT_PLAYERS_REPLACE', data: [{ players, tournamentId }] }));
    })).catch((err) => { throw err.message; });
}


export function getMyTournamentData(tournamentId) {
  if (Firebase === null) return () => new Promise(resolve => resolve());

  const UID = (
    FirebaseRef
    && Firebase
    && Firebase.auth()
    && Firebase.auth().currentUser
    && Firebase.auth().currentUser.uid
  ) ? Firebase.auth().currentUser.uid : null;

  if (!UID) return false;

  return dispatch => new Promise(resolve => FirebaseRef.child(`tourPlayers/${tournamentId}/${UID}`)
    .on('value', (snapshot) => {
      const playerData = snapshot.val() || {};

    //  console.log('playerData');
    //  console.log(playerData);

      if (playerData && Object.keys(playerData).length !== 0) {
        FirebaseRef.child(`tourPlWaitList/${tournamentId}/${UID}`)
          .once('value', (snapshot2) => {
            const status = snapshot2.val() || {};

            resolve(dispatch({
              type: 'MY_TOURNAMENTS_DATA',
              data: {
                playerData,
                status: !!status.uid,
                tournamentId,
              },
            }));
          });
      } else {
        resolve(dispatch({
          type: 'MY_TOURNAMENTS_DATA',
          data: {
            playerData,
            status: false,
            tournamentId,
          },
        }));
      }
    }).catch((err) => {
      console.log(err);
    }));
}


export function getMyTournamentsData() {
  if (Firebase === null) return () => new Promise(resolve => resolve());

  const UID = (
    FirebaseRef
    && Firebase
    && Firebase.auth()
    && Firebase.auth().currentUser
    && Firebase.auth().currentUser.uid
  ) ? Firebase.auth().currentUser.uid : null;

  if (!UID) return false;

  return dispatch => new Promise(resolve => FirebaseRef.child(`tourPlayerData/${UID}`)
    .orderByChild('ended')
    .equalTo(false)
    .on('value', (snapshot) => {
      const playerData = snapshot.val() || {};

      //  if (playerData && Object.keys(playerData).length !== 0) {
      //    FirebaseRef.child(`tourPlWaitList/${tournamentId}/${UID}`)
      //      .once('value', (snapshot2) => {
      //        const status = snapshot2.val() || {};

      //        resolve(dispatch({
      //          type: 'MY_TOURNAMENTS_DATA',
      //          data: {
      //            playerData,
      //            status: !!status.uid,
      //            tournamentId,
      //          },
      //        }));
      //      });
      //  } else {
      resolve(dispatch({
        type: 'MY_TOURNAMENTS_DATA_2',
        data: playerData,
      }));
    //  }
      //  }).catch((err) => {
      //    console.log(err);
    }));
}


export function getMyTournamentsHistory() {
  if (Firebase === null) return () => new Promise(resolve => resolve());

  const UID = (
    FirebaseRef
    && Firebase
    && Firebase.auth()
    && Firebase.auth().currentUser
    && Firebase.auth().currentUser.uid
  ) ? Firebase.auth().currentUser.uid : null;

  if (!UID) return false;

  return dispatch => new Promise(resolve => FirebaseRef.child(`tourHistory/${UID}`)
    .on('value', (snapshot) => {
      const history = snapshot.val() || {};

      resolve(dispatch({
        type: 'MY_TOURNAMENTS_HISTORY',
        data: history,
      }));
    }));
}


export function getMyTournamentStatus(tournamentId) {
  if (Firebase === null) return () => new Promise(resolve => resolve());

  const UID = (
    FirebaseRef
    && Firebase
    && Firebase.auth()
    && Firebase.auth().currentUser
    && Firebase.auth().currentUser.uid
  ) ? Firebase.auth().currentUser.uid : null;

  if (!UID) return false;

  return dispatch => new Promise(resolve => FirebaseRef.child(`tourPlWaitList/${tournamentId}/${UID}`)
    .once('value', (snapshot) => {
      const status = snapshot.val() || {};

      resolve(dispatch({
        type: 'MY_TOURNAMENTS_STATUS',
        data: {
          status,
          tournamentId,
        },
      }));
    }).catch((err) => { throw err.message; }));
}


export function getTournaments() {
  if (Firebase === null) return () => new Promise(resolve => resolve());

  const UID = (
    FirebaseRef
    && Firebase
    && Firebase.auth()
    && Firebase.auth().currentUser
    && Firebase.auth().currentUser.uid
  ) ? Firebase.auth().currentUser.uid : null;

  if (!UID) return () => new Promise(resolve => resolve());

  return dispatch => new Promise(resolve => FirebaseRef.child('tournaments')
    .orderByChild('completed')
    .equalTo(false)
    .on('value', (snapshot) => {
      const data = snapshot.val() || {};

    //  console.log('getTournaments');
    //  console.log(data);

      const tournamentPlayers = Object.keys(data)
        .map(key => new Promise(resolve2 => FirebaseRef.child(`tourPlayers/${key}`)
          .once('value', (snapshot2) => {
            const players = snapshot2.val() || {};

            return resolve2({
              tournamentId: key,
              players,
            });
          })));

      Promise.all(tournamentPlayers).then(players => resolve(dispatch({
        type: 'TOURNAMENT_PLAYERS_REPLACE',
        data: players,
      })));

      return resolve(dispatch({ type: 'TOURNAMENTS_REPLACE', data }));
    })).catch((err) => { throw err.message; });
}

export function joinTournament(tournamentId) {
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
    const joinTournamentFunction = Firebase.app().functions('europe-west1').httpsCallable('joinTournament');

    joinTournamentFunction({
      tournamentId,
    }).then((result) => {
      //  getMyTournamentData(tournamentId);
      const { data } = result;
      getMyTournamentData(tournamentId);
      resolve(dispatch({ type: 'JOINED_TOURNAMENT', data }));
    });
  });
}

export function joinTournamentRoom(tournamentId) {
  if (Firebase === null) return () => new Promise(resolve => resolve());

  const UID = (
    FirebaseRef
      && Firebase
      && Firebase.auth()
      && Firebase.auth().currentUser
      && Firebase.auth().currentUser.uid
  ) ? Firebase.auth().currentUser.uid : null;

  if (!UID) return false;

  return dispatch => new Promise((resolve) => {
    const joinTournamentRoomFunction = Firebase.app().functions('europe-west1').httpsCallable('joinTournamentRoom');

    joinTournamentRoomFunction({
      tournamentId,
    }).then((result) => {
      resolve(dispatch({ type: 'JOINED_TOURNAMENT_ROOM', data: result }));
    });
  });
}


export function joinRoom(roomId, position) {
  if (Firebase === null) return () => new Promise(resolve => resolve());

  return dispatch => new Promise(resolve => Firebase.auth().onAuthStateChanged((user) => {
    if (user) {
      const joinRoomFunction = Firebase.app().functions('europe-west1').httpsCallable('joinRoom');

      joinRoomFunction({
        roomId,
        position,
      }).then((result) => {
        resolve(dispatch({ type: 'JOINED_ROOM', data: result }));
      });
    }
  }));
}


export function resetTournamentStore() {
  if (Firebase === null) return () => new Promise(resolve => resolve());

  const UID = (
    FirebaseRef
    && Firebase
    && Firebase.auth()
    && Firebase.auth().currentUser
    && Firebase.auth().currentUser.uid
  ) ? Firebase.auth().currentUser.uid : null;

  if (!UID) return () => new Promise(resolve => resolve());

  return dispatch => new Promise(resolve => FirebaseRef.child('tournaments')
    .orderByChild('status')
    .equalTo('running')
    .on('value', (snapshot) => {
      const data = snapshot.val() || {};

      Object.keys(data).map((key) => {
        FirebaseRef.child(`tourPlayers/${key}/${UID}`).off();
        return null;
      });

      return resolve(dispatch({ type: 'RESET_STORE' }));
    })).catch((err) => { throw err.message; });
}


export function getTournamentsHistory() {
  if (Firebase === null) return () => new Promise(resolve => resolve());

  return dispatch => new Promise(resolve => FirebaseRef.child('tournaments')
    .once('value', (snapshot) => {
      const tournaments = snapshot.val() || {};

      return resolve(dispatch({ type: 'TOURNAMENTS_HISTORY_REPLACE', data: tournaments }));
    })).catch((err) => { throw err.message; });
}


export function getTournamentHistory(tournamentId) {
  if (Firebase === null) return () => new Promise(resolve => resolve());

  return dispatch => new Promise(resolve => FirebaseRef.child(`tourPlayers/${tournamentId}`)
    .on('value', (snapshot2) => {
      const players = snapshot2.val() || {};

      return resolve(dispatch({ type: 'TOURNAMENT_HISTORY_REPLACE', data: { players, tournamentId } }));
    })).catch((err) => { throw err.message; });
}


export function buyTournamentMoney(roomId, init) {
  if (Firebase === null) return () => new Promise(resolve => resolve());

  return dispatch => new Promise(resolve => Firebase.auth().onAuthStateChanged((user) => {
    if (user) {
      const buyTournamentMoneyFunction = Firebase.app().functions('europe-west1').httpsCallable('buyTournamentMoney');

      buyTournamentMoneyFunction({
        roomId,
        init,
      }).then((result) => {
        resolve(dispatch({ type: 'BUY_TOURNAMENT_MONEY', data: result }));
      });
    }
  }));
}

export function buyTournamentMoneyMenu(tournamentId) {
  if (Firebase === null) return () => new Promise(resolve => resolve());

  return dispatch => new Promise(resolve => Firebase.auth().onAuthStateChanged((user) => {
    if (user) {
      const buyTournamentMoneyMenuFunction = Firebase.app().functions('europe-west1').httpsCallable('buyTournamentMoneyMenu');

      buyTournamentMoneyMenuFunction({
        tournamentId,
      }).then((result) => {
        resolve(dispatch({ type: 'BUY_TOURNAMENT_MONEY_MENU', data: result }));
      });
    }
  }));
}

export function cancelTournamentWaitRoom(tournamentId) {
  if (Firebase === null) return () => new Promise(resolve => resolve());

  const UID = (
    FirebaseRef
    && Firebase
    && Firebase.auth()
    && Firebase.auth().currentUser
    && Firebase.auth().currentUser.uid
  ) ? Firebase.auth().currentUser.uid : null;

  if (!UID) return false;

  return dispatch => new Promise(resolve => FirebaseRef.child(`tourPlWaitList/${tournamentId}/${UID}`).remove()
    .then((res) => {
      resolve(dispatch({
        type: 'MY_TOURNAMENTS_DATA_STOP_WAIT',
        data: {
          status: false,
          tournamentId,
        },
      }));
      resolve('success');
    }));
}

export function leaveTournament(tournamentId) {
  if (Firebase === null) return () => new Promise(resolve => resolve());

  return dispatch => new Promise(resolve => Firebase.auth().onAuthStateChanged((user) => {
    if (user) {
      const leaveTournamentFunction = Firebase.app().functions('europe-west1').httpsCallable('leaveTournament');

      leaveTournamentFunction({
        tournamentId,
      }).then((result) => {
        resolve(dispatch({ type: 'LEAVE_TOURNAMENT', data: result }));
      });
    }
  }));
}
