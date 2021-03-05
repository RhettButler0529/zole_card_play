import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Firebase } from '../../lib/firebase';

import { PageView, initGA } from '../../web/components/Tracking';

import {
  getCards,
  playCard,
  getCurrentTable,
  getGameSettings,
  getGlobalParams,
  selectGameType,
  getPlayers,
  getPlayerPosition,
  getCurrentTurn,
  getLargePlayer,
  getCurrentType,
  getNextTimeStamp,
  setLastRound,
  quitRound,
  resetGameStore,
  closeResultNotification,
  getCardPlayed,
  getPreviousRound,
} from '../../actions/game';

import {
  submitError,
  getTimeOffset,
  sendSupportMessage,
  setSupportAsRead,
  readSupportChat,
  readSupportStatus,
  blockUser,
  unBlockUser,
  getUserData,
  updateUserLastLogin,
  closeLevelNotification,
  getUserDbStatus,
  removeActiveRoom,
} from '../../actions/member';

import {
  getMyTournamentData,
  buyTournamentMoney,
  getMyTournamentsData,
} from '../../actions/tournaments';

import {
  endRoom,
  endRoom2,
  leaveRoom,
  sendGift,
  getGifts,
  getRoomGifts,
} from '../../actions/room';

import {
  disableTimer,
  setNextDealCards,
  setUserBal,
  setUserTournamentBal,
} from '../../actions/admin';

import { setLoading } from '../../actions/state';

import buttonClickedSound from '../../sounds/click_feedback.flac';

class Zole extends Component {
  static propTypes = {
    Layout: PropTypes.shape().isRequired,
    game: PropTypes.shape().isRequired,
    gameSettings: PropTypes.shape(),
    member: PropTypes.shape().isRequired,
    history: PropTypes.shape(),
    match: PropTypes.shape({
      params: PropTypes.shape({
        id: PropTypes.string,
      }),
    }),
    state: PropTypes.shape({
      isLoading: PropTypes.bool,
    }),
    gifts: PropTypes.shape(),
    roomGifts: PropTypes.shape(),
    globalParams: PropTypes.shape({
      gameState: PropTypes.shape({}),
    }),
    fetchCards: PropTypes.func.isRequired,
    playACard: PropTypes.func.isRequired,
    lastRound: PropTypes.func.isRequired,
    fetchCurrentTable: PropTypes.func.isRequired,
    fetchGameSettings: PropTypes.func.isRequired,
    fetchGlobalParams: PropTypes.func.isRequired,
    fetchPlayers: PropTypes.func.isRequired,
    fetchPlayerPosition: PropTypes.func.isRequired,
    chooseGameType: PropTypes.func.isRequired,
    fetchCurrentTurn: PropTypes.func.isRequired,
    fetchLargePlayer: PropTypes.func.isRequired,
    fetchCurrentType: PropTypes.func.isRequired,
    fetchNextTimeStamp: PropTypes.func.isRequired,
    endThisRoom: PropTypes.func.isRequired,
    leaveThisRoom: PropTypes.func.isRequired,
    quitThisRound: PropTypes.func.isRequired,
    resetStore: PropTypes.func.isRequired,
    fetchMyTournamentData: PropTypes.func.isRequired,
    fetchMyTournamentsData: PropTypes.func.isRequired,
    closeResultNotif: PropTypes.func.isRequired,
    submitErr: PropTypes.func.isRequired,
    setChatMessageAsRead: PropTypes.func,
    readSupport: PropTypes.func.isRequired,
    sendSupportMsg: PropTypes.func.isRequired,
    readSupportStat: PropTypes.func.isRequired,
    setSupportRead: PropTypes.func.isRequired,
    getOffset: PropTypes.func.isRequired,
    showNotification: PropTypes.func.isRequired,
    buyMoney: PropTypes.func.isRequired,
    setNextDeal: PropTypes.func.isRequired,
    setMyUserBal: PropTypes.func.isRequired,
    setMyUserTournamentBal: PropTypes.func.isRequired,
    disableTime: PropTypes.func.isRequired,
    sendAGift: PropTypes.func.isRequired,
    fetchGifts: PropTypes.func.isRequired,
    fetchRoomGifts: PropTypes.func.isRequired,
    blockThisUser: PropTypes.func.isRequired,
    unBlockThisUser: PropTypes.func.isRequired,
    fetchUserData: PropTypes.func.isRequired,
    updateLastLogin: PropTypes.func.isRequired,
  //  fetchCardPlayed: PropTypes.func.isRequired,
    closeLevelUpNotification: PropTypes.func.isRequired,
    removeCurActiveRoom: PropTypes.func.isRequired,
    setLoading: PropTypes.func.isRequired,
  };

  static defaultProps = {
    match: null,
    gameSettings: {},
    history: {},
    gifts: {},
    roomGifts: {},
    globalParams: {},
  };

  constructor(props) {
    super(props);
    this.state = {
      error: null,
      roomId: '',
      loading: true,
      playersLoading: true,
      uid: '',
      roomClosing: false,
      closeReason: null,
      closeErrorSubmit: false,
      cardPlayed: false,
      quitRoundPressed: false,
      errorNotification: null,
      showEndResultModal: false,
    };

    this.leaveRoom = this.leaveRoom.bind(this);
    this.closeResultNotif = this.closeResultNotif.bind(this);
    this.resetCloseErrorSubmit = this.resetCloseErrorSubmit.bind(this);

    this.buttonClickedAudio = new Audio(buttonClickedSound);
  }

  componentWillMount = () => {
    const {
      match,
      getOffset,
      fetchUserData,
      //  fetchCardPlayed,
      fetchPlayerPosition,
      fetchLargePlayer,
      fetchCurrentTable,
      fetchCurrentTurn,
      fetchCurrentType,
      fetchGlobalParams,
      fetchNextTimeStamp,
      fetchUserDbStatus,
      resetStore,
      game,
    } = this.props;

    getOffset();
    fetchUserDbStatus();

    const unsubscribe = Firebase.auth().onAuthStateChanged(user => {
      console.log('Zole user');
      console.log(user);
      if (user) {
        const roomId =
          match && match.params && match.params.id ? match.params.id : null;

        console.log(roomId);

        fetchUserData();
        this.fetchGameSettings();

        if (roomId) {
          let lastRoom = null;
          if (game) {
            lastRoom = game.lastRoom;
          }

          console.log(lastRoom);

          resetStore(lastRoom, roomId).then(() => {
            console.log('resetStore then');
            fetchCurrentTable(roomId);
            fetchCurrentTurn(roomId);
            fetchCurrentType(roomId);
            fetchGlobalParams(roomId);
            fetchNextTimeStamp(roomId);

            this.fetchPlayers(roomId);

            //  fetchCardPlayed(roomId);
            fetchLargePlayer(roomId);

            fetchPlayerPosition(roomId);

            this.fetchCards(roomId);
            this.fetchGifts();
            this.fetchRoomGifts(roomId);

            this.readSupportChat();
            this.readSupportStatus();
            this.fetchMyTournamentsData();

            this.setState({ roomId, uid: user.uid });
          //  unsubscribe();
          }).catch((err) => {
            console.log('resetStore err');
            console.log(err);

            fetchCurrentTable(roomId);
            fetchCurrentTurn(roomId);
            fetchCurrentType(roomId);
            fetchGlobalParams(roomId);
            fetchNextTimeStamp(roomId);

            this.fetchPlayers(roomId);

            //  fetchCardPlayed(roomId);
            fetchLargePlayer(roomId);

            fetchPlayerPosition(roomId);

            this.fetchCards(roomId);
            this.fetchGifts();
            this.fetchRoomGifts(roomId);

            this.readSupportChat();
            this.readSupportStatus();
            this.fetchMyTournamentsData();

            this.setState({ roomId, uid: user.uid });
          //  unsubscribe();
          })
        }
      }
    });
  };

  componentDidMount() {
  //  initGA('UA-147571548-1');
    PageView();
  }

  componentWillUnmount() {
  //  const { resetStore } = this.props;
  //  const { roomId } = this.state;

  //  resetStore(roomId);
//  console.log('unsubscribe');
  //  this.unsubscribe();
  }

  refetchData = () => {
    console.log('refetchData');
    const {
      fetchUserData,
      fetchPlayerPosition,
      fetchLargePlayer,
      fetchCurrentTable,
      fetchCurrentTurn,
      fetchCurrentType,
      fetchGlobalParams,
      fetchNextTimeStamp,
      fetchUserDbStatus,
    } = this.props;

    const { roomId } = this.state;

    console.log(roomId);

    if (roomId) {
      Firebase.auth().currentUser.getIdToken().then(() => {
      //  fetchUserData();

        fetchCurrentTable(roomId);
        fetchCurrentTurn(roomId);
        fetchCurrentType(roomId);
        fetchGlobalParams(roomId);
        fetchNextTimeStamp(roomId);

      //  this.fetchPlayers(roomId);

        //  fetchCardPlayed(roomId);
        fetchLargePlayer(roomId);

      //  fetchPlayerPosition(roomId);

        this.fetchCards(roomId);
      //  this.fetchGifts();
      //  this.fetchRoomGifts(roomId);

      //  this.readSupportChat();
      //  this.readSupportStatus();
      //  this.fetchMyTournamentsData();
      })
    }
  }

  fetchCards = roomId => {
    const { fetchCards } = this.props;

    return fetchCards(roomId).catch(err =>
      this.setState({
        loading: false,
        error: err,
      })
    );
  };

  fetchGifts = () => {
    const { fetchGifts } = this.props;

    return fetchGifts();
  };

  fetchRoomGifts = roomId => {
    const { fetchRoomGifts } = this.props;

    return fetchRoomGifts(roomId);
  };

  fetchMyTournamentsData = () => {
    const { fetchMyTournamentsData } = this.props;

    return fetchMyTournamentsData().catch(err =>
      this.setState({
        loading: false,
        error: err,
      })
    );
  };

  fetchGameSettings = () => {
    const { fetchGameSettings } = this.props;

    return fetchGameSettings();
  };

  /*
  setChatAsRead = () => {
    const { setChatMessageAsRead } = this.props;
    const { roomId } = this.state;

    return setChatMessageAsRead(roomId)
      .then(res => res.status)
      .catch(err => console.log(err));
  } */

  endThisRoom = () => {
  //  console.log('endThisRoom');
    const { endThisRoom, game, member } = this.props;

    const { roomId } = this.state;
    const { globalParams, nextTimeStamp } = game;

    if (
      globalParams &&
      !globalParams.roomClosed
    //  nextTimeStamp < Date.now() + member.offset + 800
    ) {
      return endThisRoom(roomId).then(res => {
      //  console.log('endThisRoom');
      //  console.log(res);

        if (res && res === 'refetch') {
          this.refetchData();
        }

      }).catch(err => {
        console.log(err);

        this.setState({
          loading: false,
          error: err,
        })
      });
    }
    return null;
  };

  fetchPlayers = roomId => {
    const { fetchPlayers } = this.props;

    return fetchPlayers(roomId)
      .then(() => {
        this.setState({ playersLoading: false });
      })
      .catch(err =>
        this.setState({
          loading: false,
          playersLoading: false,
          error: err,
        })
      );
  };

  playCard = ({ selectedCard, init, myPos }) => {
    const { playACard, game } = this.props;
    const { roomId, cardPlayed } = this.state;

    const { globalParams } = game;
    if (!cardPlayed) {
      if (globalParams && globalParams.gameState !== 'burry') {
        this.setState({ cardPlayed: true });
      }

      return playACard(selectedCard, roomId, init, myPos, globalParams.gameState)
        .then(() => {
          this.setState({ cardPlayed: false });
        })
        .catch((err) => {
          this.setState({
            loading: false,
            error: err,
            cardPlayed: false
          });
        });
    }

    setTimeout(() => {
      this.setState({ cardPlayed: false });
    }, 400);
  };

  chooseGameType = (selectedType, init) => {
    const { chooseGameType } = this.props;
    const { roomId } = this.state;

    return chooseGameType(selectedType, roomId, init).catch(err =>
      this.setState({
        loading: false,
        error: err,
      })
    );
  };

  setLastRound = init => {
    const { lastRound } = this.props;
    const { roomId } = this.state;

    return lastRound(roomId, init).catch(err =>
      this.setState({
        loading: false,
        error: err,
      })
    );
  };

  quitRound = init => {
    const { quitThisRound } = this.props;
    const { roomId } = this.state;

    this.setState({ quitRoundPressed: false });

    return quitThisRound(roomId, init)
      .then(res => {
        if (res.data.status === 'success') {
          this.setState({ quitRoundPressed: true });
        } else {
          this.setState({ quitRoundPressed: false });
        }
      })
      .catch(err =>
        this.setState({
          loading: false,
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

  sendGift = (roomId, giftId, comment, players) => {
    const { sendAGift } = this.props;

    return new Promise(resolve => {
      sendAGift(roomId, giftId, comment, players)
        .then(res => {
          if (res.data && res.data.data && res.data.data.status === 'success') {
            resolve('success');
          } else if (
            res.data &&
            res.data.data &&
            res.data.data.status === 'error'
          ) {
            resolve('error');
            this.setState({ errorNotification: res.data.data.message });
            //  showNotification('Neizdevās nosūtīt dāvanu', res.data.data.message, 'danger');
          }
        })
        .catch(err =>
          this.setState({
            error: err,
          })
        );
    });
  };

  resetCloseErrorSubmit = () => {
    this.setState({ closeErrorSubmit: false });
    return '';
  };

  buyMoney = init => {
    const { buyMoney } = this.props;
    const { roomId } = this.state;

    return buyMoney(roomId, init).catch(err => {
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

  fetchPreviousRound = () => {
    const { fetchPreviousRound } = this.props;
    const { roomId } = this.state;

    return fetchPreviousRound(roomId).catch(err => {
      console.log(err);
    });
  };

  resetErrorNotification = () => {
    this.setState({ errorNotification: '' });
  };

  leaveRoom() {
    const {
      history,
      leaveThisRoom,
      fetchMyTournamentData,
      game,
      updateLastLogin,
      removeCurActiveRoom,
    } = this.props;
    const { roomId } = this.state;

    if (game) {
      const { globalParams } = game;

      if (!globalParams.roomClosed) {
        leaveThisRoom(roomId).then(res => {
          if (res.data.status === 'success') {
            if (res.data.tournamentId) {
              fetchMyTournamentData(res.data.tournamentId)
                .then(() => {
                  setTimeout(() => {
                    updateLastLogin();
                    removeCurActiveRoom().then(() => {
                      history.push('/');
                    })
                  }, 250);
                })
                .catch(err =>
                  this.setState({
                    error: err,
                  })
                );
            } else {
              setTimeout(() => {
                updateLastLogin();
                removeCurActiveRoom().then(() => {
                  history.push('/');
                })
              }, 250);
            }
          } else if (
            res.data.status === 'error' &&
            res.data.message === 'notInRoom'
          ) {
            updateLastLogin();
            removeCurActiveRoom().then(() => {
              history.push('/');
            })
          }

          return null;
        });
      } else {
        setTimeout(() => {
          updateLastLogin();
          removeCurActiveRoom().then(() => {
            history.push('/');
          })
        }, 250);
      }
    }
  }

/*  resetStore() {
    const { resetStore } = this.props;
    const { roomId } = this.state;

    resetStore(roomId);
  } */

  closeResultNotif(init) {
    const { closeResultNotif } = this.props;
    const { roomId } = this.state;

    return closeResultNotif(roomId, init)
      .then(() => {
        this.setState({ quitRoundPressed: false });
      })
      .catch(err => console.log(err));
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
      game,
      gameSettings,
      member,
      history,
      showNotification,
      gifts,
      roomGifts,
      setNextDeal,
      setMyUserBal,
      setMyUserTournamentBal,
      disableTime,
      sendAGift,
      blockThisUser,
      unBlockThisUser,
      resetStore,
      updateLastLogin,
      closeLevelUpNotification,
      userSettings,
      setLoading,
      state
    } = this.props;

    const {
      loading,
      error,
      roomId,
      uid,
      playersLoading,
      roomClosing,
      closeReason,
      closeErrorSubmit,
      quitRoundPressed,
      errorNotification,
      showEndResultModal,
    } = this.state;


    if (game && roomId) {
      const { globalParams, players } = game;

      if (
        !playersLoading &&
        member &&
        member.uid &&
        players &&
        players.playerList &&
        !players.playerList[member.uid]
      ) {
        updateLastLogin();
          console.log('push to menu');
          console.log(member);
          console.log(globalParams);
          console.log(players);
        history.push('/');
      }

      if (
        !roomClosing &&
        globalParams &&
        roomId &&
        roomId === globalParams.roomId &&
        globalParams.closeReason &&
        globalParams.roomClosed &&
        players &&
        players.player1 &&
        players.player2 &&
        players.player3
      ) {
        this.setState({
          roomClosing: true,
          closeReason: globalParams.closeReason,
        });

        setTimeout(() => {
        //  this.leaveRoom();

          this.setState({
            closeReason: null,
            showEndResultModal: true,
          });
        }, 7000);
      }

      if(state.isLoading){
        setLoading(false);
      }

      const roomProps = {
        member: {
          ...member,
          supportChat: null,
          supportChatStatus: null,
        },
        supportChat: member.supportChat,
        supportChatStatus: member.supportChatStatus,
        user: uid,
        roomId,
        error,
        loading,
        ...game,
        closeReason,
        showEndResultModal,
        closeErrorSubmit,
        showNotification,
        quitRoundPressed,
        errorNotification,
        resetStore,
        gameSettings,
        gifts,
        roomGifts,
        refetchRoomData: this.refetchData,
        playCard: this.playCard,
        chooseGameType: this.chooseGameType,
        endRoom: this.endThisRoom,
        setLastRound: this.setLastRound,
        leaveRoom: this.leaveRoom,
        quitRound: this.quitRound,
        closeResultNotif: this.closeResultNotif,
        resetCloseErrorSubmit: this.resetCloseErrorSubmit,
        buyMoney: this.buyMoney,
        sendSupportMessage: this.sendSupportMessage,
        setSupportAsRead: this.setSupportAsRead,
        resetErrorNotification: this.resetErrorNotification,
        setNextDealCards: setNextDeal,
        closeLevelNotification: closeLevelUpNotification,
        setUserBal: setMyUserBal,
        setUserTournamentBal: setMyUserTournamentBal,
        disableTimer: disableTime,
        sendGift: this.sendGift,
        //  setEmotion: this.setEmotion,
        blockUser: blockThisUser,
        unBlockUser: unBlockThisUser,
        fetchPreviousRound: this.fetchPreviousRound,
        userSettings: userSettings[uid] || userSettings.default || {},
        playButtonSound: this.playButtonSound,
      };

      return <Layout {...roomProps} />;
    }

    return (
      <Layout
        member={{
          ...member,
          supportChat: null,
          supportChatStatus: null,
        }}
        supportChat={member.supportChat}
        supportChatStatus={member.supportChatStatus}
        user={uid}
        roomId={roomId}
        error={error}
        loading={loading}
        closeReason={closeReason}
        closeErrorSubmit={closeErrorSubmit}
        showNotification={showNotification}
        quitRoundPressed={quitRoundPressed}
        gifts={gifts}
        roomGifts={roomGifts}
        gameSettings={gameSettings}
        refetchRoomData={this.refetchData}
        playCard={this.playCard}
        chooseGameType={this.chooseGameType}
        endRoom={this.endThisRoom}
        setLastRound={this.setLastRound}
        leaveRoom={this.leaveRoom}
        quitRound={this.quitRound}
        resetStore={resetStore}
        closeResultNotif={this.closeResultNotif}
        resetCloseErrorSubmit={this.resetCloseErrorSubmit}
        buyMoney={this.buyMoney}
        sendSupportMessage={this.sendSupportMessage}
        setSupportAsRead={this.setSupportAsRead}
        setNextDealCards={setNextDeal}
        closeLevelNotification={closeLevelUpNotification}
        setUserBal={setMyUserBal}
        setUserTournamentBal={setMyUserTournamentBal}
        disableTimer={disableTime}
        sendGift={sendAGift}
        blockUser={blockThisUser}
        unBlockUser={unBlockThisUser}
        userSettings={userSettings[uid] || userSettings.default || {}}
        playButtonSound={this.playButtonSound}
      />
    );
  };
}

const mapStateToProps = (state, ownProps) => {
  const { match } = ownProps;

  const roomId =
    match && match.params && match.params.id ? match.params.id : null;

  return {
    game: state.game || {},
    gameSettings: state.game.gameSettings || {},
    member: state.member || {},
    gifts: state.rooms.gifts || {},
    roomGifts: state.rooms.roomGifts ? state.rooms.roomGifts[roomId] : {},
    userSettings: state.userSettings || {},
    state: state.state || {}
  };
};

const mapDispatchToProps = {
  fetchCards: getCards,
  playACard: playCard,
  fetchCurrentTable: getCurrentTable,
  fetchGameSettings: getGameSettings,
  fetchGlobalParams: getGlobalParams,
  chooseGameType: selectGameType,
  fetchPlayers: getPlayers,
  fetchPlayerPosition: getPlayerPosition,
  fetchCurrentTurn: getCurrentTurn,
  fetchLargePlayer: getLargePlayer,
  fetchCurrentType: getCurrentType,
  fetchNextTimeStamp: getNextTimeStamp,
  endThisRoom: endRoom2,
  leaveThisRoom: leaveRoom,
  lastRound: setLastRound,
  quitThisRound: quitRound,
  resetStore: resetGameStore,
  fetchMyTournamentData: getMyTournamentData,
  fetchMyTournamentsData: getMyTournamentsData,
  closeResultNotif: closeResultNotification,
  submitErr: submitError,
  buyMoney: buyTournamentMoney,
  getOffset: getTimeOffset,
  sendSupportMsg: sendSupportMessage,
  setSupportRead: setSupportAsRead,
  readSupport: readSupportChat,
  readSupportStat: readSupportStatus,
  disableTime: disableTimer,
  setNextDeal: setNextDealCards,
  setMyUserBal: setUserBal,
  setMyUserTournamentBal: setUserTournamentBal,
  sendAGift: sendGift,
  fetchGifts: getGifts,
  fetchRoomGifts: getRoomGifts,
  blockThisUser: blockUser,
  unBlockThisUser: unBlockUser,
  fetchUserData: getUserData,
  updateLastLogin: updateUserLastLogin,
//  fetchCardPlayed: getCardPlayed,
  closeLevelUpNotification: closeLevelNotification,
  fetchUserDbStatus: getUserDbStatus,
  fetchPreviousRound: getPreviousRound,
  removeCurActiveRoom: removeActiveRoom,
  setLoading: setLoading,
};

export default connect(mapStateToProps, mapDispatchToProps)(Zole);
