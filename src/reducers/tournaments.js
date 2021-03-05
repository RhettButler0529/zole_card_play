import Store from '../store/tournaments';

export const initialState = Store;

export default function tournamentsReducer(state = initialState, action) {
  switch (action.type) {
    case 'TOURNAMENTS_REPLACE': {
      return {
        ...state,
        tournaments: action.data,
      };
    }

    case 'TOURNAMENT_PLAYERS_REPLACE': {
      const tournamentPlayers = {};
      action.data.map((tournament) => {
        tournamentPlayers[tournament.tournamentId] = tournament.players;

        return null;
      });

      return {
        ...state,
        tournamentPlayers,
      };
    }

    case 'JOINED_TOURNAMENT': {
      return {
        ...state,
        joinedTournament: action.data,
      };
    }

    case 'MY_TOURNAMENTS_DATA_2': {
      return {
        ...state,
        myTournamentsData2: action.data,
      };
    }

    case 'MY_TOURNAMENTS_DATA': {
      let myData = {};
      let registered = false;
      if (state) {
        myData = state.myTournamentsData;
      }
      if (action.data && action.data.playerData
          && Object.keys(action.data.playerData).length !== 0) {
        registered = true;
      }

      return {
        ...state,
        myTournamentsData: {
          ...myData,
          [action.data.tournamentId]: {
            ...action.data.playerData,
            registered,
            status: action.data.status,
          },
        },
      };
    }

    case 'MY_TOURNAMENTS_DATA_STOP_WAIT': {
      let myData = {};
      let tournamentData = {};

      if (state) {
        myData = state.myTournamentsData;
      }
      if (myData) {
        tournamentData = state.myTournamentsData[action.data.tournamentId];
      }

      return {
        ...state,
        myTournamentsData: {
          ...myData,
          [action.data.tournamentId]: {
            ...tournamentData,
            status: action.data.status,
          },
        },
      };
    }

    case 'MY_TOURNAMENTS_STATUS': {
      if (action.data && action.data.status
        && Object.keys(action.data.status).length !== 0) {
        const { myTournamentsStatus } = state;

        return {
          ...state,
          myTournamentsStatus: {
            ...myTournamentsStatus,
            [action.data.tournamentId]: action.data.status,
          },
        };
      }
      return state;
    }

    case 'TOURNAMENT_ROOMS_REPLACE': {
      return {
        ...state,
        tournamentRooms: action.data,
      };
    }

    case 'TOURNAMENTS_HISTORY_REPLACE': {
      return {
        ...state,
        tournamentsHistory: action.data,
      };
    }

    case 'TOURNAMENT_HISTORY_REPLACE': {
      const { tournamentId, players } = action.data;

      let myData = {};
      if (state) {
        myData = state.tournamentsHistoryPlayers;
      }

      return {
        ...state,
        tournamentsHistoryPlayers: {
          ...myData,
          [tournamentId]: {
            ...players,
          },
        },
      };
    }

    case 'RESET_STORE': {
      return initialState;
    }

    default:
      return state;
  }
}
