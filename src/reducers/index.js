// { createWorker } from 'redux-worker';
// import { combineReducers } from 'redux';

import member from './member';
import game from './game';
import rooms from './room';
import leaderboard from './leaderboard';
import admin from './admin';
import tournaments from './tournaments';
import users from './users';
import userSettings from './userSettings';
import points from './points';
import state from './state';

/* const reducers = combineReducers({
  rehydrated,
  member,
  game,
  rooms,
  leaderboard,
  admin,
  tournaments,
  users,
  userSettings,
}); */

const rehydrated = (state = false, action) => {
  switch (action.type) {
    case 'persist/REHYDRATE':
      return true;
    default:
      return state;
  }
};

// export default reducers;

export default {
  rehydrated,
  member,
  game,
  rooms,
  leaderboard,
  admin,
  tournaments,
  users,
  userSettings,
  points,
  state,
};
