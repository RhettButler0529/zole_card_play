// import * as FirebaseModule from 'firebase';
import * as FirebaseModule from 'firebase/app';
import firebaseConfig from '../constants/firebase';

// require('firebase/functions');

 import 'firebase/auth';        // for authentication
// import 'firebase/storage';     // for storage
 import 'firebase/database';    // for realtime database
// import 'firebase/firestore';   // for cloud firestore
// import 'firebase/messaging';   // for cloud messaging
import 'firebase/functions';   // for cloud functions

// import '@firebase/firestore';
// import '@firebase/functions';

const {
  apiKey, authDomain, databaseURL, projectId, storageBucket, messagingSenderId, appId, databaseURL2, databaseURL3, databaseURL4, databaseURL5, databaseURL6,
} = firebaseConfig;

let firebaseInitialized = false;

const app2 = FirebaseModule.initializeApp({
  apiKey, authDomain, databaseURL: databaseURL2, projectId, storageBucket, messagingSenderId, appId,
}, 'app2');

const app3 = FirebaseModule.initializeApp({
  apiKey, authDomain, databaseURL: databaseURL3, projectId, storageBucket, messagingSenderId, appId,
}, 'app3');

const app4 = FirebaseModule.initializeApp({
  apiKey, authDomain, databaseURL: databaseURL4, projectId, storageBucket, messagingSenderId, appId,
}, 'app4');

const app5 = FirebaseModule.initializeApp({
  apiKey, authDomain, databaseURL: databaseURL5, projectId, storageBucket, messagingSenderId, appId,
}, 'app5');

const app6 = FirebaseModule.initializeApp({
  apiKey, authDomain, databaseURL: databaseURL6, projectId, storageBucket, messagingSenderId, appId,
}, 'app6');

if (apiKey && authDomain && databaseURL && projectId && storageBucket && messagingSenderId) {
//  FirebaseModule.initializeApp({
//    apiKey, authDomain, databaseURL, projectId, storageBucket, messagingSenderId, appId,
//  });

  const app1 = FirebaseModule.initializeApp({
    apiKey, authDomain, databaseURL, projectId, storageBucket, messagingSenderId, appId,
  });

  firebaseInitialized = true;
}

export const FirebaseRef = firebaseInitialized ? FirebaseModule.database().ref() : null;
export const LeaderboardRef = firebaseInitialized ? FirebaseModule.database(app2).ref() : null;
 export const AdminLogsRef = firebaseInitialized ? FirebaseModule.database(app3).ref() : null;
export const StatusRef = firebaseInitialized ? FirebaseModule.database(app4).ref() : null;
//export const StatusDb = firebaseInitialized ? FirebaseModule.database(app4) : null;
//export const statusApp = app4;
export const RoomsPublicRef = firebaseInitialized ? FirebaseModule.database(app5).ref() : null;
export const RoomsRef = firebaseInitialized ? FirebaseModule.database(app6).ref() : null;
export const Firebase = firebaseInitialized ? FirebaseModule : null;
