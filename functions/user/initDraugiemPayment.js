const initDraugiemPayment = (req, res) => {
  const cors = require('cors')({ origin: true });

  const { admin } = require('../admin');
  const axios = require('axios');

  const appKey = '61ee303f304374a30309696a27719224';

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

        //  const productLink = `https://spelezoli.lv/products/${product}.html`;

        let price;
        let serviceId;

        if (product === 1) {
          price = 85;
          serviceId = '3815';
        } else if (product === 2) {
          price = 141;
          serviceId = '3816';
        } else if (product === 3) {
          price = 285;
          serviceId = '3817';
        } else if (product === 4) {
          price = 427;
          serviceId = '3818';
        } else if (product === 5) {
          price = 1000;
          serviceId = '3819';
        }

        const promise1 = admin.database().ref(`users/${decoded.uid}`).once('value');
        const promise2 = admin.database().ref(`drApiToUid/${decoded.uid}`).once('value');

        Promise.all([promise1, promise2]).then((results) => {
          let user;
          let userApiKey;

          results.forEach((result, index) => {
            if (index === 0) {
              user = result.val() || {};
            } else if (index === 1) {
              userApiKey = result.val() || {};
            }
          });

          //  console.log('userApiKey');
          //  console.log(userApiKey);

          //  console.log(serviceId);
          //  console.log(price);

          if (userApiKey && serviceId && price) {
            const url = `https://api.draugiem.lv/json/?app=${appKey}&apikey=${userApiKey}&service=${serviceId}&price=${price}&action=transactions/create`;

            axios.get(url)
              .then((res2) => {
              //  console.log(res2.data);
                if (res2 && res2.data && res2.data.transaction) {
                  const { id, link } = res2.data.transaction;

                  //    console.log(`product link is ${link}`);

                  //    console.log(id);
                  //    console.log(link);

                  if (id && link) {
                    admin.database().ref(`initiatedPayments/${id}`).update({
                      id,
                      provider: 'draugiem',
                      userName: user.name || '',
                      userUid: decoded.uid,
                      productNr: product,
                      productLink: link,
                      dateInitiated: Date.now(),
                      status: 'initiated',
                    }).then(() => {
                      res.status(200).send({ data: { status: 'success', id, product: link } });
                    });
                  } else {
                    res.status(200).send({ data: { status: 'error', error: 'payment error' } });
                  }
                } else {
                  res.status(200).send({ data: { status: 'error', error: 'payment error' } });
                }
              });
          } else {
            res.status(200).send({ data: { status: 'error', error: 'payment error' } });
          }
        });
      })
      .catch((err) => {
        res.status(200).send({ data: { status: 'error', error: err } });
      });
  });
};

module.exports = initDraugiemPayment;
