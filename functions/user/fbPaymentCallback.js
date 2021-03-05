const fbPaymentCallback = (req, res) => {
  const cors = require('cors')({ origin: true });

  const { admin, userStatsDB } = require('../admin');

  const base64url = require('b64url');
  const crypto = require('crypto');

  const request = require('request');

  const secret = '172b29fdc4a5b8f5a3088c6daae0f24e';

  cors(req, res, () => {
    if (req.body.entry) {
      request.get(`https://graph.facebook.com/${req.body.entry[0].id}?access_token=570004516363887|${secret}&fields=id,user,application,actions,refundable_amount,items,created_time,request_id`, (error2, response2, body2) => {
        const bodyData = JSON.parse(body2);

        if (bodyData.request_id) {
          admin.database().ref(`initiatedPayments/${bodyData.request_id}`).once('value', (snapshot) => {
            const initPaymentData = snapshot.val() || {};

            if (initPaymentData && bodyData.actions[0].status === 'completed') {

              admin.database().ref(`completedPayments/${bodyData.request_id}`).once('value', (snapshot2) => {
                const completedPaymentData = snapshot2.val() || {};

                if (completedPaymentData && completedPaymentData !== {}
                  && completedPaymentData.status && completedPaymentData.status === 'completed') {

                  return res.status(200).send({ error: 'payment already completed' });
                }

                admin.database().ref(`initiatedPayments/${bodyData.request_id}/status`).transaction((status) => {
                  if (status && status !== 'initiated') {
                    console.log('already resoved');
                    return; // Abort the transaction.
                  }
                  return bodyData.actions[0].status;
                })
                  .then((result) => {
                    if (!result.committed) {
                      console.log('not commited');
                      return res.status(200).send({ data: { status: 'already updated' } });
                    }

                    admin.database().ref(`initiatedPayments/${bodyData.request_id}`).update({
                      status: bodyData.actions[0].status,
                    });

                    admin.database().ref(`completedPayments/${bodyData.request_id}`).update({
                      request_id: bodyData.request_id,
                      userUid: initPaymentData.userUid,
                      userName: initPaymentData.userName || '',
                      productNr: initPaymentData.productNr,
                      productLink: initPaymentData.productLink,
                      dateInitiated: initPaymentData.dateInitiated,
                      payment_id: bodyData.id,
                      status: bodyData.actions[0].status,
                      amount: bodyData.actions[0].amount,
                      currency: bodyData.actions[0].currency,
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
                            console.log(bal);
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

                        return res.status(200).send({ data: bodyData.actions[0] });
                      }).catch((err) => {
                        console.log(err);
                        return res.status(204).send({ data: { error: err } });
                      });
                    } else {
                      return res.status(204).send({ data: { error: 'initPaymentData.productNr error' } });
                    }
                  });
              }).catch((err) => {
                console.log(err);
                return res.status(204).send({ data: { error: err } });
              });
            } else if (initPaymentData && bodyData.actions[0].status === 'failed') {
              admin.database().ref(`failedPayments/${bodyData.request_id}`).once('value', (snapshot2) => {
                const failedPaymentData = snapshot2.val() || {};

                if (failedPaymentData && failedPaymentData !== {}
                  && failedPaymentData.status && failedPaymentData.status !== 'failed') {

                  return res.status(200).send({ error: 'payment already failed' });
                }

                admin.database().ref(`initiatedPayments/${bodyData.request_id}`).update({
                  status: bodyData.actions[0].status,
                });

                admin.database().ref(`failedPayments/${bodyData.request_id}`).update({
                  request_id: bodyData.request_id,
                  userUid: initPaymentData.userUid,
                  userName: initPaymentData.userName || '',
                  productNr: initPaymentData.productNr,
                  productLink: initPaymentData.productLink,
                  dateInitiated: initPaymentData.dateInitiated,
                  payment_id: bodyData.id,
                  status: bodyData.actions[0].status,
                  amount: bodyData.actions[0].amount,
                  currency: bodyData.actions[0].currency,
                });

                return res.status(204).send({ data: { error: 'payment failed' } });
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
    } else if (req.body && req.body.data) {
      //   *****************USER RETURNED********************

      const signedRequest = req.body.data.signed_request;

      if (signedRequest) {
        const encodedData = signedRequest.split('.', 2);

        const sig = encodedData[0];
        const json = base64url.decode(encodedData[1]);

        const data = JSON.parse(json); // ERROR Occurs Here!

        // check algorithm - not relevant to error
        if (!data.algorithm || data.algorithm.toUpperCase() !== 'HMAC-SHA256') {
          console.error('Unknown algorithm. Expected HMAC-SHA256');
          return res.status(200).send({ data: { error: 'Unknown algorithm' } });
        }

        // check sig - not relevant to error
        const expectedSig = crypto.createHmac('sha256', secret).update(encodedData[1]).digest('base64').replace(/\+/g, '-')
          .replace(/\//g, '_')
          .replace('=', '');
        if (sig !== expectedSig) {
          console.error('Bad signed JSON Signature!');
          return res.status(200).send({ data: { error: 'Bad signed JSON Signature!' } });
        }

        if (data.request_id) {
          admin.database().ref(`initiatedPayments/${data.request_id}`).once('value', (snapshot) => {
            const initPaymentData = snapshot.val() || {};

            if (initPaymentData && data.status === 'completed') {
              admin.database().ref(`completedPayments/${data.request_id}`).once('value', (snapshot2) => {
                const completedPaymentData = snapshot2.val() || {};

                if (completedPaymentData && completedPaymentData !== {}
                  && completedPaymentData.status && completedPaymentData.status === 'completed') {

                  return res.status(200).send({ error: 'payment already completed' });
                }

                admin.database().ref(`initiatedPayments/${data.request_id}/status`).transaction((status) => {
                  if (status && status !== 'initiated') {
                    console.log('already resoved');
                    return; // Abort the transaction.
                  }
                  return data.status;
                })
                  .then((result) => {
                    if (!result.committed) {
                      console.log('not commited');
                      return res.status(200).send({ data: { status: 'already updated' } });
                    }

                    admin.database().ref(`initiatedPayments/${data.request_id}`).update({
                      status: data.status,
                    });

                    admin.database().ref(`completedPayments/${data.request_id}`).update({
                      request_id: data.request_id,
                      userUid: initPaymentData.userUid,
                      userName: initPaymentData.userName || '',
                      productNr: initPaymentData.productNr,
                      productLink: initPaymentData.productLink,
                      dateInitiated: initPaymentData.dateInitiated,
                      issued_at: data.issued_at,
                      payment_id: data.payment_id,
                      status: data.status,
                      amount: data.amount,
                      currency: data.currency,
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
                            console.log(bal);
                            if ((bal && bal !== null) || bal === 0) {
                              return (parseInt(bal, 10) + amount);
                            }
                            return null;
                          });

                        admin.database().ref(`userBalHistory/${initPaymentData.userUid}`).push({
                          time: Date.now(),
                          type: 'purchase',
                          change: amount,
                          old: existingBal,
                          new: existingBal + amount,
                        });

                        admin.database(userStatsDB).ref(`userBalHistory/${initPaymentData.userUid}`).push({
                          time: Date.now(),
                          type: 'purchase',
                          change: amount,
                          old: existingBal,
                          new: existingBal + amount,
                        });

                        admin.database().ref(`userAchievements/${initPaymentData.userUid}/storePurchase`).transaction(score => (score || 0) + 1);

                        return res.status(200).send({ data });
                      }).catch((err) => {
                        console.log(err);
                        return res.status(204).send({ data: { error: err } });
                      });
                    } else {
                      return res.status(204).send({ data: { error: 'initPaymentData.productNr error' } });
                    }
                  });
              }).catch((err) => {
                console.log(err);
                return res.status(204).send({ data: { error: err } });
              });
            } else if (initPaymentData && data.status === 'failed') {
              admin.database().ref(`failedPayments/${data.request_id}`).once('value', (snapshot2) => {
                const failedPaymentData = snapshot2.val() || {};

                if (failedPaymentData && failedPaymentData !== {}
                  && failedPaymentData.status && failedPaymentData.status !== 'failed') {

                  return res.status(200).send({ error: 'payment already failed' });
                }

                admin.database().ref(`initiatedPayments/${data.request_id}`).update({
                  status: data.status,
                });

                admin.database().ref(`failedPayments/${data.request_id}`).update({
                  request_id: data.request_id,
                  userUid: initPaymentData.userUid,
                  userName: initPaymentData.userName || '',
                  productNr: initPaymentData.productNr,
                  productLink: initPaymentData.productLink,
                  dateInitiated: initPaymentData.dateInitiated,
                  issued_at: data.issued_at,
                  payment_id: data.payment_id,
                  status: data.status,
                  amount: data.amount,
                  currency: data.currency,
                });

                return res.status(204).send({ data: { error: 'payment failed' } });
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
      } else {
        return res.status(204).send({ data: { error: 'no signed_request' } });
      }
    } else if (req.query) {
      if (req.query['hub.verify_token'] === 676148365513897) {
        return res.status(200).send(req.query['hub.challenge']);
      }
      return res.status(204).send('no access');
    } else {
      return res.status(204).send({ data: { error: 'error' } });
    }
  });
};

module.exports = fbPaymentCallback;
