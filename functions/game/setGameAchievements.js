const { admin } = require('../admin');

const setWinsLoses = (largePlayer, players, winner) => {
  if (winner === 'large') {
    admin.database().ref(`userAchievements/${players[largePlayer].uid}/currentSuccessionWins`).transaction(score => (score || 0) + 1);
    admin.database().ref(`userAchievements/${players[largePlayer].uid}/currentSuccessionLosses`).set(0);

    if (largePlayer === 'player1') {
      admin.database().ref(`userAchievements/${players.player2.uid}/currentSuccessionWins`).set(0);
      admin.database().ref(`userAchievements/${players.player2.uid}/currentSuccessionLosses`).transaction(score => (score || 0) + 1);
      admin.database().ref(`userAchievements/${players.player3.uid}/currentSuccessionWins`).set(0);
      admin.database().ref(`userAchievements/${players.player3.uid}/currentSuccessionLosses`).transaction(score => (score || 0) + 1);
    } else if (largePlayer === 'player2') {
      admin.database().ref(`userAchievements/${players.player1.uid}/currentSuccessionWins`).set(0);
      admin.database().ref(`userAchievements/${players.player1.uid}/currentSuccessionLosses`).transaction(score => (score || 0) + 1);
      admin.database().ref(`userAchievements/${players.player3.uid}/currentSuccessionWins`).set(0);
      admin.database().ref(`userAchievements/${players.player3.uid}/currentSuccessionLosses`).transaction(score => (score || 0) + 1);
    } else if (largePlayer === 'player3') {
      admin.database().ref(`userAchievements/${players.player1.uid}/currentSuccessionWins`).set(0);
      admin.database().ref(`userAchievements/${players.player1.uid}/currentSuccessionLosses`).transaction(score => (score || 0) + 1);
      admin.database().ref(`userAchievements/${players.player2.uid}/currentSuccessionWins`).set(0);
      admin.database().ref(`userAchievements/${players.player2.uid}/currentSuccessionLosses`).transaction(score => (score || 0) + 1);
    }
  } else if (winner === 'small') {
    admin.database().ref(`userAchievements/${players[largePlayer].uid}/currentSuccessionWins`).set(0);
    admin.database().ref(`userAchievements/${players[largePlayer].uid}/currentSuccessionLosses`).transaction(score => (score || 0) + 1);

    if (largePlayer === 'player1') {
      admin.database().ref(`userAchievements/${players.player2.uid}/currentSuccessionWins`).transaction(score => (score || 0) + 1);
      admin.database().ref(`userAchievements/${players.player2.uid}/currentSuccessionLosses`).set(0);
      admin.database().ref(`userAchievements/${players.player3.uid}/currentSuccessionWins`).transaction(score => (score || 0) + 1);
      admin.database().ref(`userAchievements/${players.player3.uid}/currentSuccessionLosses`).set(0);
    } else if (largePlayer === 'player2') {
      admin.database().ref(`userAchievements/${players.player1.uid}/currentSuccessionWins`).transaction(score => (score || 0) + 1);
      admin.database().ref(`userAchievements/${players.player1.uid}/currentSuccessionLosses`).set(0);
      admin.database().ref(`userAchievements/${players.player3.uid}/currentSuccessionWins`).transaction(score => (score || 0) + 1);
      admin.database().ref(`userAchievements/${players.player3.uid}/currentSuccessionLosses`).set(0);
    } else if (largePlayer === 'player3') {
      admin.database().ref(`userAchievements/${players.player1.uid}/currentSuccessionWins`).transaction(score => (score || 0) + 1);
      admin.database().ref(`userAchievements/${players.player1.uid}/currentSuccessionLosses`).set(0);
      admin.database().ref(`userAchievements/${players.player2.uid}/currentSuccessionWins`).transaction(score => (score || 0) + 1);
      admin.database().ref(`userAchievements/${players.player2.uid}/currentSuccessionLosses`).set(0);
    }
  }

  return null;
};

const setUserBal = (uid, balChange) => {
  if (uid && balChange) {
  //  console.log('setUserBal');
  //  console.log(uid);
  //  console.log(balChange);
  /*  admin.database().ref(`users/${userId}/bal`)
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


const increaseAcievement = (uid, achievement) => {
  if (uid && achievement) {
    admin.database().ref(`userAchievements/${uid}/${achievement}`).transaction(score => (score || 0) + 1);
  }
};

const setSingleAcievement = (uid, achievement) => {
  if (uid && achievement) {
    admin.database().ref(`userAchievements/${uid}/${achievement}`).transaction(achievement => {
      if (achievement) {
        return;
      }

      return true;
    }).then(result => {
      if (result.committed) {
    //    return resolve();
    //  }
        if (achievement === 'winLarge61') {
          setUserBal(uid, 610);
        } else if (achievement === 'winLarge91') {
          setUserBal(uid, 910);
        } else if (achievement === 'winLarge120') {
          setUserBal(uid, 1200);
        } else if (achievement === 'loseLarge60') {
          setUserBal(uid, 600);
        } else if (achievement === 'winSmall60') {
          setUserBal(uid, 600);
        } else if (achievement === 'loseLarge30') {
          setUserBal(uid, 300);
        } else if (achievement === 'loseLarge0') {
          setUserBal(uid, 120);
        } else if (achievement === 'winZoleAll') {
          setUserBal(uid, 1200);
        } else if (achievement === 'winZoleTwoAces') {
          setUserBal(uid, 2200);
        }
      }
    });
  }
};

const setGameAchievements = ({
  largePlayer, roundData, globalParams, players, beatCardPoints, tricksCount, winStatus, init,
}) => new Promise(((resolve, reject) => {
  // const { admin } = require('../admin');

  if (init) {
    return resolve();
  }

  /*  const promise1 = admin.database().ref(`userAchievements/${players.player1.uid}`).once('value');
  const promise2 = admin.database().ref(`userAchievements/${players.player2.uid}`).once('value');
  const promise3 = admin.database().ref(`userAchievements/${players.player3.uid}`).once('value');

  Promise.all([promise1, promise2, promise3])
    .then((promiseRes2) => {
      let player1Achievements;
      let player2Achievements;
      let player3Achievements;
      promiseRes2.map((res2, index) => {
        if (res2.key === players.player1.uid) {
          player1Achievements = res2.val();
        } else if (res2.key === players.player2.uid) {
          player2Achievements = res2.val();
        } else if (res2.key === players.player3.uid) {
          player3Achievements = res2.val();
        }
      });
      */

  if (roundData.type === 'zole' || roundData.type === 'parasta') {
    if (beatCardPoints[largePlayer] === 61) {
      // Uzvara kā Lielajam ar 61 punktu

      setSingleAcievement(players[largePlayer].uid, 'winLarge61');
    } else if (beatCardPoints[largePlayer] === 91) {
      // Uzvara kā Lielajam ar 91 punktu

      setSingleAcievement(players[largePlayer].uid, 'winLarge91');
    } else if (beatCardPoints[largePlayer] === 120) {
      // Uzvara kā Lielajam ar 120 punktiem

      setSingleAcievement(players[largePlayer].uid, 'winLarge120');
    } else if (beatCardPoints[largePlayer] === 60) {
      // Zaudēt kā lielajam ar 60 punktiem
      // Uzvara kā mazajam ar 60 punktiem

      setSingleAcievement(players[largePlayer].uid, 'loseLarge60');

      if (largePlayer === 'player1') {
        setSingleAcievement(players.player2.uid, 'winSmall60');
        setSingleAcievement(players.player3.uid, 'winSmall60');
      } else if (largePlayer === 'player2') {
        setSingleAcievement(players.player1.uid, 'winSmall60');
        setSingleAcievement(players.player3.uid, 'winSmall60');
      } else if (largePlayer === 'player3') {
        setSingleAcievement(players.player1.uid, 'winSmall60');
        setSingleAcievement(players.player2.uid, 'winSmall60');
      }
    } else if (beatCardPoints[largePlayer] === 30) {
      // Zaudēt kā lielajam ar 30 punktiem

      setSingleAcievement(players[largePlayer].uid, 'loseLarge30');
    } else if (beatCardPoints[largePlayer] === 0) {
      // Zaudēt kā lielajam ar 0 punktiem

      setSingleAcievement(players[largePlayer].uid, 'loseLarge0');
    } else if (roundData.type === 'zole' && tricksCount[largePlayer] === 8) {
      // Uzvarēt Zolē, nedodot mazajiem nevienu stiķi

      setSingleAcievement(players[largePlayer].uid, 'winZoleAll');
    } else if (roundData.type === 'zole' && roundData.cardsOnTable && roundData.cardsOnTable.cards
    && roundData.cardsOnTable.cards[0].includes('A') && roundData.cardsOnTable.cards[1].includes('A')) {
      // Uzvarēt Zolē, ja galdā paliek divi dūži

      setSingleAcievement(players[largePlayer].uid, 'winZoleTwoAces');
    }
  }

  if (globalParams.fastGame) {
    increaseAcievement(players.player1.uid, 'fastGamesPlayed');
    increaseAcievement(players.player2.uid, 'fastGamesPlayed');
    increaseAcievement(players.player3.uid, 'fastGamesPlayed');
  }

  //* ***************************GAME TYPE PARASTA*************************//
  if (roundData.type === 'parasta') {
    if (beatCardPoints[largePlayer] < 61) {
      // large player loses

      setWinsLoses(largePlayer, players, 'small');
    } else {
      // large player wins

      setWinsLoses(largePlayer, players, 'large');
    }
    //* ***************************GAME TYPE ZOLE*************************//
  } else if (roundData.type === 'zole') {
    increaseAcievement(players.player1.uid, 'zolePlayed');
    increaseAcievement(players.player2.uid, 'zolePlayed');
    increaseAcievement(players.player3.uid, 'zolePlayed');

    if (beatCardPoints[largePlayer] < 61) {
      // large player loses
      if (largePlayer === 'player1') {
        increaseAcievement(players.player1.uid, 'zoleLose');
        increaseAcievement(players.player2.uid, 'zoleWon');
        increaseAcievement(players.player3.uid, 'zoleWon');
      } else if (largePlayer === 'player2') {
        increaseAcievement(players.player1.uid, 'zoleWon');
        increaseAcievement(players.player2.uid, 'zoleLose');
        increaseAcievement(players.player3.uid, 'zoleWon');
      } else if (largePlayer === 'player3') {
        increaseAcievement(players.player1.uid, 'zoleWon');
        increaseAcievement(players.player2.uid, 'zoleWon');
        increaseAcievement(players.player3.uid, 'zoleLose');
      }

      setWinsLoses(largePlayer, players, 'small');
    } else {
      // large player wins

      increaseAcievement(players[largePlayer].uid, 'zoleWon');
      setWinsLoses(largePlayer, players, 'large');

      if (largePlayer === 'player1') {
        increaseAcievement(players.player2.uid, 'zoleLose');
        increaseAcievement(players.player3.uid, 'zoleLose');
      } else if (largePlayer === 'player2') {
        increaseAcievement(players.player1.uid, 'zoleLose');
        increaseAcievement(players.player3.uid, 'zoleLose');
      } else if (largePlayer === 'player3') {
        increaseAcievement(players.player1.uid, 'zoleLose');
        increaseAcievement(players.player2.uid, 'zoleLose');
      }
    }
    //* ***************************GAME TYPE MAZA*************************//
  } else if (roundData.type === 'maza') {
    increaseAcievement(players.player1.uid, 'mazaZolePlayed');
    increaseAcievement(players.player2.uid, 'mazaZolePlayed');
    increaseAcievement(players.player3.uid, 'mazaZolePlayed');

    if (beatCardPoints[largePlayer] > 0 || beatCardPoints.tricks[largePlayer] > 0) {
      // large player loses maza zole

      if (largePlayer === 'player1') {
        increaseAcievement(players.player1.uid, 'mazaZoleLose');
        increaseAcievement(players.player2.uid, 'mazaZoleWon');
        increaseAcievement(players.player3.uid, 'mazaZoleWon');
      } else if (largePlayer === 'player2') {
        increaseAcievement(players.player1.uid, 'mazaZoleWon');
        increaseAcievement(players.player2.uid, 'mazaZoleLose');
        increaseAcievement(players.player3.uid, 'mazaZoleWon');
      } else if (largePlayer === 'player3') {
        increaseAcievement(players.player1.uid, 'mazaZoleWon');
        increaseAcievement(players.player2.uid, 'mazaZoleWon');
        increaseAcievement(players.player3.uid, 'mazaZoleLose');
      }

      setWinsLoses(largePlayer, players, 'small');
    } else {
      // large player wins maza zole
      increaseAcievement(players[largePlayer].uid, 'mazaZoleWon');

      setWinsLoses(largePlayer, players, 'large');

      if (largePlayer === 'player1') {
        increaseAcievement(players.player2.uid, 'mazaZoleLose');
        increaseAcievement(players.player3.uid, 'mazaZoleLose');
      } else if (largePlayer === 'player2') {
        increaseAcievement(players.player1.uid, 'mazaZoleLose');
        increaseAcievement(players.player3.uid, 'mazaZoleLose');
      } else if (largePlayer === 'player3') {
        increaseAcievement(players.player1.uid, 'mazaZoleLose');
        increaseAcievement(players.player2.uid, 'mazaZoleLose');
      }
    }
    //* ***************************GAME TYPE GALDINS*************************//
  } else if (roundData.type === 'galdins') {
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
      if (beatCardPoints[mostTricksPlayer] < beatCardPoints[tiedTricksPlayer]) {
        mostTricksPlayer = tiedTricksPlayer;
      }
    }

    setWinsLoses(mostTricksPlayer, players, 'small');

    increaseAcievement(players.player1.uid, 'galdinsPlayed');
    increaseAcievement(players.player2.uid, 'galdinsPlayed');
    increaseAcievement(players.player3.uid, 'galdinsPlayed');

    if (mostTricksPlayer === 'player1') {
      increaseAcievement(players.player1.uid, 'galdinsLose');
      increaseAcievement(players.player2.uid, 'galdinsWon');
      increaseAcievement(players.player3.uid, 'galdinsWon');
    } else if (mostTricksPlayer === 'player2') {
      increaseAcievement(players.player1.uid, 'galdinsWon');
      increaseAcievement(players.player2.uid, 'galdinsLose');
      increaseAcievement(players.player3.uid, 'galdinsWon');
    } else if (mostTricksPlayer === 'player3') {
      increaseAcievement(players.player1.uid, 'galdinsWon');
      increaseAcievement(players.player2.uid, 'galdinsWon');
      increaseAcievement(players.player3.uid, 'galdinsLose');
    }

    /*  if (mostTricksPlayer === 'player1') {
          // player 1 loses galdins

          setWinsLoses('player1', players, 'small');
        } else if (mostTricksPlayer === 'player2') {
          // player 2 loses galdins

          setWinsLoses('player2', players, 'small');
        } else if (mostTricksPlayer === 'player3') {
          // player 3 loses galdins

          setWinsLoses('player2', players, 'small');
        } */
  }


  return resolve();
  //  });
}));

module.exports = setGameAchievements;
