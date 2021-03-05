const draugiemPaymentCallback = (req, res) => {
  const cors = require('cors')({ origin: true });

  const { admin, userStatsDB } = require('../admin');

  // const base64url = require('b64url');
  // const crypto = require('crypto');

  // const request = require('request');

  //  const secret = '172b29fdc4a5b8f5a3088c6daae0f24e';

  // const appKey = '61ee303f304374a30309696a27719224';

  cors(req, res, () => {
    const {
      id, status,
    } = req.query;

    if (id) {
      admin.database().ref(`initiatedPayments/${id}`).once('value', (snapshot) => {
        const initPaymentData = snapshot.val() || {};

        if (initPaymentData && (status === 'ok' || status === 'OK')) {
          admin.database().ref(`completedPayments/${id}`).once('value', (snapshot2) => {
            const completedPaymentData = snapshot2.val() || {};

            if (completedPaymentData && completedPaymentData !== {}
              && completedPaymentData.status && completedPaymentData.status === 'completed') {
              console.log('payment already completed');

              return res.status(200).send({ status: 'OK' });
            }

            admin.database().ref(`initiatedPayments/${id}/status`).transaction((initStatus) => {
              if (initStatus && initStatus !== 'initiated') {
                console.log('already resoved');
                return; // Abort the transaction.
              }
              return 'completed';
            })
              .then((result) => {
                if (!result.committed) {
                  console.log('not commited');
                  return res.status(200).send('OK');
                }

                admin.database().ref(`initiatedPayments/${id}`).update({
                  status: 'completed',
                });

                admin.database().ref(`completedPayments/${id}`).update({
                  request_id: id,
                  userUid: initPaymentData.userUid,
                  userName: initPaymentData.userName || '',
                  productNr: initPaymentData.productNr,
                  productLink: initPaymentData.productLink,
                  dateInitiated: initPaymentData.dateInitiated,
                  payment_id: id,
                  status,
                });

                if (initPaymentData.productNr) {
                  let amount;
                  if (initPaymentData.productNr === 1) {
                    amount = 250;
                  } else if (initPaymentData.productNr === 2) {
                    amount = 500;
                  } else if (initPaymentData.productNr === 3) {
                    amount = 1500;
                  } else if (initPaymentData.productNr === 4) {
                    amount = 4000;
                  } else if (initPaymentData.productNr === 5) {
                    amount = 15000;
                  }

                  admin.database().ref(`users/${initPaymentData.userUid}/bal`).once('value', (balSnapshot) => {
                    const existingBal = balSnapshot.val() || 0;

                    admin.database().ref(`users/${initPaymentData.userUid}/bal`)
                      .transaction((bal) => {
                        if ((bal && bal !== null) || bal === 0) {
                          return (parseInt(bal, 10) + amount);
                        }
                        return null;
                      });

                    admin.database().ref(`userBalHistory/${initPaymentData.userUid}`).push({
                      time: Date.now(),
                      type: 'purchaseCallback',
                      change: amount,
                      old: existingBal,
                      new: existingBal + amount,
                    });

                    admin.database(userStatsDB).ref(`userBalHistory/${initPaymentData.userUid}`).push({
                      time: Date.now(),
                      type: 'purchaseCallback',
                      change: amount,
                      old: existingBal,
                      new: existingBal + amount,
                    });

                    admin.database().ref(`userAchievements/${initPaymentData.userUid}/storePurchase`).transaction(score => (score || 0) + 1);

                    return res.status(200).send('OK');
                  }).catch((err) => {
                    console.log(err);
                    return res.status(204).send({ data: { error: err } });
                  });
                } else {
                  return res.status(200).send('OK');
                }
              });
          }).catch((err) => {
            console.log(err);
            return res.status(204).send({ data: { error: err } });
          });
        } else {
          return res.status(204).send({ data: { error: 'payment not complete' } });
        }
      }).catch((err) => {
        console.log(err);
        return res.status(204).send({ data: { error: err } });
      });
    } else {
      return res.status(204).send({ data: { error: 'no request_id' } });
    }
  });
};

module.exports = draugiemPaymentCallback;
