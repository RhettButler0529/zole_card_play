// const cors = require('cors')({ origin: true });
// const { admin } = require('../admin');

const submitError = (req, res) => {
  const cors = require('cors')({ origin: true });
  const { admin } = require('../admin');
  cors(req, res, () => {
    const {
      type,
      message,
      roomId,
      globalParams,
      currentTurn,
      players,
      points,
      lastRoom,
      tournamentId,
    } = req.body.data;

    const tokenId = req.get('Authorization').split('Bearer ')[1];

    admin.auth().verifyIdToken(tokenId)
      .then((decoded) => {
        if (!decoded.uid) {
          return res.status(200).send({ data: 'no auth token' });
        }

        const time = Date.now();
        let roomData = {};
        if (roomId) {
          roomData = {
            roomId,
            globalParams: {
              gameState: globalParams.gameState || null,
              bet: globalParams.bet || null,
              gameType: globalParams.gameType || null,
              party: globalParams.party || null,
              talking: globalParams.talking || null,
              roomClosed: globalParams.roomClosed || null,
              tournamentId: globalParams.tournamentId || null,
            },
            currentTurn: currentTurn || null,
            players: {
              player1: players.player1 || null,
              player2: players.player2 || null,
              player3: players.player3 || null,
            },
            points,
            tournamentId: tournamentId || null,
          };
        } else if (lastRoom) {
          admin.database().ref(`rooms/${lastRoom}`)
            .once('value', (lastRoomSnapshot) => {
              const lastRoomData = lastRoomSnapshot.val() || {};
              roomData = {
                roomId: lastRoom,
                globalParams: {
                  gameState: lastRoomData.globalParams.gameState || null,
                  bet: lastRoomData.globalParams.bet || null,
                  gameType: lastRoomData.globalParams.gameType || null,
                  party: lastRoomData.globalParams.party || null,
                  talking: lastRoomData.globalParams.talking || null,
                  roomClosed: lastRoomData.globalParams.roomClosed || null,
                },
                currentTurn: lastRoomData.currentTurn || null,
                players: {
                  player1: lastRoomData.players.player1 || null,
                  player2: lastRoomData.players.player2 || null,
                  player3: lastRoomData.players.player3 || null,
                },
                points: lastRoomData.points,
              };
            });
        }

        admin.database().ref(`users/${decoded.uid}`)
          .once('value', (userSnapshot) => {
            const userData = userSnapshot.val() || {};

            if (type && roomData) {
              admin.database().ref('errors/allErrors').push({
                type,
                message: message || '',
                userUid: userData.uid,
                userName: userData.name,
                userEmail: userData.email || 'no-email@spelezoli.lv',
                userData: {
                  bal: userData.bal,
                  gPlayed: userData.gPlayed,
                  gWon: userData.gWon,
                  lvl: userData.lvl,
                  totalPnts: userData.totalPnts,
                  lastLogin: userData.lastLogin || null,
                },
                socProvider: userData.socProvider || null,
                time,
                roomData,
              }).then((snap) => {
                const { key } = snap;

                admin.database().ref(`errors/allErrors/${key}`).update({
                  errorId: key,
                });
              });
              return res.status(200).send({ data: { status: 'success' } });
            }
            return res.status(200).send({ data: { status: 'error', message: 'no data' } });
          });
      })
      .catch(err => res.status(200).send({ data: { status: 'error', message: err } }));
  });
};

module.exports = submitError;
