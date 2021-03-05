const onUserBalChange = (change, context) => new Promise(((resolve, reject) => {
  const { admin, leaderboardDb, roomsDb } = require('../admin');
  const beforeData = change.before.val();
  const afterData = change.after.val();

  const { userId } = context.params;

  const changeAmount = afterData - beforeData;

  let promise1;
  let promise2;

  if (beforeData && (afterData || afterData === 0) && userId) {
    const promises = [];

    try {
    /*  promises.push(admin.database().ref(`leaderboard/allTime/${userId}`).update({
        bal: afterData,
      }));

      promises.push(admin.database().ref(`leaderboard/daily/${userId}/bal`)
        .transaction(bal => (parseInt(bal, 10) || 0) + parseInt(changeAmount, 10)));

      promises.push(admin.database().ref(`leaderboard/week/${userId}/bal`)
        .transaction(bal => (parseInt(bal, 10) || 0) + parseInt(changeAmount, 10)));

      promises.push(admin.database().ref(`leaderboard/month/${userId}/bal`)
        .transaction(bal => (parseInt(bal, 10) || 0) + parseInt(changeAmount, 10)));

      promises.push(admin.database().ref(`leaderboard/year/${userId}/bal`)
        .transaction(bal => (parseInt(bal, 10) || 0) + parseInt(changeAmount, 10)));


      promises.push(admin.database().ref(`leaderboardPoints/${userId}`).update({
        bal: afterData,
      }));

      promises.push(admin.database().ref(`dailyLeaderboardPoints/${userId}/bal`)
        .transaction(bal => (parseInt(bal, 10) || 0) + parseInt(changeAmount, 10)));

      promises.push(admin.database().ref(`weekLeaderboardPoints/${userId}/bal`)
        .transaction(bal => (parseInt(bal, 10) || 0) + parseInt(changeAmount, 10)));

      promises.push(admin.database().ref(`monthLeaderboardPoints/${userId}/bal`)
        .transaction(bal => (parseInt(bal, 10) || 0) + parseInt(changeAmount, 10)));

      promises.push(admin.database().ref(`yearLeaderboardPoints/${userId}/bal`)
        .transaction(bal => (parseInt(bal, 10) || 0) + parseInt(changeAmount, 10)));
        */

        // new db
        admin.database(leaderboardDb).ref(`leaderboard/allTime/${userId}`).update({
          bal: afterData,
        });

        promises.push(admin.database(leaderboardDb).ref(`leaderboard/daily/${userId}/bal`)
          .transaction(bal => (parseInt(bal, 10) || 0) + parseInt(changeAmount, 10)));

        promises.push(admin.database(leaderboardDb).ref(`leaderboard/week/${userId}/bal`)
          .transaction(bal => (parseInt(bal, 10) || 0) + parseInt(changeAmount, 10)));

        promises.push(admin.database(leaderboardDb).ref(`leaderboard/month/${userId}/bal`)
          .transaction(bal => (parseInt(bal, 10) || 0) + parseInt(changeAmount, 10)));

        promises.push(admin.database(leaderboardDb).ref(`leaderboard/year/${userId}/bal`)
          .transaction(bal => (parseInt(bal, 10) || 0) + parseInt(changeAmount, 10)));


        admin.database(leaderboardDb).ref(`leaderboardPoints/${userId}`).update({
          bal: afterData,
        });


        promises.push(admin.database(leaderboardDb).ref(`dailyLeaderboardPoints/${userId}/bal`)
          .transaction(bal => (parseInt(bal, 10) || 0) + parseInt(changeAmount, 10)));

        promises.push(admin.database(leaderboardDb).ref(`weekLeaderboardPoints/${userId}/bal`)
          .transaction(bal => (parseInt(bal, 10) || 0) + parseInt(changeAmount, 10)));

        promises.push(admin.database(leaderboardDb).ref(`monthLeaderboardPoints/${userId}/bal`)
          .transaction(bal => (parseInt(bal, 10) || 0) + parseInt(changeAmount, 10)));

        promises.push(admin.database(leaderboardDb).ref(`yearLeaderboardPoints/${userId}/bal`)
          .transaction(bal => (parseInt(bal, 10) || 0) + parseInt(changeAmount, 10)));

      /*  admin.database().ref(`dailyLeaderboardPoints/${userId}/tP`).once('value', (pointsSnapshot) => {
      const dailyLeaderboardPoints = pointsSnapshot.val() || null;

      if (!dailyLeaderboardPoints) {
        admin.database().ref(`dailyLeaderboardPoints/${userId}/tP`)
          .transaction(tP => (parseInt(tP, 10) || 0));
      }
    });

    admin.database().ref(`weekLeaderboardPoints/${userId}/tP`).once('value', (pointsSnapshot) => {
      const weekLeaderboardPoints = pointsSnapshot.val() || null;

      if (!weekLeaderboardPoints) {
        admin.database().ref(`weekLeaderboardPoints/${userId}/tP`)
          .transaction(tP => (parseInt(tP, 10) || 0));
      }
    });

    admin.database().ref(`monthLeaderboardPoints/${userId}/tP`).once('value', (pointsSnapshot) => {
      const monthLeaderboardPoints = pointsSnapshot.val() || null;

      if (!monthLeaderboardPoints) {
        admin.database().ref(`monthLeaderboardPoints/${userId}/tP`)
          .transaction(tP => (parseInt(tP, 10) || 0));
      }
    });  */

      promises.push(admin.database().ref(`users/${userId}/joinedRooms`).once('value', (joinedRoomsSnapshot) => {
        const joinedRooms = joinedRoomsSnapshot.val() || {};

      //  admin.database().ref(`status/${userId}`).update({
      //    bal: afterData,
      //  });

        if (joinedRooms) {
          Object.keys(joinedRooms).map((key) => {
            const { position, tournamentRoom } = joinedRooms[key];

            if (position && !tournamentRoom) {
              promises.push(admin.database(roomsDb).ref(`rooms/${key}/playersList/${position}`).update({
                bal: afterData,
              }));
            //  promises.push(admin.database().ref(`rooms/${key}/players/${position}`).update({
            //    bal: afterData,
            //  }));
            }
            return null;
          });
        }
      }));

      promises.push(admin.database().ref(`userAchievementsData/moneyToday/${userId}/moneyToday`).transaction(score => (parseInt(score, 10) || 0) + parseInt(changeAmount, 10)).then((result) => {
        if (result.committed && result.snapshot.val() && result.snapshot.val() > 0) {
          admin.database().ref(`userAchievements/${userId}/earnedInADay`).transaction(score2 => {
            if (score2 === null) {
              return score2;
            }

            if (score2 < result.snapshot.val()) {
              return result.snapshot.val();
            }

            return;
          });
        }
      }));

      promises.push(admin.database().ref(`userAchievements/${userId}/moneyTotal`).transaction(score => (parseInt(score, 10) || 0) + parseInt(changeAmount, 10)));

    /*  promise2 = admin.database().ref(`users/${userId}/socId`).once('value', (socIdSnapshot) => {
        const socId = socIdSnapshot.val() || null;

        if (socId) {
          admin.database().ref(`fbUsers/${socId}`).update({
            bal: afterData,
          });
        }
      }); */

      Promise.all(promises).then(() => {
      //  console.log('promisesRes');

        return resolve();
      }).catch((err) => {
        console.log(err);
        return resolve();
      });

    /*  if (promise1) {
        Promise.all([promise1]).then(() => resolve()).catch((err) => {
          console.log(err);
          return resolve();
        });
      } else {
        return resolve();
      } */
    } catch (err) {
      console.log('try catch error');
      console.log(err);
      return resolve();
    }
  } else {
  //  promise1 = new Promise(resolve2 => resolve2());
  //  promise2 = new Promise(resolve2 => resolve2());

    return resolve();
  }

  /* if (promise1 && promise2) {
    Promise.all([promise1, promise2]).then((promiseRes) => {
      console.log('promiseRes');
      console.log(promiseRes);
      return resolve();
    });
  } else {
    return resolve();
  } */

//  return resolve();
}));

module.exports = onUserBalChange;
