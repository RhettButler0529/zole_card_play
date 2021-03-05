// const { admin } = require('../admin');

const onPlayerJoinsTournamentPlay = (change, context) => new Promise(((resolve, reject) => {
  const { admin } = require('../admin');
  const afterData = change.after.val() || {};
  const beforeData = change.before.val() || {};

  //  console.log('onPlayerJoinsTournamentPlay');

  const { params } = context;
  const { tournamentId } = params;

  //  console.log(tournamentId);

  const afterLength = Object.keys(afterData).length;
  const beforeLength = Object.keys(beforeData).length;

  //  console.log(afterLength);
  //  console.log(beforeLength);

  if (afterData && afterLength > beforeLength) {
    admin.database().ref(`tournaments/${tournamentId}`)
      .once('value', (tournamentSnapshot) => {
        const tournament = tournamentSnapshot.val() || {};

        //  console.log(tournament);

        if (tournament && tournament.running) {
        //  console.log('running');
          const waitingPlayers = [];
          Object.keys(afterData).map((key2) => {
            waitingPlayers.push({
              uid: key2,
              name: afterData[key2].name,
              shortName: afterData[key2].shortName,
              photo: afterData[key2].photo,
              lvl: afterData[key2].lvl,
              bal: parseInt(afterData[key2].bal, 10),
            });
            return null;
          });

          //  console.log('waitingPlayers');
          //  console.log(waitingPlayers);

          //  console.log(tournament.isSettingRooms);
          //  console.log(waitingPlayers.length);
          //  console.log(parseInt(tournament.minPlayers, 10));
          //  console.log(tournament.hadBlocks);

          if (!tournament.isSettingRooms && (waitingPlayers.length === parseInt(tournament.minPlayers, 10)
          || (waitingPlayers.length > parseInt(tournament.minPlayers, 10) && tournament.hadBlocks))) {
            admin.database().ref(`tournaments/${tournamentId}`).update({
              isSettingRooms: true,
              hadBlocks: false,
            }).then(() => {
              console.log('then');
              const promises = [];

              waitingPlayers.map((player) => {
                const { uid } = player;

                //  console.log(uid);

                waitingPlayers.map((player2) => {
                  if (player2 !== uid) {
                  //  console.log('player2');
                  //  console.log(player2);
                    promises.push(admin.database().ref(`ignoredPlayers/${uid}/${player2.uid}`).once('value'));
                  }
                  return null;
                });
                return null;
              });

              waitingPlayers.sort(() => 0.5 - Math.random());

              //  console.log('promises');
              //  console.log(promises);

              Promise.all(promises).then((promisesRes) => {
              //  console.log('promisesRes');
              //  console.log(promisesRes);

                const bans = {};

                promisesRes.map((promise) => {
                  const val = promise.val() || null;
                  if (val) {
                    const { key } = promise;

                    if (promise.ref && promise.ref.parent && promise.ref.parent.key) {
                      const parentKey = promise.ref.parent.key;
                      if (bans[parentKey]) {
                        bans[parentKey][key] = true;
                      } else {
                        bans[parentKey] = {};
                        bans[parentKey][key] = true;
                      }
                      if (bans[key]) {
                        bans[key][parentKey] = true;
                      } else {
                        bans[key] = {};
                        bans[key][parentKey] = true;
                      }
                    }
                  }
                  return null;
                });

                //    console.log('bans');
                //  console.log(bans);

                const splitInRooms = players => new Promise((resolve2) => {
                //  console.log('**********************  splitInRooms   ********************************');
                //  console.log(players);

                  let roomId = null;
                  let position = 'player1';

                  //  players.sort(() => 0.5 - Math.random())
                  players.map((player) => {
                    //    console.log(players);
                    if (!roomId) {
                      //    console.log('has NO room ID');

                      const newPostKey = admin.database().ref('rooms').push({
                        players: {
                          player1: {
                            ...player,
                          },
                        },
                        playersList: {
                          player1: {
                            ...player,
                          },
                          playerList: {
                            [player.uid]: 'player1',
                          },
                        },
                        tournamentId,
                        globalParams: {
                          tournamentRoom: true,
                          tournamentId,
                          talking: player.uid,
                          gameType: tournament.gameType,
                          fastGame: !!tournament.atra,
                          proGame: !!tournament.pro,
                          smallGame: !!tournament.smallGame,
                          bet: tournament.bet,
                          gameState: 'choose',
                          party: 1,
                          roomClosed: false,
                        },
                        curRnd: {
                          type: null,
                          largePlayer: null,
                          firstToGo: 'player1',
                          currentTurn: 'player1',
                          beatCardPoints: {
                            player1: 0,
                            player2: 0,
                            player3: 0,
                            tricks: {
                              player1: 0,
                              player2: 0,
                              player3: 0,
                            },
                          },
                          cardsOnTable: {
                            card1: null,
                            card2: null,
                          },
                        },
                        roomClosed: false,
                      }).key;

                      //  console.log('newPostKey');
                      //  console.log(newPostKey);

                      roomId = newPostKey;
                      position = 'player2';

                      admin.database().ref(`adminLogs/roomIds/${roomId}`).update({
                        tournamentId,
                        date: Date.now(),
                        bet: tournament.bet,
                        index: '',
                      });

                      admin.database().ref(`rooms/${newPostKey}/globalParams`).update({
                        roomId: newPostKey,
                      });

                      //  bans[player.uid] = null;

                      admin.database().ref(`tourPlayerData/${player.uid}/${tournamentId}`).update({
                        roomId: newPostKey,
                        status: false,
                      });

                      admin.database().ref(`tourPlayers/${tournamentId}/${player.uid}`).update({
                        roomId: newPostKey,
                        //  status: false,
                      });

                      admin.database().ref(`tourPlWaitList/${tournamentId}/${player.uid}`).remove();

                      admin.database().ref(`users/${player.uid}/joinedRooms/${newPostKey}`).set({
                        status: 'joined',
                        position: 'player1',
                        tournamentRoom: true,
                      });
                    } else {
                    //  console.log('has room ID');
                    //  console.log(roomId);

                      //  console.log('position');
                      //  console.log(position);

                      admin.database().ref(`rooms/${roomId}/players/${position}`).update({
                        ...player,
                      });
                      admin.database().ref(`rooms/${roomId}/playersList/${position}`).update({
                        ...player,
                      });
                      admin.database().ref(`rooms/${roomId}/playersList/playerList`).update({
                        [player.uid]: position,
                      });

                      admin.database().ref(`gameSettings/${tournament.atra ? 'fastSpeed' : 'normalSpeed'}`)
                        .once('value').then((speedSnapshot) => {
                          const speed = speedSnapshot.val() || 15;

                          admin.database().ref(`rooms/${roomId}`).update({
                            nextTimestamp: (Date.now() + 1000 * speed) + 500,
                          });
                        });
                      //  });

                      //  waitingPlayers.splice(index, 1);

                      //  bans[player.uid] = null;

                      admin.database().ref(`tourPlayerData/${player.uid}/${tournamentId}`).update({
                        roomId,
                        status: false,
                      });

                      admin.database().ref(`tourPlayers/${tournamentId}/${player.uid}`).update({
                        roomId,
                      //  status: false,
                      });

                      admin.database().ref(`tourPlWaitList/${tournamentId}/${player.uid}`).remove();

                      admin.database().ref(`users/${player.uid}/joinedRooms/${roomId}`).set({
                        status: 'joined',
                        position,
                        tournamentRoom: true,
                      });
                      //  if (Object.keys(players).length === 2) {
                      //    roomId = null;
                      //  }

                      if (position === 'player2') {
                        position = 'player3';
                      } else if (position === 'player3') {
                        position = 'player1';
                        roomId = null;
                      }

                      //    });
                    }
                  });

                  //  console.log('after mapping all players');

                  //  console.log('waitingPlayers');
                  //  console.log(waitingPlayers);
                  return resolve2('finished');
                });

                const checkBans = (combination) => {
                  //    console.log('**********************  checkBans   ********************************');

                  //  console.log('waitingPlayers');
                  //  console.log(waitingPlayers);

                  //  console.log(bans);

                  //  console.log('combination checkBans');
                  //  console.log(combination);

                  const player1 = combination[0];
                  const player2 = combination[1];
                  const player3 = combination[2];

                  if (waitingPlayers[player1] && waitingPlayers[player2] && waitingPlayers[player3]) {
                    const player1Bans = bans[waitingPlayers[player1].uid] || {};
                    const player2Bans = bans[waitingPlayers[player2].uid] || {};
                    const player3Bans = bans[waitingPlayers[player3].uid] || {};

                    //  console.log(waitingPlayers[player1].uid);
                    //  console.log(waitingPlayers[player2].uid);
                    //  console.log(waitingPlayers[player3].uid);

                    //  console.log(player1Bans);
                    //  console.log(player2Bans);
                    //  console.log(player3Bans);

                    if (player1Bans[waitingPlayers[player2].uid]) {
                    //  console.log('player1 banned player2');
                      return ({ banner: player1, banned: player2 });
                    }
                    if (player1Bans[waitingPlayers[player3].uid]) {
                    //  console.log('player1 banned player3');
                      return ({ banner: player1, banned: player3 });
                    }
                    if (player2Bans[waitingPlayers[player1].uid]) {
                    //  console.log('player2 banned player1');
                      return ({ banner: player2, banned: player1 });
                    }
                    if (player2Bans[waitingPlayers[player3].uid]) {
                    //  console.log('player2 banned player3');
                      return ({ banner: player2, banned: player3 });
                    }
                    if (player3Bans[waitingPlayers[player1].uid]) {
                    //  console.log('player3 banned player1');
                      return ({ banner: player3, banned: player1 });
                    }
                    if (player3Bans[waitingPlayers[player2].uid]) {
                    //  console.log('player3 banned player2');
                      return ({ banner: player3, banned: player2 });
                    }
                    if (Object.keys(player1Bans).length > 0 || Object.keys(player2Bans).length > 0
                      || Object.keys(player3Bans).length > 0) {
                      return null;
                    }
                    return 'no bans';
                  }
                  return 'no data';
                };

                let validPlayers = [];
                let reservePlayers = [];
                const getThreeValidPlayer = () => {
                //  console.log('**********************  getThreeValidPlayer   ********************************');
                  //  const player1 = 0;
                  //  const player2 = 1;
                  //  const player3 = 2;

                  validPlayers = [];
                  reservePlayers = [];

                  const playersLength = waitingPlayers.length;

                  //  console.log(playersLength);

                  return new Promise((resolve2) => {
                    const ignore = new Array(playersLength - 3);
                    const combination = new Array(3);

                    // set initial ignored elements
                    // (last k elements will be ignored)
                    for (let w = 0; w < ignore.length; w += 1) {
                      ignore[w] = playersLength - 3 + (w + 1);
                    }

                    let i = 0;
                    let r = 0;
                    let g = 0;

                    let terminate = false;
                    let failCount = 0;

                    //  console.log('waitingPlayers');
                    //  console.log(waitingPlayers);

                    while (!terminate && failCount < playersLength) {
                    // selecting N-k non-ignored elements
                      while (i < playersLength && r < 3) {
                        if (i !== ignore[g]) {
                          combination[r] = i;
                          r += 1;
                          i += 1;
                        } else {
                          if (g !== ignore.length - 1) { g += 1; }
                          i += 1;
                        }
                      }

                      //    console.log('combination');
                      //  console.log(combination);

                      i = 0;
                      r = 0;
                      g = 0;

                      const checkResult = checkBans(combination);

                      //  console.log('checkResult');
                      //  console.log(checkResult);

                      if (checkResult === null) {
                      //  console.log('checkResult');
                      //  console.log(checkResult);
                      //  console.log(combination);
                        // eslint-disable-next-line no-loop-func
                        combination.map((userIndex) => {
                          //    console.log('combination index');
                          //    console.log(userIndex);

                          validPlayers.push({ ...waitingPlayers[userIndex], userIndex });
                          //  waitingPlayers.splice(index, 1);
                          return null;
                        });

                        terminate = true;
                        break;
                        //  failCount = 0;
                      } else if (checkResult === 'no bans' && reservePlayers.length === 0) {
                        // eslint-disable-next-line no-loop-func
                        combination.map((userIndex) => {
                          reservePlayers.push({ ...waitingPlayers[userIndex], userIndex });
                          //  reservePlayers.push(waitingPlayers[userIndex]);
                          return null;
                        });

                        failCount += 1;

                      //  terminate = true;
                      //  break;
                      } else {
                        failCount += 1;
                      }

                      // shifting ignored indices
                      for (let w = 0; w < ignore.length; w += 1) {
                        if (ignore[w] > w) {
                          ignore[w] -= 1;

                          if (w > 0) { ignore[w - 1] = ignore[w] - 1; }
                          terminate = false;
                          break;
                        }
                      }
                    }

                    //  console.log('validPlayers');
                    //  console.log(validPlayers);
                    //  console.log(combination);

                    //  console.log('reservePlayers');
                    //  console.log(reservePlayers);

                    if (validPlayers && validPlayers.length === 3) {
                    //  console.log('has valid players');
                      validPlayers.sort((a, b) => b.userIndex - a.userIndex).map((player) => {
                        //    console.log(player.userIndex);
                        //    console.log(player);
                        waitingPlayers.splice(player.userIndex, 1);
                        //  const userBans = bans[player.uid];
                        if (bans[player.uid]) {
                          Object.keys(bans[player.uid]).map((key) => {
                            if (Object.keys(bans[key][player.uid]).length > 1) {
                              delete bans[key][player.uid];
                            } else {
                              delete bans[key];
                            }
                            return null;
                          });
                          delete bans[player.uid];
                        }
                        return null;
                      });
                      splitInRooms(validPlayers).then(() => {
                        validPlayers = [];
                        reservePlayers = [];
                        resolve2('success');
                      });
                    } else if (reservePlayers && reservePlayers.length === 3) {
                    //  console.log('has reserve players');
                      reservePlayers.sort((a, b) => b.userIndex - a.userIndex).map((player) => {
                      //  console.log(player);
                      //  console.log(player.userIndex);

                        waitingPlayers.splice(player.userIndex, 1);
                        if (bans[player.uid]) {
                          Object.keys(bans[player.uid]).map((key) => {
                            if (Object.keys(bans[key][player.uid]).length > 1) {
                              delete bans[key][player.uid];
                            } else {
                              delete bans[key];
                            }
                            return null;
                          });
                          delete bans[player.uid];
                        }
                        return null;
                      });
                      splitInRooms(reservePlayers).then(() => {
                        validPlayers = [];
                        reservePlayers = [];
                        resolve2('success');
                      });
                    } else {
                    //  console.log('cannot split in rooms, ignore conflicts');

                      admin.database().ref(`tournaments/${tournamentId}`).update({
                        isSettingRooms: false,
                        hadBlocks: true,
                      });

                      resolve2('failed');
                    // Set blocks and end
                    }
                  });
                };

                console.log('before do');

                //  let i = 1;
                let terminate = false;


                (async function loop() {
                  for (let i = 0; i < waitingPlayers.length; i += 1) {
                    // eslint-disable-next-line no-await-in-loop, no-loop-func
                    await new Promise((resolve2, reject2) => {
                    //  console.log('waitingPlayers');
                    //  console.log(waitingPlayers);
                    //  console.log('waitingPlayers.length');
                    //  console.log(waitingPlayers.length);
                    //  console.log('validPlayers');
                    //  console.log(validPlayers);
                    //  console.log('bans');
                    //  console.log(bans);
                    //  console.log('terminate');
                    //  console.log(terminate);
                      if (waitingPlayers.length >= 3 && !terminate) {
                        //    console.log('do main check loop');
                        if (waitingPlayers.length > 3) {
                          //    console.log('more than 3 players');
                          if (bans && Object.keys(bans).length > 0) {
                          //  console.log('has bans');

                            // eslint-disable-next-line no-await-in-loop
                            getThreeValidPlayer().then((res) => {
                              //    console.log(res);
                            //  console.log('&&&&&&&&&&&&&&&&&&&&&&&&&       getThreeValidPlayer waitingPlayers then   &&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&');
                              //    console.log(waitingPlayers);

                              if (res === 'failed') {
                                terminate = true;
                                return resolve2('failed');
                              }
                              return resolve2('success');


                              //  admin.database().ref(`tournaments/${tournamentId}`).update({
                              //    isSettingRooms: false,
                              //  });

                            //  if (!terminate) {
                            //    terminate = true;
                            //    forLoop();
                            //  } else {
                            //    i = waitingPlayers.length;
                              //  return resolve2('success');
                            //  }
                            });

                            //  if (!terminate) {
                            //    terminate = true;
                            //    forLoop();
                            //  } else {
                            //    return resolve3('success');
                            //  }
                          } else {
                          //  console.log('has NO bans');

                            //  admin.database().ref(`tournaments/${tournamentId}`).update({
                            //    isSettingRooms: false,
                            //  });

                            // eslint-disable-next-line no-await-in-loop
                            splitInRooms([waitingPlayers[0], waitingPlayers[1], waitingPlayers[2]])
                              .then((splitResp) => {
                                waitingPlayers.splice(0, 3);
                                //    console.log('^^^^^^^^^^^^^^^^^^^^^^^^^^   splitInRooms   ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^');
                                //    console.log(splitResp);

                                //  terminate = true;
                                return resolve2('success');
                              }).catch(err => reject2(err));

                            //  await splitInRooms(waitingPlayers);

                            //  terminate = true;
                          }
                        } else {
                        //  console.log('3 players');

                          if (bans && Object.keys(bans).length > 0) {
                            //    console.log('has bans');

                            admin.database().ref(`tournaments/${tournamentId}`).update({
                              isSettingRooms: false,
                              hadBlocks: true,
                            });

                            terminate = true;
                            return resolve2('success');

                            //  terminate = true;
                          }
                          //  console.log('has NO bans');

                          //  admin.database().ref(`tournaments/${tournamentId}`).update({
                          //    isSettingRooms: false,
                          //  });

                          // eslint-disable-next-line no-await-in-loop
                          splitInRooms(waitingPlayers).then((splitResp) => {
                            waitingPlayers.splice(0, 3);
                            //  console.log('^^^^^^^^^^^^^^^^^^^^^^^^^^   splitInRooms   ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^');
                            //    console.log(splitResp);

                            admin.database().ref(`tournaments/${tournamentId}`).update({
                              isSettingRooms: false,
                            });

                            terminate = true;
                            return resolve2('success');
                          }).catch(err => reject2(err));


                          //  await splitInRooms(waitingPlayers);

                          //  return resolve2('success');

                          //  terminate = true;
                        }
                      } else {
                        admin.database().ref(`tournaments/${tournamentId}`).update({
                          isSettingRooms: false,
                        //  hadBlocks: false,
                        });

                        return resolve2('success');
                      }
                    });
                  }
                }());

                /*  const forLoop = () => new Promise(async (resolve3) => {
                //  let terminate = false;

                  console.log('Start');
                  //  for (let index = 0; index < waitingPlayers.length; index += 1) {
                  //  do {

                  console.log('waitingPlayers');
                  console.log(waitingPlayers);

                  if (waitingPlayers.length >= 3) {
                    console.log('do main check loop');
                    if (waitingPlayers.length > 3) {
                      console.log('more than 3 players');
                      if (bans && Object.keys(bans).length > 0) {
                        console.log('has bans');

                        // eslint-disable-next-line no-await-in-loop
                        getThreeValidPlayer().then((res) => {
                          console.log(res);
                          console.log('&&&&&&&&&&&&&&&&&&&&&&&&&       getThreeValidPlayer waitingPlayers then   &&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&');
                          console.log(waitingPlayers);

                          admin.database().ref(`tournaments/${tournamentId}`).update({
                            isSettingRooms: false,
                          });

                          if (!terminate) {
                            terminate = true;
                            forLoop();
                          } else {
                            return resolve3('success');
                          }
                        });

                      //  if (!terminate) {
                      //    terminate = true;
                      //    forLoop();
                      //  } else {
                      //    return resolve3('success');
                      //  }
                      } else {
                        console.log('has NO bans');

                        // eslint-disable-next-line no-await-in-loop
                        const splitResp = await splitInRooms(waitingPlayers);
                        console.log('^^^^^^^^^^^^^^^^^^^^^^^^^^   splitInRooms   ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^');
                        console.log(splitResp);

                        //  await splitInRooms(waitingPlayers);

                        admin.database().ref(`tournaments/${tournamentId}`).update({
                          isSettingRooms: false,
                        });

                        //  terminate = true;
                      }
                    } else {
                      console.log('3 players');

                      if (bans && Object.keys(bans).length > 0) {
                        console.log('has bans');

                        admin.database().ref(`tournaments/${tournamentId}`).update({
                          isSettingRooms: false,
                          hadBlocks: true,
                        });

                        return resolve3('success');

                        //  terminate = true;
                      }
                      console.log('has NO bans');

                      // eslint-disable-next-line no-await-in-loop
                      const splitResp = await splitInRooms(waitingPlayers);
                      console.log('^^^^^^^^^^^^^^^^^^^^^^^^^^   splitInRooms   ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^');
                      console.log(splitResp);

                      //  await splitInRooms(waitingPlayers);

                      admin.database().ref(`tournaments/${tournamentId}`).update({
                        isSettingRooms: false,
                      });

                      return resolve3('success');

                      //  terminate = true;
                    }
                  } else {
                    admin.database().ref(`tournaments/${tournamentId}`).update({
                      isSettingRooms: false,
                      hadBlocks: false,
                    });

                    return resolve3('success');
                  }
                  //  }
                  //  while (!terminate && waitingPlayers.length > 1);
                //  }
                });

                //  return forLoop();

                forLoop(); */

                return resolve('success');

              /*  return () => new Promise((resolve2) => {
                  forLoop().then((res) => {
                    console.log('forLoop res');
                    console.log(res);
                    return resolve2(res);
                  }).then(() => resolve('success'));
                }); */
              }).catch((err) => {
                console.log(err);
                return resolve(err);
              });
            });
          } else {
            return resolve('not enough players in list');
          }
        } else {
          console.log('tournament is not live');
          return resolve('tournament is not live');
        }
      });
  } else {
    return resolve('dont execute');
  }
//  return null;
}));

module.exports = onPlayerJoinsTournamentPlay;
