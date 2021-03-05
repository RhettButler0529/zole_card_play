
const closeLevelNotification = (req, res) => {
  const cors = require('cors')({ origin: true });
  const { admin } = require('../admin');

  cors(req, res, () => {
    const tokenId = req.get('Authorization').split('Bearer ')[1];

    admin.auth().verifyIdToken(tokenId)
      .then((decoded) => {
        if (!decoded.uid) {
          return res.status(200).send({ data: 'no auth token' });
        }

        admin.database().ref(`users/${decoded.uid}`).update({
          lvlUpNotification: false,
        });

        return res.status(200).send({ data: 'success' });
      }).catch(err => res.status(200).send({ data: { status: 'error', error: err } }));
  });
};

module.exports = closeLevelNotification;
