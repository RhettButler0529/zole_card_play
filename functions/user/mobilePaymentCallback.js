const mobilePaymentCallback = (req, res) => {
  const cors = require('cors')({ origin: true });
  const { admin, userStatsDB } = require('../admin');

  cors(req, res, () => {
    const {
      uid,
      coins,
      tid,
    } = req.body.data;

    console.log(uid);
    console.log(coins);
    console.log(tid);

    if (uid) {
      admin.database().ref(`users/${uid}/bal`).once('value', (balSnapshot) => {
        const existingBal = balSnapshot.val() || 0;

        admin.database().ref(`users/${uid}/bal`)
          .transaction((bal) => {
            if ((bal && bal !== null) || bal === 0) {
              return (parseInt(bal, 10) + parseInt(coins, 10));
            }
            return null;
          });

        admin.database().ref(`userBalHistory/${uid}`).push({
          time: Date.now(),
          type: 'purchaseCallback',
          change: coins,
          old: existingBal,
          new: existingBal + parseInt(coins, 10),
        });

        admin.database(userStatsDB).ref(`userBalHistory/${uid}`).push({
          time: Date.now(),
          type: 'purchaseCallback',
          change: coins,
          old: existingBal,
          new: existingBal + parseInt(coins, 10),
        });

        admin.database().ref(`userAchievements/${uid}/storePurchase`).transaction(score => (score || 0) + 1);

        return res.status(200).send({ data: { status: 'success' } });
      }).catch((err) => {
        console.log(err);
        return res.status(200).send({ data: { error: err } });
      });
    } else {
      return res.status(200).send({ data: { error: 'no uid' } });
    }
  });
};

module.exports = mobilePaymentCallback;
