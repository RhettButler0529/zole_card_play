const functions = require('firebase-functions');

// const axios = require('axios');
// const cors = require('cors')({ origin: true });
// const rp = require('request-promise');

// const { pow } = require('mathjs');

// Initializes and returns firebase-admin
const { admin, leaderboardDb, adminLogsDb, roomsPublicDb, statusDb, roomsDb } = require('./admin');

// User functions
// const submitError = require('./user/submitError');
// const draugiemAuth = require('./user/draugiemAuth');
// const initFBPayment = require('./user/initFBPayment');
// const fbPaymentCallback = require('./user/fbPaymentCallback');
// const initDraugiemPayment = require('./user/initDraugiemPayment');
// const draugiemPaymentCallback = require('./user/draugiemPaymentCallback');
// const mobilePaymentCallback = require('./user/mobilePaymentCallback');

const draugiemAuthUrl = require('./user/draugiemAuthUrl');

// Tournament functions
// const joinTournament = require('./tournaments/joinTournament');
// const joinTournamentRoom = require('./tournaments/joinTournamentRoom');
// const onPlayerJoinsTournamentPlay = require('./tournaments/onPlayerJoinsTournamentPlay');
const onPlayerJoinsTournamentPlay2 = require('./tournaments/onPlayerJoinsTournamentPlay2');
const giveTournamentPrizes = require('./tournaments/giveTournamentPrizes');
// const buyTournamentMoney = require('./tournaments/buyTournamentMoney');
// const buyTournamentMoneyMenu = require('./tournaments/buyTournamentMoneyMenu');
// const leaveTournament = require('./tournaments/leaveTournament');



/*
exports.removeOldRooms = functions.database.ref('/removeOldRooms')
  .onWrite((change, context) => new Promise(((resolve) => {
    const afterData = change.after.val() || null;

    admin.database().ref('rooms')
      .orderByKey()
      .startAt(afterData)
      .limitToFirst(2000)
      .once('value', (roomsSnapshot) => {
        const rooms = roomsSnapshot.val() || {};

        Object.keys(rooms).map((key) => {
          if (rooms[key]) {
            if (rooms[key] && (!rooms[key].players || (rooms[key].players && !(rooms[key].players.player1 && rooms[key].players.player2 && rooms[key].players.player3)))) {
              admin.database().ref(`rooms/${key}`).remove();
            }
          }
          return null;
        });

        resolve();
      });
  })));
*/


/*

exports.moveLeaderboardDb = functions.database.ref('/moveLeaderboardDb')
  .onWrite((change, context) => new Promise(((resolve, reject) => {
    const start = change.after.val();

    console.log(start);

    const promise1 = new Promise(resolve2 => admin.database().ref('leaderboard/allTime')
      .orderByKey()
      .startAt(start)
      .limitToFirst(500)
      .once('value', (leaderboardSnapshot) => {
        const leaderboard = leaderboardSnapshot.val() || {};

        Object.keys(leaderboard).map((key, index) => {
          if (leaderboard[key]) {
            admin.database(leaderboardDb).ref(`leaderboard/allTime/${key}`).update(leaderboard[key]);
          }

          if (index > 498) {
            console.log(key);
          }
        });

        resolve2();
      }));

      const promise2 = new Promise(resolve2 => admin.database().ref('leaderboard/daily')
        .orderByKey()
        .startAt(start)
        .limitToFirst(500)
        .once('value', (leaderboardSnapshot) => {
          const leaderboard = leaderboardSnapshot.val() || {};

          Object.keys(leaderboard).map((key, index) => {
            if (leaderboard[key]) {
              admin.database(leaderboardDb).ref(`leaderboard/daily/${key}`).update(leaderboard[key]);
            }

            if (index > 498) {
              console.log(key);
            }
          });

          resolve2();
        }));

        const promise3 = new Promise(resolve2 => admin.database().ref('leaderboard/week')
          .orderByKey()
          .startAt(start)
          .limitToFirst(500)
          .once('value', (leaderboardSnapshot) => {
            const leaderboard = leaderboardSnapshot.val() || {};

            Object.keys(leaderboard).map((key, index) => {
              if (leaderboard[key]) {
                admin.database(leaderboardDb).ref(`leaderboard/week/${key}`).update(leaderboard[key]);
              }

              if (index > 498) {
                console.log(key);
              }
            });

            resolve2();
          }));

          const promise4 = new Promise(resolve2 => admin.database().ref('leaderboard/month')
            .orderByKey()
            .startAt(start)
            .limitToFirst(500)
            .once('value', (leaderboardSnapshot) => {
              const leaderboard = leaderboardSnapshot.val() || {};

              Object.keys(leaderboard).map((key, index) => {
                if (leaderboard[key]) {
                  admin.database(leaderboardDb).ref(`leaderboard/month/${key}`).update(leaderboard[key]);
                }

                if (index > 498) {
                  console.log(key);
                }
              });

              resolve2();
            }));

            const promise5 = new Promise(resolve2 => admin.database().ref('leaderboard/year')
              .orderByKey()
              .startAt(start)
              .limitToFirst(500)
              .once('value', (leaderboardSnapshot) => {
                const leaderboard = leaderboardSnapshot.val() || {};

                Object.keys(leaderboard).map((key, index) => {
                  if (leaderboard[key]) {
                    admin.database(leaderboardDb).ref(`leaderboard/year/${key}`).update(leaderboard[key]);
                  }

                  if (index > 498) {
                    console.log(key);
                  }
                });

                resolve2();
              }));

              Promise.all([promise1, promise2, promise3, promise4, promise5]).then(() => {
                return resolve();
              }).catch(err => {
                return resolve();
              })
  })));



  exports.moveLeaderboardPoints = functions.database.ref('/moveLeaderboardPoints')
    .onWrite((change, context) => new Promise(((resolve, reject) => {
      const start = change.after.val();

      const promise1 = new Promise(resolve2 => admin.database().ref('dayLeaderboardPoints')
        .orderByKey()
        .startAt(start)
        .limitToFirst(2000)
        .once('value', (leaderboardSnapshot) => {
          const leaderboard = leaderboardSnapshot.val() || {};

          Object.keys(leaderboard).map((key, index) => {
            if (leaderboard[key]) {
              admin.database(leaderboardDb).ref(`dayLeaderboardPoints/${key}`).update(leaderboard[key]);
            }

            if (index > 1996) {
              console.log(key);
            }
          });

          resolve2();
        }));

        Promise.all([promise1]).then(() => {
          return resolve();
        }).catch(err => {
          return resolve();
        })
    })));  */


// exports.setUserIndex = functions.region('europe-west1').database.ref('/setIndex')
//  .onWrite((change, context) => new Promise(((resolve, reject) => {

if (!process.env.FUNCTION_NAME || process.env.FUNCTION_NAME === 'setUserIndex') {
  exports.setUserIndex = functions.pubsub.schedule('every 2 minutes')
    .onRun(() => new Promise(((resolve) => {
      admin.database().ref('statistics/userCount')
        .once('value', (userCountSnapshot) => {
          const userCount = userCountSnapshot.val() || 0;

          admin.database().ref('users')
            .orderByChild('userIndex')
            .equalTo('')
            .limitToFirst(15)
            .once('value', (usersSnapshot) => {
              const users = usersSnapshot.val() || {};

              let nextIndex = userCount;

              Object.keys(users).map((key) => {
                if (users[key]) {
                  nextIndex += 1;

                  admin.database().ref(`users/${key}`).update({
                    userIndex: nextIndex,
                  });
                }
                return null;
              });

              admin.database().ref('statistics').update({
                userCount: nextIndex,
              });

              resolve();
            });
        });
    })));
}

if (!process.env.FUNCTION_NAME || process.env.FUNCTION_NAME === 'setRoomIndex') {
  exports.setRoomIndex = functions.database.ref('/initRoomIndexUpdate')
    .onWrite((change, context) => new Promise(((resolve) => {
      admin.database().ref('leaderboardPoints')
        .once('value', (snapshot) => {
          const leaderboardPoints = snapshot.val() || {};

          Object.keys(leaderboardPoints).map((key) => {
            if (leaderboardPoints[key]) {
              admin.database().ref(`leaderboardPoints/${key}`).update({
                gPl: null,
              });
            }
            return null;
          });

          resolve();
        });
    })));
}


if (!process.env.FUNCTION_NAME || process.env.FUNCTION_NAME === 'setRoomLogIndex') {
  exports.setRoomLogIndex = functions.pubsub.schedule('every 2 minutes')
    .onRun(() => new Promise(((resolve) => {
      admin.database().ref('statistics/roomsPlayed')
        .once('value', (roomsPlayedSnapshot) => {
          const roomsPlayed = roomsPlayedSnapshot.val() || 0;

          admin.database(adminLogsDb).ref('adminLogs/roomIds')
            .orderByChild('index')
            .equalTo('')
            .limitToFirst(20)
            .once('value', (logSnapshot) => {
              const roomLogs = logSnapshot.val() || {};

              let nextIndex = roomsPlayed;

              Object.keys(roomLogs).map((key) => {
                if (roomLogs[key]) {
                  nextIndex += 1;

                  admin.database(adminLogsDb).ref(`adminLogs/roomIds/${key}`).update({
                    index: nextIndex,
                  });
                }
                return null;
              });

              admin.database().ref('statistics').update({
                roomsPlayed: nextIndex,
              });

              resolve();
            });
        });
    })));
}

/*
if (!process.env.FUNCTION_NAME || process.env.FUNCTION_NAME === 'setRoomLogIndex') {
  exports.setRoomLogIndex = functions.pubsub.schedule('every 2 minutes')
    .onRun(() => new Promise(((resolve) => {
      admin.database().ref('statistics/roomsPlayed2')
        .once('value', (roomsPlayedSnapshot) => {
          const roomsPlayed2 = roomsPlayedSnapshot.val() || 0;

          admin.database(adminLogsDb).ref('adminLogs/roomIds')
            .orderByChild('index')
            .equalTo('')
            .limitToFirst(10)
            .once('value', (logSnapshot) => {
              const roomLogs = logSnapshot.val() || {};

              let nextIndex = roomsPlayed2;

              Object.keys(roomLogs).map((key) => {
                if (roomLogs[key]) {
                  nextIndex += 1;

                  admin.database(adminLogsDb).ref(`adminLogs/roomIds/${key}`).update({
                    index: nextIndex,
                  });
                }
                return null;
              });

              admin.database().ref('statistics').update({
                roomsPlayed2: nextIndex,
              });

              resolve();
            });
        });
    })));
}  */

if (!process.env.FUNCTION_NAME || process.env.FUNCTION_NAME === 'setPaymentsIndex') {
  exports.setPaymentsIndex = functions.pubsub.schedule('every 10 minutes')
    .onRun(() => new Promise(((resolve) => {
      admin.database().ref('initiatedPaymentsCount/count')
        .once('value', (paymentsCountSnapshot) => {
          const paymentsCount = paymentsCountSnapshot.val() || 0;

          admin.database().ref('initiatedPayments')
            .orderByChild('index')
            .equalTo(null)
            .limitToFirst(10)
            .once('value', (paymentsSnapshot) => {
              const payments = paymentsSnapshot.val() || {};

            //  console.log(payments);

              let nextIndex = paymentsCount;

              //  const array = Object.keys(payments)
              //    .map(key => ({
              //      id: key,
              //      date: payments[key].dateInitiated || null,
              //    }));

              //  array.sort((a, b) => b.date - a.date);

              Object.keys(payments).map((key, index) => {
                if (index >= 9) {
                //  console.log(new Date(payments[key].dateInitiated));
                }
                if (payments[key]) {
                  nextIndex += 1;

                  admin.database().ref(`initiatedPayments/${key}`).update({
                    index: nextIndex,
                  });
                }
                return null;
              });

              admin.database().ref('initiatedPaymentsCount').update({
                count: nextIndex,
              });

              return resolve();
            });
        });
    })));
}


if (!process.env.FUNCTION_NAME || process.env.FUNCTION_NAME === 'removeOldPayments') {
  exports.removeOldPayments = functions.pubsub.schedule('every 30 minutes')
    .onRun(() => new Promise(((resolve) => {
          admin.database().ref('initiatedPayments')
            .orderByChild('dateInitiated')
            .startAt(1)
            .endAt(Date.now() - (1000 * 60 * 60 * 24 * 180))
            .limitToFirst(10)
            .once('value', (paymentsSnapshot) => {
              const payments = paymentsSnapshot.val() || {};

            //  console.log('payments');
            //  console.log(payments);

              Object.keys(payments).map((key, index) => {
                if (index >= 9) {
                //  console.log(new Date(payments[key].dateInitiated));
                }
                if (payments[key] && payments[key].dateInitiated && payments[key].dateInitiated < Date.now() - (1000 * 60 * 60 * 24 * 180)) {
                //  console.log('remove');
                  admin.database().ref(`initiatedPayments/${key}`).remove();
                }
                return null;
              });

              return resolve();
            });
    })));
}

if (!process.env.FUNCTION_NAME || process.env.FUNCTION_NAME === 'removeOldPayments2') {
  exports.removeOldPayments2 = functions.pubsub.schedule('every 30 minutes')
    .onRun(() => new Promise(((resolve) => {
          admin.database().ref('completedPayments')
            .orderByChild('dateInitiated')
            .startAt(1)
            .endAt(Date.now() - (1000 * 60 * 60 * 24 * 180))
            .limitToFirst(20)
            .once('value', (paymentsSnapshot) => {
              const payments = paymentsSnapshot.val() || {};

            //  console.log('payments');
            //  console.log(payments);

              Object.keys(payments).map((key, index) => {
                if (index >= 19) {
                  console.log(new Date(payments[key].dateInitiated));
                }
                if (payments[key] && payments[key].dateInitiated && payments[key].dateInitiated < Date.now() - (1000 * 60 * 60 * 24 * 180)) {
                //  console.log('remove');
                  admin.database().ref(`completedPayments/${key}`).remove();
                }
                return null;
              });

              return resolve();
            });
    })));
}




if (!process.env.FUNCTION_NAME || process.env.FUNCTION_NAME === 'setPaymentsIndex2') {
  exports.setPaymentsIndex2 = functions.pubsub.schedule('every 10 minutes')
    .onRun(() => new Promise(((resolve) => {
      admin.database().ref('completedPaymentsCount/count')
        .once('value', (paymentsCountSnapshot) => {
          const paymentsCount = paymentsCountSnapshot.val() || 0;

          admin.database().ref('completedPayments')
            .orderByChild('index')
            .equalTo(null)
            .limitToFirst(20)
            .once('value', (paymentsSnapshot) => {
              const payments = paymentsSnapshot.val() || {};

              let nextIndex = paymentsCount;

              Object.keys(payments).map((key, index) => {
                if (index >= 19) {
                //  console.log(new Date(payments[key].dateInitiated));
                }
                if (payments[key]) {
                  nextIndex += 1;

                  admin.database().ref(`completedPayments/${key}`).update({
                    index: nextIndex,
                  });
                }
                return null;
              });

              admin.database().ref('completedPaymentsCount').update({
                count: nextIndex,
              });

              return resolve();
            });
        });
    })));
}




if (!process.env.FUNCTION_NAME || process.env.FUNCTION_NAME === 'setCompletedPaymentsIndexManual') {
  exports.setCompletedPaymentsIndexManual = functions.database.ref('/testData/setCompletedPaymentsIndex')
    .onUpdate((change, context) => new Promise(((resolve) => {

      admin.database().ref('completedPayments')
        .orderByChild('dateInitiated')
        .once('value', (snapshot) => {
          let nextIndex = 0;
          const updates = {};
          snapshot.forEach(((childSnapshot) => {
            const val = childSnapshot.val() || {};

            nextIndex += 1;

            updates[`${childSnapshot.key}`] = {
              nextIndex,
            };
          }));

          admin.database(leaderboardDb).ref('completedPayments2').update(updates).then(() => {
            admin.database().ref('completedPaymentsCount').update({
              count: nextIndex,
            });

            return resolve('success');
          });

        /*  Object.keys(completedPayments).map((key, index) => {

            admin.database().ref(`rooms/${key}`).remove();
            admin.database().ref(`chat/${key}`).remove();
            admin.database().ref(`adminLogs/rooms/${key}`).remove();
            admin.database().ref(`adminLogs/roomIds/${key}`).remove();
            admin.database(adminLogsDb).ref(`adminLogs/rooms/${key}`).remove();
            admin.database(adminLogsDb).ref(`adminLogs/roomIds/${key}`).remove();
            return null;
          });  */

          return resolve();
        });
    })));
}


if (!process.env.FUNCTION_NAME || process.env.FUNCTION_NAME === 'removeOldSupportChats') {
  exports.removeOldSupportChats = functions.pubsub.schedule('every 30 minutes')
    .onRun(() => new Promise(((resolve) => {
          admin.database().ref('supportChat/activeChats')
            .orderByChild('lastResponse')
            .startAt(1)
            .endAt(Date.now() - (1000 * 60 * 60 * 24 * 17))
            .limitToFirst(5)
            .once('value', (activeChatsSnapshot) => {
              const activeChats = activeChatsSnapshot.val() || {};

            //  console.log('activeChats');
            //  console.log(activeChats);

              Object.keys(activeChats).map((key, index) => {
                if (index >= 4) {
                  console.log(new Date(activeChats[key].lastResponse));
                }
                if (activeChats[key] && activeChats[key].lastResponse && activeChats[key].lastResponse < Date.now() - (1000 * 60 * 60 * 24 * 17)) {
                  admin.database().ref(`supportChat/activeChats/${key}`).remove();
                  admin.database().ref(`supportChat/messages/${key}`).remove();
                }
                return null;
              });

              return resolve();
            });
    })));
}


if (!process.env.FUNCTION_NAME || process.env.FUNCTION_NAME === 'setBansIndex') {
  exports.setBansIndex = functions.pubsub.schedule('every 10 minutes')
    .onRun(() => new Promise(((resolve) => {
      admin.database().ref('statistics/bansCount')
        .once('value', (bansCountSnapshot) => {
          const bansCount = bansCountSnapshot.val() || 0;

          admin.database().ref('bans')
            .orderByChild('index')
            .equalTo(null)
            .limitToFirst(10)
            .once('value', (bansSnapshot) => {
              const bans = bansSnapshot.val() || {};

              let nextIndex = bansCount;

              Object.keys(bans).map((key) => {
                if (bans[key]) {
                  nextIndex += 1;

                  admin.database().ref(`bans/${key}`).update({
                    index: nextIndex,
                  });
                }
                return null;
              });

              admin.database().ref('statistics').update({
                bansCount: nextIndex,
              });

              return resolve();
            });
        });
    })));
}


// On Update to rooms players
if (!process.env.FUNCTION_NAME || process.env.FUNCTION_NAME === 'onRoomPlayersUpdate') {
  exports.onRoomPlayersUpdate = functions.database.instance('zole-app-rooms').ref('/rooms/{roomId}/playersList')
    .onWrite((change, context) => new Promise(((resolve, reject) => {
      const onRoomPlayersUpdate = require('./game/onRoomPlayersUpdate');
      onRoomPlayersUpdate(change, context).then((res) => {
      //  console.log(res);
        resolve();
      }).catch((err) => {
      //  console.log(err);
        reject(err);
      });
    })));
}


// On adding card to table
if (!process.env.FUNCTION_NAME || process.env.FUNCTION_NAME === 'onCardAddedToTable') {
  exports.onCardAddedToTable = functions.database.instance('zole-app-rooms').ref('/rooms/{roomId}/curRnd/currentTable')
    .onWrite((change, context) => new Promise(((resolve, reject) => {
      const onCardAddedToTable = require('./game/onCardAddedToTable');

      onCardAddedToTable(change, context).then(res => resolve()).catch(err => reject(err));
    })));
}


// Function to play a card called by player
/* if (!process.env.FUNCTION_NAME || process.env.FUNCTION_NAME === 'playCard') {
  exports.playCard = functions.https.onRequest(require('./game/playCard'));
}  */

if (!process.env.FUNCTION_NAME || process.env.FUNCTION_NAME === 'onCardBurried') {
  exports.onCardBurried = functions.database.ref('/rooms/{roomId}/curRnd/cardBurried')
    .onWrite((change, context) => new Promise(((resolve, reject) => {
      const onCardBurried = require('./game/onCardBurried');

      const playedCard = change.after.val() || null;

      if (playedCard && playedCard !== 0) {
        return onCardBurried(change.after, context).then(res => resolve(res)).catch(err => reject(err));
      } else {
        return resolve();
      }

    })));
}

if (!process.env.FUNCTION_NAME || process.env.FUNCTION_NAME === 'onCardBurried2') {
  exports.onCardBurried2 = functions.database.instance('zole-app-rooms').ref('/rooms/{roomId}/curRnd/cardBurried')
    .onWrite((change, context) => new Promise(((resolve, reject) => {
      const onCardBurried = require('./game/onCardBurried');

      const playedCard = change.after.val() || null;

    //  if (playedCard) {
    //    console.log(context.params.roomId);
    //    console.log(playedCard);
    //  }

      if (playedCard && playedCard !== 0) {
        return onCardBurried(change.after, context).then(res => resolve(res)).catch(err => reject(err));
      } else {
        return resolve();
      }

    })));
}


if (!process.env.FUNCTION_NAME || process.env.FUNCTION_NAME === 'onCardPlayed') {
  exports.onCardPlayed = functions.database.instance('zole-app-rooms').ref('/rooms/{roomId}/curRnd/cardPlayed2')
    .onWrite((change, context) => new Promise(((resolve, reject) => {
      const onCardPlayed = require('./game/onCardPlayed');

      const playedCard = change.after.val() || null;
      const beforeData = change.after.val() || null;

      if (playedCard && playedCard !== 0) {
        return onCardPlayed(change.after, context).then(res => resolve(res)).catch(err => reject(err));
      //  return resolve();
      } else {
        return resolve();
      }
    })));
}

if (!process.env.FUNCTION_NAME || process.env.FUNCTION_NAME === 'onCardPlayed4') {
  exports.onCardPlayed4 = functions.database.ref('/rooms/{roomId}/curRnd/cardPlayed2')
    .onWrite((change, context) => new Promise(((resolve, reject) => {
      const onCardPlayed = require('./game/onCardPlayed');

      const playedCard = change.after.val() || null;
      const beforeData = change.after.val() || null;

      if (playedCard) {
        console.log(context.params.roomId);
        console.log(playedCard);
      }

      if (playedCard && playedCard !== 0) {
        return onCardPlayed(change.after, context).then(res => resolve(res)).catch(err => reject(err));
      } else {
        return resolve();
      }
    })));
}


/*
if (!process.env.FUNCTION_NAME || process.env.FUNCTION_NAME === 'cleanDetailedLogs') {
  exports.cleanDetailedLogs = functions.pubsub.schedule('every 24 hours')
    .onRun(() => new Promise(((resolve) => {
      console.log('Get data');
      admin.database().ref('detailedLogs/datekeys').once('value', (datekeysSnapshot) => {
        const nowTS = new Date().getTime();

        const detekeysObj = datekeysSnapshot.val() || {};
        const detekeys = Object.keys(detekeysObj);

        for (const detekey of detekeys) {
          const dateKeyStr = detekey.toString();
          const detekeyParts = [dateKeyStr.slice(0, 4), dateKeyStr.slice(4, 6), dateKeyStr.slice(6)];
          const detekeyDateStr = `${detekeyParts[1]}/${detekeyParts[2]}/${detekeyParts[0]}`;
          const detekeyTS = new Date(detekeyDateStr).getTime();

          const dateDelta = nowTS - detekeyTS;

          if (dateDelta > 259200000) { // 3 days
            admin.database().ref(`detailedLogs/${detekey}`).remove();
            admin.database().ref(`detailedLogs/datekeys/${detekey}`).remove();
          }
        }

        resolve();
      });
    })));
}
*/


// Choose gametype when playing
if (!process.env.FUNCTION_NAME || process.env.FUNCTION_NAME === 'chooseGameType') {
  exports.chooseGameType = functions.https.onRequest(require('./game/chooseGameType'));
}


if (!process.env.FUNCTION_NAME || process.env.FUNCTION_NAME === 'closeResultNotification') {
  exports.closeResultNotification = functions.https.onRequest(require('./game/closeResultNotification'));
}


if (!process.env.FUNCTION_NAME || process.env.FUNCTION_NAME === 'closeResultNotification2') {
  exports.closeResultNotification2 = functions.https.onRequest(require('./game/closeResultNotification2'));
}

// End the round by droping cards
if (!process.env.FUNCTION_NAME || process.env.FUNCTION_NAME === 'quitRound') {
  exports.quitRound = functions.https.onRequest(require('./game/quitRound'));
}


// Set game to last round
if (!process.env.FUNCTION_NAME || process.env.FUNCTION_NAME === 'setLastRound') {
  exports.setLastRound = functions.https.onRequest(require('./game/setLastRound'));
}


// Create a new regular room
if (!process.env.FUNCTION_NAME || process.env.FUNCTION_NAME === 'createRoom') {
  exports.createRoom = functions.https.onRequest(require('./room/createRoom'));
}


// Join an existing regular room
if (!process.env.FUNCTION_NAME || process.env.FUNCTION_NAME === 'joinRoom') {
  exports.joinRoom = functions.https.onRequest(require('./room/joinRoom'));
}


if (!process.env.FUNCTION_NAME || process.env.FUNCTION_NAME === 'joinRoom2') {
  exports.joinRoom2 = functions.https.onRequest(require('./room/joinRoom2'));
}


if (!process.env.FUNCTION_NAME || process.env.FUNCTION_NAME === 'joinRoom3') {
  exports.joinRoom3 = functions.https.onRequest(require('./room/joinRoom3'));
}


// End room function called when turn timer runs out
/*
if (!process.env.FUNCTION_NAME || process.env.FUNCTION_NAME === 'endRoom') {
  exports.endRoom = functions.https.onRequest(require('./room/endRoom'));
} */

// End room function called when turn timer runs out
if (!process.env.FUNCTION_NAME || process.env.FUNCTION_NAME === 'endRoom2') {
  exports.endRoom2 = functions.https.onRequest(require('./room/endRoom2'));
}


// On player points change
if (!process.env.FUNCTION_NAME || process.env.FUNCTION_NAME === 'onPlayerMissedTurn') {
  exports.onPlayerMissedTurn = functions.database.instance('zole-app-rooms').ref('/rooms/{roomId}/globalParams/missedTurn')
    .onWrite((change, context) => new Promise(((resolve, reject) => {
      const onPlayerMissedTurn = require('./room/onPlayerMissedTurn');

      const afterData = change.after.val();

      if (afterData === true) {
        return onPlayerMissedTurn(change.after, context).then((res) => {
        //  console.log(res);
          return resolve();
        }).catch((err) => {
        //  console.log(err);
          return reject(err);
        });
      } else {
        return resolve();
      }
    })));
}


// Leave room executed when player clicks leave room button
if (!process.env.FUNCTION_NAME || process.env.FUNCTION_NAME === 'leaveRoom') {
  exports.leaveRoom = functions.https.onRequest(require('./room/leaveRoom'));
}

if (!process.env.FUNCTION_NAME || process.env.FUNCTION_NAME === 'leaveRoom2') {
  exports.leaveRoom2 = functions.https.onRequest(require('./room/leaveRoom'));
}

// Leave room executed when player clicks leave room button
if (!process.env.FUNCTION_NAME || process.env.FUNCTION_NAME === 'leaveRoomMenu') {
  exports.leaveRoomMenu = functions.https.onRequest(require('./room/leaveRoomMenu'));
}


// Called after FB auth, to authenticate in firebase using FB
if (!process.env.FUNCTION_NAME || process.env.FUNCTION_NAME === 'afterFBAuth') {
  exports.afterFBAuth = functions.region('europe-west1').https.onRequest(require('./user/afterFBAuth'));
}


// Set emotion in room
if (!process.env.FUNCTION_NAME || process.env.FUNCTION_NAME === 'setEmotion') {
  exports.setEmotion = functions.region('europe-west1').https.onRequest(require('./user/setEmotion'));
}



/*
// Send gifts to users in room
if (!process.env.FUNCTION_NAME || process.env.FUNCTION_NAME === 'sendGift') {
  exports.sendGift = functions.region('europe-west1').https.onRequest(require('./user/sendGift'));
}  */

// Send gifts to users in room
if (!process.env.FUNCTION_NAME || process.env.FUNCTION_NAME === 'sendGift2') {
  exports.sendGift2 = functions.region('europe-west1').https.onRequest(require('./user/sendGift2'));
}

if (!process.env.FUNCTION_NAME || process.env.FUNCTION_NAME === 'afterEmailRegistration') {
  exports.afterEmailRegistration = functions.region('europe-west1').https.onRequest(require('./user/afterEmailRegistration'));
}


// On user connection changes
if (!process.env.FUNCTION_NAME || process.env.FUNCTION_NAME === 'onPlayerStatusCreate') {
  exports.onPlayerStatusCreate = functions.database.instance('zole-app-status').ref('/status/{userId}')
    .onCreate((snapshot, context) => new Promise(((resolve, reject) => {
      const onPlayerStatusCreate = require('./user/onPlayerStatusCreate');
      onPlayerStatusCreate(snapshot, context).then((res) => {
        //  console.log(res);
        resolve();
      }).catch((err) => {
        //  console.log(err);
        reject(err);
      });
    })));
}


// On user connection changes
if (!process.env.FUNCTION_NAME || process.env.FUNCTION_NAME === 'onPlayerStatusRemove') {
  exports.onPlayerStatusRemove = functions.database.instance('zole-app-status').ref('/status/{userId}')
    .onDelete((snapshot, context) => new Promise(((resolve, reject) => {
      const onPlayerStatusRemove = require('./user/onPlayerStatusRemove');
      onPlayerStatusRemove(snapshot, context).then((res) => {
        //  console.log(res);
        resolve();
      }).catch((err) => {
        //  console.log(err);
        reject(err);
      });
    })));
}


if (!process.env.FUNCTION_NAME || process.env.FUNCTION_NAME === 'onRoomRemoved') {
  exports.onRoomRemoved = functions.database.instance('zole-app-rooms-public').ref('/roomsPubInf/{roomId}')
    .onDelete((snapshot, context) => new Promise(((resolve, reject) => {
      const onRoomRemoved = require('./room/onRoomRemoved');
      onRoomRemoved(snapshot, context).then((res) => {
        //  console.log(res);
        resolve();
      }).catch((err) => {
        //  console.log(err);
        reject(err);
      });
    })));
}

if (!process.env.FUNCTION_NAME || process.env.FUNCTION_NAME === 'onRoomClosed') {
  exports.onRoomClosed = functions.database.instance('zole-app-rooms').ref('/rooms/{roomId}/globalParams/roomClosed')
    .onWrite((change, context) => new Promise(((resolve, reject) => {
      const onRoomClosed = require('./room/onRoomClosed');
      onRoomClosed(change, context).then((res) => {
        resolve();
      }).catch((err) => {
        reject(err);
      });
    })));
}


/*
if (!process.env.FUNCTION_NAME || process.env.FUNCTION_NAME === 'onRoomClosed') {
  exports.onRoomClosed = functions.database.ref('/rooms/{roomId}/globalParams/roomClosed')
    .onUpdate((change, context) => new Promise(((resolve) => {
      const { roomId } = context.params;
    //  console.log(`room ${roomId} has been closed`);

      admin.database().ref(`chat/${roomId}`).remove();

      return resolve();
    })));
} */

if (!process.env.FUNCTION_NAME || process.env.FUNCTION_NAME === 'stripePaymentCallbackLive') {
  exports.stripePaymentCallbackLive = functions.https.onRequest(require('./user/stripePaymentCallbackLive'));
}

if (!process.env.FUNCTION_NAME || process.env.FUNCTION_NAME === 'stripePaymentCallbackTest') {
  exports.stripePaymentCallbackTest = functions.https.onRequest(require('./user/stripePaymentCallbackTest'));
}


if (!process.env.FUNCTION_NAME || process.env.FUNCTION_NAME === 'removeInactiveStatus') {
  exports.removeInactiveStatus = functions.pubsub.schedule('every 4 minutes')
    .onRun(() => new Promise(((resolve) => {
      admin.database(statusDb).ref('status')
        .orderByChild('lastAction')
        .startAt(null)
        .endAt(Date.now() - (1000 * 60 * 15))
        .once('value', (usersSnapshot) => {
          const inactiveUsers = usersSnapshot.val() || {};

        //  console.log('inactiveUsers');
        //  console.log(inactiveUsers);

          Object.keys(inactiveUsers).map((key) => {
            if (inactiveUsers[key]) {
              admin.database(statusDb).ref(`status/${key}`).remove();
            //  admin.database().ref(`users/${key}/joinedRooms`).remove();
            }
            return null;
          });

          return resolve();
        });

      //  return resolve();
    })));
}

// On player balance change
if (!process.env.FUNCTION_NAME || process.env.FUNCTION_NAME === 'onUserBalChange') {
  exports.onUserBalChange = functions.database.ref('/users/{userId}/bal')
    .onUpdate((change, context) => new Promise(((resolve, reject) => {
      const onUserBalChange = require('./user/onUserBalChange');

      onUserBalChange(change, context).then((res) => {
        //  console.log(res);
        resolve();
      }).catch((err) => {
        //  console.log(err);
        reject(err);
      });
    })));
}


// On player level change
if (!process.env.FUNCTION_NAME || process.env.FUNCTION_NAME === 'onUserLvlChange') {
  exports.onUserLvlChange = functions.database.ref('/users/{userId}/lvl')
    .onUpdate((change, context) => new Promise(((resolve, reject) => {
      const onUserLvlChange = require('./user/onUserLvlChange');

      onUserLvlChange(change, context).then((res) => {
      //  console.log(res);
        resolve();
      }).catch((err) => {
      //  console.log(err);
        reject(err);
      });
    })));
}


// On player points change
if (!process.env.FUNCTION_NAME || process.env.FUNCTION_NAME === 'onUserPointsChange') {
  exports.onUserPointsChange = functions.database.ref('/users/{userId}/totalPnts')
    .onUpdate((change, context) => new Promise(((resolve, reject) => {
      const onUserPointsChange = require('./user/onUserPointsChange');
      onUserPointsChange(change, context).then((res) => {
      //  console.log(res);
        resolve();
      }).catch((err) => {
      //  console.log(err);
        reject(err);
      });
    })));
}


// On players played games increase call CheckPlayerLevelUp
if (!process.env.FUNCTION_NAME || process.env.FUNCTION_NAME === 'onPlayerGamesPlayedUpdate') {
  exports.onPlayerGamesPlayedUpdate = functions.database.ref('/users/{userId}/gPlayed')
    .onUpdate((change, context) => new Promise(((resolve, reject) => {
      const checkPlayerLevelUp = require('./user/checkPlayerLevelUp');

      checkPlayerLevelUp(change, context).then((res) => {
        //  console.log(res);
        resolve();
      }).catch((err) => {
        //  console.log(err);
        reject(err);
      });
    })));
}

if (!process.env.FUNCTION_NAME || process.env.FUNCTION_NAME === 'closeLevelNotification') {
  exports.closeLevelNotification = functions.https.onRequest(require('./user/closeLevelNotification'));
}


// Spin bonus wheel
if (!process.env.FUNCTION_NAME || process.env.FUNCTION_NAME === 'spinBonusWheel2') {
  exports.spinBonusWheel2 = functions.https.onRequest(require('./user/spinBonusWheel2'));
}


// Spin bonus wheel
if (!process.env.FUNCTION_NAME || process.env.FUNCTION_NAME === 'claimSpinResults') {
  exports.claimSpinResults = functions.https.onRequest(require('./user/claimSpinResults'));
}


// Send money to a friend
if (!process.env.FUNCTION_NAME || process.env.FUNCTION_NAME === 'sendMoney') {
  exports.sendMoney = functions.region('europe-west1').https.onRequest(require('./user/sendMoney'));
}


// On Update to players lastLogin parameter (when player comes online)
if (!process.env.FUNCTION_NAME || process.env.FUNCTION_NAME === 'onLastLoginUpdate') {
  exports.onLastLoginUpdate = functions.database.ref('/users/{userId}/lastLogin')
    .onWrite((change, context) => new Promise(((resolve) => {
      const { userStatsDB } = require('./admin');
      admin.database().ref(`userBalHistory/${context.params.userId}`)
        .orderByChild('time')
        .startAt(0)
        .endAt(Date.now() - (1000 * 60 * 60 * 24 * 14))
        .limitToFirst(20)
        .once('value', (snapshot) => {
          const history = snapshot.val();

          if (history) {
            Object.keys(history).map((key) => {
              admin.database().ref(`userBalHistory/${context.params.userId}/${key}`).remove();
              return null;
            });
          }
        });

        admin.database(userStatsDB).ref(`userBalHistory/${context.params.userId}`)
          .orderByChild('time')
          .startAt(0)
          .endAt(Date.now() - (1000 * 60 * 60 * 24 * 14))
          .limitToFirst(40)
          .once('value', (snapshot) => {
            const history = snapshot.val();

            if (history) {
              Object.keys(history).map((key) => {
                admin.database(userStatsDB).ref(`userBalHistory/${context.params.userId}/${key}`).remove();
                return null;
              });
            }
          });

      return resolve();
    })));
}


// Clear closed rooms every 1 minutes!
if (!process.env.FUNCTION_NAME || process.env.FUNCTION_NAME === 'removeClosedRooms') {
  exports.removeClosedRooms = functions.pubsub.schedule('every 1 minutes')
    .onRun(() => new Promise(((resolve) => {
      admin.database(roomsPublicDb).ref('roomsPubInf')
        .once('value', (roomsSnapshot) => {
          const rooms = roomsSnapshot.val() || {};

        let { length } = Object.keys(rooms);

        if (length || length === 0) {

        //  admin.database().ref(`roomsCount`).set(length);
        //  admin.database().ref('roomsCount')
        //    .transaction(roomsCount => length);
        }

          Object.keys(rooms).map((key) => {
            if (rooms[key].globalParams && rooms[key].globalParams.roomClosed) {
              const { players, playersList } = rooms[key];

              if (players && rooms[key].globalParams && rooms[key].globalParams.tournamentRoom) {
                Object.keys(players).map((key2) => {
                  admin.database().ref(`tournamentPlayers/${rooms[key].globalParams.tournamentId}/${players[key2].uid}/roomId`).remove();
                  return null;
                });
              }

              if (players) {
                Object.keys(players).map((key2) => {
                  admin.database().ref(`users/${players[key2].uid}/joinedRooms/${key}`).remove();
                  return null;
                });
              } else if (playersList) {
                Object.keys(playersList).map((key2) => {
                  if (key2 !== 'playerList') {
                    admin.database().ref(`users/${playersList[key2].uid}/joinedRooms/${key}`).remove();
                  }
                  return null;
                });
              }

              //  admin.database().ref(`rooms/${key}`).remove();
              admin.database().ref(`roomsPubInf/${key}`).remove();
              admin.database().ref(`roomsPubInfIds/${key}`).remove();
              admin.database().ref(`activeRooms/${key}`).remove();

              admin.database(roomsPublicDb).ref(`roomsPubInf/${key}`).remove();
              admin.database(roomsPublicDb).ref(`roomsPubInfIds/${key}`).remove();

              length = length - 1;

            //  admin.database().ref('roomsCount')
            //    .transaction(roomsCount => (parseInt(roomsCount, 10) || 0) - 1);
            } else if (!rooms[key].globalParams && !rooms[key].playersList) {
              admin.database().ref(`roomsPubInf/${key}`).remove();
              admin.database().ref(`roomsPubInfIds/${key}`).remove();
              admin.database().ref(`activeRooms/${key}`).remove();

              admin.database(roomsPublicDb).ref(`roomsPubInf/${key}`).remove();
              admin.database(roomsPublicDb).ref(`roomsPubInfIds/${key}`).remove();

              length = length - 1;

            //  admin.database().ref('roomsCount')
            //    .transaction(roomsCount => (parseInt(roomsCount, 10) || 0) - 1);
            }
            return null;
          });

          admin.database().ref('roomsCount')
            .transaction(roomsCount => length);

          return resolve();
        });
    })));
}


/*
// Clear closed rooms every 1 minutes!
if (!process.env.FUNCTION_NAME || process.env.FUNCTION_NAME === 'cleanUpCrashedRooms') {
  exports.cleanUpCrashedRooms = functions.pubsub.schedule('every 3 minutes')
    .onRun(() => new Promise(((resolve) => {
      admin.database(roomsPublicDb).ref('roomsPubInf')
        .once('value', (roomsSnapshot) => {
          const rooms = roomsSnapshot.val() || {};

          const promises = [];

          Object.keys(rooms).map((key) => {
            promises.push(new Promise(resolve2 => {
              const promise1 = admin.database().ref(`rooms/${key}/nextTimestamp`).once('value');
              const promise2 = admin.database().ref(`rooms/${key}/playersList/playerList`).once('value');

              Promise.all([promise1, promise2])
                .then((promiseRes2) => {
                  let nextTimestamp;
                  let players;

                  promiseRes2.map((res2, index) => {
                    if (res2.key === 'nextTimestamp') {
                      nextTimestamp = res2.val();
                    } else if (res2.key === 'playerList') {
                      players = res2.val() || {};
                    }
                  });

            //  admin.database().ref(`rooms/${key}`).once('value', (snapshot) => {
            //  const room = snapshot.val() || {};

            //  const { nextTimeStamp, players } = room;

              if (nextTimestamp && nextTimestamp < Date.now() + 1000 * 60) {
                if (players) {
                  Object.keys(players).map((key2) => {
                    admin.database().ref(`users/${key2}/joinedRooms/${key}`).remove();
                    return null;
                  });
                }
              //  admin.database().ref(`roomsPubInf/${key}/globalParams`).update({
              //    roomClosed: true,
              //  });

                admin.database(roomsPublicDb).ref(`roomsPubInf/${key}/globalParams`).update({
                  roomClosed: true,
                });

                admin.database().ref(`crashedRoomsLogs/${key}`).update({
                  crashed: true,
                  time: Date.now(),
                });

                admin.database().ref(`rooms/${key}/globalParams`).update({
                  roomClosed: true,
                  closeReason: {
                    reason: 'gameError',
                  },
                });
              }

              return resolve2();
            }).catch((err) => {
              console.log(err);
              return resolve2();
            })
          }));
            return null;
          });

          Promise.all(promises).then(() => resolve()).catch((err) => {
            console.log(err);
            return resolve();
          });
        });
    })));
}
*/

// Clear closed rooms every 1 minutes!
if (!process.env.FUNCTION_NAME || process.env.FUNCTION_NAME === 'cleanUpCrashedRooms2') {
  exports.cleanUpCrashedRooms2 = functions.pubsub.schedule('every 2 minutes')
    .onRun(() => new Promise(((resolve) => {
    //  const { admin, roomsPublicDb, roomsDb } = require('../admin');

      admin.database().ref('activeRooms')
        .orderByChild('time')
        .startAt(1)
        .endAt(Date.now() - (1000 * 60 * 2))
        .limitToFirst(15)
        .once('value', (roomsSnapshot) => {
          const rooms = roomsSnapshot.val() || {};

        //  console.log('rooms');
        //  console.log(rooms);

          const { length } = Object.keys(rooms);

          const promises = [];

          Object.keys(rooms).map((key) => {
            const promise1 = admin.database(roomsDb).ref(`rooms/${key}/players`).once('value');
            const promise2 = admin.database(roomsDb).ref(`rooms/${key}/globalParams/disableTimer`).once('value');
            const promise3 = admin.database(roomsDb).ref(`rooms/${key}/globalParams/roomClosed`).once('value');

          //  promises.push(new Promise(resolve2 => admin.database().ref(`rooms/${key}/players`).once('value', (snapshot) => {

            promises.push(new Promise(resolve2 => Promise.all([promise1, promise2, promise3]).then((promisesRes) => {
            //  const players = snapshot.val() || {};
              let players;
              let disableTimer;
              let roomClosed;

              promisesRes.map((promiseRes, index) => {
                if (index === 0) {
                  players = promiseRes.val() || null;
                } else if (index === 1) {
                  disableTimer = promiseRes.val() || false;
                }else if (index === 2) {
                  roomClosed = promiseRes.val();
                }
              })

              if (!roomClosed && !disableTimer && players && players.player1 && players.player2 && players.player3) {
                Object.keys(players).map((key2) => {
                  admin.database().ref(`users/${players[key2].uid}/joinedRooms/${key}`).remove();
                  return null;
                });

              //  admin.database().ref(`roomsPubInf/${key}/globalParams`).update({
              //    roomClosed: true,
              //  });

                admin.database(roomsPublicDb).ref(`roomsPubInf/${key}/globalParams`).update({
                  roomClosed: true,
                });

                admin.database().ref(`crashedRoomsLogs/${key}`).update({
                  crashed: true,
                  time: Date.now(),
                });

                admin.database().ref(`rooms/${key}/globalParams`).update({
                  roomClosed: true,
                  closeReason: {
                    reason: 'gameError',
                  },
                });

                admin.database(roomsDb).ref(`rooms/${key}/globalParams`).update({
                  roomClosed: true,
                  closeReason: {
                    reason: 'gameError',
                  },
                });

                admin.database().ref(`activeRooms/${key}`).remove();
              } else {
                admin.database().ref(`activeRooms/${key}`).remove();
              }
            //  } else if (!roomClosed && !disableTimer && !players) {
            //    admin.database().ref(`activeRooms/${key}`).remove();
            //  }

              return resolve2();
            }).catch((err) => {
              return resolve2();
            })));
            return null;
          });

          Promise.all(promises).then(() => resolve()).catch((err) => {
            return resolve();
          });
        });
    })));
}


// Clear closed online users every 1 minutes!
if (!process.env.FUNCTION_NAME || process.env.FUNCTION_NAME === 'removeUnclaimedBonus') {
  exports.removeUnclaimedBonus = functions.pubsub.schedule('every 2 minutes')
    .onRun(() => new Promise(((resolve) => {
      admin.database().ref('spinResults')
        .once('value', (spinResultsSnapshot) => {
          const spinResults = spinResultsSnapshot.val() || {};

          Object.keys(spinResults).map((key) => {
            admin.database().ref(`users/${key}/bal`)
              .transaction(bal2 => (parseInt(bal2, 10) || 0) + parseInt(spinResults[key], 10));

            admin.database().ref(`spinResults/${key}`).remove();

            return null;
          });
          return resolve();
        });
    })));
}


if (!process.env.FUNCTION_NAME || process.env.FUNCTION_NAME === 'sortLeaderboard') {
  exports.sortLeaderboard = functions.pubsub.schedule('1 * * * *')
    .onRun(() => new Promise(((resolve, reject) => {
      const sortLeaderboard = require('./leaderboard/sortLeaderboard');
      sortLeaderboard().then(res => resolve()).catch(err => reject(err));
    })));
}

if (!process.env.FUNCTION_NAME || process.env.FUNCTION_NAME === 'sortLeaderboardTop100') {
  exports.sortLeaderboardTop100 = functions.pubsub.schedule('every 15 minutes')
    .onRun(() => new Promise(((resolve, reject) => {
      const sortLeaderboardTop100 = require('./leaderboard/sortLeaderboardTop100');
      sortLeaderboardTop100().then(res => resolve()).catch(err => reject(err));
    })));
}


// Sort leaderboard every 15 minutes
if (!process.env.FUNCTION_NAME || process.env.FUNCTION_NAME === 'sortLeaderboardDay') {
  exports.sortLeaderboardDay = functions.pubsub.schedule('0 * * * *')
    .onRun(() => new Promise(((resolve, reject) => {
      const sortLeaderboardDay = require('./leaderboard/sortLeaderboardDay');
      sortLeaderboardDay().then(res => resolve()).catch(err => reject(err));
    })));
}

if (!process.env.FUNCTION_NAME || process.env.FUNCTION_NAME === 'sortLeaderboardDayTop100') {
  exports.sortLeaderboardDayTop100 = functions.pubsub.schedule('every 15 minutes')
    .onRun(() => new Promise(((resolve, reject) => {
      const sortLeaderboardDayTop100 = require('./leaderboard/sortLeaderboardDayTop100');
      sortLeaderboardDayTop100().then(res => resolve()).catch(err => reject(err));
    })));
}

if (!process.env.FUNCTION_NAME || process.env.FUNCTION_NAME === 'sortLeaderboardWeek') {
  exports.sortLeaderboardWeek = functions.pubsub.schedule('59 * * * *')
    .onRun(() => new Promise(((resolve, reject) => {
      const sortLeaderboardWeek = require('./leaderboard/sortLeaderboardWeek');
      sortLeaderboardWeek().then(res => resolve()).catch(err => reject(err));
    })));
}

if (!process.env.FUNCTION_NAME || process.env.FUNCTION_NAME === 'sortLeaderboardWeekTop100') {
  exports.sortLeaderboardWeekTop100 = functions.pubsub.schedule('every 15 minutes')
    .onRun(() => new Promise(((resolve, reject) => {
      const sortLeaderboardWeekTop100 = require('./leaderboard/sortLeaderboardWeekTop100');
      sortLeaderboardWeekTop100().then(res => resolve()).catch(err => reject(err));
    })));
}

if (!process.env.FUNCTION_NAME || process.env.FUNCTION_NAME === 'sortLeaderboardMonth') {
  exports.sortLeaderboardMonth = functions.pubsub.schedule('2 * * * *')
    .onRun(() => new Promise(((resolve, reject) => {
      const sortLeaderboardMonth = require('./leaderboard/sortLeaderboardMonth');
      sortLeaderboardMonth().then(res => resolve()).catch(err => reject(err));
    })));
}

if (!process.env.FUNCTION_NAME || process.env.FUNCTION_NAME === 'sortLeaderboardMonthTop100') {
  exports.sortLeaderboardMonthTop100 = functions.pubsub.schedule('every 15 minutes')
    .onRun(() => new Promise(((resolve, reject) => {
      const sortLeaderboardMonthTop100 = require('./leaderboard/sortLeaderboardMonthTop100');
      sortLeaderboardMonthTop100().then(res => resolve()).catch(err => reject(err));
    })));
}

if (!process.env.FUNCTION_NAME || process.env.FUNCTION_NAME === 'sortLeaderboardYear') {
  exports.sortLeaderboardYear = functions.pubsub.schedule('3 * * * *')
    .onRun(() => new Promise(((resolve, reject) => {
      const sortLeaderboardYear = require('./leaderboard/sortLeaderboardYear');
      sortLeaderboardYear().then(res => resolve()).catch(err => reject(err));
    })));
}

if (!process.env.FUNCTION_NAME || process.env.FUNCTION_NAME === 'sortLeaderboardYearTop100') {
  exports.sortLeaderboardYearTop100 = functions.pubsub.schedule('every 15 minutes')
    .onRun(() => new Promise(((resolve, reject) => {
      const sortLeaderboardYearTop100 = require('./leaderboard/sortLeaderboardYearTop100');
      sortLeaderboardYearTop100().then(res => resolve()).catch(err => reject(err));
    })));
}


if (!process.env.FUNCTION_NAME || process.env.FUNCTION_NAME === 'resetDailyLeaderboard') {
  exports.resetDailyLeaderboard = functions.pubsub.schedule('0 0 * * *')
    .timeZone('Europe/Riga')
    .onRun(() => new Promise(((resolve) => {
      admin.database().ref('dailyLeaderboardPoints').remove();
      admin.database(leaderboardDb).ref('dailyLeaderboardPoints').remove();

      admin.database().ref('usersNames').once('value').then((snapshot) => {
        const updates = {};
        snapshot.forEach(((childSnapshot) => {
            const val = childSnapshot.val() || {};
        //  const { name, lvl } = val;

          //  updates[`${childSnapshot.key}/name`] = val.name || '';
          //  updates[`${childSnapshot.key}/lvl`] = val.lvl || 0;
        //  updates[`${childSnapshot.key}/totalPnts`] = 0;
        //  updates[`${childSnapshot.key}/gPlayed`] = null;
        //  updates[`${childSnapshot.key}/bal`] = 0;
        //  updates[`${childSnapshot.key}/pos`] = null;

          updates[`${childSnapshot.key}`] = {
            totalPnts: 0,
            gPlayed: null,
            bal: 0,
            pos: null,
            name: val.name || '',
            lvl: val.lvl || 1,
          };
        }));

      //  admin.database().ref('leaderboard/daily').update(updates).then(() => {
          admin.database(leaderboardDb).ref('leaderboard/daily').update(updates).then(() => {
            resolve('success');
          });
        //  resolve('success');
      //  });
      });
    })));
}


if (!process.env.FUNCTION_NAME || process.env.FUNCTION_NAME === 'resetWeekLeaderboard') {
  exports.resetWeekLeaderboard = functions.pubsub.schedule('0 0 * * 1')
    .timeZone('Europe/Riga')
    .onRun(() => new Promise(((resolve) => {
      admin.database().ref('weekLeaderboardPoints').remove();
      admin.database(leaderboardDb).ref('weekLeaderboardPoints').remove();

      admin.database().ref('usersNames').once('value').then((snapshot) => {
        const updates = {};
        snapshot.forEach(((childSnapshot) => {
          const val = childSnapshot.val() || {};
      //    updates[`${childSnapshot.key}/totalPnts`] = 0;
        //  updates[`${childSnapshot.key}/gPlayed`] = null;
        //  updates[`${childSnapshot.key}/bal`] = 0;
        //  updates[`${childSnapshot.key}/pos`] = null;

          updates[`${childSnapshot.key}`] = {
            totalPnts: 0,
            gPlayed: null,
            bal: 0,
            pos: null,
            name: val.name || '',
            lvl: val.lvl || 1,
          };
        }));

      //  admin.database().ref('leaderboard/week').update(updates).then(() => {
          admin.database(leaderboardDb).ref('leaderboard/week').update(updates).then(() => {
            resolve('success');
          });
        //  resolve('success');
      //  });
      });
    })));
}


if (!process.env.FUNCTION_NAME || process.env.FUNCTION_NAME === 'resetMonthLeaderboard') {
  exports.resetMonthLeaderboard = functions.pubsub.schedule('0 0 1 * *')
    .timeZone('Europe/Riga')
    .onRun(() => new Promise(((resolve) => {
      admin.database().ref('monthLeaderboardPoints').remove();
      admin.database(leaderboardDb).ref('monthLeaderboardPoints').remove();

      admin.database().ref('usersNames').once('value').then((snapshot) => {
        const updates = {};
        snapshot.forEach(((childSnapshot) => {
          const val = childSnapshot.val() || {};
        //  updates[`${childSnapshot.key}/totalPnts`] = 0;
        //  updates[`${childSnapshot.key}/gPlayed`] = null;
        //  updates[`${childSnapshot.key}/bal`] = 0;
        //  updates[`${childSnapshot.key}/pos`] = null;

          updates[`${childSnapshot.key}`] = {
            totalPnts: 0,
            gPlayed: null,
            bal: 0,
            pos: null,
            name: val.name || '',
            lvl: val.lvl || 1,
          };
        }));

      //  admin.database().ref('leaderboard/month').update(updates).then(() => {
          admin.database(leaderboardDb).ref('leaderboard/month').update(updates).then(() => {
            resolve('success');
          });
        //  resolve('success');
      //  });
      });
    })));
}


if (!process.env.FUNCTION_NAME || process.env.FUNCTION_NAME === 'resetYearLeaderboard') {
  exports.resetYearLeaderboard = functions.pubsub.schedule('0 0 1 1 *')
    .timeZone('Europe/Riga')
    .onRun(() => new Promise(((resolve) => {
      admin.database().ref('yearLeaderboardPoints').remove();
      admin.database(leaderboardDb).ref('yearLeaderboardPoints').remove();

      admin.database().ref('usersNames').once('value').then((snapshot) => {
        const updates = {};
        snapshot.forEach(((childSnapshot) => {
          const val = childSnapshot.val() || {};
        //  updates[`${childSnapshot.key}/totalPnts`] = 0;
        //  updates[`${childSnapshot.key}/gPlayed`] = null;
        //  updates[`${childSnapshot.key}/bal`] = 0;
        //  updates[`${childSnapshot.key}/pos`] = null;

          updates[`${childSnapshot.key}`] = {
            totalPnts: 0,
            gPlayed: null,
            bal: 0,
            pos: null,
            name: val.name || '',
            lvl: val.lvl || 1,
          };
        }));

        admin.database().ref('leaderboard/year').update(updates).then(() => {
          admin.database(leaderboardDb).ref('leaderboard/year').update(updates).then(() => {
            resolve('success');
          });
        //  resolve('success');
        });
      });
    })));
}


// Unban users every 5 minutes
if (!process.env.FUNCTION_NAME || process.env.FUNCTION_NAME === 'unbanUsers') {
  exports.unbanUsers = functions.pubsub.schedule('every 5 minutes')
    .onRun(() => new Promise(((resolve, reject) => {
    // Select bans with endDate close to current time
      const startDateLimit = Date.now() - 1000 * 60 * 60;
      const endDateLimit = Date.now() + 1000 * 60 * 3;

      admin.database().ref('bans')
        .orderByChild('endDate')
        .startAt(startDateLimit)
        .endAt(endDateLimit)
        .once('value', (snapshot) => {
          snapshot.forEach((childSnapshot) => {
            const childKey = childSnapshot.key;
            const childData = childSnapshot.val();

            console.log(childKey);
            console.log(childData);

            const { endDate, blocked } = childData;

            // If blocked and endDate smaller than current date unblock user
            if (Date.now() >= endDate && blocked) {
              //  admin.database().ref(`activeBans/${childKey}`).remove();

              admin.database().ref(`bans/${childKey}`).update({
                blocked: false,
                //  endDate: null,
              });

              admin.database().ref(`users/${childKey}`).update({
                blocked: false,
              });
              // If not blocked and endDate larger than current date block user
            } else if (Date.now() < endDate && !blocked) {
              admin.database().ref(`bans/${childKey}`).update({
                blocked: true,
              });

              admin.database().ref(`users/${childKey}`).update({
                blocked: true,
              });
            }
          });
          resolve();
        })
        .catch((err) => {
          reject(err);
        });
    })));
}


// Delete user (by admin)
if (!process.env.FUNCTION_NAME || process.env.FUNCTION_NAME === 'deleteUser') {
  exports.deleteUser = functions.https.onRequest(require('./admin/deleteUser'));
}

// Message all users (by admin)
if (!process.env.FUNCTION_NAME || process.env.FUNCTION_NAME === 'messageAll') {
  exports.messageAll = functions.https.onRequest(require('./admin/messageAll'));
}

// Disable turn timer (by admin)
if (!process.env.FUNCTION_NAME || process.env.FUNCTION_NAME === 'disableTimer') {
  exports.disableTimer = functions.https.onRequest(require('./admin/disableTimer'));
}

// Set cards to be dealt next round (by admin)
if (!process.env.FUNCTION_NAME || process.env.FUNCTION_NAME === 'setNextDealCards') {
  exports.setNextDealCards = functions.https.onRequest(require('./admin/setNextDealCards'));
}

// Join a tournament
if (!process.env.FUNCTION_NAME || process.env.FUNCTION_NAME === 'joinTournament') {
  exports.joinTournament = functions.https.onRequest(require('./tournaments/joinTournament'));
}

// Join a random tournament room
if (!process.env.FUNCTION_NAME || process.env.FUNCTION_NAME === 'joinTournamentRoom') {
  exports.joinTournamentRoom = functions.https.onRequest(require('./tournaments/joinTournamentRoom'));
}

// Buy tournament money
if (!process.env.FUNCTION_NAME || process.env.FUNCTION_NAME === 'buyTournamentMoney') {
  exports.buyTournamentMoney = functions.https.onRequest(require('./tournaments/buyTournamentMoney'));
}

// Buy tournament money from menu
if (!process.env.FUNCTION_NAME || process.env.FUNCTION_NAME === 'buyTournamentMoneyMenu') {
  exports.buyTournamentMoneyMenu = functions.https.onRequest(require('./tournaments/buyTournamentMoneyMenu'));
}

// Leave tournament after joining
if (!process.env.FUNCTION_NAME || process.env.FUNCTION_NAME === 'leaveTournament') {
  exports.leaveTournament = functions.https.onRequest(require('./tournaments/leaveTournament'));
}

// Executes on succesful player joining tournament to sort players in room if needed
/* exports.onPlayerJoinsTournamentPlay = functions.region('europe-west1').database.ref('/tourPlWaitList/{tournamentId}')
  .onWrite((change, context) => new Promise(((resolve, reject) => {
    onPlayerJoinsTournamentPlay(change, context).then((res) => {
      console.log(res);
      resolve();
    }).catch((err) => {
      console.log(err);
      reject(err);
    });
  }))); */


if (!process.env.FUNCTION_NAME || process.env.FUNCTION_NAME === 'onPlayerJoinsTournamentPlay2') {
  exports.onPlayerJoinsTournamentPlay2 = functions.region('europe-west1').database.ref('/tourPlWaitList/{tournamentId}')
    .onWrite((change, context) => new Promise(((resolve, reject) => {
      onPlayerJoinsTournamentPlay2(change, context).then((res) => {
        resolve();
      }).catch((err) => {
        reject(err);
      });
    })));
}

// Clear ended tournaments every 1 minutes!
if (!process.env.FUNCTION_NAME || process.env.FUNCTION_NAME === 'closeTournaments') {
  exports.closeTournaments = functions.pubsub.schedule('every 1 minutes')
    .onRun(() => new Promise(((resolve, reject) => {
      admin.database().ref('tournaments')
        .orderByChild('completed')
        .equalTo(false)
        .once('value', (tournamentsSnapshot) => {
          const tournaments = tournamentsSnapshot.val() || {};

          Object.keys(tournaments).map((key) => {
            const sTime = new Date(tournaments[key].startTime);
            const sDate = new Date(tournaments[key].startDate);
            const startTime = `${sTime.getHours()}:${sTime.getMinutes()}`;
            const startDate = `${sDate.getFullYear()}-${sDate.getMonth() + 1}-${sDate.getDate()}`;

            const eTime = new Date(tournaments[key].endTime);
            const eDate = new Date(tournaments[key].endDate);
            const endTime = `${eTime.getHours()}:${eTime.getMinutes()}`;
            const endDate = `${eDate.getFullYear()}-${eDate.getMonth() + 1}-${eDate.getDate()}`;

            const dateNow = new Date();

            const startMinute = sTime.getMinutes();
            const startHour = sTime.getHours();

            const endMinute = eTime.getMinutes();
            const endHour = eTime.getHours();

            const newStart = new Date(`${startDate} ${startTime}`);
            const newEnd = new Date(`${endDate} ${endTime}`);

            if (newStart < dateNow && dateNow < newEnd) {
              if (tournaments[key].everyDay) {
                const nowDateStart = new Date();
                const nowDateEnd = new Date();

                nowDateStart.setHours(startHour, startMinute, 0);
                nowDateEnd.setHours(endHour, endMinute, 0);


                if (nowDateStart < dateNow && dateNow < nowDateEnd) {
                //  console.log('Within times');
                  if (!tournaments[key].running) {
                    admin.database().ref(`tournaments/${key}`).update({
                      running: true,
                      status: 'running',
                    });
                  }
                } else {
                //  console.log('Not within times');
                  if (tournaments[key].running) {
                    admin.database().ref(`tournaments/${key}`).update({
                      running: false,
                      status: 'paused',
                    });
                  }
                }
              } else {
              //  console.log('everyDay false');
                if (!tournaments[key].running) {
                  admin.database().ref(`tournaments/${key}`).update({
                    running: true,
                    status: 'running',
                  });
                }
              }
            } else if (newStart > dateNow) {
            //  console.log('not started yet');
            } else if (newEnd < dateNow) {
            //  console.log('completed');

              giveTournamentPrizes(key, tournaments[key]).then((res) => {
              //  console.log(res);
                if (res === 'success') {
                  admin.database().ref(`tournaments/${key}`).update({
                    completed: true,
                    running: false,
                    status: 'ended',
                  });
                }
              });
            }

            return null;
          });
          return resolve('success');
        })
        .catch(err => reject(err));
    })));
}



// On draugiem auth url
exports.draugiemAuthUrl = functions.region('europe-west1').https.onRequest(draugiemAuthUrl);

// On draugiem auth
// exports.draugiemAuth = functions.region('europe-west1').https.onRequest(draugiemAuth);
if (!process.env.FUNCTION_NAME || process.env.FUNCTION_NAME === 'draugiemAuth') {
  exports.draugiemAuth = functions.region('europe-west1').https.onRequest(require('./user/draugiemAuth'));
}

// Init FB Payment
// exports.initFBPayment = functions.region('europe-west1').https.onRequest(initFBPayment);

if (!process.env.FUNCTION_NAME || process.env.FUNCTION_NAME === 'initFBPayment') {
  exports.initFBPayment = functions.region('europe-west1').https.onRequest(require('./user/initFBPayment'));
}

// FB Payment Callback
// exports.fbPaymentCallback = functions.https.onRequest(fbPaymentCallback);

if (!process.env.FUNCTION_NAME || process.env.FUNCTION_NAME === 'fbPaymentCallback') {
  exports.fbPaymentCallback = functions.https.onRequest(require('./user/fbPaymentCallback'));
}


// Init FB Payment
// exports.initDraugiemPayment = functions.region('europe-west1').https.onRequest(initDraugiemPayment);

if (!process.env.FUNCTION_NAME || process.env.FUNCTION_NAME === 'initDraugiemPayment') {
  exports.initDraugiemPayment = functions.region('europe-west1').https.onRequest(require('./user/initDraugiemPayment'));
}

// Stripe
if (!process.env.FUNCTION_NAME || process.env.FUNCTION_NAME === 'initStripePayment') {
  exports.initStripePayment = functions.region('europe-west1').https.onRequest(require('./user/initStripePayment'));
}

// Init FB Payment
// exports.draugiemPaymentCallback = functions.https.onRequest(draugiemPaymentCallback);

if (!process.env.FUNCTION_NAME || process.env.FUNCTION_NAME === 'draugiemPaymentCallback') {
  exports.draugiemPaymentCallback = functions.https.onRequest(require('./user/draugiemPaymentCallback'));
}


// FB Payment Callback
// exports.mobilePaymentCallback = functions.https.onRequest(mobilePaymentCallback);

if (!process.env.FUNCTION_NAME || process.env.FUNCTION_NAME === 'mobilePaymentCallback') {
  exports.mobilePaymentCallback = functions.https.onRequest(require('./user/mobilePaymentCallback'));
}


// Submit user error
/*
  exports.submitError = functions.region('europe-west1').https.onRequest(submitError);
*/

// On Update to currentSuccessionLosses
if (!process.env.FUNCTION_NAME || process.env.FUNCTION_NAME === 'oncurrentSuccessionLossesUpdate') {
  exports.oncurrentSuccessionLossesUpdate = functions.database.ref('/userAchievements/{userId}/currentSuccessionLosses')
    .onWrite((change, context) => new Promise(((resolve) => {
      const afterData = change.after.val() || 0;
      const { userId } = context.params;

      if (afterData > 0) {
        admin.database().ref(`userAchievements/${userId}/maxSuccessionLosses`).once('value', (maxLossesSnapshot) => {
          const maxSuccessionLosses = maxLossesSnapshot.val() || 0;

          if (afterData > maxSuccessionLosses) {
            admin.database().ref(`userAchievements/${userId}/maxSuccessionLosses`).set(afterData);
          }
        });
      }

      return resolve();
    })));
}

// On Update to currentSuccessionWins
if (!process.env.FUNCTION_NAME || process.env.FUNCTION_NAME === 'oncurrentSuccessionWinsUpdate') {
  exports.oncurrentSuccessionWinsUpdate = functions.database.ref('/userAchievements/{userId}/currentSuccessionWins')
    .onWrite((change, context) => new Promise(((resolve) => {
      const afterData = change.after.val() || 0;
      const { userId } = context.params;


      if (afterData > 0) {
        admin.database().ref(`userAchievements/${userId}/maxSuccessionWins`).once('value', (maxWinsSnapshot) => {
          const maxSuccessionWins = maxWinsSnapshot.val() || 0;

          if (afterData > maxSuccessionWins) {
            admin.database().ref(`userAchievements/${userId}/maxSuccessionWins`).set(afterData);
          }
        });
      }

      return resolve();
    })));
}


if (!process.env.FUNCTION_NAME || process.env.FUNCTION_NAME === 'userHasReachedTop100Update') {
  exports.userHasReachedTop100Update = functions.database.ref('/userHasReachedTop100/{userId}')
    .onCreate((snapshot, context) => new Promise(((resolve) => {
      const status = snapshot.val() || false;
      const { userId } = context.params;

      if (status === true) {
        admin.database().ref(`userAchievements/${userId}/reachedTop100`).transaction(score => (score || 0) + 1);
      }

      return resolve();
    })));
}

if (!process.env.FUNCTION_NAME || process.env.FUNCTION_NAME === 'resetUserHasReachedTop100') {
  exports.resetUserHasReachedTop100 = functions.pubsub.schedule('0 0 * * *')
    .timeZone('Europe/Riga')
    .onRun(() => new Promise(((resolve) => {
      admin.database().ref('userHasReachedTop100').remove();

      return resolve();
    })));
}


if (!process.env.FUNCTION_NAME || process.env.FUNCTION_NAME === 'removeOldRooms') {
  exports.removeOldRooms = functions.pubsub.schedule('every 1 minutes')
    .onRun(() => new Promise(((resolve) => {

      admin.database().ref('rooms')
        .orderByChild('nextTimestamp')
        .startAt(1)
        .endAt(Date.now() - (1000 * 60 * 60 * 24 * 15))
        .limitToFirst(10)
        .once('value', (roomsSnapshot) => {
          const rooms = roomsSnapshot.val() || {};

          Object.keys(rooms).map((key, index) => {
            if (index >= 9) {
            //  console.log(key);
              if (rooms[key].nextTimestamp) {
                console.log(new Date(rooms[key].nextTimestamp));
              }
            }

            admin.database().ref(`rooms/${key}`).remove();
            admin.database().ref(`chat/${key}`).remove();
            admin.database().ref(`adminLogs/rooms/${key}`).remove();
            admin.database().ref(`adminLogs/roomIds/${key}`).remove();
            admin.database(adminLogsDb).ref(`adminLogs/rooms/${key}`).remove();
            admin.database(adminLogsDb).ref(`adminLogs/roomIds/${key}`).remove();
            return null;
          });

          return resolve();
        });
    })));
}


/*
if (!process.env.FUNCTION_NAME || process.env.FUNCTION_NAME === 'removeOldRooms2') {
  exports.removeOldRooms2 = functions.pubsub.schedule('every 1 minutes')
    .onRun(() => new Promise(((resolve) => {

      admin.database().ref('rooms')
        .orderByChild('nextTimestamp')
        .startAt(1)
        .endAt(Date.now() - (1000 * 60 * 60 * 24 * 15))
        .limitToFirst(100)
        .once('value', (roomsSnapshot) => {
          const rooms = roomsSnapshot.val() || {};

          Object.keys(rooms).map((key, index) => {

            admin.database().ref(`rooms/${key}`).remove();
            admin.database().ref(`chat/${key}`).remove();
            admin.database().ref(`adminLogs/rooms/${key}`).remove();
            admin.database().ref(`adminLogs/roomsIds/${key}`).remove();
            admin.database(adminLogsDb).ref(`adminLogs/rooms/${key}`).remove();
            admin.database(adminLogsDb).ref(`adminLogs/roomsIds/${key}`).remove();
            return null;
          });

          resolve();
        });
    })));
}  */


if (!process.env.FUNCTION_NAME || process.env.FUNCTION_NAME === 'removeOldRoomsManual') {
  exports.removeOldRoomsManual = functions.database.ref('/testData/removeExtraRooms')
    .onUpdate((change, context) => new Promise(((resolve) => {

    //  const { roomId } = context.params;

      admin.database().ref('rooms')
        .orderByChild('nextTimestamp')
        .startAt(1)
        .endAt(Date.now() - (1000 * 60 * 60 * 24 * 15))
        .limitToFirst(100)
        .once('value', (roomsSnapshot) => {
          const rooms = roomsSnapshot.val() || {};

          Object.keys(rooms).map((key, index) => {
          //  if (index === 2) {
          //    console.log(key);
          //    console.log(rooms[key]);
          //  }

            if (index >= 99) {
            //  console.log(key);
            //  if (rooms[key].nextTimeStamp) {
            //    console.log(new Date(rooms[key].nextTimeStamp));
            //  }
              if (rooms[key].nextTimestamp) {
                console.log(new Date(rooms[key].nextTimestamp));
              }
            }

            admin.database().ref(`rooms/${key}`).remove();
            admin.database().ref(`chat/${key}`).remove();
            admin.database().ref(`adminLogs/rooms/${key}`).remove();
            admin.database().ref(`adminLogs/roomIds/${key}`).remove();
            admin.database(adminLogsDb).ref(`adminLogs/rooms/${key}`).remove();
            admin.database(adminLogsDb).ref(`adminLogs/roomIds/${key}`).remove();
            return null;
          });

          return resolve();
        });
    })));
}


/*
if (!process.env.FUNCTION_NAME || process.env.FUNCTION_NAME === 'fixUserLevels') {
    exports.fixUserLevels = functions.pubsub.schedule('every 2 minutes')
      .onRun(() => new Promise(((resolve) => {
        const fixUserLevels = require('./user/fixUserLevels');
        fixUserLevels().then((res) => {
          console.log('fixUserLevels RES');
          resolve();
        }).catch((err) => {
        //  console.log(err);
          reject(err);
        });
      })));
} */



if (!process.env.FUNCTION_NAME || process.env.FUNCTION_NAME === 'fixUsersNames') {
  exports.fixUsersNames = functions.database.ref('/fixUsersNames')
      .onWrite((change, context) => new Promise(((resolve, reject) => {
        const startAt = change.after.val();
        admin.database().ref(`users`)
        .orderByKey()
        .startAt(startAt)
        .limitToFirst(500)
        .once('value', (snapshot) => {
          const users = snapshot.val() || {};

          Object.keys(users).map((key, index) => {
            if (index > 495) {
              console.log(key);
            }
            admin.database().ref(`usersNames/${key.toString()}`).update({
              lvl: users[key].lvl,
            });

            admin.database(leaderboardDb).ref(`leaderboard/daily/${key.toString()}`).update({
              lvl: users[key].lvl,
            });

            admin.database(leaderboardDb).ref(`leaderboard/week/${key.toString()}`).update({
              lvl: users[key].lvl,
            });
          });

          return resolve();
        })
      })));
}


if (!process.env.FUNCTION_NAME || process.env.FUNCTION_NAME === 'onAchievementUpdate') {
  exports.onAchievementUpdate = functions.database.ref('/userAchievements/{userId}/{achievementId}')
    .onWrite((change, context) => new Promise(((resolve, reject) => {
      const onAchievementUpdate = require('./user/onAchievementUpdate');

      onAchievementUpdate(change, context).then(res => resolve()).catch(err => reject(err));
    })));
}

if (!process.env.FUNCTION_NAME || process.env.FUNCTION_NAME === 'resetMoneyToday') {
  exports.resetMoneyToday = functions.pubsub.schedule('1 0 * * *')
    .timeZone('Europe/Riga')
    .onRun(() => new Promise(((resolve) => {

      admin.database().ref('usersNames').once('value').then((snapshot) => {
        const updates = {};
        snapshot.forEach(((childSnapshot) => {
          const val = childSnapshot.val() || {};

          updates[`${childSnapshot.key}/moneyToday`] = null;
        }));

      //  let updates2 = {};

      //  updates2[`eOx5j0DN3GZezhpB7zGSZGGgWuf1/moneyToday`] = 0;

        admin.database().ref('userAchievementsData/moneyToday').update(updates).then(() => {
          resolve('success');
        });

    //  resolve('success');
      });
    })));
}




if (!process.env.FUNCTION_NAME || process.env.FUNCTION_NAME === 'testUserData') {
  exports.testUserData = functions.database.ref('/testUserData')
    .onWrite((change, context) => new Promise(((resolve, reject) => {
      const value = change.after.val() || null;

      const axios = require('axios');

      const appKey = '61ee303f304374a30309696a27719224';

      if (value) {
        const url = `https://api.draugiem.lv/json/?app=${appKey}&apikey=${value}&action=userdata`;

        axios.get(url)
          .then((res2) => {
            console.log('res2');
            console.log(res2);

            return resolve('success');
          })
      } else {
        return resolve('success');
      }

    //  return resolve('success');
    })));
}

if (!process.env.FUNCTION_NAME || process.env.FUNCTION_NAME === 'onNewUserRegistered') {
exports.onNewUserRegistered = functions.auth.user().onCreate((user) => {
  return new Promise(resolve => {
  console.log(user);

  const { uid, providerData } = user;

  const { email, displayName, photoURL } = providerData[0];

  if (providerData && providerData[0] && providerData[0].providerId === 'google.com') {

    return admin.database().ref(`users/${uid}`)
      .once('value', async (playerSnapshot) => {
        const playerData = playerSnapshot.val() || {};

        const { lvl, bal, synced } = playerData;

        console.log('playerData');
        console.log(playerData);

        console.log('providerData');
        console.log(providerData);

      /*  if (additionalUserInfo) {
          const firstName = additionalUserInfo.profile.first_name;
          const lastName = additionalUserInfo.profile.last_name;

          if (firstName && lastName) {
            admin.database().ref(`users/${uid}`).update({
              firstName,
              lastName,
              name: displayName,
            });
          }
        } */

        if (!playerData.uid && !synced && providerData && providerData[0] && providerData[0].providerId === 'google.com') {

        //  if (providerData && providerData[0] && providerData[0].providerId === 'google.com') {
            const trimmedName = displayName.trim();
            const punctuationless = trimmedName.replace(/[\.,-\/#!$%\^&\*;:{}=\-_`~()@\+\?><\[\]\+]/g, '');
            const finalString = punctuationless.replace(/\s{2,}/g, ' ');

            const lowerCaseName = finalString.toLowerCase();


            admin.database().ref(`users/${uid}`).update({
              uid: playerData.uid || uid,
              socId: providerData[0].uid,
              socProvider: 'google',
              name: finalString || displayName,
              lowerCaseName,
              email: email || 'no-email@spelezoli.lv',
              photo: photoURL,
              lvl: lvl || 1,
              bal: parseInt(bal, 10) || 500,
              gPlayed: playerData.gPlayed || 0,
              totalPnts: playerData.totalPnts || 0,
              gWon: playerData.gWon || 0,
              role: playerData.role || 'player',
              lastLogin: Date.now(),
              synced: true,
              userIndex: '',
              dateCreated: admin.database.ServerValue.TIMESTAMP,
              tutorialShown: true,
            });

            admin.database(leaderboardDb).ref(`leaderboard/allTime/${uid}`).update({
              name: finalString || playerData.name || displayName,
              bal: parseInt(bal, 10) || 500,
              gPlayed: playerData.gPlayed || 0,
              totalPnts: playerData.totalPnts || 0,
              lvl: lvl || 1,
            });

            admin.database(leaderboardDb).ref(`leaderboard/daily/${uid}`).update({
              name: finalString || playerData.name || displayName,
              lvl: lvl || 1,
            });

            admin.database(leaderboardDb).ref(`leaderboard/week/${uid}`).update({
              name: finalString || playerData.name || displayName,
              lvl: lvl || 1,
            });

            admin.database(leaderboardDb).ref(`leaderboard/month/${uid}`).update({
              name: finalString || playerData.name || displayName,
              lvl: lvl || 1,
            });

            admin.database(leaderboardDb).ref(`leaderboard/year/${uid}`).update({
              name: finalString || playerData.name || displayName,
              lvl: lvl || 1,
            });

            admin.database().ref(`usersNames/${uid}`).set({
              name: finalString || playerData.name || displayName,
              lvl: lvl || 1,
              dateCreated: admin.database.ServerValue.TIMESTAMP,
            });

            return resolve();
        //  }
        }

        const trimmedName = displayName.trim();
        const punctuationless = trimmedName.replace(/[\.,-\/#!$%\^&\*;:{}=\-_`~()@\+\?><\[\]\+]/g, '');
        const finalString = punctuationless.replace(/\s{2,}/g, ' ');

        const lowerCaseName = finalString.toLowerCase();

        admin.database().ref(`users/${uid.toString()}`).update({
          name: finalString || displayName || playerData.name,
          lowerCaseName: lowerCaseName || displayName.toLowerCase(),
          email: email || 'no-email@spelezoli.lv',
          photo: photoURL,
          lastLogin: Date.now(),
        });

        admin.database(leaderboardDb).ref(`leaderboard/allTime/${uid.toString()}`).update({
          name: finalString || displayName || playerData.name,
        });

        admin.database(leaderboardDb).ref(`leaderboard/daily/${uid.toString()}`).update({
          name: finalString || displayName || playerData.name,
        });

        admin.database(leaderboardDb).ref(`leaderboard/week/${uid.toString()}`).update({
          name: finalString || displayName || playerData.name,
        });

        admin.database(leaderboardDb).ref(`leaderboard/month/${uid.toString()}`).update({
          name: finalString || displayName || playerData.name,
        });

        admin.database(leaderboardDb).ref(`leaderboard/year/${uid.toString()}`).update({
          name: finalString || displayName || playerData.name,
        });

        admin.database(leaderboardDb).ref(`usersNames/${uid.toString()}`).set({
          name: finalString || displayName || playerData.name,
        });

        return resolve();
      }).catch(() => res.status(200).send({ data: 'Error updating user data' }));
    }

    return resolve();

  })
});
}
