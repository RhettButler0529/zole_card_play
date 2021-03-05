import Store from '../store/points';
import isEqual from "react-fast-compare";

export const initialState = Store;

export default function gameReducer(state = initialState, action) {
  switch (action.type) {
    case 'POINTS_TOTAL': {
      return {
        ...state,
      //  [action.roomId]: {
      //    ...state[action.roomId],
          totalPoints: action.data,
      //  },
      };
    }

    case 'POINTS_REPLACE': {
      return {
        ...state,
      //  [action.roomId]: {
      //    ...state[action.roomId],
          points: action.data || {},
      //  },
      };
    }

    case 'POINTS_CHANGE': {
    //  if (state && state.points && state.points[action.key] === action.data) {
    //    return state;
    //  }
      if (state.points && !isEqual(state.points[action.key], action.data)) {
        return {
          ...state,
        //  [action.roomId]: {
        //    ...state[action.roomId],
            points: {
              ...state.points,
              [action.key]: action.data || {},
            },
          //  totalPoints: action.data.total,
        //  },
        };
      } else {
        return state;
      }
    }


    default:
      return state;
  }
}
