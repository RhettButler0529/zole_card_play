
const messageAll = (req, res) => {
  const cors = require('cors')({ origin: true });
  const { admin } = require('../admin');

  cors(req, res, () => {
    const {
      message,
    } = req.body.data;

    const tokenId = req.get('Authorization').split('Bearer ')[1];

    admin.auth().verifyIdToken(tokenId)
      .then((decoded) => {
        if (!decoded.uid) {
          return res.status(200).send({ data: 'Auth Error' });
        }


        admin.database().ref(`users/${decoded.uid}`).once('value', (userSnapshot) => {
          const user = userSnapshot.val() || {};

          if (user && user.uid && user.role === 'admin') {
            admin.database().ref('usersNames').once('value', (usersSnapshot) => {
              const users = usersSnapshot.val() || {};

              Object.keys(users).map((key) => {
                admin.database().ref(`supportChat/messages/${key}`).push({
                  message,
                  date: admin.database.ServerValue.TIMESTAMP,
                }).then(() => {
                  admin.database().ref(`supportChat/activeChats/${key}`).update({
                    responded: true,
                    lastResponse: admin.database.ServerValue.TIMESTAMP,
                    read: false,
                  });
                });

                return null;
              });


              return res.status(200).send({ data: { status: 'success' } });
            });
          } else {
            return res.status(200).send({ data: 'Auth Error' });
          }
        })
          .catch((err) => {
            res.status(200).send({ data: { status: 'error', error: err } });
          });
      });
  });
};

module.exports = messageAll;
