// const { admin } = require('../admin');

const sortLeaderboardDayTop100 = () => new Promise(((resolve, reject) => {
  const { admin, leaderboardDb } = require('../admin');

  let position = 0;
  let lastPoints = null;
  let equalUsers = [];

  admin.database(leaderboardDb).ref('dailyLeaderboardPoints')
    .orderByChild('tP')
    .limitToLast(100)
    .once('value', (snapshot) => {
      const snapshotLength = snapshot.numChildren();

      const leaderboardUpdates = {};
      const userHasReachedTop100Updates = {};

      snapshot.forEach((childSnapshot) => {
        const { tP, bal } = childSnapshot.val();

        if (lastPoints === tP || tP === null || tP === undefined) {
          equalUsers.push({ key: childSnapshot.key, tP, bal });
        } else {
          equalUsers.sort((a, b) => {
            if (a.bal && b.bal) {
              return parseInt(a.bal, 10) - parseInt(b.bal, 10);
            } if (a.bal) {
              return true;
            }
            return false;
          });

          equalUsers.map((user) => {
            const pos = snapshotLength - position;

          //  admin.database().ref(`leaderboard/daily/${user.key}`).update({
          //    pos,
          //  });

          //  admin.database().ref(`userHasReachedTop100/${user.key}`).set(true);

            leaderboardUpdates[`${user.key}/pos`] = pos;
            userHasReachedTop100Updates[`${user.key}`] = true;

            position += 1;
            return null;
          });
          const pos = snapshotLength - position;

        //  admin.database().ref(`leaderboard/daily/${childSnapshot.key}`).update({
        //    pos,
        //  });

        //  admin.database().ref(`userHasReachedTop100/${childSnapshot.key}`).set(true);

        //  leaderboardUpdates[`${childSnapshot.key}/pos`] = pos;
          userHasReachedTop100Updates[`${childSnapshot.key}`] = true;

          position += 1;
          equalUsers = [];
        }
        lastPoints = tP;
      });

      equalUsers.sort((a, b) => {
        if (a.bal && b.bal) {
          return parseInt(a.bal, 10) - parseInt(b.bal, 10);
        } if (a.bal) {
          return true;
        }
        return false;
      });

      equalUsers.map((user) => {
        const pos = snapshotLength - position;

      // admin.database().ref(`leaderboard/daily/${user.key}`).update({
      //    pos,
      //  });

      //  admin.database().ref(`userHasReachedTop100/${user.key}`).set(true);

        leaderboardUpdates[`${user.key}/pos`] = pos;
        userHasReachedTop100Updates[`${user.key}`] = true;

        position += 1;
        return null;
      });

    //  admin.database().ref('leaderboard/daily').update(leaderboardUpdates);
      admin.database(leaderboardDb).ref('leaderboard/daily').update(leaderboardUpdates);
      admin.database().ref('userHasReachedTop100').update(userHasReachedTop100Updates);

      resolve();
    })
    .catch((err) => {
      console.log(err);
      reject(err);
    });
}));

module.exports = sortLeaderboardDayTop100;
