import Store from '../store/game';

export const initialState = Store;

export default function leaderboardReducer(state = initialState, action) {
  switch (action.type) {
    case 'LEADERBOARD_REPLACE': {
      if (action.data) {
        const arr = Object.keys(action.data).map(key => ({
          position: action.data[key].pos,
          points: action.data[key].totalPnts,
          gamesPlayed: action.data[key].gPlayed,
          name: action.data[key].name,
          balance: action.data[key].bal,
          lvl: action.data[key].lvl,
          key,
        })) || [];

        //  arr.sort((a, b) => a.position - b.position);

        arr.sort((a, b) => {
          const n = b.points - a.points;
          if (n !== 0) {
            return n;
          }

          return b.balance - a.balance;
        });

        return {
          ...state,
          leaderboard: arr,
        };
      }
      return state;
    }

    case 'LEADERBOARD_UPDATE': {
    //  console.log('LEADERBOARD_UPDATE');
    //  console.log(action.data);
      if (action.data) {
        const { user, index } = action.data;

        const newArr = state.leaderboard;

        newArr[index - 1] = {
          position: user.pos,
          points: user.totalPnts,
          gamesPlayed: user.gPlayed,
          name: user.name,
          balance: user.bal,
          lvl: user.lvl,
        };

        return {
          ...state,
          leaderboard: newArr,
        };
      }
      return state;
    }

    case 'LEADERBOARD_YEAR_REPLACE': {
      if (action.data) {
        const arr = Object.keys(action.data).map(key => ({
          position: action.data[key].pos,
          points: action.data[key].totalPnts,
          gamesPlayed: action.data[key].gPlayed,
          name: action.data[key].name,
          balance: action.data[key].bal,
          lvl: action.data[key].lvl,
          key,
        })) || [];

        //  arr.sort((a, b) => a.position - b.position);

        arr.sort((a, b) => {
          const n = b.points - a.points;
          if (n !== 0) {
            return n;
          }

          return b.balance - a.balance;
        });

        return {
          ...state,
          leaderboardYear: arr,
        };
      }
      return state;
    }

    case 'LEADERBOARD_MONTH_REPLACE': {
      if (action.data) {
        const arr = Object.keys(action.data).map(key => ({
          position: action.data[key].pos,
          points: action.data[key].totalPnts,
          gamesPlayed: action.data[key].gPlayed,
          name: action.data[key].name,
          balance: action.data[key].bal,
          lvl: action.data[key].lvl,
          key,
        })) || [];

        //  arr.sort((a, b) => a.position - b.position);

        arr.sort((a, b) => {
          const n = b.points - a.points;
          if (n !== 0) {
            return n;
          }

          return b.balance - a.balance;
        });

        return {
          ...state,
          leaderboardMonth: arr,
        };
      }
      return state;
    }

    case 'LEADERBOARD_WEEK_REPLACE': {
      if (action.data) {
        const arr = Object.keys(action.data).map(key => ({
          position: action.data[key].pos,
          points: action.data[key].totalPnts,
          gamesPlayed: action.data[key].gPlayed,
          name: action.data[key].name,
          balance: action.data[key].bal,
          lvl: action.data[key].lvl,
          key,
        })) || [];

        //  arr.sort((a, b) => a.position - b.position);

        arr.sort((a, b) => {
          const n = b.points - a.points;
          if (n !== 0) {
            return n;
          }

          return b.balance - a.balance;
        });

        return {
          ...state,
          leaderboardWeek: arr,
        };
      }
      return state;
    }

    case 'LEADERBOARD_DAILY_REPLACE': {
      if (action.data) {
        const arr = Object.keys(action.data).map(key => ({
          position: action.data[key].pos,
          points: action.data[key].totalPnts,
          gamesPlayed: action.data[key].gPlayed,
          name: action.data[key].name,
          balance: action.data[key].bal,
          lvl: action.data[key].lvl,
          key,
        })) || [];

        //  arr.sort((a, b) => a.position - b.position);

        arr.sort((a, b) => {
          const n = b.points - a.points;
          if (n !== 0) {
            return n;
          }

          return b.balance - a.balance;
        });

        return {
          ...state,
          leaderboardDaily: arr,
        };
      }
      return state;
    }

    case 'LEADERBOARD_DAILY_UPDATE': {
      if (action.data) {
        const { user, index } = action.data;

        const newArr = state.leaderboardDaily;

        newArr[index - 1] = {
          position: user.pos,
          points: user.totalPnts,
          gamesPlayed: user.gPlayed,
          name: user.name,
          balance: user.bal,
          lvl: user.lvl,
        };

        return {
          ...state,
          leaderboardDaily: newArr,
        };
      }
      return state;
    }

    case 'LEADERBOARD_WEEK_UPDATE': {
      if (action.data) {
        const { user, index } = action.data;

        const newArr = state.leaderboardWeek;

        newArr[index - 1] = {
          position: user.pos,
          points: user.totalPnts,
          gamesPlayed: user.gPlayed,
          name: user.name,
          balance: user.bal,
          lvl: user.lvl,
        };

        return {
          ...state,
          leaderboardWeek: newArr,
        };
      }
      return state;
    }

    case 'LEADERBOARD_MONTH_UPDATE': {
      if (action.data) {
        const { user, index } = action.data;

        const newArr = state.leaderboardMonth;

        newArr[index - 1] = {
          position: user.pos,
          points: user.totalPnts,
          gamesPlayed: user.gPlayed,
          name: user.name,
          balance: user.bal,
          lvl: user.lvl,
        };

        return {
          ...state,
          leaderboardMonth: newArr,
        };
      }
      return state;
    }

    case 'LEADERBOARD_YEAR_UPDATE': {
      if (action.data) {
        const { user, index } = action.data;

        const newArr = state.leaderboardYear;

        newArr[index - 1] = {
          position: user.pos,
          points: user.totalPnts,
          gamesPlayed: user.gPlayed,
          name: user.name,
          balance: user.bal,
          lvl: user.lvl,
        };

        return {
          ...state,
          leaderboardYear: newArr,
        };
      }
      return state;
    }

    case 'MY_LEADERBOARD_POS': {
      return {
        ...state,
        myLeaderboard: action.data,
      };
    }

    case 'MY_LEADERBOARD_YEAR_POS': {
      return {
        ...state,
        myLeaderboardYear: action.data,
      };
    }

    case 'MY_LEADERBOARD_MONTH_POS': {
      return {
        ...state,
        myLeaderboardMonth: action.data,
      };
    }

    case 'MY_LEADERBOARD_WEEK_POS': {
      return {
        ...state,
        myLeaderboardWeek: action.data,
      };
    }

    case 'MY_LEADERBOARD_DAILY_POS': {
      return {
        ...state,
        myLeaderboardDaily: action.data,
      };
    }

    default:
      return state;
  }
}
