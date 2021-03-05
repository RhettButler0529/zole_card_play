// const cors = require('cors')({ origin: true });

// const { admin } = require('../admin');

const joinTournamentRoom = (req, res) => {
  const cors = require('cors')({ origin: true });
  const { admin } = require('../admin');

  cors(req, res, () => {
    const {
      tournamentId,
    } = req.body.data;

    console.log('joinTournamentRoom');

    console.log(tournamentId);

    const tokenId = req.get('Authorization').split('Bearer ')[1];

    admin.auth().verifyIdToken(tokenId)
      .then((decoded) => {
        if (!decoded.uid) {
          return res.status(200).send({ data: 'Error joining room (no auth token)' });
        }

        admin.database().ref(`tournaments/${tournamentId}`)
          .once('value', (tournamentSnapshot) => {
            const tournament = tournamentSnapshot.val() || {};

            console.log(tournament);
            const { running, bet } = tournament;

            if (tournament && running) {
              admin.database().ref(`tourPlayers/${tournamentId}/${decoded.uid}`)
                .once('value', (userSnapshot) => {
                  const userData = userSnapshot.val() || {};

                  console.log('userData');
                  console.log(userData);

                  if (userData && userData.uid) {
                    if (!userData.roomId) {
                      let betValue;
                      if (bet === '1:1') {
                        betValue = 16;
                      } else if (bet === '1:5') {
                        betValue = 80;
                      } else if (bet === '1:10') {
                        betValue = 160;
                      } else if (bet === '1:25') {
                        betValue = 400;
                      } else if (bet === '1:50') {
                        betValue = 800;
                      } else if (bet === '1:100') {
                        betValue = 1600;
                      } else if (bet === '1:500') {
                        betValue = 8000;
                      } else if (bet === '1:1000') {
                        betValue = 16000;
                      } else if (bet === '1:5000') {
                        betValue = 80000;
                      } else if (bet === '1:10000') {
                        betValue = 160000;
                      }

                      console.log(betValue);

                      if (userData.bal > 0) {
                        const { name } = userData;

                        const nameSplit = name.split(' ');
                        const { length } = nameSplit;

                        const shortName = `${nameSplit[0]} ${nameSplit[length - 1].charAt(0)}`;

                        admin.database().ref(`tourPlWaitList/${tournamentId}/${decoded.uid}`).update({
                          uid: decoded.uid,
                          name,
                          shortName,
                          photo: userData.photo,
                          lvl: userData.lvl || 0,
                          bal: parseInt(userData.bal, 10),
                        });

                        admin.database().ref(`tourPlayerData/${decoded.uid}/${tournamentId}`).update({
                          status: true,
                        });

                        res.status(200).send({ data: { status: 'success' } });
                      } else {
                        res.status(200).send({ data: { status: 'error', error: 'insufficient balance' } });
                      }
                    } else {
                      res.status(200).send({ data: { status: 'error', error: 'already joined a room' } });
                    }
                  } else {
                    res.status(200).send({ data: { status: 'error', error: 'not registered in tournament' } });
                  }
                })
                .catch((err) => {
                  res.status(200).send({ data: { status: 'error', error: err } });
                });
            } else {
              res.status(200).send({ data: { status: 'error', error: 'tournament is not live' } });
            }
          });
        return null;
      })
      .catch((err) => {
        res.status(200).send({ data: { status: 'error', error: err } });
      });
  });
};

module.exports = joinTournamentRoom;
