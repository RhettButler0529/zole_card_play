import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
/* import {
  Row,
  Button,
  Input,
  Media,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from 'reactstrap'; */

import ReactGA from "react-ga";

import Row from 'reactstrap/lib/Row';
import Button from 'reactstrap/lib/Button';
import Input from 'reactstrap/lib/Input';
import Media from 'reactstrap/lib/Media';
import Modal from 'reactstrap/lib/Modal';
import ModalHeader from 'reactstrap/lib/ModalHeader';
import ModalBody from 'reactstrap/lib/ModalBody';
import ModalFooter from 'reactstrap/lib/ModalFooter';
import { gsap } from 'gsap';
import isEqual from 'react-fast-compare';

import { withTranslation } from 'react-i18next';

// import pro from '../../../images/icons/pro.svg';
// import fast from '../../../images/icons/aatraa_istaba.svg';

import closeImg from '../../../images/icons/close.png';
import tabulaColapse from '../../../images/Game/tabula_colapse.svg';
import tabulaColapsed from '../../../images/Game/tabula_colapsed.svg';

import Notification from '../Notification';
import ContactSupport from '../ContactSupport';
import Chat from '../../../containers/Game/Chat';
import SendGift from './SendGift';
import Players from './Players';
import ScoreTable from '../../../containers/Game/ScoreTable';
import GameStats from './GameStats';
import PlayerCards from './PlayerCards';
import CardsOnTable from './CardsOnTable';
import PreviousRound from './PreviousRound';
import EndResultModal from './EndResultModal';

import StaticElements from './StaticElements';

import LastRoundModal from './Modals/LastRound';
import BlockUserModal from './Modals/BlockUser';

class Zole extends Component {
  static propTypes = {
    cards: PropTypes.arrayOf(PropTypes.string),
    currentTable: PropTypes.arrayOf(PropTypes.shape()),
    globalParams: PropTypes.shape(),
    players: PropTypes.shape(),
    nextTimeStamp: PropTypes.number,
    points: PropTypes.shape(),
    //  totalPoints: PropTypes.shape(),
    member: PropTypes.shape(),
    //  roomChats: PropTypes.shape(),
    gameSettings: PropTypes.shape(),
    gifts: PropTypes.shape(),
    roomGifts: PropTypes.shape(),
    emotions: PropTypes.shape(),
    supportChat: PropTypes.shape(),
    supportChatStatus: PropTypes.shape(),
    previousRound: PropTypes.shape(),
    errorNotification: PropTypes.string,
    closeReason: PropTypes.shape(),
    showEndResultModal: PropTypes.bool,
    user: PropTypes.string,
    largePlayer: PropTypes.string,
    myPos: PropTypes.string,
    cardPlayed: PropTypes.string,
    currentTurn: PropTypes.string,
    currentType: PropTypes.string,
    //  submitError: PropTypes.func.isRequired,
    chooseGameType: PropTypes.func.isRequired,
    playCard: PropTypes.func.isRequired,
    endRoom: PropTypes.func.isRequired,
    roomId: PropTypes.string.isRequired,
    t: PropTypes.func.isRequired,
    setLastRound: PropTypes.func.isRequired,
    leaveRoom: PropTypes.func.isRequired,
    quitRound: PropTypes.func.isRequired,
    closeResultNotif: PropTypes.func.isRequired,
    resetCloseErrorSubmit: PropTypes.func.isRequired,
    showNotification: PropTypes.func.isRequired,
    buyMoney: PropTypes.func.isRequired,
    //  sendChatMessage: PropTypes.func.isRequired,
    //  setChatAsRead: PropTypes.func.isRequired,
    sendSupportMessage: PropTypes.func.isRequired,
    setSupportAsRead: PropTypes.func.isRequired,
    closeErrorSubmit: PropTypes.bool,
    quitRoundPressed: PropTypes.bool,
    setNextDealCards: PropTypes.func.isRequired,
    disableTimer: PropTypes.func.isRequired,
    sendGift: PropTypes.func.isRequired,
    //  setEmotion: PropTypes.func.isRequired,
    setUserBal: PropTypes.func.isRequired,
    setUserTournamentBal: PropTypes.func.isRequired,
    blockUser: PropTypes.func.isRequired,
    unBlockUser: PropTypes.func.isRequired,
    resetErrorNotification: PropTypes.func,
    resetStore: PropTypes.func.isRequired,
    closeLevelNotification: PropTypes.func.isRequired,
    playButtonSound: PropTypes.func.isRequired,
    error: PropTypes.string,
    userSettings: PropTypes.shape().isRequired,
    refetchRoomData: PropTypes.func.isRequired,
  }

  static defaultProps = {
    user: '',
    largePlayer: null,
    myPos: null,
    cardPlayed: null,
    errorNotification: '',
    closeReason: {},
    players: {},
    cards: [],
    currentTable: [],
    points: {},
    //  totalPoints: {},
    member: {},
    nextTimeStamp: 0,
    currentTurn: '',
    currentType: '',
    globalParams: {},
    //  roomChats: {},
    gameSettings: {},
    closeErrorSubmit: false,
    quitRoundPressed: false,
    gifts: {},
    roomGifts: {},
    //  emotions: {},
    supportChat: {},
    supportChatStatus: {},
    previousRound: {},
    showEndResultModal: false,
  };

  constructor(props) {
    super(props);
    this.state = {
      openModal: false,
      modalType: '',
      notificationPlayer: '',
      openChat: true,
      supportModalOpen: false,
      lastRoundModal: false,
      testingModal: false,
      giftsModal: false,
      blockUserModal: false,
      blockUserSelectedUid: '',
      blockUserSelectedName: '',
      adminError: '',
      newBal: '',
      initialSelected: '',
      scoreTableOpen: true,
      cards: [],
      selectedCard: null,
      tableIsInProgress: false,
      cardPlayClicked: false,
    };

    this.chooseType = this.chooseType.bind(this);
    this.openModal = this.openModal.bind(this);
    this.closeModal = this.closeModal.bind(this);
    this.closeResultModal = this.closeResultModal.bind(this);
    this.endRoom = this.endRoom.bind(this);
    this.leaveRoom = this.leaveRoom.bind(this);
    this.exitRoomNotification = this.exitRoomNotification.bind(this);
    this.lastRound = this.lastRound.bind(this);
    this.playCard = this.playCard.bind(this);
    this.removeSelectedCard = this.removeSelectedCard.bind(this);
    this.tableInProgress = this.tableInProgress.bind(this);
    this.gameTypeHolderRef = React.createRef();
  }

  componentDidMount() {
    const {
      globalParams,
      member,
      closeReason,
      currentType,
      cards
    } = this.props;

    const { modalType } = this.state;

  //  ReactGA.initialize('UA-147571548-1');
  //  ReactGA.pageview(window.location.pathname + window.location.search);

    if (closeReason && Object.keys(closeReason).length !== 0) {
      if (closeReason.reason) {
        this.setState({
          openModal: true,
          modalType: closeReason.reason,
          notificationPlayer: closeReason.playerName || '',
        });
      }
    } else {
      if (globalParams) {
        const { gameResult } = globalParams;
        const { gameResultModalShown } = this.state;
        if (gameResult && !gameResultModalShown) {
          this.setState({
            openGameResultModal: true,
            gameResultModalShown: true,
          });
        } else if (modalType === 'gameResult' && !gameResult) {
          this.setState({
            openGameResultModal: false,
            gameResultModalShown: false,
          });
        }
      }

      if (member.bal <= 0) {
        //  this.setState({
        //    openModal: true,
        //    modalType: 'noBalance',
        //  });
      } else if (modalType === 'noBalance' && member.bal > 0) {
        this.setState({
          openModal: false,
          modalType: '',
        });
      }

      if (member.level < 10 && globalParams && globalParams.proRoom) {
        this.setState({
          openModal: true,
          modalType: 'proRoom',
        });
      } else if (modalType === 'proRoom' && member.level >= 10) {
        this.setState({
          openModal: false,
          modalType: '',
        });
      }
    }

    if (currentType) {
      this.animateGameTypeFromCenter();
    }

    if(cards){
      this.setState({ cards: cards });
    }
  }

  tableInProgress(val){
    this.setState({tableIsInProgress: val});
  }

  animateGameTypeFromCenter() {
    /*var startPos = {
      left : window.innerWidth / 2,
      top : window.innerHeight / 2 - 300/2
    };*/

    //var endPos = this.gameTypeHolderRef.current.getBoundingClientRect();

    gsap.to(this.gameTypeHolderRef.current, {/*scale: 0.3, x: startPos.left-endPos.left, y: startPos.top-endPos.top*/x:0, y: -100, duration: 0});
    gsap.to(this.gameTypeHolderRef.current, {x: 0, y: 0, scale: 1, duration: 1.5}, { ease: 'elastic'});
  }

  componentWillReceiveProps(nextProps) {
    const { globalParams, players, closeReason, quitRoundPressed } = nextProps;

    const newMember = nextProps.member;

    const { modalType, openModal } = this.state;

    if (closeReason && Object.keys(closeReason).length !== 0) {
      if (closeReason.reason) {
        if (
          closeReason.reason === 'leftRoom' &&
          closeReason.playerUid &&
          newMember.uid &&
          closeReason.playerUid.toString() === newMember.uid.toString()
        ) {
          // dont show notification to player if he left the room
        } else if (closeReason.reason === 'lastRound') {
          // show notification for last round with delay to show results

        //  setTimeout(() => {
        //    this.setState({
        //      openModal: true,
        //      modalType: closeReason.reason,
        //      notificationPlayer: closeReason.playerName,
        //    });
        //  }, 2500);
        } else {
          this.setState({
            openModal: true,
            modalType: closeReason.reason,
            notificationPlayer: closeReason.playerName || '',
          });
        }
      }
    } else {
      if (globalParams) {
        const { gameResult } = globalParams;
        const { gameResultModalShown } = this.state;

        if (gameResult && !gameResultModalShown) {
          this.setState({
            openGameResultModal: true,
            gameResultModalShown: true,
          });

          //  setTimeout(() => {
          //    this.closeResultModal();
          //  }, 15000);
        } else if (!gameResult) {
          this.setState({
            openGameResultModal: false,
            gameResultModalShown: false,
          });
        }
      }

      if (!quitRoundPressed) {
        this.setState({ quitRound: false });
      }

      if (
        globalParams &&
        globalParams.lowBalPlayers &&
        globalParams.gameState === 'lowBal' &&
        newMember.uid &&
        ((globalParams.lowBalPlayers.player1 &&
          players.playerList[newMember.uid.toString()] === 'player1') ||
          (globalParams.lowBalPlayers.player2 &&
            players.playerList[newMember.uid.toString()] === 'player2') ||
          (globalParams.lowBalPlayers.player3 &&
            players.playerList[newMember.uid.toString()] === 'player3'))
      ) {
        if (globalParams.tournamentRoom) {
          this.setState({
            openModal: true,
            modalType: 'lowBalanceTournament',
          });
        } else {
          //  this.setState({
          //    openModal: true,
          //    modalType: 'lowBalance',
          //  });
        }
      } else if (
        modalType === 'lowBalanceTournament' &&
        newMember.uid &&
        (globalParams.gameState !== 'lowBal' ||
          !globalParams.lowBalPlayers ||
          (globalParams.lowBalPlayers &&
            !globalParams.lowBalPlayers.player1 &&
            players.playerList[newMember.uid.toString()] === 'player1') ||
          (globalParams.lowBalPlayers &&
            !globalParams.lowBalPlayers.player2 &&
            players.playerList[newMember.uid.toString()] === 'player2') ||
          (globalParams.lowBalPlayers &&
            !globalParams.lowBalPlayers.player3 &&
            players.playerList[newMember.uid.toString()] === 'player3'))
      ) {
        this.setState({
          openModal: false,
          modalType: '',
        });
      } else if (newMember.bal <= 0) {
        //  this.setState({
        //    openModal: true,
        //    modalType: 'noBalance',
        //  });
      } else if (modalType === 'noBalance' && newMember.bal > 0) {
        this.setState({
          openModal: false,
          modalType: '',
        });
      }

      if (newMember.level < 10 && globalParams && globalParams.proRoom) {
        this.setState({
          openModal: true,
          modalType: 'proRoom',
        });
      } else if (modalType === 'proRoom' && newMember.level >= 10) {
        this.setState({
          openModal: false,
          modalType: '',
        });
      }

      if (newMember && newMember.lvlUpNotification) {
        this.setState({
          openModal: true,
          modalType: 'levelUp',
          newLevel: newMember.level,
        });
      }

      if (
        newMember &&
        !newMember.lvlUpNotification &&
        openModal &&
        modalType === 'levelUp'
      ) {
        this.UpdateModal(false, '');
      }
    }
  }

  // shouldComponentUpdate(nextProps, nextState) {

  //  const { tableIsInProgress } = nextState;

  //  if(tableIsInProgress && (nextProps.globalParams.gameState === 'results' || nextProps.globalParams.gameResult)){
  //    return false;
  //  }

  //  if (!isEqual(nextProps, this.props)) {
  //    return true;
  //  }

  //  if (!isEqual(nextState, this.state)) {
  //    return true;
  //  }

//    return true;
//  }

  componentDidUpdate(prevProps) {
    const { points, errorNotification, currentType, cards, error, globalParams } = this.props;
    const { openModal, modalType, selectedCard, cards: stateCards } = this.state;
    const oldPoints = prevProps.points;
    const oldCurrentType = prevProps.currentType;

    if (
      points &&
      oldPoints &&
      Object.keys(points).length !== Object.keys(oldPoints).length
    ) {
    //  this.scrollToBottom();
    }

    if (errorNotification) {
      if (errorNotification === 'low balance') {
        if (!(openModal && modalType === 'lowBalanceGift')) {
          this.UpdateModal(true, 'lowBalanceGift');
        }
        //  } else if (errorNotification === 'pro room') {
        //    if (!(openModal && modalType === 'proRoomMenu')) {
        //      this.UpdateModal(true, 'proRoomMenu');
        //    }
      }
    }

    if (oldCurrentType != currentType) {
      this.animateGameTypeFromCenter();
    }

    if(!selectedCard && !isEqual(stateCards, cards)) {
      this.setState({ cards: cards });
    } else if(!isEqual(stateCards, cards) && (error || (globalParams && globalParams.gameResult))) {
      this.setState({ cards: cards, selectedCard: null });
    }

  }

  componentWillUnmount() {
    clearTimeout(this.timeoutID);
  }

  removeSelectedCard(){
    const { cards, globalParams } = this.props;
    this.setState({ cards: cards, selectedCard: null });
  }

  componentWillUnmount() {
    const { resetStore, roomId, lastRoom } = this.props;

  //  resetStore(lastRoom, roomId);
  }

  UpdateModal = (openModal, modalType) => {
    const { resetErrorNotification } = this.props;
    resetErrorNotification();
    this.setState({
      openModal,
      modalType,
    });
  };

  scrollToBottom = () => {
    if (this.pointsScrollbar) {
      this.timeoutID = setTimeout(() => {
        if (this.pointsScrollbar) {
          this.pointsScrollbar.scrollBottom();
        }
      }, 200);
    }
  };

  handleChange = event => {
    const value =
      event.target.type === 'checkbox'
        ? event.target.checked
        : event.target.value;

    this.setState({
      [event.target.name]: value,
    });
  };

  setNextDealCards = () => {
    const { roomId, setNextDealCards } = this.props;
    const { nextDealCards1, nextDealCards2, nextDealCards3 } = this.state;
    const strippedCards1 = nextDealCards1.replace(' ', '');
    const strippedCards2 = nextDealCards2.replace(' ', '');
    const strippedCards3 = nextDealCards3.replace(' ', '');

    const cardsSplit1 = strippedCards1.split(',');
    const cardsSplit2 = strippedCards2.split(',');
    const cardsSplit3 = strippedCards3.split(',');

    if (
      cardsSplit1 &&
      cardsSplit2 &&
      cardsSplit3 &&
      cardsSplit1.length === 8 &&
      cardsSplit2.length === 8 &&
      cardsSplit3.length === 8
    ) {
      const newCards = cardsSplit1.concat(cardsSplit2, cardsSplit3);

      setNextDealCards(roomId, newCards);
      this.setState({ adminError: '' });
    } else {
      this.setState({ adminError: 'Katram spēlētājam vajag 8 kārtis' });
    }
  };

  setUserBal = () => {
    const {
      setUserBal,
      players,
      member,
      roomId,
      setUserTournamentBal,
      globalParams,
    } = this.props;

    const { tournamentRoom, tournamentId } = globalParams;

    const { newBal } = this.state;

    const { uid } = member;
    const { playerList } = players;

    const playerPos = playerList[uid];

    if (playerPos && uid && newBal && roomId) {
      if (tournamentRoom && tournamentId) {
        setUserTournamentBal(roomId, tournamentId, uid, playerPos, newBal);
      } else {
        setUserBal(roomId, uid, playerPos, newBal);
      }
    }
  };

  toggleScoreTable = () => {
    const { playButtonSound } = this.props;
    const { scoreTableOpen } = this.state;

    if (!scoreTableOpen) {
    //  this.scrollToBottom();
    }

    playButtonSound();

    this.setState(prevState => ({
      scoreTableOpen: !prevState.scoreTableOpen,
    }));
  };

  toggleChat = () => {
    const { setChatAsRead, roomId, playButtonSound } = this.props;
    setChatAsRead(roomId);
    playButtonSound();

    this.setState(prevState => ({
      openChat: !prevState.openChat,
    }));
  };

  quitRound = () => {
    const { quitRound, playButtonSound } = this.props;

    quitRound(false);
    playButtonSound();
    this.setState({ quitRound: true });
  };

  chooseType = selectedType => {
    const { chooseGameType, playButtonSound } = this.props;
    this.setState({ chooseTypeClicked: true });

    chooseGameType({ selectedType }, false);
    playButtonSound();

    setTimeout(() => {
      this.setState({ chooseTypeClicked: false });
    }, 1000);
  };

  openModal = () => {
    this.setState({ openModal: true });
  };

  closeModal = () => {
    const { playButtonSound } = this.props;
    playButtonSound();

    this.setState({
      openModal: false,
      modalType: '',
    });
  };

  toggleSupport = () => {
    const { supportModalOpen } = this.state;
    const { setSupportAsRead, member, supportChatStatus, playButtonSound } = this.props;

    if (!supportModalOpen && supportChatStatus && !supportChatStatus.read) {
      setSupportAsRead();
    }

    playButtonSound();
    this.setState({ supportModalOpen: !supportModalOpen });
  };

    toggleLastRound = () => {
      const { globalParams, playButtonSound } = this.props;
      //  const { lastRoundModal } = this.state;
      if (globalParams) {
        const { lastRound } = globalParams;
        if (lastRound) {
        //  console.log('cannot toggle');
        } else {
          playButtonSound();
          this.setState(prevState => ({
            lastRoundModal: !prevState.lastRoundModal,
          }));
        }
      }
  };

  closeLastRound = () => {
    const { playButtonSound } = this.props;
    playButtonSound();

    this.setState({
      lastRoundModal: false,
    });
  };

  toggleBlockUser = (id, name) => {
    const { playButtonSound } = this.props;
    playButtonSound();

    this.setState(prevState => ({
      blockUserModal: !prevState.blockUserModal,
      blockUserSelectedUid: id,
      blockUserSelectedName: name,
    }));
  };

  blockUser = () => {
    const { blockUser, playButtonSound } = this.props;
    const { blockUserSelectedUid, blockUserSelectedName } = this.state;

    if (blockUserSelectedUid && blockUserSelectedName) {
      blockUser(blockUserSelectedUid, blockUserSelectedName);

      playButtonSound();

      this.setState({
        blockUserModal: false,
        blockUserSelectedUid: null,
        blockUserSelectedName: null,
      });
    }
  };

  toggleTestModal = () => {
    this.setState(prevState => ({
      testingModal: !prevState.testingModal,
      adminError: '',
    }));
  };

  toggleGiftsModal = (initialSelected, forceState) => {
    const { playButtonSound } = this.props;
    const { giftsModal } = this.state;
    if (!giftsModal) {
      playButtonSound();
    }

    this.setState(prevState => ({
      giftsModal: forceState !== undefined ? forceState : (!prevState.giftsModal),
      initialSelected,
    }));
  };

  closeResultModal() {
    const { closeResultNotif, globalParams, playButtonSound } = this.props;
    const { gameResultModalShown } = this.state;

    if (
      gameResultModalShown &&
      globalParams &&
      globalParams.gameState === 'results'
    ) {
      playButtonSound();
      closeResultNotif(false);
      this.setState({
        openGameResultModal: false,
        //  gameResultModalShown: false,
        quitRound: false,
      });
    }
  }

  endRoom() {
    const { endRoom, globalParams } = this.props;
    if (!globalParams.roomClosed) {
      endRoom();
    }
  }

  leaveRoom() {
    const { leaveRoom, resetStore, lastRoom, roomId } = this.props;

  //  console.log('lastRoom in leaveRoom');
  //  console.log(lastRoom);

    resetStore(lastRoom, roomId).then(() => {
      leaveRoom();
    });
  }

  exitRoomNotification() {
    const { players, leaveRoom, playButtonSound } = this.props;
    if (players && players.player1 && players.player2 && players.player3) {
      playButtonSound();

      this.setState({
        openModal: true,
        modalType: 'leaveRoom',
      });
    } else {
      leaveRoom();
    }
  }

  lastRound() {
    const { setLastRound, playButtonSound } = this.props;
    const { lastRoundClicked } = this.state;

    if (!lastRoundClicked) {
      this.setState({
        lastRoundModal: false,
        lastRoundClicked: true,
      });

      playButtonSound();
      setLastRound();

      setTimeout(() => {
        this.setState({ lastRoundClicked: false });
      }, 1000);
    }
  }

  playCard(e, card) {
    const {
      playCard,
      players,
      user,
      globalParams
      //cardPlayed,
    } = this.props;

    const { tableIsInProgress, cardPlayClicked } = this.state;

    if(tableIsInProgress){
    //  console.log('cannot play right now');
      return;
    }

    if (!cardPlayClicked && players && players.playerList) {
      this.setState({ cardPlayClicked: true });

      const myPos = players.playerList[user];

      if (card.allowed) {
        playCard({ selectedCard: card.card, init: false, myPos });

        ReactGA.event({
          category: 'Game',
          action: 'Play card'
        });

        setTimeout(() => {
          this.setState({ cardPlayClicked: false });
        }, 800);

        if (globalParams && globalParams.gameState !== 'burry' && globalParams.gameState !== 'choose') {
          this.setState({selectedCard: card.card});
        }
      } else {
        this.setState({ cardPlayClicked: false });
      }
    } else if (!cardPlayClicked && card.allowed) {
      playCard({ selectedCard: card.card, init: false, myPos: '' });

      ReactGA.event({
        category: 'Game',
        action: 'Play card'
      });

      setTimeout(() => {
        this.setState({ cardPlayClicked: false });
      }, 800);

      if (globalParams && globalParams.gameState !== 'burry' && globalParams.gameState !== 'choose') {
        this.setState({selectedCard: card.card});
      }
    } else {
      this.setState({ cardPlayClicked: false });
    //  console.log('cannot play that card');
    }
  }

  render() {
    const {
      member,
      user,
      currentTurn,
      currentType,
      //  totalPoints,
      largePlayer,
      //  points,
      endRoom,
      t,
      globalParams,
      nextTimeStamp,
      roomId,
      players,
      myPos,
      resetCloseErrorSubmit,
      closeErrorSubmit,
      showNotification,
      buyMoney,
      //  sendChatMessage,
      //  roomChats,
      sendSupportMessage,
      setSupportAsRead,
      disableTimer,
      gameSettings,
      sendGift,
      //  setEmotion,
      gifts,
      roomGifts,
      //  emotions,
        unBlockUser,
        cardPlayed,
        //cards,
        currentTable,
        closeLevelNotification,
        supportChat,
        supportChatStatus,
        previousRound,
        fetchPreviousRound,
        showEndResultModal,
        userSettings,
        playButtonSound,
        resetStore,
        lastRoom,
        refetchRoomData,
      } = this.props;

      //  const { ignoredUsers } = member;

      //  const { gameResult } = globalParams;

      const {
        chooseTypeClicked,
        openModal,
        modalType,
        notificationPlayer,
        newLevel,
        openGameResultModal,
        quitRound,
        gameResultModalShown,
      //  openChat,
        supportModalOpen,
        lastRoundModal,
        testingModal,
        giftsModal,
        blockUserModal,
        blockUserSelectedName,
        adminError,
        initialSelected,
        scoreTableOpen,
        selectedCard,
        cards,
        tableIsInProgress
      } = this.state;

      /*  const chatSettings = {
        openChat,
        chatMessages: roomChats,
        roomId,
        toggleChat: this.toggleChat,
        sendMessage: sendChatMessage,
        uid: user,
        emotions,
        setEmotion,
        toggleSupport: this.toggleSupport,
      }; */

    /*  const notifSettings = {
        member,
        openModal,
        userSettings,
        modalType,
        notificationPlayer,
        closeModal: this.closeModal,
        closeResultModal: this.closeResultModal,
        gameResult: globalParams.gameResult,
        endRoom: this.endRoom,
        leaveRoom: this.leaveRoom,
        newLevel,
        openGameResultModal,
        buyMoney,
        closeLevelNotification,
        lowBalPlayer: (globalParams && globalParams.lowBalPlayers && globalParams.lowBalPlayers.name) ? globalParams.lowBalPlayers.name : '',
        playButtonSound,
      }; */

    /*  const playerCardsSettings = {
        cards,
        cardPlayed,
        gameState: globalParams.gameState,
        playCard: this.playCard,
        currentTurnUid: players[currentTurn] ? players[currentTurn].uid : '',
        memberUid: member.uid,
        currentTable,
        selectedCard,
        tableIsInProgress
      }; */

    /*  const playersSettings = {
        players,
        myPos,
        //  cards,
        t,
        member,
        nextTimeStamp,
        //  currentTable,
        currentTurn,
        currentType,
        largePlayer,
        gameState: globalParams.gameState,
        talking: globalParams.talking,
        lowBalPlayers: globalParams.lowBalPlayers,
        lastRound: globalParams.lastRound,
        gameResult: globalParams.gameResult,
        disableTimer: globalParams.disableTimer,
        fastGame: globalParams.fastGame,
        roomClosed: globalParams.roomClosed,
        currentHand: globalParams.currentHand,
        endRoom,
        gameResultModalShown,
        gameSettings,
        user,
        //  globalParams,
        quitRound,
        quitRoundFunction: this.quitRound,
        gifts,
        toggleGiftsModal: this.toggleGiftsModal,
        roomGifts,
        emotions,
        ignoredUsers,
        unBlockUser,
        toggleBlockUser: this.toggleBlockUser,
        closeResultModal: this.closeResultModal,
        toggleLastRound: this.toggleLastRound,
        cardPlayed,
      }; */

    return (
      <div>
        <Row>
          {/* Players */}
          <Players
            //  {...playersSettings}
            userSettings={userSettings}
            players={players}
            myPos={myPos}
            t={t}
            roomId={roomId}
            member={member}
            uid={member.uid}
            offset={member.offset}
            nextTimeStamp={nextTimeStamp}
            //  currentTable={currentTable}
            currentTurn={currentTurn}
            currentType={currentType}
            largePlayer={largePlayer}
            gameState={globalParams.gameState}
            talking={globalParams.talking}
            lowBalPlayers={globalParams.lowBalPlayers}
            lastRound={globalParams.lastRound}
            gameResult={globalParams.gameResult}
            disableTimer={globalParams.disableTimer}
            fastGame={globalParams.fastGame}
            roomClosed={globalParams.roomClosed}
            currentHand={globalParams.currentHand}
            endRoom={endRoom}
            gameResultModalShown={gameResultModalShown}
            gameSettings={gameSettings}
            quitRound={quitRound}
            quitRoundFunction={this.quitRound}
            //  user={user}
            gifts={gifts}
            toggleGiftsModal={this.toggleGiftsModal}
            roomGifts={roomGifts}
            //  emotions={emotions}
            ignoredUsers={member.ignoredUsers}
            unBlockUser={unBlockUser}
            toggleBlockUser={this.toggleBlockUser}
            closeResultModal={this.closeResultModal}
            toggleLastRound={this.toggleLastRound}
            refetchRoomData={refetchRoomData}
          />

          {/* Player cards */}
          <PlayerCards
          //  {...playerCardsSettings}
              cards={cards}
              cardPlayed={cardPlayed}
              gameState={globalParams.gameState}
              playCard={this.playCard}
              currentTurnUid={players[currentTurn] ? players[currentTurn].uid : ''}
              currentTurn={currentTurn}
              memberUid={member.uid}
              currentTable={currentTable}
              selectedCard={selectedCard}
              tableIsInProgress={tableIsInProgress}
              soundOn={userSettings.soundOn || false}
          />

        {/*  <Button onClick={() => resetStore(lastRoom, roomId)} style={{ position: 'absolute', left: 100, zIndex: 700 }}>
            Reset Store
          </Button>  */}

          {/* Choosing game type */}
          {globalParams &&
          !globalParams.roomClosed &&
          globalParams.gameState === 'choose' &&
          globalParams.talking &&
          user &&
          globalParams.talking.toString() === user.toString() &&
          players &&
          players.player1 &&
          players.player1.uid &&
          players.player2 &&
          players.player2.uid &&
          players.player3 &&
          players.player3.uid &&
          //  && cards && cards.length > 7
          (!currentTable || (currentTable && currentTable.length === 0)) ? (
            <div className="selection">
              <Row>
                <Button
                  color="danger"
                  className="selection-take"
                  disabled={chooseTypeClicked}
                  onClick={() => this.chooseType('zole')}
                >
                  {t('zole')}
                </Button>
              </Row>
              {globalParams.smallGame && (
                <Row>
                  <Button
                    color="danger"
                    className="selection-take"
                    disabled={chooseTypeClicked}
                    onClick={() => this.chooseType('maza')}
                  >
                    {t('smallZole')}
                  </Button>
                </Row>
              )}
              <Row>
                <Button
                  color="success"
                  className="selection-take"
                  disabled={chooseTypeClicked}
                  onClick={() => this.chooseType('parasta')}
                >
                  {t('takeTable')}
                </Button>
              </Row>
              <Row>
                <Button
                  color="warning"
                  className="selection-pass"
                  disabled={chooseTypeClicked}
                  onClick={() => this.chooseType('garam')}
                >
                  {t('pass')}
                </Button>
              </Row>
            </div>
          ) : null}



          <div ref={this.gameTypeHolderRef} className="current-game-type">
            {globalParams &&
              currentType &&
              globalParams.gameState &&
              (globalParams.gameState === 'play' ||
                globalParams.gameState === 'burry' ||
                globalParams.gameState === 'results') && (
                <>
                  {currentType === 'parasta' && (
                    <div className="current-game-type-text">{t('regular')}</div>
                  )}
                  {currentType === 'zole' && (
                    <div className="current-game-type-text">{t('zole')}</div>
                  )}
                  {currentType === 'maza' && (
                    <div className="current-game-type-text">{t('smallZole')}</div>
                  )}
                  {currentType === 'galdins' && (
                    <div className="current-game-type-text">{t('table')}</div>
                  )}
                </>
              )}
          </div>

          <PreviousRound
            previousRound={previousRound}
            fetchPreviousRound={fetchPreviousRound}
            players={players}
            playButtonSound={playButtonSound}
          />

            {/* Cards on table */}
            <CardsOnTable
              removeSelectedCard={this.removeSelectedCard}
              tableInProgress={this.tableInProgress}
              myPos={myPos}
              globalParams={globalParams}
              currentTable={currentTable}
              userSettings={userSettings}
            />

          {scoreTableOpen ? (
            <div className="score-table-toggle-open">
              <Media
                onClick={this.toggleScoreTable}
                className="score-table-toggle-image"
                src={tabulaColapse}
                alt="Aizvērt"
              />
            </div>
          ) : (
            <div className="score-table-toggle-closed">
              <Media
                onClick={this.toggleScoreTable}
                className="score-table-toggle-image"
                src={tabulaColapsed}
                alt="Atvērt"
              />
            </div>
          )}

          <>
            <GameStats
              t={t}
              gameStartTime={globalParams.gameStartTime}
              scoreTableOpen={scoreTableOpen}
              offset={member.offset}
              gameType={globalParams.gameType}
              smallGame={globalParams.smallGame}
              bet={globalParams.bet}
              party={globalParams.party}
            />
          </>

          {/* Score table */}
          {roomId && user && (
            <ScoreTable
              roomId={roomId}
              scoreTableOpen={scoreTableOpen}
              //  player1ShortName={players.player1 ? players.player1.shortName : ''}
              //  player2ShortName={players.player2 ? players.player2.shortName : ''}
              //  player3ShortName={players.player3 ? players.player3.shortName : ''}
              //  totalPnts={totalPoints}
              //  points={points}
              //  myPos={myPos}
              //  scoreTableOpen={scoreTableOpen}
              //  bet={globalParams.bet}
              //  party={globalParams && globalParams.party}
            />
          )}

          {showEndResultModal && (
            <EndResultModal
              roomId={roomId}
              leaveRoom={this.leaveRoom}
              t={t}
              playButtonSound={playButtonSound}
            />
          )}

          <StaticElements
            fastGame={globalParams.fastGame}
            proGame={globalParams.proGame}
            exitRoomNotification={this.exitRoomNotification}
          />

          {member && !member.userConnected && (
            <div className="db-status-indicator" />
          )}

          <Notification
          //  {...notifSettings}
            //    openModal={openModal}
            //    modalType={modalType}
            //    notificationPlayer={notificationPlayer}
            //    closeModal={this.closeModal}
            //    closeResultModal={this.closeResultModal}
            //    gameResult={gameResult}
            //    endRoom={this.endRoom}
            //    leaveRoom={this.leaveRoom}
            //    newLevel={newLevel}
            //    openGameResultModal={openGameResultModal}
            //    buyMoney={buyMoney}
            //    lowBalPlayer={(globalParams && globalParams.lowBalPlayers && globalParams.lowBalPlayers.name) ? globalParams.lowBalPlayers.name : ''}
            member={member}
            openModal={openModal}
            userSettings={userSettings}
            modalType={modalType}
            notificationPlayer={notificationPlayer}
            closeModal={this.closeModal}
            closeResultModal={this.closeResultModal}
            gameResult={globalParams.gameResult}
            endRoom={this.endRoom}
            leaveRoom={this.leaveRoom}
            newLevel={newLevel}
            openGameResultModal={openGameResultModal}
            buyMoney={buyMoney}
            closeLevelNotification={closeLevelNotification}
            lowBalPlayer={(globalParams && globalParams.lowBalPlayers && globalParams.lowBalPlayers.name) ? globalParams.lowBalPlayers.name : ''}
            playButtonSound={playButtonSound}
          />

          {roomId && user && (
            <Chat
              toggleSupport={this.toggleSupport}
              roomId={roomId}
              uid={user}
              supportChatStatus={supportChatStatus}
              playButtonSound={playButtonSound}
            />
          )}

          <SendGift
            sendGift={sendGift}
            gifts={gifts}
            //  member={member}
            modalOpen={giftsModal}
            toggle={this.toggleGiftsModal}
            players={players}
            roomId={roomId}
            initialSelected={initialSelected}
            playButtonSound={playButtonSound}
          />

          <ContactSupport
            modalOpen={supportModalOpen}
            toggle={this.toggleSupport}
            uid={user}
            name={member.name}
            //  member={member}
            supportChat={supportChat}
            supportChatStatus={supportChatStatus}
            resetClose={resetCloseErrorSubmit}
            closeErrorSubmit={closeErrorSubmit}
            showNotification={showNotification}
            sendSupportMessage={sendSupportMessage}
            setSupportAsRead={setSupportAsRead}
            playButtonSound={playButtonSound}
          />

          {member && (member.role === 'admin' || member.role === 'tester') && (
            <Button
              className="last-round-button"
              style={{ width: '30%', marginTop: 5 }}
              onClick={this.toggleTestModal}
            >
              Testa panelis
            </Button>
          )}
        </Row>

        {/*  <Modal isOpen={blockUserModal} toggle={() => this.toggleBlockUser(null, null)} className="notification">
            <ModalHeader
              toggle={() => this.toggleBlockUser(null, null)}
              className="notification-header"
              close={
                <Media src={closeImg} className="notification-header-close" alt="X" onClick={() => this.toggleBlockUser(null, null)} />
              }
            />
            <ModalBody className="notification-body" style={{ fontSize: 28 }}>
              {`Vai tiešām vēlies bloķēt spēlētāju ${blockUserSelectedName}?`}
            </ModalBody>
            <ModalFooter className="notification-footer">
              <Button className="btn notification-footer-button" onClick={this.blockUser}>
                Jā
              </Button>
              <Button type="button" className="btn notification-footer-button" onClick={() => this.toggleBlockUser(null, null)}>
                Nē
              </Button>
            </ModalFooter>
          </Modal> */}

        <BlockUserModal
          t={t}
          blockUserModal={blockUserModal}
          blockUserSelectedName={blockUserSelectedName}
          toggleBlockUser={this.toggleBlockUser}
          blockUserFunction={this.blockUser}
        />

        <LastRoundModal
          t={t}
          lastRoundModal={lastRoundModal}
          closeLastRound={this.closeLastRound}
          lastRoundFunction={this.lastRound}
        />

        {/*  <Modal isOpen={lastRoundModal} toggle={this.closeLastRound} className="notification">
            <ModalHeader
              className="notification-header"
              close={
                <Media src={closeImg} className="notification-header-close" alt="X" onClick={this.closeLastRound} />
              }
            />
            <ModalBody className="notification-body" style={{ fontSize: 28 }}>
              Vai tiešām vēlies spēlēt pēdējo partiju?
            </ModalBody>
            <ModalFooter className="notification-footer">
              <Button className="btn notification-footer-button" onClick={this.lastRound}>
                Jā
              </Button>
              <Button type="button" className="btn notification-footer-button" onClick={this.closeLastRound}>
                Nē
              </Button>
            </ModalFooter>
          </Modal> */}

        {testingModal &&
          member &&
          (member.role === 'admin' || member.role === 'tester') && (
            <Modal
              size="lg"
              isOpen={testingModal}
              toggle={this.toggleTestModal}
              className="test-panel"
            >
              <ModalHeader
                className="test-panel-header notification-header"
                close={
                  <Media
                    src={closeImg}
                    className="notification-header-close"
                    alt="X"
                    onClick={this.toggleTestModal}
                  />
                }
              />
              <ModalBody className="test-panel-body" style={{ fontSize: 28 }}>
                <div style={{ color: 'red', fontSize: 14, marginBottom: 3 }}>
                  {adminError}
                </div>
                <div>
                  <Button
                    className="test-panel-button"
                    onClick={() => disableTimer(roomId)}
                  >
                    {globalParams && globalParams.disableTimer
                      ? 'Ieslēgt taimeri'
                      : 'Izslēgt taimeri'}
                  </Button>
                </div>
                <div style={{ fontSize: 12, marginBottom: 3 }}>
                  Kārtis ir secībā
                  <table className="test-panel-cards-table">
                    <thead>
                      <tr>
                        <td> 0 </td>
                        <td> 1 </td>
                        <td> 2 </td>
                        <td> 3 </td>
                        <td> 4 </td>
                        <td> 5 </td>
                        <td> 6 </td>
                        <td> 7 </td>
                        <td> 8 </td>
                        <td> 9 </td>
                        <td> 10 </td>
                        <td> 11 </td>
                        <td> 12 </td>
                        <td> 13 </td>
                        <td> 14 </td>
                        <td> 15 </td>
                        <td> 16 </td>
                        <td> 17 </td>
                        <td> 18 </td>
                        <td> 19 </td>
                        <td> 20 </td>
                        <td> 21 </td>
                        <td> 22 </td>
                        <td> 23 </td>
                        <td> 24 </td>
                        <td> 25 </td>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td> ♣︎-Q </td>
                        <td> ♠︎-Q </td>
                        <td> ♥-Q </td>
                        <td> ♦︎-Q </td>
                        <td> ♣︎-J </td>
                        <td> ♠︎-J </td>
                        <td> ♥-J </td>
                        <td> ♦︎-J </td>
                        <td> ♦︎-A </td>
                        <td> ♦︎-10 </td>
                        <td> ♦︎-K </td>
                        <td> ♦︎-9 </td>
                        <td> ♦︎-8 </td>
                        <td> ♦︎-7 </td>
                        <td> ♥-A </td>
                        <td> ♥-10 </td>
                        <td> ♥-K </td>
                        <td> ♥-9 </td>
                        <td> ♠︎-A </td>
                        <td> ♠︎-10 </td>
                        <td> ♠︎-K </td>
                        <td> ♠︎-9 </td>
                        <td> ♣︎-A </td>
                        <td> ♣︎-10 </td>
                        <td> ♣︎-K </td>
                        <td> ♣︎-9 </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <div
                  style={{
                    fontSize: 12,
                    marginBottom: 5,
                    marginTop: 3,
                    textTransform: 'none',
                  }}
                >
                  Katram spēlētajam jāpiešķir 8 kārtis, kāršu nummurus jāatdala
                  ar komatu
                </div>
                {players && players.player1 && (
                  <div style={{ fontSize: 12 }}>{players.player1.name}</div>
                )}
                <Input
                  type="text"
                  name="nextDealCards1"
                  onChange={this.handleChange}
                />
                {players && players.player2 && (
                  <div style={{ fontSize: 12 }}>{players.player2.name}</div>
                )}
                <Input
                  type="text"
                  name="nextDealCards2"
                  onChange={this.handleChange}
                />
                {players && players.player3 && (
                  <div style={{ fontSize: 12 }}>{players.player3.name}</div>
                )}
                <Input
                  type="text"
                  name="nextDealCards3"
                  onChange={this.handleChange}
                />
                <Button
                  className="test-panel-button"
                  onClick={this.setNextDealCards}
                >
                  Likt nākošā dalījuma kārtis
                </Button>

                <Input
                  type="number"
                  name="newBal"
                  onChange={this.handleChange}
                />
                <Button className="test-panel-button" onClick={this.setUserBal}>
                  Mainīt bilanci
                </Button>
              </ModalBody>
              <ModalFooter className="notification-footer">
                <Button
                  type="button"
                  className="btn test-panel-button"
                  onClick={this.toggleTestModal}
                >
                  Aizvērt
                </Button>
              </ModalFooter>
            </Modal>
          )}
      </div>
    );
  }
}

export default withTranslation('game')(Zole);
