
const joinTournament = (req, res) => {
  const cors = require('cors')({ origin: true });
  const { admin } = require('../admin');

  cors(req, res, () => {
    const {
      tournamentId,
    } = req.body.data;

    console.log('joinTournament');
    console.log(tournamentId);

    const tokenId = req.get('Authorization').split('Bearer ')[1];

    admin.auth().verifyIdToken(tokenId)
      .then((decoded) => {
        if (!decoded.uid) {
          return res.status(200).send({ data: 'Error joining tournament (no auth token)' });
        }

        admin.database().ref(`tourPlayers/${tournamentId}`).once('value', (playersSnapshot) => {
          const tourPlayers = playersSnapshot.val() || {};

          const { length } = Object.keys(tourPlayers);

          admin.database().ref(`tournaments/${tournamentId}`).once('value', (snapshot) => {
            const tournament = snapshot.val() || {};
            const { maxPlayers } = tournament;

            if ((maxPlayers && length < maxPlayers) || (!maxPlayers)) {
              admin.database().ref(`users/${decoded.uid}`).once('value', (userSnapshot) => {
                const userData = userSnapshot.val() || {};

                if (parseInt(userData.bal, 10) >= parseInt(tournament.entryFee, 10)) {
                  const { registrationStart, registrationEnd, status } = tournament;
                  const dateNow = Date.now();

                  const userTournamentData = tourPlayers[decoded.uid];

                  if (!userTournamentData || (userTournamentData && Object.keys(userTournamentData) && Object.keys(userTournamentData).length === 0)) {
                    if (registrationStart < dateNow && registrationEnd > dateNow && status === 'running') {
                      return admin.database().ref(`tourPlayers/${tournamentId}/${decoded.uid}`).update({
                        bal: parseInt(tournament.chipsOnEnter, 10),
                        totalPnts: 0,
                        uid: decoded.uid,
                        name: userData.name,
                        photo: userData.photo,
                        lvl: userData.lvl,
                        curPlaying: false,
                      }).then(() => {
                        admin.database().ref(`tourPlayerData/${decoded.uid}/${tournamentId}`).update({
                          bal: parseInt(tournament.chipsOnEnter, 10),
                          totalPnts: 0,
                          uid: decoded.uid,
                          name: userData.name,
                          photo: userData.photo,
                          lvl: userData.lvl,
                          curPlaying: false,
                          ended: false,
                        });

                        admin.database().ref(`tourHistory/${decoded.uid}/${tournamentId}`).update({
                          bal: parseInt(tournament.chipsOnEnter, 10),
                          totalPnts: 0,
                        });

                        admin.database().ref(`users/${decoded.uid}/bal`)
                          .transaction(bal => (bal || 0) - parseInt(tournament.entryFee, 10));

                        admin.database().ref(`tournaments/${tournamentId}/totalBank`)
                          .transaction(totalBank => (totalBank + parseInt(tournament.entryFee, 10)));

                        admin.database().ref(`userBalHistory/${decoded.uid}`).push({
                          time: Date.now(),
                          type: 'joinTournament',
                          change: `-${tournament.entryFee}`,
                          old: userData.bal,
                          new: parseInt(userData.bal, 10) - parseInt(tournament.entryFee, 10),
                        });

                        admin.database().ref(`userAchievements/${decoded.uid}/joinedTournaments`).transaction(score => (score || 0) + 1);

                        return res.status(200).send({ data: { status: 'success' } });
                      })
                        .catch((err) => {
                          console.log(err);
                          return res.status(200).send({ data: { status: 'error', error: err } });
                        });
                    // /  return res.status(200).send({ data: { status: 'success' } });
                    }
                    return res.status(200).send({ data: { status: 'error', error: 'tournamentEnded' } });
                  }
                  return res.status(200).send({ data: { status: 'error', error: 'alreadyJoined' } });
                }
                return res.status(200).send({ data: { status: 'error', error: 'insuf bal tournament' } });
              });
            } else {
              res.status(200).send({ data: { status: 'error', error: 'player limit' } });
            }
          })
            .catch((err) => {
              res.status(200).send({ data: { status: 'error', error: err } });
            });
          return null;
        })
          .catch((err) => {
            res.status(200).send({ data: { status: 'error', error: err } });
          });
      });
  });
};

module.exports = joinTournament;
