const onUserLvlChange = (change, context) => new Promise(((resolve, reject) => {
  const { admin, leaderboardDb, roomsDb } = require('../admin');
  const beforeData = change.before.val();
  const afterData = change.after.val();

  const { userId } = context.params;

//  admin.database().ref(`status/${userId}`).update({
//    lvl: afterData,
//  });

/*  admin.database().ref(`leaderboard/allTime/${userId}`).update({
    lvl: afterData,
  });

  admin.database().ref(`leaderboard/daily/${userId}`).update({
    lvl: afterData,
  });

  admin.database().ref(`leaderboard/week/${userId}`).update({
    lvl: afterData,
  });

  admin.database().ref(`leaderboard/month/${userId}`).update({
    lvl: afterData,
  });

  admin.database().ref(`leaderboard/year/${userId}`).update({
    lvl: afterData,
  }); */


  admin.database().ref(`usersNames/${userId}`).update({
    lvl: afterData,
  });

  admin.database(leaderboardDb).ref(`leaderboard/allTime/${userId}`).update({
    lvl: afterData,
  });

  admin.database(leaderboardDb).ref(`leaderboard/daily/${userId}`).update({
    lvl: afterData,
  });

  admin.database(leaderboardDb).ref(`leaderboard/week/${userId}`).update({
    lvl: afterData,
  });

  admin.database(leaderboardDb).ref(`leaderboard/month/${userId}`).update({
    lvl: afterData,
  });

  admin.database(leaderboardDb).ref(`leaderboard/year/${userId}`).update({
    lvl: afterData,
  });

  admin.database().ref(`users/${userId}/joinedRooms`).once('value', (joinedRoomsSnapshot) => {
    const joinedRooms = joinedRoomsSnapshot.val() || {};
    if (joinedRooms) {
      Object.keys(joinedRooms).map((key) => {
        const { position } = joinedRooms[key];

        if (position) {
          admin.database(roomsDb).ref(`rooms/${key}/playersList/${position}`).update({
            lvl: afterData,
          });
        //  admin.database().ref(`rooms/${key}/players/${position}`).update({
        //    lvl: afterData,
        //  });
        }
        return null;
      });
    }
  });

/*  admin.database().ref(`users/${userId}/socId`).once('value', (socIdSnapshot) => {
    const socId = socIdSnapshot.val() || {};
    if (socId) {
      admin.database().ref(`fbUsers/${socId}`).update({
        lvl: afterData,
      });
    }
  }); */

  return resolve();
}));

module.exports = onUserLvlChange;
