const disableTimer = (req, res) => {
  const cors = require('cors')({ origin: true });
  const { admin } = require('../admin');

  cors(req, res, () => {
    const {
      roomId,
    } = req.body.data;

    //  console.log('roomId');
    //  console.log(roomId);

    const tokenId = req.get('Authorization').split('Bearer ')[1];

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
            admin.database().ref(`rooms/${roomId}/globalParams/disableTimer`).once('value', (disabledSnapshot) => {
              const disabled = disabledSnapshot.val() || false;
              admin.database().ref(`rooms/${roomId}/globalParams`).update({
                disableTimer: !disabled,
              });

              return res.status(200).send({ data: { status: 'success' } });
            });
          }
          return res.status(200).send({ data: 'Auth Error' });
        })
          .catch((err) => {
            res.status(200).send({ data: { status: 'error', error: err } });
          });
      });
  });
};

module.exports = disableTimer;
