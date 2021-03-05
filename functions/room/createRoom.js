
const createRoom = (req, res) => {
  const cors = require('cors')({ origin: true });
  const { admin, adminLogsDb, roomsPublicDb, roomsDb } = require('../admin');

  cors(req, res, () => {
    const {
      parasta,
      G,
      maza,
      atra,
      pro,
      bet,
      privateRoom,
    } = req.body.data;

    if (!req.get('Authorization')) {
      return res.status(200).send({ data: 'Error creating room (no auth)' });
    }
    const tokenId = req.get('Authorization').split('Bearer ')[1];

    admin.auth().verifyIdToken(tokenId)
      .then((decoded) => {
        if (!decoded.uid) {
          return res.status(200).send({ data: 'Error creating room (no auth token)' });
        }

        let gameType;
        if (parasta) {
          gameType = 'P';
        }

        if (G) {
          gameType = 'G';
        }

        admin.database().ref(`users/${decoded.uid}`).once('value', (userSnapshot) => {
          const userData = userSnapshot.val() || {};

          const {
            joinedRooms, lvl, name, photo, bal,
          } = userData;

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
          } else if (lvl >= 10) {
            if (bet === '1:500') {
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
          } else {
            return res.status(200).send({ data: { status: 'error', error: 'pro bet' } });
          }

          if (!joinedRooms || Object.keys(joinedRooms).length === 0) {
            if (userData.bal >= balNeeded) {
              if (!pro || (pro && lvl >= 10)) {
                const trimmedName = name.trim();
                const punctuationless = trimmedName.replace(/[\.,-\/#!$%\^&\*;:{}=\-_`~()@\+\?><\[\]\+]/g, '');
                const finalString = punctuationless.replace(/\s{2,}/g, ' ');

                const nameSplit = finalString.split(' ');
                const { length } = nameSplit;

                const shortName = `${nameSplit[0]} ${nameSplit[length - 1].charAt(0)}`;

                let password;
                if (privateRoom) {
                  password = Math.floor(Math.random() * (9999 - 1000 + 1) + 1000);
                }

                admin.database(roomsDb).ref('rooms').push({
                  players: {
                    player1: {
                      uid: decoded.uid,
                      name,
                    },
                  },
                  playersList: {
                    player1: {
                      uid: decoded.uid,
                      name,
                      shortName,
                      photo: photo || null,
                      lvl,
                      bal,
                    },
                    playerList: {
                      [decoded.uid]: 'player1',
                    },
                  },
                  globalParams: {
                    talking: decoded.uid.toString(),
                    currentHand: 1,
                    gameType,
                    fastGame: atra || null,
                    smallGame: maza || null,
                    proGame: pro || null,
                    bet,
                    roomClosed: false,
                    gameState: 'choose',
                    party: 1,
                    privateRoom: privateRoom || false,
                    password: privateRoom ? password : null,
                  },
                  curRnd: {
                    firstToGo: 'player1',
                    currentTurn: 'player1',
                  },
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
                  roomIsBusy: false,
                })
                  .then((snap) => {
                    const { key } = snap;

                    admin.database().ref(`rooms/${key}`).set({
                    //  players: {
                    //    player1: {
                    //      uid: decoded.uid,
                    //      name,
                    //    },
                    //  },
                      playersList: {
                      /*  player1: {
                          uid: decoded.uid,
                          name,
                          shortName,
                          photo: photo || null,
                          lvl,
                          bal,
                        }, */
                        playerList: {
                          [decoded.uid]: 'player1',
                        },
                      },
                    /*  globalParams: {
                        talking: decoded.uid.toString(),
                        currentHand: 1,
                        gameType,
                        fastGame: atra || null,
                        smallGame: maza || null,
                        proGame: pro || null,
                        bet,
                        roomClosed: false,
                        gameState: 'choose',
                        party: 1,
                        privateRoom: privateRoom || false,
                        password: privateRoom ? password : null,
                      },
                      curRnd: {
                        firstToGo: 'player1',
                        currentTurn: 'player1',
                      },
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
                      roomIsBusy: false,  */
                    })

                    admin.database().ref(`users/${decoded.uid}/joinedRooms/${key}`).set({
                      position: 'player1',
                    });

                    admin.database().ref(`rooms/${key}/globalParams`).update({
                      roomId: key,
                    });

                    admin.database(roomsDb).ref(`rooms/${key}/globalParams`).update({
                      roomId: key,
                    });

                    admin.database().ref('roomsCount')
                      .transaction(roomsCount => (parseInt(roomsCount, 10) || 0) + 1);

                    admin.database().ref(`activeRooms/${key}`).set({
                      time: Date.now(),
                    });

                    admin.database(roomsPublicDb).ref(`roomsPubInf/${key}`).set({
                      playersList: {
                        player1: {
                          uid: decoded.uid,
                          lvl,
                          shortName,
                        },
                      },
                      globalParams: {
                        gameType,
                        fastGame: atra || null,
                        smallGame: maza || null,
                        proGame: pro || null,
                        bet,
                        privateRoom: privateRoom || false,
                      },
                      roomClosed: false,
                    });

                    admin.database(roomsPublicDb).ref(`roomsPubInfIds/${key}`).set({ open: true });

                    admin.database(adminLogsDb).ref(`adminLogs/roomIds/${key}`).update({
                      date: Date.now(),
                      bet,
                    });

                    admin.database(adminLogsDb).ref(`adminLogs/playerRooms/${decoded.uid}/${key}`).update({
                      date: Date.now(),
                      bet,
                    });


                    return key;
                  })
                  .then((key) => {
                    if (privateRoom) {
                      return res.status(200).send({ data: { status: 'success', key, password } });
                    }
                    return res.status(200).send({ data: { status: 'success', key } });
                  })
                  .catch(err => res.status(200).send({ data: { status: 'error', error: err } }));
              } else {
                return res.status(200).send({ data: { status: 'error', error: 'pro room' } });
              }
            } else {
              return res.status(200).send({ data: { status: 'error', error: 'insufficient balance', balNeeded } });
            }
          } else {
            const joinedRoomId = Object.keys(joinedRooms)[0];

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

                return res.status(200).send({ data: { status: 'error', error: 'already in a room' } });
              });
          }
        }).catch(err => res.status(200).send({ data: { status: 'error', error: err } }));
      //  return null;
      }).catch(err => res.status(200).send({ data: { status: 'error', error: err } }));
  });
};

module.exports = createRoom;
