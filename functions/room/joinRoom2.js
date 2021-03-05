const joinRoom2 = (req, res) => {
  const cors = require('cors')({ origin: true });
  const { admin, adminLogsDb, roomsPublicDb } = require('../admin');
  const roomState = require('./roomState');

  cors(req, res, () => {
    if (!req.body || !req.body.data) {
      return res.status(200).send({ data: 'no req body data' });
    }

    const {
      roomId,
      init,
      userPassword,
    } = req.body.data;

  /*  if (init) {
      admin.database().ref(`rooms/${roomId}`).update({
        init: Date.now(),
      });

      return res.status(200).send({ data: 'initialized' });
    } */

    roomState.isIdle(roomId).then(() => {
      const processRequest = () => new Promise((resolve, reject) => {

      if (!req.get('Authorization')) {
      //  return res.status(200).send({ data: 'Error creating room (no auth)' });
        return reject({ data: 'Error creating room (no auth)' });
      }
      const tokenId = req.get('Authorization').split('Bearer ')[1];

      admin.auth().verifyIdToken(tokenId)
        .then((decoded) => {
          if (!decoded.uid) {
          //  return res.status(200).send({ data: 'Error joining room (no auth token)' });
          return reject({ data: 'Error joining room (no auth token)' });
          }

          const promise1 = admin.database().ref(`rooms/${roomId}/players`).once('value');
          const promise2 = admin.database().ref(`rooms/${roomId}/globalParams/roomClosed`).once('value');
          const promise3 = admin.database().ref(`users/${decoded.uid}/joinedRooms`).once('value');

          Promise.all([promise1, promise2, promise3]).then((results) => {
            let players;
            let roomClosed = false;
            let joinedRooms;

            results.forEach((result, index) => {
              if (index === 0) {
                players = result.val() || {};
              } else if (index === 1) {
                roomClosed = result.val() || false;
              } else if (index === 2) {
                joinedRooms = result.val() || null;
              }
            });

            if (roomClosed) {
            //  return res.status(200).send({ data: { status: 'error', error: 'room closed' } });
              return reject({ data: { status: 'error', error: 'room closed' } });
            }

            if (!joinedRooms || Object.keys(joinedRooms).length === 0) {

            if (players.player1 && players.player2 && players.player3
              && players.player1.uid && players.player2.uid && players.player3.uid) {
            //  return res.status(200).send({ data: { status: 'error', error: 'Room full' } });
              return reject({ data: { status: 'error', error: 'Room full' } });
            }

            if ((players.player1 && players.player1.uid === decoded.uid)
              || (players.player2 && players.player2.uid === decoded.uid)
              || (players.player3 && players.player3.uid === decoded.uid)
              || (players.player4 && players.player4.uid === decoded.uid)) {
              return reject({ data: { status: 'error', error: 'Already joined this room' } });
            //  return res.status(200).send({ data: { status: 'error', error: 'Already joined this room' } });
            }

            const promises = [];
            Object.keys(players).map((key) => {
              if (players[key] && players[key].uid) {
                promises.push(admin.database().ref(`ignoredPlayers/${players[key].uid}/${decoded.uid}`).once('value'));
                promises.push(admin.database().ref(`ignoredPlayers/${decoded.uid}/${players[key].uid}`).once('value'));
              }
              return null;
            });

            Promise.all(promises).then((promiseRes) => {
              let isIgnored = false;
              let resKey = '';
              let parentKey = '';
              let resName = '';
              promiseRes.map((res2) => {
                if (res2) {
                  const res2Val = res2.val() || null;
                  if (res2Val) {
                    isIgnored = true;
                    resKey = res2.key;
                    parentKey = res2.ref.parent.key;
                    resName = res2Val.name;
                  }
                }
                return null;
              });

              if (isIgnored) {
                if (resKey === decoded.uid) {
                  let playerName = '';

                  Object.keys(players).map((key2) => {
                    if (players[key2] && players[key2].uid === parentKey) {
                      playerName = players[key2].name;
                    }
                    return null;
                  });

                  return reject({
                    data: {
                      status: 'error', error: 'Ignored', type: 'ignored you', name: playerName,
                    },
                  });

                //  return res.status(200).send({
                //    data: {
                //      status: 'error', error: 'Ignored', type: 'ignored you', name: playerName,
                //    },
                //  });
                }

                return reject({
                  data: {
                    status: 'error', error: 'Ignored', type: 'you ignored', name: resName,
                  },
                });

              //  return res.status(200).send({
              //    data: {
              //      status: 'error', error: 'Ignored', type: 'you ignored', name: resName,
              //    },
              //  });
              }

              const promise4 = admin.database().ref(`users/${decoded.uid}`).once('value');
              const promise5 = admin.database().ref(`rooms/${roomId}/globalParams/bet`).once('value');
              const promise6 = admin.database().ref(`rooms/${roomId}/globalParams/privateRoom`).once('value');
              const promise7 = admin.database().ref(`rooms/${roomId}/globalParams/password`).once('value');
              const promise8 = admin.database().ref(`rooms/${roomId}/globalParams/proGame`).once('value');

              Promise.all([promise4, promise5, promise6, promise7, promise8]).then((promiseRes2) => {
                let userData;
                let bet;
                let privateRoom;
                let password;
                let proGame;
                promiseRes2.map((res2) => {
                  if (res2.key === 'bet') {
                    bet = res2.val();
                  } else if (res2.key === 'privateRoom') {
                    privateRoom = res2.val();
                  } else if (res2.key === 'password') {
                    password = res2.val();
                  } else if (res2.key === 'proGame') {
                    proGame = res2.val();
                  } else {
                    userData = res2.val();
                  }
                });

                if (privateRoom) {
                  if (password.toString() !== userPassword.toString()) {
                  //  return res.status(200).send({ data: { status: 'error', error: 'wrong password' } });
                    return reject({ data: { status: 'error', error: 'wrong password' } });
                  }
                }

                if (proGame && parseInt(userData.lvl, 10) < 10) {
                //  log(roomId, 'joinRoom: pro room');
                //  return res.status(200).send({ data: { status: 'error', error: 'pro room' } });
                  return reject({ data: { status: 'error', error: 'pro room' } });
                //  return reject({ data: { status: 'error', error: 'pro room' } });
                }

                let joinPrice = 0;
                let balNeeded = 0;

                if (bet === '1:1') {
                  joinPrice = 1;
                  balNeeded = 16 + joinPrice;
                } else if (bet === '1:5') {
                  joinPrice = 1;
                  balNeeded = 80 + joinPrice;
                } else if (bet === '1:10') {
                  joinPrice = 2;
                  balNeeded = 160 + joinPrice;
                } else if (bet === '1:25') {
                  joinPrice = 5;
                  balNeeded = 400 + joinPrice;
                } else if (bet === '1:50') {
                  joinPrice = 10;
                  balNeeded = 800 + joinPrice;
                } else if (bet === '1:100') {
                  joinPrice = 20;
                  balNeeded = 1600 + joinPrice;
                } else if (bet === '1:500') {
                  joinPrice = 100;
                  balNeeded = 8000 + joinPrice;
                } else if (bet === '1:1000') {
                  joinPrice = 200;
                  balNeeded = 16000 + joinPrice;
                } else if (bet === '1:5000') {
                  joinPrice = 1000;
                  balNeeded = 80000 + joinPrice;
                } else if (bet === '1:10000') {
                  joinPrice = 2000;
                  balNeeded = 160000 + joinPrice;
                }

            //    console.log('userData');
              //  console.log(userData);

                if (userData.bal >= balNeeded) {
                  const { name } = userData;

                  const punctuationless = name.replace(/[\.,-\/#!$%\^&\*;:{}=\-_`~()@\+\?><\[\]\+]/g, '');
                  const finalString = punctuationless.replace(/\s{2,}/g, ' ');

                  const nameSplit = finalString.split(' ');
                  const { length } = nameSplit;

                  const shortName = `${nameSplit[0]} ${nameSplit[length - 1].charAt(0)}`;

                  admin.database().ref(`rooms/${roomId}/players`).transaction((players2) => {
                    if (!players2) {
                      return players2;
                    }

                      if (players2 && players2.player1 &&  players2.player1.uid && players2.player2 &&  players2.player2.uid && players2.player3 &&  players2.player3.uid) {
                        console.log('room full, ABORT');
                        return; // Abort the transaction.
                      }

                      let newPlayers = { ...players2 };

                      if (players2 && !players2.player1) {
                        newPlayers.player1 = {
                          uid: decoded.uid,
                          name,
                        //  lvl: userData.lvl,
                          bal: userData.bal,
                        }

                        return newPlayers;
                      } else if (players2 && !players2.player2) {
                        newPlayers.player2 = {
                          uid: decoded.uid,
                          name,
                        //  lvl: userData.lvl,
                          bal: userData.bal,
                        }

                        return newPlayers;
                      } else if (players2 && !players2.player3) {
                        newPlayers.player3 = {
                          uid: decoded.uid,
                          name,
                        //  lvl: userData.lvl,
                          bal: userData.bal,
                        }

                        return newPlayers;
                      }

                      return;
                  })
                    .then((result) => {
                      if (!result.committed) {
                      //  return res.status(200).send({ data: { status: 'not success' } });
                        return reject({ data: { status: 'not success' } });
                      }
                      if (result.snapshot.val() === null) {
                        console.log('val is null');
                        return null;
                      }

                    //  console.log('result');
                    //  console.log(result.snapshot.val());

                      const lastPosition = Object.keys(result.snapshot.val()).pop()

                      admin.database().ref(`rooms/${roomId}/players`).once('value', (playersSnapshot) => {
                        const players3 = playersSnapshot.val() || {};

                      //  console.log('players3');
                      //  console.log(players3);

                        let lastPosition;

                        if (players3 && players3.player1 && players3.player1.uid === decoded.uid) {
                          lastPosition = 'player1';
                        }
                        if (players3 && players3.player2 && players3.player2.uid === decoded.uid) {
                          lastPosition = 'player2';
                        }
                        if (players3 && players3.player3 && players3.player3.uid === decoded.uid) {
                          lastPosition = 'player3';
                        }

                        if (!players.player1 && players3 && players3.player1 && players3.player1.uid) {
                          admin.database().ref(`rooms/${roomId}/globalParams/talking`).set(players3.player1.uid);
                        }

                      //  console.log('lastPosition');
                      //  console.log(lastPosition);

                      //  if (players3 && players3[lastPosition] && players3[lastPosition].uid && players3[lastPosition].uid === decoded.uid) {
                          admin.database().ref(`rooms/${roomId}/playersList/${lastPosition}`).update({
                            uid: decoded.uid,
                            name,
                            shortName,
                            photo: userData.photo,
                            lvl: userData.lvl,
                            bal: userData.bal,
                          });

                          let updates = {};

                          updates[`playersList/${lastPosition}`] = {
                            uid: decoded.uid,
                            lvl: userData.lvl,
                            shortName,
                          };
                          updates[`playersList/playerList/${decoded.uid}`] = lastPosition;
                          updates['roomClosed'] = false;

                          admin.database().ref(`roomsPubInf/${roomId}`).update(updates);

                          admin.database(roomsPublicDb).ref(`roomsPubInf/${roomId}`).update(updates);

                        //  admin.database().ref(`roomsPubInf/${roomId}/playersList/${lastPosition}`).update({
                        //    uid: decoded.uid,
                        //    lvl: userData.lvl,
                        //    name,
                        //    shortName,
                        //  });

                        //  admin.database().ref(`roomsPubInf/${roomId}/playersList/playerList`).update({
                        //    [decoded.uid]: lastPosition,
                        //  });

                        //  admin.database().ref(`roomsPubInf/${roomId}/roomClosed`).set(false);

                          admin.database().ref(`rooms/${roomId}/globalParams`).update({
                            roomClosed: false,
                          });

                          admin.database().ref(`rooms/${roomId}`).update({
                            roomClosed: false,
                          });

                          admin.database().ref(`activeRooms/${roomId}`).set({
                            time: Date.now(),
                          });

                          admin.database().ref(`users/${decoded.uid}/joinedRooms/${roomId}`).set({
                            position: lastPosition,
                          });

                        //  admin.database().ref(`users/${decoded.uid}/joinedRooms`).update({
                        //    roomId: position,
                        //  }).then(joinedRoomsResult => {
                        //    console.log(joinedRoomsResult);
                        //    console.log(joinedRoomsResult.val());
                        //  });

                        //  admin.database().ref(`status/${decoded.uid}`).update({
                        //    isWaitingRoom: true,
                        //  });

                          admin.database().ref(`rooms/${roomId}/playersList/playerList`).update({
                            [decoded.uid]: lastPosition,
                          });

                          if (players3.player1 && players3.player2 && players3.player3) {
                            const promises2 = [];

                            Object.keys(players3).map((key) => {
                              promises2.push(admin.database().ref(`users/${players3[key].uid}/bal`).once('value', (playerBalSnapshot) => {
                                const playerBal = playerBalSnapshot.val() || {};
                                const newBal = parseInt(playerBal, 10) - joinPrice;

                                admin.database().ref(`users/${players3[key].uid}/bal`)
                                  .transaction(bal => (bal || 0) - joinPrice);

                                admin.database().ref(`rooms/${roomId}/playersList/${key}`).update({
                                  bal: newBal,
                                });

                              //  admin.database().ref(`status/${players3[key].uid}/isWaitingRoom`).set(false);

                                admin.database().ref(`userBalHistory/${players3[key].uid}`).push({
                                  time: Date.now(),
                                  type: 'joinPrice',
                                  roomId,
                                  change: `-${joinPrice}`,
                                  old: playerBal,
                                  new: newBal,
                                });
                              }));

                              return null;
                            });

                          //  admin.database().ref(`adminLogs/roomIds/${roomId}`).update({
                          //    index: '',
                          //  });

                          //  admin.database().ref(`adminLogs/playerRooms/${decoded.uid}/${roomId}`).update({
                          //    date: Date.now(),
                          //    bet,
                          //  });

                            admin.database(adminLogsDb).ref(`adminLogs/roomIds/${roomId}`).update({
                              index: '',
                            });

                            admin.database(adminLogsDb).ref(`adminLogs/playerRooms/${decoded.uid}/${roomId}`).update({
                              date: Date.now(),
                              bet,
                            });

                            Promise.all(promises2)
                              .then(() => resolve({ data: { status: 'success' } }))
                              .catch(() => resolve({ data: { status: 'success' } }));

                          //  Promise.all(promises2)
                          //     .then(() => res.status(200).send({ data: { status: 'success' } }))
                          //    .catch(() => res.status(200).send({ data: { status: 'success' } }));
                          } else {
                            return resolve({ data: { status: 'success' } });
                          }
                      //  } else {
                      //    return res.status(200).send({ data: { status: 'error', error: 'position taken' } });
                      //  }
                      });
                    })
                    .catch(err => {
                    //  res.status(200).send({ data: { status: 'error', error: err } });
                      return reject({ data: { status: 'error', error: err } });
                    });
                } else {
                //  return res.status(200).send({ data: { status: 'error', error: 'insufficient balance', balNeeded } });
                  return reject({ data: { status: 'error', error: 'insufficient balance', balNeeded } });
                }
              });
            });
          } else {
                 console.log('already in a room');
                 const joinedRoomId = Object.keys(joinedRooms)[0];

                 console.log(joinedRoomId);

                 if (joinedRoomId === roomId) {
                   console.log('joinedRoomId equal to roomId');
                   return resolve({ data: { status: 'error', error: 'already resolved' } });
                 } else {
                   const promise4 = admin.database().ref(`rooms/${joinedRoomId}/nextTimeStamp`).once('value');
                   const promise5 = admin.database().ref(`rooms/${joinedRoomId}/globalParams/roomClosed`).once('value');

                   Promise.all([promise4, promise5]).then((promisesRes) => {
                     let nextTimeStamp;
                     let joinedRoomClosed;

                     promisesRes.map((promiseRes) => {
                       if (promiseRes.key === 'nextTimeStamp') {
                         nextTimeStamp = promiseRes.val();
                       } else if (promiseRes.key === 'roomClosed') {
                         joinedRoomClosed = promiseRes.val();
                       }

                       return null;
                     });

                     if (joinedRoomClosed || nextTimeStamp < Date.now() - 1000 * 40) {
                       admin.database().ref(`users/${decoded.uid}/joinedRooms`).remove();
                     }

                     return resolve({ data: { status: 'error', error: 'already in a room' } });
                    // return res.status(200).send({ data: { status: 'error', error: 'already in a room' } });
                   });
                 }

               //  return reject({ data: { status: 'error', error: 'already in a room' } });
               }
          }).catch(err => {
            //  res.status(200).send({ data: { status: 'error', error: err } })
            return reject({ data: { status: 'error', error: err } });
          });
        })
        .catch(err => {
          //  res.status(200).send({ data: { status: 'error', error: err } })
          return reject({ data: { status: 'error', error: err } });
      });
      });

      processRequest().then((r) => {
        roomState.markIdle(roomId).then(() => res.status(200).send(r)).catch(err => res.status(200).send(err));
      }).catch((err) => {
        roomState.markIdle(roomId).then(() => res.status(200).send(err)).catch(err2 => res.status(200).send(err2));
      });
    }).catch((err) => {
      roomState.markIdle(roomId);
      return res.status(200).send({ data: { status: 'error', error: err } });
    });
  });
};

module.exports = joinRoom2;
