
const afterEmailRegistration = (req, res) => {
  const cors = require('cors')({ origin: true });
  const { admin } = require('../admin');

  cors(req, res, () => {
    const {
      uid, providerData, firstName, lastName,
    } = req.body.data;

    const tokenId = req.get('Authorization').split('Bearer ')[1];

    admin.auth().verifyIdToken(tokenId)
      .then((decoded) => {
        if (!decoded.uid) {
          return res.status(200).send({ data: 'Error updating user data (no auth token)' });
        }

        if (uid === decoded.uid) {
          admin.database().ref(`users/${uid}`)
            .once('value', (playerSnapshot) => {
              const playerData = playerSnapshot.val() || {};
              const { lvl, bal } = playerData;

              admin.database().ref(`users/${uid}`).update({
                uid: playerData.uid || decoded.uid,
                name: `${firstName} ${lastName}`,
                firstName,
                lastName,
                email: providerData.email,
                providerId: providerData.providerId,
                lvl: lvl || 1,
                bal: parseInt(bal, 10) || 500,
                gPlayed: playerData.gPlayed || 0,
                totalPnts: playerData.totalPnts || 0,
                gWon: playerData.gWon || 0,
                role: playerData.role || 'player',
                lastLogin: Date.now(),
                userIndex: '',
              }).then(() => {
              });

              admin.database().ref(`leaderboard/allTime/${uid}`).update({
                name: `${firstName} ${lastName}`,
                bal: parseInt(bal, 10) || 500,
                gPlayed: playerData.gPlayed || 0,
                totalPnts: playerData.totalPnts || 0,
              });

              admin.database().ref(`leaderboard/daily/${uid}`).update({
                name: `${firstName} ${lastName}`,
              });

              admin.database().ref(`leaderboard/week/${uid}`).update({
                name: `${firstName} ${lastName}`,
              });

              admin.database().ref(`leaderboard/month/${uid}`).update({
                name: `${firstName} ${lastName}`,
              });

              admin.database().ref(`leaderboard/year/${uid}`).update({
                name: `${firstName} ${lastName}`,
              });

              admin.database().ref(`leaderboardPoints/${uid}`).update({
              //  gPl: playerData.gPlayed || 0,
                tP: playerData.totalPnts || 0,
              });

              /*  admin.database().ref(`dailyLeaderboardPoints/${uid}`).update({
                gPl: playerData.gPlayed || 0,
                tP: playerData.totalPnts || 0,
              });

              admin.database().ref(`weekLeaderboardPoints/${uid}`).update({
                gPl: playerData.gPlayed || 0,
                tP: playerData.totalPnts || 0,
              });

              admin.database().ref(`monthLeaderboardPoints/${uid}`).update({
                gPl: playerData.gPlayed || 0,
                tP: playerData.totalPnts || 0,
              });

              admin.database().ref(`yearLeaderboardPoints/${uid}`).update({
                gPl: playerData.gPlayed || 0,
                tP: playerData.totalPnts || 0,
              }); */

              return res.status(200).send({
                data: {
                  uid: playerData.uid || decoded.uid,
                  name: `${firstName} ${lastName}`,
                  firstName,
                  lastName,
                  email: providerData.email,
                  providerId: providerData.providerId,
                  lvl: lvl || 1,
                  bal: parseInt(bal, 10) || 500,
                  gPlayed: playerData.gPlayed || 0,
                  totalPnts: playerData.totalPnts || 0,
                  gWon: playerData.gWon || 0,
                  role: playerData.role || 'player',
                  lastLogin: Date.now(),
                },
              });
            });
        } else {
          return res.status(200).send({ data: 'Error updating user data' });
        }
        return null;
      })
      .catch(() => {
        res.status(200).send({ data: 'Error updating user data' });
      });
  });
};

module.exports = afterEmailRegistration;
