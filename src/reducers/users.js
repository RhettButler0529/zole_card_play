// import Store from '../store/users';

// export const initialState = Store;

export default function usersReducer(state = {}, action) {
  switch (action.type) {
    case 'ROOMS_COUNT': {
      if (action.data || action.data === 0) {
        return {
          ...state,
          roomsCount: action.data,
        };
      }
      return state;
    }

    case 'USER_COUNT': {
      if (action.data || action.data === 0) {
        return {
          ...state,
          usersCount: action.data,
        };
      }
      return state;
    }


    case 'BANS_REPLACE': {
      return {
        ...state,
        bannedUsers: action.data,
      };
    }


    case 'BANS_COUNT_REPLACE': {
      if (action.data || action.data === 0) {
        return {
          ...state,
          bannedUsersCount: action.data,
        };
      }
      return state;
    }

    /*  case 'ONLINE_USERS': {
      return {
        ...state,
        onlineUsers: action.data,
      };
    } */

    case 'ONLINE_USERS_UPDATE': {
      if (action.data) {
        const { user, key } = action.data;

        return {
          ...state,
          onlineUsers: {
            ...state.onlineUsers,
            [key]: user,
          },
        };
      }
      return state;
    }

    case 'ONLINE_USERS_REMOVED': {
      if (action.data) {
        const { key } = action.data;

        return {
          ...state,
          onlineUsers: {
            ...state.onlineUsers,
            [key]: null,
          },
        };
      }
      return state;
    }

    case 'ONLINE_USERS': {
      if (action.data) {
      //  const { key } = action.data;

        return {
          ...state,
          onlineUsers: action.data,
        };
      }
      return state;
    }

    case 'ONLINE_USERS_LAZY_NEW': {
    //  const { onlineUsersLazy } = state;

      //  const newArray = onlineUsersLazy.concat(action.data);

      if (action.data) {
        return {
          ...state,
          onlineUsersLazy: action.data,
        };
      }
      return state;
    }

    case 'ONLINE_USERS_LAZY': {
    //  const { onlineUsersLazy } = state;

      //  const newArray = onlineUsersLazy.concat(action.data);

      //  if (action.data) {
      //    return {
      //      ...state,
      //      onlineUsersLazy: newArray,
      //    };
      //  }

      if (action.data) {
        return {
          ...state,
          onlineUsersLazy: {
            ...state.onlineUsersLazy,
            ...action.data,
          },
        };
      }
      return state;
    }

    default:
      return state;
  }
}
