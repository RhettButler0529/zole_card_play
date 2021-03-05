const onRoomClosed = (change, context) => new Promise(((resolve, reject) => {
  const { admin, roomsPublicDb, roomsDb } = require('../admin');
  const data = change.after.val() || null;
  const { roomId } = context.params;

//  console.log(data);
//  console.log(roomId);

  if (data) {
    admin.database().ref(`chat/${roomId}`).remove();
    admin.database().ref(`activeRooms/${roomId}`).remove();
    admin.database(roomsDb).ref(`lastEventIds/${roomId}`).remove();
    admin.database(roomsPublicDb).ref(`roomsPubInf/${roomId}`).remove();
    admin.database(roomsPublicDb).ref(`roomsPubInfIds/${roomId}`).remove();
    admin.database(roomsPublicDb).ref(`roomsStatus/${roomId}/roomClosed`).remove();

    admin.database().ref(`rooms/${roomId}/players`).once('value', (snapshot) => {

      const players = snapshot.val() || {};

      if (players.player1 && players.player1.uid) {
        admin.database().ref(`users/${players.player1.uid}/activeRoom`).remove();
      }

      if (players.player2 && players.player2.uid) {
        admin.database().ref(`users/${players.player2.uid}/activeRoom`).remove();
      }

      if (players.player3 && players.player3.uid) {
        admin.database().ref(`users/${players.player3.uid}/activeRoom`).remove();
      }

      return resolve('removed');

    });
  } else {
    return resolve('not closed');
  }
}));

module.exports = onRoomClosed;
