import Store from '../store/state';

export const initialState = Store;


export default function stateReducer(state = initialState, action) {
  switch (action.type) {
    case 'LOADING_REPLACE': {
      return {
        ...state,
        isLoading: action.data,
      };
    }

    default:
      return state;
  }
}