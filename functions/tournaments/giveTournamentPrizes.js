// const { admin } = require('../admin');

// Give out prizes for tournament
const giveTournamentPrizes = (tournamentId, tournamentData) => new Promise(((resolve, reject) => {
  const { admin } = require('../admin');

  console.log('giveTournamentPrizes');
  const { winnerPercent, totalBank, bonus } = tournamentData;

  console.log('tournamentData');
  console.log(tournamentData);

  admin.database().ref(`tourPlayers/${tournamentId}`)
    .once('value', (playersSnapshot) => {
      const players = playersSnapshot.val() || {};

      console.log('players');
      console.log(players);

      const playersArray = Object.keys(players).map(key => ({
        uid: key,
        bal: parseInt(players[key].bal, 10),
        name: players[key].name,
        totalPnts: parseInt(players[key].totalPnts, 10),
      }));

      playersArray.sort((a, b) => b.totalPnts - a.totalPnts);

      console.log('playersArray');
      console.log(playersArray);

      const { length } = playersArray;

      const winnerCount = Math.ceil(length * parseInt(winnerPercent, 10) / 100);

      console.log('winnerCount');
      console.log(winnerCount);

      const winAmount = Math.round((parseInt(bonus, 10) + parseInt(totalBank, 10)) / winnerCount);

      console.log('winAmount');
      console.log(winAmount);

      playersArray.map((player, index) => {
        if (index + 1 <= winnerCount) {
          console.log(`player ${player.name} is winner`);
          //  console.log(winAmount);

          admin.database().ref(`users/${player.uid}/bal`)
            .once('value', (playerBalSnapshot) => {
              const userBalance = playerBalSnapshot.val() || {};

              console.log('userBalance');
              console.log(userBalance);

              admin.database().ref(`users/${player.uid}/bal`)
                .transaction((bal) => {
                  if (bal || bal === 0) {
                    return parseInt(bal, 10) + parseInt(winAmount, 10);
                  }
                  return bal;
                });

              admin.database().ref(`userBalHistory/${player.uid}`).push({
                time: Date.now(),
                type: 'winTournament',
                change: winAmount,
                old: userBalance,
                new: parseInt(userBalance, 10) + winAmount,
              });
            });

          admin.database().ref(`tourPlayers/${tournamentId}/${player.uid}`).update({
            winner: true,
            winAmount,
          });

          admin.database().ref(`tourPlayerData/${player.uid}/${tournamentId}`).update({
            winner: true,
            winAmount,
          });

          admin.database().ref(`tourHistory/${player.uid}/${tournamentId}`).update({
            winner: true,
            winAmount,
          });
        } else {
          console.log(`player ${player.name} is NOT winner`);

          admin.database().ref(`tourPlayers/${tournamentId}/${player.uid}`).update({
            winner: false,
            winAmount: 0,
          });

          admin.database().ref(`tourPlayerData/${player.uid}/${tournamentId}`).update({
            winner: false,
          //  winAmount: 0,
          });

          admin.database().ref(`tourHistory/${player.uid}/${tournamentId}`).update({
            winner: false,
          //  winAmount: 0,
          });
        }

        if (index <= 10) {
          admin.database().ref(`userAchievements/${player.uid}/reachedTournamentTop10`).transaction(score => (score || 0) + 1);
        }

        return null;
      });

      return resolve('success');
    }).catch(err => reject(err));
}));

module.exports = giveTournamentPrizes;
