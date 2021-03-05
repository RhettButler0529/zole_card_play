import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { Firebase } from '../../lib/firebase';

import { PageView, initGA } from '../../web/components/Tracking';


import {
  createRoom,
  getRooms,
  getMyRooms,
  joinRoom,
  leaveRoomMenu,
  resetRoomsList,
  cancelRoomsListeners,
} from '../../actions/room';

import { toggleNewGameParam, setNewGameBet } from '../../actions/userSettings';

import { getPlayers } from '../../actions/game';

import {
  getTournaments,
  joinTournament,
  joinTournamentRoom,
  getTournamentPlayers,
  getMyTournamentData,
  resetTournamentStore,
  getTournamentRooms,
  getTournamentsHistory,
  getTournamentHistory,
  buyTournamentMoneyMenu,
  cancelTournamentWaitRoom,
  leaveTournament,
  getMyTournamentsData,
} from '../../actions/tournaments';

import {
  getUserData,
  spinBonusWheel,
  claimSpinResults,
  checkLoginState,
  sendMoney,
  submitError,
  getTimeOffset,
  initFBPayment,
  initDraugiemPayment,
  fbPaymentCallback,
  disableTutorial,
  disableFirstTimeNotif,
  sendSupportMessage,
  setSupportAsRead,
  readSupportChat,
  readSupportStatus,
  getBalanceHistory,
  getFBFriends,
  getIgnoredPlayers,
  unBlockUser,
  getAchievements,
  updateUserLastLogin,
  closeLevelNotification,
  setCheckedVersion,
  logout,
  initStripePayment
} from '../../actions/member';

import {
  getUserCount,
  getRoomsCount,
  getBannedUsers,
  getBannedUsersCount,
  //  getOnlineUsers,
  //  getOnlineUsersLazy,
  //  resetGetOnlineUsersLazy,
  updateOnlineState,
} from '../../actions/users';

import { setLoading } from '../../actions/state';

import {
  getLeaderboard,
  getLeaderboardYear,
  getLeaderboardMonth,
  getLeaderboardWeek,
  getLeaderboardDaily,
  getPositionInLeaderboard,
  getPositionInLeaderboardYear,
  getPositionInLeaderboardMonth,
  getPositionInLeaderboardWeek,
  getPositionInLeaderboardDaily,
} from '../../actions/leaderboard';

import startGameSound from '../../sounds/game_start.wav';
import buttonClickedSound from '../../sounds/click_feedback.flac';

class Menu extends Component {
  static propTypes = {
    Layout: PropTypes.shape({}).isRequired,
    history: PropTypes.shape({
      push: PropTypes.func,
    }),
    rooms: PropTypes.shape({
      rooms: PropTypes.shape({}),
      lastJoinedRoom: PropTypes.string,
    }),
    state: PropTypes.shape({
      isLoading: PropTypes.bool,
    }),
    member: PropTypes.shape({
      joinedRooms: PropTypes.shape({}),
    }),
    leaderboard: PropTypes.shape({
      leaderboard: PropTypes.arrayOf(PropTypes.shape({})),
      myLeaderboard: PropTypes.shape({}),
    }),
    tournaments: PropTypes.shape({
      tournaments: PropTypes.shape({}),
      tournamentsHistory: PropTypes.shape({}),
      tournamentsHistoryPlayers: PropTypes.shape({}),
      myTournamentsData: PropTypes.shape({}),
      tournamentPlayers: PropTypes.shape({}),
    }),
    users: PropTypes.shape({
      roomCount: PropTypes.number,
      userCount: PropTypes.number,
      bannedUsers: PropTypes.shape({}),
      bannedUsersCount: PropTypes.number,
      //  onlineUsers: PropTypes.shape({}),
      //  onlineUsersLazy: PropTypes.shape({}),
    }),
    game: PropTypes.shape({
      lastRoom: PropTypes.string,
    }),
    match: PropTypes.shape({
      params: PropTypes.shape({
        id: PropTypes.string,
      }),
    }),
    fetchFreeRooms: PropTypes.func.isRequired,
    createNewRoom: PropTypes.func.isRequired,
    connectToRoom: PropTypes.func.isRequired,
    fetchUserData: PropTypes.func.isRequired,
    spinWheel: PropTypes.func.isRequired,
    claimSpin: PropTypes.func.isRequired,
    checkLogin: PropTypes.func.isRequired,
    fetchLeaderboard: PropTypes.func.isRequired,
    fetchLeaderboardYear: PropTypes.func.isRequired,
    fetchLeaderboardMonth: PropTypes.func.isRequired,
    fetchLeaderboardWeek: PropTypes.func.isRequired,
    fetchLeaderboardDaily: PropTypes.func.isRequired,
    fetchPositionInLeaderboard: PropTypes.func.isRequired,
    fetchPositionInLeaderboardYear: PropTypes.func.isRequired,
    fetchPositionInLeaderboardMonth: PropTypes.func.isRequired,
    fetchPositionInLeaderboardWeek: PropTypes.func.isRequired,
    fetchPositionInLeaderboardDaily: PropTypes.func.isRequired,
    SendMoneyToFriend: PropTypes.func.isRequired,
    fetchTournaments: PropTypes.func.isRequired,
    fetchTournamentPlayers: PropTypes.func.isRequired,
    joinATournament: PropTypes.func.isRequired,
    joinATournamentRoom: PropTypes.func.isRequired,
    submitErr: PropTypes.func.isRequired,
    fetchPlayers: PropTypes.func.isRequired,
    fetchMyTournamentData: PropTypes.func.isRequired,
    fetchMyTournamentsData: PropTypes.func.isRequired,
    resetStore: PropTypes.func.isRequired,
    fetchTournamentsHistory: PropTypes.func.isRequired,
    fetchTournamentHistory: PropTypes.func.isRequired,
    fetchRoomsCount: PropTypes.func.isRequired,
    fetchMyRooms: PropTypes.func.isRequired,
    fetchUserCount: PropTypes.func.isRequired,
    buyTourMoney: PropTypes.func.isRequired,
    exitTournament: PropTypes.func.isRequired,
    initFBPay: PropTypes.func.isRequired,
    initDraugiemPay: PropTypes.func.isRequired,
    fbPaymentCall: PropTypes.func.isRequired,
    disableFirstTime: PropTypes.func.isRequired,
    disableTut: PropTypes.func.isRequired,
    readSupport: PropTypes.func.isRequired,
    sendSupportMsg: PropTypes.func.isRequired,
    readSupportStat: PropTypes.func.isRequired,
    fetchBannedUsers: PropTypes.func.isRequired,
    fetchBannedUsersCount: PropTypes.func.isRequired,
    fetchBalanceHistory: PropTypes.func.isRequired,
    //  fetchOnlineUsers: PropTypes.func.isRequired,
    //  fetchOnlineUsersLazy: PropTypes.func.isRequired,
    //  resetOnlineUsersLazy: PropTypes.func.isRequired,
    setSupportRead: PropTypes.func.isRequired,
    showNotification: PropTypes.func.isRequired,
    fetchFBFriends: PropTypes.func.isRequired,
    setOnlineState: PropTypes.func.isRequired,
    unIgnoreUser: PropTypes.func.isRequired,
    fetchIgnoredPlayers: PropTypes.func.isRequired,
    cancelWaitRoom: PropTypes.func.isRequired,
    fetchAchievements: PropTypes.func.isRequired,
    leaveRoom: PropTypes.func.isRequired,
    toggleNewGameParameter: PropTypes.func.isRequired,
    setNewBet: PropTypes.func.isRequired,
    updateLastLogin: PropTypes.func.isRequired,
    closeLevelUpNotification: PropTypes.func.isRequired,
    resetRooms: PropTypes.func.isRequired,
    cancelRoomListeners: PropTypes.func.isRequired,
    setCheckedVersion: PropTypes.func.isRequired,
    logout: PropTypes.func.isRequired,
    initStripePayment: PropTypes.func.isRequired,
    setLoading: PropTypes.func.isRequired,
  };

  static defaultProps = {
    match: null,
    rooms: {},
    member: {},
    leaderboard: {},
    tournaments: {},
    users: {},
    game: {},
    history: {},
  };

  constructor(props) {
    super(props);
    this.state = {
      error: null,
      roomsLoading: true,
      userDataLoading: true,
      myTournamentDataLoading: true,
      loadingProgress: 0,
      uid: null,
      myTournamentsData: {},
      tournamentPlayers: {},
      errorNotification: '',
      ignoredMessageName: '',
      closeErrorSubmit: false,
      // change to lowerCaseName
      sortFilter: 'lowerCaseName',
      sortDirection: 'asc',
      lastKey: '',
      lastItem: '',
      privateRoomPassword: '',
      showPrivateRoomPassword: false,
      insufficientBalanceAmount: null,
      insufficientBalanceBet: null,
    };

    this.checkLoginState = this.checkLoginState.bind(this);
    this.handleFBLogin = this.handleFBLogin.bind(this);
    this.resetErrorNotif = this.resetErrorNotif.bind(this);
    this.resetCloseErrorSubmit = this.resetCloseErrorSubmit.bind(this);

    this.startGameAudio = new Audio(startGameSound);
    this.buttonClickedAudio = new Audio(buttonClickedSound);
  }

  componentDidMount = () => {
    console.log('componentDidMount');
    const {
      //  setOnlineState,
      //  resetOnlineUsersLazy,
      fetchMyRooms,
      fetchRoomsCount,
      fetchUserCount,
    } = this.props;

    //  setOnlineState();

    initGA('UA-147571548-1');
    PageView();

    fetchRoomsCount();
    fetchUserCount();

    this.fetchRooms();
    //  this.fetchOnlineUsersLazy();
    this.fetchLeaderboard();

    /*  resetOnlineUsersLazy().then((res) => {
      if (res && res.type === 'ONLINE_USERS_LAZY_NEW') {
        this.fetchOnlineUsersLazy();
      } else {
        this.fetchOnlineUsersLazy();
      }
    }).catch((err) => {
      this.fetchOnlineUsersLazy();
    }); */

    this.unsub = Firebase.auth().onAuthStateChanged(user => {
      console.log('user');
      console.log(user);

      if (user) {
        fetchMyRooms();
        this.fetchUserData();
        this.fetchTournaments();
        //  this.readSupportChat();
        this.readSupportStatus();

        this.fetchBannedUsersCount();
        this.fetchBannedUsers(1, 50);

        this.fetchPositionInLeaderboard();
        this.fetchMyTournamentsData();

        setTimeout(() => {
          this.setState({ uid: user.uid, myTournamentDataLoading: false, userDataLoading: false });
        }, 250);
      //  unsub();
      } else {
        this.fetchUserData();
      //  const { loadingProgress } = this.state;
        this.setState({
        //  userDataLoading: false,
        //  loadingProgress: loadingProgress + 20,
          uid: null,
        });
      }
    });
  };

  // componentDidMount() {
  //  initGA('UA-147571548-1');
  //  PageView();
//  }

  componentWillReceiveProps(nextProps) {
    const { tournaments, history, member, rooms, updateLastLogin } = nextProps;
    const { uid } = this.state;

  /*  const pubRooms = rooms.rooms;
    const { joinedRooms } = member;
    let joinedRoom;
    let joinedRoomId;
    if (joinedRooms && pubRooms) {
      Object.keys(joinedRooms).map(key => {
        if (pubRooms[key]) {
          joinedRoom = pubRooms[key];
          joinedRoomId = key;
        } else {
          joinedRoom = null;
          joinedRoomId = null;
        }
        return null;
      });
    } else {
      joinedRoom = null;
      joinedRoomId = null;
    }

    //  && (joinedRoom.playersList.player1 === member.uid || joinedRoom.playersList.player2 === member.uid || joinedRoom.playersList.player3 === member.uid))
    if (joinedRoom && joinedRoomId) {
      if (
        member.uid &&
        joinedRoom.playersList &&
        joinedRoom.playersList.player1 &&
        joinedRoom.playersList.player2 &&
        joinedRoom.playersList.player3 &&
        (joinedRoom.playersList.player1.uid.toString() ===
          member.uid.toString() ||
          joinedRoom.playersList.player2.uid.toString() ===
            member.uid.toString() ||
          joinedRoom.playersList.player3.uid.toString() ===
            member.uid.toString())
      ) {
      //  updateLastLogin();
      //  this.startGameAudio.play();
      //  console.log('history.push');
      //  history.push(`/zole/${joinedRoomId}`);
      }
    }  */

    if (uid && member && member.uid && member.activeRoom) {
      updateLastLogin();
      this.startGameAudio.play();
    //  console.log('history.push');
      history.push(`/zole/${member.activeRoom}`);
    }

    const { myTournamentDataLoading, myTournamentsData } = this.state;

    const { tournamentPlayers } = tournaments;
    const myTournamentsDataNew = tournaments.myTournamentsData;

    if (!myTournamentDataLoading && myTournamentsDataNew) {
      Object.keys(myTournamentsDataNew).map(key => {
        if (
          myTournamentsDataNew[key] &&
          ((myTournamentsData[key] && !myTournamentsData[key].roomId) ||
            (myTournamentsData[key] &&
              myTournamentsData[key].roomId !==
                myTournamentsDataNew[key].roomId)) &&
          myTournamentsDataNew[key].roomId
        ) {
          //  if (!game.lastRoom || game.lastRoom !== myTournamentsData[key].roomId) {

          updateLastLogin();
          this.startGameAudio.play();
          history.push(`/zole/${myTournamentsDataNew[key].roomId}`);
          //  }
        }
        return null;
      });
    }

    //  if (rooms) {
    //    this.setState({ allRooms: rooms });
    //  }

    if (myTournamentsDataNew) {
      this.setState({ myTournamentsData: myTournamentsDataNew });
    }

    if (tournamentPlayers) {
      this.setState({ tournamentPlayers });
    }
  }

  componentWillUnmount() {
    const {
      resetStore,
      //  resetOnlineUsersLazy,
    //  resetRooms,
      cancelRoomListeners,
    } = this.props;

    this.unsub();

    this.setState({
      sortFilter: 'name',
      sortDirection: 'asc',
      lastItem: '',
      lastKey: '',
    });
    /*  resetOnlineUsersLazy().then((res) => {
      if (res && res.type === 'ONLINE_USERS_LAZY_NEW') {
        this.fetchOnlineUsersLazy();
      }
    });  */

  //  resetRooms();
    cancelRoomListeners();
  //  resetStore();
  }

  fetchRooms = data => {
    const { fetchFreeRooms } = this.props;

    return fetchFreeRooms(data)
      .then(() => {
        const { loadingProgress } = this.state;
        this.setState({
          roomsLoading: false,
          loadingProgress: loadingProgress + 20,
        });
      })
      .catch(err => {
        const { loadingProgress } = this.state;
        this.setState({
          roomsLoading: false,
          loadingProgress: loadingProgress + 20,
          error: err,
        });
      });
  };

  fetchUserData = data => {
    const { fetchUserData } = this.props;

    return fetchUserData(data)
      .then(() => {
        const { loadingProgress } = this.state;
        this.setState({
          userDataLoading: false,
          loadingProgress: loadingProgress + 20,
        });
      })
      .catch(err => {
        const { loadingProgress } = this.state;
        this.setState({
          userDataLoading: false,
          loadingProgress: loadingProgress + 20,
          error: err,
        });
      });
  };

  fetchLeaderboard = () => {
    const {
      fetchLeaderboard,
      //  fetchLeaderboardYear,
      //  fetchLeaderboardMonth,
      //  fetchLeaderboardWeek,
      //  fetchLeaderboardDaily,
    } = this.props;

    //  fetchLeaderboardYear();
    //  fetchLeaderboardMonth();
    //  fetchLeaderboardWeek();
    //  fetchLeaderboardDaily();

    return fetchLeaderboard()
      .then(() => {
        const { loadingProgress } = this.state;
        this.setState({
          loadingProgress: loadingProgress + 20,
        });
      })
      .catch(err => {
        const { loadingProgress } = this.state;
        this.setState({
          loadingProgress: loadingProgress + 20,
          error: err,
        });
      });
  };

  fetchPositionInLeaderboard = () => {
    const {
      fetchPositionInLeaderboard,
      //  fetchPositionInLeaderboardYear,
      //  fetchPositionInLeaderboardMonth,
      //  fetchPositionInLeaderboardWeek,
      //  fetchPositionInLeaderboardDaily,
    } = this.props;

    //  fetchPositionInLeaderboardYear();
    //  fetchPositionInLeaderboardMonth();
    //  fetchPositionInLeaderboardWeek();
    //  fetchPositionInLeaderboardDaily();

    return fetchPositionInLeaderboard()
      .then(() => {})
      .catch(err =>
        this.setState({
          error: err,
        })
      );
  };

  fetchTournaments = () => {
    const { fetchTournaments } = this.props;

    return fetchTournaments()
      .then(res => {
        Object.keys(res.data).map(key => {
          if (res.data[key].status === 'running') {
            this.fetchMyTournamentData(key);
            this.fetchTournamentPlayers(key);
          }
          return null;
        });
      })
      .catch(err =>
        this.setState({
          error: err,
        })
      );
  };



  initStripePayment = product => {
    const { initStripePayment } = this.props;

    return initStripePayment(product)
      .then(res => ({ status: 'success', data: res.data.data }))
      .catch(err => {
        this.setState({
          error: err,
        });
        return { status: 'error', err };
      });
  };

  initFBPayment = product => {
    const { initFBPay } = this.props;

    return initFBPay(product)
      .then(res => ({ status: 'success', data: res.data.data }))
      .catch(err => {
        this.setState({
          error: err,
        });
        return { status: 'error', err };
      });
  };

  fbPaymentCallback = resp => {
    const { fbPaymentCall } = this.props;

    return fbPaymentCall(resp)
      .then(res => ({ status: 'success', data: res.data.data }))
      .catch(err => {
        this.setState({
          error: err,
        });
        return { status: 'error', err };
      });
  };

  initDraugiemPayment = product => {
    const { initDraugiemPay } = this.props;

    return initDraugiemPay(product)
      .then(res => {
      //  console.log('res initDraugiemPayment');
      //  console.log(res.data);
        return { status: 'success', data: res.data.data };
      })
      .catch(err => {
        this.setState({
          error: err,
        });
        return { status: 'error', err };
      });
  };

  fetchMyTournamentsData = () => {
    const { fetchMyTournamentsData } = this.props;

    return fetchMyTournamentsData()
      .then(() => {})
      .catch(err =>
        this.setState({
          error: err,
        })
      );
  };

  fetchMyTournamentData = tournamentId => {
    const { fetchMyTournamentData } = this.props;

    return fetchMyTournamentData(tournamentId)
      .then(() => {})
      .catch(err =>
        this.setState({
          error: err,
        })
      );
  };

  fetchTournamentsHistory = () => {
    const { fetchTournamentsHistory } = this.props;

    return fetchTournamentsHistory()
      .then(() => {})
      .catch(err => {
        console.log(err);
      });
  };

  fetchTournamentHistory = tournamentId => {
    const { fetchTournamentHistory } = this.props;

    return fetchTournamentHistory(tournamentId).catch(err => {
      console.log(err);
    });
  };

  fetchTournamentPlayers = tournamentId => {
    const { fetchTournamentPlayers } = this.props;

    return fetchTournamentPlayers(tournamentId).catch(err =>
      this.setState({
        error: err,
      })
    );
  };

  createRoom = (parasta, M, atra, pro, bet, maza, privateRoom) => {
    const { createNewRoom } = this.props;

    return createNewRoom(parasta, M, atra, pro, bet, maza, privateRoom)
      .then(res => {
        if (res.data.data.status === 'success') {
          //  history.push(`/zole/${res.data.data.key}`);
          if (res.data.data.password) {
            this.setState({
              privateRoomPassword: res.data.data.password,
              showPrivateRoomPassword: true,
            });
          }
        } else if (res.data.data.status === 'error') {
          this.setState({
            errorNotification: res.data.data.error,
            insufficientBalanceAmount: res.data.data.balNeeded || null,
            insufficientBalanceBet: bet,
          });
        }
      })
      .catch(err =>
        this.setState({
          error: err,
        })
      );
  };

  closePrivateRoomPassword = () => {
    //  this.setState({ privateRoomPassword: '' });
    this.setState({ showPrivateRoomPassword: false });
  };

  joinRoom = ({ roomId, position, password, bet }) => {
    const { connectToRoom } = this.props;

    return connectToRoom(roomId, position, password)
      .then(res => {
        if (res.data.data.status === 'success') {
          //  history.push(`/zole/${roomId}`);
        } else if (res.data.data.status === 'error') {
          if (res.data.data.error === 'Ignored') {
            if (res.data.data.type === 'you ignored') {
              this.setState({
                errorNotification: 'You ignored player',
                ignoredMessageName: res.data.data.name,
              });
            } else {
              this.setState({
                errorNotification: 'Player ignored you',
                ignoredMessageName: res.data.data.name,
              });
            }
            //  this.setState({ errorNotification: res.data.data.error });
          } else {
            this.setState({
              errorNotification: res.data.data.error,
              insufficientBalanceAmount: res.data.data.balNeeded || null,
              insufficientBalanceBet: bet || null,
            });
          }
        }

        return res.data.data;
      })
      .catch(err =>
        this.setState({
          error: err,
        })
      );
  };

  leaveRoom = roomId => {
    const { leaveRoom } = this.props;

    leaveRoom(roomId);

    this.setState({ privateRoomPassword: '', showPrivateRoomPassword: false });
  };

  fetchPlayers = roomId => {
    const { fetchPlayers } = this.props;

    return fetchPlayers(roomId).catch(err => this.setState({ error: err }));
  };

  joinTournament = tournamentId => {
    const { joinATournament } = this.props;
    const { myTournamentsData } = this.state;

    if (
      !myTournamentsData ||
      (myTournamentsData && !myTournamentsData[tournamentId]) ||
      (myTournamentsData &&
        myTournamentsData[tournamentId] &&
        !myTournamentsData[tournamentId].registered)
    ) {
      return joinATournament(tournamentId)
        .then(res => {
          if (res.data.status === 'error') {
            this.setState({ errorNotification: res.data.error });
          } else {
            this.fetchMyTournamentData(tournamentId);
            this.fetchTournamentPlayers(tournamentId);
          }
        })
        .catch(err =>
          this.setState({
            error: err,
          })
        );
    }
    return null;
  };

  joinTournamentRoom = tournamentId => {
    const { joinATournamentRoom } = this.props;

    return joinATournamentRoom(tournamentId)
      .then(() => {
        this.fetchMyTournamentData(tournamentId);
      })
      .catch(err =>
        this.setState({
          error: err,
        })
      );
  };

  spinWheel = () => {
    const { spinWheel } = this.props;

    return spinWheel()
      .then(res => res)
      .catch(err =>
        this.setState({
          error: err,
        })
      );
  };

  sendMoney = (friendId, amount) => {
    const { SendMoneyToFriend } = this.props;

    return SendMoneyToFriend(friendId, amount)
      .then(res => res)
      .catch(err =>
        this.setState({
          error: err,
        })
      );
  };

  submitErr = data => {
    const { submitErr, showNotification } = this.props;

    return submitErr(data)
      .then(res => {
        if (res.data && res.data.data && res.data.data.status === 'success') {
          this.setState({ closeErrorSubmit: true });
          showNotification('Kļūda nosūtīta', 'Kļūda nosūtīta', 'success');
        } else if (
          res.data &&
          res.data.data &&
          res.data.data.status === 'error'
        ) {
          showNotification(
            'Neizdevās nosūtīt kļūdu',
            res.data.data.message,
            'danger'
          );
        }
      })
      .catch(err =>
        this.setState({
          error: err,
        })
      );
  };

  resetCloseErrorSubmit = () => {
    this.setState({ closeErrorSubmit: false });
    return null;
  };

  resetErrorNotif = () => {
    this.setState({ errorNotification: '' });
  };

  fetchUserCount = () => {
    const { fetchUserCount } = this.props;
    fetchUserCount().then(() => {});
  };

  //  fetchRoomsCount = () => {
  //    const { fetchRoomsCount } = this.props;
  //  fetchRoomsCount().catch((err) => {
  //      console.log(err);
  //    });
  //  }

  buyTournamentMoney = tournamentId => {
    const { buyTourMoney } = this.props;

    return buyTourMoney(tournamentId).catch(err => {
      console.log(err);
    });
  };

  leaveTournament = tournamentId => {
    const { exitTournament } = this.props;

    return exitTournament(tournamentId).catch(err => {
      console.log(err);
    });
  };

  disableTutorial = () => {
    const { disableTut } = this.props;

    return disableTut().catch(err => {
      console.log(err);
    });
  };

  disableFirstTimeNotif = () => {
    const { disableFirstTime } = this.props;

    return disableFirstTime().catch(err => {
      console.log(err);
    });
  };

  sendSupportMessage = data => {
    const { sendSupportMsg } = this.props;

    return sendSupportMsg(data).catch(err => {
      console.log(err);
    });
  };

  setSupportAsRead = () => {
    const { setSupportRead } = this.props;

    return setSupportRead().catch(err => {
      console.log(err);
    });
  };

  readSupportChat = () => {
    const { readSupport } = this.props;

    return readSupport().catch(err => {
      console.log(err);
    });
  };

  readSupportStatus = () => {
    const { readSupportStat } = this.props;

    return readSupportStat().catch(err => {
      console.log(err);
    });
  };

  fetchBannedUsers = (start, end) => {
    const { fetchBannedUsers } = this.props;

    return fetchBannedUsers(start, end).catch(err => {
      console.log(err);
    });
  };

  fetchBannedUsersCount = () => {
    const { fetchBannedUsersCount } = this.props;

    return fetchBannedUsersCount().catch(err => {
      console.log(err);
    });
  };

  fetchBalanceHistory = time => {
    const { fetchBalanceHistory } = this.props;

    return fetchBalanceHistory(time).catch(err => {
      console.log(err);
    });
  };

  /* fetchOnlineUsers = () => {
    const { fetchOnlineUsers } = this.props;

    return fetchOnlineUsers().catch((err) => {
      console.log(err);
    });
  }

  fetchOnlineUsersLazy = () => {
    const { fetchOnlineUsersLazy } = this.props;
    const {
      sortFilter, sortDirection, lastItem, lastKey,
    } = this.state;

    return fetchOnlineUsersLazy(sortFilter, sortDirection, lastItem, lastKey)
      .then((res) => {
        this.setState({ lastKey: res.lastKey, lastItem: res.lastItem });
      })
      .catch((err) => {
        console.log(err);
      });
  }

  changeSortFilter = (sortFilter) => {
    const { resetOnlineUsersLazy } = this.props;
    if (sortFilter) {
      let sortDirection = 'desc';
      // change to lowerCaseName
      if (sortFilter === 'lowerCaseName') {
        sortDirection = 'asc';
      }
      this.setState({
        sortFilter, sortDirection, lastItem: '', lastKey: '',
      });
      resetOnlineUsersLazy().then((res) => {
        if (res && res.type === 'ONLINE_USERS_LAZY_NEW') {
          this.fetchOnlineUsersLazy();
        }
      });
    }
  }

  changeSortDirection = (sortDirection) => {
    const { resetOnlineUsersLazy } = this.props;
    //  const { sortFilter } = this.state;
    if (sortDirection) {
      this.setState({ sortDirection, lastItem: '', lastKey: '' });
      resetOnlineUsersLazy(sortDirection).then((res) => {
        if (res && res.type === 'ONLINE_USERS_LAZY_NEW') {
          this.fetchOnlineUsersLazy();
        }
      });
    }
  }  */

  handleFBLogin() {
    const { checkLogin } = this.props;

    window.FB.getLoginStatus(response => {
      if (response.status === 'connected') {
        this.checkLoginState(response);
      } else if (response.status === 'not_authorized') {
        //  console.log('not_authorized');
        window.FB.login(response2 => {
          if (response2.authResponse) {
            checkLogin(response2).then(() => {});
          } else {
            //  console.log('User cancelled login or did not fully authorize.');
          }
        });
      } else if (window.FB) {
        window.FB.login(response2 => {
          //  console.log(response2);
          if (response2.authResponse) {
            checkLogin(response2).then(() => {
              //  console.log(res);
            });
          } else {
            checkLogin(response2).then(() => {
              //  console.log(res);
            });
          }
        });
      }
    });
  }

  checkLoginState() {
    window.FB.getLoginStatus(response => {
      const { checkLogin } = this.props;

      checkLogin(response).then(() => {
        //  console.log(res);
      });
    });
  }

  playButtonSound = () => {
    const { userSettings } = this.props;
    const { uid } = this.state;

    if (userSettings && uid) {
      const userSettings2 = userSettings[uid] || userSettings.default || {}

      if (userSettings2 && userSettings2.soundOn) {
        this.buttonClickedAudio.play();
      }
    }
  }

  render = () => {
    const {
      Layout,
      rooms,
      match,
      member,
      leaderboard,
      tournaments,
      game,
      showNotification,
      users,
      fetchFBFriends,
      fetchIgnoredPlayers,
      unIgnoreUser,
      cancelWaitRoom,
      fetchLeaderboardYear,
      fetchLeaderboardMonth,
      fetchLeaderboardWeek,
      fetchLeaderboardDaily,
      fetchPositionInLeaderboardYear,
      fetchPositionInLeaderboardMonth,
      fetchPositionInLeaderboardWeek,
      fetchPositionInLeaderboardDaily,
      fetchAchievements,
      //  leaveRoom,
      claimSpin,
      toggleNewGameParameter,
      setNewBet,
      userSettings,
      closeLevelUpNotification,
      cancelRoomListeners,
      fetchFreeRooms,
      setCheckedVersion,
      logout,
      history,
      setLoading,
      state
    } = this.props;

    const {
      error,
      uid,
      roomsLoading,
      userDataLoading,
      loadingProgress,
      //  myTournamentDataLoading,
      tournamentPlayers,
      errorNotification,
      ignoredMessageName,
      closeErrorSubmit,
      privateRoomPassword,
      showPrivateRoomPassword,
      insufficientBalanceAmount,
      insufficientBalanceBet,
    } = this.state;

    const id =
      match && match.params && match.params.id ? match.params.id : null;

    //  const firebaseUid = (
    //    Firebase
    //    && Firebase.auth()
    //    && Firebase.auth().currentUser
    //    && Firebase.auth().currentUser.uid
    //  ) ? Firebase.auth().currentUser.uid : null;

    const loading =  !(
        member &&
        member.uid &&
        uid &&
        uid.toString() === member.uid.toString()
      ) ||
      roomsLoading ||
      userDataLoading;

    if(state.isLoading != loading){
      setLoading(loading);
    }

    return (
      <Layout
        uid={uid}
        gameId={id}
        error={error}
        errorNotification={errorNotification}
        insufficientBalanceAmount={insufficientBalanceAmount}
        insufficientBalanceBet={insufficientBalanceBet}
        ignoredMessageName={ignoredMessageName}
        resetErrorNotif={this.resetErrorNotif}
        leaderboard={leaderboard}
        tournaments={tournaments.tournaments}
        tournamentPlayers={tournamentPlayers}
        myTournamentsData={tournaments.myTournamentsData}
        tournamentsHistory={tournaments.tournamentsHistory}
        tournamentsHistoryPlayers={tournaments.tournamentsHistoryPlayers}
        loading={loading}
        loadingProgress={loadingProgress}
        member={member}
        privateRoomPassword={privateRoomPassword}
        showPrivateRoomPassword={showPrivateRoomPassword}
        closePrivateRoomPassword={this.closePrivateRoomPassword}
        fetchLeaderboardYear={fetchLeaderboardYear}
        fetchLeaderboardMonth={fetchLeaderboardMonth}
        fetchLeaderboardWeek={fetchLeaderboardWeek}
        fetchLeaderboardDaily={fetchLeaderboardDaily}
        fetchPositionInLeaderboardYear={fetchPositionInLeaderboardYear}
        fetchPositionInLeaderboardMonth={fetchPositionInLeaderboardMonth}
        fetchPositionInLeaderboardWeek={fetchPositionInLeaderboardWeek}
        fetchPositionInLeaderboardDaily={fetchPositionInLeaderboardDaily}
        readSupportChat={this.readSupportChat}
        roomsCount={users.roomsCount}
        usersCount={users.usersCount}
        bannedUsers={users.bannedUsers}
        bannedUsersCount={users.bannedUsersCount}
        //  onlineUsers={users.onlineUsers}
        //  onlineUsersLazy={users.onlineUsersLazy}
        rooms={rooms.rooms}
        myRooms={rooms.myRooms}
        lastRoom={game.lastRoom}
        lastJoinedRoom={rooms.lastJoinedRoom}
        leaveRoom={this.leaveRoom}
        closeErrorSubmit={closeErrorSubmit}
        showNotification={showNotification}
        createRoom={this.createRoom}
        joinRoom={this.joinRoom}
        spinWheel={this.spinWheel}
        claimSpin={claimSpin}
        handleFBLogin={this.handleFBLogin}
        sendMoney={this.sendMoney}
        joinTournament={this.joinTournament}
        joinTournamentRoom={this.joinTournamentRoom}
        buyTournamentMoney={this.buyTournamentMoney}
        cancelWaitRoom={cancelWaitRoom}
        leaveTournament={this.leaveTournament}
        fetchTournamentsHistory={this.fetchTournamentsHistory}
        fetchTournamentHistory={this.fetchTournamentHistory}
        submitError={this.submitErr}
        resetCloseErrorSubmit={this.resetCloseErrorSubmit}
        initFBPayment={this.initFBPayment}
        initStripePayment={this.initStripePayment}
        initDraugiemPayment={this.initDraugiemPayment}
        fbPaymentCallback={this.fbPaymentCallback}
        disableTutorial={this.disableTutorial}
        disableFirstTimeNotif={this.disableFirstTimeNotif}
        sendSupportMessage={this.sendSupportMessage}
        setSupportAsRead={this.setSupportAsRead}
        fetchBannedUsers={this.fetchBannedUsers}
        fetchBalanceHistory={this.fetchBalanceHistory}
        //  fetchOnlineUsersLazy={this.fetchOnlineUsersLazy}
        changeSortFilter={this.changeSortFilter}
        changeSortDirection={this.changeSortDirection}
        closeLevelNotification={closeLevelUpNotification}
        fetchFBFriends={fetchFBFriends}
        fetchIgnoredPlayers={fetchIgnoredPlayers}
        fetchAchievements={fetchAchievements}
        unBlockUser={unIgnoreUser}
        toggleNewGameParameter={toggleNewGameParameter}
        setNewBet={setNewBet}
        userSettings={userSettings[uid] || userSettings.default || {}}
        reFetchRooms={() => this.fetchRooms()}
        fetchLeaderboard={() => this.fetchLeaderboard()}
        fetchPositionInLeaderboard={() => this.fetchPositionInLeaderboard()}
        fetchTournamentPlayers={() => this.fetchTournamentPlayers()}
        cancelRoomListeners={cancelRoomListeners}
        fetchFreeRooms={fetchFreeRooms}
        setCheckedVersion={setCheckedVersion}
        playButtonSound={this.playButtonSound}
        logout={logout}
        history={history}
      />
    );
  };
}

const mapStateToProps = state => ({
  game: state.game || {},
  rooms: state.rooms || {},
  member: state.member || {},
  leaderboard: state.leaderboard || {},
  tournaments: state.tournaments || {},
  users: state.users || {},
  userSettings: state.userSettings || {},
  state: state.state || {}
});

const mapDispatchToProps = {
  fetchFreeRooms: getRooms,
  fetchMyRooms: getMyRooms,
  createNewRoom: createRoom,
  connectToRoom: joinRoom,
  fetchUserData: getUserData,
  spinWheel: spinBonusWheel,
  claimSpin: claimSpinResults,
  checkLogin: checkLoginState,
  fetchLeaderboard: getLeaderboard,
  fetchLeaderboardYear: getLeaderboardYear,
  fetchLeaderboardMonth: getLeaderboardMonth,
  fetchLeaderboardWeek: getLeaderboardWeek,
  fetchLeaderboardDaily: getLeaderboardDaily,
  fetchPositionInLeaderboard: getPositionInLeaderboard,
  fetchPositionInLeaderboardYear: getPositionInLeaderboardYear,
  fetchPositionInLeaderboardMonth: getPositionInLeaderboardMonth,
  fetchPositionInLeaderboardWeek: getPositionInLeaderboardWeek,
  fetchPositionInLeaderboardDaily: getPositionInLeaderboardDaily,
  SendMoneyToFriend: sendMoney,
  fetchTournaments: getTournaments,
  fetchTournamentPlayers: getTournamentPlayers,
  fetchMyTournamentData: getMyTournamentData,
  fetchMyTournamentsData: getMyTournamentsData,
  joinATournament: joinTournament,
  joinATournamentRoom: joinTournamentRoom,
  resetStore: resetTournamentStore,
  fetchTournamentRooms: getTournamentRooms,
  fetchTournamentsHistory: getTournamentsHistory,
  fetchTournamentHistory: getTournamentHistory,
  submitErr: submitError,
  fetchPlayers: getPlayers,
  fetchUserCount: getUserCount,
  fetchRoomsCount: getRoomsCount,
  buyTourMoney: buyTournamentMoneyMenu,
  cancelWaitRoom: cancelTournamentWaitRoom,
  exitTournament: leaveTournament,
  getOffset: getTimeOffset,
  initFBPay: initFBPayment,
  initDraugiemPay: initDraugiemPayment,
  fbPaymentCall: fbPaymentCallback,
  disableTut: disableTutorial,
  disableFirstTime: disableFirstTimeNotif,
  sendSupportMsg: sendSupportMessage,
  setSupportRead: setSupportAsRead,
  readSupport: readSupportChat,
  readSupportStat: readSupportStatus,
  fetchBannedUsers: getBannedUsers,
  fetchBannedUsersCount: getBannedUsersCount,
  fetchBalanceHistory: getBalanceHistory,
  //  fetchOnlineUsers: getOnlineUsers,
  //  fetchOnlineUsersLazy: getOnlineUsersLazy,
  //  resetOnlineUsersLazy: resetGetOnlineUsersLazy,
  fetchFBFriends: getFBFriends,
  setOnlineState: updateOnlineState,
  fetchIgnoredPlayers: getIgnoredPlayers,
  unIgnoreUser: unBlockUser,
  fetchAchievements: getAchievements,
  leaveRoom: leaveRoomMenu,
  toggleNewGameParameter: toggleNewGameParam,
  setNewBet: setNewGameBet,
  resetRooms: resetRoomsList,
  cancelRoomListeners: cancelRoomsListeners,
  updateLastLogin: updateUserLastLogin,
  closeLevelUpNotification: closeLevelNotification,
  setCheckedVersion: setCheckedVersion,
  logout: logout,
  setLoading: setLoading,
  initStripePayment: initStripePayment,
};

const Container = connect(mapStateToProps, mapDispatchToProps)(Menu);

export default Container;
