const cors = require('cors')({ origin: true });
const { admin, adminLogsDb, roomsDb } = require('../admin');

const quitRound = (req, res) => {
//  const cors = require('cors')({ origin: true });
//  const { admin } = require('../admin');
  const calculateResults = require('./calculateResults');

  cors(req, res, () => {
  //  new Promise(((resolve, reject) => {

    if (!req.body || !req.body.data) {
      return res.status(200).send({ data: 'no req body data' });
    }

    const {
      roomId,
      init,
    } = req.body.data;

    if (init) {
      admin.database().ref(`rooms/${roomId}`).update({
        init: Date.now(),
      });

      return res.status(200).send({ data: 'initialized' });
    }

    const tokenId = req.get('Authorization').split('Bearer ')[1];

    admin.auth().verifyIdToken(tokenId)
      .then((decoded) => {
        if (!decoded.uid) {
          return res.status(200).send({ data: 'no auth token' });
        }

        const promise1 = admin.database(roomsDb).ref(`rooms/${roomId}/globalParams/gameState`).once('value');
        const promise2 = admin.database(roomsDb).ref(`rooms/${roomId}/globalParams/party`).once('value');
        const promise3 = admin.database(roomsDb).ref(`rooms/${roomId}/curRnd/type`).once('value');
        const promise4 = admin.database(roomsDb).ref(`rooms/${roomId}/curRnd/largePlayer`).once('value');
        const promise5 = admin.database(roomsDb).ref(`rooms/${roomId}/players`).once('value');

        Promise.all([promise1, promise2, promise3, promise4, promise5]).then((results) => {
          let gameState;
          let party;
          let type;
          let largePlayer;
          let players;

          results.forEach((result, index) => {
            if (index === 0) {
              gameState = result.val() || {};
            } else if (index === 1) {
              party = result.val() || 0;
            } else if (index === 2) {
              type = result.val() || {};
            } else if (index === 3) {
              largePlayer = result.val() || {};
            } else if (index === 4) {
              players = result.val() || {};
            }
          });

          //  admin.database().ref(`rooms/${roomId}/globalParams`).once('value', (globalParamsSnapshot) => {
          //    const globalParams = globalParamsSnapshot.val() || {};

          //    const { gameState, party } = globalParams;

          if (gameState === 'play') {
          //  admin.database().ref(`rooms/${roomId}/curRnd`).once('value', (roundSnapshot) => {
          //    const currentRound = roundSnapshot.val() || {};

            if (type === 'galdins') {
              // Quit round galdins

              //  admin.database().ref(`rooms/${roomId}/players`).once('value', (playersSnapshot) => {
              //    const players = playersSnapshot.val() || {};

              let points = 0;

              Object.keys(players).map((key) => {
                const player = players[key];

                player.cards.map((card) => {
                  if (card.includes('J')) {
                    points += 2;
                  } else if (card.includes('Q')) {
                    points += 3;
                  } else if (card.includes('K')) {
                    points += 4;
                  } else if (card.includes('10')) {
                    points += 10;
                  } else if (card.includes('A')) {
                    points += 11;
                  }
                  return null;
                });
                return null;
              });

              let playerName = '';

              if (players && players.player1 && players.player1.uid === decoded.uid) {
                const tricks = players.player1.cards.length;
                playerName = players.player1.name;

              //  admin.database().ref(`rooms/${roomId}/curRnd/beatCardPoints/tricks`).update({
              //    player1: tricks,
              //  });

              //  admin.database().ref(`rooms/${roomId}/curRnd/beatCardPoints/tricks/player1`).transaction(beatCardTricks => (beatCardTricks || 0) + tricks);

              //  admin.database().ref(`rooms/${roomId}/curRnd/beatCardPoints`).update({
              //    player1: points,
              //  });

              /*  admin.database().ref(`rooms/${roomId}/beatCardPoints/tricks/player1`).transaction(beatCardTricks => (beatCardTricks || 0) + tricks);

                admin.database().ref(`rooms/${roomId}/beatCardPoints`).update({
                  player1: points,
                });  */

                admin.database(roomsDb).ref(`rooms/${roomId}/beatCardPoints/tricks/player1`).transaction(beatCardTricks => (beatCardTricks || 0) + tricks);

                admin.database(roomsDb).ref(`rooms/${roomId}/beatCardPoints`).update({
                  player1: points,
                });
              } else if (players && players.player2 && players.player2.uid === decoded.uid) {
                const tricks = players.player2.cards.length;
                playerName = players.player2.name;

              //  admin.database().ref(`rooms/${roomId}/curRnd/beatCardPoints/tricks`).update({
              //    player2: tricks,
              //  });

              //  admin.database().ref(`rooms/${roomId}/curRnd/beatCardPoints/tricks/player2`).transaction(beatCardTricks => (beatCardTricks || 0) + tricks);

              //  admin.database().ref(`rooms/${roomId}/curRnd/beatCardPoints`).update({
              //    player2: points,
              //  });

              /*  admin.database().ref(`rooms/${roomId}/beatCardPoints/tricks/player2`).transaction(beatCardTricks => (beatCardTricks || 0) + tricks);

                admin.database().ref(`rooms/${roomId}/beatCardPoints`).update({
                  player2: points,
                }); */

                admin.database(roomsDb).ref(`rooms/${roomId}/beatCardPoints/tricks/player2`).transaction(beatCardTricks => (beatCardTricks || 0) + tricks);

                admin.database(roomsDb).ref(`rooms/${roomId}/beatCardPoints`).update({
                  player2: points,
                });
              } else if (players && players.player3 && players.player3.uid === decoded.uid) {
                const tricks = players.player3.cards.length;
                playerName = players.player3.name;

              //  admin.database().ref(`rooms/${roomId}/curRnd/beatCardPoints/tricks`).update({
              //    player3: tricks,
              //  });

              //  admin.database().ref(`rooms/${roomId}/curRnd/beatCardPoints/tricks/player3`).transaction(beatCardTricks => (beatCardTricks || 0) + tricks);

              //  admin.database().ref(`rooms/${roomId}/curRnd/beatCardPoints`).update({
              //    player3: points,
              //  });

              /*  admin.database().ref(`rooms/${roomId}/beatCardPoints/tricks/player3`).transaction(beatCardTricks => (beatCardTricks || 0) + tricks);

                admin.database().ref(`rooms/${roomId}/beatCardPoints`).update({
                  player3: points,
                }); */

                admin.database(roomsDb).ref(`rooms/${roomId}/beatCardPoints/tricks/player3`).transaction(beatCardTricks => (beatCardTricks || 0) + tricks);

                admin.database(roomsDb).ref(`rooms/${roomId}/beatCardPoints`).update({
                  player3: points,
                });
              }

            //  admin.database().ref(`rooms/${roomId}/curRnd/currentTurn`).remove();
            //  admin.database().ref(`rooms/${roomId}/curRnd/cardPlayed`).remove();

              admin.database(roomsDb).ref(`rooms/${roomId}/curRnd/currentTurn`).remove();
              admin.database(roomsDb).ref(`rooms/${roomId}/curRnd/cardPlayed`).remove();

              calculateResults(roomId);

            //  admin.database().ref(`rooms/${roomId}/globalParams`).update({
            //    playerQuitRound: true,
            //  });

              admin.database(roomsDb).ref(`rooms/${roomId}/globalParams`).update({
                playerQuitRound: true,
              });

              admin.database(adminLogsDb).ref(`adminLogs/rooms/${roomId}/${party}`).push({
                time: Date.now(),
                roomId,
                type: 'playerQuit',
                data: {
                  player: playerName,
                  playerUid: decoded.uid,
                  roundType: 'galdins',
                },
              });
              //  });
              return res.status(200).send({ data: { status: 'success' } });
            } if (type === 'maza') {
              // Quit round Maza
              //  const { largePlayer } = currentRound;
              admin.database(roomsDb).ref(`rooms/${roomId}/playersList/${largePlayer}`).once('value', (playerSnapshot) => {
                const player = playerSnapshot.val() || {};

                if (decoded.uid === player.uid) {
                //  admin.database().ref(`rooms/${roomId}/curRnd/beatCardPoints`).update({
                //    [largePlayer]: 1,
                //  });

                /*  admin.database().ref(`rooms/${roomId}/beatCardPoints`).update({
                    [largePlayer]: 1,
                  });

                  admin.database().ref(`rooms/${roomId}/curRnd/currentTurn`).remove();
                  admin.database().ref(`rooms/${roomId}/curRnd/cardPlayed`).remove(); */

                  admin.database(roomsDb).ref(`rooms/${roomId}/beatCardPoints`).update({
                    [largePlayer]: 1,
                  });

                  admin.database(roomsDb).ref(`rooms/${roomId}/curRnd/currentTurn`).remove();
                  admin.database(roomsDb).ref(`rooms/${roomId}/curRnd/cardPlayed`).remove();

                  admin.database().ref(`rooms/${roomId}/beatCardPoints/tricks`).update({
                    [largePlayer]: 1,
                  })

                //  admin.database().ref(`rooms/${roomId}/curRnd/beatCardPoints/tricks`).update({
                //    [largePlayer]: 1,
                //  })

                  admin.database(roomsDb).ref(`rooms/${roomId}/beatCardPoints/tricks`).update({
                    [largePlayer]: 1,
                  }).then(() => {
                    calculateResults(roomId).then((resp) => {
                      if (resp === 'success') {
                      //  admin.database().ref(`rooms/${roomId}/globalParams`).update({
                      //    playerQuitRound: true,
                      //  });

                      //  admin.database().ref(`rooms/${roomId}/globalParams/playerQuitRound`).set(true);

                        admin.database(roomsDb).ref(`rooms/${roomId}/globalParams/playerQuitRound`).set(true);

                        admin.database(adminLogsDb).ref(`adminLogs/rooms/${roomId}/${party}`).push({
                          time: Date.now(),
                          roomId,
                          type: 'playerQuit',
                          data: {
                            player: player.name || '',
                            playerUid: decoded.uid,
                            roundType: 'maza',
                          },
                        });
                        return res.status(200).send({ data: { status: 'success' } });
                      }
                      return res.status(200).send({ data: { status: 'error', error: 'not success' } });
                    });
                  });
                } else {
                  return res.status(200).send({ data: { status: 'error', error: 'not large player' } });
                }
              }).catch(err => res.status(200).send({ data: { status: 'error', error: err } }));
            } else {
              // Quit round parasta/zole
              //  const { largePlayer } = currentRound;

              //  admin.database().ref(`rooms/${roomId}/players/${largePlayer}`).once('value', (playerSnapshot) => {
              //  const player = playerSnapshot.val() || {};
              const player = players[largePlayer] || {};

              if (decoded.uid === player.uid) {
              //  admin.database().ref(`rooms/${roomId}/curRnd/currentTurn`).remove();
              //  admin.database().ref(`rooms/${roomId}/curRnd/cardPlayed`).remove();

                admin.database(roomsDb).ref(`rooms/${roomId}/curRnd/currentTurn`).remove();
                admin.database(roomsDb).ref(`rooms/${roomId}/curRnd/cardPlayed`).remove();

                admin.database(roomsDb).ref(`rooms/${roomId}/globalParams/playerQuitRound`)
                  .transaction((playerQuitRound) => {
                    if (playerQuitRound) {
                      return;
                    }

                    return true;
                  }).then((result2) => {
                    if (!result2.committed) {
                      return res.status(200).send({ data: { status: 'error', error: 'already quit' } });
                    }

                  //  admin.database().ref(`rooms/${roomId}/globalParams/playerQuitRound`).set(true);

                    admin.database(adminLogsDb).ref(`adminLogs/rooms/${roomId}/${party}`).push({
                      time: Date.now(),
                      roomId,
                      type: 'playerQuit',
                      data: {
                        player: player.name || '',
                        playerUid: decoded.uid,
                        roundType: type,
                      },
                    });

                    calculateResults(roomId).then((resp) => {
                      if (resp === 'success') {
                      //  admin.database().ref(`rooms/${roomId}/globalParams`).update({
                      //    playerQuitRound: true,
                      //  });

                        return res.status(200).send({ data: { status: 'success' } });
                      }
                      return res.status(200).send({ data: { status: 'error', error: 'not success' } });
                    }).catch(err => res.status(200).send({ data: { status: 'error', error: err } }));
                  });
              } else {
                return res.status(200).send({ data: { status: 'error', error: 'not large player' } });
              }
            //  }).catch((err) => {
            //    console.log(err);
            //    return res.status(200).send({ data: { status: 'error', error: err } });
            //  });
            }
            //  }).catch((err) => {
            //    console.log(err);
            //    return res.status(200).send({ data: { status: 'error', error: err } });
          } else if (gameState === 'burry') {
            return res.status(200).send({ data: { status: 'error', error: 'game state is burry' } });
          } else {
            return res.status(200).send({ data: { status: 'error', error: 'game state is not play' } });
          }
        //  });
        })
          .catch(err => res.status(200).send({ data: { status: 'error', error: err } }));
      //  return null;
      })
      .catch(err => res.status(200).send({ data: { status: 'error', error: err } }));
  });
  // });
//  res.status(200).send({ data: { status: 'error', error: 'function end without result' } });
};

module.exports = quitRound;
