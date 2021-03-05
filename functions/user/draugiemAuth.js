const appKey = '61ee303f304374a30309696a27719224';

const devAppKey = '036d5df434cf94205e2dc8cd4c9f27d4';

const draugiemAuth = (req, res) => {
  const cors = require('cors')({ origin: true });
  const axios = require('axios');
  const { admin, leaderboardDb } = require('../admin');
  //  const { pow } = require('mathjs');

  cors(req, res, () => {
    const {
      authCode,
      devMode,
    } = req.body.data;

  //  console.log('devMode');
  //  console.log(devMode);

    let url;
    if (devMode) {
      url = `https://api.draugiem.lv/json/?app=${devAppKey}&code=${authCode}&action=authorize`;
    } else {
      url = `https://api.draugiem.lv/json/?app=${appKey}&code=${authCode}&action=authorize`;
    }

  //  const url = `https://api.draugiem.lv/json/?app=${appKey}&code=${authCode}&action=authorize`;

    axios.get(url)
      .then((res2) => {
        const { uid, users, apikey } = res2.data;

        if (apikey && uid && uid.toString()) {
          admin.auth().createCustomToken(uid.toString())
            .then((customToken) => {
              // Send token back to client

              admin.database().ref('drApiToUid').update({
                [uid]: apikey,
              });

              let oldBal = 500;
              let oldLvl = 1;
              let oldGames = 0;
              let oldWins = 0;
              let oldPoints = 0;

              admin.database().ref(`users/${uid}`)
                .once('value', (userSnapshot) => {
                  const playerData = userSnapshot.val() || {};

                  const {
                    lvl, bal, synced, lvlUpLimit,
                  } = playerData;

                  const name = `${users[uid].name} ${users[uid].surname}`;

                  if (!playerData.uid && !synced) {
                    return axios.get(`http://legacy.spelezoli.lv/?drid=${uid.toString()}`, { timeout: 5000 })
                      .then((info) => {
                        if (info) {
                          try {
                            const { data } = info;
                          //  const trimmedName = name.trim();
                            const punctuationless = name.trim().replace(/[\.,-\/#!$%\^&\*;:{}=\-_`~()@\+\?><\[\]\+]/g, '');
                            const finalString = punctuationless.replace(/\s{2,}/g, ' ');

                            const lowerCaseName = finalString.toLowerCase();

                            if (data) {
                              if (data.vmoney) {
                                if (data.vmoney > 500) {
                                  oldBal = Math.ceil(parseInt(data.vmoney, 10));
                                } else {
                                  oldBal = 500;
                                }
                              }
                              if (data.level || data.level === 0) {
                                oldLvl = parseInt(data.level, 10) + 1;
                              }
                              if (data.played_games) {
                                oldGames = parseInt(data.played_games, 10);
                              }
                              if (data.wins) {
                                oldWins = parseInt(data.wins, 10);
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
                              //  } else if (oldGames < 24) {
                              //    gamesLevel = 4;
                              //    newLvlUpLimit = 24;
                                } else {
                                  newLvlUpLimit = 20;
                                  let gamesLevel2 = 3;

                                  if (pointsLevel > 4) {
                                    for (let i = 4; i < 100; i += 1) {
                                      newLvlUpLimit *= 1.2;
                                      gamesLevel2 += 1;

                                      if (newLvlUpLimit > oldGames || gamesLevel2 >= pointsLevel) {
                                        break;
                                      }
                                    }
                                  }

                                //  console.log('newLvlUpLimit');
                                //  console.log(Math.round(newLvlUpLimit));

                                //  console.log('gamesLevel2');
                                //  console.log(gamesLevel2);

                                //  console.log('pointsLevel');
                                //  console.log(pointsLevel);

                                  gamesLevel = gamesLevel2;

                                  //  while (oldGames >= 20 * pow(1.2, gamesLevel) && gamesLevel < pointsLevel) {
                                  //    gamesLevel += 1;
                                  //  }

                                //  console.log('gamesLevel');
                                //  console.log(gamesLevel);
                                }

                              //  console.log('pointsLevel');
                              //  console.log(pointsLevel);
                              //  console.log(gamesLevel);
                              //  console.log('oldGames');
                              //  console.log(oldGames);
                              //  console.log(oldPoints);

                                newLevel = pointsLevel;
                                if (gamesLevel < pointsLevel) {
                                  newLevel = gamesLevel;
                                }

                              }

                            /*  admin.database().ref(`draugiemAuthTest/${uid.toString()}`).update({
                                uid: uid.toString(),
                                socId: uid.toString(),
                                socProvider: 'draugiem',
                                name: finalString || name,
                                photo: users[uid].img,
                                lowerCaseName: lowerCaseName || name.toLowerCase(),
                                email: users[uid].email || 'no-email@spelezoli.lv',
                                lvl: lvl || newLevel || oldLvl || 1,
                                lvlUpLimit: newLvlUpLimit ? Math.round(newLvlUpLimit) : lvlUpLimit,
                                bal: parseInt(bal, 10) || oldBal || 500,
                                gPlayed: playerData.gPlayed || oldGames || 0,
                                totalPnts: playerData.totalPnts || oldPoints || 0,
                                gWon: playerData.gWon || oldWins || 0,
                                role: playerData.role || 'player',
                                lastLogin: Date.now(),
                                synced: true,
                                userIndex: '',
                                dateCreated: admin.database.ServerValue.TIMESTAMP,
                                tutorialShown: true,
                              }); */

                              admin.database().ref(`users/${uid.toString()}`).update({
                                uid: uid.toString(),
                                socId: uid.toString(),
                                socProvider: 'draugiem',
                                name: finalString || name,
                                photo: users[uid].img,
                                lowerCaseName: lowerCaseName || name.toLowerCase(),
                                email: users[uid].email || 'no-email@spelezoli.lv',
                                lvl: lvl || newLevel || oldLvl || 1,
                                lvlUpLimit: newLvlUpLimit ? Math.round(newLvlUpLimit) : lvlUpLimit,
                                bal: bal ? (parseInt(bal, 10)) :(oldBal || 500),
                                gPlayed: playerData.gPlayed || oldGames || 0,
                                totalPnts: playerData.totalPnts || oldPoints || 0,
                                gWon: playerData.gWon || oldWins || 0,
                                role: playerData.role || 'player',
                                lastLogin: Date.now(),
                                synced: true,
                                userIndex: '',
                                dateCreated: admin.database.ServerValue.TIMESTAMP,
                                tutorialShown: true,
                              });

                              admin.database().ref(`draugiemUsers/${uid.toString()}`).update({
                                uid: uid.toString(),
                                name: finalString || name,
                                lvl: lvl || newLevel || oldLvl || 1,
                                bal: parseInt(bal, 10) || oldBal || 500,
                                gPlayed: playerData.gPlayed || oldGames || 0,
                                totalPnts: playerData.totalPnts || oldPoints || 0,
                                gWon: playerData.gWon || oldWins || 0,
                              });

                              admin.database(leaderboardDb).ref(`leaderboard/allTime/${uid.toString()}`).update({
                                name: finalString || name || playerData.name,
                                bal: parseInt(bal, 10) || oldBal || 500,
                                gPlayed: playerData.gPlayed || oldGames || 0,
                                totalPnts: playerData.totalPnts || oldPoints || 0,
                                lvl: lvl || newLevel || oldLvl || 1,
                              });

                              admin.database(leaderboardDb).ref(`leaderboard/daily/${uid.toString()}`).update({
                                name: finalString || name || playerData.name,
                                lvl: lvl || newLevel || oldLvl || 1,
                              });

                              admin.database(leaderboardDb).ref(`leaderboard/week/${uid.toString()}`).update({
                                name: finalString || name || playerData.name,
                                lvl: lvl || newLevel || oldLvl || 1,
                              });

                              admin.database(leaderboardDb).ref(`leaderboard/month/${uid.toString()}`).update({
                                name: finalString || name || playerData.name,
                                lvl: lvl || newLevel || oldLvl || 1,
                              });

                              admin.database(leaderboardDb).ref(`leaderboard/year/${uid.toString()}`).update({
                                name: finalString || name || playerData.name,
                                lvl: lvl || newLevel || oldLvl || 1,
                              });

                              admin.database(leaderboardDb).ref(`leaderboardPoints/${uid.toString()}`).update({
                                gPl: playerData.gPlayed || oldGames || 0,
                                tP: playerData.totalPnts || oldPoints || 0,
                                bal: parseInt(bal, 10) || oldBal || 500,
                              });



                              admin.database().ref(`usersNames/${uid.toString()}`).set({
                                name: finalString || name || playerData.name,
                                lvl: lvl || newLevel || oldLvl || 1,
                                dateCreated: admin.database.ServerValue.TIMESTAMP,
                              });

                              return res.status(200).send({ data: { status: 'success', token: customToken } });
                            }
                            // No res data from axios

                            admin.database().ref(`users/${uid.toString()}`).update({
                              uid: uid.toString(),
                              socId: uid.toString(),
                              socProvider: 'draugiem',
                              name: finalString || name || playerData.name,
                              lowerCaseName: lowerCaseName || name.toLowerCase(),
                              email: users[uid].email || 'no-email@spelezoli.lv',
                              photo: users[uid].img,
                              lvl: lvl || 1,
                              lvlUpLimit: lvlUpLimit || 0,
                              bal: parseInt(bal, 10) || 500,
                              gPlayed: playerData.gPlayed || 0,
                              totalPnts: playerData.totalPnts || 0,
                              gWon: playerData.gWon || 0,
                              role: playerData.role || 'player',
                              lastLogin: Date.now(),
                              synced: true,
                              userIndex: '',
                              dateCreated: admin.database.ServerValue.TIMESTAMP,
                              tutorialShown: true,
                            });

                            admin.database(leaderboardDb).ref(`leaderboard/allTime/${uid.toString()}`).update({
                              name: finalString || name || playerData.name,
                              bal: parseInt(bal, 10) || 500,
                              gPlayed: playerData.gPlayed || 0,
                              totalPnts: playerData.totalPnts || 0,
                              lvl: lvl || 1,
                            });

                            admin.database(leaderboardDb).ref(`leaderboard/daily/${uid.toString()}`).update({
                              name: finalString || name || playerData.name,
                              lvl: lvl || 1,
                            });

                            admin.database(leaderboardDb).ref(`leaderboard/week/${uid.toString()}`).update({
                              name: finalString || name || playerData.name,
                              lvl: lvl || 1,
                            });

                            admin.database(leaderboardDb).ref(`leaderboard/month/${uid.toString()}`).update({
                              name: finalString || name || playerData.name,
                              lvl: lvl || 1,
                            });

                            admin.database(leaderboardDb).ref(`leaderboard/year/${uid.toString()}`).update({
                              name: finalString || name || playerData.name,
                              lvl: lvl || 1,
                            });

                            admin.database().ref(`usersNames/${uid.toString()}`).set({
                              name: finalString || name || playerData.name,
                              lvl: lvl || newLevel || oldLvl || 1,
                              dateCreated: admin.database.ServerValue.TIMESTAMP,
                            });

                            return res.status(200).send({ data: { status: 'success', token: customToken } });
                          } catch (error2) {
                          //  console.log('info2 error');
                          //  console.log(error2);
                          }
                        } else {
                          return res.status(500).json('failed to set data');
                        }
                      }).catch((err) => {
                      //  console.log('err');
                        console.log(err);
                        return res.status(500).json({
                          error: err,
                        });
                      });
                  }

                //  const trimmedName = name.trim();
                  const punctuationless = name.trim().replace(/[\.,-\/#!$%\^&\*;:{}=\-_`~()@\+\?><\[\]\+]/g, '');
                  const finalString = punctuationless.replace(/\s{2,}/g, ' ');

                  const lowerCaseName = finalString.toLowerCase();

                  admin.database().ref(`users/${uid.toString()}`).update({
                    uid: uid.toString() || playerData.uid.toString(),
                    name: finalString || name || playerData.name,
                    lowerCaseName: lowerCaseName || name.toLowerCase(),
                    email: users[uid.toString()].email || 'no-email@spelezoli.lv',
                    photo: users[uid.toString()].img,
                    lastLogin: Date.now(),
                    activeRoom: null,
                  });

                  admin.database(leaderboardDb).ref(`leaderboard/allTime/${uid.toString()}`).update({
                    name: finalString || name || playerData.name,
                    lvl: playerData.lvl,
                  });

                  admin.database(leaderboardDb).ref(`leaderboard/daily/${uid.toString()}`).update({
                    name: finalString || name || playerData.name,
                    lvl: playerData.lvl,
                  });

                  admin.database(leaderboardDb).ref(`leaderboard/week/${uid.toString()}`).update({
                    name: finalString || name || playerData.name,
                    lvl: playerData.lvl,
                  });

                  admin.database(leaderboardDb).ref(`leaderboard/month/${uid.toString()}`).update({
                    name: finalString || name || playerData.name,
                    lvl: playerData.lvl,
                  });

                  admin.database(leaderboardDb).ref(`leaderboard/year/${uid.toString()}`).update({
                    name: finalString || name || playerData.name,
                    lvl: playerData.lvl,
                  });

                  admin.database().ref(`usersNames/${uid.toString()}`).update({
                    name: finalString || name || playerData.name,
                    lvl: playerData.lvl,
                  });

                  return res.status(200).send({ data: { status: 'success', token: customToken } });


                //  return res.status(200).send({ data: { status: 'success', token: customToken } });
                });
            })
            .catch((error) => {
              res.status(200).send({ data: { status: 'error', message: 'error' } });
            });
        } else {
          res.status(200).send({ data: { status: 'error', message: 'no uid or cannot be turned into string' } });
        }
      }).catch(err => {
        console.log('err');
        console.log(err);

        res.status(200).send({ data: { status: 'error', message: 'error' } });
      });
  });
};

module.exports = draugiemAuth;
