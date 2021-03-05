// const cors = require('cors')({ origin: true });

// const { admin } = require('../admin');

const deleteUser = (req, res) => {
  const cors = require('cors')({ origin: true });
  const { admin } = require('../admin');

  cors(req, res, () => {
    const {
      uid,
    } = req.body.data;

    const tokenId = req.get('Authorization').split('Bearer ')[1];

    admin.auth().verifyIdToken(tokenId)
      .then((decoded) => {
        if (!decoded.uid) {
          return res.status(200).send({ data: 'no auth token' });
        }

        admin.database().ref(`users/${decoded.uid}`).once('value', (userSnapshot) => {
          const userData = userSnapshot.val() || {};

          if (userData && userData.role && userData.role === 'admin') {
            return admin.auth().deleteUser(uid)
              .then(() => admin.database().ref(`users/${uid}/userIndex`).once('value', (userToDeleteSnapshot) => {
                const userToDeleteIndex = userToDeleteSnapshot.val() || {};

                //  console.log('userToDeleteIndex');
                //  console.log(userToDeleteIndex);

                return admin.database().ref('statistics/userCount').once('value', (userCountSnapshot) => {
                  const userCount = userCountSnapshot.val() || {};

                  //  console.log('userCount');
                  //  console.log(userCount);

                  return admin.database().ref('users').orderByChild('userIndex').equalTo(userCount)
                    .once('value', (newestUserSnapshot) => {
                      const newestUser = newestUserSnapshot.val() || {};

                      //    console.log('newestUser');
                      //    console.log(newestUser);
                      let newestUserUid = '';
                      Object.keys(newestUser).map((key, index) => {
                        if (index === 0) {
                          newestUserUid = newestUser[key].uid;
                        }
                      });

                      //  console.log('newestUserUid');
                      //    console.log(newestUserUid);

                      if (newestUserUid) {
                        admin.database().ref(`users/${newestUserUid}`).update({
                          userIndex: userToDeleteIndex,
                        });

                        //  admin.database().ref(`statistics`).update({
                        //    userCount: userToDeleteIndex,
                        //  });

                        admin.database().ref('statistics/userCount')
                          .transaction(count => (count - 1));
                      }

                      admin.database().ref(`users/${uid}`).remove().then(() => {
                        admin.database().ref(`leaderboard/${uid}`).remove();
                        admin.database().ref(`bans/${uid}`).remove();
                        res.status(200).send({ data: { status: 'success' } });
                      });
                    });
                });
              }))
              .catch((error) => {
              //  console.log('Error deleting owner:', error);
                res.status(200).send({ data: { status: 'error', error } });
              });
          }
          res.status(200).send({ data: { status: 'error', error: 'wrong auth' } });
          return null;
        }).catch((err) => {
          res.status(200).send({ data: { status: 'error', error: err } });
        });
        return null;
      })
      .catch((err) => {
        res.status(200).send({ data: { status: 'error', error: err } });
      });
  });
};

module.exports = deleteUser;
