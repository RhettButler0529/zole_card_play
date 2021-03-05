// const { admin } = require('../admin');
// const checkIfGameOver = require('./checkIfGameOver');

const erci = ['♥-9', '♥-K', '♥-10', '♥-A'];
const kreisti = ['♣︎-9', '♣︎-K', '♣︎-10', '♣︎-A'];
const piki = ['♠︎-9', '♠︎-K', '♠︎-10', '♠︎-A'];
const trumpji = ['♦︎-7', '♦︎-8', '♦︎-9', '♦︎-K', '♦︎-10', '♦︎-A', '♦︎-J', '♥-J', '♠︎-J', '♣︎-J', '♦︎-Q', '♥-Q', '♠︎-Q', '♣︎-Q'];

const checkIfGameOver = require('./checkIfGameOver');
const { admin, adminLogsDb, roomsDb } = require('../admin');
// const log = require('../logs/log');

const setUserBal = (uid, balChange) => {
  if (uid && balChange) {
  //  console.log('setUserBal');
  /*  admin.database().ref(`users/${uid}/bal`)
      .transaction(bal => (bal || 0) + balChange).then(result => {
        if (!result.committed) {
          return resolve();
        }

        const newBal = result.snapshot.val() || null;

        if (newBal) {
          admin.database().ref(`userBalHistory/${userId}`).push({
            time: Date.now(),
            type: 'achievement',
            change: balChange,
            old: newBal - balChange,
            new: newBal,
          });
        }

        return resolve();
      }); */
  }
};

// Determine strongest card on table and give points to winner
const determineStrongestCard = (roomId, tableCards, date) => new Promise(((resolve, reject) => {
//  const date = Date.now();
  const cards = [];

  if (tableCards && tableCards.length === 3) {
    for (let i = 0; i < 3; i += 1) {
      const { card, player } = tableCards[i];
      let type;
      let index;

      if (kreisti.indexOf(tableCards[i].card) !== -1) {
        type = 'kreists';
        index = kreisti.indexOf(tableCards[i].card);
      } else if (erci.indexOf(tableCards[i].card) !== -1) {
        type = 'ercs';
        index = erci.indexOf(tableCards[i].card);
      } else if (piki.indexOf(tableCards[i].card) !== -1) {
        type = 'pikis';
        index = piki.indexOf(tableCards[i].card);
      } else {
        type = 'trumpis';
        index = trumpji.indexOf(tableCards[i].card);
      }

      cards[i] = {
        card,
        player,
        type,
        index,
      };
    }
    let strongestCard = 0;

    for (let i = 1; i < 3; i += 1) {
      if (cards[strongestCard].type !== 'trumpis' && cards[i].type === 'trumpis') {
        strongestCard = i;
      } else if (cards[strongestCard].type === 'trumpis' && cards[i].type === 'trumpis') {
        if (cards[strongestCard].index < cards[i].index) {
          strongestCard = i;
        }
      } else if (cards[strongestCard].type === cards[i].type
      && cards[strongestCard].index < cards[i].index) {
        strongestCard = i;
      }
    }

    admin.database(roomsDb).ref(`rooms/${roomId}/curRnd/currentTable`).transaction((transCurrentTable) => {
      if (transCurrentTable && ((transCurrentTable.length !== 3) || (transCurrentTable[0].card !== tableCards[0].card || transCurrentTable[1].card !== tableCards[1].card))) {
        console.log('alredy removed currentTable, ABORT');
        return; // Abort the transaction.
      }

      return null;
    })
      .then((result) => {
        if (!result.committed) {
          return resolve('alredy removed currentTable');
        }

      //  admin.database().ref(`rooms/${roomId}/curRnd/currentTable`).remove();

      //  admin.database().ref(`rooms/${roomId}/curRnd/currentTurn`).set(cards[strongestCard].player);
      //  admin.database().ref(`rooms/${roomId}/globalParams/currentHand`).set(1);

        admin.database(roomsDb).ref(`rooms/${roomId}/curRnd/currentTurn`).set(cards[strongestCard].player);
        admin.database(roomsDb).ref(`rooms/${roomId}/globalParams/currentHand`).set(1);


        const promise1 = admin.database(roomsDb).ref(`rooms/${roomId}/beatCardPoints/${cards[strongestCard].player}`).once('value');
        const promise2 = admin.database(roomsDb).ref(`rooms/${roomId}/beatCardPoints/tricks/${cards[strongestCard].player}`).once('value');
        const promise3 = admin.database(roomsDb).ref(`rooms/${roomId}/globalParams/party`).once('value');
        const promise4 = admin.database(roomsDb).ref(`rooms/${roomId}/playersList/${cards[strongestCard].player}/name`).once('value');

        Promise.all([promise1, promise2, promise3, promise4]).then((promisesRes) => {
          let playersPoints;
          let playersTricks;
          let party;
          let winPlayerName;

          promisesRes.map((promiseRes, index) => {
            if (index === 0) {
              playersPoints = promiseRes.val() || {};
            } else if (index === 1) {
              playersTricks = promiseRes.val() || 0;
            } else if (index === 2) {
              party = promiseRes.val() || 0;
            } else if (index === 3) {
              winPlayerName = promiseRes.val() || '';
            }
            return null;
          });

          let tablePoints = 0;
          for (let i = 0; i < 3; i += 1) {
            if (cards[i].card.includes('J')) {
              tablePoints += 2;
            } else if (cards[i].card.includes('Q')) {
              tablePoints += 3;
            } else if (cards[i].card.includes('K')) {
              tablePoints += 4;
            } else if (cards[i].card.includes('10')) {
              tablePoints += 10;
            } else if (cards[i].card.includes('A')) {
              tablePoints += 11;
            }
          }
          let newPoints;
          if (playersPoints && playersPoints !== null && Number.isInteger(playersPoints)) {
            newPoints = parseInt(playersPoints, 10) + tablePoints;
          } else {
            newPoints = tablePoints;
          }

        //  admin.database().ref(`rooms/${roomId}/beatCardPoints/${cards[strongestCard].player}`).set(newPoints);

          admin.database(roomsDb).ref(`rooms/${roomId}/beatCardPoints/${cards[strongestCard].player}`).set(newPoints);

          let newTricksCount;
          if (playersTricks !== undefined) {
            newTricksCount = parseInt(playersTricks, 10) + 1;
          } else {
            newTricksCount = 1;
          }

        //  admin.database().ref(`rooms/${roomId}/curRnd/beatCardPoints/tricks`).update({
        //    [cards[strongestCard].player]: newTricksCount,
        //  });

        //  admin.database().ref(`rooms/${roomId}/curRnd/beatCardPoints/tricks/${cards[strongestCard].player}`).set(newTricksCount);

        //  admin.database().ref(`rooms/${roomId}/beatCardPoints/tricks/${cards[strongestCard].player}`).set(newTricksCount);

          admin.database(roomsDb).ref(`rooms/${roomId}/beatCardPoints/tricks/${cards[strongestCard].player}`).set(newTricksCount);

      /*    admin.database().ref(`adminLogs/rooms/${roomId}/${party}`).push({
            time: Date.now(),
            roomId,
            type: 'determineStrongest',
            data: {
              winPlayer: winPlayerName || null,
              card: cards[strongestCard].card,
              tablePoints,
            },
          });  */

          admin.database(adminLogsDb).ref(`adminLogs/rooms/${roomId}/${party}`).push({
            time: Date.now(),
            roomId,
            type: 'determineStrongest',
            data: {
              winPlayer: winPlayerName || null,
              card: cards[strongestCard].card,
              tablePoints,
            },
          });

          checkIfGameOver(roomId, date).then((resp) => {
            if (resp !== 'success') {
              admin.database(roomsDb).ref(`rooms/${roomId}/globalParams/fastGame`)
                .once('value').then((fastGameSnapshot) => {
                  const fastGame = fastGameSnapshot.val() || false;

                  admin.database().ref(`gameSettings/${fastGame ? 'fastSpeed' : 'normalSpeed'}`)
                    .once('value').then((speedSnapshot) => {
                      const speed = speedSnapshot.val() || 15;

                    //  admin.database().ref(`rooms/${roomId}/nextTimestamp`).set((Date.now() + 1000 * speed) + 500);

                      admin.database(roomsDb).ref(`rooms/${roomId}/nextTimestamp`).set((Date.now() + 1000 * speed) + 500);
                    });
                });
            }

            if (tableCards[0].card && tableCards[1].card && tableCards[2].card
              && tableCards[0].card.includes('A') && tableCards[1].card.includes('A')
              && tableCards[2].card.includes('A')) {
                admin.database(roomsDb).ref(`rooms/${roomId}/playersList/${cards[strongestCard].player}/uid`).once('value', (winnerUidSnapshot) => {
                  const uid = winnerUidSnapshot.val() || '';

                //  admin.database().ref(`userAchievements/${uid}/take3Aces`).transaction(score => (score || 0) + 1);

                  admin.database().ref(`userAchievements/${uid}/take3Aces`).transaction(achievement => {
                    if (achievement) {
                      return;
                    }

                    return true;
                  }).then(result => {
                    if (result.committed) {
                      setUserBal(uid, 333);
                    }
                  });
                });
            }

            if (tableCards[0].card && tableCards[1].card && tableCards[2].card
              && (tableCards[0].card.includes('7') || tableCards[0].card.includes('8') || tableCards[0].card.includes('9'))
              && (tableCards[1].card.includes('7') || tableCards[1].card.includes('8') || tableCards[1].card.includes('9'))
              && (tableCards[2].card.includes('7') || tableCards[2].card.includes('8') || tableCards[2].card.includes('9'))) {
                admin.database(roomsDb).ref(`rooms/${roomId}/playersList/${cards[strongestCard].player}/uid`).once('value', (winnerUidSnapshot) => {
                  const uid = winnerUidSnapshot.val() || '';

                //  admin.database().ref(`userAchievements/${uid}/take0Points`).transaction(score => (score || 0) + 1);

                  admin.database().ref(`userAchievements/${uid}/take0Points`).transaction(achievement => {
                    if (achievement) {
                      return;
                    }

                    return true;
                  }).then(result => {
                    if (result.committed) {
                      setUserBal(uid, 789);
                    }
                  });
                });
            }

            if (resp === 'success') {
              return resolve('is game over');
            }
            return resolve('not game over');
          }).catch(err => reject(err));
        }).catch((err) => {
          console.log('error in promise');
          console.log(err);
          return reject(err);
        });
      });
  } else {
  //  console.log(tableCards);
  //  console.log(roomId);
    return resolve('no full table');
  }
}));


module.exports = determineStrongestCard;
