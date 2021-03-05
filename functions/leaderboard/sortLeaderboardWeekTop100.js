// const { admin } = require('../admin');

const sortLeaderboardWeekTop100 = () => new Promise(((resolve, reject) => {
  const { admin, leaderboardDb } = require('../admin');

  let position = 0;
  let lastPoints = null;
  let equalUsers = [];

  admin.database(leaderboardDb).ref('weekLeaderboardPoints')
    .orderByChild('tP')
    .limitToLast(100)
    .once('value', (snapshot) => {
      const snapshotLength = snapshot.numChildren();

      const leaderboardUpdates = {};

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

          //  admin.database().ref(`leaderboard/week/${user.key}`).update({
          //    pos,
          //  });

            leaderboardUpdates[`${user.key}/pos`] = pos;

            position += 1;
            return null;
          });
          const pos = snapshotLength - position;

        //  admin.database().ref(`leaderboard/week/${childSnapshot.key}`).update({
        //    pos,
        //  });

          leaderboardUpdates[`${childSnapshot.key}/pos`] = pos;

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

      //  admin.database().ref(`leaderboard/week/${user.key}`).update({
      //    pos,
      //  });

        leaderboardUpdates[`${user.key}/pos`] = pos;

        position += 1;
        return null;
      });

    //  admin.database().ref('leaderboard/week').update(leaderboardUpdates);
      admin.database(leaderboardDb).ref('leaderboard/week').update(leaderboardUpdates);

      resolve();
    })
    .catch((err) => {
      console.log(err);
      reject(err);
    });
}));

module.exports = sortLeaderboardWeekTop100;
