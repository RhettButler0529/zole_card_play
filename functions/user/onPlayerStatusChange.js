const onPlayerStatusChange = (change, context) => new Promise(((resolve, reject) => {
  const { admin, roomsPublicDb } = require('../admin');
  const afterData = change.after.val() || null;
  const beforeData = change.before.val() || null;

  const { userId } = context.params;

//  console.log(userId);
//  console.log(context.eventId);

  const validEventId = context.eventId.replace('/', '')

  admin.database().ref(`playerStatusEventIds/${validEventId}`)
    .transaction(eventId => {
      if (eventId) {
        return;
      }

      return true;
    }).then(result => {
      if (!result.committed) {
        console.log('not valid id');
        console.log(validEventId);

        return resolve();
      }

      if (userId !== 'onlineCount' && (!beforeData || (beforeData && !beforeData.status)) && afterData) {
      //  console.log('gained connection');

        admin.database().ref('onlineCount')
          .transaction(onlineCount => (parseInt(onlineCount, 10) || 0) + 1);

      }

      if (userId !== 'onlineCount' && beforeData && ((afterData && !afterData.status) || !afterData)) {
      //  console.log('lost connection');

        admin.database().ref('onlineCount')
          .transaction(onlineCount => (parseInt(onlineCount, 10) || 0) - 1);

        return admin.database().ref(`users/${userId}/joinedRooms`).once('value', (joinedRoomsSnapshot) => {
          const joinedRooms = joinedRoomsSnapshot.val() || null;

          if (joinedRooms) {
            Object.keys(joinedRooms).map((key) => {
              const { position, tournamentRoom } = joinedRooms[key];

              if (position && !tournamentRoom) {
                return admin.database().ref(`rooms/${key}`).transaction((roomData) => {
                  if (!roomData) {
                    return roomData;
                  }

                  console.log('roomData');
                  console.log(roomData);

                  if (roomData.players && roomData.players.player1 && roomData.players.player2 && roomData.players.player3) {
                    return;
                  }

                  if (roomData.playersList && roomData.players) {
                    return {
                      ...roomData,
                      players: {
                        ...roomData.players,
                        [position]: null,
                      },
                      playersList: {
                        ...roomData.playersList,
                        [position]: null,
                        playerList: {
                          ...roomData.playersList.playerList,
                          [userId]: null,
                        }
                      }
                    }
                  } else {
                    return {
                      ...roomData,
                      players: {
                        ...roomData.players,
                        [position]: null,
                      },
                      playersList: {
                        ...roomData.playersList,
                        [position]: null,
                        playerList: {
                          [userId]: null,
                        }
                      }
                    }
                  }

                }).then((result) => {
                  console.log(result.committed);

                  if (!result.committed) {
                    console.log('not commited');
                    return resolve();
                  }

                  console.log('result.snapshot.val()');
                  console.log(result.snapshot.val());

                  const resultData = result.snapshot.val() || {};

                  if (resultData && !resultData.players) {
                  //  admin.database().ref(`roomsPubInf/${key}/globalParams/roomClosed`).set(true);
                  //  admin.database().ref(`rooms/${key}/globalParams/roomClosed`).set(true);

                    admin.database().ref(`roomsPubInf/${key}`).remove();
                    admin.database(roomsPublicDb).ref(`roomsPubInf/${key}`).remove();

                    admin.database().ref(`rooms/${key}`).remove();
                  } else {
                    admin.database().ref(`roomsPubInf/${key}/playersList/${position}`).remove();
                    admin.database(roomsPublicDb).ref(`roomsPubInf/${key}/playersList/${position}`).remove();
                  }

                  admin.database().ref(`users/${userId}/joinedRooms`).remove();

                  return resolve();
                });
            } else {
              return resolve();
            }
              return null;
            });
          } else {
            return resolve();
          }
        });
      }

      return resolve();
    }).catch(err => {
      console.log(err);
      return resolve();
    });



/*





  //  if (!afterData.status && userId !== 'onlineCount') {
  if (userId !== 'onlineCount' && beforeData && beforeData.status && ((afterData && !afterData.status) || !afterData)) {
  //  setTimeout(() => {
    admin.database().ref(`status/${userId}`)
      .once('value', (statusSnapshot) => {
        const statusData = statusSnapshot.val() || null;

        if (!statusData) {
          admin.database().ref('tournaments')
            .orderByChild('status')
            .startAt('paused')
            .endAt('running')
            .once('value', (tournamentSnapshot) => {
              const activeTournaments = tournamentSnapshot.val() || {};

              //  console.log('activeTournaments');
              //  console.log(activeTournaments);

              Object.keys(activeTournaments).map((key) => {
                admin.database().ref(`tourPlWaitList/${key}/${userId}`).remove();
                return null;
              });
            });

          admin.database().ref(`users/${userId}/joinedRooms`)
            .once('value', (playerSnapshot) => {
              const joinedRooms = playerSnapshot.val() || {};

              //  console.log(`player status change ${userId}`);
              //  console.log(joinedRooms);

              if (joinedRooms && Object.keys(joinedRooms).length > 0) {
                Object.keys(joinedRooms).map(key => (
                  admin.database().ref(`rooms/${key}/players`).once('value', (snapshot) => {
                    const players = snapshot.val() || {};

                    //    console.log(players);

                    const { player1, player2, player3 } = players;

                    if (player1 && player2 && player3) {
                    // admin.database().ref(`users/${userId}/joinedRooms/${key}`).remove();

                      // Set timer to 15 seconds to allow to return
                      //  admin.database().ref(`rooms/${key}`).update({
                      //    nextTimestamp: (Date.now() + 1000 * 15),
                      //  });

                      admin.database().ref(`rooms/${key}/globalParams/disconectedUser`).set(userId);

                      return null;

                      //  leaving game before it fills up
                    }

                    /* if ((player1 && !player2 && !player3)
                            || (!player1 && player2 && !player3)
                            || (!player1 && !player2 && player3)) {
                      admin.database().ref(`rooms/${key}/globalParams`).once('value', (globalParamsSnapshot) => {
                        const globalParams = globalParamsSnapshot.val() || {};
                        const { tournamentRoom } = globalParams;

                        admin.database().ref(`roomsPubInf/${key}`).update({
                          roomClosed: true,
                        });

                        admin.database().ref(`rooms/${key}/globalParams`).update({
                          roomClosed: true,
                        });

                        if (!tournamentRoom) {
                          admin.database().ref('rooms/roomCount')
                            .transaction(roomCount => (roomCount - 1));
                        }

                        admin.database().ref(`adminLogs/roomIds/${key}`).remove();

                        admin.database().ref(`adminLogs/playerRooms/${userId}/${key}`).remove();

                        if (!tournamentRoom) {
                          admin.database().ref(`roomsPubInf/${key}`).remove();
                        }

                        admin.database().ref(`users/${userId}/joinedRooms/${key}`).remove();

                        admin.database().ref(`status/${userId}`).update({
                          isWaitingRoom: false,
                        });
                      });
                    } else {
                    //  console.log('leaving game before it fills up and not last player');
                    //  console.log(userId);
                      let playerPosition;
                      if (player1 && player1.uid === userId) {
                        playerPosition = 'player1';
                      } else if (player2 && player2.uid === userId) {
                        playerPosition = 'player2';
                      } else if (player3 && player3.uid === userId) {
                        playerPosition = 'player3';
                      }
                      if (playerPosition) {
                        admin.database().ref(`rooms/${key}/players`).transaction((playersTrans) => {
                          if (playersTrans && playersTrans[playerPosition].uid !== userId) {
                          //  console.log('not player in position');
                            return; // Abort the transaction.
                          }
                          if (playersTrans && (playersTrans.player1 && playersTrans.player2 && playersTrans.player3
                              && playersTrans.player1.uid && playersTrans.player2.uid && playersTrans.player3.uid)) {
                          //  console.log('room alredy filled');
                            return; // Abort the transaction.
                          }

                          //  console.log(`playersTrans ${key}`);
                          //  console.log(playersTrans);

                          const newPlayers = playersTrans;
                          if (playerPosition && playersTrans) {
                            console.log(newPlayers[playerPosition]);
                            delete newPlayers[playerPosition];
                          }

                          return newPlayers;
                        })
                          .then((result) => {
                            if (!result.committed) {
                              return resolve('aborted removing room');
                            }

                            //  admin.database().ref(`rooms/${key}/players/${playerPosition}`).remove();

                            admin.database().ref(`users/${userId}/joinedRooms/${key}`).remove();

                            admin.database().ref(`rooms/${key}/playersList/${playerPosition}`).remove();

                            admin.database().ref(`rooms/${key}/playersList/playerList/${userId}`).remove();

                            admin.database().ref(`roomsPubInf/${key}/playersList/${playerPosition}`).remove();

                            admin.database().ref(`roomsPubInf/${key}/playersList/playerList/${userId}`).remove();

                            admin.database().ref(`adminLogs/playerRooms/${userId}/${key}`).remove();

                            admin.database().ref(`status/${userId}`).update({
                              isWaitingRoom: false,
                            });

                            admin.database().ref(`rooms/${key}/globalParams/party`).once('value', (partySnapshot) => {
                              const party = partySnapshot.val() || {};

                              admin.database().ref(`adminLogs/rooms/${key}/${party}`).push({
                                time: Date.now(),
                                roomId: key,
                                type: 'playerLeft',
                                data: {
                                  playerUid: userId,
                                },
                              });
                            });

                            return null;
                          });
                      } else {
                        return null;
                      }
                    } */






                    /*

                    return null;
                  })
                  //  })
                ));
                return resolve('success');
              }
              return resolve('no joined rooms');
            }).then(() => {
            });
        } else {
          return resolve('has connections');
        }
      });
  //  }, 1000);
  } else {
    return resolve('has connections');
  }  */

//  return resolve('success');
}));

module.exports = onPlayerStatusChange;
