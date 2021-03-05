import { Firebase, LeaderboardRef } from '../lib/firebase';

export function getLeaderboard() {
  if (Firebase === null) return () => new Promise(resolve => resolve());

  return dispatch => new Promise((resolve) => {
  /*  FirebaseRef.child('leaderboard/allTime')
      .orderByChild('pos')
      .startAt(1)
      .endAt(10)
      .on('child_changed', (snapshot) => {
        const user = snapshot.val() || {};
        const { key } = snapshot;

        //  console.log('leaderboard/year user');
        //  console.log(key);
        //  console.log(user);

        dispatch({ type: 'LEADERBOARD_UPDATE', data: { user, key, index: user.pos } });
      }); */

    LeaderboardRef.child('leaderboard/allTime')
      .orderByChild('pos')
      .startAt(1)
      .endAt(10)
    //  .limitToLast(10)
      .once('value', (snapshot) => {
        const data = snapshot.val() || {};

        /*  const leaderboard = [];

      snapshot.forEach((childSnapshot) => {
        const childData = childSnapshot.val();

        const {
          totalPnts, pos, name, bal,
        } = childData;

        leaderboard.push({
          points: totalPnts, position: pos, name, balance: bal,
        });
      });

      const arr = Object.keys(data).map(key => ({
        position: data[key].pos,
        points: data[key].totalPnts,
        gamesPlayed: data[key].gPlayed,
        name: data[key].name,
        balance: data[key].bal,
        lvl: data[key].lvl,
      })) || [];

      arr.sort((a, b) => b.points - a.points); */

        return resolve(dispatch({ type: 'LEADERBOARD_REPLACE', data }));
      });
  }).catch((err) => { throw err.message; });
}


export function getLeaderboardYear() {
  if (Firebase === null) return () => new Promise(resolve => resolve());

  return dispatch => new Promise((resolve) => {
  /*  FirebaseRef.child('leaderboard/year')
      .orderByChild('pos')
      .startAt(1)
      .endAt(10)
      .on('child_changed', (snapshot) => {
        const user = snapshot.val() || {};
        const { key } = snapshot;

        dispatch({ type: 'LEADERBOARD_YEAR_UPDATE', data: { user, key, index: user.pos } });
      }); */

    LeaderboardRef.child('leaderboard/year')
      .orderByChild('totalPnts')
    //  .startAt(1)
    //  .endAt(10)
      .limitToLast(15)
      .once('value', (snapshot) => {
        const data = snapshot.val() || {};

        //  console.log('leaderboard/year');
        //  console.log(data);

        //  const leaderboard = [];

        /*  snapshot.forEach((childSnapshot) => {
        const childData = childSnapshot.val();

        const {
          totalPnts, pos, name, bal,
        } = childData;

        leaderboard.push({
          points: totalPnts, position: pos, name, balance: bal,
        });
      });

      const arr = Object.keys(data).map(key => ({
        position: data[key].pos,
        points: data[key].totalPnts,
        gamesPlayed: data[key].gPlayed,
        name: data[key].name,
        balance: data[key].bal,
        lvl: data[key].lvl,
      })) || [];

      arr.sort((a, b) => b.points - a.points); */

        return resolve(dispatch({ type: 'LEADERBOARD_YEAR_REPLACE', data }));
      });
  }).catch((err) => { throw err.message; });
}


export function getLeaderboardMonth() {
  if (Firebase === null) return () => new Promise(resolve => resolve());

  return dispatch => new Promise((resolve) => {
  /*  FirebaseRef.child('leaderboard/month')
      .orderByChild('pos')
      .startAt(1)
      .endAt(10)
      .on('child_changed', (snapshot) => {
        const user = snapshot.val() || {};
        const { key } = snapshot;

        dispatch({ type: 'LEADERBOARD_MONTH_UPDATE', data: { user, key, index: user.pos } });
      }); */

    LeaderboardRef.child('leaderboard/month')
      .orderByChild('totalPnts')
    //  .startAt(1)
    //  .endAt(10)
      .limitToLast(15)
      .once('value', (snapshot) => {
        const data = snapshot.val() || {};

      //  console.log(data);

        //  const leaderboard = [];

        /*  snapshot.forEach((childSnapshot) => {
        const childData = childSnapshot.val();

        const {
          totalPnts, pos, name, bal,
        } = childData;

        leaderboard.push({
          points: totalPnts, position: pos, name, balance: bal,
        });
      });

      const arr = Object.keys(data).map(key => ({
        position: data[key].pos,
        points: data[key].totalPnts,
        gamesPlayed: data[key].gPlayed,
        name: data[key].name,
        balance: data[key].bal,
        lvl: data[key].lvl,
      })) || [];

      arr.sort((a, b) => b.points - a.points); */

        return resolve(dispatch({ type: 'LEADERBOARD_MONTH_REPLACE', data }));
      });
  }).catch((err) => { throw err.message; });
}


export function getLeaderboardWeek() {
  if (Firebase === null) return () => new Promise(resolve => resolve());

  return dispatch => new Promise((resolve) => {
  /*  FirebaseRef.child('leaderboard/week')
      .orderByChild('pos')
      .startAt(1)
      .endAt(10)
      .on('child_changed', (snapshot) => {
        const user = snapshot.val() || {};
        const { key } = snapshot;

        console.log('child_changed');
        console.log(key);
        console.log(user);

        dispatch({ type: 'LEADERBOARD_WEEK_UPDATE', data: { user, key, index: user.pos } });
      }); */

    LeaderboardRef.child('leaderboard/week')
      .orderByChild('totalPnts')
    //  .startAt(1)
    //  .endAt(10)
      .limitToLast(15)
      .once('value', (snapshot) => {
        const data = snapshot.val() || {};

        //  const leaderboard = [];

        /*  snapshot.forEach((childSnapshot) => {
        const childData = childSnapshot.val();

        const {
          totalPnts, pos, name, bal,
        } = childData;

        leaderboard.push({
          points: totalPnts, position: pos, name, balance: bal,
        });
      });

      const arr = Object.keys(data).map(key => ({
        position: data[key].pos,
        points: data[key].totalPnts,
        gamesPlayed: data[key].gPlayed,
        name: data[key].name,
        balance: data[key].bal,
        lvl: data[key].lvl,
      })) || [];

      arr.sort((a, b) => b.points - a.points); */

        return resolve(dispatch({ type: 'LEADERBOARD_WEEK_REPLACE', data }));
      });
  }).catch((err) => { throw err.message; });
}


export function getLeaderboardDaily() {
  if (Firebase === null) return () => new Promise(resolve => resolve());

  return dispatch => new Promise((resolve) => {
  /*  FirebaseRef.child('leaderboard/daily')
      .orderByChild('pos')
      .startAt(1)
      .endAt(10)
      .on('child_changed', (snapshot) => {
        const user = snapshot.val() || {};
        const { key } = snapshot;

        //  console.log('child_changed');
        //  console.log(key);
        //  console.log(user);

        dispatch({ type: 'LEADERBOARD_DAILY_UPDATE', data: { user, key, index: user.pos } });
      }); */

    LeaderboardRef.child('leaderboard/daily')
      .orderByChild('totalPnts')
    //  .startAt(1)
    //  .endAt(10)
      .limitToLast(15)
      .once('value', (snapshot) => {
        const data = snapshot.val() || {};

      //  console.log('leaderboard data');
      //  console.log(data);

        //  const leaderboard = [];

        //  snapshot.forEach((childSnapshot) => {
        //    const childData = childSnapshot.val();

        //    const {
        //      totalPnts, pos, name, bal,
        //    } = childData;

        //    leaderboard.push({
        //      points: totalPnts, position: pos, name, balance: bal,
        //    });
        //  });

        //  const arr = Object.keys(data).map(key => ({
        //    position: data[key].pos,
        //    points: data[key].totalPnts,
        //    gamesPlayed: data[key].gPlayed,
        //    name: data[key].name,
        // /    balance: data[key].bal,
        //    lvl: data[key].lvl,
        //  })) || [];

        //  arr.sort((a, b) => b.points - a.points);

        return resolve(dispatch({ type: 'LEADERBOARD_DAILY_REPLACE', data }));
      });
  }).catch((err) => { throw err.message; });
}

// getPosition
export function getPositionInLeaderboard() {
  const UID = (
    LeaderboardRef
    && Firebase
    && Firebase.auth()
    && Firebase.auth().currentUser
    && Firebase.auth().currentUser.uid
  ) ? Firebase.auth().currentUser.uid : null;

  if (!UID) return false;

  return dispatch => new Promise(resolve => LeaderboardRef.child(`leaderboard/allTime/${UID}`)
    .on('value', (snapshot) => {
      const data = snapshot.val() || {};

      resolve(dispatch({
        type: 'MY_LEADERBOARD_POS',
        data: {
          position: data.pos,
          points: data.totalPnts,
          gamesPlayed: data.gPlayed,
          name: data.name,
          balance: data.bal,
          lvl: data.lvl,
        },
      }));
    }));
}


// getPosition
export function getPositionInLeaderboardYear() {
  const UID = (
    LeaderboardRef
    && Firebase
    && Firebase.auth()
    && Firebase.auth().currentUser
    && Firebase.auth().currentUser.uid
  ) ? Firebase.auth().currentUser.uid : null;

  if (!UID) return false;

  return dispatch => new Promise(resolve => LeaderboardRef.child(`leaderboard/year/${UID}`)
    .on('value', (snapshot) => {
      const data = snapshot.val() || {};

      resolve(dispatch({
        type: 'MY_LEADERBOARD_YEAR_POS',
        data: {
          position: data.pos,
          points: data.totalPnts,
          gamesPlayed: data.gPlayed,
          name: data.name,
          balance: data.bal,
          lvl: data.lvl,
        },
      }));
    }));
}


// getPosition
export function getPositionInLeaderboardMonth() {
  const UID = (
    LeaderboardRef
    && Firebase
    && Firebase.auth()
    && Firebase.auth().currentUser
    && Firebase.auth().currentUser.uid
  ) ? Firebase.auth().currentUser.uid : null;

  if (!UID) return false;

  return dispatch => new Promise(resolve => LeaderboardRef.child(`leaderboard/month/${UID}`)
    .on('value', (snapshot) => {
      const data = snapshot.val() || {};

      resolve(dispatch({
        type: 'MY_LEADERBOARD_MONTH_POS',
        data: {
          position: data.pos,
          points: data.totalPnts,
          gamesPlayed: data.gPlayed,
          name: data.name,
          balance: data.bal,
          lvl: data.lvl,
        },
      }));
    }));
}


// getPosition
export function getPositionInLeaderboardWeek() {
  const UID = (
    LeaderboardRef
    && Firebase
    && Firebase.auth()
    && Firebase.auth().currentUser
    && Firebase.auth().currentUser.uid
  ) ? Firebase.auth().currentUser.uid : null;

  if (!UID) return false;

  return dispatch => new Promise(resolve => LeaderboardRef.child(`leaderboard/week/${UID}`)
    .on('value', (snapshot) => {
      const data = snapshot.val() || {};

      resolve(dispatch({
        type: 'MY_LEADERBOARD_WEEK_POS',
        data: {
          position: data.pos,
          points: data.totalPnts,
          gamesPlayed: data.gPlayed,
          name: data.name,
          balance: data.bal,
          lvl: data.lvl,
        },
      }));
    }));
}

// getPosition
export function getPositionInLeaderboardDaily() {
  const UID = (
    LeaderboardRef
    && Firebase
    && Firebase.auth()
    && Firebase.auth().currentUser
    && Firebase.auth().currentUser.uid
  ) ? Firebase.auth().currentUser.uid : null;

  if (!UID) return false;

  return dispatch => new Promise(resolve => LeaderboardRef.child(`leaderboard/daily/${UID}`)
    .on('value', (snapshot) => {
      const data = snapshot.val() || {};

      resolve(dispatch({
        type: 'MY_LEADERBOARD_DAILY_POS',
        data: {
          position: data.pos,
          points: data.totalPnts,
          gamesPlayed: data.gPlayed,
          name: data.name,
          balance: data.bal,
          lvl: data.lvl,
        },
      }));
    }));
}
