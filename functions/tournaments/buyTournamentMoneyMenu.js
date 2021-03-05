
const buyTournamentMoneyMenu = (req, res) => {
  const cors = require('cors')({ origin: true });
  const { admin } = require('../admin');

  cors(req, res, () => {
    const {
      tournamentId,
    } = req.body.data;

    if (tournamentId) {
      const tokenId = req.get('Authorization').split('Bearer ')[1];

      admin.auth().verifyIdToken(tokenId)
        .then((decoded) => {
          if (!decoded.uid) {
            return res.status(200).send({ data: 'Error buying money (no auth token)' });
          }

          admin.database().ref(`tournaments/${tournamentId}/status`).once('value', (tournamentStatusSnapshot) => {
            const status = tournamentStatusSnapshot.val() || null;

            admin.database().ref(`tournaments/${tournamentId}/bet`).once('value', (tournamentBetSnapshot) => {
              const bet = tournamentBetSnapshot.val() || null;

              if (status && status === 'running') {
                admin.database().ref(`tourPlayers/${tournamentId}/${decoded.uid}/bal`).once('value', (userSnapshot) => {
                  const bal = userSnapshot.val() || null;

                  if (bal) {
                    //  const { bet } = tournamentData;
                    //  const { bal } = userData;

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

                    if (betValue >= bal) {
                      console.log('is valid to buy');

                      admin.database().ref(`users/${decoded.uid}/bal`).once('value', (userBalanceSnapshot) => {
                        const userBalance = userBalanceSnapshot.val() || null;

                        if (userBalance >= 100) {
                          admin.database().ref(`users/${decoded.uid}/bal`)
                            .transaction(bal2 => (bal2 - 100));

                          admin.database().ref(`userBalHistory/${decoded.uid}`).push({
                            time: Date.now(),
                            type: 'buyTournamentMoney',
                            change: -100,
                            old: userBalance,
                            new: userBalance - 100,
                          });

                          admin.database().ref(`tourPlayers/${tournamentId}/${decoded.uid}/bal`)
                            .transaction(bal2 => (bal2 + 300));

                          //  admin.database().ref(`tourPlayerData/${decoded.uid}/${tournamentId}/bal`)
                          //    .transaction(bal2 => (bal2 + 300));

                          admin.database().ref(`tournaments/${tournamentId}/totalBank`)
                            .transaction(totalBank => (totalBank + 300));

                          return res.status(200).send({ data: { status: 'success' } });
                        }
                        return res.status(200).send({ data: { status: 'error', error: 'insufficient balance' } });
                      });
                    }
                    return res.status(200).send({ data: { status: 'error', error: 'does not need buying' } });
                  }
                  return res.status(200).send({ data: { status: 'error', error: 'not in tournament' } });
                });
              } else {
                return res.status(200).send({ data: { status: 'error', error: 'wrong data' } });
              }
            });
          });
        })
        .catch((err) => {
          res.status(200).send({ data: { status: 'error', error: err } });
        });
    } else {
      return res.status(200).send({ data: { status: 'error', error: 'no tournament id' } });
    }
  });
};

module.exports = buyTournamentMoneyMenu;
