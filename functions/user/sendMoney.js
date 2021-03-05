// const cors = require('cors')({ origin: true });

// const { admin } = require('../admin');

const sendMoney = (req, res) => {
  const cors = require('cors')({ origin: true });

  const { admin, userStatsDB } = require('../admin');

  cors(req, res, () => {
    const {
      friendUid, amount,
    } = req.body.data;

    const tokenId = req.get('Authorization').split('Bearer ')[1];

    admin.auth().verifyIdToken(tokenId)
      .then((decoded) => {
        if (!decoded.uid) {
          return res.status(200).send({ data: 'no auth token' });
        }

        if (amount && parseInt(amount, 10) && amount > 0) {
        //  console.log('amount valid');
          admin.database().ref(`users/${decoded.uid}/bal`).once('value', (userBalSnapshot) => {
            const userBal = userBalSnapshot.val() || null;

            if (userBal < amount) {
              return res.status(200).send({ data: { status: 'error', error: 'not enough balance in account' } });
            }
            admin.database().ref(`users/${friendUid}`).once('value', (friendSnapshot) => {
              const friendData = friendSnapshot.val() || {};

              if (friendData && friendData.uid && friendData.uid === friendUid) {
                admin.database().ref(`users/${decoded.uid}`).update({
                  bal: parseInt(userBal, 10) - parseInt(amount, 10),
                });

                admin.database().ref(`userBalHistory/${decoded.uid}`).push({
                  time: Date.now(),
                  type: 'friendSent',
                  change: -amount,
                  old: userBal,
                  new: parseInt(userBal, 10) - parseInt(amount, 10),
                });

                admin.database(userStatsDB).ref(`userBalHistory/${decoded.uid}`).push({
                  time: Date.now(),
                  type: 'friendSent',
                  change: -amount,
                  old: userBal,
                  new: parseInt(userBal, 10) - parseInt(amount, 10),
                });

                //  admin.database().ref(`users/${friendData.uid}`).update({
                //    bal: parseInt(friendData.bal, 10) + parseInt(amount, 10),
                //  });

                admin.database().ref(`users/${friendData.uid}/bal`)
                  .transaction(bal => (parseInt(bal, 10) + parseInt(amount, 10)));

                admin.database().ref(`userBalHistory/${friendData.uid}`).push({
                  time: Date.now(),
                  type: 'friendReceived',
                  change: +amount,
                  old: friendData.bal,
                  new: parseInt(friendData.bal, 10) + parseInt(amount, 10),
                });

                admin.database(userStatsDB).ref(`userBalHistory/${friendData.uid}`).push({
                  time: Date.now(),
                  type: 'friendReceived',
                  change: +amount,
                  old: friendData.bal,
                  new: parseInt(friendData.bal, 10) + parseInt(amount, 10),
                });

                return res.status(200).send({ data: { status: 'success' } });
              }
              return res.status(200).send({ data: { status: 'error', error: 'error finding friend account' } });
            }).catch(err => res.status(200).send({ data: { status: 'error', error: err } }));
          }).catch(err => res.status(200).send({ data: { status: 'error', error: err } }));
        } else {
          return res.status(200).send({ data: { status: 'error', error: 'no amount or amount not a number' } });
        }
      })
      .catch((err) => {
        res.status(200).send({ data: { status: 'error', error: err } });
      });
  });
};

module.exports = sendMoney;
