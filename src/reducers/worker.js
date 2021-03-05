import { createWorker } from 'redux-worker';
/* import member from './member';
import game from './game';
import rooms from './room';
import leaderboard from './leaderboard';
import admin from './admin';
import tournaments from './tournaments';
import users from './users';
import userSettings from './userSettings'; */

import reducers from '.';

const worker = createWorker();

worker.registerReducer(reducers);
