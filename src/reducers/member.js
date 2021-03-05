import Store from '../store/member';

export const initialState = Store;

export default function userReducer(state = initialState, action) {
  switch (action.type) {
  /*  case 'USER_LOGIN': {
      if (action.data) {
        return {
          ...state,
          uid: action.data.uid,
          email: action.data.email,
          emailVerified: action.data.emailVerified,
        };
      }
      return {};
    } */

    case 'USER_DETAILS_UPDATE': {
      if (action.data) {
        return {
          ...state,
          name: action.data.name,
          gamesPlayed: action.data.gamesPlayed,
          level: action.data.level,
          balance: action.data.balance,
          photo: action.data.photo,
          totalPoints: action.data.totalPoints,
          gamesWon: action.data.gamesWon,
          role: action.data.role,
          firstTimeModal: action.data.firstTimeModal,
          newVersion: action.data.newVersion,
        };
      }
      return state;
    }

    case 'REMOVE_ACTIVE_ROOM': {
    //  console.log('REMOVE_ACTIVE_ROOM');
      return {
        ...state,
        activeRoom: null,
      };
    }

    case 'USER_DATA': {
    //  console.log('USER_DATA');
    //  console.log(action.data);

      if (action.data) {
        return {
          ...state,
          ...action.data,
          position: state.position,
        };
      }
      return state;
    }

    case 'USER_LEADERBOARD_POSITION_CHANGE': {
    //  console.log('USER_LEADERBOARD_POSITION_CHANGE');
    //  console.log(action.data);
      if (action.data) {
        return {
          ...state,
          position: action.data,
        };
      }
      return state;
    }

    case 'USER_DATA_CHANGE': {
      if (action.data) {
      //  console.log(action.data);
        const { key, userData } = action.data;

        //  console.log(key);
        //  console.log(userData);

        let dataKey = key;

        if (key === 'bal') {
          dataKey = 'balance';
        } else if (key === 'lvl') {
          dataKey = 'level';
        } else if (key === 'pos') {
        //  dataKey = 'position';
        } else if (key === 'lvlupLimit') {
          dataKey = 'levelupGameLimit';
        } else if (key === 'gPlayed') {
          dataKey = 'gamesPlayed';
        } else if (key === 'gWon') {
          dataKey = 'gamesWon';
        } else if (key === 'totalPnts') {
          dataKey = 'totalPoints';
        } else if (key === 'nxtSpin') {
          dataKey = 'nextBonusSpin';
        } else if (key === 'lastSpin') {
          dataKey = 'lastBonusSpin';
        }

        return {
          ...state,
          [dataKey]: userData,
        };
      }
      return state;
    }

    case 'USER_COUNT': {
      if (action.data) {
        return {
          ...state,
          userCount: action.data,
        };
      }
      return state;
    }

    case 'USER_LOGOUT': {
      if (action.data) {
        return {
          ...action.data,
        };
      }
      return state;
    }

    case 'OFFSET': {
      if (action.data) {
        return {
          ...state,
          offset: action.data,
        };
      }
      return state;
    }

    case 'SUPPORT_CHAT': {
      if (action.data) {
        return {
          ...state,
          supportChat: action.data,
        };
      }
      return state;
    }

    case 'SUPPORT_CHAT_STATUS': {
    //  if (action.data) {
      return {
        ...state,
        supportChatStatus: action.data,
      };
    //  }
    //  return state;
    }


    case 'BAL_HISTORY': {
      return {
        ...state,
        balanceHistory: action.data,
      };
    }

    case 'USER_IGNORED': {
      return {
        ...state,
        ignoredUsers: {
          ...state.ignoredUsers,
          [action.data]: true,
        },
      };
    }

    case 'USER_UNIGNORED': {
      return {
        ...state,
        ignoredUsers: {
          ...state.ignoredUsers,
          [action.data]: null,
        },
      };
    }

    case 'FB_FRIENDS': {
      return {
        ...state,
        fbFriends: action.data,
      };
    }

    case 'FB_FRIEND': {
      const { fbUser, id } = action.data;

      return {
        ...state,
        fbFriends: {
          ...state.fbFriends,
          [id]: fbUser,
        },
      };
    }

    case 'IGNORED_PLAYERS': {
      return {
        ...state,
        ignoredUsers: action.data,
      };
    }

    case 'USER_ACHIEVEMENTS': {
      return {
        ...state,
        userAchievements: action.data,
      };
    }

    case 'USER_CONNECTED_STATUS': {
      return {
        ...state,
        userConnected: action.data,
      };
    }

    case 'USER_RESET': {
      return {};
    }

    case 'SMART_LOOK_STATUS': {
      return {
        ...state,
        smartLookStatus: action.data,
      };
    }

    default:
      return state;
  }
}
