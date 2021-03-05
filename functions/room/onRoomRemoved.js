const onRoomRemoved = (snapshot, context) => new Promise(((resolve, reject) => {
  const { admin, roomsPublicDb } = require('../admin');
  const data = snapshot.val() || null;

  const validEventId = context.eventId.replace('/', '')

  admin.database().ref(`roomRemovedEventIds/${validEventId}`)
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

      admin.database().ref('roomsCount')
        .transaction(roomsCount => (parseInt(roomsCount, 10) || 0) - 1);

      admin.database(roomsPublicDb).ref(`roomsStatus/${roomId}/roomClosed`).remove();

      return resolve();
    }).catch(err => {
      console.log(err);
      return resolve();
    });
}));

module.exports = onRoomRemoved;
