const axios = require('axios');

const checkOldLevel = (uid, socProvider) => new Promise(((resolve, reject) => {
  axios.get(`http://legacy.spelezoli.lv/?${socProvider === 'facebook' ? 'fbid' : 'drid'}=${uid.toString()}`, { timeout: 5000 })
    .then((info) => {
    if (info) {
      try {
        const { data } = info;
        if (data) {
          let oldLvl = 1;
          let oldGames = 0;
          let oldPoints = 0;

          if (data.level || data.level === 0) {
            oldLvl = parseInt(data.level, 10) + 1;
          }
          if (data.played_games) {
            oldGames = parseInt(data.played_games, 10);
          }
          if (data.total_positive_points && data.total_negative_points) {
            oldPoints = parseInt(data.total_positive_points, 10) + parseInt(data.total_negative_points, 10);
          }

          let newLevel = oldLvl;
          let newLvlUpLimit = 0;

          if (oldPoints && oldGames) {
            let pointsLevel = 3;
            while (oldPoints >= 10 + ((pointsLevel - 3) * 5)) {
              pointsLevel += 1;
            }

            let gamesLevel = 1;
            if (oldGames < 5) {
              gamesLevel = 1;
            } else if (oldGames < 10) {
              gamesLevel = 2;
            } else if (oldGames < 20) {
              gamesLevel = 3;
            } else {
              newLvlUpLimit = 20;
              let gamesLevel2 = 3;

              if (pointsLevel > 3) {
                for (let i = 4; i < 100; i += 1) {
                  newLvlUpLimit *= 1.2;
                  gamesLevel2 += 1;

                  if (newLvlUpLimit > oldGames || gamesLevel2 >= pointsLevel) {
                    break;
                  }
                }
              }

              gamesLevel = gamesLevel2;
            }

            newLevel = pointsLevel;
            if (gamesLevel < pointsLevel) {
              newLevel = gamesLevel;
            }
          }

          return resolve({ lvl: newLevel, lvlupLimit: newLvlUpLimit });
        } else {
          return reject();
        }
      } catch (error2) {
        console.log('catch');
        return reject();
      }
    } else {
      return reject();
    }
  }).catch(err => {
    return reject();
  });
}));

const fixUserLevels = () => new Promise(((resolve, reject) => {
  const { admin, leaderboardDb } = require('../admin');

//  const startAt = change.after.val() || null;

    admin.database().ref(`lastUserKey`)
    .once('value', (snapshot2) => {
      const startAt = snapshot2.val() || null;

      if (startAt) {
        admin.database().ref(`users`)
        .orderByKey()
        .startAt(startAt)
        .limitToFirst(100)
        .once('value', (snapshot) => {
          const users = snapshot.val() || null;

        //  console.log('users');
        //  console.log(users);

          let promises = [];

          if (users) {
            Object.keys(users).map((key, index) => promises.push(new Promise((resolve2) => {
              if (index > 98) {
                console.log(`Last ID = ${key}`);
                console.log(users[key]);
                admin.database().ref(`lastUserKey`).set(key);
              }

              if (users[key].lvl >= 3) {

                const { totalPnts, gPlayed, lvl, socProvider } = users[key];

                let newLevel = lvl;
                let pointsLevel = 3;
                let gamesLevel = 1;

                while (totalPnts >= 10 + ((pointsLevel - 3) * 5)) {
                  pointsLevel += 1;
                }

                let newLvlUpLimit = 20;

                // newLvlUpLimitPointsLimited is limit if level limited by points level
                let newLvlUpLimitPointsLimited = 20;
                let gamesLevel2 = 3;

                for (let i = 4; i < 100; i += 1) {
                  newLvlUpLimit *= 1.2;
                  gamesLevel2 += 1;

                  if (gamesLevel2 < pointsLevel) {
                    newLvlUpLimitPointsLimited *= 1.2;
                  }

                  if (newLvlUpLimit > gPlayed) {
                    break;
                  }
                }

                gamesLevel = gamesLevel2;

                newLevel = pointsLevel;
                if (gamesLevel < pointsLevel) {
                  newLevel = gamesLevel;
                }

                checkOldLevel(key, socProvider).then((oldLevel) => {
                  let levelToUpdate = newLevel;
                  if (oldLevel && oldLevel.lvl > newLevel) {
                    levelToUpdate = oldLevel.lvl;
                    newLvlUpLimit = oldLevel.lvlupLimit;
                  }

                  if (levelToUpdate > lvl || (lvl > levelToUpdate && gamesLevel < lvl)) {
                  //  console.log('UPDATE LVL');
                  //  console.log(key);

                  //  console.log('lvl');
                  //  console.log(lvl);

                  //  console.log('levelToUpdate');
                  //  console.log(levelToUpdate);
                  //  console.log(pointsLevel);

                  //  console.log('newLvlUpLimit');
                //    console.log(newLvlUpLimit);
                  //  console.log(newLvlUpLimitPointsLimited);

                  //  if (levelToUpdate === pointsLevel) {
                  //    console.log('UPDATE with newLvlUpLimitPointsLimited');
                  //  } else {
                  //    console.log('UPDATE with newLvlUpLimit');
                  //  }

                      admin.database().ref(`users/${key.toString()}`).update({
                        lvl: levelToUpdate,
                        lvlupLimit: levelToUpdate === pointsLevel ? Math.round(newLvlUpLimitPointsLimited) : Math.round(newLvlUpLimit),
                        lvlUpLimit: null,
                      });

                      admin.database().ref(`usersNames/${key.toString()}`).update({
                        lvl,
                      });
                  } else {
                  //  console.log('VALID lvl');
                  //  console.log(key);
                  //  console.log(lvl);

                    let newLvlUpLimit_valid = 20;
                    for (let i = 4; i <= parseInt(lvl, 10); i += 1) {
                      newLvlUpLimit_valid *= 1.2;
                    }

                  //  console.log('newLvlUpLimit_valid');
                  //  console.log(newLvlUpLimit_valid);

                    admin.database().ref(`users/${key.toString()}`).update({
                      lvlupLimit: Math.round(newLvlUpLimit_valid),
                      lvlUpLimit: null,
                    });

                      admin.database().ref(`usersNames/${key.toString()}`).update({
                        lvl,
                      });

                      admin.database(leaderboardDb).ref(`leaderboard/daily/${key.toString()}`).update({
                        lvl,
                      });
                  }
                  return resolve2();
                }).catch((error) => {
                  if (newLevel > lvl || (lvl > newLevel && gamesLevel < lvl)) {
                  //  console.log('UPDATE LVL no old lvl');
                  //  console.log(key);

                  //  console.log('lvl');
                  //  console.log(lvl);

                  //  console.log('gamesLevel');
                  //  console.log(gamesLevel);

                  //  console.log('newLevel');
                  //  console.log(newLevel);
                  //  console.log(newLvlUpLimit);



                      admin.database().ref(`users/${key.toString()}`).update({
                        lvl: newLevel,
                        lvlupLimit: newLevel === pointsLevel ? Math.round(newLvlUpLimitPointsLimited) : Math.round(newLvlUpLimit),
                        lvlUpLimit: null,
                      });

                      admin.database().ref(`usersNames/${key.toString()}`).update({
                        lvl,
                      });
                  } else {
                  //  console.log('valid lvl');
                  //  console.log(key);
                  //  console.log(lvl);

                    let newLvlUpLimit_valid = 20;
                    for (let i = 4; i <= parseInt(lvl, 10); i += 1) {
                      newLvlUpLimit_valid *= 1.2;
                    }

                  //  console.log('newLvlUpLimit_valid');
                  //  console.log(newLvlUpLimit_valid);

                    admin.database().ref(`users/${key.toString()}`).update({
                      lvlupLimit: Math.round(newLvlUpLimit_valid),
                      lvlUpLimit: null,
                    });

                      admin.database().ref(`usersNames/${key.toString()}`).update({
                        lvl,
                      });

                      admin.database(leaderboardDb).ref(`leaderboard/daily/${key.toString()}`).update({
                        lvl,
                      });
                  }

                  return resolve2();
                })
              } else {
              //  console.log('&&&&&&&&&&&&&&&&users[key]&&&&&&&&&&&&&&&&&');
              //  console.log(users[key]);

                let newLvlUpLimit_valid = 20;
                for (let i = 4; i <= parseInt(users[key].lvl, 10); i += 1) {
                  newLvlUpLimit_valid *= 1.2;
                }

              //  console.log('******newLvlUpLimit_valid******');
              //  console.log(newLvlUpLimit_valid);

                if (users[key].lvl) {
                  admin.database().ref(`usersNames/${key.toString()}`).update({
                    lvl: users[key].lvl,
                  });

                  admin.database(leaderboardDb).ref(`leaderboard/daily/${key.toString()}`).update({
                    lvl: users[key].lvl,
                  });
                } else {
                  console.log('NO user data');
                  console.log(key);
                }

                return resolve2();
              }

              return null;
            })));
          }

          Promise.all(promises).then(() => {
            console.log('promises THEN');
            return resolve();
          }).catch(err => {
            console.log('err');
            console.log(err);
            return resolve();
          })

        //  return resolve();
        });
      }
    });
}));

module.exports = fixUserLevels;
