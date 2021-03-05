import Store from '../store/game';

import isEqual from 'react-fast-compare';

export const initialState = Store;

export default function gameReducer(state = initialState, action) {
  switch (action.type) {
    case 'CARDS_REPLACE': {
    //  console.log('CARDS_REPLACE');
    //  console.log(action.data);
      return {
        ...state,
        cards: action.data || [],
      };
    }

    case 'CARDS_UPDATE': {
      if (action.key || action.key === 0) {
        const newArr = state.cards.slice() || [];

        if (action.data) {
          newArr[action.key] = action.data;
        } else {
          newArr.splice(action.key, 1);
        }

        return {
          ...state,
          cards: newArr,
        };
      }
      return state;
    }

    case 'GAME_SETTINGS': {
      return {
        ...state,
        gameSettings: action.data,
      };
    }

    case 'CURRENT_TABLE_REPLACE': {
      return {
        ...state,
        currentTable: action.data,
      };
    }

    case 'CURRENT_TURN_REPLACE': {
      return {
        ...state,
        currentTurn: action.data,
      };
    }

    case 'LARGE_PLAYER_REPLACE': {
      return {
        ...state,
        largePlayer: action.data,
      };
    }

    case 'CURRENT_TYPE_REPLACE': {
      console.log('CURRENT_TYPE_REPLACE');
      console.log(action.data);
      return {
        ...state,
        currentType: action.data,
      };
    }

    case 'NEXT_TIMESTAMP_REPLACE': {
      return {
        ...state,
        nextTimeStamp: action.data,
      };
    }

    case 'GLOBAL_PARAMS_REPLACE': {
      return {
        ...state,
        globalParams: action.data,
      };
    }

    case 'GLOBAL_PARAMS_CHANGE': {
      const { roomData, key } = action.data;

      if (
        state.globalParams &&
        state.globalParams[key] &&
        isEqual(state.globalParams[key], roomData)
      ) {
        return state;
      }

      if (state) {
        return {
          ...state,
          globalParams: {
            ...state.globalParams,
            [key]: roomData,
          },
        };
      }
      return {
        ...state,
        globalParams: {
          [key]: roomData,
        },
      };
    }

    case 'GLOBAL_PARAMS_ADDED': {
      const { roomData, key } = action.data;

      if (
        state &&
        state.globalParams &&
        state.globalParams[key] &&
        state.globalParams[key] === roomData
      ) {
        return state;
      }

      if (state) {
        return {
          ...state,
          globalParams: {
            ...state.globalParams,
            [key]: roomData,
          },
        };
      }
      return {
        ...state,
        globalParams: {
          [key]: roomData,
        },
      };
    }

    case 'GLOBAL_PARAMS_REMOVED': {
      const { key } = action.data;

      if (state) {
        return {
          ...state,
          globalParams: {
            ...state.globalParams,
            [key]: null,
          },
        };
      }
      return {
        ...state,
        globalParams: {
          [key]: null,
        },
      };
    }

    case 'PLAYERS_REPLACE': {
      return {
        ...state,
        players: action.data,
      };
    }

    case 'PLAYERS_1_UPDATE': {
      const { key, data } = action;

      if (
        state &&
        state.players &&
        state.players.player1 &&
        state.players.player1[key] &&
        state.players.player1[key] === data
      ) {
        return state;
      }

      //  if (state) {
      if (state.players) {
        if (state.players.player1) {
          return {
            ...state,
            players: {
              ...state.players,
              player1: {
                ...state.players.player1,
                [key]: data,
              },
            },
          };
        }
        return {
          ...state,
          players: {
            ...state.players,
            player1: {
              [key]: data,
            },
          },
        };
      }
      return {
        ...state,
        players: {
          player1: {
            [key]: data,
          },
        },
      };
      //  }
      //  return {
      //    ...state,
      //      players: {
      ///        player1: {
      //          [key]: data,
      //        },
      //      },
      //  };
    }

    case 'PLAYERS_2_UPDATE': {
      const { key, data } = action;

      if (
        state &&
        state.players &&
        state.players.player2 &&
        state.players.player2[key] &&
        state.players.player2[key] === data
      ) {
        return state;
      }

      //  if (state) {
      if (state.players) {
        if (state.players.player2) {
          return {
            ...state,
            players: {
              ...state.players,
              player2: {
                ...state.players.player2,
                [key]: data,
              },
            },
          };
        }
        return {
          ...state,
          players: {
            ...state.players,
            player2: {
              [key]: data,
            },
          },
        };
      }
      return {
        ...state,
        players: {
          player2: {
            [key]: data,
          },
        },
      };
      //  }
      //  return {
      //    ...state,
      //      players: {
      //        player2: {
      //          [key]: data,
      //        },
      //      },
      //  };
    }

    case 'PLAYERS_3_UPDATE': {
      const { key, data } = action;

      if (
        state &&
        state.players &&
        state.players.player3 &&
        state.players.player3[key] &&
        state.players.player3[key] === data
      ) {
        return state;
      }

      //  if (state) {
      if (state.players) {
        if (state.players.player3) {
          return {
            ...state,
            players: {
              ...state.players,
              player3: {
                ...state.players.player3,
                [key]: data,
              },
            },
          };
        }
        return {
          ...state,
          players: {
            ...state.players,
            player3: {
              [key]: data,
            },
          },
        };
      }
      return {
        ...state,
        players: {
          player3: {
            [key]: data,
          },
        },
      };
      //  }
      //  return {
      //    ...state,
      //      players: {
      //        player3: {
      //          [key]: data,
      //        },
      //      },
      //  };
    }

    case 'PLAYER_POSITION_REPLACE': {
      return {
        ...state,
        myPos: action.data,
      };
    }

    case 'SET_CARD_PLAYED': {
      return {
        ...state,
        cardPlayed: action.data,
      };
    }

    case 'SET_PREVIOUS_ROUND_DATA': {
      return {
        ...state,
        previousRound: action.data,
      };
    }

    case 'RESET_STORE': {
      const { roomId } = action;
      return {
        ...initialState,
        lastRoom: roomId || null,
      };
    }

    /*
    case 'CARD_PLAYED': {
      if (action.myPos && action.data) {
        const globalParams = state[action.roomId].globalParams || [];

        if (globalParams && globalParams.gameState === 'play') {
          const newTable = state[action.roomId].currentTable || [];
          const newCards = state[action.roomId].cards || [];
          //  const oldCards = state[action.roomId].cards || [];
          const oldCards = [...state[action.roomId].cards];

          const index = newCards.findIndex(card => card === action.data);

          if (index > -1) {
            newCards.splice(index, 1);
          }

          newTable.push({ card: action.data, player: action.myPos });

          return {
            ...state,
            [action.roomId]: {
              ...state[action.roomId],
              currentTable: newTable,
              cards: newCards,
              oldCards,
            },
          };
        }
        return state;
      }
      return state;
    }

    case 'RESET_CARD_PLAYED': {
      if (action.myPos && action.data) {
        const globalParams = state[action.roomId].globalParams || [];

        if (globalParams && globalParams.gameState === 'play') {
          const currentTable = state[action.roomId].currentTable || [];

          //  const index = currentTable.length;

          const index = currentTable.findIndex(card => card.card === action.data);

          if (index > -1) {
            currentTable.splice(index, 1);
          }

          return {
            ...state,
            [action.roomId]: {
              ...state[action.roomId],
              currentTable,
              cards: state[action.roomId].oldCards,
            },
          };
        }
        return state;
      }
      return state;
    }  */

    default:
      return state;
  }
}
