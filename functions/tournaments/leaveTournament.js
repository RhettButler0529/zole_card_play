const leaveTournament = (req, res) => {
  const cors = require('cors')({ origin: true });
  const { admin } = require('../admin');

  cors(req, res, () => {
    const {
      tournamentId,
    } = req.body.data;

    const tokenId = req.get('Authorization').split('Bearer ')[1];

    admin.auth().verifyIdToken(tokenId)
      .then((decoded) => {
        if (!decoded.uid) {
          return res.status(200).send({ data: 'Error joining tournament (no auth token)' });
        }

        admin.database().ref(`tourPlayers/${tournamentId}/${decoded.uid}`).once('value', (playerSnapshot) => {
          const userTournamentData = playerSnapshot.val() || null;

          console.log('userTournamentData');
          console.log(userTournamentData);

          admin.database().ref(`tournaments/${tournamentId}`).once('value', (snapshot) => {
            const tournament = snapshot.val() || {};

            console.log('tournament');
            console.log(tournament);

            admin.database().ref(`users/${decoded.uid}/bal`).once('value', (userSnapshot) => {
              const userBal = userSnapshot.val() || 0;

              console.log('userBal');
              console.log(userBal);

              if (parseInt(userBal, 10) >= parseInt(tournament.entryFee, 10)) {
                const { running } = tournament;

                if (userTournamentData && userTournamentData !== null) {
                  if (running) {
                    console.log('tornament is running');
                    admin.database().ref(`tourPlayers/${tournamentId}/${decoded.uid}`).remove().then(() => {
                      admin.database().ref(`tourPlayerData/${decoded.uid}/${tournamentId}`).remove();

                      admin.database().ref(`tourHistory/${decoded.uid}/${tournamentId}`).remove();

                      admin.database().ref(`users/${decoded.uid}/bal`)
                        .transaction(bal => (bal || 0) - parseInt(tournament.entryFee, 10));

                      //  admin.database().ref(`users/${decoded.uid}`).update({
                      //    bal: parseInt(userBal, 10) - parseInt(tournament.entryFee, 10),
                      //  });

                      admin.database().ref(`userBalHistory/${decoded.uid}`).push({
                        time: Date.now(),
                        type: 'leaveTournament',
                        change: tournament.entryFee,
                        old: userBal,
                        new: parseInt(userBal, 10) - parseInt(tournament.entryFee, 10),
                      });

                      admin.database().ref(`userAchievements/${decoded.uid}/joinedTournaments`).transaction(score => (score || 0) - 1);
                    });
                    return res.status(200).send({ data: { status: 'success' } });
                  }
                  return res.status(200).send({ data: { status: 'error', error: 'tournamentEnded' } });
                }
                return res.status(200).send({ data: { status: 'error', error: 'alreadyJoined' } });
              }
              return res.status(200).send({ data: { status: 'error', error: 'insuf bal tournament' } });
            });
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

module.exports = leaveTournament;
