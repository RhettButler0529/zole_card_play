const spinBonusWheel = (req, res) => {
  const cors = require('cors')({ origin: true });
  const { admin } = require('../admin');
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
            const { nxtSpin, bal } = userData;

            if (!nxtSpin || nxtSpin < Date.now()) {
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

              admin.database().ref(`users/${decoded.uid}/bal`)
                .transaction(bal2 => (parseInt(bal2, 10) || 0) + parseInt(spinResult, 10));

              admin.database().ref(`users/${decoded.uid}`).update({
                nxtSpin: Date.now() + (24 * 60 * 60 * 1000),
              });

              admin.database().ref(`userAchievements/${decoded.uid}/bonusSpins`).transaction(score => (score || 0) + 1);

              admin.database().ref(`userBalHistory/${decoded.uid}`).push({
                time: Date.now(),
                type: 'dailyBonus',
                change: spinResult,
                old: bal,
                new: parseInt(bal, 10) + spinResult,
              });

              admin.database().ref(`dailyLeaderboardPoints/${decoded.uid}/tP`)
                .transaction(tP => (tP || 0));

              admin.database().ref(`weekLeaderboardPoints/${decoded.uid}/tP`)
                .transaction(tP => (tP || 0));

              admin.database().ref(`monthLeaderboardPoints/${decoded.uid}/tP`)
                .transaction(tP => (tP || 0));

              admin.database().ref(`yearLeaderboardPoints/${decoded.uid}/tP`)
                .transaction(tP => (tP || 0));

              return res.status(200).send({ data: { error: false, spinResult } });
            }
            return res.status(200).send({ data: { error: true, message: 'Cannot spin wheel' } });
          }
          return res.status(200).send({ data: { error: true, message: 'Cannot spin wheel' } });
        }).catch(err => (res.status(200).send({ data: { error: true, message: err } })));
      })
      .catch(() => {
        res.status(200).send({ data: { error: true, message: 'Error spinig wheel' } });
      });
  });
};

module.exports = spinBonusWheel;
