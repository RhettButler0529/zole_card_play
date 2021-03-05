const setNextDealCards = (req, res) => {
  const cors = require('cors')({ origin: true });
  const { admin, roomsDb } = require('../admin');

  cors(req, res, () => {
    const {
      cards, roomId,
    } = req.body.data;

    //  console.log('roomId');
    //  console.log(roomId);

    //  console.log(cards);

    const tokenId = req.get('Authorization').split('Bearer ')[1];

    if (!roomId || !cards || !cards.length) {
      return res.status(200).send({ data: 'Auth Error' });
    }

    admin.auth().verifyIdToken(tokenId)
      .then((decoded) => {
        if (!decoded.uid) {
          return res.status(200).send({ data: 'Auth Error' });
        }


        admin.database().ref(`users/${decoded.uid}/role`).once('value', (roleSnapshot) => {
          const role = roleSnapshot.val() || '';

          //  console.log('role');
          //  console.log(role);

          if (decoded.uid && (role === 'admin' || role === 'tester')) {
            let cardsValid = true;
            cards.map((card) => {
              if (Number.isNaN(card)) {
                cardsValid = false;
              }
            });

            if (cardsValid) {
              admin.database(roomsDb).ref(`rooms/${roomId}`).update({
                nextDealCards: cards,
              });
            }

            return res.status(200).send({ data: { status: 'success' } });
          }
          return res.status(200).send({ data: 'Auth Error' });
        })
          .catch((err) => {
            res.status(200).send({ data: { status: 'error', error: err } });
          });
      });
  });
};

module.exports = setNextDealCards;
