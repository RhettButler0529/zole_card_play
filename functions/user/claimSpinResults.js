const claimSpinResults = (req, res) => {
  const cors = require('cors')({ origin: true });
  const { admin } = require('../admin');
  cors(req, res, () => {
    if (req.get('Authorization')) {
      const tokenId = req.get('Authorization').split('Bearer ')[1];

      admin.auth().verifyIdToken(tokenId)
        .then((decoded) => {
          if (!decoded.uid) {
            return res.status(200).send({ data: 'Error updating user data (no auth token)' });
          }

          admin.database().ref(`spinResults/${decoded.uid}`).once('value', (snapshot) => {
            const spinResults = snapshot.val() || null;

            if (spinResults && !isNaN(spinResults)) {
              //  const { lastSpin, nxtSpin, bal } = userData;

              admin.database().ref(`users/${decoded.uid}/bal`)
                .transaction(bal2 => (parseInt(bal2, 10) || 0) + parseInt(spinResults, 10));

              admin.database().ref(`spinResults/${decoded.uid}`).remove();

              return res.status(200).send({ data: { error: false, message: 'claimed' } });
            }
            return res.status(200).send({ data: { error: true, message: 'No results' } });
          }).catch(err => (res.status(200).send({ data: { error: true, message: err } })));
        })
        .catch(() => {
          res.status(200).send({ data: { error: true, message: 'Error claiming' } });
        });
    } else {
      res.status(200).send({ data: { error: true, message: 'Error claiming' } });
    }
  });
};

module.exports = claimSpinResults;
