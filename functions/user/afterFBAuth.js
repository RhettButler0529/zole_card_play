// const cors = require('cors')({ origin: true });

// const { admin } = require('../admin');


// const rp = require('request-promise');


const afterFBAuth = (async (req, res) => {
  const { admin, leaderboardDb } = require('../admin');
  const { pow } = require('mathjs');
  const cors = require('cors')({ origin: true });
  const axios = require('axios');

  return cors(req, res, async () => {
    const {
      uid, providerData, additionalUserInfo,
    } = req.body.data;

    const tokenId = req.get('Authorization').split('Bearer ')[1];

    return admin.auth().verifyIdToken(tokenId)
      .then(async (decoded) => {
        if (!decoded.uid) {
          return res.status(200).send({ data: 'Error updating user data (no auth token)' });
        }

        if (uid === decoded.uid) {
        //  console.log('uid is equal');
          return admin.database().ref(`users/${uid}`)
            .once('value', async (playerSnapshot) => {
              const playerData = playerSnapshot.val() || {};

              const { lvl, bal, synced } = playerData;

              let oldBal = 500;
              let oldLvl = 1;
              let oldGames = 0;
              let oldWins = 0;
              let oldPoints = 0;

              //  if (providerData && providerData[0] && providerData[0].providerId === 'facebook.com') {
              //    axios.get(`https://graph.facebook.com/${providerData[0].uid}/?fields=first_name,last_name`, { timeout: 1000 })
              //      .then((info2) => {
              //        console.log('info2');
              //        console.log(info2);
              //        });
              //  }

              if (additionalUserInfo) {
                const firstName = additionalUserInfo.profile.first_name;
                const lastName = additionalUserInfo.profile.last_name;

                if (firstName && lastName) {
                  admin.database().ref(`users/${uid}`).update({
                    firstName,
                    lastName,
                    name: decoded.name,
                  //  lowerCaseName: decoded.name.toLowerCase(),
                  });
                }
              }

              if (!playerData.uid && !synced && providerData && providerData[0] && providerData[0].providerId === 'facebook.com') {
                admin.database().ref(`fbUsers/${providerData[0].uid}`).update({
                  name: providerData[0].displayName,
                //  email: providerData[0].email || 'no-email@spelezoli.lv',
                });

                return axios.get(`http://legacy.spelezoli.lv/?fbid=${providerData[0].uid}`, { timeout: 5000 })
                  .then((info) => {
                    if (info) {
                      try {
                        const { data } = info;

                        const trimmedName = decoded.name.trim();
                        const punctuationless = trimmedName.replace(/[\.,-\/#!$%\^&\*;:{}=\-_`~()@\+\?><\[\]\+]/g, '');
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
                          const newLvlUpLimit = 0;

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

                              gamesLevel = gamesLevel2;

                            /*  let newLvlUpLimit2 = 20;
                              let gamesLevel2 = 1;

                              if (pointsLevel > 4) {
                                for (let i = 0; i < pointsLevel - 4; i += 1) {
                                  newLvlUpLimit2 *= 1.2;
                                  gamesLevel2 += 1;
                                  if (newLvlUpLimit2 < oldGames) {
                                    break;
                                  }
                                }
                              }

                            //  console.log('newLvlUpLimit2');
                            //  console.log(newLvlUpLimit2);

                            //  console.log('gamesLevel2');
                            //  console.log(gamesLevel2);

                            //  console.log('pointsLevel');
                            //  console.log(pointsLevel);

                              while (oldGames >= 20 * pow(1.2, gamesLevel) && gamesLevel < pointsLevel) {
                                gamesLevel += 1;
                              } */
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

                          //  console.log('newLevel');
                          //  console.log(newLevel);
                          }

                          admin.database().ref(`users/${uid}`).update({
                            uid: playerData.uid || decoded.uid,
                            socId: providerData[0].uid,
                            socProvider: 'facebook',
                            name: finalString || decoded.name,
                            lowerCaseName,
                            email: providerData[0].email || 'no-email@spelezoli.lv',
                            photo: `${decoded.picture}?type=large`,
                            lvl: lvl || newLevel || oldLvl || 1,
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
                          });

                          admin.database().ref(`fbUsers/${providerData[0].uid}`).update({
                            uid,
                            name: finalString || providerData[0].displayName,
                            lvl: lvl || newLevel || oldLvl || 1,
                            bal: parseInt(bal, 10) || oldBal || 500,
                            gPlayed: playerData.gPlayed || oldGames || 0,
                            totalPnts: playerData.totalPnts || oldPoints || 0,
                            gWon: playerData.gWon || oldWins || 0,
                          });

                        /*  admin.database().ref(`leaderboard/allTime/${uid}`).update({
                            name: finalString || playerData.name || decoded.name,
                            bal: parseInt(bal, 10) || oldBal || 500,
                            gPlayed: playerData.gPlayed || oldGames || 0,
                            totalPnts: playerData.totalPnts || oldPoints || 0,
                            lvl: lvl || newLevel || oldLvl || 1,
                          });

                          admin.database().ref(`leaderboard/daily/${uid}`).update({
                            name: finalString || playerData.name || decoded.name,
                            lvl: lvl || newLevel || oldLvl || 1,
                          });

                          admin.database().ref(`leaderboard/week/${uid}`).update({
                            name: finalString || playerData.name || decoded.name,
                            lvl: lvl || newLevel || oldLvl || 1,
                          });

                          admin.database().ref(`leaderboard/month/${uid}`).update({
                            name: finalString || playerData.name || decoded.name,
                            lvl: lvl || newLevel || oldLvl || 1,
                          });

                          admin.database().ref(`leaderboard/year/${uid}`).update({
                            name: finalString || playerData.name || decoded.name,
                            lvl: lvl || newLevel || oldLvl || 1,
                          });

                          admin.database().ref(`leaderboardPoints/${uid}`).update({
                            gPl: playerData.gPlayed || oldGames || 0,
                            tP: playerData.totalPnts || oldPoints || 0,
                            bal: parseInt(bal, 10) || oldBal || 500,
                          }); */

                          admin.database(leaderboardDb).ref(`leaderboard/allTime/${uid}`).update({
                            name: finalString || playerData.name || decoded.name,
                            bal: parseInt(bal, 10) || oldBal || 500,
                            gPlayed: playerData.gPlayed || oldGames || 0,
                            totalPnts: playerData.totalPnts || oldPoints || 0,
                            lvl: lvl || newLevel || oldLvl || 1,
                          });

                          admin.database(leaderboardDb).ref(`leaderboard/daily/${uid}`).update({
                            name: finalString || playerData.name || decoded.name,
                            lvl: lvl || newLevel || oldLvl || 1,
                          });

                          admin.database(leaderboardDb).ref(`leaderboard/week/${uid}`).update({
                            name: finalString || playerData.name || decoded.name,
                            lvl: lvl || newLevel || oldLvl || 1,
                          });

                          admin.database(leaderboardDb).ref(`leaderboard/month/${uid}`).update({
                            name: finalString || playerData.name || decoded.name,
                            lvl: lvl || newLevel || oldLvl || 1,
                          });

                          admin.database(leaderboardDb).ref(`leaderboard/year/${uid}`).update({
                            name: finalString || playerData.name || decoded.name,
                            lvl: lvl || newLevel || oldLvl || 1,
                          });

                          admin.database(leaderboardDb).ref(`leaderboardPoints/${uid}`).update({
                            gPl: playerData.gPlayed || oldGames || 0,
                            tP: playerData.totalPnts || oldPoints || 0,
                            bal: parseInt(bal, 10) || oldBal || 500,
                          });

                          admin.database().ref(`usersNames/${uid}`).set({
                            name: finalString || playerData.name || decoded.name,
                            lvl: lvl || newLevel || oldLvl || 1,
                            dateCreated: admin.database.ServerValue.TIMESTAMP,
                          });

                          return res.status(200).send({
                            data: {
                              uid: playerData.uid || decoded.uid,
                              socId: providerData[0].uid,
                              socProvider: 'facebook',
                              name: finalString || decoded.name,
                              lowerCaseName,
                              email: providerData[0].email || 'no-email@spelezoli.lv',
                              photo: `${decoded.picture}?type=large`,
                              lvl: lvl || oldLvl || 1,
                              bal: parseInt(bal, 10) || oldBal || 500,
                              gPlayed: playerData.gPlayed || oldGames || 0,
                              totalPnts: playerData.totalPnts || oldPoints || 0,
                              gWon: playerData.gWon || oldWins || 0,
                              role: playerData.role || 'player',
                              lastLogin: Date.now(),
                              userIndex: '',
                              dateCreated: admin.database.ServerValue.TIMESTAMP,
                              tutorialShown: true,
                            },
                          });
                        }
                        //  console.log('no res data from axios');
                        admin.database().ref(`users/${uid}`).update({
                          uid: playerData.uid || decoded.uid,
                          socId: providerData[0].uid,
                          socProvider: 'facebook',
                          name: finalString || decoded.name,
                          lowerCaseName,
                          email: providerData[0].email || 'no-email@spelezoli.lv',
                          photo: `${decoded.picture}?type=large`,
                          lvl: lvl || 1,
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

                        admin.database().ref(`fbUsers/${providerData[0].uid}`).update({
                          uid,
                          name: finalString || providerData[0].displayName,
                          lvl: lvl || 1,
                          bal: parseInt(bal, 10) || 500,
                          gPlayed: playerData.gPlayed || 0,
                          totalPnts: playerData.totalPnts || 0,
                          gWon: playerData.gWon || 0,
                        });

                      /*  admin.database().ref(`leaderboard/allTime/${uid}`).update({
                          name: finalString || playerData.name || decoded.name,
                          bal: parseInt(bal, 10) || 500,
                          gPlayed: playerData.gPlayed || 0,
                          totalPnts: playerData.totalPnts || 0,
                          lvl: lvl || 1,
                        });

                        admin.database().ref(`leaderboard/daily/${uid}`).update({
                          name: finalString || playerData.name || decoded.name,
                          lvl: lvl || 1,
                        });

                        admin.database().ref(`leaderboard/week/${uid}`).update({
                          name: finalString || playerData.name || decoded.name,
                          lvl: lvl || 1,
                        });

                        admin.database().ref(`leaderboard/month/${uid}`).update({
                          name: finalString || playerData.name || decoded.name,
                          lvl: lvl || 1,
                        });

                        admin.database().ref(`leaderboard/year/${uid}`).update({
                          name: finalString || playerData.name || decoded.name,
                          lvl: lvl || 1,
                        }); */


                        admin.database(leaderboardDb).ref(`leaderboard/allTime/${uid}`).update({
                          name: finalString || playerData.name || decoded.name,
                          bal: parseInt(bal, 10) || 500,
                          gPlayed: playerData.gPlayed || 0,
                          totalPnts: playerData.totalPnts || 0,
                          lvl: lvl || 1,
                        });

                        admin.database(leaderboardDb).ref(`leaderboard/daily/${uid}`).update({
                          name: finalString || playerData.name || decoded.name,
                          lvl: lvl || 1,
                        });

                        admin.database(leaderboardDb).ref(`leaderboard/week/${uid}`).update({
                          name: finalString || playerData.name || decoded.name,
                          lvl: lvl || 1,
                        });

                        admin.database(leaderboardDb).ref(`leaderboard/month/${uid}`).update({
                          name: finalString || playerData.name || decoded.name,
                          lvl: lvl || 1,
                        });

                        admin.database(leaderboardDb).ref(`leaderboard/year/${uid}`).update({
                          name: finalString || playerData.name || decoded.name,
                          lvl: lvl || 1,
                        });

                        admin.database().ref(`usersNames/${uid}`).set({
                          name: finalString || playerData.name || decoded.name,
                          lvl: lvl || newLevel || oldLvl || 1,
                          dateCreated: admin.database.ServerValue.TIMESTAMP,
                        });

                        return res.status(200).send({
                          data: {
                            uid: playerData.uid || decoded.uid,
                            socId: providerData[0].uid,
                            socProvider: 'facebook',
                            name: finalString || decoded.name,
                            lowerCaseName,
                            email: providerData[0].email || 'no-email@spelezoli.lv',
                            photo: `${decoded.picture}?type=large`,
                            lvl: lvl || 1,
                            bal: parseInt(bal, 10) || 500,
                            gPlayed: playerData.gPlayed || 0,
                            totalPnts: playerData.totalPnts || 0,
                            gWon: playerData.gWon || 0,
                            role: playerData.role || 'player',
                            lastLogin: Date.now(),
                            dateCreated: admin.database.ServerValue.TIMESTAMP,
                            tutorialShown: true,
                          },
                        });
                      } catch (error2) {
                      //  console.log('info2 error');
                        console.log(error2);
                        //      return res.status(200).send({ data: 'Error updating user data' });
                      }
                    } else {
                      /*  admin.database().ref(`users/${uid}`).update({
                      uid: playerData.uid || decoded.uid,
                      socId: providerData[0].uid,
                      socProvider: 'facebook',
                      name: decoded.name,
                      email: providerData[0].email || 'no-email@spelezoli.lv',
                      photo: `${decoded.picture}?type=large`,
                      lvl: lvl || 1,
                      bal: parseInt(bal, 10) || 500,
                      gPlayed: playerData.gPlayed || 0,
                      totalPnts: playerData.totalPnts || 0,
                      gWon: playerData.gWon || 0,
                      role: playerData.role || 'player',
                      lastLogin: Date.now(),
                      synced: true,
                    });

                    admin.database().ref(`leaderboard/${uid}`).update({
                      name: playerData.name || decoded.name,
                      bal: parseInt(bal, 10) || 500,
                      gPlayed: playerData.gPlayed || 0,
                      totalPnts: playerData.totalPnts || 0,
                      lvl: lvl || 1,
                    });

                    return res.status(200).send({
                      data: {
                        uid: playerData.uid || decoded.uid,
                        socId: providerData[0].uid,
                        socProvider: 'facebook',
                        name: decoded.name,
                        email: providerData[0].email || 'no-email@spelezoli.lv',
                        photo: `${decoded.picture}?type=large`,
                        lvl: lvl || 1,
                        bal: parseInt(bal, 10) || 500,
                        gPlayed: playerData.gPlayed || 0,
                        totalPnts: playerData.totalPnts || 0,
                        gWon: playerData.gWon || 0,
                        role: playerData.role || 'player',
                        lastLogin: Date.now(),
                      },
                    }); */

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
              //  console.log('else');

            //  console.log('decoded');
            //  console.log(decoded);
            //  console.log(playerData);

                const trimmedName = decoded.name.trim();
              const punctuationless = trimmedName.replace(/[\.,-\/#!$%\^&\*;:{}=\-_`~()@\+\?><\[\]\+]/g, '');
              const finalString = punctuationless.replace(/\s{2,}/g, ' ');

              const lowerCaseName = finalString.toLowerCase();

              admin.database().ref(`users/${uid.toString()}`).update({
                name: finalString || decoded.name || playerData.name,
                lowerCaseName: lowerCaseName || decoded.name.toLowerCase(),
                email: providerData[0].email || 'no-email@spelezoli.lv',
                photo: `${decoded.picture}?type=large`,
                lastLogin: Date.now(),
              });

              //  admin.database().ref(`fbUsers/${uid.toString()}`).update({
              //    name: finalString || name || playerData.name,
              //  });

              admin.database(leaderboardDb).ref(`leaderboard/allTime/${uid.toString()}`).update({
                name: finalString || decoded.name || playerData.name,
              });

              admin.database(leaderboardDb).ref(`leaderboard/daily/${uid.toString()}`).update({
                name: finalString || decoded.name || playerData.name,
              });

              admin.database(leaderboardDb).ref(`leaderboard/week/${uid.toString()}`).update({
                name: finalString || decoded.name || playerData.name,
              });

              admin.database(leaderboardDb).ref(`leaderboard/month/${uid.toString()}`).update({
                name: finalString || decoded.name || playerData.name,
              });

              admin.database(leaderboardDb).ref(`leaderboard/year/${uid.toString()}`).update({
                name: finalString || decoded.name || playerData.name,
              });

              admin.database().ref(`usersNames/${uid.toString()}`).set({
                name: finalString || decoded.name || playerData.name,
              });

              return res.status(200).send({
                data: {
                  uid: playerData.uid || decoded.uid,
                  socId: providerData[0].uid,
                  socProvider: 'facebook',
                  name: decoded.name,
                  firstName: additionalUserInfo && additionalUserInfo.profile && additionalUserInfo.profile.first_name ? (additionalUserInfo.profile.first_name) : '',
                  lastName: additionalUserInfo && additionalUserInfo.profile && additionalUserInfo.profile.last_name ? (additionalUserInfo.profile.last_name) : '',
                  lowerFName: additionalUserInfo && additionalUserInfo.profile && additionalUserInfo.profile.first_name ? (additionalUserInfo.profile.first_name.toLowerCase()) : '',
                  lowerLName: additionalUserInfo && additionalUserInfo.profile && additionalUserInfo.profile.last_name ? (additionalUserInfo.profile.last_name.toLowerCase()) : '',
                  email: providerData[0].email || 'no-email@spelezoli.lv',
                  photo: `${decoded.picture}?type=large`,
                  lvl: lvl || 1,
                  bal: parseInt(bal, 10) || 500,
                  gPlayed: playerData.gPlayed || 0,
                  totalPnts: playerData.totalPnts || 0,
                  gWon: playerData.gWon || 0,
                  role: playerData.role || 'player',
                  lastLogin: Date.now(),
                },
              });
            }).catch(() => res.status(200).send({ data: 'Error updating user data' }));
        }
        return res.status(200).send({ data: 'Error updating user data' });
      })
      .catch(() => res.status(200).send({ data: 'Error updating user data' }));
  });
});

module.exports = afterFBAuth;
