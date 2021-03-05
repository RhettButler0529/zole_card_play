// const { admin } = require('../admin');

// const dealCards = require('./dealCards');

const onRoomPlayersUpdate = (change, context) => new Promise(((resolve, reject) => {
  const { admin, roomsPublicDb, roomsDb } = require('../admin');
  const dealCards = require('./dealCards');
  const beforeData = change.before.val();
  const afterData = change.after.val();

  if (afterData && afterData.player1 && afterData.player2 && afterData.player3
    && afterData.player1.uid && afterData.player2.uid && afterData.player3.uid
    && (!beforeData.player1 || !beforeData.player2 || !beforeData.player3
    || !beforeData.player1.uid || !beforeData.player2.uid || !beforeData.player3.uid)) {
    dealCards(context.params.roomId, null).then((res) => {
    //  admin.database().ref(`rooms/${context.params.roomId}/globalParams`).update({
    //    gameStartTime: Date.now() + 1000 * 1,
    //  });

      admin.database(roomsDb).ref(`rooms/${context.params.roomId}/globalParams`).update({
        gameStartTime: Date.now() + 1000 * 1,
      });

    //  admin.database().ref(`roomsPubInf/${context.params.roomId}`).update({
    //    filled: true,
    //  });

    //  admin.database().ref(`roomsPubInfIds/${context.params.roomId}`).update({
    //    open: false,
    //  });

      admin.database(roomsPublicDb).ref(`roomsPubInf/${context.params.roomId}`).update({
        filled: true,
      });

      admin.database(roomsPublicDb).ref(`roomsPubInfIds/${context.params.roomId}`).update({
        open: false,
      });

      admin.database(roomsDb).ref(`rooms/${context.params.roomId}/globalParams/fastGame`)
        .once('value').then((fastGameSnapshot) => {
          const fastGame = fastGameSnapshot.val() || false;

          admin.database(roomsDb).ref(`gameSettings/${fastGame ? 'fastSpeed' : 'normalSpeed'}`)
            .once('value').then((speedSnapshot) => {
              const speed = speedSnapshot.val() || 15;

            //  admin.database().ref(`rooms/${context.params.roomId}`).update({
            //    nextTimestamp: (Date.now() + 1000 * speed) + 500,
            //  });

              admin.database(roomsDb).ref(`rooms/${context.params.roomId}/nextTimestamp`).set((Date.now() + 1000 * speed) + 500);

            //  admin.database().ref(`rooms/${context.params.roomId}/nextTimestamp`).set((Date.now() + 1000 * speed) + 500);
            });
        });

      return resolve();
    }).catch(err => reject(err));
  } else {
    return reject();
  }
}));

module.exports = onRoomPlayersUpdate;
