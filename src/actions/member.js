import LogRocket from 'logrocket';
import smartlookClient from 'smartlook-client';
import { errorMessages } from '../constants/messages';
import { Firebase, FirebaseRef, LeaderboardRef, StatusRef, statusApp, RoomsPublicRef } from '../lib/firebase';


// const firebase = require('firebase');

export function signUp(formData) {
  const {
    email, password, password2, firstName, lastName,
  } = formData;

  return dispatch => new Promise(async (resolve, reject) => {
    // Validation rules
    if (!firstName) return reject({ code: errorMessages.missingFirstName });
    if (!lastName) return reject({ code: errorMessages.missingLastName });
    if (!email) return reject({ code: errorMessages.missingEmail });
    if (!password) return reject({ code: errorMessages.missingPassword });
    if (!password2) return reject({ code: errorMessages.missingPassword });
    if (password !== password2) return reject({ code: errorMessages.passwordsDontMatch });

    // Go to Firebase
    return Firebase.auth().createUserWithEmailAndPassword(email, password)
      .then((res) => {
        // Send user details to Firebase database

        if (res && res.user.uid) {
          res.user.sendEmailVerification()
            .catch(() => console.log('Verification email failed to send'));

          const afterEmailAuthFunction = Firebase.app().functions('europe-west1').httpsCallable('afterEmailRegistration');

          afterEmailAuthFunction({
            providerData: res.user.providerData[0],
            uid: res.user.uid,
            firstName,
            lastName,
          }).then((result) => {
            resolve(dispatch({
              type: 'USER_DATA',
              data: result.data,
            }));
          });
        }
      }).catch(reject);
  }).catch((err) => { throw err.code; });
}


/**
  * Get this User's Details
  */
export function getUserData() {
  console.log('getUserData');
  const UID = (
    FirebaseRef
    && Firebase
    && Firebase.auth()
    && Firebase.auth().currentUser
    && Firebase.auth().currentUser.uid
  ) ? Firebase.auth().currentUser.uid : null;

  console.log(UID);

  if (!UID) {
    return dispatch => new Promise((resolve) => {
      resolve(dispatch({
        type: 'USER_LOGOUT',
        data: {},
      }));
    });
  }


//  FirebaseRef.child(`tests/FirebaseTests`)
  //  .on('value', (snapshot) => {
  //    const userData = snapshot.val();

    //  dispatch({ type: 'USER_DATA_CHANGE', data: { userData, key } });
  //  });

//  FirebaseRef.child(`tests/FirebaseTests2`)
//    .on('value', (snapshot) => {
  //    const userData = snapshot.val();

    //  dispatch({ type: 'USER_DATA_CHANGE', data: { userData, key } });
  //  });

  return dispatch => new Promise((resolve) => {
    LeaderboardRef.child(`leaderboard/allTime/${UID}/pos`)
      .on('value', (snapshot) => {
        const leaderboardPos = snapshot.val();

        dispatch({ type: 'USER_LEADERBOARD_POSITION_CHANGE', data: leaderboardPos });
      });

    FirebaseRef.child(`users/${UID}`)
      .on('child_changed', (snapshot) => {
        const userData = snapshot.val();
        const { key } = snapshot;

        if (key === 'joinedRoom') {
          console.log('joinedRoom');
          console.log(userData);
        }

        dispatch({ type: 'USER_DATA_CHANGE', data: { userData, key } });
      });


    FirebaseRef.child(`users/${UID}`)
      .on('child_added', (snapshot) => {
        const userData = snapshot.val();
        const { key } = snapshot;

        if (key === 'joinedRoom') {
          console.log('joinedRoom');
          console.log(userData);
        }

        dispatch({ type: 'USER_DATA_CHANGE', data: { userData, key } });
      });

    FirebaseRef.child(`users/${UID}`)
      .on('child_removed', (snapshot) => {
        //  const userData = snapshot.val() || null;
        const { key } = snapshot;

        dispatch({ type: 'USER_DATA_CHANGE', data: { userData: null, key } });
      });

    //  return resolve();

    FirebaseRef.child(`users/${UID}`)
      .once('value', (snapshot) => {
        const userData = snapshot.val() || {};

        resolve(dispatch({
          type: 'USER_DATA',
          data: {
            uid: userData.uid,
            name: userData.name,
            email: userData.email,
            photo: userData.photo,
            level: userData.lvl,
            balance: userData.bal,
          //  position: userData.pos,
            levelupGameLimit: userData.lvlupLimit,
            lvlUpNotification: userData.lvlUpNotification,
            gamesPlayed: userData.gPlayed,
            gamesWon: userData.gWon,
            totalPoints: userData.totalPnts,
            nextBonusSpin: userData.nxtSpin,
            lastBonusSpin: userData.lastSpin,
            status: 'logged In',
            role: userData.role,
            lastLogin: userData.lastLogin,
            socProvider: userData.socProvider,
            tutorialShown: userData.tutorialShown,
            firstTimeModal: userData.firstTimeModal,
            blocked: userData.blocked,
            banEndDate: userData.banEndDate,
            banReason: userData.banReason,
            joinedRooms: userData.joinedRooms,
          },
        }));
      });

    return resolve();
  });
}

export function getMemberData() {
  if (Firebase === null) return () => new Promise(resolve => resolve());

  return () => new Promise((resolve) => {
    Firebase.auth().onAuthStateChanged((loggedIn) => {
      console.log('loggedIn');
      console.log(loggedIn);
      if (loggedIn) {
        return resolve(getUserData());
      }
      return () => new Promise(() => resolve());
    });
  });
}

/**
  * Login to Firebase with Email/Password
  */
export function login(formData, language) {
  const { email, password } = formData;

  return dispatch => new Promise(async (resolve, reject) => {
    // Validation rules
    if (!email) return reject({ code: errorMessages.missingEmail });
    if (!password) return reject({ code: errorMessages.missingPassword });

    // Go to Firebase
    return Firebase.auth().setPersistence(Firebase.auth.Auth.Persistence.LOCAL)


    const promise1 = Firebase.auth().setPersistence(Firebase.auth.Auth.Persistence.LOCAL);
    const promise2 = Firebase.app('app4').auth().setPersistence(Firebase.auth.Auth.Persistence.LOCAL);
    const promise3 = Firebase.app('app3').auth().setPersistence(Firebase.auth.Auth.Persistence.LOCAL);
    const promise4 = Firebase.app('app6').auth().setPersistence(Firebase.auth.Auth.Persistence.LOCAL);

    Promise.all([promise1, promise2, promise3, promise4]).then((promisesRes2) => {

    const promise5 = Firebase.auth().signInWithEmailAndPassword(email, password);
    const promise6 = Firebase.app('app4').auth().signInWithEmailAndPassword(email, password);
    const promise7 = Firebase.app('app3').auth().signInWithEmailAndPassword(email, password);
    const promise8 = Firebase.app('app6').auth().signInWithEmailAndPassword(email, password);

    Promise.all([promise5, promise6, promise7, promise8]).then((promisesRes) => {
      console.log('promisesRes');
      console.log(promisesRes);
      const res = promisesRes[0];

    //  .then(() => Firebase.auth().signInWithEmailAndPassword(email, password)
    //    .then(async (res) => {
          const userDetails = res && res.user ? res.user : null;

          if (userDetails.uid) {
            // Update last logged in data
            FirebaseRef.child(`users/${userDetails.uid}`).update({
              lastLogin: Firebase.database.ServerValue.TIMESTAMP,
            });

            if (userDetails.emailVerified === false) {
              Firebase.auth().languageCode = language;
              Firebase.auth().currentUser.sendEmailVerification()
                .catch(() => console.log('Verification email failed to send'));

              dispatch(logout());
              return reject({ code: errorMessages.unverifiedEmail });
            }

            // Get User Data from DB (different to auth user data)
            getUserData();
          }

          return resolve(dispatch({ type: 'USER_LOGIN', data: userDetails }));
        }).catch(reject);
      }).catch(reject);
  }).catch((err) => { throw err.code; });
}


/**
  * Get draugiem auth url
  */
 export function getDraugiemAuthUrl(redirectUrl) {
  return () => new Promise(async (resolve, reject) => {
    const fn = Firebase.app().functions('europe-west1').httpsCallable('draugiemAuthUrl');
    return fn({
      redirectUrl,
    }).then((result) => {
      resolve(result)
    }).catch(reject);
  });
}


/**
  * Login to Firebase with Facebook
  */

export function signInWithFacebook(fbToken) {
  return (dispatch) => new Promise((resolve, reject) => {
  //  const credential = Firebase.auth().FacebookAuthProvider.credential(fbToken);
    const credential = Firebase.auth.FacebookAuthProvider.credential(
      fbToken,
    );
  //  Firebase.auth().signInWithCredential(credential)
  //    .then((user) => {

    const promise5 = Firebase.auth().signInWithCredential(credential);
    const promise6 = Firebase.app('app4').auth().signInWithCredential(credential);
    const promise7 = Firebase.app('app3').auth().signInWithCredential(credential);
    const promise8 = Firebase.app('app6').auth().signInWithCredential(credential);

    Promise.all([promise5, promise6, promise7, promise8]).then((promisesRes) => {
      console.log('promisesRes');
      console.log(promisesRes);
      const user = promisesRes[0];

      console.log('user');
      console.log(user);

        // Get the user object from the realtime database
        Firebase.database.ref('users').child(user.uid).once('value')
          .then((snapshot) => {
            const exists = (snapshot.val() !== null);
            const userData = snapshot.val();

            dispatch({ type: 'USER_FB_LOGIN', userData });
            resolve({ exists, user });
          })
          .catch(error => reject(error));
      })
      .catch(error => reject(error));
  });
}

/*

export async function signInWithFacebook() {
  console.log('signInWithFacebook');
  const { appId } = Expo.Constants.manifest.extra.facebook;

  console.log(appId);
  const permissions = ['public_profile', 'email']; // Permissions required, consult Facebook docs
  return dispatch => new Promise((resolve, reject) => {
    console.log('test1');
    Expo.Facebook.logInWithReadPermissionsAsync(
      appId,
      { permissions },
    ).then((res) => {
      const {
        type,
        token,
      } = res;
      console.log('token');
      console.log(token);

      console.log('type');
      console.log(type);

      if (type === 'success') {
        console.log('success');
        const credential = Firebase.auth.FacebookAuthProvider.credential(token);
        console.log(credential);
        Firebase.auth().setPersistence(Firebase.auth.Auth.Persistence.LOCAL)
          .then(() => Firebase.auth().signInAndRetrieveDataWithCredential(credential)
            .then(async (res2) => {
              console.log(res2);
              console.log(credential);

              return resolve(dispatch({ type: 'USER_FB_LOGIN', data: 'success' }));
            }).catch(reject))
          .catch(reject);
      }
      return resolve(dispatch({ type: 'USER_FB_LOGIN', data: 'cancel' }));
    }).catch(reject);
  }).catch((err) => { throw err.message; });
}
*/

/**
  * Reset Password
  */
export function resetPassword(formData) {
  const { email } = formData;

  return dispatch => new Promise(async (resolve, reject) => {
    // Validation rules
    if (!email) return reject({ code: errorMessages.missingEmail });

    // Go to Firebase
    return Firebase.auth().sendPasswordResetEmail(email)
      .then(() => resolve(dispatch({ type: 'USER_RESET' })))
      .catch(reject);
  }).catch((err) => { throw err.code; });
}


/**
  * Update Profile
  */

/*
export function updateProfile(formData) {
  const {
    email, password, password2, firstName, lastName, changeEmail, changePassword,
  } = formData;

  return dispatch => new Promise(async (resolve, reject) => {
    // Are they a user?
    const UID = Firebase.auth().currentUser.uid;
    if (!UID) return reject({ message: errorMessages.missingFirstName });

    // Validation rules
    if (!firstName) return reject({ message: errorMessages.missingFirstName });
    if (!lastName) return reject({ message: errorMessages.missingLastName });
    if (changeEmail) {
      if (!email) return reject({ message: errorMessages.missingEmail });
    }
    if (changePassword) {
      if (!password) return reject({ message: errorMessages.missingPassword });
      if (!password2) return reject({ message: errorMessages.missingPassword });
      if (password !== password2) return reject({ message: errorMessages.passwordsDontMatch });
    }

    return FirebaseRef.child(`users/${UID}`).update({ firstName, lastName })
      .then(async () => {
        if (changeEmail) {
          await Firebase.auth().currentUser.updateEmail(email).catch(reject);
        }
        if (changePassword) {
          await Firebase.auth().currentUser.updatePassword(password).catch(reject);
        }

        return resolve(getUserData());
      }).catch(reject);
  }).catch((err) => { throw err.message; });
}

*/


export function logout() {
  console.log('************************** logout ******************************');

  if (Firebase === null) return () => new Promise(resolve => resolve());

  const UID = (
    FirebaseRef
    && Firebase
    && Firebase.auth()
    && Firebase.auth().currentUser
    && Firebase.auth().currentUser.uid
  ) ? Firebase.auth().currentUser.uid : null;

  console.log(UID);

  if (!UID) return () => new Promise(resolve => resolve());

  StatusRef.child(`status/${UID}`).remove().catch(err => {
    // Handle error
  });

  return dispatch => new Promise((resolve, reject) => Firebase.auth().signOut()
    .then(() => {
      console.log('user logged out');
      resolve(dispatch({ type: 'USER_LOGOUT', data: { status: 'signedOut' } }));
    })
    .catch(reject)).catch((err) => { throw err.message; });
}


function isUserEqual(facebookAuthResponse, firebaseUser) {
  if (firebaseUser) {
    const { providerData } = firebaseUser;

    for (let i = 0; i < providerData.length; i += 1) {
      if (providerData[i].providerId === Firebase.auth.FacebookAuthProvider.PROVIDER_ID
      && providerData[i].uid === facebookAuthResponse.userID) {
        // We don't need to re-auth the Firebase connection.
        return true;
      }
    }
  }
  return false;
}

export function updateUserLastLogin() {
  if (Firebase === null) return () => new Promise(resolve => resolve());

  const UID = (
    FirebaseRef
    && Firebase
    && Firebase.auth()
    && Firebase.auth().currentUser
    && Firebase.auth().currentUser.uid
  ) ? Firebase.auth().currentUser.uid : null;

  if (!UID) return () => new Promise(resolve => resolve());

  return () => new Promise((resolve) => {
    Firebase.database().ref(`users/${UID}/joinedRooms`).once('value', (snapshot) => {
      const joinedRooms = snapshot.val() || null;

      StatusRef.child(`status/${UID}`).onDisconnect().remove().catch(err => {
        // Handle error
      });

      StatusRef.child(`status/${UID}`).update({
        lastAction: Firebase.database.ServerValue.TIMESTAMP,
      }).catch(err => {
        // Handle error
      });

      return resolve();
    });
  });
}

export function removeUserOnDisconnect() {
  if (Firebase === null) return () => new Promise(resolve => resolve());

  const UID = (
    FirebaseRef
    && Firebase
    && Firebase.auth()
    && Firebase.auth().currentUser
    && Firebase.auth().currentUser.uid
  ) ? Firebase.auth().currentUser.uid : null;

  if (!UID) return () => new Promise(resolve => resolve());

  return () => new Promise((resolve) => {
    Firebase.database().ref(`users/${UID}`).once('value', (snapshot) => {
      const userData = snapshot.val() || {};

      StatusRef.child(`status/${UID}`).onDisconnect().remove().catch(err => {
        // Handle error
      });

      const punctuationless = userData.name.replace(/[\.,-\/#!$%\^&\*;:{}=\-_`~()@\+\?><\[\]\+]/g, '');
      const finalString = punctuationless.replace(/\s{2,}/g, ' ');

      const lowerCaseName = finalString.toLowerCase();

      StatusRef.child(`status/${UID}`).update({
        status: true,
      //  name: userData.name,
      //  lowerCaseName,
      //  photo: userData.photo,
      //  lvl: userData.lvl,
      //  bal: userData.bal,
      //  totalPnts: userData.totalPnts,
      //  inRoom: !!userData.joinedRooms,
      //  lastLogin: Firebase.database.ServerValue.TIMESTAMP,
        lastAction: Firebase.database.ServerValue.TIMESTAMP,
      }).catch(err => {
        // Handle error
      });

      return resolve();
    });
  });
}

export function checkLoginState(event) {
  return dispatch => new Promise((resolve) => {
    //  console.log(event.authResponse);

  //  Firebase.auth().signOut().then(() => {

    if (event.authResponse) {
      const unsubscribe = Firebase.auth().onAuthStateChanged((firebaseUser) => {
        unsubscribe();
        // Check if we are already signed-in Firebase with the correct user.

        if (!isUserEqual(event.authResponse, firebaseUser)) {
        // Build Firebase credential with the Facebook auth token.
          const credential = Firebase.auth.FacebookAuthProvider.credential(
            event.authResponse.accessToken,
          );
          // Sign in with the credential from the Facebook user.

        //  const promise1 = Firebase.auth().setPersistence(Firebase.auth.Auth.Persistence.LOCAL);
        //  const promise2 = Firebase.app('app4').auth().setPersistence(Firebase.auth.Auth.Persistence.LOCAL);
        //  const promise3 = Firebase.app('app3').auth().setPersistence(Firebase.auth.Auth.Persistence.LOCAL);
        //  const promise4 = Firebase.app('app6').auth().setPersistence(Firebase.auth.Auth.Persistence.LOCAL);

        //  Promise.all([promise1, promise2, promise3, promise4]).then((promisesRes2) => {

          const promise5 = Firebase.auth().signInAndRetrieveDataWithCredential(credential);
          const promise6 = Firebase.app('app4').auth().signInAndRetrieveDataWithCredential(credential);
          const promise7 = Firebase.app('app3').auth().signInAndRetrieveDataWithCredential(credential);
          const promise8 = Firebase.app('app6').auth().signInAndRetrieveDataWithCredential(credential);

          Promise.all([promise5, promise6, promise7, promise8]).then((promisesRes) => {
            console.log('promisesRes');
            console.log(promisesRes);
            const res = promisesRes[0];

        //  Firebase.auth().signInAndRetrieveDataWithCredential(credential).then((res) => {
            const afterFBAuthFunction = Firebase.app().functions('europe-west1').httpsCallable('afterFBAuth');

            afterFBAuthFunction({
              uid: res.user.uid,
              providerData: res.user.providerData,
              additionalUserInfo: res.user.additionalUserInfo,
            }).then((result) => {
              if (result.data && result.data.uid) {

                if (result.data.enableLogRocket) {
                  LogRocket.init('zole/zole');

                  LogRocket.identify(result.data.uid, {
                    name: result.data.name,
                    email: result.data.email,
                  });
                }

                const {
                  uid, name, photo, lvl, bal, totalPnts, joinedRooms,
                } = result.data;

                if (uid) {
                  StatusRef.child(`status/${uid}`).onDisconnect().remove().catch(err => {
                    // Handle error
                  });

                  Firebase.database().ref(`users/${uid}`).update({
                    lastLogin: Firebase.database.ServerValue.TIMESTAMP,
                  });

                  const punctuationless = name.replace(/[\.,-\/#!$%\^&\*;:{}=\-_`~()@\+\?><\[\]\+]/g, '');
                  const finalString = punctuationless.replace(/\s{2,}/g, ' ');

                  const lowerCaseName = finalString.toLowerCase();

                  StatusRef.child(`status/${uid}`).update({
                    status: true,
                  //  name,
                  //  lowerCaseName,
                  //  photo,
                  //  lvl,
                  //  bal,
                  //  totalPnts,
                  //  inRoom: !!joinedRooms,
                  //  lastLogin: Firebase.database.ServerValue.TIMESTAMP,
                    lastAction: Firebase.database.ServerValue.TIMESTAMP,
                  }).catch(err => {
                    // Handle error
                  });
                }
              }

              resolve(dispatch({
                type: 'USER_DATA',
                data: result.data,
              }));
            }).catch((err) => {
              console.log('FB Auth problem');
              console.log(err);
            });
          }).catch((err) => {
            console.log('FB signIn problem');
            console.log(err);
          });
      //  }).catch((err) => {
      //    console.log('FB Persistence problem');
      //    console.log(err);
      //  });
        } else {
          FirebaseRef.child(`users/${firebaseUser.uid}`)
            .once('value', (playerSnapshot) => {
              const playerData = playerSnapshot.val() || {};

              if (playerData.enableLogRocket) {
                LogRocket.init('zole/zole');

                LogRocket.identify(playerData.uid, {
                  name: playerData.name,
                  email: playerData.email,
                });
              }

              console.log('playerData');
              console.log(playerData);

              if (Firebase.auth().currentUser) {
                const { uid, displayName, photoURL } = Firebase.auth().currentUser;

                StatusRef.child(`status/${uid}`).onDisconnect().remove().catch(err => {
                  console.log(err);
                });

                Firebase.database().ref(`users/${uid}`).update({
                  lastLogin: Firebase.database.ServerValue.TIMESTAMP,
                });
                let lowerCaseName;

                if (playerData && playerData.name) {
                  const punctuationless = playerData.name.replace(/[\.,-\/#!$%\^&\*;:{}=\-_`~()@\+\?><\[\]\+]/g, '');
                  const finalString = punctuationless.replace(/\s{2,}/g, ' ');

                  lowerCaseName = finalString.toLowerCase();
                }

                StatusRef.child(`status/${uid}`).update({
                  status: true,
                  lastAction: Firebase.database.ServerValue.TIMESTAMP,
                }).catch(err => {
                  console.log(err);
                });
              }

              if (firebaseUser && (!playerData || !playerData.uid)) {
                const afterFBAuthFunction = Firebase.app().functions('europe-west1').httpsCallable('afterFBAuth');

                afterFBAuthFunction({
                  uid: firebaseUser.uid,
                  providerData: firebaseUser.providerData,
                }).then((result) => {
                  resolve(dispatch({
                    type: 'USER_DATA',
                    data: result.data,
                  }));
                }).catch((err) => {
                  console.log('FB Auth problem');
                  console.log(err);
                });
              } else {
                resolve(dispatch({
                  type: 'USER_DATA',
                  data: {
                    uid: playerData.uid,
                    name: playerData.name,
                    email: playerData.email,
                    photo: playerData.photo,
                    level: playerData.lvl,
                    balance: playerData.bal,
                  //  position: playerData.pos,
                    levelupGameLimit: playerData.lvlupLimit,
                    lvlUpNotification: playerData.lvlUpNotification,
                    gamesPlayed: playerData.gPlayed,
                    gamesWon: playerData.gWon,
                    totalPoints: playerData.totalPnts,
                    nextBonusSpin: playerData.nxtSpin,
                    lastBonusSpin: playerData.lastSpin,
                    status: 'logged In',
                    role: playerData.role,
                    lastLogin: playerData.lastLogin,
                    socProvider: playerData.socProvider,
                    tutorialShown: playerData.tutorialShown,
                    firstTimeModal: playerData.firstTimeModal,
                    blocked: playerData.blocked,
                    banEndDate: playerData.banEndDate,
                    banReason: playerData.banReason,
                    joinedRooms: playerData.joinedRooms,
                  },
                }));
              }

              //  resolve(dispatch({ type: 'USER_DATA', data: firebaseUser }));
            });
        }
      });
    } else {
    // User is signed-out of Facebook.
      Firebase.auth().signOut();
      resolve(dispatch({ type: 'USER_LOGOUT', data: { status: 'signedOut' } }));
    }
//  });
  });
}


export function spinBonusWheel() {
  if (Firebase === null) return () => new Promise(resolve => resolve());

  const UID = (
    FirebaseRef
    && Firebase
    && Firebase.auth()
    && Firebase.auth().currentUser
    && Firebase.auth().currentUser.uid
  ) ? Firebase.auth().currentUser.uid : null;

  if (!UID) return () => new Promise(resolve => resolve());

  return () => new Promise((resolve) => {
    const spinWheelFunction = Firebase.app().functions().httpsCallable('spinBonusWheel2');

    spinWheelFunction().then((result) => {
      resolve(result);
    });
  });
}

export function claimSpinResults() {
  if (Firebase === null) return () => new Promise(resolve => resolve());

  const UID = (
    FirebaseRef
    && Firebase
    && Firebase.auth()
    && Firebase.auth().currentUser
    && Firebase.auth().currentUser.uid
  ) ? Firebase.auth().currentUser.uid : null;

  if (!UID) return () => new Promise(resolve => resolve());

  return () => new Promise((resolve) => {
    const claimSpinResultsFunction = Firebase.app().functions().httpsCallable('claimSpinResults');

    claimSpinResultsFunction().then((result) => {
      resolve(result);
    });
  });
}


export function sendMoney(friendUid, amount) {
  if (Firebase === null) return () => new Promise(resolve => resolve());

  const UID = (
    FirebaseRef
    && Firebase
    && Firebase.auth()
    && Firebase.auth().currentUser
    && Firebase.auth().currentUser.uid
  ) ? Firebase.auth().currentUser.uid : null;

  if (!UID) return () => new Promise(resolve => resolve());

  return () => new Promise(() => {
    const sendMoneyFunction = Firebase.app().functions('europe-west1').httpsCallable('sendMoney');

    sendMoneyFunction({ friendUid, amount });
  });
}


export function draugiemAuth(authCode, devMode) {
  console.log(authCode);
  console.log(devMode);

  if (Firebase === null) return () => new Promise(resolve => resolve());

//    return (dispatch) => new Promise((resolve) => {
  const draugiemAuthFunction = Firebase.app().functions('europe-west1').httpsCallable('draugiemAuth');

  return new Promise((resolve, _reject) => draugiemAuthFunction({ authCode, devMode }).then((result) => {
    console.log('result');
    console.log(result);
    const { data } = result;
    if (data.status === 'success') {
      if (data.token) {

        const promise1 = Firebase.auth().setPersistence(Firebase.auth.Auth.Persistence.SESSION);
        const promise2 = Firebase.app('app4').auth().setPersistence(Firebase.auth.Auth.Persistence.SESSION);
      //  const promise3 = Firebase.app('app3').auth().setPersistence(Firebase.auth.Auth.Persistence.SESSION);
        const promise4 = Firebase.app('app6').auth().setPersistence(Firebase.auth.Auth.Persistence.SESSION);

        Promise.all([promise1, promise2, promise4]).then((promisesRes2) => {

        const promise5 = Firebase.auth().signInWithCustomToken(data.token);
        const promise6 = Firebase.app('app4').auth().signInWithCustomToken(data.token);
      //  const promise7 = Firebase.app('app3').auth().signInWithCustomToken(data.token);
        const promise8 = Firebase.app('app6').auth().signInWithCustomToken(data.token);

        Promise.all([promise5, promise6, promise8]).then((promisesRes) => {
          console.log('promisesRes');
          console.log(promisesRes);
          const res = promisesRes[0];
        //  const res2 = promisesRes[1];

      //  Firebase.auth().signInWithCustomToken(data.token).then((res) => {
          console.log('res');
          console.log(res);

          if (res.data && res.data.uid) {
            return FirebaseRef.child(`users/${res.data.uid.toString()}`)
              .once('value', (playerSnapshot) => {
                const playerData = playerSnapshot.val() || {};

                if (playerData.enableLogRocket) {
                  LogRocket.init('zole/zole');

                  LogRocket.identify(playerData.uid, {
                    name: playerData.name,
                    email: playerData.email,
                  });
                }

                const {
                  uid, name, photo, lvl, bal, totalPnts, joinedRooms, email, socProvider,
                } = playerData;

                if (uid) {
                  StatusRef.child(`status/${uid}`).onDisconnect().remove();

                  Firebase.database().ref(`users/${uid}`).update({
                    lastLogin: Firebase.database.ServerValue.TIMESTAMP,
                  });

                  StatusRef.child(`status/${uid}`).update({
                    status: true,
                    lastAction: Firebase.database.ServerValue.TIMESTAMP,
                  });
                }

              return resolve(playerData);
              });

          } else if (res.operationType === 'signIn' && res.user && res.user.uid) {
            return FirebaseRef.child(`users/${res.user.uid.toString()}`)
              .once('value', (playerSnapshot) => {
                const playerData = playerSnapshot.val() || {};

                console.log('playerData');
                console.log(playerData);

                if (playerData.enableLogRocket) {
                  LogRocket.init('zole/zole');

                  LogRocket.identify(playerData.uid, {
                    name: playerData.name,
                    email: playerData.email,
                  });
                }

                const { uid } = playerData;

                if (uid) {
                  StatusRef.child(`status/${uid}`).onDisconnect().remove();

                  Firebase.database().ref(`users/${uid}`).update({
                    lastLogin: Firebase.database.ServerValue.TIMESTAMP,
                  });

                  StatusRef.child(`status/${uid}`).update({
                    status: true,
                    lastAction: Firebase.database.ServerValue.TIMESTAMP,
                  });
                }

                return resolve(playerData);
              });

            //  return resolve();
          }
        }).catch((error) => {
          console.log(error);
        });
      }).catch((error) => {
        console.log(error);
      });
      } else {
        console.log('no token');

        return dispatch => new Promise((resolve, reject) => Firebase.auth().signOut()
          .then(() => {
            resolve(dispatch({ type: 'USER_LOGOUT', data: { status: 'signedOut' } }));
          })
          .catch(reject)).catch((err) => { throw err.message; });
      }
    } else {
      return dispatch => new Promise((resolve, reject) => Firebase.auth().signOut()
        .then(() => {
          resolve(dispatch({ type: 'USER_LOGOUT', data: { status: 'signedOut' } }));
        })
        .catch(reject)).catch((err) => { throw err.message; });

    //  return new Promise((resolve) => { resolve('success'); });
    }
  }));
//   });

//  return null;
}


export function submitError({
  type, message, member, roomId, globalParams, currentTurn, players, lastRoom, points, tournamentId,
}) {
  if (Firebase === null) return () => new Promise(resolve => resolve());

  const UID = (
    FirebaseRef
    && Firebase
    && Firebase.auth()
    && Firebase.auth().currentUser
    && Firebase.auth().currentUser.uid
  ) ? Firebase.auth().currentUser.uid : null;

  if (!UID) return false;

  const submitErrorFunction = Firebase.app().functions('europe-west1').httpsCallable('submitError');

  return dispatch => new Promise(async (resolve) => {
    submitErrorFunction({
      type,
      message,
      member,
      roomId,
      globalParams: {
        gameState: globalParams.gameState,
        bet: globalParams.bet,
        gameType: globalParams.gameType,
        party: globalParams.party,
        talking: globalParams.talking,
        roomClosed: globalParams.roomClosed,
        tournamentId: globalParams.tournamentId || null,
      },
      currentTurn: currentTurn || null,
      players: players || null,
      lastRoom,
      points: points || null,
      tournamentId: tournamentId || null,
    }).then((result) => {
      resolve(dispatch({ type: 'ERROR_SUBMITION', data: result }));
      return result;
    });
  });
}


export function getTimeOffset() {
  if (Firebase === null) return () => new Promise(resolve => resolve());

  return dispatch => new Promise(resolve => Firebase.database().ref('.info/serverTimeOffset')
    .on('value', (snap) => {
      const offset = snap.val();

      resolve(dispatch({ type: 'OFFSET', data: offset }));
    }));
}

export function initFBPayment(product) {
  if (Firebase === null) return () => new Promise(resolve => resolve());

  const UID = (
    FirebaseRef
    && Firebase
    && Firebase.auth()
    && Firebase.auth().currentUser
    && Firebase.auth().currentUser.uid
  ) ? Firebase.auth().currentUser.uid : null;

  if (!UID) return () => new Promise(resolve => resolve());

  const initFBPaymentFunction = Firebase.app().functions('europe-west1').httpsCallable('initFBPayment');

  return dispatch => new Promise(async (resolve) => {
    initFBPaymentFunction({
      product,
    }).then((result) => {
      resolve(dispatch({ type: 'INIT_FB_PAYMENT', data: result }));
      return result;
    });
  });
}

export function initDraugiemPayment(product) {
  console.log('initDraugiemPayment');
  console.log(product);
  if (Firebase === null) return () => new Promise(resolve => resolve());

  const UID = (
    FirebaseRef
    && Firebase
    && Firebase.auth()
    && Firebase.auth().currentUser
    && Firebase.auth().currentUser.uid
  ) ? Firebase.auth().currentUser.uid : null;

  if (!UID) return () => new Promise(resolve => resolve());

  const initDraugiemPaymentFunction = Firebase.app().functions('europe-west1').httpsCallable('initDraugiemPayment');

  return dispatch => new Promise(async (resolve) => {
    initDraugiemPaymentFunction({
      product,
    }).then((result) => {
      console.log('result');
      console.log(result);
      resolve(dispatch({ type: 'INIT_DRAUGIEM_PAYMENT', data: result }));
      return result;
    });

  //  resolve('success');
  });
}

export function initStripePayment(product) {
  if (Firebase === null) return () => new Promise(resolve => resolve());

  const UID = (
    FirebaseRef
    && Firebase
    && Firebase.auth()
    && Firebase.auth().currentUser
    && Firebase.auth().currentUser.uid
  ) ? Firebase.auth().currentUser.uid : null;

  if (!UID) return () => new Promise(resolve => resolve());

  const initStripePaymentFunction = Firebase.app().functions('europe-west1').httpsCallable('initStripePayment');

  return dispatch => new Promise(async (resolve) => {
    initStripePaymentFunction({
      product,
    }).then((result) => {
      resolve(dispatch({ type: 'INIT_STRIPE_PAYMENT', data: result }));
      return result;
    });
  });
}



export function fbPaymentCallback(resp) {
  if (Firebase === null) return () => new Promise(resolve => resolve());

  const UID = (
    FirebaseRef
    && Firebase
    && Firebase.auth()
    && Firebase.auth().currentUser
    && Firebase.auth().currentUser.uid
  ) ? Firebase.auth().currentUser.uid : null;

  if (!UID) return () => new Promise(resolve => resolve());

  //  console.log(resp);

  const fbPaymentCallbackFunction = Firebase.app().functions().httpsCallable('fbPaymentCallback');

  return dispatch => new Promise(async (resolve) => {
    fbPaymentCallbackFunction(resp).then((result) => {
      resolve(dispatch({ type: 'FB_PAYMENT_CALLBACK', data: result }));
      return result;
    });
  });
}

export function disableTutorial() {
//  console.log('disableTutorial');
  if (Firebase === null) return () => new Promise(resolve => resolve());

  const UID = (
    FirebaseRef
    && Firebase
    && Firebase.auth()
    && Firebase.auth().currentUser
    && Firebase.auth().currentUser.uid
  ) ? Firebase.auth().currentUser.uid : null;

  //  console.log(UID);

  if (!UID) return () => new Promise(resolve => resolve());

  return () => new Promise(resolve => Firebase.database().ref(`users/${UID}`).update({
    tutorialShown: true,
  }).then(() => {
    resolve({ status: 'success' });
  }));
}


export function setCheckedVersion(checkedVersion) {
  if (Firebase === null) return () => new Promise(resolve => resolve());

  const UID = (
    FirebaseRef
    && Firebase
    && Firebase.auth()
    && Firebase.auth().currentUser
    && Firebase.auth().currentUser.uid
  ) ? Firebase.auth().currentUser.uid : null;

  if (!UID) return () => new Promise(resolve => resolve());

  return () => new Promise(resolve => Firebase.database().ref(`users/${UID}`).update({
    newVersion: checkedVersion,
  }).then(() => {
    resolve({ status: 'success' });
  }));
}


export function disableFirstTimeNotif() {
  console.log('disableFirstTimeNotif');
  if (Firebase === null) return () => new Promise(resolve => resolve());

  const UID = (
    FirebaseRef
    && Firebase
    && Firebase.auth()
    && Firebase.auth().currentUser
    && Firebase.auth().currentUser.uid
  ) ? Firebase.auth().currentUser.uid : null;

  //  console.log(UID);

  if (!UID) return () => new Promise(resolve => resolve());

  console.log(UID);

  return () => new Promise(resolve => Firebase.database().ref(`users/${UID}`).update({
    firstTimeModal: true,
  }).then(() => {
    resolve({ status: 'success' });
  }));
}


export function sendSupportMessage({ message, name }) {
  let trimmedMessage = message.trim();
  if (!message || !trimmedMessage) return () => new Promise(resolve => resolve());

  console.log(message);
  console.log(trimmedMessage);

  if (Firebase === null) return () => new Promise(resolve => resolve());

  const UID = (
    FirebaseRef
    && Firebase
    && Firebase.auth()
    && Firebase.auth().currentUser
    && Firebase.auth().currentUser.uid
  ) ? Firebase.auth().currentUser.uid : null;

  return () => new Promise(resolve => FirebaseRef.child(`supportChat/messages/${UID}`).push({
    message: trimmedMessage,
    userUid: UID,
    date: Firebase.database.ServerValue.TIMESTAMP,
  }).then(() => {
    FirebaseRef.child(`supportChat/activeChats/${UID}`).update({
      name,
      active: true,
      responded: false,
      read: true,
      lastResponse: Firebase.database.ServerValue.TIMESTAMP,
    });

    FirebaseRef.child(`userAchievements/${UID}/supportMessagesSent`).transaction(count => (count || 0) + 1);

    resolve({ status: 'success' });
  }).catch((err) => {
    resolve({ status: 'error', mesage: err });
  }));
}

export function setSupportAsRead() {
//  console.log('setSupportAsRead');
  if (Firebase === null) return () => new Promise(resolve => resolve());

  const UID = (
    FirebaseRef
    && Firebase
    && Firebase.auth()
    && Firebase.auth().currentUser
    && Firebase.auth().currentUser.uid
  ) ? Firebase.auth().currentUser.uid : null;

  return () => new Promise(resolve => FirebaseRef.child(`supportChat/activeChats/${UID}`).update({
    read: true,
  }).then(() => {
    resolve({ status: 'success' });
  }).catch((err) => {
    resolve({ status: 'error', mesage: err });
  }));
}

export function readSupportStatus() {
  if (Firebase === null) return () => new Promise(resolve => resolve());

  const UID = (
    FirebaseRef
    && Firebase
    && Firebase.auth()
    && Firebase.auth().currentUser
    && Firebase.auth().currentUser.uid
  ) ? Firebase.auth().currentUser.uid : null;

  if (!UID) return () => new Promise(resolve => resolve());

  return dispatch => new Promise(resolve => FirebaseRef.child(`supportChat/activeChats/${UID}`)
    .on('value', (snapshot) => {
      const status = snapshot.val() || null;

      resolve(dispatch({
        type: 'SUPPORT_CHAT_STATUS',
        data: status,
      }));
    }));
}

export function readSupportChat() {
  if (Firebase === null) return () => new Promise(resolve => resolve());

  const UID = (
    FirebaseRef
    && Firebase
    && Firebase.auth()
    && Firebase.auth().currentUser
    && Firebase.auth().currentUser.uid
  ) ? Firebase.auth().currentUser.uid : null;

  if (!UID) return () => new Promise(resolve => resolve());

  return dispatch => new Promise(resolve => FirebaseRef.child(`supportChat/messages/${UID}`)
  .limitToLast(15)
    .on('value', (snapshot) => {
      const chat = snapshot.val() || {};

      console.log(chat);

      resolve(dispatch({
        type: 'SUPPORT_CHAT',
        data: chat,
      }));
    }));
}


export function getBalanceHistory(time) {
  if (Firebase === null) return () => new Promise(resolve => resolve());

  const UID = (
    FirebaseRef
    && Firebase
    && Firebase.auth()
    && Firebase.auth().currentUser
    && Firebase.auth().currentUser.uid
  ) ? Firebase.auth().currentUser.uid : null;

  if (!UID || !time) return () => new Promise(resolve => resolve());

  let startAt;
  let endAt;

  let d = new Date();
  d.setHours(24,0,0,0);
  d = Date.parse(d)

  if (time === 'today') {
    startAt = d - (1000 * 60 * 60 * 24);
    endAt = d;
  } else if (time === 'yesterday') {
    startAt = d - (1000 * 60 * 60 * 48);
    endAt = d - (1000 * 60 * 60 * 24);
  } else if (time === '2daysBefore') {
  startAt = d - (1000 * 60 * 60 * 72);
  endAt = d - (1000 * 60 * 60 * 48);
  } else {
    return () => new Promise(resolve => resolve());
  }

  return dispatch => new Promise(resolve => FirebaseRef.child(`userBalHistory/${UID}`)
    .orderByChild('time')
    .startAt(startAt)
    .endAt(endAt)
    .limitToFirst(100)
    .once('value', (snapshot) => {
      const history = snapshot.val() || {};

      resolve(dispatch({
        type: 'BAL_HISTORY',
        data: history,
      }));
    }));
}


export function blockUser(id, name) {
  if (Firebase === null) return () => new Promise(resolve => resolve());

  const UID = (
    FirebaseRef
    && Firebase
    && Firebase.auth()
    && Firebase.auth().currentUser
    && Firebase.auth().currentUser.uid
  ) ? Firebase.auth().currentUser.uid : null;

  if (!UID || !id || !name) return () => new Promise(resolve => resolve());

  return dispatch => new Promise(resolve => FirebaseRef.child(`ignoredPlayers/${UID}/${id}`).update({
  //  uid: blockedUserId,
    name,
    date: Firebase.database.ServerValue.TIMESTAMP,
  }).then(() => {
    resolve(dispatch({
      type: 'USER_IGNORED',
      status: 'success',
      data: id,
    }));
  //  resolve({ status: 'success' });
  }).catch((err) => {
    resolve({ status: 'error', message: err });
  }));
}


export function unBlockUser(id) {
  console.log('unBlockUser');
  console.log(id);
  if (Firebase === null) return () => new Promise(resolve => resolve());

  const UID = (
    FirebaseRef
    && Firebase
    && Firebase.auth()
    && Firebase.auth().currentUser
    && Firebase.auth().currentUser.uid
  ) ? Firebase.auth().currentUser.uid : null;

  if (!UID || !id) return () => new Promise(resolve => resolve());

  return dispatch => new Promise(resolve => FirebaseRef.child(`ignoredPlayers/${UID}/${id}`).remove().then(() => {
    resolve(dispatch({
      type: 'USER_UNIGNORED',
      status: 'success',
      data: id,
    }));
  //  resolve({ status: 'success' });
  }).catch((err) => {
    resolve({ status: 'error', message: err });
  }));
}


export function getFBFriends(users) {
  console.log('getFBFriends');
  if (Firebase === null) return () => new Promise(resolve => resolve());

  const UID = (
    FirebaseRef
    && Firebase
    && Firebase.auth()
    && Firebase.auth().currentUser
    && Firebase.auth().currentUser.uid
  ) ? Firebase.auth().currentUser.uid : null;

  if (!UID) return () => new Promise(resolve => resolve());

  console.log(users);
  return dispatch => new Promise((resolve, reject) => {
    if (users && users.data) {
      const fbUsers = [];

      users.data.map((user, index) => {
        console.log(user);
        console.log(user.id);

        return FirebaseRef.child(`fbUsers/${user.id}`)
          .on('value', (snapshot) => {
            const fbUser = snapshot.val() || null;

            console.log('fbUser');
            console.log(fbUser);

            if (fbUser) {
              fbUsers.push(fbUser);

              resolve(dispatch({
                type: 'FB_FRIEND',
                data: { fbUser, id: user.id },
              }));

            //  return fbUser;
            }
            return null;
          });
      //  return null;
      });

    //  return resolve(dispatch({
    //    type: 'FB_FRIENDS',
    //    data: fbUsers,
    //  }));
    }
    return reject();
  });
}


export function getIgnoredPlayers() {
  console.log('getIgnoredPlayers');
  if (Firebase === null) return () => new Promise(resolve => resolve());

  const UID = (
    FirebaseRef
    && Firebase
    && Firebase.auth()
    && Firebase.auth().currentUser
    && Firebase.auth().currentUser.uid
  ) ? Firebase.auth().currentUser.uid : null;

  if (!UID) return () => new Promise(resolve => resolve());

  return dispatch => new Promise((resolve, reject) => FirebaseRef.child(`ignoredPlayers/${UID}`)
    .once('value', (snapshot) => {
      const ignoredPlayers = snapshot.val() || null;

      return resolve(dispatch({
        type: 'IGNORED_PLAYERS',
        data: ignoredPlayers,
      }));
    }));
}


export function getAchievements() {
//  console.log('getAchievements');
  if (Firebase === null) return () => new Promise(resolve => resolve());

  const UID = (
    FirebaseRef
    && Firebase
    && Firebase.auth()
    && Firebase.auth().currentUser
    && Firebase.auth().currentUser.uid
  ) ? Firebase.auth().currentUser.uid : null;

  if (!UID) return () => new Promise(resolve => resolve());

  return dispatch => new Promise((resolve, reject) => FirebaseRef.child(`userAchievements/${UID}`)
    .once('value', (snapshot) => {
      const userAchievements = snapshot.val() || {};

      //  console.log('userAchievements');
      //    console.log(userAchievements);

      return resolve(dispatch({
        type: 'USER_ACHIEVEMENTS',
        data: userAchievements,
      }));
    }));
}

export function closeLevelNotification() {
  if (Firebase === null) return () => new Promise(resolve => resolve());

  const UID = (
    FirebaseRef
      && Firebase
      && Firebase.auth()
      && Firebase.auth().currentUser
      && Firebase.auth().currentUser.uid
  ) ? Firebase.auth().currentUser.uid : null;

  if (!UID) return () => new Promise(resolve => resolve());

  return () => new Promise((resolve) => {
    FirebaseRef.child(`users/${UID}/lvlUpNotification`).set(false).then(() => {
      resolve();
    }).catch((err) => {
      console.log(err);
      resolve();
    });

    //  const closeLevelNotificationFunction = Firebase.app().functions().httpsCallable('closeLevelNotification');

  //  closeLevelNotificationFunction().then((result) => {
  //    console.log(result);
  //    resolve();
  //  });
  });
}


export function getUserDbStatus() {
  if (Firebase === null) return () => new Promise(resolve => resolve());
  return dispatch => new Promise((resolve) => {
    const connectedRef = Firebase.database().ref('.info/connected');
    connectedRef.on('value', (snap) => {
      if (snap.val() === true) {
        console.log('Firebase connected!');
        return resolve(dispatch({
          type: 'USER_CONNECTED_STATUS',
          data: true,
        }));
      }
      console.log('Firebase disconnected!');
      return resolve(dispatch({
        type: 'USER_CONNECTED_STATUS',
        data: false,
      }));
    });
  });
}


export function initSmartLook() {
  if (Firebase === null) return () => new Promise(resolve => resolve());
  return dispatch => new Promise((resolve) => {
    Firebase.database().ref('smartLookEnabled').once('value', (snap) => {
      console.log('initSmartLook');
      console.log(snap.val());

      if (snap.val() === true) {
        smartlookClient.init('11653f0331b676c9fd176adbac6a43201747cec9');

        return resolve(dispatch({
          type: 'SMART_LOOK_STATUS',
          data: true,
        }));
      }

      return resolve(dispatch({
        type: 'SMART_LOOK_STATUS',
        data: false,
      }));
    });
  });
}


export function failedLoginLog(authCodeText, hostname, search, member) {
  if (Firebase === null) return () => new Promise(resolve => resolve());

  return () => new Promise((resolve) => {
    FirebaseRef.child(`failedLoginLog`).push({
      authCodeText: authCodeText || null,
      hostname: hostname || null,
      search: search || null,
      uid: member.uid || null,
      name: member.name || null,
      socId: member.socId || null,
    });

    return resolve();
  });
}

export function removeActiveRoom() {
  console.log('removeActiveRoom');
  if (Firebase === null) return () => new Promise(resolve => resolve());

  return (dispatch) => new Promise((resolve) => {
    return resolve(dispatch({
      type: 'REMOVE_ACTIVE_ROOM',
      data: false,
    }));
  });
}
