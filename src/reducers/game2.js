import Store from '../store/game';

export const initialState = Store;

export default function gameReducer(state = initialState, action) {
  switch (action.type) {
    case 'CARDS_REPLACE': {
    /*  const newState = {
        ...state,
        [action.roomId]: {
          ...state[action.roomId],
          cards: action.data || [],
        //  uid: action.data.uid,
        },
      };
      return newState; */

      return {
        ...state,
        [action.roomId]: {
          ...state[action.roomId],
          cards: action.data || [],
        },
      };
    }

    case 'CARDS_UPDATE': {
      if (action.roomId && (action.key || action.key === 0)) {
        if (state[action.roomId]) {
          const newArr = state[action.roomId].cards.slice() || [];

          if (action.data) {
            newArr[action.key] = action.data;
          } else {
            newArr.splice(action.key, 1);
          }

          return {
            ...state,
            [action.roomId]: {
              ...state[action.roomId],
              cards: newArr,
            },
          };
        }
        return state;
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
      console.log('CURRENT_TABLE_REPLACE');
      return {
        ...state,
        [action.roomId]: {
          ...state[action.roomId],
          currentTable: action.data,
        },
      };
    }

    case 'CURRENT_TURN_REPLACE': {
      console.log('CURRENT_TURN_REPLACE');
      return {
        ...state,
        [action.roomId]: {
          ...state[action.roomId],
          currentTurn: action.data,
        },
      };
    }

    case 'LARGE_PLAYER_REPLACE': {
      return {
        ...state,
        [action.roomId]: {
          ...state[action.roomId],
          largePlayer: action.data,
        },
      };
    }


    case 'CURRENT_TYPE_REPLACE': {
      return {
        ...state,
        [action.roomId]: {
          ...state[action.roomId],
          currentType: action.data,
        },
      };
    }


    case 'NEXT_TIMESTAMP_REPLACE': {
      return {
        ...state,
        [action.roomId]: {
          ...state[action.roomId],
          nextTimeStamp: action.data,
        },
      };
    }


    case 'GLOBAL_PARAMS_REPLACE': {
      return {
        ...state,
        [action.roomId]: {
          ...state[action.roomId],
          globalParams: action.data,
        },
      };
    }

    case 'GLOBAL_PARAMS_CHANGE': {
      const { roomData, key, roomId } = action.data;

      if (state[roomId] && state[roomId].globalParams
        && state[roomId].globalParams[key]
      && state[roomId].globalParams[key] === roomData) {
        return state;
      }

      if (state && state[roomId]) {
        return {
          ...state,
          [roomId]: {
            ...state[roomId],
            globalParams: {
              ...state[roomId].globalParams,
              [key]: roomData,
            },
          },
        };
      }
      return {
        ...state,
        [roomId]: {
          ...state[roomId],
          globalParams: {
          //  ...state[roomId].globalParams,
            [key]: roomData,
          },
        },
      };
    }

    case 'GLOBAL_PARAMS_ADDED': {
      const { roomData, key, roomId } = action.data;

      if (state[roomId] && state[roomId].globalParams
        && state[roomId].globalParams[key]
      && state[roomId].globalParams[key] === roomData) {
        return state;
      }

      if (state && state[roomId]) {
        return {
          ...state,
          [roomId]: {
            ...state[roomId],
            globalParams: {
              ...state[roomId].globalParams,
              [key]: roomData,
            },
          },
        };
      }
      return {
        ...state,
        [roomId]: {
          ...state[roomId],
          globalParams: {
          //  ...state[roomId].globalParams,
            [key]: roomData,
          },
        },
      };
    }

    case 'GLOBAL_PARAMS_REMOVED': {
      const { key, roomId } = action.data;

      if (state && state[roomId]) {
        return {
          ...state,
          [roomId]: {
            ...state[roomId],
            globalParams: {
              ...state[roomId].globalParams,
              [key]: null,
            },
          },
        };
      }
      return {
        ...state,
        [roomId]: {
          ...state[roomId],
          globalParams: {
          //  ...state[roomId].globalParams,
            [key]: null,
          },
        },
      };
    }

    case 'PLAYERS_REPLACE': {
      return {
        ...state,
        [action.roomId]: {
          ...state[action.roomId],
          players: action.data,
        },
      };
    }

    case 'PLAYERS_1_UPDATE': {
      const { roomId, key, data } = action;

      if (state[roomId] && state[roomId].players
        && state[roomId].players.player1
        && state[roomId].players.player1[key]
      && state[roomId].players.player1[key] === data) {
        return state;
      }

      if (state && state[roomId]) {
        if (state[roomId].players) {
          if (state[roomId].players.player1) {
            return {
              ...state,
              [roomId]: {
                ...state[roomId],
                players: {
                  ...state[roomId].players,
                  player1: {
                    ...state[roomId].players.player1,
                    [key]: data,
                  },
                },
              },
            };
          }
          return {
            ...state,
            [roomId]: {
              ...state[roomId],
              players: {
                ...state[roomId].players,
                player1: {
                  [key]: data,
                },
              },
            },
          };
        }
        return {
          ...state,
          [roomId]: {
            ...state[roomId],
            players: {
              player1: {
                [key]: data,
              },
            },
          },
        };
      }
      return {
        ...state,
        [roomId]: {
          ...state[roomId],
          players: {
            //  ...state[roomId].players,
            player1: {
              //  ...state[roomId].players.player1,
              [key]: data,
            },
          },
        },
      };
    }

    case 'PLAYERS_2_UPDATE': {
      const { roomId, key, data } = action;

      if (state[roomId] && state[roomId].players
        && state[roomId].players.player2
        && state[roomId].players.player2[key]
      && state[roomId].players.player2[key] === data) {
        return state;
      }

      if (state && state[roomId]) {
        if (state[roomId].players) {
          if (state[roomId].players.player2) {
            return {
              ...state,
              [roomId]: {
                ...state[roomId],
                players: {
                  ...state[roomId].players,
                  player2: {
                    ...state[roomId].players.player2,
                    [key]: data,
                  },
                },
              },
            };
          }
          return {
            ...state,
            [roomId]: {
              ...state[roomId],
              players: {
                ...state[roomId].players,
                player2: {
                  [key]: data,
                },
              },
            },
          };
        }
        return {
          ...state,
          [roomId]: {
            ...state[roomId],
            players: {
              player2: {
                [key]: data,
              },
            },
          },
        };
      }
      return {
        ...state,
        [roomId]: {
          ...state[roomId],
          players: {
            //  ...state[roomId].players,
            player2: {
              //  ...state[roomId].players.player1,
              [key]: data,
            },
          },
        },
      };
    }

    case 'PLAYERS_3_UPDATE': {
      const { roomId, key, data } = action;

      if (state[roomId] && state[roomId].players
        && state[roomId].players.player3
        && state[roomId].players.player3[key]
      && state[roomId].players.player3[key] === data) {
        return state;
      }

      if (state && state[roomId]) {
        if (state[roomId].players) {
          if (state[roomId].players.player3) {
            return {
              ...state,
              [roomId]: {
                ...state[roomId],
                players: {
                  ...state[roomId].players,
                  player3: {
                    ...state[roomId].players.player3,
                    [key]: data,
                  },
                },
              },
            };
          }
          return {
            ...state,
            [roomId]: {
              ...state[roomId],
              players: {
                ...state[roomId].players,
                player3: {
                  [key]: data,
                },
              },
            },
          };
        }
        return {
          ...state,
          [roomId]: {
            ...state[roomId],
            players: {
              player3: {
                [key]: data,
              },
            },
          },
        };
      }
      return {
        ...state,
        [roomId]: {
          ...state[roomId],
          players: {
            //  ...state[roomId].players,
            player3: {
              //  ...state[roomId].players.player1,
              [key]: data,
            },
          },
        },
      };
    }

    case 'PLAYER_POSITION_REPLACE': {
      return {
        ...state,
        [action.roomId]: {
          ...state[action.roomId],
          myPos: action.data,
        },
      };
    }

    case 'SET_CARD_PLAYED': {
      return {
        ...state,
        [action.roomId]: {
          ...state[action.roomId],
          cardPlayed: action.data,
        },
      };
    }

    case 'POINTS_TOTAL': {
      return {
        ...state,
        [action.roomId]: {
          ...state[action.roomId],
          totalPoints: action.data,
        },
      };
    }

    case 'POINTS_REPLACE': {
      return {
        ...state,
        [action.roomId]: {
          ...state[action.roomId],
          points: action.data || {},
        },
      };
    }

    case 'POINTS_CHANGE': {
      return {
        ...state,
        [action.roomId]: {
          ...state[action.roomId],
          points: {
            ...state[action.roomId].points,
            [action.key]: action.data || {},
          },
        //  totalPoints: action.data.total,
        },
      };
    }

    case 'RESET_STORE': {
      const { roomId } = action;
      return {
        ...initialState,
        lastRoom: roomId,
      };
    }

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
    }

    default:
      return state;
  }
}
