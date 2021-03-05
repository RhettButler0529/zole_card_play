const onPlayerStatusRemove = (snapshot, context) => new Promise(((resolve, reject) => {
  const { admin, roomsPublicDb, roomsDb } = require('../admin');
//  const afterData = snapshot.val() || null;

  const { userId } = context.params;

  const validEventId = context.eventId.replace('/', '')

  admin.database().ref(`playerStatusValidEventIds/${userId}`)
    .transaction(eventId => {
      if (eventId && validEventId === eventId) {
        return;
      }

      return validEventId;``
    }).then(result => {
      if (!result.committed) {
        console.log('not valid id');
        console.log(validEventId);

        return resolve();
      }

      if (userId !== 'onlineCount') {
      //  console.log('lost connection');

        admin.database().ref('onlineCount')
          .transaction(onlineCount => (parseInt(onlineCount, 10) || 0) - 1);

        return admin.database().ref(`users/${userId}/joinedRooms`).once('value', (joinedRoomsSnapshot) => {
          const joinedRooms = joinedRoomsSnapshot.val() || null;

          if (joinedRooms) {
            Object.keys(joinedRooms).map((key) => {
              const { position, tournamentRoom } = joinedRooms[key];

              if (position && !tournamentRoom) {
                return admin.database(roomsDb).ref(`rooms/${key}`).transaction((roomData) => {
                  if (!roomData) {
                    return roomData;
                  }

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
                  if (!result.committed) {
                    return resolve();
                  }

                  const resultData = result.snapshot.val() || {};

                  if (resultData && !resultData.players) {
                    admin.database().ref(`roomsPubInf/${key}`).remove();
                    admin.database().ref(`roomsPubInfIds/${key}`).remove();

                    admin.database(roomsPublicDb).ref(`roomsPubInf/${key}`).remove();
                    admin.database(roomsPublicDb).ref(`roomsPubInfIds/${key}`).remove();

                    admin.database(roomsDb).ref(`rooms/${key}`).remove();
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
}));

module.exports = onPlayerStatusRemove;
