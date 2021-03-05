// const { admin } = require('../admin');

const checkPlayerLevelUp = (change, context) => new Promise(((resolve, reject) => {
  const { admin } = require('../admin');
  const { pow } = require('mathjs');

  const { userId } = context.params;

  const promise1 = admin.database().ref(`users/${userId}/lvl`).once('value');
  const promise2 = admin.database().ref(`users/${userId}/gPlayed`).once('value');
  const promise3 = admin.database().ref(`users/${userId}/totalPnts`).once('value');
  const promise4 = admin.database().ref(`users/${userId}/lvlupLimit`).once('value');

  Promise.all([promise1, promise2, promise3, promise4])
    .then((promiseRes2) => {
      let lvl;
      let gPlayed;
      let totalPnts;
      let lvlupLimit;
      promiseRes2.map((res2, index) => {
        if (index === 0) {
          lvl = res2.val();
        } else if (index === 1) {
          gPlayed = res2.val();
        } else if (index === 2) {
          totalPnts = res2.val();
        } else if (index === 2) {
          lvlupLimit = res2.val();
        }
        return null;
      });

      //  admin.database().ref(`users/${userId}`).once('value', (userSnapshot) => {
      //  const userData = userSnapshot.val() || {};

      //  console.log('userData');
      //  console.log(userData);

      //  const {
      //    lvl, gPlayed, totalPnts, lvlupLimit,
      //  } = userData;

      if (parseInt(lvl, 10) === 1) {
        if (gPlayed >= 5) {
          admin.database().ref(`users/${userId}`).update({
            lvl: parseInt(lvl, 10) + 1,
            lvlupLimit: 10,
            lvlUpNotification: true,
          }).then(() => {
            //  admin.database().ref(`leaderboard/allTime/${userId}`).update({
            //    lvl: lvl + 1,
            //  });

            //  admin.database().ref(`leaderboard/daily/${userId}`).update({
            //    lvl: lvl + 1,
            //  });

            //  admin.database().ref(`leaderboard/week/${userId}`).update({
            //    lvl: lvl + 1,
            //  });

            //  admin.database().ref(`leaderboard/month/${userId}`).update({
            //    lvl: lvl + 1,
            //  });

            //  admin.database().ref(`leaderboard/year/${userId}`).update({
            //    lvl: lvl + 1,
            //  });

            /*  if (joinedRooms) {
            Object.keys(joinedRooms).map((key) => {
              const { position } = joinedRooms[key];

              admin.database().ref(`rooms/${key}/playersList/${position}`).update({
                lvl: lvl + 1,
              });
              admin.database().ref(`rooms/${key}/players/${position}`).update({
                lvl: lvl + 1,
              });
              return null;
            });
          } */
          })
            .then(() => resolve('success'))
            .catch(err => reject(err));
        } else {
          return resolve('no lvlUp');
        }
      } else if (parseInt(lvl, 10) === 2) {
        if (gPlayed >= 10) {
          admin.database().ref(`users/${userId}`).update({
            lvl: parseInt(lvl, 10) + 1,
            lvlupLimit: 20,
            lvlUpNotification: true,
          }).then(() => {
            //  admin.database().ref(`leaderboard/allTime/${userId}`).update({
            //    lvl: lvl + 1,
            //  });

            //  admin.database().ref(`leaderboard/daily/${userId}`).update({
            //    lvl: lvl + 1,
            //  });

            //  admin.database().ref(`leaderboard/week/${userId}`).update({
            //    lvl: lvl + 1,
            //  });

            //  admin.database().ref(`leaderboard/month/${userId}`).update({
            //    lvl: lvl + 1,
            //  });

            //  admin.database().ref(`leaderboard/year/${userId}`).update({
            //    lvl: lvl + 1,
            //  });

            /*  if (joinedRooms) {
            Object.keys(joinedRooms).map((key) => {
              const { position } = joinedRooms[key];

              admin.database().ref(`rooms/${key}/playersList/${position}`).update({
                lvl: lvl + 1,
              });
              admin.database().ref(`rooms/${key}/players/${position}`).update({
                lvl: lvl + 1,
              });
              return null;
            });
          } */
          })
            .then(() => resolve('success'))
            .catch(err => reject(err));
        } else {
          return resolve('no lvlUp');
        }
      } else if (parseInt(lvl, 10) === 3) {
        if (gPlayed >= 20 && totalPnts >= 10) {
          admin.database().ref(`users/${userId}`).update({
            lvl: parseInt(lvl, 10) + 1,
            lvlupLimit: 20 * 1.2,
            lvlUpNotification: true,
          }).then(() => {
            /*  admin.database().ref(`leaderboard/allTime/${userId}`).update({
            lvl: lvl + 1,
          });

          admin.database().ref(`leaderboard/daily/${userId}`).update({
            lvl: lvl + 1,
          });

          admin.database().ref(`leaderboard/week/${userId}`).update({
            lvl: lvl + 1,
          });

          admin.database().ref(`leaderboard/month/${userId}`).update({
            lvl: lvl + 1,
          });

          admin.database().ref(`leaderboard/year/${userId}`).update({
            lvl: lvl + 1,
          });

          if (joinedRooms) {
            Object.keys(joinedRooms).map((key) => {
              const { position } = joinedRooms[key];

              admin.database().ref(`rooms/${key}/playersList/${position}`).update({
                lvl: lvl + 1,
              });
              admin.database().ref(`rooms/${key}/players/${position}`).update({
                lvl: lvl + 1,
              });
              return null;
            });
          } */
            //  return resolve('success');
          })
            .then(() => resolve('success'))
            .catch(err => reject(err));
          //  return null;
        } else {
          return resolve('no lvlUp');
        }
        //  return null;
      } else if (parseInt(lvl, 10) >= 4) {
        if (lvlupLimit) {
          if (gPlayed >= lvlupLimit && totalPnts >= (10 + ((parseInt(lvl, 10) - 4) * 5))) {
            admin.database().ref(`users/${userId}`).update({
              lvl: parseInt(lvl, 10) + 1,
              lvlupLimit: Math.round(parseInt(lvlupLimit, 10) * 1.2),
              lvlUpNotification: true,
            }).then(() => resolve('success'))
              .catch(err => reject(err));
          } else {
            return resolve('no lvlUp');
          }
        } else {
        //  const oldLvlUpLimit = 20 * pow(1.2, lvl);
          let newLvlUpLimit = 20;
          for (let i = 4; i <= parseInt(lvl, 10); i += 1) {
            newLvlUpLimit *= 1.2;
          }

          //  console.log('newLvlUpLimit');
          //  console.log(newLvlUpLimit);

          //  console.log('oldLvlUpLimit 2');
          //  console.log(oldLvlUpLimit);
          //  console.log(lvl);

          //  return resolve('success');

          if (gPlayed >= newLvlUpLimit && totalPnts >= (10 + ((parseInt(lvl, 10) - 4) * 5))) {
            admin.database().ref(`users/${userId}`).update({
              lvl: parseInt(lvl, 10) + 1,
              lvlupLimit: Math.round(newLvlUpLimit),
              lvlUpNotification: true,
            }).then(() => resolve('success'))
              .catch(err => reject(err));
          } else {
            admin.database().ref(`users/${userId}`).update({
              //  lvl: lvl + 1,
              lvlupLimit: Math.round(newLvlUpLimit),
              //  lvlUpNotification: true,
            }).then(() => resolve('success'))
              .catch(err => reject(err));
          }
        }
      } else {
        return resolve('error with lvlUp');
      }
    })
    .catch((err) => {
      reject(err);
    });
}));

module.exports = checkPlayerLevelUp;
