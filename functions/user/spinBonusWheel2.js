const spinBonusWheel = (req, res) => {
  const cors = require('cors')({ origin: true });
  const { admin, userStatsDB } = require('../admin');
  cors(req, res, () => {
    if (!req || !req.get('Authorization')) {
      return res.status(200).send({ data: 'Error (no auth)' });
    }
    const tokenId = req.get('Authorization').split('Bearer ')[1];

    admin.auth().verifyIdToken(tokenId)
      .then((decoded) => {
        if (!decoded.uid) {
          return res.status(200).send({ data: 'Error (no auth token)' });
        }

        admin.database().ref(`users/${decoded.uid}`).once('value', (snapshot) => {
          const userData = snapshot.val() || null;

          if (userData) {
            const { lastSpin, bal } = userData;

            let lastDate;
            let nowDate;

            if (lastSpin) {
              const l = new Date(lastSpin).setHours(new Date(lastSpin).getHours() + 3);
              const n = new Date().setHours(new Date().getHours() + 3);

            //  console.log(l);
            //  console.log(n);

              lastDate = new Date(l).setHours(0, 0, 0, 0);
              nowDate = new Date(n).setHours(0, 0, 0, 0);
            }

            if (!lastSpin || lastDate !== nowDate) {
              const result = Math.floor(Math.random() * 5);

              let spinResult;
              switch (result) {
                case 0:
                  spinResult = 10;
                  break;
                case 1:
                  spinResult = 20;
                  break;
                case 2:
                  spinResult = 25;
                  break;
                case 3:
                  spinResult = 50;
                  break;
                case 4:
                  spinResult = 100;
                  break;
                default:
                  spinResult = 20;
              }

              admin.database().ref(`spinResults/${decoded.uid}`).transaction((spinRes) => {
                if (spinRes) {
                //  console.log('already has spinresult');
                  return; // Abort the transaction.
                }
                return spinResult;
              })
                .then((results) => {
                  if (!results.committed) {
                    return res.status(200).send('Failed to spin');
                  }

                  admin.database().ref(`users/${decoded.uid}`).update({
                    lastSpin: Date.now(),
                  });

                  admin.database().ref(`userAchievements/${decoded.uid}/bonusSpins`).transaction(score => (score || 0) + 1);

                  admin.database().ref(`userBalHistory/${decoded.uid}`).push({
                    time: Date.now(),
                    type: 'dailyBonus',
                    change: spinResult,
                    old: bal,
                    new: parseInt(bal, 10) + spinResult,
                  });

                  admin.database(userStatsDB).ref(`userBalHistory/${decoded.uid}`).push({
                    time: Date.now(),
                    type: 'dailyBonus',
                    change: spinResult,
                    old: bal,
                    new: parseInt(bal, 10) + spinResult,
                  });

                  //  admin.database().ref(`dailyLeaderboardPoints/${decoded.uid}/tP`)
                  //    .transaction(tP => (tP || 0));

                  //  admin.database().ref(`weekLeaderboardPoints/${decoded.uid}/tP`)
                  //    .transaction(tP => (tP || 0));

                  //  admin.database().ref(`monthLeaderboardPoints/${decoded.uid}/tP`)
                  //    .transaction(tP => (tP || 0));

                  //  admin.database().ref(`yearLeaderboardPoints/${decoded.uid}/tP`)
                  //    .transaction(tP => (tP || 0));

                  return res.status(200).send({ data: { error: false, spinResult } });
                });
            } else {
              return res.status(200).send({ data: { error: true, message: 'Cannot spin wheel' } });
            }
          } else {
            return res.status(200).send({ data: { error: true, message: 'Cannot spin wheel' } });
          }
        }).catch(err => (res.status(200).send({ data: { error: true, message: err } })));
      })
      .catch(() => {
        res.status(200).send({ data: { error: true, message: 'Error spinig wheel' } });
      });
  });
};

module.exports = spinBonusWheel;
