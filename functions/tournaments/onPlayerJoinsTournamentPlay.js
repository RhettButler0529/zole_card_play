// const { admin } = require('../admin');

const onPlayerJoinsTournamentPlay = (change, context) => new Promise(((resolve, reject) => {
  const { admin } = require('../admin');
  const afterData = change.after.val();

  //  console.log('onPlayerJoinsTournamentPlay');

  const { params } = context;
  const { tournamentId } = params;

  //  console.log(tournamentId);

  if (afterData) {
    admin.database().ref(`tournaments/${tournamentId}`)
      .once('value', (tournamentSnapshot) => {
        const tournament = tournamentSnapshot.val() || {};

        //  console.log(tournament);

        if (tournament && tournament.running) {
        //  console.log('running');
          const waitingPlayers = [];
          Object.keys(afterData).map((key2) => {
            waitingPlayers.push({
              uid: key2,
              name: afterData[key2].name,
              shortName: afterData[key2].shortName,
              photo: afterData[key2].photo,
              lvl: afterData[key2].lvl,
              bal: parseInt(afterData[key2].bal, 10),
            });
            return null;
          });

          //  console.log('waitingPlayers');
          //  console.log(waitingPlayers);

          if (waitingPlayers.length === parseInt(tournament.minPlayers, 10)) {
          //  console.log(waitingPlayers);
            let roomId = null;
            let position = 'player1';
            //  let roomData = null;

            /*  admin.database().ref('rooms')
              .orderByChild('tournamentId')
              .equalTo(tournamentId)
              .limitToFirst(1)
              .once('value', (snapshot) => {
                const tournamentRooms = snapshot.val() || {};

                console.log('tournamentRooms');
                console.log(tournamentRooms);

                Object.keys(tournamentRooms).map((key2) => {
                  if ((tournamentRooms[key2].globalParams
                    && tournamentRooms[key2].globalParams.roomClosed)
                    || (tournamentRooms[key2].players
                      && tournamentRooms[key2].players.player1
                      && tournamentRooms[key2].players.player2
                      && tournamentRooms[key2].players.player3)) {
                    console.log('return null');
                    return null;
                  }
                  console.log('key2');
                  console.log(key2);

                  roomId = key2;

                  return null;
                });
              }); */

            //  console.log('roomId');
            //  console.log(roomId);

            waitingPlayers.sort(() => 0.5 - Math.random()).map((player) => {
            //  console.log('player');
            //  console.log(player);
            //  console.log(player.uid);

              if (!roomId) {
              //  console.log('has NO room ID');

                const newPostKey = admin.database().ref('rooms').push({
                  players: {
                    player1: {
                      ...player,
                    },
                  },
                  playersList: {
                    player1: {
                      ...player,
                    },
                    playerList: {
                      [player.uid]: 'player1',
                    },
                  },
                  tournamentId,
                  globalParams: {
                    tournamentRoom: true,
                    tournamentId,
                    talking: player.uid,
                    gameType: tournament.gameType,
                    fastGame: !!tournament.atra,
                    proGame: !!tournament.pro,
                    smallGame: !!tournament.smallGame,
                    bet: tournament.bet,
                    gameState: 'choose',
                    party: 1,
                    roomClosed: false,
                  },
                  curRnd: {
                    type: null,
                    largePlayer: null,
                    firstToGo: 'player1',
                    currentTurn: 'player1',
                    beatCardPoints: {
                      player1: 0,
                      player2: 0,
                      player3: 0,
                      tricks: {
                        player1: 0,
                        player2: 0,
                        player3: 0,
                      },
                    },
                    cardsOnTable: {
                      card1: null,
                      card2: null,
                    },
                  },
                  roomClosed: false,
                }).key;

                //  console.log('newPostKey');
                //  console.log(newPostKey);

                roomId = newPostKey;
                position = 'player2';

                admin.database().ref(`adminLogs/roomIds/${roomId}`).update({
                  tournamentId,
                  date: Date.now(),
                  bet: tournament.bet,
                  index: '',
                });

                admin.database().ref(`rooms/${newPostKey}/globalParams`).update({
                  roomId: newPostKey,
                });

                admin.database().ref(`tourPlayerData/${player.uid}/${tournamentId}`).update({
                  roomId: newPostKey,
                  status: false,
                });

                admin.database().ref(`tourPlayers/${tournamentId}/${player.uid}`).update({
                  roomId: newPostKey,
                //  status: false,
                });

                admin.database().ref(`tourPlWaitList/${tournamentId}/${player.uid}`).remove();

                admin.database().ref(`users/${player.uid}/joinedRooms/${newPostKey}`).set({
                  status: 'joined',
                  position: 'player1',
                  tournamentRoom: true,
                });
              } else {
              //  console.log('has room ID');
              //  console.log(roomId);

                //  admin.database().ref(`rooms/${roomId}`)
                //  .orderByKey()
                //  .equalTo(roomId)
                //  .limitToFirst(1)
                //  .once('value', (roomSnapshot) => {
                //  console.log(roomSnapshot);
                //  const room = roomSnapshot.val() || {};

                //  console.log('room');
                //  console.log(room);

                //  const { players } = room;
                //  let position = null;
                //  if (players && !players.player1) {
                //    position = 'player1';
                //  } else if (players && !players.player2) {
                //    position = 'player2';
                //  } else if (players && !players.player3) {
                //    position = 'player3';
                //  }

                //  console.log('position');
                //  console.log(position);

                admin.database().ref(`rooms/${roomId}/players/${position}`).update({
                  ...player,
                });
                admin.database().ref(`rooms/${roomId}/playersList/${position}`).update({
                  ...player,
                });
                admin.database().ref(`rooms/${roomId}/playersList/playerList`).update({
                  [player.uid]: position,
                });

                //  admin.database().ref(`rooms/${roomId}`).update({
                //    nextTimestamp: Date.now() + 1000 * 30,
                //  });

                //  admin.database().ref(`rooms/${roomId}/globalParams/fastGame`)
                //    .once('value').then((fastGameSnapshot) => {
                //      const fastGame = fastGameSnapshot.val() || false;

                admin.database().ref(`gameSettings/${tournament.atra ? 'fastSpeed' : 'normalSpeed'}`)
                  .once('value').then((speedSnapshot) => {
                    const speed = speedSnapshot.val() || 15;

                    admin.database().ref(`rooms/${roomId}`).update({
                      nextTimestamp: (Date.now() + 1000 * speed) + 500,
                    });
                  });
                //  });

                admin.database().ref(`tourPlayerData/${player.uid}/${tournamentId}`).update({
                  roomId,
                  status: false,
                });

                admin.database().ref(`tourPlayers/${tournamentId}/${player.uid}`).update({
                  roomId,
                  //  status: false,
                });

                admin.database().ref(`tourPlWaitList/${tournamentId}/${player.uid}`).remove();

                admin.database().ref(`users/${player.uid}/joinedRooms/${roomId}`).set({
                  status: 'joined',
                  position,
                  tournamentRoom: true,
                });
                //  if (Object.keys(players).length === 2) {
                //    roomId = null;
                //  }

                if (position === 'player2') {
                  position = 'player3';
                } else if (position === 'player3') {
                  position = 'player1';
                  roomId = null;
                }

              //    });
              }
            });

            //  console.log('after mapping all players');

            //  admin.database().ref(`tourPlWaitList/${tournamentId}`).remove();

            return resolve('sucess');
          }
          return resolve('not enough players in list');
        }
        //  console.log('tournament is not live');
        return resolve('tournament is not live');
      });
  } else {
    return resolve('no players waiting');
  }
//  return null;
}));

module.exports = onPlayerJoinsTournamentPlay;
