const sortLeaderboard = () => new Promise(((resolve, reject) => {
  const { admin, leaderboardDb } = require('../admin');

  let position = 1;
  // const lastPoints = null;
  // const equalUsers = [];

  admin.database(leaderboardDb).ref('leaderboardPoints')
    .orderByChild('tP')
  //  .limitToLast(10000)
    .once('value', (snapshot) => {
      const snapshotLength = snapshot.numChildren();

    //  console.log('snapshotLength');
    //  console.log(snapshotLength);

      const value = snapshot.val();
      //  console.log(value);

      const valuesArray = [];

      Object.keys(value).map((key) => {
        valuesArray.push({ key, tP: value[key].tP, bal: value[key].bal });
        return null;
      });

      valuesArray.sort((a, b) => {
        if (a.tP === b.tP) {
          return b.bal - a.bal;
        }

        return b.tP - a.tP;
      });

      const leaderboardUpdates = {};
      const usersUpdates = {};

      for (let i = 0; i < snapshotLength; i += 1) {
        const pos = snapshotLength - position;

        position += 1;

        if (valuesArray[pos] && valuesArray[pos].key) {
          leaderboardUpdates[`${valuesArray[pos].key}/pos`] = pos + 1;
          usersUpdates[`${valuesArray[pos].key}/pos`] = pos + 1;
        } else {
          console.log(pos);
          console.log(valuesArray[pos]);
        }

        //  leaderboardUpdates[`${valuesArray[pos].key}/pos`] = pos + 1;
        //  usersUpdates[`${valuesArray[pos].key}/pos`] = pos + 1;

      //  if (pos < 20) {
      //    console.log(pos);
      //    console.log(valuesArray[pos]);
      //  }
      }

      //  console.log(leaderboardUpdates);
      //  console.log(usersUpdates);

    //  admin.database().ref('leaderboard/allTime').update(leaderboardUpdates);
      admin.database(leaderboardDb).ref('leaderboard/allTime').update(leaderboardUpdates);
    //  admin.database().ref('users').update(usersUpdates);

      /*  snapshot.forEach((childSnapshot) => {
        const { tP, bal } = childSnapshot.val();

        if (childSnapshot.key === '4736062') {
          console.log(tP);
          console.log(bal);
          console.log(position);
        }

        if (lastPoints === tP || tP === null || tP === undefined) {
          equalUsers.push({ key: childSnapshot.key, tP, bal });
        } else {
          if (equalUsers.length < 35) {
            equalUsers.sort((a, b) => {
              if (a.bal && b.bal) {
                return parseInt(a.bal, 10) - parseInt(b.bal, 10);
              } if (a.bal) {
                return true;
              }
              return false;
            });
          }

          for (let j = 0; j < equalUsers.length; j += 1) {
            const user = equalUsers[j];

            const pos = snapshotLength - position;

            admin.database().ref(`leaderboard/allTime/${user.key}`).update({
              pos,
            });

            admin.database().ref(`users/${user.key}`).update({
              pos,
            });

            position += 1;
          }

          /*  equalUsers.map((user) => {
            const pos = snapshotLength - position;

            console.log(`equal pos -  ${pos}`);

            admin.database().ref(`leaderboard/allTime/${user.key}`).update({
              pos,
            });

            admin.database().ref(`users/${user.key}`).update({
              pos,
            });

            position += 1;
            return null;
          }); */

      /*      const pos = snapshotLength - position;

          //  console.log(`Regular pos -  ${pos}`);

          admin.database().ref(`leaderboard/allTime/${childSnapshot.key}`).update({
            pos,
          });

          admin.database().ref(`users/${childSnapshot.key}`).update({
            pos,
          });

          position += 1;
          equalUsers = [];
        }
        lastPoints = tP;
      });

      if (equalUsers.length < 35) {
        equalUsers.sort((a, b) => {
          if (a.bal && b.bal) {
            return parseInt(a.bal, 10) - parseInt(b.bal, 10);
          } if (a.bal) {
            return true;
          }
          return false;
        });
      }

      for (let j = 0; j < equalUsers.length; j += 1) {
        const user = equalUsers[j];

        const pos = snapshotLength - position;

        admin.database().ref(`leaderboard/allTime/${user.key}`).update({
          pos,
        });

        admin.database().ref(`users/${user.key}`).update({
          pos,
        });

        position += 1;
      } */

      /*  equalUsers.map((user) => {
        const pos = snapshotLength - position;

        console.log(pos);

        admin.database().ref(`leaderboard/allTime/${user.key}`).update({
          pos,
        });

        admin.database().ref(`users/${user.key}`).update({
          pos,
        });

        position += 1;
        return null;
      }); */
      resolve('success');
    })
    .catch((err) => {
      console.log(err);
      reject(err);
    });
}));

module.exports = sortLeaderboard;
