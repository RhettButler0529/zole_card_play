const cardOrder = [
  '♥-9',
  '♥-K',
  '♥-10',
  '♥-A',
  '♠︎-9',
  '♠︎-K',
  '♠︎-10',
  '♠︎-A',
  '♣︎-9',
  '♣︎-K',
  '♣︎-10',
  '♣︎-A',
  '♦︎-7',
  '♦︎-8',
  '♦︎-9',
  '♦︎-K',
  '♦︎-10',
  '♦︎-A',
  '♦︎-J',
  '♥-J',
  '♠︎-J',
  '♣︎-J',
  '♦︎-Q',
  '♥-Q',
  '♠︎-Q',
  '♣︎-Q',
];
const { admin, adminLogsDb, roomsDb } = require('../admin');

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }

    return array;
}

const dealCards = (roomId, lastParty) =>
  new Promise((resolve, reject) => {
    let items = [
      '♣︎-Q',
      '♠︎-Q',
      '♥-Q',
      '♦︎-Q',
      '♣︎-J',
      '♠︎-J',
      '♥-J',
      '♦︎-J',
      '♦︎-A',
      '♦︎-10',
      '♦︎-K',
      '♦︎-9',
      '♦︎-8',
      '♦︎-7',
      '♥-A',
      '♥-10',
      '♥-K',
      '♥-9',
      '♠︎-A',
      '♠︎-10',
      '♠︎-K',
      '♠︎-9',
      '♣︎-A',
      '♣︎-10',
      '♣︎-K',
      '♣︎-9',
    ];

    const promise1 = admin.database(roomsDb).ref(`rooms/${roomId}/nextDealCards`).once('value');
    const promise2 = admin.database(roomsDb).ref(`rooms/${roomId}/playersList/player1/name`).once('value');
    const promise3 = admin.database(roomsDb).ref(`rooms/${roomId}/playersList/player2/name`).once('value');
    const promise4 = admin.database(roomsDb).ref(`rooms/${roomId}/playersList/player3/name`).once('value');
    const promise5 = admin.database(roomsDb).ref(`rooms/${roomId}/globalParams/party`).once('value');
    const promise6 = admin.database(roomsDb).ref(`rooms/${roomId}/playersList/player1/uid`).once('value');
    const promise7 = admin.database(roomsDb).ref(`rooms/${roomId}/playersList/player2/uid`).once('value');
    const promise8 = admin.database(roomsDb).ref(`rooms/${roomId}/playersList/player3/uid`).once('value');
    const promise9 = admin.database(roomsDb).ref(`rooms/${roomId}/currentDealtCards`).once('value');

    Promise.all([promise1, promise2, promise3, promise4, promise5, promise6, promise7, promise8, promise9]).then(promiseRes2 => {
      let nextDealCards;
      let party;
      let player1Name;
      let player2Name;
      let player3Name;
      let player1Uid;
      let player2Uid;
      let player3Uid;
      let currentDealtCards;

      promiseRes2.map((res2, index) => {
        if (res2.key === 'nextDealCards') {
          nextDealCards = res2.val();
        } else if (res2.key === 'party') {
          party = res2.val();
        } else if (index === 1) {
          player1Name = res2.val() || '';
        } else if (index === 2) {
          player2Name = res2.val() || '';
        } else if (index === 3) {
          player3Name = res2.val() || '';
        } else if (index === 5) {
          player1Uid = res2.val() || '';
        } else if (index === 6) {
          player2Uid = res2.val() || '';
        } else if (index === 7) {
          player3Uid = res2.val() || '';
        } else if (index === 8) {
          currentDealtCards = res2.val() || {};
        }
        return null;
      });

      if (nextDealCards) {
        const newCards = [];
        const items2 = [...items];

        nextDealCards.reverse().map(card => {
          const newCard = items[parseInt(card, 10)];

          if (parseInt(card, 10) !== -1) items2.splice(parseInt(card, 10), 1);

          newCards.push(newCard);
          return null;
        });

        const newTableCards = items2;

        admin.database().ref(`rooms/${roomId}/nextDealCards`).remove();
        admin.database(roomsDb).ref(`rooms/${roomId}/nextDealCards`).remove();

        items = newTableCards.concat(newCards);
      } else {
        shuffleArray(items);
      }

      const playerCards = {};

      for (let i = 1; i < 4; i += 1) {
        const cards = [];
        const player = `player${i}`;

        for (let j = 0; j < 8; j += 1) {
          const card = items.pop();
          cards[j] = card;
        }
        cards.sort((a, b) => cardOrder.indexOf(b) - cardOrder.indexOf(a));

        //  console.log(`deal cards ${roomId}`);
        //  console.log(cards);

      //  admin.database().ref(`rooms/${roomId}/players/${player}`).update({
      //    cards,
      //  });

        admin.database(roomsDb).ref(`rooms/${roomId}/players/${player}`).update({
          cards,
        });

        playerCards[player] = cards;
      }

    //  admin.database().ref(`rooms/${roomId}/curRnd/cardsOnTable`).update({
    //    cards: items,
    //  });

    //  admin.database().ref(`rooms/${roomId}/curRnd/currentTable`).remove();

      admin.database(roomsDb).ref(`rooms/${roomId}/curRnd/cardsOnTable`).update({
        cards: items,
      });

      admin.database(roomsDb).ref(`rooms/${roomId}/curRnd/currentTable`).remove();

      if (currentDealtCards) {
      //  admin.database().ref(`rooms/${roomId}/previousRound/lastDealtCards`).set(currentDealtCards);
        admin.database(roomsDb).ref(`rooms/${roomId}/previousRound/lastDealtCards`).set(currentDealtCards);
      }

    //  admin.database().ref(`rooms/${roomId}/currentDealtCards`).set({
    //    ...playerCards,
    //    cardsOnTable: items,
    //  });

      admin.database(roomsDb).ref(`rooms/${roomId}/currentDealtCards`).set({
        ...playerCards,
        cardsOnTable: items,
      });

      if (lastParty && lastParty !== null) {
        const newParty = lastParty + 1;

        admin.database(adminLogsDb).ref(`adminLogs/rooms/${roomId}/${newParty}`)
          .push({
            time: Date.now(),
            roomId,
            type: 'cardsDealt',
            data: {
              player1: {
                cards: playerCards.player1,
                player: player1Name || '',
                playerUid: player1Uid || '',
              },
              player2: {
                cards: playerCards.player2,
                player: player2Name || '',
                playerUid: player2Uid || '',
              },
              player3: {
                cards: playerCards.player3,
                player: player3Name || '',
                playerUid: player3Uid || '',
              },
              cardsOnTable: items,
            },
      /*    });

        admin.database().ref(`adminLogs/rooms/${roomId}/${newParty}`)
          .push({
            time: Date.now(),
            roomId,
            type: 'cardsDealt',
            data: {
              player1: {
                cards: playerCards.player1,
                player: player1Name || '',
                playerUid: player1Uid || '',
              },
              player2: {
                cards: playerCards.player2,
                player: player2Name || '',
                playerUid: player2Uid || '',
              },
              player3: {
                cards: playerCards.player3,
                player: player3Name || '',
                playerUid: player3Uid || '',
              },
              cardsOnTable: items,
            }, */
          })
          .then(() => resolve('success'))
          .catch(err => {
            console.log(err);
            return reject(err);
          });
      } else {
        admin
          .database(adminLogsDb)
          .ref(`adminLogs/rooms/${roomId}/${party}`)
          .push({
            time: Date.now(),
            roomId,
            type: 'cardsDealt',
            data: {
              player1: {
                cards: playerCards.player1,
                player: player1Name || '',
                playerUid: player1Uid || '',
              },
              player2: {
                cards: playerCards.player2,
                player: player2Name || '',
                playerUid: player2Uid || '',
              },
              player3: {
                cards: playerCards.player3,
                player: player3Name || '',
                playerUid: player3Uid || '',
              },
              cardsOnTable: items,
            },
        /*  });

        admin
          .database()
          .ref(`adminLogs/rooms/${roomId}/${party}`)
          .push({
            time: Date.now(),
            roomId,
            type: 'cardsDealt',
            data: {
              player1: {
                cards: playerCards.player1,
                player: player1Name || '',
                playerUid: player1Uid || '',
              },
              player2: {
                cards: playerCards.player2,
                player: player2Name || '',
                playerUid: player2Uid || '',
              },
              player3: {
                cards: playerCards.player3,
                player: player3Name || '',
                playerUid: player3Uid || '',
              },
              cardsOnTable: items,
            },  */
          })
          .then(() => resolve('success'))
          .catch(err => {
            console.log(err);
            return reject(err);
          });
      }

    //  admin.database().ref(`rooms/${roomId}/playersList/player1/emotion`).remove();

    //  admin.database().ref(`rooms/${roomId}/playersList/player2/emotion`).remove();

    //  admin.database().ref(`rooms/${roomId}/playersList/player3/emotion`).remove();

      return resolve('success');
    });
  });

module.exports = dealCards;
