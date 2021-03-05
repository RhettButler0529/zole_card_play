const onUserPointsChange = (change, context) => new Promise(((resolve, reject) => {
  const { admin, leaderboardDb } = require('../admin');
  const checkPlayerLevelUp = require('./checkPlayerLevelUp');
  const beforeData = change.before.val();
  const afterData = change.after.val();

  const { userId } = context.params;

  const changeAmount = afterData - beforeData;

  if (beforeData && (afterData || afterData === 0) && userId) {
    admin.database().ref(`leaderboard/allTime/${userId}`).update({
      totalPnts: afterData,
    });

    const promises = [];

  //  admin.database().ref(`status/${userId}`).update({
  //    totalPnts: afterData,
  //  });

  /*  admin.database().ref(`leaderboard/daily/${userId}/totalPnts`)
      .transaction(tP => (parseInt(tP, 10) || 0) + parseInt(changeAmount, 10));

    admin.database().ref(`leaderboard/week/${userId}/totalPnts`)
      .transaction(tP => (parseInt(tP, 10) || 0) + parseInt(changeAmount, 10));

    admin.database().ref(`leaderboard/month/${userId}/totalPnts`)
      .transaction(tP => (parseInt(tP, 10) || 0) + parseInt(changeAmount, 10));

    admin.database().ref(`leaderboard/year/${userId}/totalPnts`)
      .transaction(tP => (parseInt(tP, 10) || 0) + parseInt(changeAmount, 10));


    admin.database().ref(`leaderboardPoints/${userId}`).update({
      tP: afterData,
    });

    admin.database().ref(`dailyLeaderboardPoints/${userId}/tP`)
      .transaction(tP => (parseInt(tP, 10) || 0) + parseInt(changeAmount, 10));

    admin.database().ref(`weekLeaderboardPoints/${userId}/tP`)
      .transaction(tP => (parseInt(tP, 10) || 0) + parseInt(changeAmount, 10));

    admin.database().ref(`monthLeaderboardPoints/${userId}/tP`)
      .transaction(tP => (parseInt(tP, 10) || 0) + parseInt(changeAmount, 10));

    admin.database().ref(`yearLeaderboardPoints/${userId}/tP`)
      .transaction(tP => (parseInt(tP, 10) || 0) + parseInt(changeAmount, 10));
      */



      admin.database(leaderboardDb).ref(`leaderboard/allTime/${userId}`).update({
        totalPnts: afterData,
      });

      promises.push(admin.database(leaderboardDb).ref(`leaderboard/daily/${userId}/totalPnts`)
        .transaction(tP => (parseInt(tP, 10) || 0) + parseInt(changeAmount, 10)));

      promises.push(admin.database(leaderboardDb).ref(`leaderboard/week/${userId}/totalPnts`)
        .transaction(tP => (parseInt(tP, 10) || 0) + parseInt(changeAmount, 10)));

      promises.push(admin.database(leaderboardDb).ref(`leaderboard/month/${userId}/totalPnts`)
        .transaction(tP => (parseInt(tP, 10) || 0) + parseInt(changeAmount, 10)));

      promises.push(admin.database(leaderboardDb).ref(`leaderboard/year/${userId}/totalPnts`)
        .transaction(tP => (parseInt(tP, 10) || 0) + parseInt(changeAmount, 10)));


      admin.database(leaderboardDb).ref(`leaderboardPoints/${userId}`).update({
        tP: afterData,
      });

      promises.push(admin.database(leaderboardDb).ref(`dailyLeaderboardPoints/${userId}/tP`)
        .transaction(tP => (parseInt(tP, 10) || 0) + parseInt(changeAmount, 10)));

      promises.push(admin.database(leaderboardDb).ref(`weekLeaderboardPoints/${userId}/tP`)
        .transaction(tP => (parseInt(tP, 10) || 0) + parseInt(changeAmount, 10)));

      promises.push(admin.database(leaderboardDb).ref(`monthLeaderboardPoints/${userId}/tP`)
        .transaction(tP => (parseInt(tP, 10) || 0) + parseInt(changeAmount, 10)));

      promises.push(admin.database(leaderboardDb).ref(`yearLeaderboardPoints/${userId}/tP`)
        .transaction(tP => (parseInt(tP, 10) || 0) + parseInt(changeAmount, 10)));


      promises.push(admin.database().ref(`userAchievements/${userId}/maxPoints`).transaction(score => {
        if (score === null) {
          return score;
        }

        if (afterData > 0 && score < afterData) {
          return afterData;
        }

        return;
      }));

      promises.push(admin.database().ref(`userAchievements/${userId}/minPoints`).transaction(score => {
        if (score === null) {
          return score;
        }

        if (afterData < 0 && score > afterData) {
          return afterData;
        }

        return;
      }));


    promises.push(admin.database().ref(`users/${userId}/socId`).once('value', (socIdSnapshot) => {
      const socId = socIdSnapshot.val() || null;

      if (socId) {
        admin.database().ref(`fbUsers/${socId}`).update({
          totalPnts: afterData,
        });
      }

    //  return resolve();
  }));

    Promise.all(promises).then(() => {
    //  console.log('promisesRes');
    //  console.log(promisesRes);

      return checkPlayerLevelUp(change, context).then(() => resolve()).catch(err => reject(err));

    //  return resolve();
    }).catch((err) => {
      console.log(err);

    return checkPlayerLevelUp(change, context).then(() => resolve()).catch(err => reject(err));

    //  return resolve();
    });

  //  checkPlayerLevelUp(change, context).then(() => resolve()).catch(err => reject(err));
  } else {
    return resolve();
  }
}));

module.exports = onUserPointsChange;
