// admin.js

const functions = require('firebase-functions');
const admin = require('firebase-admin');

admin.initializeApp(functions.config().firebase);

const otherConfig = Object.assign({}, functions.config().firebase);
const otherConfig2 = Object.assign({}, functions.config().firebase);
const otherConfig3 = Object.assign({}, functions.config().firebase);
const otherConfig4 = Object.assign({}, functions.config().firebase);
const otherConfig5 = Object.assign({}, functions.config().firebase);
const otherConfig6 = Object.assign({}, functions.config().firebase);

otherConfig.databaseURL = 'https://zole-app-leaderboard.firebaseio.com/'
const leaderboardDb = admin.initializeApp(otherConfig, 'leaderboard-db')

otherConfig2.databaseURL = 'https://zole-app-admin-logs.firebaseio.com/'
const adminLogsDb = admin.initializeApp(otherConfig2, 'admin-logs-db')

otherConfig3.databaseURL = 'https://zole-app-rooms-public.firebaseio.com/'
const roomsPublicDb = admin.initializeApp(otherConfig3, 'rooms-public-db')

otherConfig4.databaseURL = 'https://zole-app-status.firebaseio.com/'
const statusDb = admin.initializeApp(otherConfig4, 'status-db')

otherConfig5.databaseURL = 'https://zole-app-user-stats.firebaseio.com/'
const userStatsDB = admin.initializeApp(otherConfig5, 'user-stats-db')

otherConfig6.databaseURL = 'https://zole-app-rooms.firebaseio.com/'
const roomsDb = admin.initializeApp(otherConfig6, 'rooms-db')

module.exports = {
  admin,
  leaderboardDb,
  adminLogsDb,
  roomsPublicDb,
  statusDb,
  userStatsDB,
  roomsDb,
};
