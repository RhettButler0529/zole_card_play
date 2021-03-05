const { admin, userStatsDB } = require('../admin');

const setUserBal = (uid, balChange) => {
  if (uid && balChange) {
    new Promise((resolve) => admin.database().ref(`users/${uid}/bal`)
      .transaction(bal => (parseInt(bal, 10) || 0) + parseInt(balChange, 10)).then(result => {
        if (!result.committed) {
          return resolve();
        }

        const newBal = result.snapshot.val() || null;

        if (newBal) {
          admin.database().ref(`userBalHistory/${uid}`).push({
            time: Date.now(),
            type: 'achievement',
            change: balChange,
            old: newBal - balChange,
            new: newBal,
          });

          admin.database(userStatsDB).ref(`userBalHistory/${uid}`).push({
            time: Date.now(),
            type: 'achievement',
            change: balChange,
            old: newBal - balChange,
            new: newBal,
          });
        }

        return resolve();
      }));
  }
};

const onAchievementUpdate = (change, context) => new Promise(((resolve) => {
  const afterData = change.after.val() || null;
  const beforeData = change.before.val() || null;
  const { userId, achievementId } = context.params;

  if (afterData && afterData !== beforeData && userId && achievementId) {
    if (achievementId === 'currentSuccessionWins') {
      admin.database().ref(`userAchievements/${userId}/maxSuccessionWins`).once('value', (maxWinsSnapshot) => {
        const maxSuccessionWins = maxWinsSnapshot.val() || 0;

        if (afterData > maxSuccessionWins) {
          admin.database().ref(`userAchievements/${userId}/maxSuccessionWins`).set(afterData);
        }
      });
    } else if (achievementId === 'currentSuccessionLosses') {
      admin.database().ref(`userAchievements/${userId}/maxSuccessionLosses`).once('value', (maxLossesSnapshot) => {
        const maxSuccessionLosses = maxLossesSnapshot.val() || 0;

        if (afterData > maxSuccessionLosses) {
          admin.database().ref(`userAchievements/${userId}/maxSuccessionLosses`).set(afterData);
        }
      });
    } else if (achievementId === 'fastGamesPlayed') {
      if (beforeData === null && afterData === 1) {
        setUserBal(userId, 10);
      } else if (beforeData === 2 && afterData === 3) {
        setUserBal(userId, 20);
      } else if (afterData === 5) {
        setUserBal(userId, 30);
      } else if (afterData === 10) {
        setUserBal(userId, 40);
      } else if (afterData === 100) {
        setUserBal(userId, 50);
      } else if (afterData === 250) {
        setUserBal(userId, 100);
      } else if (afterData === 500) {
        setUserBal(userId, 150);
      } else if (afterData === 1000) {
        setUserBal(userId, 200);
      } else if (afterData === 5000) {
        setUserBal(userId, 250);
      } else if (afterData === 10000) {
        setUserBal(userId, 300);
      } else if (afterData === 50000) {
        setUserBal(userId, 500);
      } else if (afterData === 100000) {
        setUserBal(userId, 600);
      } else if (afterData === 250000) {
        setUserBal(userId, 700);
      } else if (afterData === 500000) {
        setUserBal(userId, 800);
      } else if (afterData === 1000000) {
        setUserBal(userId, 1000);
      }
    } else if (achievementId === 'zolePlayed') {
      if (beforeData === null && afterData === 1) {
        setUserBal(userId, 10);
      } else if (beforeData === 2 && afterData === 3) {
        setUserBal(userId, 20);
      } else if (afterData === 5) {
        setUserBal(userId, 30);
      } else if (afterData === 10) {
        setUserBal(userId, 40);
      } else if (afterData === 100) {
        setUserBal(userId, 50);
      } else if (afterData === 250) {
        setUserBal(userId, 100);
      } else if (afterData === 500) {
        setUserBal(userId, 150);
      } else if (afterData === 1000) {
        setUserBal(userId, 200);
      } else if (afterData === 5000) {
        setUserBal(userId, 250);
      } else if (afterData === 10000) {
        setUserBal(userId, 300);
      } else if (afterData === 50000) {
        setUserBal(userId, 500);
      } else if (afterData === 100000) {
        setUserBal(userId, 600);
      } else if (afterData === 250000) {
        setUserBal(userId, 700);
      } else if (afterData === 500000) {
        setUserBal(userId, 800);
      } else if (afterData === 1000000) {
        setUserBal(userId, 1000);
      }
    } else if (achievementId === 'zoleWon') {
      if (beforeData === null && afterData === 1) {
        setUserBal(userId, 50);
      } else if (afterData === 5) {
        setUserBal(userId, 60);
      } else if (afterData === 10) {
        setUserBal(userId, 70);
      } else if (afterData === 25) {
        setUserBal(userId, 80);
      } else if (afterData === 50) {
        setUserBal(userId, 90);
      } else if (afterData === 75) {
        setUserBal(userId, 200);
      } else if (afterData === 100) {
        setUserBal(userId, 300);
      } else if (afterData === 250) {
        setUserBal(userId, 400);
      } else if (afterData === 500) {
        setUserBal(userId, 500);
      } else if (afterData === 1000) {
        setUserBal(userId, 600);
      } else if (afterData === 2500) {
        setUserBal(userId, 1000);
      } else if (afterData === 5000) {
        setUserBal(userId, 1500);
      } else if (afterData === 10000) {
        setUserBal(userId, 2000);
      } else if (afterData === 25000) {
        setUserBal(userId, 2500);
      } else if (afterData === 50000) {
        setUserBal(userId, 3000);
      }
    } else if (achievementId === 'zoleLose') {
      if (beforeData === null && afterData === 1) {
        setUserBal(userId, 50);
      } else if (afterData === 5) {
        setUserBal(userId, 60);
      } else if (afterData === 10) {
        setUserBal(userId, 70);
      } else if (afterData === 25) {
        setUserBal(userId, 80);
      } else if (afterData === 50) {
        setUserBal(userId, 90);
      } else if (afterData === 75) {
        setUserBal(userId, 200);
      } else if (afterData === 100) {
        setUserBal(userId, 300);
      } else if (afterData === 250) {
        setUserBal(userId, 400);
      } else if (afterData === 500) {
        setUserBal(userId, 500);
      } else if (afterData === 1000) {
        setUserBal(userId, 600);
      } else if (afterData === 2500) {
        setUserBal(userId, 1000);
      } else if (afterData === 5000) {
        setUserBal(userId, 1500);
      } else if (afterData === 10000) {
        setUserBal(userId, 2000);
      } else if (afterData === 25000) {
        setUserBal(userId, 2500);
      } else if (afterData === 50000) {
        setUserBal(userId, 3000);
      }
    } else if (achievementId === 'mazaZolePlayed') {
      if (beforeData === null && afterData === 1) {
        setUserBal(userId, 10);
      } else if (beforeData === 2 && afterData === 3) {
        setUserBal(userId, 20);
      } else if (afterData === 5) {
        setUserBal(userId, 30);
      } else if (afterData === 10) {
        setUserBal(userId, 40);
      } else if (afterData === 100) {
        setUserBal(userId, 50);
      } else if (afterData === 250) {
        setUserBal(userId, 100);
      } else if (afterData === 500) {
        setUserBal(userId, 150);
      } else if (afterData === 1000) {
        setUserBal(userId, 200);
      } else if (afterData === 5000) {
        setUserBal(userId, 250);
      } else if (afterData === 10000) {
        setUserBal(userId, 300);
      } else if (afterData === 50000) {
        setUserBal(userId, 500);
      } else if (afterData === 100000) {
        setUserBal(userId, 600);
      } else if (afterData === 250000) {
        setUserBal(userId, 700);
      } else if (afterData === 500000) {
        setUserBal(userId, 800);
      } else if (afterData === 1000000) {
        setUserBal(userId, 1000);
      }
    } else if (achievementId === 'mazaZoleWon') {
      if (beforeData === null && afterData === 1) {
        setUserBal(userId, 50);
      } else if (afterData === 5) {
        setUserBal(userId, 60);
      } else if (afterData === 10) {
        setUserBal(userId, 70);
      } else if (afterData === 25) {
        setUserBal(userId, 80);
      } else if (afterData === 50) {
        setUserBal(userId, 90);
      } else if (afterData === 75) {
        setUserBal(userId, 200);
      } else if (afterData === 100) {
        setUserBal(userId, 300);
      } else if (afterData === 250) {
        setUserBal(userId, 400);
      } else if (afterData === 500) {
        setUserBal(userId, 500);
      } else if (afterData === 1000) {
        setUserBal(userId, 600);
      } else if (afterData === 2500) {
        setUserBal(userId, 1000);
      } else if (afterData === 5000) {
        setUserBal(userId, 1500);
      } else if (afterData === 10000) {
        setUserBal(userId, 2000);
      } else if (afterData === 25000) {
        setUserBal(userId, 2500);
      } else if (afterData === 50000) {
        setUserBal(userId, 3000);
      }
    } else if (achievementId === 'mazaZoleLose') {
      if (beforeData === null && afterData === 1) {
        setUserBal(userId, 50);
      } else if (afterData === 5) {
        setUserBal(userId, 60);
      } else if (afterData === 10) {
        setUserBal(userId, 70);
      } else if (afterData === 25) {
        setUserBal(userId, 80);
      } else if (afterData === 50) {
        setUserBal(userId, 90);
      } else if (afterData === 75) {
        setUserBal(userId, 200);
      } else if (afterData === 100) {
        setUserBal(userId, 300);
      } else if (afterData === 250) {
        setUserBal(userId, 400);
      } else if (afterData === 500) {
        setUserBal(userId, 500);
      } else if (afterData === 1000) {
        setUserBal(userId, 600);
      } else if (afterData === 2500) {
        setUserBal(userId, 1000);
      } else if (afterData === 5000) {
        setUserBal(userId, 1500);
      } else if (afterData === 10000) {
        setUserBal(userId, 2000);
      } else if (afterData === 25000) {
        setUserBal(userId, 2500);
      } else if (afterData === 50000) {
        setUserBal(userId, 3000);
      }
    } else if (achievementId === 'galdinsPlayed') {
      if (beforeData === null && afterData === 1) {
        setUserBal(userId, 10);
      } else if (beforeData === 2 && afterData === 3) {
        setUserBal(userId, 20);
      } else if (afterData === 5) {
        setUserBal(userId, 30);
      } else if (afterData === 10) {
        setUserBal(userId, 40);
      } else if (afterData === 100) {
        setUserBal(userId, 50);
      } else if (afterData === 250) {
        setUserBal(userId, 100);
      } else if (afterData === 500) {
        setUserBal(userId, 150);
      } else if (afterData === 1000) {
        setUserBal(userId, 200);
      } else if (afterData === 5000) {
        setUserBal(userId, 250);
      } else if (afterData === 10000) {
        setUserBal(userId, 300);
      } else if (afterData === 50000) {
        setUserBal(userId, 500);
      } else if (afterData === 100000) {
        setUserBal(userId, 600);
      } else if (afterData === 250000) {
        setUserBal(userId, 700);
      } else if (afterData === 500000) {
        setUserBal(userId, 800);
      } else if (afterData === 1000000) {
        setUserBal(userId, 1000);
      }
    } else if (achievementId === 'galdinsWon') {
      if (beforeData === null && afterData === 1) {
        setUserBal(userId, 50);
      } else if (afterData === 5) {
        setUserBal(userId, 60);
      } else if (afterData === 10) {
        setUserBal(userId, 70);
      } else if (afterData === 25) {
        setUserBal(userId, 80);
      } else if (afterData === 50) {
        setUserBal(userId, 90);
      } else if (afterData === 75) {
        setUserBal(userId, 200);
      } else if (afterData === 100) {
        setUserBal(userId, 300);
      } else if (afterData === 250) {
        setUserBal(userId, 400);
      } else if (afterData === 500) {
        setUserBal(userId, 500);
      } else if (afterData === 1000) {
        setUserBal(userId, 600);
      } else if (afterData === 2500) {
        setUserBal(userId, 1000);
      } else if (afterData === 5000) {
        setUserBal(userId, 1500);
      } else if (afterData === 10000) {
        setUserBal(userId, 2000);
      } else if (afterData === 25000) {
        setUserBal(userId, 2500);
      } else if (afterData === 50000) {
        setUserBal(userId, 3000);
      }
    } else if (achievementId === 'galdinsLose') {
      if (beforeData === null && afterData === 1) {
        setUserBal(userId, 50);
      } else if (afterData === 5) {
        setUserBal(userId, 60);
      } else if (afterData === 10) {
        setUserBal(userId, 70);
      } else if (afterData === 25) {
        setUserBal(userId, 80);
      } else if (afterData === 50) {
        setUserBal(userId, 90);
      } else if (afterData === 75) {
        setUserBal(userId, 200);
      } else if (afterData === 100) {
        setUserBal(userId, 300);
      } else if (afterData === 250) {
        setUserBal(userId, 400);
      } else if (afterData === 500) {
        setUserBal(userId, 500);
      } else if (afterData === 1000) {
        setUserBal(userId, 600);
      } else if (afterData === 2500) {
        setUserBal(userId, 1000);
      } else if (afterData === 5000) {
        setUserBal(userId, 1500);
      } else if (afterData === 10000) {
        setUserBal(userId, 2000);
      } else if (afterData === 25000) {
        setUserBal(userId, 2500);
      } else if (afterData === 50000) {
        setUserBal(userId, 3000);
      }
    }

    else if (achievementId === 'maxSuccessionWins') {
     if (afterData === 3) {
       setUserBal(userId, 50);
     } else if (afterData === 5) {
       setUserBal(userId, 60);
     } else if (afterData === 7) {
       setUserBal(userId, 70);
     } else if (afterData === 10) {
       setUserBal(userId, 80);
     } else if (afterData === 15) {
       setUserBal(userId, 90);
     } else if (afterData === 20) {
       setUserBal(userId, 200);
     } else if (afterData === 25) {
       setUserBal(userId, 300);
     } else if (afterData === 30) {
       setUserBal(userId, 400);
     } else if (afterData === 40) {
       setUserBal(userId, 500);
     } else if (afterData === 50) {
       setUserBal(userId, 600);
     } else if (afterData === 60) {
       setUserBal(userId, 1000);
     } else if (afterData === 70) {
       setUserBal(userId, 1500);
     } else if (afterData === 80) {
       setUserBal(userId, 2000);
     } else if (afterData === 90) {
       setUserBal(userId, 2500);
     } else if (afterData === 100) {
       setUserBal(userId, 3000);
     }
   } else if (achievementId === 'maxSuccessionLosses') {
     if (afterData === 3) {
       setUserBal(userId, 50);
     } else if (afterData === 5) {
       setUserBal(userId, 60);
     } else if (afterData === 7) {
       setUserBal(userId, 70);
     } else if (afterData === 10) {
       setUserBal(userId, 80);
     } else if (afterData === 15) {
       setUserBal(userId, 90);
     } else if (afterData === 20) {
       setUserBal(userId, 200);
     } else if (afterData === 25) {
       setUserBal(userId, 300);
     } else if (afterData === 30) {
       setUserBal(userId, 400);
     } else if (afterData === 40) {
       setUserBal(userId, 500);
     } else if (afterData === 50) {
       setUserBal(userId, 600);
     } else if (afterData === 60) {
       setUserBal(userId, 1000);
     } else if (afterData === 70) {
       setUserBal(userId, 1500);
     } else if (afterData === 80) {
       setUserBal(userId, 2000);
     } else if (afterData === 90) {
       setUserBal(userId, 2500);
     } else if (afterData === 100) {
       setUserBal(userId, 3000);
     }
   } else if (achievementId === 'bonusSpins') {
     if (beforeData === null && afterData === 3) {
       setUserBal(userId, 20);
     } else if (afterData === 5) {
       setUserBal(userId, 30);
     } else if (afterData === 7) {
       setUserBal(userId, 40);
     } else if (afterData === 10) {
       setUserBal(userId, 50);
     } else if (afterData === 15) {
       setUserBal(userId, 60);
     } else if (afterData === 20) {
       setUserBal(userId, 100);
     } else if (afterData === 25) {
       setUserBal(userId, 200);
     } else if (afterData === 50) {
       setUserBal(userId, 300);
     } else if (afterData === 75) {
       setUserBal(userId, 400);
     } else if (afterData === 100) {
       setUserBal(userId, 500);
     } else if (afterData === 150) {
       setUserBal(userId, 700);
     } else if (afterData === 200) {
       setUserBal(userId, 900);
     } else if (afterData === 250) {
       setUserBal(userId, 1100);
     } else if (afterData === 500) {
       setUserBal(userId, 1300);
     } else if (afterData === 1000) {
       setUserBal(userId, 1500);
     }
   } else if (achievementId === 'giftsSent') {
     if (beforeData === null && afterData === 1) {
       setUserBal(userId, 10);
     } else if (afterData === 3) {
       setUserBal(userId, 20);
     } else if (afterData === 5) {
       setUserBal(userId, 30);
     } else if (afterData === 10) {
       setUserBal(userId, 40);
     } else if (afterData === 25) {
       setUserBal(userId, 50);
     } else if (afterData === 50) {
       setUserBal(userId, 100);
     } else if (afterData === 75) {
       setUserBal(userId, 150);
     } else if (afterData === 100) {
       setUserBal(userId, 200);
     } else if (afterData === 250) {
       setUserBal(userId, 250);
     } else if (afterData === 500) {
       setUserBal(userId, 300);
     } else if (afterData === 750) {
       setUserBal(userId, 500);
     } else if (afterData === 1000) {
       setUserBal(userId, 600);
     } else if (afterData === 2000) {
       setUserBal(userId, 700);
     } else if (afterData === 3000) {
       setUserBal(userId, 800);
     } else if (afterData === 5000) {
       setUserBal(userId, 1000);
     }
   } else if (achievementId === 'giftsReceived') {
     if (beforeData === null && afterData === 1) {
       setUserBal(userId, 10);
     } else if (afterData === 3) {
       setUserBal(userId, 20);
     } else if (afterData === 5) {
       setUserBal(userId, 30);
     } else if (afterData === 10) {
       setUserBal(userId, 40);
     } else if (afterData === 25) {
       setUserBal(userId, 50);
     } else if (afterData === 50) {
       setUserBal(userId, 100);
     } else if (afterData === 75) {
       setUserBal(userId, 150);
     } else if (afterData === 100) {
       setUserBal(userId, 200);
     } else if (afterData === 250) {
       setUserBal(userId, 250);
     } else if (afterData === 500) {
       setUserBal(userId, 300);
     } else if (afterData === 750) {
       setUserBal(userId, 500);
     } else if (afterData === 1000) {
       setUserBal(userId, 600);
     } else if (afterData === 2000) {
       setUserBal(userId, 700);
     } else if (afterData === 3000) {
       setUserBal(userId, 800);
     } else if (afterData === 5000) {
       setUserBal(userId, 1000);
     }
   } else if (achievementId === 'maxParties') {
     if (beforeData === null && afterData === 3) {
       setUserBal(userId, 20);
     } else if (afterData === 5) {
       setUserBal(userId, 30);
     } else if (afterData === 7) {
       setUserBal(userId, 40);
     } else if (afterData === 10) {
       setUserBal(userId, 50);
     } else if (afterData === 15) {
       setUserBal(userId, 60);
     } else if (afterData === 20) {
       setUserBal(userId, 100);
     } else if (afterData === 25) {
       setUserBal(userId, 200);
     } else if (afterData === 50) {
       setUserBal(userId, 300);
     } else if (afterData === 75) {
       setUserBal(userId, 400);
     } else if (afterData === 100) {
       setUserBal(userId, 500);
     } else if (afterData === 150) {
       setUserBal(userId, 700);
     } else if (afterData === 200) {
       setUserBal(userId, 900);
     } else if (afterData === 250) {
       setUserBal(userId, 1100);
     } else if (afterData === 500) {
       setUserBal(userId, 1300);
     } else if (afterData === 1000) {
       setUserBal(userId, 1500);
     }
   } else if (achievementId === 'suggestedToFriends') {
     if (beforeData === null && afterData === 1) {
       setUserBal(userId, 10);
     } else if (afterData === 3) {
       setUserBal(userId, 20);
     } else if (afterData === 5) {
       setUserBal(userId, 30);
     } else if (afterData === 7) {
       setUserBal(userId, 40);
     } else if (afterData === 10) {
       setUserBal(userId, 50);
     } else if (afterData === 15) {
       setUserBal(userId, 100);
     } else if (afterData === 20) {
       setUserBal(userId, 150);
     } else if (afterData === 25) {
       setUserBal(userId, 200);
     } else if (afterData === 50) {
       setUserBal(userId, 250);
     } else if (afterData === 75) {
       setUserBal(userId, 300);
     } else if (afterData === 100) {
       setUserBal(userId, 500);
     } else if (afterData === 250) {
       setUserBal(userId, 600);
     } else if (afterData === 500) {
       setUserBal(userId, 700);
     } else if (afterData === 750) {
       setUserBal(userId, 800);
     } else if (afterData === 1000) {
       setUserBal(userId, 1000);
     }
   } else if (achievementId === 'invitedFriends') {
     if (beforeData === null && afterData === 1) {
       setUserBal(userId, 10);
     } else if (afterData === 3) {
       setUserBal(userId, 25);
     } else if (afterData === 5) {
       setUserBal(userId, 50);
     } else if (afterData === 7) {
       setUserBal(userId, 75);
     } else if (afterData === 10) {
       setUserBal(userId, 100);
     } else if (afterData === 15) {
       setUserBal(userId, 250);
     } else if (afterData === 20) {
       setUserBal(userId, 500);
     } else if (afterData === 25) {
       setUserBal(userId, 750);
     } else if (afterData === 50) {
       setUserBal(userId, 1000);
     } else if (afterData === 75) {
       setUserBal(userId, 2500);
     } else if (afterData === 100) {
       setUserBal(userId, 5000);
     } else if (afterData === 250) {
       setUserBal(userId, 6000);
     } else if (afterData === 500) {
       setUserBal(userId, 7000);
     } else if (afterData === 750) {
       setUserBal(userId, 8000);
     } else if (afterData === 1000) {
       setUserBal(userId, 10000);
     }
   } else if (achievementId === 'reachedTournamentTop10') {
     if (beforeData === null && afterData === 1) {
       setUserBal(userId, 50);
     } else if (afterData === 3) {
       setUserBal(userId, 60);
     } else if (afterData === 5) {
       setUserBal(userId, 70);
     } else if (afterData === 7) {
       setUserBal(userId, 80);
     } else if (afterData === 10) {
       setUserBal(userId, 90);
     } else if (afterData === 15) {
       setUserBal(userId, 200);
     } else if (afterData === 20) {
       setUserBal(userId, 300);
     } else if (afterData === 25) {
       setUserBal(userId, 400);
     } else if (afterData === 30) {
       setUserBal(userId, 500);
     } else if (afterData === 35) {
       setUserBal(userId, 600);
     } else if (afterData === 50) {
       setUserBal(userId, 1000);
     } else if (afterData === 75) {
       setUserBal(userId, 1500);
     } else if (afterData === 100) {
       setUserBal(userId, 2000);
     } else if (afterData === 250) {
       setUserBal(userId, 2500);
     } else if (afterData === 500) {
       setUserBal(userId, 3000);
     }
   } else if (achievementId === 'storePurchase') {
     if (beforeData === null && afterData === 1) {
       setUserBal(userId, 50);
     } else if (afterData === 2) {
       setUserBal(userId, 60);
     } else if (afterData === 3) {
       setUserBal(userId, 70);
     } else if (afterData === 5) {
       setUserBal(userId, 80);
     } else if (afterData === 10) {
       setUserBal(userId, 90);
     } else if (afterData === 15) {
       setUserBal(userId, 200);
     } else if (afterData === 20) {
       setUserBal(userId, 300);
     } else if (afterData === 25) {
       setUserBal(userId, 400);
     } else if (afterData === 30) {
       setUserBal(userId, 500);
     } else if (afterData === 35) {
       setUserBal(userId, 600);
     } else if (afterData === 50) {
       setUserBal(userId, 1000);
     } else if (afterData === 75) {
       setUserBal(userId, 1500);
     } else if (afterData === 100) {
       setUserBal(userId, 2000);
     } else if (afterData === 250) {
       setUserBal(userId, 2500);
     } else if (afterData === 500) {
       setUserBal(userId, 3000);
     }
   } else if (achievementId === 'supportMessagesSent') {
     if (beforeData === null && afterData === 1) {
       setUserBal(userId, 50);
     } else if (afterData === 2) {
       setUserBal(userId, 60);
     } else if (afterData === 3) {
       setUserBal(userId, 70);
     } else if (afterData === 5) {
       setUserBal(userId, 80);
     } else if (afterData === 7) {
       setUserBal(userId, 90);
     } else if (afterData === 10) {
       setUserBal(userId, 200);
     } else if (afterData === 15) {
       setUserBal(userId, 300);
     } else if (afterData === 20) {
       setUserBal(userId, 400);
     } else if (afterData === 25) {
       setUserBal(userId, 500);
     } else if (afterData === 50) {
       setUserBal(userId, 600);
     } else if (afterData === 75) {
       setUserBal(userId, 1000);
     } else if (afterData === 100) {
       setUserBal(userId, 1500);
     } else if (afterData === 250) {
       setUserBal(userId, 2000);
     } else if (afterData === 500) {
       setUserBal(userId, 2500);
     } else if (afterData === 1000) {
       setUserBal(userId, 3000);
     }
   } else if (achievementId === 'joinedTournaments') {
     if (beforeData === null && afterData === 3) {
       setUserBal(userId, 10);
     } else if (afterData === 5) {
       setUserBal(userId, 20);
     } else if (afterData === 7) {
       setUserBal(userId, 30);
     } else if (afterData === 10) {
       setUserBal(userId, 40);
     } else if (afterData === 15) {
       setUserBal(userId, 50);
     } else if (afterData === 20) {
       setUserBal(userId, 100);
     } else if (afterData === 25) {
       setUserBal(userId, 150);
     } else if (afterData === 30) {
       setUserBal(userId, 200);
     } else if (afterData === 40) {
       setUserBal(userId, 250);
     } else if (afterData === 50) {
       setUserBal(userId, 300);
     } else if (afterData === 75) {
       setUserBal(userId, 500);
     } else if (afterData === 100) {
       setUserBal(userId, 600);
     } else if (afterData === 250) {
       setUserBal(userId, 700);
     } else if (afterData === 500) {
       setUserBal(userId, 800);
     } else if (afterData === 1000) {
       setUserBal(userId, 1000);
     }
   } else if (achievementId === 'moneyTotal') {
     admin.database().ref(`userAchievements/${userId}/moneyTotalLvl`).once('value', (snapshot) => {
       const moneyTotalLvl = snapshot.val() || 0;

    //   console.log('moneyTotalLvl');
      // console.log(moneyTotalLvl);

     if (moneyTotalLvl === 0 && afterData >= 1000) {
       setUserBal(userId, 10);
       admin.database().ref(`userAchievements/${userId}/moneyTotalLvl`).set(1);
     } else if (moneyTotalLvl === 1 && afterData >= 2500) {
       setUserBal(userId, 25);
       admin.database().ref(`userAchievements/${userId}/moneyTotalLvl`).set(2);
     } else if (moneyTotalLvl === 2 && afterData >= 5000) {
       setUserBal(userId, 50);
       admin.database().ref(`userAchievements/${userId}/moneyTotalLvl`).set(3);
     } else if (moneyTotalLvl === 3 && afterData >= 7500) {
       setUserBal(userId, 75);
       admin.database().ref(`userAchievements/${userId}/moneyTotalLvl`).set(4);
     } else if (moneyTotalLvl === 4 && afterData >= 10000) {
       setUserBal(userId, 100);
       admin.database().ref(`userAchievements/${userId}/moneyTotalLvl`).set(5);
     } else if (moneyTotalLvl === 5 && afterData >= 25000) {
       setUserBal(userId, 250);
       admin.database().ref(`userAchievements/${userId}/moneyTotalLvl`).set(6);
     } else if (moneyTotalLvl === 6 && afterData >= 50000) {
       setUserBal(userId, 500);
       admin.database().ref(`userAchievements/${userId}/moneyTotalLvl`).set(7);
     } else if (moneyTotalLvl === 7 && afterData >= 75000) {
       setUserBal(userId, 750);
       admin.database().ref(`userAchievements/${userId}/moneyTotalLvl`).set(8);
     } else if (moneyTotalLvl === 8 && afterData >= 100000) {
       setUserBal(userId, 1000);
       admin.database().ref(`userAchievements/${userId}/moneyTotalLvl`).set(9);
     } else if (moneyTotalLvl === 9 && afterData >= 250000) {
       setUserBal(userId, 2500);
       admin.database().ref(`userAchievements/${userId}/moneyTotalLvl`).set(10);
     } else if (moneyTotalLvl === 10 && afterData >= 500000) {
       setUserBal(userId, 5000);
       admin.database().ref(`userAchievements/${userId}/moneyTotalLvl`).set(11);
     } else if (moneyTotalLvl === 11 && afterData >= 1000000) {
       setUserBal(userId, 6000);
       admin.database().ref(`userAchievements/${userId}/moneyTotalLvl`).set(12);
     } else if (moneyTotalLvl === 12 && afterData >= 3000000) {
       setUserBal(userId, 7000);
       admin.database().ref(`userAchievements/${userId}/moneyTotalLvl`).set(13);
     } else if (moneyTotalLvl === 13 && afterData >= 5000000) {
       setUserBal(userId, 8000);
       admin.database().ref(`userAchievements/${userId}/moneyTotalLvl`).set(14);
     } else if (moneyTotalLvl === 14 && afterData >= 10000000) {
       setUserBal(userId, 10000);
       admin.database().ref(`userAchievements/${userId}/moneyTotalLvl`).set(15);
     }
   })
   } else if (achievementId === 'earnedInADay') {
     admin.database().ref(`userAchievements/${userId}/earnedInADayLvl`).once('value', (snapshot) => {
       const earnedInADayLvl = snapshot.val() || 0;

       if (earnedInADayLvl === 0 && afterData >= 750) {
         setUserBal(userId, 10);
         admin.database().ref(`userAchievements/${userId}/earnedInADayLvl`).set(1);
       } else if (earnedInADayLvl === 1 && afterData >= 1000) {
         setUserBal(userId, 30);
         admin.database().ref(`userAchievements/${userId}/earnedInADayLvl`).set(2);
       } else if (earnedInADayLvl === 2 && afterData >= 1500) {
         setUserBal(userId, 50);
         admin.database().ref(`userAchievements/${userId}/earnedInADayLvl`).set(3);
       } else if (earnedInADayLvl === 3 && afterData >= 2000) {
         setUserBal(userId, 70);
         admin.database().ref(`userAchievements/${userId}/earnedInADayLvl`).set(4);
       } else if (earnedInADayLvl === 4 && afterData >= 3000) {
         setUserBal(userId, 90);
         admin.database().ref(`userAchievements/${userId}/earnedInADayLvl`).set(5);
       } else if (earnedInADayLvl === 5 && afterData >= 5000) {
         setUserBal(userId, 300);
         admin.database().ref(`userAchievements/${userId}/earnedInADayLvl`).set(6);
       } else if (earnedInADayLvl === 6 && afterData >= 7500) {
         setUserBal(userId, 500);
         admin.database().ref(`userAchievements/${userId}/earnedInADayLvl`).set(7);
       } else if (earnedInADayLvl === 7 && afterData >= 10000) {
         setUserBal(userId, 700);
         admin.database().ref(`userAchievements/${userId}/earnedInADayLvl`).set(8);
       } else if (earnedInADayLvl === 8 && afterData >= 15000) {
         setUserBal(userId, 900);
         admin.database().ref(`userAchievements/${userId}/earnedInADayLvl`).set(9);
       } else if (earnedInADayLvl === 9 && afterData >= 25000) {
         setUserBal(userId, 1100);
         admin.database().ref(`userAchievements/${userId}/earnedInADayLvl`).set(10);
       } else if (earnedInADayLvl === 10 && afterData >= 50000) {
         setUserBal(userId, 2000);
         admin.database().ref(`userAchievements/${userId}/earnedInADayLvl`).set(11);
       } else if (earnedInADayLvl === 11 && afterData >= 75000) {
         setUserBal(userId, 3000);
         admin.database().ref(`userAchievements/${userId}/earnedInADayLvl`).set(12);
       } else if (earnedInADayLvl === 12 && afterData >= 100000) {
         setUserBal(userId, 4000);
         admin.database().ref(`userAchievements/${userId}/earnedInADayLvl`).set(13);
       } else if (earnedInADayLvl === 13 && afterData >= 250000) {
         setUserBal(userId, 5000);
         admin.database().ref(`userAchievements/${userId}/earnedInADayLvl`).set(14);
       } else if (earnedInADayLvl === 14 && afterData >= 500000) {
         setUserBal(userId, 6000);
         admin.database().ref(`userAchievements/${userId}/earnedInADayLvl`).set(15);
       }
     });
   } else if (achievementId === 'maxPoints') {
     admin.database().ref(`userAchievements/${userId}/maxPointsLvl`).once('value', (snapshot) => {
       const maxPointsLvl = snapshot.val() || 0;

       if (maxPointsLvl === 0 && afterData >= 10) {
         setUserBal(userId, 100);
         admin.database().ref(`userAchievements/${userId}/maxPointsLvl`).set(1);
       } else if (maxPointsLvl === 1 && afterData >= 25) {
         setUserBal(userId, 200);
         admin.database().ref(`userAchievements/${userId}/maxPointsLvl`).set(2);
       } else if (maxPointsLvl === 2 && afterData >= 50) {
         setUserBal(userId, 300);
         admin.database().ref(`userAchievements/${userId}/maxPointsLvl`).set(3);
       } else if (maxPointsLvl === 3 && afterData >= 75) {
         setUserBal(userId, 500);
         admin.database().ref(`userAchievements/${userId}/maxPointsLvl`).set(4);
       } else if (maxPointsLvl === 4 && afterData >= 100) {
         setUserBal(userId, 500);
         admin.database().ref(`userAchievements/${userId}/maxPointsLvl`).set(5);
       } else if (maxPointsLvl === 5 && afterData >= 250) {
         setUserBal(userId, 1000);
         admin.database().ref(`userAchievements/${userId}/maxPointsLvl`).set(6);
       } else if (maxPointsLvl === 6 && afterData >= 500) {
         setUserBal(userId, 1250);
         admin.database().ref(`userAchievements/${userId}/maxPointsLvl`).set(7);
       } else if (maxPointsLvl === 7 && afterData >= 750) {
         setUserBal(userId, 1500);
         admin.database().ref(`userAchievements/${userId}/maxPointsLvl`).set(8);
       } else if (maxPointsLvl === 8 && afterData >= 1000) {
         setUserBal(userId, 1750);
         admin.database().ref(`userAchievements/${userId}/maxPointsLvl`).set(9);
       } else if (maxPointsLvl === 9 && afterData >= 2500) {
         setUserBal(userId, 2000);
         admin.database().ref(`userAchievements/${userId}/maxPointsLvl`).set(10);
       } else if (maxPointsLvl === 10 && afterData >= 5000) {
         setUserBal(userId, 2250);
         admin.database().ref(`userAchievements/${userId}/maxPointsLvl`).set(11);
       } else if (maxPointsLvl === 11 && afterData >= 7500) {
         setUserBal(userId, 2500);
         admin.database().ref(`userAchievements/${userId}/maxPointsLvl`).set(12);
       } else if (maxPointsLvl === 12 && afterData >= 10000) {
         setUserBal(userId, 2750);
         admin.database().ref(`userAchievements/${userId}/maxPointsLvl`).set(13);
       } else if (maxPointsLvl === 13 && afterData >= 25000) {
         setUserBal(userId, 3000);
         admin.database().ref(`userAchievements/${userId}/maxPointsLvl`).set(14);
       } else if (maxPointsLvl === 14 && afterData >= 50000) {
         setUserBal(userId, 5000);
         admin.database().ref(`userAchievements/${userId}/maxPointsLvl`).set(15);
       }
     });
   } else if (achievementId === 'minPoints') {
     admin.database().ref(`userAchievements/${userId}/minPointsLvl`).once('value', (snapshot) => {
       const minPointsLvl = snapshot.val() || 0;

     if (minPointsLvl === 0 && afterData <= -1) {
       setUserBal(userId, 50);
       admin.database().ref(`userAchievements/${userId}/minPointsLvl`).set(1);
     } else if (minPointsLvl === 1 && afterData <= -5) {
       setUserBal(userId, 60);
       admin.database().ref(`userAchievements/${userId}/minPointsLvl`).set(2);
     } else if (minPointsLvl === 2 && afterData <= -10) {
       setUserBal(userId, 70);
       admin.database().ref(`userAchievements/${userId}/minPointsLvl`).set(3);
     } else if (minPointsLvl === 3 && afterData <= -25) {
       setUserBal(userId, 80);
       admin.database().ref(`userAchievements/${userId}/minPointsLvl`).set(4);
     } else if (minPointsLvl === 4 && afterData <= -50) {
       setUserBal(userId, 90);
       admin.database().ref(`userAchievements/${userId}/minPointsLvl`).set(5);
     } else if (minPointsLvl === 5 && afterData <= -100) {
       setUserBal(userId, 200);
       admin.database().ref(`userAchievements/${userId}/minPointsLvl`).set(6);
     } else if (minPointsLvl === 6 && afterData <= -250) {
       setUserBal(userId, 300);
       admin.database().ref(`userAchievements/${userId}/minPointsLvl`).set(7);
     } else if (minPointsLvl === 7 && afterData <= -500) {
       setUserBal(userId, 400);
       admin.database().ref(`userAchievements/${userId}/minPointsLvl`).set(8);
     } else if (minPointsLvl === 8 && afterData <= -750) {
       setUserBal(userId, 500);
       admin.database().ref(`userAchievements/${userId}/minPointsLvl`).set(9);
     } else if (minPointsLvl === 9 && afterData <= -1000) {
       setUserBal(userId, 600);
       admin.database().ref(`userAchievements/${userId}/minPointsLvl`).set(10);
     } else if (minPointsLvl === 10 && afterData <= -2000) {
       setUserBal(userId, 1000);
       admin.database().ref(`userAchievements/${userId}/minPointsLvl`).set(11);
     } else if (minPointsLvl === 11 && afterData <= -3000) {
       setUserBal(userId, 1500);
       admin.database().ref(`userAchievements/${userId}/minPointsLvl`).set(12);
     } else if (minPointsLvl === 12 && afterData <= -5000) {
       setUserBal(userId, 2000);
       admin.database().ref(`userAchievements/${userId}/minPointsLvl`).set(13);
     } else if (minPointsLvl === 13 && afterData <= -10000) {
       setUserBal(userId, 2500);
       admin.database().ref(`userAchievements/${userId}/minPointsLvl`).set(14);
     } else if (minPointsLvl === 14 && afterData <= -25000) {
       setUserBal(userId, 4000);
       admin.database().ref(`userAchievements/${userId}/minPointsLvl`).set(15);
     }
   });
   } else if (achievementId === '') {

   }
  }

  return resolve();
}))

module.exports = onAchievementUpdate;
