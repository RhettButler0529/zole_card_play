import Store from '../store/userSettings';

export const initialState = Store;

export default function userSettingsReducer(state = initialState, action) {
  switch (action.type) {
    case 'TOGGLE_NEW_GAME_PARAM': {
      if (state && !state[action.uid]) {
        if (action.data === 'parasta' || action.data === 'G') {
          return {
            ...state,
            [action.uid]: {
              ...state.default,
              parasta: !state.default.parasta,
              G: !state.default.G,
            },
          };
        }
        if (action.data === 'atra') {
          return {
            ...state,
            [action.uid]: {
              ...state.default,
              atra: !state.default.atra,
            },
          };
        }
        if (action.data === 'pro') {
          return {
            ...state,
            [action.uid]: {
              ...state.default,
              pro: !state.default.pro,
            },
          };
        }
        if (action.data === 'maza') {
          return {
            ...state,
            [action.uid]: {
              ...state.default,
              maza: !state.default.maza,
            },
          };
        }
        if (action.data === 'privateRoom') {
          return {
            ...state,
            [action.uid]: {
              ...state.default,
              privateRoom: !state.default.privateRoom,
            },
          };
        }
        return {
          ...state,
          [action.uid]: {
            ...state.default,
          },
        };
      } else {
        if (action.data === 'parasta' || action.data === 'G') {
          return {
            ...state,
            [action.uid]: {
              ...state[action.uid],
              parasta: !state[action.uid].parasta,
              G: !state[action.uid].G,
            },
          };
        }
        if (action.data === 'atra') {
          return {
            ...state,
            [action.uid]: {
              ...state[action.uid],
              atra: !state[action.uid].atra,
            },
          };
        }
        if (action.data === 'pro') {
          return {
            ...state,
            [action.uid]: {
              ...state[action.uid],
              pro: !state[action.uid].pro,
            },
          };
        }
        if (action.data === 'maza') {
          return {
            ...state,
            [action.uid]: {
              ...state[action.uid],
              maza: !state[action.uid].maza,
            },
          };
        }
        if (action.data === 'privateRoom') {
          return {
            ...state,
            [action.uid]: {
              ...state[action.uid],
              privateRoom: !state[action.uid].privateRoom,
            },
          };
        }
        return {
          ...state,
        };
      }
    }

    case 'SET_NEW_GAME_BET': {
      if (state && !state[action.uid]) {
        if (action.data) {
          return {
            ...state,
            [action.uid]: {
              ...state.default,
              bet: action.data,
            },
          };
        }
        return {
          ...state,
          [action.uid]: {
            ...state.default,
          },
        };
      } else {
        if (action.data) {
          return {
            ...state,
            [action.uid]: {
              ...state[action.uid],
              bet: action.data,
            },
          };
        }
        return {
          ...state,
        };
      }
    }

    case 'TOGGLE_SOUND': {
      if (state && !state[action.uid]) {
        return {
          ...state,
          [action.uid]: {
            ...state.default,
            soundOn: !state.default.soundOn || false,
          },
        };
      } else {
        return {
          ...state,
          [action.uid]: {
            ...state[action.uid],
            soundOn: !state[action.uid].soundOn || false,
          },
        };
      }
    }

    default:
      return state;
  }
}
