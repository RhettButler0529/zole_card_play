const stripePaymentCallback = (req, res, stripe, endpointSecret) => {

  const cors = require('cors')({ origin: true });
  const { admin, userStatsDB } = require('../admin');

  cors(req, res, () => {
    const sig = req.headers['stripe-signature'];

    let event;

    try {
      event = stripe.webhooks.constructEvent(req.rawBody, sig, endpointSecret);
    } catch (err) {
      return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    if (event.type === 'checkout.session.completed') {
      const session = event.data.object;
      const id = session.id;

      if (id) {
        admin.database().ref(`initiatedPayments/stripe-${id}`).once('value', (snapshot) => {
          const initPaymentData = snapshot.val() || {};

          admin.database().ref(`completedPayments/stripe-${id}`).once('value', (snapshot2) => {
            const completedPaymentData = snapshot2.val() || {};

            if (completedPaymentData && completedPaymentData !== {}
              && completedPaymentData.status && completedPaymentData.status === 'completed') {
              return res.json({ received: true });
            }

            admin.database().ref(`initiatedPayments/stripe-${id}/status`).transaction((initStatus) => {
              if (initStatus && initStatus !== 'initiated') {
                return;
              }
              return 'completed';
            })
              .then((result) => {
                if (!result.committed) {
                  return res.json({ received: true });
                }

                admin.database().ref(`initiatedPayments/stripe-${id}`).update({
                  status: 'completed',
                });

                admin.database().ref(`completedPayments/stripe-${id}`).update({
                  request_id: id,
                  userUid: initPaymentData.userUid,
                  userName: initPaymentData.userName || '',
                  productNr: initPaymentData.productNr,
                  productLink: initPaymentData.productLink,
                  dateInitiated: initPaymentData.dateInitiated,
                  paymentIntent: initPaymentData.paymentIntent,
                  payment_id: id,
                  status: 'completed',
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

                    return res.json({ received: true });
                  }).catch((err) => {
                    return res.status(400).send(`Webhook Error: ${err.message}`);
                  });
                } else {
                  return res.json({ received: true });
                }
              });
          }).catch((err) => {
            return res.status(400).send(`Webhook Error: ${err.message}`);
          });
        }).catch((err) => {
          return res.status(400).send(`Webhook Error: ${err.message}`);
        });
      } else {
        return res.status(400).send(`Webhook Error: no session id`);
      }
    } else {
      return res.json({ received: true });
    }
    
  });
};

module.exports = stripePaymentCallback;
