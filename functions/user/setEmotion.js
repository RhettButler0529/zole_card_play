const setEmotion = (req, res) => {
  const cors = require('cors')({ origin: true });
  const { admin, roomsDb } = require('../admin');
  cors(req, res, () => {
    const {
      emotion,
      roomId,
    } = req.body.data;

    const tokenId = req.get('Authorization').split('Bearer ')[1];

    admin.auth().verifyIdToken(tokenId)
      .then((decoded) => {
        if (!decoded.uid) {
          return res.status(200).send({ data: 'no auth token' });
        }

        admin.database(roomsDb).ref(`rooms/${roomId}/playersList/playerList/${decoded.uid}`)
          .once('value', (playerSnapshot) => {
            const playerPos = playerSnapshot.val() || null;

            if (playerPos) {
            //  admin.database().ref(`rooms/${roomId}/playersList/${playerPos}`).update({
            //    emotion,
            //  });

              admin.database(roomsDb).ref(`rooms/${roomId}/playersList/${playerPos}`).update({
                emotion,
              });

              return res.status(200).send({ data: { status: 'success' } });
            }

            return res.status(200).send({ data: { status: 'error', message: 'no data' } });
          });

      /*  admin.database().ref(`users/${decoded.uid}/joinedRooms`)
          .once('value', (joinedRoomsSnapshot) => {
            const joinedRooms = joinedRoomsSnapshot.val() || {};

            if (joinedRooms) {
              Object.keys(joinedRooms).map((key) => {
                admin.database().ref(`rooms/${key}/playersList/playerList/${decoded.uid}`)
                  .once('value', (positionSnapshot) => {
                    const position = positionSnapshot.val() || null;
                    if (position && (position === 'player1' || position === 'player2' || position === 'player3')) {
                      admin.database().ref(`rooms/${key}/playersList/${position}`).update({
                        emotion,
                      });
                    }
                  });
                return null;
              });

              return res.status(200).send({ data: { status: 'success' } });
            }
            return res.status(200).send({ data: { status: 'error', message: 'no data' } });
          }); */
      })
      .catch(err => res.status(200).send({ data: { status: 'error', message: err } }));
  });
};

module.exports = setEmotion;
