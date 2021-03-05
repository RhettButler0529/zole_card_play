const initFBPayment = (req, res) => {
  const cors = require('cors')({ origin: true });

  const { admin } = require('../admin');

  const uuidv1 = require('uuid/v1');

  cors(req, res, () => {
    const {
      product,
    } = req.body.data;

    //  console.log(product);

    const tokenId = req.get('Authorization').split('Bearer ')[1];

    admin.auth().verifyIdToken(tokenId)
      .then((decoded) => {
        if (!decoded.uid) {
          return res.status(200).send({ data: 'no auth token' });
        }

        //  console.log(product);
        //  console.log(decoded.uid);

        const token = uuidv1();

        //  console.log(token);

        const productLink = `https://spelezoli.lv/products/${product}.html`;

        admin.database().ref(`users/${decoded.uid}`).once('value', (userSnapshot) => {
          const user = userSnapshot.val() || {};

          admin.database().ref(`initiatedPayments/${token}`).update({
            token,
            userName: user.name || '',
            userUid: decoded.uid,
            productNr: product,
            productLink,
            dateInitiated: Date.now(),
            status: 'initiated',
          }).then(() => {
            res.status(200).send({ data: { status: 'success', token, product: productLink } });
          });
        });
      })
      .catch((err) => {
        res.status(200).send({ data: { status: 'error', error: err } });
      });
  });
};

module.exports = initFBPayment;
