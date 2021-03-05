import Store from '../store/room';

export const initialState = Store;

export default function roomReducer(state = initialState, action) {
  switch (action.type) {
    case 'ROOMS_REPLACE': {
      const rooms = {};

      Object.keys(action.data).map((key) => {
        if (!action.data[key].tournamentRoom && action.data[key].globalParams
        && action.data[key].playersList && !(action.data[key].playersList.player1
        && action.data[key].playersList.player2 && action.data[key].playersList.player3)) {
          rooms[key] = action.data[key];
        }
        return null;
      });

      //  const roomsObject = Object.assign(state.rooms, { rooms });

      //  return Object.assign({}, state, { rooms });

      return {
        ...state,
        rooms,
      };
    }

    case 'ROOMS_REPLACE_CHANGE': {
      const { roomKey, childKey, data } = action;
      const rooms = { ...state.rooms };

      if (childKey === 'filled' && data === true) {
        delete rooms[roomKey];

        return {
          ...state,
          rooms,
        };
      }

      return {
        ...state,
        rooms: {
          ...rooms,
          [roomKey]: {
            ...rooms[roomKey],
            [childKey]: data,
          }
        },
      };
    }

    case 'ROOMS_REPLACE_REMOVE': {
    //  console.log('ROOMS_REPLACE_REMOVE');
      const { roomKey } = action;
      const rooms = { ...state.rooms };

      delete rooms[roomKey];
      return {
        ...state,
        rooms,
      };
    }

    case 'ROOMS_REPLACE_CHILD_REMOVE': {
    //  console.log('ROOMS_REPLACE_CHILD_REMOVE');
      const { roomKey, childKey } = action;
      const rooms = { ...state.rooms };

    //  console.log(roomKey);

      return {
        ...state,
        rooms: {
          ...rooms,
          [roomKey]: {
            ...rooms[roomKey],
            [childKey]: null,
          }
        },
      };
    }

    case 'MY_ROOMS_REPLACE_CHANGE': {
      return {
        ...state,
        myRooms: {
          ...state.myRooms,
          [action.key]: action.data,
        },
      };
    }

    case 'MY_ROOMS_REPLACE_REMOVE': {
    //  const { myRooms } = state;
      const myRooms = { ...state.myRooms };

      delete myRooms[action.key];
      return {
        ...state,
        myRooms,
      };
    }

    case 'RESET_ROOMS': {
      return {
        ...state,
        rooms: {},
      };
    }

    case 'END_ROOM': {
      return state;
    }

    case 'CREATED_ROOM': {
      if (action.data.data && action.data.data.status === 'success') {
        return {
          ...state,
          lastJoinedRoom: action.data.data.key,
          roomChats: {
            status: null,
            messages: {},
          },
        };
      }

      return state;
    }

    case 'JOINED_ROOM': {
      if (action.data.data && action.data.data.status === 'success') {
        return {
          ...state,
          lastJoinedRoom: action.roomId,
          roomChats: {
            status: null,
            messages: {},
          },
        };
      }

      return state;
    }

    case 'ROOM_CHAT': {
      if (action.data.data && action.data.roomId) {
      //  let chats = {};
      //  if (state.roomChats) {
      //    const { roomChats } = state;
      //    chats = roomChats;
      //  }
        return {
          ...state,
          roomChats: {
            ...state.roomChats,
            [action.data.roomId]: {
              messages: action.data.data || {},
              status: action.data.status || null,
            },
          },
        };
      }

      return state;
    }

    case 'ROOM_CHAT_MESSAGES': {
      return {
        ...state,
        roomChats: {
        //  ...state.roomChats,
          status: state.roomChats ? state.roomChats.status : null,
          messages: action.data.messages || {},
        },
      };
    }

    case 'ROOM_CHAT_MESSAGE_ADDED': {
      if (action.data.message && action.data.messageId && !state.roomChats.messages[action.data.messageId]) {
        const { message, messageId } = action.data;

      //  console.log(state.roomChats.messages[messageId]);
      //  console.log(message);

      //  !isEqual(state.globalParams[key], roomData)
      //  if (state.roomChats && state.roomChats.messages && state.roomChats.messages[messageId] && state.roomChats.messages[messageId] === message) {
      //    return state;
      //  }

        return {
          ...state,
          roomChats: {
            status: state.roomChats.status,
            messages: {
              ...state.roomChats.messages,
              [messageId]: message,
            },
          },
        };
      }

      return state;
    }

    case 'GIFTS': {
      return {
        ...state,
        gifts: action.data,
      };
    }

    case 'EMOTIONS': {
      return {
        ...state,
        emotions: action.data,
      };
    }

    case 'ROOM_GIFTS': {
      return {
        ...state,
        roomGifts: {
          [action.data.roomId]: action.data.data,
        },
      };
    }

    //  case 'LEAVE_ROOM_MENU': {
    //
    //  }

    default:
      return state;
  }
}
