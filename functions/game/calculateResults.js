const { admin, leaderboardDb, adminLogsDb, roomsPublicDb, statusDb, userStatsDB, roomsDb } = require('../admin');
const dealCards = require('./dealCards');
const setGameAchievements = require('./setGameAchievements');
const setPulesOnClose = require('./setPulesOnClose');

// Calculate results after a round is over
const calculateResults = roomId =>
  new Promise((resolve, reject) => {
    const promise1 = admin.database(roomsDb).ref(`rooms/${roomId}/beatCardPoints`).once('value');
    const promise2 = admin.database(roomsDb).ref(`rooms/${roomId}/curRnd/largePlayer`).once('value');
    const promise3 = admin.database(roomsDb).ref(`rooms/${roomId}/curRnd/type`).once('value');
    const promise4 = admin.database(roomsDb).ref(`rooms/${roomId}/curRnd/firstToGo`).once('value');
    const promise5 = admin.database(roomsDb).ref(`rooms/${roomId}/points/pules`).once('value');
    const promise6 = admin.database(roomsDb).ref(`rooms/${roomId}/points/total`).once('value');
    const promise7 = admin.database(roomsDb).ref(`rooms/${roomId}/globalParams`).once('value');
    const promise8 = admin.database(roomsDb).ref(`rooms/${roomId}/playersList`).once('value');

    Promise.all([promise1, promise2, promise3, promise4, promise5, promise6, promise7, promise8])
      .then(promiseRes2 => {
        let beatCardPoints;
        let largePlayer;
        let type;
        let firstToGo;
        let pules;
        let totalPnts;
        let globalParams;
        let players;

        promiseRes2.map((res2, index) => {
          if (res2.key === 'beatCardPoints') {
            beatCardPoints = res2.val();
          } else if (res2.key === 'largePlayer') {
            largePlayer = res2.val() || null;
          } else if (res2.key === 'type') {
            type = res2.val();
          } else if (res2.key === 'firstToGo') {
            firstToGo = res2.val();
          } else if (res2.key === 'pules') {
            pules = res2.val() || {};
          } else if (res2.key === 'total') {
            totalPnts = res2.val() || {};
          } else if (res2.key === 'globalParams') {
            globalParams = res2.val() || {};
          } else if (res2.key === 'playersList') {
            players = res2.val() || {};
          }
        });

        const {
          gameType,
          tournamentId,
          tournamentRoom,
          talking,
          bet,
          lastRound,
          lastRoundPlayer,
          party,
        } = globalParams;

        const tricksCount = beatCardPoints.tricks;

        let points = {};
        let roundPoints = {};

        if (
          totalPnts &&
          totalPnts !== null &&
          Object.keys(totalPnts).length > 0
        ) {
          points = {
            player1: totalPnts.player1,
            player2: totalPnts.player2,
            player3: totalPnts.player3,
          };
        } else {
          points = {
            player1: 0,
            player2: 0,
            player3: 0,
          };
        }

        // Function to add points and pules to players
        function addPoints(lielais, mazais, addPule, privatePule) {
          let player1Pule = 0;
          let player2Pule = 0;
          let player3Pule = 0;
          let largePlayerExtraPoints = 0;
          if (gameType === 'P') {
            if (privatePule === 'player1') {
              player1Pule = -3;
              largePlayerExtraPoints = 3;
            } else if (privatePule === 'player2') {
              player2Pule = -3;
              largePlayerExtraPoints = 3;
            } else if (privatePule === 'player3') {
              player3Pule = -3;
              largePlayerExtraPoints = 3;
            }
          } else {
            player1Pule = 0;
            player2Pule = 0;
            player3Pule = 0;
            largePlayerExtraPoints = 0;
          }

          if (largePlayer === 'player1') {
            points = {
              player1: points.player1 + lielais + largePlayerExtraPoints,
              player2: points.player2 + mazais + player2Pule,
              player3: points.player3 + mazais + player3Pule,
            };

            roundPoints = {
              player1: lielais + largePlayerExtraPoints,
              player2: mazais + player2Pule,
              player3: mazais + player3Pule,
              pule: addPule,
            };
          }
          if (largePlayer === 'player2') {
            points = {
              player1: points.player1 + mazais + player1Pule,
              player2: points.player2 + lielais + largePlayerExtraPoints,
              player3: points.player3 + mazais + player3Pule,
            };

            roundPoints = {
              player1: mazais + player1Pule,
              player2: lielais + largePlayerExtraPoints,
              player3: mazais + player3Pule,
              pule: addPule,
            };
          }
          if (largePlayer === 'player3') {
            points = {
              player1: points.player1 + mazais + player1Pule,
              player2: points.player2 + mazais + player2Pule,
              player3: points.player3 + lielais + largePlayerExtraPoints,
            };

            roundPoints = {
              player1: mazais + player1Pule,
              player2: mazais + player2Pule,
              player3: lielais + largePlayerExtraPoints,
              pule: addPule,
            };
          }
        }

        // Determining game results based on gametype and scores
        let winStatus;
        let winnerUID = null;

        //* ***************************GAME TYPE PARASTA*************************//
        if (type === 'parasta') {
          if (
            beatCardPoints[largePlayer] > 30 &&
            beatCardPoints[largePlayer] < 61
          ) {
            // large player loses
            if (largePlayer === 'player1') {
              winnerUID = [players.player2.uid, players.player3.uid];
            } else if (largePlayer === 'player2') {
              winnerUID = [players.player1.uid, players.player3.uid];
            } else if (largePlayer === 'player3') {
              winnerUID = [players.player1.uid, players.player2.uid];
            }

            winStatus = {
              winner: 'small',
              winnerUID,
              largePlayer: players[largePlayer].name,
              type: 'parasta',
              scoreType: 'parasts',
              largePoints: beatCardPoints[largePlayer],
              largeTricks: tricksCount[largePlayer],
            };

          //  admin.database().ref(`rooms/${roomId}/globalParams`).update({
          //    gameResult: winStatus,
          //  });

            admin.database(roomsDb).ref(`rooms/${roomId}/globalParams`).update({
              gameResult: winStatus,
            });

            if (gameType === 'P') {
              if (
                pules &&
                ((pules.common && pules.common[Object.keys(pules.common)[0]]) ||
                  (pules.private &&
                    pules.private[Object.keys(pules.private)[0]]))
              ) {
                addPoints(-4, 2, largePlayer, null);
              } else {
                addPoints(-4, 2, null, null);
              }
            } else {
              addPoints(-4, 2, null, null);
            }
          } else if (
            beatCardPoints[largePlayer] > 60 &&
            beatCardPoints[largePlayer] < 91
          ) {
            // large player wins

            winnerUID = [players[largePlayer].uid];

            winStatus = {
              winner: 'large',
              winnerUID,
              largePlayer: players[largePlayer].name,
              type: 'parasta',
              scoreType: 'parasts',
              largePoints: beatCardPoints[largePlayer],
              largeTricks: tricksCount[largePlayer],
            };

          //  admin.database().ref(`rooms/${roomId}/globalParams`).update({
          //    gameResult: winStatus,
          //  });

            admin.database(roomsDb).ref(`rooms/${roomId}/globalParams`).update({
              gameResult: winStatus,
            });

            if (gameType === 'P') {
              //* ********************If player has pule************************
              if (
                pules &&
                pules[largePlayer] &&
                pules[largePlayer][Object.keys(pules[largePlayer])[0]]
              ) {
                addPoints(2, -1, null, null);

                const { roundId, player } = pules[largePlayer][
                  Object.keys(pules[largePlayer])[0]
                ];
                admin.database().ref(`rooms/${roomId}/points/rounds/${roundId}`).update({
                  pule: `${player}-`,
                });

                admin.database().ref(`rooms/${roomId}/points/pules/private/${Object.keys(pules[largePlayer])[0]}`).remove();
                admin.database().ref(`rooms/${roomId}/points/pules/${largePlayer}/${Object.keys(pules[largePlayer])[0]}`).remove();

                admin.database(roomsDb).ref(`rooms/${roomId}/points/rounds/${roundId}`).update({
                  pule: `${player}-`,
                });

                admin.database(roomsDb).ref(`rooms/${roomId}/points/pules/private/${Object.keys(pules[largePlayer])[0]}`).remove();
                admin.database(roomsDb).ref(`rooms/${roomId}/points/pules/${largePlayer}/${Object.keys(pules[largePlayer])[0]}`).remove();


                //* ********************If Common pule************************
              } else if (
                pules &&
                pules.common &&
                pules.common[Object.keys(pules.common)[0]]
              ) {
                addPoints(4, -2, null, null);
                const { roundId } = pules.common[Object.keys(pules.common)[0]];
                admin.database().ref(`rooms/${roomId}/points/rounds/${roundId}`).update({
                  pule: 'P-',
                });
                admin.database().ref(`rooms/${roomId}/points/pules/common/${Object.keys(pules.common)[0]}`).remove();

                admin.database(roomsDb).ref(`rooms/${roomId}/points/rounds/${roundId}`).update({
                  pule: 'P-',
                });
                admin.database(roomsDb).ref(`rooms/${roomId}/points/pules/common/${Object.keys(pules.common)[0]}`).remove();

                //* ********************If Private pule************************
              } else if (
                pules &&
                pules.private &&
                pules.private[Object.keys(pules.private)[0]]
              ) {
                addPoints(
                  2,
                  -1,
                  null,
                  pules.private[Object.keys(pules.private)[0]].player
                );
                const { roundId, player } = pules.private[
                  Object.keys(pules.private)[0]
                ];
               admin.database().ref(`rooms/${roomId}/points/rounds/${roundId}`).update({
                  pule: `${player}-`,
                });
                admin.database().ref(`rooms/${roomId}/points/pules/private/${Object.keys(pules.private)[0]}`).remove();

                admin.database(roomsDb).ref(`rooms/${roomId}/points/rounds/${roundId}`).update({
                  pule: `${player}-`,
                });
                admin.database(roomsDb).ref(`rooms/${roomId}/points/pules/private/${Object.keys(pules.private)[0]}`).remove();
              } else {
                addPoints(2, -1, null, null);
              }
            } else {
              addPoints(2, -1, null, null);
            }
          } else if (
            beatCardPoints[largePlayer] <= 30 &&
            tricksCount[largePlayer] > 0
          ) {
            // large player loses with jaņi

            if (largePlayer === 'player1') {
              winnerUID = [players.player2.uid, players.player3.uid];
            } else if (largePlayer === 'player2') {
              winnerUID = [players.player1.uid, players.player3.uid];
            } else if (largePlayer === 'player3') {
              winnerUID = [players.player1.uid, players.player2.uid];
            }

            winStatus = {
              winner: 'small',
              winnerUID,
              largePlayer: players[largePlayer].name,
              type: 'parasta',
              scoreType: 'jani',
              largePoints: beatCardPoints[largePlayer],
              largeTricks: tricksCount[largePlayer],
            };

          //  admin.database().ref(`rooms/${roomId}/globalParams`).update({
          //    gameResult: winStatus,
          //  });

            admin.database(roomsDb).ref(`rooms/${roomId}/globalParams`).update({
              gameResult: winStatus,
            });

            if (gameType === 'P') {
              if (
                pules &&
                ((pules.common && pules.common[Object.keys(pules.common)[0]]) ||
                  (pules.private &&
                    pules.private[Object.keys(pules.private)[0]]))
              ) {
                addPoints(-6, 3, largePlayer, null);
              } else {
                addPoints(-6, 3, null, null);
              }
            } else {
              addPoints(-6, 3, null, null);
            }
          } else if (tricksCount[largePlayer] === 0) {
            // large player loses with bezstikis
            if (largePlayer === 'player1') {
              winnerUID = [players.player2.uid, players.player3.uid];
            } else if (largePlayer === 'player2') {
              winnerUID = [players.player1.uid, players.player3.uid];
            } else if (largePlayer === 'player3') {
              winnerUID = [players.player1.uid, players.player2.uid];
            }

            winStatus = {
              winner: 'small',
              winnerUID,
              largePlayer: players[largePlayer].name,
              type: 'parasta',
              scoreType: 'bezstikis',
              largePoints: beatCardPoints[largePlayer],
              largeTricks: tricksCount[largePlayer],
            };

          //  admin.database().ref(`rooms/${roomId}/globalParams`).update({
          //    gameResult: winStatus,
          //  });

            admin.database(roomsDb).ref(`rooms/${roomId}/globalParams`).update({
              gameResult: winStatus,
            });

            // large player loses with bezstikis and has 0 points
            if (gameType === 'P') {
              if (
                pules &&
                ((pules.common && pules.common[Object.keys(pules.common)[0]]) ||
                  (pules.private &&
                    pules.private[Object.keys(pules.private)[0]]))
              ) {
                addPoints(-8, 4, largePlayer, null);
              } else {
                addPoints(-8, 4, null, null);
              }
            } else {
              addPoints(-8, 4, null, null);
            }
          } else if (tricksCount[largePlayer] === 8) {
            // large player wins with bezstikis
            winnerUID = [players[largePlayer].uid];

            winStatus = {
              winner: 'large',
              winnerUID,
              largePlayer: players[largePlayer].name,
              type: 'parasta',
              scoreType: 'bezstikis',
              largePoints: beatCardPoints[largePlayer],
              largeTricks: tricksCount[largePlayer],
            };

          //  admin.database().ref(`rooms/${roomId}/globalParams`).update({
          //    gameResult: winStatus,
          //  });

            admin.database(roomsDb).ref(`rooms/${roomId}/globalParams`).update({
              gameResult: winStatus,
            });

            if (gameType === 'P') {
              //* ********************If player has pule************************
              if (
                pules &&
                pules[largePlayer] &&
                pules[largePlayer][Object.keys(pules[largePlayer])[0]]
              ) {
                addPoints(6, -3, null, null);
                const { roundId, player } = pules[largePlayer][
                  Object.keys(pules[largePlayer])[0]
                ];
                admin.database().ref(`rooms/${roomId}/points/rounds/${roundId}`).update({
                  pule: `${player}-`,
                });
                admin.database().ref(`rooms/${roomId}/points/pules/private/${Object.keys(pules[largePlayer])[0]}`).remove();
              admin.database().ref(`rooms/${roomId}/points/pules/${largePlayer}/${Object.keys(pules[largePlayer])[0]}`).remove();

                admin.database(roomsDb).ref(`rooms/${roomId}/points/rounds/${roundId}`).update({
                  pule: `${player}-`,
                });
                admin.database(roomsDb).ref(`rooms/${roomId}/points/pules/private/${Object.keys(pules[largePlayer])[0]}`).remove();
                admin.database(roomsDb).ref(`rooms/${roomId}/points/pules/${largePlayer}/${Object.keys(pules[largePlayer])[0]}`).remove();

                //* ********************If Common pule************************
              } else if (
                pules &&
                pules.common &&
                pules.common[Object.keys(pules.common)[0]]
              ) {
                addPoints(8, -4, null, null);
                const { roundId } = pules.common[Object.keys(pules.common)[0]];

                admin.database().ref(`rooms/${roomId}/points/rounds/${roundId}`).update({
                  pule: 'P-',
                });
                admin.database().ref(`rooms/${roomId}/points/pules/common/${Object.keys(pules.common)[0]}`).remove();

                admin.database(roomsDb).ref(`rooms/${roomId}/points/rounds/${roundId}`).update({
                  pule: 'P-',
                });
                admin.database(roomsDb).ref(`rooms/${roomId}/points/pules/common/${Object.keys(pules.common)[0]}`).remove();

                //* ********************If Private pule************************
              } else if (
                pules &&
                pules.private &&
                pules.private[Object.keys(pules.private)[0]]
              ) {
                addPoints(
                  6,
                  -3,
                  null,
                  pules.private[Object.keys(pules.private)[0]].player
                );
                const { roundId, player } = pules.private[
                  Object.keys(pules.private)[0]
                ];

                admin.database().ref(`rooms/${roomId}/points/rounds/${roundId}`).update({
                  pule: `${player}-`,
                });
                admin.database().ref(`rooms/${roomId}/points/pules/private/${Object.keys(pules.private)[0]}`).remove();

                admin.database(roomsDb).ref(`rooms/${roomId}/points/rounds/${roundId}`).update({
                  pule: `${player}-`,
                });
                admin.database(roomsDb).ref(`rooms/${roomId}/points/pules/private/${Object.keys(pules.private)[0]}`).remove();
              } else {
                addPoints(6, -3, null, null);
              }
            } else {
              addPoints(6, -3, null, null);
            }
          } else if (
            beatCardPoints[largePlayer] > 90 &&
            tricksCount[largePlayer] < 8
          ) {
            // large player wins with jaņi
            winnerUID = [players[largePlayer].uid];

            winStatus = {
              winner: 'large',
              winnerUID,
              largePlayer: players[largePlayer].name,
              type: 'parasta',
              scoreType: 'jani',
              largePoints: beatCardPoints[largePlayer],
              largeTricks: tricksCount[largePlayer],
            };

          //  admin.database().ref(`rooms/${roomId}/globalParams`).update({
          //    gameResult: winStatus,
          //  });

            admin.database(roomsDb).ref(`rooms/${roomId}/globalParams`).update({
              gameResult: winStatus,
            });

            if (gameType === 'P') {
              //* ********************If player has pule************************
              if (
                pules &&
                pules[largePlayer] &&
                pules[largePlayer][Object.keys(pules[largePlayer])[0]]
              ) {
                addPoints(4, -2, null, null);
                const { roundId, player } = pules[largePlayer][
                  Object.keys(pules[largePlayer])[0]
                ];
                admin.database().ref(`rooms/${roomId}/points/rounds/${roundId}`).update({
                  pule: `${player}-`,
                });
                admin.database().ref(`rooms/${roomId}/points/pules/private/${Object.keys(pules[largePlayer])[0]}`).remove();
                admin.database().ref(`rooms/${roomId}/points/pules/${largePlayer}/${Object.keys(pules[largePlayer])[0]}`).remove();

                admin.database(roomsDb).ref(`rooms/${roomId}/points/rounds/${roundId}`).update({
                  pule: `${player}-`,
                });
                admin.database(roomsDb).ref(`rooms/${roomId}/points/pules/private/${Object.keys(pules[largePlayer])[0]}`).remove();
                admin.database(roomsDb).ref(`rooms/${roomId}/points/pules/${largePlayer}/${Object.keys(pules[largePlayer])[0]}`).remove();

                //* ********************If Common pule************************
              } else if (
                pules &&
                pules.common &&
                pules.common[Object.keys(pules.common)[0]]
              ) {
                addPoints(6, -3, null, null);
                const { roundId } = pules.common[Object.keys(pules.common)[0]];

                admin.database().ref(`rooms/${roomId}/points/rounds/${roundId}`).update({
                  pule: 'P-',
                });
                admin.database().ref(`rooms/${roomId}/points/pules/common/${Object.keys(pules.common)[0]}`).remove();

                admin.database(roomsDb).ref(`rooms/${roomId}/points/rounds/${roundId}`).update({
                  pule: 'P-',
                });
                admin.database(roomsDb).ref(`rooms/${roomId}/points/pules/common/${Object.keys(pules.common)[0]}`).remove();

                //* ********************If Private pule***********************
              } else if (
                pules &&
                pules.private &&
                pules.private[Object.keys(pules.private)[0]]
              ) {
                addPoints(
                  4,
                  -2,
                  null,
                  pules.private[Object.keys(pules.private)[0]].player
                );
                const { roundId, player } = pules.private[
                  Object.keys(pules.private)[0]
                ];

                admin.database().ref(`rooms/${roomId}/points/rounds/${roundId}`).update({
                  pule: `${player}-`,
                });
                admin.database().ref(`rooms/${roomId}/points/pules/private/${Object.keys(pules.private)[0]}`).remove();

                admin.database(roomsDb).ref(`rooms/${roomId}/points/rounds/${roundId}`).update({
                  pule: `${player}-`,
                });
                admin.database(roomsDb).ref(`rooms/${roomId}/points/pules/private/${Object.keys(pules.private)[0]}`).remove();
              } else {
                addPoints(4, -2, null, null);
              }
            } else {
              addPoints(4, -2, null, null);
            }
          }
          //* ***************************GAME TYPE ZOLE*************************//
        } else if (type === 'zole') {
          if (
            beatCardPoints[largePlayer] > 30 &&
            beatCardPoints[largePlayer] < 61
          ) {
            // large player loses
            if (largePlayer === 'player1') {
              winnerUID = [players.player2.uid, players.player3.uid];
            } else if (largePlayer === 'player2') {
              winnerUID = [players.player1.uid, players.player3.uid];
            } else if (largePlayer === 'player3') {
              winnerUID = [players.player1.uid, players.player2.uid];
            }

            winStatus = {
              winner: 'small',
              winnerUID,
              largePlayer: players[largePlayer].name,
              type: 'zole',
              scoreType: 'parasts',
              largePoints: beatCardPoints[largePlayer],
              largeTricks: tricksCount[largePlayer],
            };

          //  admin.database().ref(`rooms/${roomId}/globalParams`).update({
          //    gameResult: winStatus,
          //  });

            admin.database(roomsDb).ref(`rooms/${roomId}/globalParams`).update({
              gameResult: winStatus,
            });

            addPoints(-12, 6, null, null);
          } else if (
            beatCardPoints[largePlayer] <= 30 &&
            tricksCount[largePlayer] > 0
          ) {
            // large player loses with jaņi
            if (largePlayer === 'player1') {
              winnerUID = [players.player2.uid, players.player3.uid];
            } else if (largePlayer === 'player2') {
              winnerUID = [players.player1.uid, players.player3.uid];
            } else if (largePlayer === 'player3') {
              winnerUID = [players.player1.uid, players.player2.uid];
            }

            winStatus = {
              winner: 'small',
              winnerUID,
              largePlayer: players[largePlayer].name,
              type: 'zole',
              scoreType: 'jani',
              largePoints: beatCardPoints[largePlayer],
              largeTricks: tricksCount[largePlayer],
            };

          //  admin.database().ref(`rooms/${roomId}/globalParams`).update({
          //    gameResult: winStatus,
          //  });

            admin.database(roomsDb).ref(`rooms/${roomId}/globalParams`).update({
              gameResult: winStatus,
            });

            addPoints(-14, 7, null, null);
          } else if (tricksCount[largePlayer] === 0) {
            // large player loses with bezstikis
            if (largePlayer === 'player1') {
              winnerUID = [players.player2.uid, players.player3.uid];
            } else if (largePlayer === 'player2') {
              winnerUID = [players.player1.uid, players.player3.uid];
            } else if (largePlayer === 'player3') {
              winnerUID = [players.player1.uid, players.player2.uid];
            }

            winStatus = {
              winner: 'small',
              winnerUID,
              largePlayer: players[largePlayer].name,
              type: 'zole',
              scoreType: 'bezstikis',
              largePoints: beatCardPoints[largePlayer],
              largeTricks: tricksCount[largePlayer],
            };

          //  admin.database().ref(`rooms/${roomId}/globalParams`).update({
          //    gameResult: winStatus,
          //  });

            admin.database(roomsDb).ref(`rooms/${roomId}/globalParams`).update({
              gameResult: winStatus,
            });

            addPoints(-16, 8, null, null);
          } else if (
            beatCardPoints[largePlayer] > 60 &&
            beatCardPoints[largePlayer] < 91
          ) {
            // large player wins
            winnerUID = [players[largePlayer].uid];

            winStatus = {
              winner: 'large',
              winnerUID,
              largePlayer: players[largePlayer].name,
              type: 'zole',
              scoreType: 'parasts',
              largePoints: beatCardPoints[largePlayer],
              largeTricks: tricksCount[largePlayer],
            };

          //  admin.database().ref(`rooms/${roomId}/globalParams`).update({
          //    gameResult: winStatus,
          //  });

            admin.database(roomsDb).ref(`rooms/${roomId}/globalParams`).update({
              gameResult: winStatus,
            });

            addPoints(10, -5, null, null);
          } else if (tricksCount[largePlayer] === 8) {
            // large player wins with bezstikis
            winnerUID = [players[largePlayer].uid];

            winStatus = {
              winner: 'large',
              winnerUID,
              largePlayer: players[largePlayer].name,
              type: 'zole',
              scoreType: 'bezstikis',
              largePoints: beatCardPoints[largePlayer],
              largeTricks: tricksCount[largePlayer],
            };

          //  admin.database().ref(`rooms/${roomId}/globalParams`).update({
          //    gameResult: winStatus,
          //  });

            admin.database(roomsDb).ref(`rooms/${roomId}/globalParams`).update({
              gameResult: winStatus,
            });

            addPoints(14, -7, null, null);
          } else if (
            beatCardPoints[largePlayer] > 90 &&
            tricksCount[largePlayer] < 8
          ) {
            // large player wins with jaņi
            winnerUID = [players[largePlayer].uid];

            winStatus = {
              winner: 'large',
              winnerUID,
              largePlayer: players[largePlayer].name,
              type: 'zole',
              scoreType: 'jani',
              largePoints: beatCardPoints[largePlayer],
              largeTricks: tricksCount[largePlayer],
            };

          //  admin.database().ref(`rooms/${roomId}/globalParams`).update({
          //    gameResult: winStatus,
          //  });

            admin.database(roomsDb).ref(`rooms/${roomId}/globalParams`).update({
              gameResult: winStatus,
            });

            addPoints(12, -6, null, null);
          }
          //* ***************************GAME TYPE MAZA*************************//
        } else if (type === 'maza') {
          if (beatCardPoints[largePlayer] > 0 || tricksCount[largePlayer] > 0) {
            // large player loses maza zole
            if (largePlayer === 'player1') {
              winnerUID = [players.player2.uid, players.player3.uid];
            } else if (largePlayer === 'player2') {
              winnerUID = [players.player1.uid, players.player3.uid];
            } else if (largePlayer === 'player3') {
              winnerUID = [players.player1.uid, players.player2.uid];
            }

            winStatus = {
              winner: 'small',
              winnerUID,
              largePlayer: players[largePlayer].name,
              type: 'mazaZole',
              scoreType: 'parasts',
              largePoints: beatCardPoints[largePlayer],
              largeTricks: tricksCount[largePlayer],
            };

          //  admin.database().ref(`rooms/${roomId}/globalParams`).update({
          //    gameResult: winStatus,
          //  });

            admin.database(roomsDb).ref(`rooms/${roomId}/globalParams`).update({
              gameResult: winStatus,
            });

            addPoints(-14, 7, null, null);
          } else {
            // large player wins maza zole
            winnerUID = [players[largePlayer].uid];

            winStatus = {
              winner: 'large',
              winnerUID,
              largePlayer: players[largePlayer].name,
              type: 'mazaZole',
              scoreType: 'parasts',
              largePoints: beatCardPoints[largePlayer],
              largeTricks: tricksCount[largePlayer],
            };

          //  admin.database().ref(`rooms/${roomId}/globalParams`).update({
          //    gameResult: winStatus,
          //  });

            admin.database(roomsDb).ref(`rooms/${roomId}/globalParams`).update({
              gameResult: winStatus,
            });

            addPoints(12, -6, null, null);
          }
          //* ***************************GAME TYPE GALDINS*************************//
        } else if (type === 'galdins') {
          let mostTricksPlayer = 'player1';
          let tiedTricksPlayer = null;

          if (tricksCount[mostTricksPlayer] < tricksCount.player2) {
            mostTricksPlayer = 'player2';
          } else if (tricksCount[mostTricksPlayer] === tricksCount.player2) {
            tiedTricksPlayer = 'player2';
          }

          if (tricksCount[mostTricksPlayer] < tricksCount.player3) {
            mostTricksPlayer = 'player3';
            tiedTricksPlayer = null;
          } else if (tricksCount[mostTricksPlayer] === tricksCount.player3) {
            tiedTricksPlayer = 'player3';
          }

          if (mostTricksPlayer && tiedTricksPlayer) {
            if (
              beatCardPoints[mostTricksPlayer] <
              beatCardPoints[tiedTricksPlayer]
            ) {
              mostTricksPlayer = tiedTricksPlayer;
            }
          }

          if (mostTricksPlayer === 'player1') {
            winnerUID = [players.player2.uid, players.player3.uid];
          } else if (mostTricksPlayer === 'player2') {
            winnerUID = [players.player1.uid, players.player3.uid];
          } else if (mostTricksPlayer === 'player3') {
            winnerUID = [players.player1.uid, players.player2.uid];
          }

          winStatus = {
            winner: players[mostTricksPlayer].name,
            winnerUID,
            largePlayer: null,
            type: 'galdins',
            scoreType: 'parasts',
            largePoints: beatCardPoints[mostTricksPlayer],
            largeTricks: tricksCount[mostTricksPlayer],
          };

        //  admin.database().ref(`rooms/${roomId}/globalParams`).update({
        //    gameResult: winStatus,
        //  });

          admin.database(roomsDb).ref(`rooms/${roomId}/globalParams`).update({
            gameResult: winStatus,
          });

          if (mostTricksPlayer === 'player1') {
            points = {
              player1: points.player1 - 4,
              player2: points.player2 + 2,
              player3: points.player3 + 2,
            };
            roundPoints = {
              player1: -4,
              player2: 2,
              player3: 2,
              pule: null,
            };
          } else if (mostTricksPlayer === 'player2') {
            points = {
              player1: points.player1 + 2,
              player2: points.player2 - 4,
              player3: points.player3 + 2,
            };
            roundPoints = {
              player1: 2,
              player2: -4,
              player3: 2,
              pule: null,
            };
          } else if (mostTricksPlayer === 'player3') {
            points = {
              player1: points.player1 + 2,
              player2: points.player2 + 2,
              player3: points.player3 - 4,
            };
            roundPoints = {
              player1: 2,
              player2: 2,
              player3: -4,
              pule: null,
            };
          }
        }

        if (
          roundPoints &&
          (roundPoints.player1 || roundPoints.player1 === 0) &&
          (roundPoints.player2 || roundPoints.player2 === 0) &&
          (roundPoints.player3 || roundPoints.player3 === 0)
        ) {
          // Push round points to score table
          const key = admin.database(roomsDb).ref(`rooms/${roomId}/points/rounds`).push({
            player1: roundPoints.player1,
            player2: roundPoints.player2,
            player3: roundPoints.player3,
            pule: roundPoints.pule,
          })
          .getKey();

          admin.database().ref(`rooms/${roomId}/points/rounds/${key}`).set({
            player1: roundPoints.player1,
            player2: roundPoints.player2,
            player3: roundPoints.player3,
            pule: roundPoints.pule,
          })

          if (roundPoints.pule && roundPoints.pule !== null) {
            const key2 = admin.database(roomsDb).ref(`rooms/${roomId}/points/pules/private`).push({
              roundId: key,
              status: 'active',
              player: largePlayer,
            })
            .getKey();

            admin.database().ref(`rooms/${roomId}/points/pules/private${key2}`).set({
              roundId: key,
              status: 'active',
              player: largePlayer,
            })

            admin.database().ref(`rooms/${roomId}/points/pules/${largePlayer}/${key2}`).set({
              roundId: key,
              puleId: key2,
              status: 'active',
              player: largePlayer,
            });

            admin.database(roomsDb).ref(`rooms/${roomId}/points/pules/${largePlayer}/${key2}`).set({
              roundId: key,
              puleId: key2,
              status: 'active',
              player: largePlayer,
            });
          }

          admin.database().ref(`rooms/${roomId}/points`).update({
            total: points,
          });

          admin.database(roomsDb).ref(`rooms/${roomId}/points`).update({
            total: points,
          });

          const curPos = firstToGo;

          let nextPos;
          if (curPos === 'player1') {
            nextPos = 'player2';
          } else if (curPos === 'player2') {
            nextPos = 'player3';
          } else {
            nextPos = 'player1';
          }

          // Reset current round data
        /*  admin.database().ref(`rooms/${roomId}/curRnd`).update({
            firstToGo: nextPos,
            currentTurn: nextPos,
            currentTable: null,
            cardsOnTable: null,
            largePlayer: null,
            type: null,
          }); */

          admin.database(roomsDb).ref(`rooms/${roomId}/curRnd`).update({
            firstToGo: nextPos,
            currentTurn: nextPos,
            currentTable: null,
            cardsOnTable: null,
            largePlayer: null,
            type: null,
          });

          if (beatCardPoints) {
          //  admin.database().ref(`rooms/${roomId}/previousRound/beatCardPoints`).set(beatCardPoints);
            admin.database(roomsDb).ref(`rooms/${roomId}/previousRound/beatCardPoints`).set(beatCardPoints);
          }

        /*  admin.database().ref(`rooms/${roomId}/beatCardPoints`).set({
            player1: 0,
            player2: 0,
            player3: 0,
            tricks: {
              player1: 0,
              player2: 0,
              player3: 0,
            },
          }); */

          admin.database(roomsDb).ref(`rooms/${roomId}/beatCardPoints`).set({
            player1: 0,
            player2: 0,
            player3: 0,
            tricks: {
              player1: 0,
              player2: 0,
              player3: 0,
            },
          });

          const nextUserUid = players[nextPos].uid;

        /*  admin.database().ref(`rooms/${roomId}/globalParams`).update({
            gameState: 'results',
            talking: nextUserUid.toString(),
            currentHand: 1,
          });

          admin.database().ref(`rooms/${roomId}/nextTimestamp`).set(Date.now() + 1000 * 7.8); */

          admin.database(roomsDb).ref(`rooms/${roomId}/globalParams`).update({
            gameState: 'results',
            talking: nextUserUid.toString(),
            currentHand: 1,
          });

          admin.database(roomsDb).ref(`rooms/${roomId}/nextTimestamp`).set(Date.now() + 1000 * 7.8);

          admin.database(adminLogsDb).ref(`adminLogs/rooms/${roomId}/${party}`).push({
            time: Date.now(),
            roomId,
            type: 'roundResult',
            data: {
              largePlayer: winStatus.largePlayer,
              scoreType: winStatus.scoreType,
              type: winStatus.type,
              winner: winStatus.winner,
              nextPosTalking: nextPos,
              points: {
                player1: roundPoints.player1,
                player2: roundPoints.player2,
                player3: roundPoints.player3,
                pule: roundPoints.pule,
              },
            },
          });

          admin.database(adminLogsDb).ref(`adminLogs/rooms/${roomId}/${party}/gameResult`).update({
            roomId,
            winner: winStatus.winner,
            largePlayer: winStatus.largePlayer,
            type: winStatus.type,
            scoreType: winStatus.scoreType,
            largePoints: winStatus.largePoints,
            largeTricks: winStatus.largeTricks,
            points: {
              player1: roundPoints.player1,
              player2: roundPoints.player2,
              player3: roundPoints.player3,
              pule: roundPoints.pule,
            },
          });

          if (roomId) {
            if (winStatus.type === 'parasta') {
              if (winStatus.winner === 'large') {
                if (
                  winStatus.scoreType === 'parasts' ||
                  winStatus.scoreType === 'jani'
                ) {
                  admin.database().ref(`chat/${roomId}/messages`).push({
                    roomId,
                    message: `${winStatus.largePlayer} uzvar kā Lielais ar ${winStatus.largePoints} punktiem`,
                    userUid: 'game',
                    time: Date.now(),
                  });
                } else if (winStatus.scoreType === 'bezstikis') {
                  admin.database().ref(`chat/${roomId}/messages`).push({
                    roomId,
                    message: `${winStatus.largePlayer} uzvar kā Lielais ar bezstiķi`,
                    userUid: 'game',
                    time: Date.now(),
                  });
                }
              } else if (winStatus.winner === 'small') {
                if (
                  winStatus.scoreType === 'parasts' ||
                  winStatus.scoreType === 'jani'
                ) {
                  admin.database().ref(`chat/${roomId}/messages`).push({
                    roomId,
                    message: `${winStatus.largePlayer} zaudē kā Lielais ar ${winStatus.largePoints} punktiem`,
                    userUid: 'game',
                    time: Date.now(),
                  });
                } else if (winStatus.scoreType === 'bezstikis') {
                  admin.database().ref(`chat/${roomId}/messages`).push({
                    roomId,
                    message: `${winStatus.largePlayer} zaudē kā Lielais ar bezstiķi`,
                    userUid: 'game',
                    time: Date.now(),
                  });
                }
              }
            } else if (winStatus.type === 'zole') {
              if (winStatus.winner === 'large') {
                if (
                  winStatus.scoreType === 'parasts' ||
                  winStatus.scoreType === 'jani'
                ) {
                  admin.database().ref(`chat/${roomId}/messages`).push({
                    roomId,
                    message: `${winStatus.largePlayer} uzvar Zoli kā Lielais ar ${winStatus.largePoints} punktiem`,
                    userUid: 'game',
                    time: Date.now(),
                  });
                } else if (winStatus.scoreType === 'bezstikis') {
                  admin.database().ref(`chat/${roomId}/messages`).push({
                    roomId,
                    message: `${winStatus.largePlayer} uzvar Zoli kā Lielais ar bezstiķi`,
                    userUid: 'game',
                    time: Date.now(),
                  });
                }
              } else if (winStatus.winner === 'small') {
                if (
                  winStatus.scoreType === 'parasts' ||
                  winStatus.scoreType === 'jani'
                ) {
                  admin.database().ref(`chat/${roomId}/messages`).push({
                    roomId,
                    message: `${winStatus.largePlayer} zaudē Zoli kā Lielais ar ${winStatus.largePoints} punktiem`,
                    userUid: 'game',
                    time: Date.now(),
                  });
                } else if (winStatus.scoreType === 'bezstikis') {
                  admin.database().ref(`chat/${roomId}/messages`).push({
                    roomId,
                    message: `${winStatus.largePlayer} zaudē Zoli kā Lielais ar bezstiķi`,
                    userUid: 'game',
                    time: Date.now(),
                  });
                }
              }
            } else if (winStatus.type === 'mazaZole') {
              if (winStatus.winner === 'large') {
                admin.database().ref(`chat/${roomId}/messages`).push({
                  roomId,
                  message: `${winStatus.largePlayer} uzvar mazo zoli`,
                  userUid: 'game',
                  time: Date.now(),
                });
              } else if (winStatus.winner === 'small') {
                admin.database().ref(`chat/${roomId}/messages`).push({
                  roomId,
                  message: `${winStatus.largePlayer} zaudē mazo zoli`,
                  userUid: 'game',
                  time: Date.now(),
                });
              }
            } else if (winStatus.type === 'galdins') {
              admin.database().ref(`chat/${roomId}/messages`).push({
                roomId,
                message: `${winStatus.winner} zaudē galdiņu ar ${winStatus.largeTricks} stiķiem (${winStatus.largePoints} punktiem)`,
                userUid: 'game',
                time: Date.now(),
              });
            }
          }

          // Update player data with new results
          let betValue;
          if (bet === '1:1') {
            betValue = 1;
          } else if (bet === '1:5') {
            betValue = 5;
          } else if (bet === '1:10') {
            betValue = 10;
          } else if (bet === '1:25') {
            betValue = 25;
          } else if (bet === '1:50') {
            betValue = 50;
          } else if (bet === '1:100') {
            betValue = 100;
          } else if (bet === '1:500') {
            betValue = 500;
          } else if (bet === '1:1000') {
            betValue = 1000;
          } else if (bet === '1:5000') {
            betValue = 5000;
          } else if (bet === '1:10000') {
            betValue = 10000;
          }

          const promise11 = admin.database().ref(`users/${players.player1.uid}`).once('value');
          const promise12 = admin.database().ref(`users/${players.player2.uid}`).once('value');
          const promise13 = admin.database().ref(`users/${players.player3.uid}`).once('value');
          const promise14 = admin.database().ref(`userAchievements/${players.player1.uid}/maxParties`).once('value');
          const promise15 = admin.database().ref(`userAchievements/${players.player2.uid}/maxParties`).once('value');
          const promise16 = admin.database().ref(`userAchievements/${players.player3.uid}/maxParties`).once('value');

          Promise.all([promise11, promise12, promise13, promise14, promise15, promise16])
            .then(promisesRes => {
              const playersData = {};
              let player1MaxParties;
              let player2MaxParties;
              let player3MaxParties;

              promisesRes.map((promiseRes, index) => {
                if (index === 0) {
                  playersData.player1 = promiseRes.val() || {};
                } else if (index === 1) {
                  playersData.player2 = promiseRes.val() || {};
                } else if (index === 2) {
                  playersData.player3 = promiseRes.val() || {};
                } else if (index === 3) {
                  player1MaxParties = promiseRes.val() || 0;
                } else if (index === 4) {
                  player2MaxParties = promiseRes.val() || 0;
                } else if (index === 5) {
                  player3MaxParties = promiseRes.val() || 0;
                }
                return null;
              });

              if (tournamentRoom) {
                Object.keys(playersData).map(key2 => {
                  const player = playersData[key2];

                  const balChange = betValue * parseInt(roundPoints[key2], 10);
                  const newBal = parseInt(player.bal, 10) + balChange;

                  admin
                    .database(adminLogsDb)
                    .ref(`adminLogs/rooms/${roomId}/${party}/gameResult`)
                    .update({
                      newBal: {
                        [players[key2].uid]: {
                          [player.uid]: {
                            name: player.name,
                            uid: player.uid,
                            bal: newBal,
                          },
                        },
                      },
                    });

                  const newPoints = parseInt(player.totalPnts, 10) + roundPoints[key2];

                  admin
                    .database()
                    .ref(`tourPlayers/${tournamentId}/${players[key2].uid}/bal`)
                    .transaction(bal => (parseInt(bal, 10) || 0) + balChange);

                  admin
                    .database()
                    .ref(`tourPlayers/${tournamentId}/${players[key2].uid}`)
                    .update({
                      totalPnts: newPoints,
                    })
                    .then(() => {
                      admin
                        .database()
                        .ref(
                          `tourPlayerData/${players[key2].uid}/${tournamentId}/bal`
                        )
                        .transaction(bal => (parseInt(bal, 10) || 0) + balChange);

                      admin
                        .database()
                        .ref(
                          `tourPlayerData/${players[key2].uid}/${tournamentId}`
                        )
                        .update({
                          totalPnts: newPoints,
                        });

                      admin
                        .database()
                        .ref(
                          `tourHistory/${players[key2].uid}/${tournamentId}/bal`
                        )
                        .transaction(bal => (parseInt(bal, 10) || 0) + balChange);

                      admin
                        .database()
                        .ref(`tourHistory/${players[key2].uid}/${tournamentId}`)
                        .update({
                          totalPnts: newPoints,
                        });

                    //  admin.database().ref(`rooms/${roomId}/players/${key2}`).update({
                    //    bal: newBal,
                    //  });

                      admin.database(roomsDb).ref(`rooms/${roomId}/players/${key2}`).update({
                        bal: newBal,
                      });

                      admin
                        .database(adminLogsDb)
                        .ref(`adminLogs/rooms/${roomId}/${party}`)
                        .push({
                          time: Date.now(),
                          roomId,
                          type: 'updatePoints',
                          data: {
                            playerUid: player.uid,
                            playerName: player.name,
                            oldBal: player.bal,
                            newBal,
                            balChange,
                            oldPnts: player.totalPnts,
                            newPnts: newPoints,
                            pointsChange: roundPoints[key2],
                          },
                        });

                    //  admin.database().ref(`rooms/${roomId}/playersList/${key2}`).update({
                    //    bal: newBal,
                    //    largePlayer: false,
                    //  });

                      admin.database(roomsDb).ref(`rooms/${roomId}/playersList/${key2}`).update({
                        bal: newBal,
                        largePlayer: false,
                      });
                    });
                  return null;
                });
              } else {
                Object.keys(playersData).map(key2 => {
                  const player = playersData[key2];

                  const balChange = betValue * parseInt(roundPoints[key2], 10);
                  const newBal = parseInt(player.bal, 10) + balChange;

                  let newGamesWon = parseInt(player.gWon, 10);
                  if (roundPoints[key2] > 0) {
                    newGamesWon += 1;
                  }

                  admin
                    .database(adminLogsDb)
                    .ref(`adminLogs/rooms/${roomId}/${party}/gameResult`)
                    .update({
                      newBal: {
                        [player.uid]: {
                          name: player.name,
                          uid: player.uid,
                          bal: newBal,
                        },
                      },
                    });

                  const newPoints = parseInt(player.totalPnts, 10) + roundPoints[key2];

                  admin
                    .database()
                    .ref(`users/${players[key2].uid}/bal`)
                    .transaction(bal => (parseInt(bal, 10) || 0) + balChange);

                  admin
                    .database()
                    .ref(`users/${players[key2].uid}`)
                    .update({
                      gPlayed: parseInt(player.gPlayed, 10) + 1,
                      gWon: newGamesWon,
                      totalPnts: newPoints,
                    });

                //  admin.database().ref(`rooms/${roomId}/players/${key2}`).update({
                //    bal: newBal,
                //  });

                //  admin.database().ref(`rooms/${roomId}/playersList/${key2}`).update({
                //    bal: newBal,
                //  });

                  admin.database(roomsDb).ref(`rooms/${roomId}/players/${key2}`).update({
                    bal: newBal,
                  });

                  admin.database(roomsDb).ref(`rooms/${roomId}/playersList/${key2}`).update({
                    bal: newBal,
                  });

                  admin.database(statusDb).ref(`status/${players[key2].uid}`).update({
                    lastAction: admin.database.ServerValue.TIMESTAMP,
                  });

                  admin
                    .database()
                    .ref(`userBalHistory/${players[key2].uid}`)
                    .push({
                      time: Date.now(),
                      type: 'game',
                      roomId,
                      change: balChange,
                      old: player.bal,
                      new: newBal,
                    });

                  admin
                    .database(userStatsDB)
                    .ref(`userBalHistory/${players[key2].uid}`)
                    .push({
                      time: Date.now(),
                      type: 'game',
                      roomId,
                      change: balChange,
                      old: player.bal,
                      new: newBal,
                    });

                  admin
                    .database(userStatsDB)
                    .ref(`userPointsHistory/${players[key2].uid}`)
                    .push({
                      time: Date.now(),
                      type: 'game',
                      roomId,
                      change: roundPoints[key2],
                      old: player.totalPnts,
                      new: newPoints,
                    });

                  admin
                    .database(adminLogsDb)
                    .ref(`adminLogs/rooms/${roomId}/${party}`)
                    .push({
                      time: Date.now(),
                      roomId,
                      type: 'updatePoints',
                      data: {
                        playerUid: player.uid,
                        playerName: player.name,
                        oldBal: player.bal,
                        newBal,
                        balChange,
                        oldPnts: player.totalPnts,
                        newPnts: newPoints,
                        pointsChange: roundPoints[key2],
                      },
                    });

                  admin
                    .database(leaderboardDb)
                    .ref(`leaderboard/allTime/${players[key2].uid}`)
                    .update({
                      gPlayed: parseInt(player.gPlayed, 10) + 1,
                    });

                  admin
                    .database(leaderboardDb)
                    .ref(`leaderboard/daily/${players[key2].uid}/gPlayed`)
                    .transaction(gPlayed => (gPlayed || 0) + 1);

                  admin
                    .database(leaderboardDb)
                    .ref(`leaderboard/week/${players[key2].uid}/gPlayed`)
                    .transaction(gPlayed => (gPlayed || 0) + 1);

                  admin
                    .database(leaderboardDb)
                    .ref(`leaderboard/month/${players[key2].uid}/gPlayed`)
                    .transaction(gPlayed => (gPlayed || 0) + 1);

                  admin
                    .database(leaderboardDb)
                    .ref(`leaderboard/year/${players[key2].uid}/gPlayed`)
                    .transaction(gPlayed => (gPlayed || 0) + 1);

                //  admin.database().ref(`rooms/${roomId}/playersList/${key2}`).update({
                //    largePlayer: false,
                //  });

                  admin.database(roomsDb).ref(`rooms/${roomId}/playersList/${key2}`).update({
                    largePlayer: false,
                  });

                  return null;
                });
              }

              // Close room if round was last round
              if (lastRound) {
                if (tournamentRoom) {
                  Object.keys(players).map(key3 => {
                    if (key3 !== 'playerList') {
                      admin
                        .database()
                        .ref(`tourPlayers/${tournamentId}/${players[key3].uid}`)
                        .update({
                          roomId: null,
                        });

                      admin
                        .database()
                        .ref(
                          `tourPlayerData/${players[key3].uid}/${tournamentId}`
                        )
                        .update({
                          roomId: null,
                        });

                      return null;
                    }
                    return null;
                  });
                }

                if (!tournamentRoom) {
                //  admin.database().ref(`roomsPubInf/${roomId}/globalParams`).update({ roomClosed: true });
                //  admin.database().ref(`roomsPubInf/${roomId}`).update({ roomClosed: true });

                //  admin.database(roomsPublicDb).ref(`roomsPubInf/${roomId}/globalParams`).update({ roomClosed: true });
                //  admin.database(roomsPublicDb).ref(`roomsPubInf/${roomId}`).update({ roomClosed: true });

                  admin.database(roomsPublicDb).ref(`roomsPubInf/${roomId}`).remove();
                }

              //  admin.database().ref(`rooms/${roomId}/curRnd/currentTable`).remove();
                admin.database(roomsDb).ref(`rooms/${roomId}/curRnd/currentTable`).remove();

                setPulesOnClose({ roomId });

                Object.keys(players).map(key3 => {
                  if (key3 !== 'playerList') {
                    admin
                      .database()
                      .ref(`users/${players[key3].uid}/joinedRooms/${roomId}`)
                      .remove();

                    admin
                      .database(statusDb)
                      .ref(`status/${players[key3].uid}`)
                      .update({
                        lastAction: admin.database.ServerValue.TIMESTAMP,
                      });

                    //  admin.database().ref(`status/${players[key3].uid}`).update({
                    //    isWaitingRoom: false,
                    //  });
                  }
                  return null;
                });

                admin
                  .database()
                  .ref(`users/${lastRoundPlayer}/name`)
                  .once('value', lastRoundPlayerSnapshot => {
                    const playerName = lastRoundPlayerSnapshot.val() || {};

                  /*  admin.database().ref(`rooms/${roomId}/globalParams`).update({
                      roomClosed: true,
                      closeReason: {
                        reason: 'lastRound',
                        playerName,
                        playerUid: lastRoundPlayer,
                      },
                    });

                    admin.database().ref(`rooms/${roomId}`).update({
                      roomClosed: true,
                    }); */

                    admin.database(roomsDb).ref(`rooms/${roomId}/globalParams`).update({
                      roomClosed: true,
                      closeReason: {
                        reason: 'lastRound',
                        playerName,
                        playerUid: lastRoundPlayer,
                      },
                    });

                    admin.database().ref(`activeRooms/${roomId}`).remove();

                    if (!tournamentRoom) {
                      admin
                        .database()
                        .ref('rooms/roomCount')
                        .transaction(roomCount => roomCount - 1);
                    }

                    setGameAchievements({
                      largePlayer,
                      roundData: {
                        type,
                      },
                      globalParams,
                      players,
                      beatCardPoints,
                      tricksCount,
                      winStatus,
                    });

                    if (party > player1MaxParties) {
                      admin
                        .database()
                        .ref(
                          `userAchievements/${players.player1.uid}/maxParties`
                        )
                        .set(party);
                    }
                    if (party > player2MaxParties) {
                      admin
                        .database()
                        .ref(
                          `userAchievements/${players.player2.uid}/maxParties`
                        )
                        .set(party);
                    }
                    if (party > player3MaxParties) {
                      admin
                        .database()
                        .ref(
                          `userAchievements/${players.player3.uid}/maxParties`
                        )
                        .set(party);
                    }

                    admin
                      .database(adminLogsDb)
                      .ref(`adminLogs/rooms/${roomId}/${party}`)
                      .push({
                        time: Date.now(),
                        roomId,
                        type: 'roomClosed',
                        data: {
                          type: 'lastRound',
                          player: playerName,
                          playerUid: lastRoundPlayer,
                        },
                      });

                    return resolve('success');
                  });
              } else if (tournamentRoom) {
                admin
                  .database()
                  .ref(`tournaments/${tournamentId}/status`)
                  .once('value', tournamentSnapshot => {
                    const status = tournamentSnapshot.val() || {};

                    if (status === 'ended') {
                    //  admin.database().ref(`rooms/${roomId}/globalParams`).update({
                    //    roomClosed: true,
                    //    closeReason: { reason: 'tournamentEnd' },
                    //  });

                      admin.database(roomsDb).ref(`rooms/${roomId}/globalParams`).update({
                        roomClosed: true,
                        closeReason: { reason: 'tournamentEnd' },
                      });

                  //    admin.database().ref(`rooms/${roomId}`).update({
                  //      roomClosed: true,
                  //    });

                      admin.database().ref(`activeRooms/${roomId}`).remove();

                      setGameAchievements({
                        largePlayer,
                        roundData: {
                          type,
                        },
                        globalParams,
                        players,
                        beatCardPoints,
                        tricksCount,
                        winStatus,
                      });

                      if (party > player1MaxParties) {
                        admin
                          .database()
                          .ref(
                            `userAchievements/${players.player1.uid}/maxParties`
                          )
                          .set(party);
                      }
                      if (party > player2MaxParties) {
                        admin
                          .database()
                          .ref(
                            `userAchievements/${players.player2.uid}/maxParties`
                          )
                          .set(party);
                      }
                      if (party > player3MaxParties) {
                        admin
                          .database()
                          .ref(
                            `userAchievements/${players.player3.uid}/maxParties`
                          )
                          .set(party);
                      }

                      admin
                        .database(adminLogsDb)
                        .ref(`adminLogs/rooms/${roomId}/${party}`)
                        .push({
                          time: Date.now(),
                          roomId,
                          type: 'roomClosed',
                          data: {
                            type: 'tournamentEnd',
                            player: null,
                            playerUid: null,
                          },
                        });

                      Object.keys(players).map(key2 => {
                        if (key3 !== 'playerList') {
                          admin
                            .database()
                            .ref(
                              `tourPlayers/${tournamentId}/${players[key2].uid}`
                            )
                            .once('value', playerSnapshot => {
                              const playerData = playerSnapshot.val() || {};

                              if (
                                talking.toString() ===
                                players[key2].uid.toString()
                              ) {
                                admin
                                  .database()
                                  .ref(
                                    `tourPlayers/${tournamentId}/${players[key2].uid}`
                                  )
                                  .update({
                                    bal:
                                      parseInt(playerData.bal, 10) +
                                      -10 * betValue,
                                    roomId: null,
                                  });

                                admin
                                  .database()
                                  .ref(
                                    `tourPlayerData/${players[key2].uid}/${tournamentId}`
                                  )
                                  .update({
                                    bal:
                                      parseInt(playerData.bal, 10) +
                                      -10 * betValue,
                                    roomId: null,
                                  });

                                admin
                                  .database()
                                  .ref(
                                    `tourHistory/${players[key2].uid}/${tournamentId}`
                                  )
                                  .update({
                                    bal:
                                      parseInt(playerData.bal, 10) +
                                      -10 * betValue,
                                  });
                              } else {
                                admin
                                  .database()
                                  .ref(
                                    `tourPlayers/${tournamentId}/${players[key2].uid}`
                                  )
                                  .update({
                                    bal:
                                      parseInt(playerData.bal, 10) +
                                      1 * betValue,
                                    roomId: null,
                                  });

                                admin
                                  .database()
                                  .ref(
                                    `tourPlayerData/${players[key2].uid}/${tournamentId}`
                                  )
                                  .update({
                                    bal:
                                      parseInt(playerData.bal, 10) +
                                      1 * betValue,
                                    roomId: null,
                                  });

                                admin
                                  .database()
                                  .ref(
                                    `tourHistory/${players[key2].uid}/${tournamentId}`
                                  )
                                  .update({
                                    bal:
                                      parseInt(playerData.bal, 10) +
                                      1 * betValue,
                                  });
                              }

                              admin
                                .database()
                                .ref(
                                  `users/${players[key2].uid}/joinedRooms/${roomId}`
                                )
                                .remove();

                              admin
                                .database(statusDb)
                                .ref(`status/${players[key2].uid}`)
                                .update({
                                  lastAction:
                                    admin.database.ServerValue.TIMESTAMP,
                                });
                            });
                          return resolve('tournament ended');
                        }
                      });
                    } else {
                    //  admin.database().ref(`rooms/${roomId}/globalParams/party`).transaction(partyy => (partyy || 1) + 1);
                      admin.database(roomsDb).ref(`rooms/${roomId}/globalParams/party`).transaction(partyy => (partyy || 1) + 1);

                      //  admin.database().ref(`rooms/${roomId}/players`)
                      //    .once('value').then((playersSnapshot) => {
                      //      const playersData = playersSnapshot.val();

                      const { player1, player2, player3 } = playersData;
                      let lowBal = false;

                      if (parseInt(player1.bal, 10) < betValue * 16) {
                        lowBal = true;
                        admin.database().ref(`rooms/${roomId}/globalParams/lowBalPlayers`).update({
                          player1: true,
                        });
                      }

                      if (parseInt(player2.bal, 10) < betValue * 16) {
                        lowBal = true;
                        admin.database().ref(`rooms/${roomId}/globalParams/lowBalPlayers`).update({
                          player2: true,
                        });
                      }

                      if (parseInt(player3.bal, 10) < betValue * 16) {
                        lowBal = true;
                        admin.database().ref(`rooms/${roomId}/globalParams/lowBalPlayers`).update({
                          player3: true,
                        });
                      }

                      dealCards(roomId, party).then(res => {
                        admin.database().ref(`rooms/${roomId}/curRnd/currentTable`).remove();

                        setGameAchievements({
                          largePlayer,
                          roundData: {
                            type,
                          },
                          globalParams,
                          players,
                          beatCardPoints,
                          tricksCount,
                          winStatus,
                        }).then(() => {
                          if (res === 'success') {
                            return resolve('success');
                          }
                          return resolve('failed to deal cards');
                        });
                      });
                    }
                  });
              } else {
              //  admin.database().ref(`rooms/${roomId}/globalParams/party`).transaction(partyy => (partyy || 1) + 1);

                admin.database(roomsDb).ref(`rooms/${roomId}/globalParams/party`).transaction(partyy => (partyy || 1) + 1);

                dealCards(roomId, party)
                  .then(res => {
                    setGameAchievements({
                      largePlayer,
                      roundData: {
                        type,
                      },
                      globalParams,
                      players,
                      beatCardPoints,
                      tricksCount,
                      winStatus,
                    })
                      .then(() => {
                        if (res === 'success') {
                          return resolve('success');
                        }
                        console.log('failed to deal cards');
                        return reject('failed to deal cards');
                      })
                      .catch(err => reject(err));
                  })
                  .catch(err => {
                    console.log('deal cards error');
                    console.log(err);
                    reject(err)
                  });

                //  return resolve('success');
              }
            })
            .catch(err => {
              console.log(err);
            });
        } else {
          //  console.log('alredy calculated results');
          return resolve('already calculated');
        }
      })
      .catch(err => {
        console.log(err);
        reject(err);
      });
  });

module.exports = calculateResults;
