export default function userReducer(state = {}, action) {
  switch (action.type) {
    case 'ADMIN_USERS_REPLACE': {
      if (action.data) {
        const lastKey = Object.keys(action.data)[4];

        return {
          ...state,
          allUsers: action.data,
          allUsersLastKey: lastKey,
        };
      }
      return state;
    }

    case 'ADMIN_USER_REPLACE': {
      if (action.data) {
        const { key, user } = action.data;

        return {
          ...state,
          allUsers: {
            ...state.allUsers,
            [key]: user,
          },
        };
      }
      return state;
    }

    case 'ADMIN_FILTERED_USERS': {
      return {
        ...state,
        filteredUsers: action.data,
      };
    }

    case 'CHANGE_LOGROCKET': {
      const { enabled, uid } = action.data;

      if (state.filteredUsers && state.filteredUsers[uid]) {
        return {
          ...state,
          filteredUsers: {
            ...state.filteredUsers,
            [uid]: {
              ...state.filteredUsers[uid],
              enableLogRocket: enabled,
            }
          },
        };
      } else if (state.allUsers && state.allUsers[uid]) {
        return {
          ...state,
          allUsers: {
            ...state.allUsers,
            [uid]: {
              ...state.allUsers[uid],
              enableLogRocket: enabled,
            }
          },
        };
      } else {
        return state;
      }
    }

    case 'ADMIN_USER_COUNT': {
      if (action.data) {
        return {
          ...state,
          userCount: action.data,
        };
      }
      return state;
    }


    case 'ADMIN_ROOM_LOGS_REPLACE': {
      if (action.data) {
        const array = Object.keys(action.data).reverse().map(key => ({
          roomId: key,
          date: action.data[key].date || null,
          tournamentRoom: action.data[key].tournamentRoom || null,
          tournamentId: action.data[key].tournamentId || null,
          index: action.data[key].index || null,
        }));

        return {
          ...state,
          allRoomsLogs: array,
        };
      }
      return state;
    }

    case 'ADMIN_ROOM_LOGS_COUNT': {
      if (action.data) {
        return {
          ...state,
          roomsPlayedCount: action.data,
        };
      }
      return state;
    }

    case 'ADMIN_FILTERED_ROOM_LOGS': {
      let array = [];
      if (action.data) {
        array = Object.keys(action.data).reverse().map(key => ({
          roomId: key,
          date: action.data[key].date || null,
          tournamentRoom: action.data[key].tournamentRoom || null,
          tournamentId: action.data[key].tournamentId || null,
          index: action.data[key].index || null,
        }));
      } else {
        array = null;
      }

      return {
        ...state,
        filteredRoomsLogs: array,
      };
    }


    /*  case 'ADMIN_PAYMENTS_REPLACE': {
      if (action.data) {
        return {
          ...state,
          allPayments: action.data,
        };
      }
      return state;
    } */


    case 'ADMIN_PAYMENTS_REPLACE': {
      console.log(action.data);

      if (action.data) {
        const array = Object.keys(action.data)
          .map(key => ({
            id: key,
            date: action.data[key].dateInitiated || null,
            userUid: action.data[key].userUid || null,
            status: action.data[key].status || null,
            index: action.data[key].index || null,
            productNr: action.data[key].productNr || null,
          }));

        array.sort((a, b) => b.date - a.date);

        return {
          ...state,
          allPayments: array,
        };
      }
      return state;
    }

    case 'ADMIN_PAYMENTS_COUNT': {
      if (action.data) {
        return {
          ...state,
          paymentsCount: action.data,
        };
      }
      return state;
    }


    case 'ADMIN_VIP_REPLACE': {
      if (action.data) {
        return {
          ...state,
          vipUsers: action.data,
        };
      }
      return state;
    }

    case 'ADMIN_BANS_REPLACE': {
      if (action.data) {
        return {
          ...state,
          allBans: action.data,
        };
      }
      return state;
    }

    case 'BANS_COUNT_REPLACE': {
      if (action.data) {
        return {
          ...state,
          bansCount: action.data,
        };
      }
      return state;
    }


    case 'ADMIN_TRANSACTIONS_REPLACE': {
      if (action.data) {
        return {
          ...state,
          allTransactions: action.data,
        };
      }
      return state;
    }

    case 'ADMIN_TOURNAMENTS_REPLACE': {
      if (action.data) {
        return {
          ...state,
          allTournaments: action.data,
        };
      }
      return state;
    }

    case 'TOURNAMENT_PLAYERS': {
      let tourPlayers = {};
      if (state) {
        tourPlayers = state.tournamentPlayers;
      }
      if (action.data) {
        return {
          ...state,
          tournamentPlayers: {
            ...tourPlayers,
            [action.data.tournamentId]: action.data.tournamentPlayers,
          },
        };
      }
      return state;
    }

    case 'ADMIN_LOGS_ROOMS': {
      if (action.data) {
        const array = Object.keys(action.data).reverse().map(key => ({
          roomId: key,
          date: action.data[key].date || null,
          tournamentRoom: action.data[key].tournamentRoom || null,
          tournamentId: action.data[key].tournamentId || null,
          index: action.data[key].index || null,
        }));

        return {
          ...state,
          allRoomsLogs: array,
        };
      }
      return state;
    }

    case 'ADMIN_ROOM_LOGS': {
      if (action.data) {
        const { data, roomId } = action;
        let { roomData } = state;

        if (!roomData) {
          roomData = {};
        }

        return {
          ...state,
          roomData: {
            ...roomData,
            [roomId]: data,
          },
        };
      }
      return state;
    }

    case 'USER_CHATS': {
      if (action.data) {
        return {
          ...state,
          chatMessages: action.data,
        };
      }
      return state;
    }

    /*
    case 'ACTIVE_MESSAGES': {
      if (action.data) {
        const activeMessages = [];
        Object.keys(action.data.unreadChats).map((key) => {
          activeMessages.push({
            ...action.data.unreadChats[key],
            key,
          });
        });

        Object.keys(action.data.readChats).map((key) => {
          activeMessages.push({
            ...action.data.readChats[key],
            key,
          });
        });

        return {
          ...state,
          activeMessages,
        };
      }
      return state;
    }
    */

    case 'ACTIVE_UNREAD_MESSAGES': {
      const unreadMessages = [];

      Object.keys(action.data).map((key) => {
        unreadMessages.push({
          ...action.data[key],
          key,
        });
        return null;
      });

      unreadMessages.sort((a, b) => b.lastResponse - a.lastResponse);

      console.log('unreadMessages');
      console.log(unreadMessages);

      return {
        ...state,
        unreadMessages: action.data,
      };
    }

    case 'ACTIVE_UNREAD_MESSAGE_CHANGE': {
      return {
        ...state,
        unreadMessages: {
          ...state.unreadMessages,
          [action.key]: action.data,
        },
      };
    }

    case 'ACTIVE_UNREAD_MESSAGES_REMOVE': {
      const unreadMessages = { ...state.unreadMessages };

      delete unreadMessages[action.key];
      return {
        ...state,
        unreadMessages,
      };
    }

    case 'ACTIVE_READ_MESSAGES': {
      const readMessages = [];

      Object.keys(action.data).map((key) => {
        readMessages.push({
          ...action.data[key],
          key,
        });
        return null;
      });

      return {
        ...state,
        readMessages: action.data,
      };
    }

    case 'USER_BAL_HISTORY': {
      return {
        ...state,
        userBalanceHistory: action.data,
      };
    }

    case 'SMARTLOOK_STATUS': {
      return {
        ...state,
        smartLookStatus: action.data,
      };
    }

    default:
      return state;
  }
}
