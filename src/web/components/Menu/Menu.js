import React, { Fragment } from 'react';
import PropTypes from 'prop-types';

import { withTranslation } from 'react-i18next';

import Joyride, {
  CallBackProps, STATUS,
} from 'react-joyride';

/* import {
  Row,
  Col,
  NavLink,
  TabPane,
  TabContent,
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Media,
} from 'reactstrap'; */

import Row from 'reactstrap/lib/Row';
import Col from 'reactstrap/lib/Col';
import NavLink from 'reactstrap/lib/NavLink';
import Media from 'reactstrap/lib/Media';
import Button from 'reactstrap/lib/Button';
import TabPane from 'reactstrap/lib/TabPane';
import TabContent from 'reactstrap/lib/TabContent';
import Modal from 'reactstrap/lib/Modal';
import ModalHeader from 'reactstrap/lib/ModalHeader';
import ModalBody from 'reactstrap/lib/ModalBody';
import ModalFooter from 'reactstrap/lib/ModalFooter';

import LoadingPage from '../UI/Loading';
import BlockedPage from '../UI/Blocked';

import MyInfo from './MyInfo';
import NewGame from './NewGame';
import ShopBonus from './ShopBonus';
// import LevelProgress from './LevelProgress';
import RoomsTable from './RoomsTable';
import BonusPage from './BonusPage';
import BuyPage from './BuyPage';
// import SendMoneyToFriend from './SendMoneyToFriend';
import TopPage from './TopPage';
import Tournaments from './Tournaments';
import TournamentsHistory from './TournamentsHistory';
import ContactSupport from '../ContactSupport';
import MoneyHistory from './MoneyHistory';
import BannedUsers from './BannedUsers';
// import OnlineUsers from './OnlineUsers';
import Friends from './Friends';
import IgnoredUsers from './IgnoredUsers';
import Achievements from './Achievements';

import CustomTooltip from './CustomTooltip';
import SoundButton from '../UI/SoundButton';
import LanguageSelect from '../UI/LanguageSelect';

import Notification from '../Notification';

import 'react-circular-progressbar/dist/styles.css';

// import logo from '../../../images/zole-logo.png';
import fast from '../../../images/icons/aatraa_istaba.svg';

// import lastRoundImg from '../../../images/icons/quit_round.png';
// import quitRoundImg from '../../../images/icons/last_round.png';
import helpImg from '../../../images/icons/help2.png';
import quickHelpImg from '../../../images/icons/quick_help.png';
import moneyHistoryImg from '../../../images/icons/money_history.png';
import blockedUsersImg from '../../../images/icons/blocked_users.png';
import gameHelpImg from '../../../images/icons/game_help.png';
import coinImg from '../../../images/coin.svg';
import closeImg from '../../../images/icons/close.png';
import config from '../../../constants/config';
import defaultImage from '../../../images/Game/defaultImage.jpg';

// import pointsImage from '../../../images/points.jpg';
// import trumpjiImage from '../../../images/trumpji.jpg';

import logoutImg from '../../../images/Menu/logout.svg';

import chatInSound from '../../../sounds/chat_notification.wav';
// import buttonClickedSound from '../../../sounds/click_feedback.flac';

import NewVersion from './NewVersion';

const currentVersion = require('./../../../../package.json').version;

const GameTypeMap = {
  "P": "P",
  "PM": "PM",
  "G": "G",
  "MG": "MG"
};

const GameBetMap = {
  "1:1": "1:1",
  "1:5": "1:5",
  "1:10": "1:10",
  "1:25": "1:25",
  "1:50": "1:50",
  "1:100": "1:100",
  "1:500": "1:500",
  "1:1000": "1:1000",
  "1:5000": "1:5000",
  "1:10000": "1:10000"
};


class Menu extends React.Component {
  static propTypes = {
    rooms: PropTypes.shape(),
    myRooms: PropTypes.shape(),
    leaderboard: PropTypes.shape(),
    myLeaderboard: PropTypes.shape(),
    tournaments: PropTypes.shape(),
    tournamentPlayers: PropTypes.shape(),
    myTournamentsData: PropTypes.shape(),
    //  myTournamentsData2: PropTypes.shape(),
    tournamentsHistory: PropTypes.shape(),
    tournamentsHistoryPlayers: PropTypes.shape(),
    lastRoom: PropTypes.string,
    bannedUsers: PropTypes.shape(),
    bannedUsersCount: PropTypes.number,
  //  onlineUsersLazy: PropTypes.shape(),
    userSettings: PropTypes.shape(),
    //  roomCount: PropTypes.number,
    //  userCount: PropTypes.number,
    joinRoom: PropTypes.func.isRequired,
    createRoom: PropTypes.func.isRequired,
    uid: PropTypes.string,
    loadingProgress: PropTypes.number.isRequired,
    member: PropTypes.shape().isRequired,
    loading: PropTypes.bool.isRequired,
    spinWheel: PropTypes.func.isRequired,
    claimSpin: PropTypes.func.isRequired,
    t: PropTypes.func.isRequired,
    //  handleFBLogin: PropTypes.func.isRequired,
    //  fetchPositionInLeaderboard: PropTypes.func.isRequired,
    //  fetchLeaderboard: PropTypes.func.isRequired,
    sendMoney: PropTypes.func.isRequired,
    joinTournament: PropTypes.func.isRequired,
    joinTournamentRoom: PropTypes.func.isRequired,
    fetchTournamentPlayers: PropTypes.func.isRequired,
    fetchTournamentsHistory: PropTypes.func.isRequired,
    fetchTournamentHistory: PropTypes.func.isRequired,
    resetErrorNotif: PropTypes.func.isRequired,
    submitError: PropTypes.func.isRequired,
    errorNotification: PropTypes.string,
    ignoredMessageName: PropTypes.string,
    showNotification: PropTypes.func.isRequired,
    lastJoinedRoom: PropTypes.string,
    resetCloseErrorSubmit: PropTypes.func.isRequired,
    closeErrorSubmit: PropTypes.bool.isRequired,
    buyTournamentMoney: PropTypes.func.isRequired,
    cancelWaitRoom: PropTypes.func.isRequired,
    leaveTournament: PropTypes.func.isRequired,
    initFBPayment: PropTypes.func.isRequired,
    fbPaymentCallback: PropTypes.func.isRequired,
    initDraugiemPayment: PropTypes.func.isRequired,
    disableFirstTimeNotif: PropTypes.func.isRequired,
    disableTutorial: PropTypes.func.isRequired,
    sendSupportMessage: PropTypes.func.isRequired,
    setSupportAsRead: PropTypes.func.isRequired,
    fetchBalanceHistory: PropTypes.func.isRequired,
    fetchFBFriends: PropTypes.func.isRequired,
    fetchIgnoredPlayers: PropTypes.func.isRequired,
    unBlockUser: PropTypes.func.isRequired,
    logout: PropTypes.func.isRequired,
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
    initStripePayment: PropTypes.func.isRequired,
    fetchAchievements: PropTypes.func.isRequired,
  //  fetchOnlineUsersLazy: PropTypes.func.isRequired,
  //  changeSortDirection: PropTypes.func.isRequired,
  //  changeSortFilter: PropTypes.func.isRequired,
    readSupportChat: PropTypes.func.isRequired,
    closePrivateRoomPassword: PropTypes.func.isRequired,
    leaveRoom: PropTypes.func.isRequired,
    toggleNewGameParameter: PropTypes.func.isRequired,
    setNewBet: PropTypes.func.isRequired,
    setCheckedVersion: PropTypes.func.isRequired,
    playButtonSound: PropTypes.func.isRequired,
  //  userAchievements: PropTypes.shape({}),

    history: PropTypes.shape({
      push: PropTypes.func,
    }),
  }

  static defaultProps = {
    uid: '',
    errorNotification: '',
    ignoredMessageName: '',
    leaderboard: [],
    rooms: {},
    myRooms: {},
    myLeaderboard: {},
    tournaments: {},
    tournamentPlayers: {},
    myTournamentsData: {},
    //  myTournamentsData2: {},
    tournamentsHistory: {},
    tournamentsHistoryPlayers: {},
    lastRoom: {},
    lastJoinedRoom: '',
    bannedUsers: {},
    bannedUsersCount: 0,
    onlineUsersLazy: {},
    userSettings: {},
    //  roomCount: 0,
    //  userCount: 0,
  //  userAchievements: {},
  }

  constructor(props) {
    super(props);
    const { t } = props;
    this.state = {
      activeTab: '1',
      helpTab: '1',
      rulesModalOpen: false,
      //  helpModalOpen: false,
      supportModalOpen: false,
      balanceHistoryModalOpen: false,
      run: false,
      //  showLoadingLogin: false,
      steps: [
        {
          disableBeacon: true,
          target: '.start-game-button',
          content: t('tutorial.startStep'),
        //  pacement: 'top',
        },
        /*  {
          disableBeacon: true,
          target: '.rules-button',
          content: t('tutorial.rulesStep'),
        }, */
        {
          disableBeacon: false,
          target: '.top-tab',
          content: t('tutorial.topStep'),
        //  pacement: 'bottom',
        },
        {
          disableBeacon: false,
          target: '.my-info-tab',
          content: t('tutorial.myInfoStep'),
        //  pacement: 'center',
        },
        {
          disableBeacon: false,
          target: '.tournaments-tab',
          content: t('tutorial.tournamentsStep'),
        //  pacement: 'bottom',
        },
        {
          disableBeacon: false,
          target: '.shop-tab',
          content: t('tutorial.shopStep'),
        //  pacement: 'top',
        },
        {
          disableBeacon: false,
          target: '.bonus-tab',
          content: t('tutorial.bonusStep'),
        //  pacement: 'right',
        },
      ],
      helpPageOpen: false,
      insufficientBalanceAmount: null,
      insufficientBalanceBet: null,
    };

    this.refetchLeaderboard = this.refetchLeaderboard.bind(this);
    this.newVersionChecked = this.newVersionChecked.bind(this);
    this.logout = this.logout.bind(this);
    this.chatInAudio = new Audio(chatInSound);
  //  this.buttonClickedAudio = new Audio(buttonClickedSound);
  }

  componentWillMount() {
    const { member } = this.props;

    if (member && member.firstTimeModal && !member.tutorialShown) {
      this.setState({ run: true });
    }

  //  setTimeout(() => {
  //    this.setState({ showLoadingLogin: true });
  //  }, 2000);
  }

  componentDidUpdate(prevProps, prevState) {
    const {
      member,
      errorNotification,
      insufficientBalanceAmount,
      insufficientBalanceBet,
      userSettings
    //  ignoredMessageName,
    } = this.props;

    const { openModal, modalType } = prevState;
    const { member: oldMember } = prevProps;

    if (errorNotification) {
      if (errorNotification === 'insufficient balance') {
        if (!(openModal && modalType === 'noBalanceMenu')) {
          this.UpdateModal(true, 'noBalanceMenu', null);
          this.setState({ insufficientBalanceAmount, insufficientBalanceBet })
        }
      } else if (errorNotification === 'pro room') {
        if (!(openModal && modalType === 'proRoomMenu')) {
          this.UpdateModal(true, 'proRoomMenu', null);
        }
      } else if (errorNotification === 'pro bet') {
        if (!(openModal && modalType === 'proBetMenu')) {
          this.UpdateModal(true, 'proBetMenu', null);
        }
      } else if (errorNotification === 'insuf bal tournament') {
        if (!(openModal && modalType === 'noBalanceTournament')) {
          this.UpdateModal(true, 'noBalanceTournament', null);
        }
      } else if (errorNotification === 'You ignored player') {
        if (!(openModal && modalType === 'youIgnoredPlayer')) {
          this.UpdateModal(true, 'youIgnoredPlayer', null);
        }
      } else if (errorNotification === 'Player ignored you') {
        if (!(openModal && modalType === 'playerIgnoredYou')) {
          this.UpdateModal(true, 'playerIgnoredYou', null);
        }
      }
    }

    if (member && member.lvlUpNotification) {
      if (!(openModal && modalType === 'levelUp')) {
        this.UpdateModal(true, 'levelUp', member.level);
      }
    }

    if (member && !member.lvlUpNotification && openModal && modalType === 'levelUp') {
      this.UpdateModal(false, '', null);
    }


    if(userSettings && userSettings.soundOn){
      if((!oldMember.supportChatStatus || oldMember.supportChatStatus.read === true) && member.supportChatStatus && member.supportChatStatus.read === false){
        this.chatInAudio.play();
      }
    }
  }

  logout = (e) => {
    e.preventDefault();
    const { logout, history } = this.props;
    logout().then(() => {
      history.push("/landing");
    });
  }

  toggleSupport = () => {
    const { supportModalOpen } = this.state;
    const { setSupportAsRead, member, readSupportChat, playButtonSound } = this.props;

    if (!supportModalOpen && member.supportChatStatus && !member.supportChatStatus.read) {
      playButtonSound();
      setSupportAsRead();
    }
    if (!supportModalOpen) {
      playButtonSound();
      readSupportChat();
    }
    this.setState({ supportModalOpen: !supportModalOpen });
  }

  toggleRules = () => {
    const { playButtonSound } = this.props;
    const { rulesModalOpen } = this.state;

    playButtonSound();
    this.setState({ rulesModalOpen: !rulesModalOpen });
  }

  toggleHelp = () => {
    const { playButtonSound } = this.props;
    //  const { helpPageOpen } = this.state;
    //  this.setState((prevState) => ( helpPageOpen: !prevState.helpPageOpen ));

    playButtonSound();

    this.setState(prevState => ({
      helpPageOpen: !prevState.helpPageOpen,
    }));
  }

  UpdateModal = (openModal, modalType, newLevel) => {
    this.setState({
      openModal, modalType, newLevel,
    });
  }

  getSteps = () => {
    const { t } = this.props;

    const steps = [
      {
        disableBeacon: true,
        target: '.start-game-button',
        content: t('tutorial.startStep'),
        //  pacement: 'top',
        disableOverlayClose: true,
      },
      /*  {
        disableBeacon: true,
        target: '.rules-button',
        content: t('tutorial.rulesStep'),
      }, */
      {
        disableBeacon: false,
        target: '.top-tab',
        content: t('tutorial.topStep'),
        //  pacement: 'bottom',
        disableOverlayClose: true,
      },
      {
        disableBeacon: false,
        target: '.my-info-tab',
        content: t('tutorial.myInfoStep'),
        //  pacement: 'center',
        disableOverlayClose: true,
      },
      {
        disableBeacon: false,
        target: '.tournaments-tab',
        content: t('tutorial.tournamentsStep'),
        //  pacement: 'bottom',
        disableOverlayClose: true,
      },
      {
        disableBeacon: false,
        target: '.shop-tab',
        content: t('tutorial.shopStep'),
        //  pacement: 'top',
        disableOverlayClose: true,
      },
      {
        disableBeacon: false,
        target: '.bonus-tab',
        content: t('tutorial.bonusStep'),
        //  pacement: 'right',
        disableOverlayClose: true,
      },
    ];
    this.setState({ steps });
    return null;
  }

  handleClickStart = (e) => {
    const { playButtonSound } = this.props;
    e.preventDefault();
    this.getSteps();
    //  .then(() => {

    playButtonSound();

    this.setState({
      run: true,
    });
  //  });
  };


  toggle = (tab) => {
    const { playButtonSound } = this.props;
    const { activeTab } = this.state;
    if (activeTab !== tab) {
    /*  if (tab === '1') {
        console.log('fetchFreeRooms');
        fetchFreeRooms();
      } else {
        console.log('cancelRoomListeners');
        cancelRoomListeners();
      } */

      playButtonSound();

      this.setState({
        activeTab: tab,
      });
    }
  }

  toggleHelpTab = (tab) => {
    const { playButtonSound } = this.props;
    const { helpTab } = this.state;

    playButtonSound();

    if (helpTab !== tab) {
      this.setState({
        helpTab: tab,
      });
    }
  }

  toggleBalanceHistory = () => {
    const { fetchBalanceHistory, playButtonSound } = this.props;

    playButtonSound();

    fetchBalanceHistory('today');
    this.setState(prevState => ({
      balanceHistoryModalOpen: !prevState.balanceHistoryModalOpen,
    }));
  }

  toggleBannedUsers = () => {
    const { playButtonSound } = this.props;
    playButtonSound();

    this.setState(prevState => ({
      bannedUsersModalOpen: !prevState.bannedUsersModalOpen,
    }));
  }

  //  toggleOnlineUsers = () => {
  //    this.setState(prevState => ({
  //      onlineUsersModalOpen: !prevState.onlineUsersModalOpen,
  //    }));
  //  }

  closeModal = () => {
    const { resetErrorNotif } = this.props;
    const { modalType } = this.state;
    if (modalType === 'noBalanceMenu' || modalType === 'proRoomMenu' || modalType === 'proBetMenu' || modalType === 'noBalanceTournament' || modalType === 'youIgnoredPlayer' || modalType === 'playerIgnoredYou') {
      resetErrorNotif();
    }
    this.setState({ openModal: false, modalType: '', insufficientBalanceAmount: null, insufficientBalanceBet: null });
  }

  handleJoyrideCallback = (data: CallBackProps) => {
    const { disableTutorial, member } = this.props;
    const { status, action } = data;

    const finishedStatuses: string[] = [STATUS.FINISHED, STATUS.SKIPPED];

    if (finishedStatuses.includes(status) || action === 'close') {
      this.setState({ run: false });

      if (!member || !member.tutorialShown) {
        disableTutorial();
      }
    }
  };

  closeFirstTime = () => {
    const { disableFirstTimeNotif, member } = this.props;

    if (!member || !member.firstTimeModal) {
      disableFirstTimeNotif();
      if (document.getElementById('top-tab') && document.getElementById('top-tab').isSameNode) {
        this.getSteps();
        this.setState({
          run: true,
        });
      }
    }
  }


  refetchLeaderboard() {
    const { fetchLeaderboard, fetchPositionInLeaderboard } = this.props;
    fetchLeaderboard();
    fetchPositionInLeaderboard();
  }

  newVersionChecked(v) {
    const { setCheckedVersion } = this.props;
    setCheckedVersion(v);
  }

  /* playButtonSound = () => {
    const { userSettings } = this.props;

    if (userSettings && userSettings.soundOn) {
      this.buttonClickedAudio.play();
    }
  } */

  render() {
    const {
      uid,
      member,
      loading,
      createRoom,
      loadingProgress,
      joinRoom,
      rooms,
      myRooms,
      spinWheel,
      claimSpin,
      t,
      //  handleFBLogin,
      leaderboard,
      myLeaderboard,
      sendMoney,
      tournaments,
      tournamentPlayers,
      myTournamentsData,
      //  myTournamentsData2,
      joinTournament,
      joinTournamentRoom,
      fetchTournamentPlayers,
      fetchTournamentsHistory,
      fetchTournamentHistory,
      tournamentsHistory,
      tournamentsHistoryPlayers,
      resetErrorNotif,
      submitError,
      lastRoom,
      lastJoinedRoom,
      resetCloseErrorSubmit,
      closeErrorSubmit,
      showNotification,
      //  roomCount,
      //  userCount,
      buyTournamentMoney,
      cancelWaitRoom,
      leaveTournament,
      initFBPayment,
      initStripePayment,
      fbPaymentCallback,
      initDraugiemPayment,
      sendSupportMessage,
      setSupportAsRead,
      fetchBalanceHistory,
      bannedUsers,
      bannedUsersCount,
      //  onlineUsers,
    //  onlineUsersLazy,
      fetchFBFriends,
      fetchIgnoredPlayers,
      unBlockUser,
      ignoredMessageName,
      fetchLeaderboardYear,
      fetchLeaderboardMonth,
      fetchLeaderboardWeek,
      fetchLeaderboardDaily,
      fetchPositionInLeaderboardYear,
      fetchPositionInLeaderboardMonth,
      fetchPositionInLeaderboardWeek,
      fetchPositionInLeaderboardDaily,
      fetchAchievements,
    //  fetchOnlineUsersLazy,
    //  changeSortDirection,
    //  changeSortFilter,
      readSupportChat,
      privateRoomPassword,
      showPrivateRoomPassword,
      closePrivateRoomPassword,
      leaveRoom,
      toggleNewGameParameter,
      userSettings,
      setNewBet,
      closeLevelNotification,
      roomsCount,
      usersCount,
    //  userAchievements,
      playButtonSound,
    } = this.props;

    const {
      activeTab,
      helpTab,
      openModal,
      modalType,
      newLevel,
      steps,
      //  rulesModalOpen,
      //  helpModalOpen,
      supportModalOpen,
      run,
      //  showLoadingLogin,
      balanceHistoryModalOpen,
      bannedUsersModalOpen,
      helpPageOpen,
      insufficientBalanceAmount,
      insufficientBalanceBet,
    //  onlineUsersModalOpen,
    } = this.state;

    
    if (loading || (!member.uid)) {
      return (
        <Fragment>
          <LoadingPage loading={loading} loadingProgress={loadingProgress} />
          {/*  {showLoadingLogin && !member.uid && (
            <div style={{ marginLeft: 'auto', marginRight: 'auto', width: '60%' }}>
              <p>
                Lūdzu pārliecinieties, ka reklāmas bloķētāji un POP UP bloķētāji ir atslēgti, lai
                pilnvērtīgi varētu spēlēt Zoli un mēģiniet pieslēgties vēlreiz.
              </p>
              {window && window.FB && (
                <Button
                  className="btn-facebook"
                  style={{ marginTop: 25, marginLeft: 'auto', marginRight: 'auto' }}
                  id="btn-social-login"
                  onClick={handleFBLogin}
                >
                  <span className="btn-facebook-icon" />
                  <span className="btn-facebook-text">Sign in with Facebook</span>
                </Button>
              )}
            </div>
          )}  */}
        </Fragment>
      );
    }

    if (member && member.blocked) {
      return (
        <BlockedPage banEndDate={member.banEndDate} banReason={member.banReason} />
      );
    }

    return (
      <Fragment>
        <Notification
          member={member}
          openModal={openModal}
          modalType={modalType}
          ignoredMessageName={ignoredMessageName}
          closeModal={this.closeModal}
          resetErrorNotif={resetErrorNotif}
          newLevel={newLevel}
          switchTabs={this.toggle}
          closeLevelNotification={closeLevelNotification}
          insufficientBalanceAmount={insufficientBalanceAmount}
          insufficientBalanceBet={insufficientBalanceBet}
        />

        <SoundButton uid={member.uid} />

        <LanguageSelect />

        {!config.isInAppFrame() && (<a href="#" title={t('menu.logout')} className="logout-button" onClick={this.logout}><img src={logoutImg} alt={t('menu.logout')} /></a>)}

        {document.getElementById('top-tab') && document.getElementById('top-tab').isSameNode && (
          <Joyride
            tooltipComponent={CustomTooltip}
            callback={this.handleJoyrideCallback}
            steps={steps}
            continuous
            showProgress
            showSkipButton
            scrollToFirstStep
            spotlightClicks
            spotlightPadding={0}
            run={run}
            styles={{
              options: {
                zIndex: 10000,
                primaryColor: 'linear-gradient(180deg,#b4ec51,#429321)',
              },
            }}
          />
        )}

        <div className="lobby-background" />
        {!helpPageOpen ? (
          <>

            <Row className="content">
              <Col sm="3" style={{ marginTop: 50 }}>
                <Row className="menu-player-info">
                  <Col xs="6" sm="6" className="menu-player-info-left">
                    <div className="menu-player-avatar">
                      <img src={member && member.photo ? member.photo : defaultImage} alt="" />
                    </div>
                    <div className="menu-player-level-wrapper">
                      <div className="menu-player-level">
                        <div className="menu-player-level-text">
                          {member && member.level !== undefined && member.level}
                        </div>
                      </div>
                    </div>
                  </Col>
                  <Col xs="6" sm="6" className="menu-player-info-right">
                    <Row style={{ marginTop: 5, marginBottom: 5 }}>
                      <div className="menu-player-name">{member && member.name}</div>
                    </Row>
                    <Row style={{ marginTop: 5, marginBottom: 5 }}>
                      {member && member.balance !== undefined && (
                      <div className="menu-player-balance">
                        <Media src={coinImg} className="menu-player-balance-coin" />
                        <div className="menu-player-balance-text">
                          {member.balance}
                        </div>
                      </div>
                      )}
                    </Row>
                  </Col>
                </Row>
                <Row>
                  <Col sm="12">
                    <NewGame
                      GameBetMap={GameBetMap}
                      createRoom={createRoom}
                      lvl={member.level}
                      changeTab={this.toggle}
                      member={member}
                      privateRoomPassword={privateRoomPassword}
                      showPrivateRoomPassword={showPrivateRoomPassword}
                      closePrivateRoomPassword={closePrivateRoomPassword}
                      toggleNewGameParameter={toggleNewGameParameter}
                      setNewBet={setNewBet}
                      userSettings={userSettings}
                      joinedRoom={rooms && member && member.joinedRooms && (rooms[Object.keys(member.joinedRooms)[0]]) ? rooms[Object.keys(member.joinedRooms)[0]] : null}
                      playButtonSound={playButtonSound}
                    />
                  </Col>
                </Row>
                <Row>
                  <Col sm="12" className="online-stats">
                    {t('menu.onlineCount')}: <span>{`${usersCount} ${t('menu.players')}, ${roomsCount} ${t('menu.rooms')}`}</span>
                  </Col>
                </Row>
                <Row>
                  <Col sm="12">
                    <ShopBonus changeTab={this.toggle} member={member} activeTab={activeTab}/>
                  </Col>
                </Row>
              </Col>
              <Col sm="9">

                <div className="logo-wrapper">
                  <div className="logo" />
                </div>

                <Row className="tabs" style={{ marginTop: 90, padding: '25px 15px' }}>
                  <Col sm="12">
                    <Row style={{ border: 0 }}>

                      <Col xs="3" sm="3" className="menu-topTab">
                        <div className={`menu-topTab-wrapper ${activeTab === '1' && 'active'}`}>
                          <NavLink
                            className="menu-topTab-link"
                            onClick={() => { this.toggle('1'); }}
                          >
                            {t('menu.rooms')}
                          </NavLink>
                        </div>
                      </Col>
                      <Col xs="3" sm="3" id="top-tab" className="menu-topTab top-tab">
                        <div className={`menu-topTab-wrapper ${activeTab === '2' && 'active'}`}>
                          <NavLink
                            className="menu-topTab-link"
                            onClick={() => { this.toggle('2'); }}
                          >
                            {t('menu.top')}
                          </NavLink>
                        </div>
                      </Col>
                      <Col xs="3" sm="3" className="menu-topTab my-info-tab">
                        <div className={`menu-topTab-wrapper ${activeTab === '3' && 'active'}`}>
                          <NavLink
                            className="menu-topTab-link"
                            onClick={() => { this.toggle('3'); }}
                          >
                            {t('menu.myInfo')}
                          </NavLink>
                        </div>
                      </Col>
                      <Col xs="3" sm="3" className="menu-topTab tournaments-tab">
                        <div className={`menu-topTab-wrapper ${activeTab === '6' && 'active'}`}>
                          <NavLink
                            className="menu-topTab-link"
                            onClick={() => { this.toggle('6'); }}
                          >
                            {t('menu.tournaments')}
                          </NavLink>
                        </div>
                      </Col>

                    </Row>
                  </Col>
                </Row>

                <TabContent activeTab={activeTab}>
                  <TabPane className="main-tab-pane" tabId="1">
                    <Row>
                      <Col xs="12" sm="12">
                      {activeTab && activeTab === '1' && (
                        <RoomsTable
                          userSettings={userSettings}
                          GameBetMap={GameBetMap}
                          GameTypeMap={GameTypeMap}
                          rooms={rooms}
                          myRooms={myRooms}
                          joinRoom={joinRoom}
                          level={member.level}
                          uid={(uid && uid.toString()) || ''}
                          leaveRoom={leaveRoom}
                          member={member}
                          joinedRooms={member.joinedRooms}
                          privateRoomPassword={privateRoomPassword}
                          playButtonSound={playButtonSound}
                        />
                      )}
                      </Col>
                    {/*  <Col xs="4" sm="4">
                        <OnlineUsers
                          onlineUsers={onlineUsersLazy}
                          member={member}
                          fetchOnlineUsersLazy={fetchOnlineUsersLazy}
                          changeSortFilter={changeSortFilter}
                          changeSortDirection={changeSortDirection}
                        />
                      </Col>  */}
                    </Row>
                  </TabPane>
                  <TabPane className="main-tab-pane" tabId="2">
                    <Row>
                      <Col sm="12">
                      {activeTab && activeTab === '2' && (
                        <TopPage
                          leaderboardData={leaderboard}
                          myLeaderboard={myLeaderboard}
                          refetchLeaderboard={this.refetchLeaderboard}
                          fetchLeaderboardYear={fetchLeaderboardYear}
                          fetchLeaderboardMonth={fetchLeaderboardMonth}
                          fetchLeaderboardWeek={fetchLeaderboardWeek}
                          fetchLeaderboardDaily={fetchLeaderboardDaily}
                          fetchPositionInLeaderboardYear={fetchPositionInLeaderboardYear}
                          fetchPositionInLeaderboardMonth={fetchPositionInLeaderboardMonth}
                          fetchPositionInLeaderboardWeek={fetchPositionInLeaderboardWeek}
                          fetchPositionInLeaderboardDaily={fetchPositionInLeaderboardDaily}
                          playButtonSound={playButtonSound}
                        />
                      )}
                      </Col>
                    </Row>
                  </TabPane>
                  <TabPane className="main-tab-pane" tabId="3">
                    {activeTab && activeTab === '3' && (
                      <MyInfo
                        member={member}
                        myTournamentsData={myTournamentsData}
                        leaderboardData={leaderboard && leaderboard.leaderboard}
                        changeTab={this.toggle}
                        playButtonSound={playButtonSound}
                      />
                    )}
                  </TabPane>
                  <TabPane className="main-tab-pane" tabId="4">
                    <Row>
                      <Col sm="12">
                        <BonusPage
                          member={member}
                          spinWheel={spinWheel}
                          claimSpin={claimSpin}
                          changeTab={this.toggle}
                          sendMoney={sendMoney}
                          playButtonSound={playButtonSound}
                        />
                      </Col>
                    </Row>
                  </TabPane>
                  <TabPane className="main-tab-pane" tabId="5">
                    <Row>
                      <Col sm="12">
                        <BuyPage
                          member={member}
                          initFBPayment={initFBPayment}
                          fbPaymentCallback={fbPaymentCallback}
                          sendMoney={sendMoney}
                          initDraugiemPayment={initDraugiemPayment}
                          playButtonSound={playButtonSound}
                          initStripePayment={initStripePayment}
                        />
                      </Col>
                    </Row>
                  </TabPane>
                  {activeTab && activeTab === '6' && (
                  <TabPane className="main-tab-pane" tabId="6">
                    <Row>
                      <Col sm="12">
                        <Tournaments
                          member={member}
                          tournaments={tournaments}
                          tournamentPlayers={tournamentPlayers}
                          myTournamentsData={myTournamentsData}
                          joinTournament={joinTournament}
                          joinTournamentRoom={joinTournamentRoom}
                          fetchTournamentPlayers={fetchTournamentPlayers}
                          buyTournamentMoney={buyTournamentMoney}
                          cancelWaitRoom={cancelWaitRoom}
                          leaveTournament={leaveTournament}
                          changeTab={this.toggle}
                        />
                      </Col>
                    </Row>
                  </TabPane>
                  )}
                  {activeTab && activeTab === '7' && (
                  <TabPane className="main-tab-pane" tabId="7">
                    <Row>
                      <Col sm="12">
                        <TournamentsHistory
                          member={member}
                          tournamentsHistory={tournamentsHistory}
                          tournamentsHistoryPlayers={tournamentsHistoryPlayers}
                          fetchTournamentsHistory={fetchTournamentsHistory}
                          fetchTournamentHistory={fetchTournamentHistory}
                          changeTab={this.toggle}
                        />
                      </Col>
                    </Row>
                  </TabPane>
                  )}
                  {activeTab && activeTab === '9' && (
                  <TabPane className="main-tab-pane" tabId="9">
                    <Row>
                      <Col sm="12">
                        <Friends
                          member={member}
                          changeTab={this.toggle}
                          fetchFBFriends={fetchFBFriends}
                          fbFriends={member.fbFriends}
                          sendMoney={sendMoney}
                          playButtonSound={playButtonSound}
                        />
                      </Col>
                    </Row>
                  </TabPane>
                  )}
                  {activeTab && activeTab === '10' && (
                  <TabPane className="main-tab-pane" tabId="10">
                    <Row>
                      <Col sm="12">
                        <IgnoredUsers
                          member={member}
                          changeTab={this.toggle}
                          fetchIgnoredPlayers={fetchIgnoredPlayers}
                          unBlockUser={unBlockUser}
                          playButtonSound={playButtonSound}
                        />
                      </Col>
                    </Row>
                  </TabPane>
                  )}
                  {activeTab && activeTab === '11' && (
                  <TabPane className="main-tab-pane" tabId="11">
                    <Row>
                      <Col sm="12">
                        <Achievements
                          member={member}
                          changeTab={this.toggle}
                          fetchAchievements={fetchAchievements}
                        />
                      </Col>
                    </Row>
                  </TabPane>
                  )}
                </TabContent>
              </Col>
            </Row>
            <Row className="bottom-bar">
              <Col sm="12" className="bottom-bar-links">
                  <a href="#" className={`bottom-bar-links-help ${member.supportChatStatus && member.supportChatStatus.read === false ? 'incoming':''}`} onClick={(e)=> { e.preventDefault(); this.toggleSupport(e); }}>
                    <Media src={helpImg} />
                    <span>
                      {t('menu.help')}
                    </span>
                    {supportModalOpen && (
                      <ContactSupport
                        modalOpen={supportModalOpen}
                        readSupportChat={readSupportChat}
                        toggle={this.toggleSupport}
                        uid={member.uid}
                        name={member.name}
                        supportChat={member.supportChat}
                        supportChatStatus={member.supportChatStatus}
                        submitError={submitError}
                        lastRoom={lastRoom}
                        lastJoinedRoom={lastJoinedRoom}
                        resetClose={resetCloseErrorSubmit}
                        closeErrorSubmit={closeErrorSubmit}
                        showNotification={showNotification}
                        sendSupportMessage={sendSupportMessage}
                        setSupportAsRead={setSupportAsRead}
                      />
                    )}
                  </a>
                  <a href="#" onClick={(e)=> { e.preventDefault(); this.handleClickStart(e); }}>
                    <Media src={quickHelpImg} />
                    <span>
                      {t('menu.tutorial')}
                    </span>
                  </a>
                  <a href="#" onClick={(e)=> { e.preventDefault(); this.toggleBalanceHistory(e); }}>
                    <Media className="balance-hist-ico" src={moneyHistoryImg} />
                    <span>
                      {t('menu.moneyHistory')}
                    </span>
                  </a>
                  <a href="#" onClick={(e)=> { e.preventDefault(); this.toggleBannedUsers(e); }}>
                    <Media src={blockedUsersImg} />
                    <span>
                      {t('menu.bannedUsers')}
                    </span>
                  </a>
                  <a href="#" onClick={(e)=> { e.preventDefault(); this.toggleHelp(e); }}>
                    <Media src={gameHelpImg} />
                    <span>
                      {t('menu.helpPage')}
                    </span>
                  </a>

                  <div className="version-wrapper">
                    <div className="version">
                      Draxo Games 2020, {`v${currentVersion}`}
                    </div>
                  </div>
              </Col>

            </Row>
          </>
        ) : (
          <div className="rules-page">
            <Row className="rules-page-header">
              <Col>
                <Row>
                  <Col sm="6">

                  </Col>
                  <Col sm="6">
                    <Button style={{ float: 'right' }} className="help-button" onClick={this.toggleHelp}>
                      <Media src={closeImg} className="notification-header-close" alt="X" />
                    </Button>
                  </Col>
                </Row>
                <Row>
                  <Col sm={{size: 2, offset: 2}} className="rules-page-tab">
                    <div className={`rules-page-tab-wrapper ${helpTab === '1' && 'active'}`}>
                      <NavLink
                        className="rules-page-tab-link"
                        onClick={() => { this.toggleHelpTab('1'); }}
                      >
                        {t('menu.rules')}
                      </NavLink>
                    </div>
                  </Col>
                  <Col sm="2" className="rules-page-tab">
                    <div className={`rules-page-tab-wrapper ${helpTab === '2' && 'active'}`}>
                      <NavLink
                        className="rules-page-tab-link"
                        onClick={() => { this.toggleHelpTab('2'); }}
                      >
                        Apzīmējumi
                      </NavLink>
                    </div>
                  </Col>
                  <Col sm="2" className="rules-page-tab">
                    <div className={`rules-page-tab-wrapper ${helpTab === '3' && 'active'}`}>
                      <NavLink
                        className="rules-page-tab-link"
                        onClick={() => { this.toggleHelpTab('3'); }}
                      >
                        {t('menu.money')}
                      </NavLink>
                    </div>
                  </Col>
                  <Col sm="2" className="rules-page-tab">
                    <div className={`rules-page-tab-wrapper ${helpTab === '4' && 'active'}`}>
                      <NavLink
                        className="rules-page-tab-link"
                        onClick={() => { this.toggleHelpTab('4'); }}
                      >
                        {t('menu.levels')}
                      </NavLink>
                    </div>
                  </Col>
                  <Col sm="2" className="rules-page-tab">
                    <div className={`rules-page-tab-wrapper ${helpTab === '5' && 'active'}`}>
                      <NavLink
                        className="rules-page-tab-link"
                        onClick={() => { this.toggleHelpTab('5'); }}
                      >
                        {t('menu.faq')}
                      </NavLink>
                    </div>
                  </Col>
                </Row>
              </Col>
            </Row>
            <Row className="rules-page-content">
              <Col sm="12">
                <TabContent className="rules-page-content-tab" activeTab={helpTab}>
                  <TabPane tabId="1">
                    <Row>
                      <Col sm="12">
                        <b className="rules-page-text-header">Kārtis un to stiprumi </b>
                        <p>
                          Spēlē izmanto 26 kārtis. Kāravi, sākot no dūža līdz septītniekam, pārējie masti no dūža līdz devītniekam.
                        </p>
                        <b className="rules-page-text-header">Spēles uzsākšana</b>
                        <p>Spēli var uzsākt divos veidos:</p>
                        <ul>
                          <li>
                            Labajā pusē esošajā izvēlnē izvēlēties vēlamo likmi un spiest pogu '<b>Sākt spēli</b>', pēc kā automātiski atvērsies izveidotā istaba. Tad sagaidi, kamēr Tev pievienosies vēl 2 spēlētāji un spēle automātiski uzsāksies.
                          </li>
                          <li>
                            Var pievienoties spēlēm, kas redzamas logā '<b>Kopējā istaba</b>', nospiežot uz pogas '<b>Pievienoties</b>'.
                          </li>
                        </ul>
                        <b className="rules-page-text-yellow">Spēles veidi</b>
                        <p>Izšķir vairākus pēc būtības atšķirīgus zoles spēlēšanas veidus:</p>
                        <ul>
                          <li>Parastā zole (atzīmēta spēļu izvēlnē ar P) – mērķis savākt vismaz 61 punktu.</li>
                          <li>Mazā zole (atzīmēta spēļu izvēlnē M) – mērķis nesavākt nevienu stiķi (kārti);</li>
                          <li>Galdiņš (atzīmēta spēļu izvēlnē ar G) – mērķis savākt pēc iespējas mazāk stiķu.</li>
                        </ul>
                        <b className="rules-page-text-yellow">Spēles gaita</b>
                        <p>
                Kārtis tiek izdalītas automātiski. Katram spēlētājam secīgi tiek dota iespēja sākt spēli. Spēlētājs vai nu uzņem 2 galda kārtis vai arī ‘laiž garām’ gājienu. Pēc tam to pašu dara nākošais un, ja arī tas ‘laiž garām', tad beidzot trešais. Tam, kurš atklāj spēli (šo spēlētāju sauc par 'lielo’) ir jāspēlē vienam pret pārējiem diviem, kuri savus stiķus skaita kopā.
                        </p>
                        <p>
                ‘Lielais’ paņem no galda 2 kārtis un pievieno tās pie savām. No šīm 10 kārtīm viņš var nolikt (žargonā - ‘norakt') jebkuras 2 kārtis pēc savas izvēles, kā tas viņam izdevīgāk. Pirmo gājienu izdara tas spēlētājs, kuram pirmajam bija iespēja izvēlēties 2 galda kārtis (bija'pirmā roka’). Gadījumā, ja neviens spēles dalībnieks nevēlas atklāt spēli un visi nopasē, tad iespējami divi varianti:
                        </p>
                        <ul>
                          <li>spēlē ar galdiņa variantu tiek izspēlēts galdiņš;</li>
                          <li>parastajā zoles variantā tiek izveidota kopējā pule (kas vēlāk dod papildus punktus nākamās partijas uzvarētājam).</li>
                        </ul>
                        <p>‘Palaist garām’ var vairākas reizes.</p>
                        <b  className="rules-page-text-yellow">Punktu skaitīšana un spēles rezultāts</b>
                        <p>Katrai iegūtajai kārtij ir atšķirīgs punktu skaits:</p>
                        <div>

                          <table className="rules-page-body-table">
                            <tr>
                              <th className="">Kārts</th>
                              <th className="">Punkti</th>
                            </tr>
                            <tr>
                              <td className="">Dūzis</td>
                              <td className="">11</td>
                            </tr>
                            <tr>
                              <td className="">Desmitnieks</td>
                              <td className="">10</td>
                            </tr>
                            <tr>
                              <td className="">Kungs</td>
                              <td className="">4</td>
                            </tr>
                            <tr>
                              <td className="">Dāma</td>
                              <td className="">3</td>
                            </tr>
                            <tr>
                              <td className="">Devītnieks</td>
                              <td className="">0</td>
                            </tr>
                            <tr>
                              <td className="">Astotnieks</td>
                              <td className="">0</td>
                            </tr>
                            <tr>
                              <td className="">Septītnieks</td>
                              <td className="">0</td>
                            </tr>
                          </table>
                          <br/>
                        </div>
                        <b>Pules</b>
                        <p>
                Parastajā zolē, vairakkārt nopasējot, var sakrāties vairākas pules. Nākošās spēles spēlētājs vinnējot saņem attiecīgo punktu daudzumu ne tikai no spēles pretiniekiem, bet arī papildus pa punktam no katra spēlētāja. Ja ir jau vismaz viena pule, un spēlētājs spēlējot kā lielais zaudē, viņš saņem personīgo puli. To var izņemt viņš pats vinējot spēli, bet nekādus papildus punktus nesaņemot. Ja personīgo puli izņem kāds cits, viņš saņem papildus 2 punktus no pules īpašnieka.
                        </p>
                        <p>
                Vinnējot zoli, saņem no katra spēlētāja pa 5 punktiem, zaudējot atdod pa 6 katram. Zolē papildus punkti pienākas par 91
                        </p>
                        <p>
                Jebkurā brīdī, spēlētājs, kas paņēmis 2 kārtis un spēlē kā ‘lielais', var nomest kārtis ('atmesties'). Šajā gadījumā visu neizspēlēto kāršu punkti tiek pieskaitīti 'mazajiem’.
                        </p>
                        <b className="rules-page-text-yellow">
                Spēles iznākums
                        </b>
                        <table className="rules-page-body-table">
                          <tr>
                            <th className="">Spēles iznākums</th>
                            <th className="">Punkti Lielajam</th>
                            <th className="">Punkti katram mazajam</th>
                          </tr>
                          <tr>
                            <td className="">Lielais vinnē parasto partiju ar 61-90 punktiem</td>
                            <td className="">+2</td>
                            <td className="">-1</td>
                          </tr>
                          <tr>
                            <td className="">Lielais vinnē parasto partiju ar 91-120 punktiem</td>
                            <td className="">+4</td>
                            <td className="">-2</td>
                          </tr>
                          <tr>
                            <td className="">Lielais vinnē parasto partiju, mazajiem nesavācot nevienu stiķi</td>
                            <td className="">+6</td>
                            <td className="">-3</td>
                          </tr>
                          <tr>
                            <td className="">Lielais zaudē parasto partiju ar 31-60 punktiem</td>
                            <td className="">-4</td>
                            <td className="">+2</td>
                          </tr>
                          <tr>
                            <td className="">Lielais zaudē parasto partiju ar 0-29 punktiem</td>
                            <td className="">-6</td>
                            <td className="">+3</td>
                          </tr>
                          <tr>
                            <td className="">Lielais zaudē parasto partiju, nesavācot nevienu stiķi</td>
                            <td className="">-8</td>
                            <td className="">+4</td>
                          </tr>
                          <tr>
                            <td className="">Lielais vinnē ZOLI ar 61-90 punktiem</td>
                            <td className="">+ 10</td>
                            <td className="">-5</td>
                          </tr>
                          <tr>
                            <td className="">Lielais vinnē ZOLI ar 91-120 punktiem</td>
                            <td className="">+12</td>
                            <td className="">-6</td>
                          </tr>
                          <tr>
                            <td className="">Lielais vinnē ZOLI, mazajiem nesavācot nevienu stiķi</td>
                            <td className="">+14</td>
                            <td className="">-7</td>
                          </tr>
                          <tr>
                            <td className="">Lielais zaudē ZOLI ar 31-60 punktiem</td>
                            <td className="">-12</td>
                            <td className="">+6</td>
                          </tr>
                          <tr>
                            <td className="">Lielais zaudē ZOLI ar 0-29 punktiem</td>
                            <td className="">-14</td>
                            <td className="">+7</td>
                          </tr>
                          <tr>
                            <td className="">Lielais zaudē ZOLI, nesavācot nevienu stiķi</td>
                            <td className="">-16</td>
                            <td className="">+8</td>
                          </tr>
                          <tr>
                            <td className="">Kopējā pule, uzvar lielais</td>
                            <td className="">+2</td>
                            <td className="">-1</td>
                          </tr>
                          <tr>
                            <td className="">Kopējā pule, zaudē lielais</td>
                            <td className="">Tiek ierakstīta personīgā pule</td>
                            <td className="">-</td>
                          </tr>
                          <tr>
                            <td className="">Personīgā pule, uzvar lielais</td>
                            <td className="">+2</td>
                            <td className="">2 (tikai no personīgās pules īpašnieka)</td>
                          </tr>
                        </table>
                        <p>
                Punkti tiek uzskaitīti katrā partijā atsevišķi un summēti kopā. Savu iegūto punktu summu vari aplūkot sadaļā „Statistika”.
                        </p>
                        <p>
                Par spēles pamešanu, neatkarīgi no spēles pamešanas iemesla (tīša spēles pamešana, zudis Intereta savienojums, nepietiekams virtuālās naudas apjoms spēles turpināšanai u.c.), spēli pametušajam spēlētājam tiek noņemti 8 punkti reiz konkrētās spēles istabas likme. Punkti par spēles pamešanu (neatkarīgi no iemesla) nekādā veidā netiek kompensēti.
                        </p>
                        <b className="rules-page-text-yellow">Aizliegumi</b>
                        <p>Spēles lietotājiem aizliegts:</p>
                        <ol>
                          <li>
                Izmantot draugiem.lv vai facebook.com lietotāja profilu, kas izveidots vai tiek izmantots pretēji sociālo tīklu lietošanas noteikumiem.
                          </li>
                          <li>
                Jebkādā veidā izpaust savas kārtis pretiniekiem, kā arī saspēlēties ar kādu no spēlētājiem nolūkā iegūt konkrētam spēlētājam labvēlīgu rezultātu;
                          </li>
                          <li>
                Lietot necenzētus, godu un cieņu aizskarošus vārdus spēles čata logā vai sarakstē ar spēlētājiem un/vai spēles administrāciju jebkurā valodā un veidā, kā arī jebkādā veidā nepamatoti apvainot spēlētājus vai spēles administrāciju;
                          </li>
                          <li>
                Izteikt cilvēka cieņu, rasi, reliģisko piederību aizskarošas frāzes čatā un/vai sarakstē ar spēles administrāciju jebkurā valodā un veidā;
                          </li>
                          <li>
                Veikt jebkāda veida darbības, kas traucē pilnvērtīgu spēles izmantošanu citiem spēlētājiem;
                          </li>
                          <li>
                Veikt jebkāda veida darbības, kas saistītas ar trešo pušu produktu vai pakalpojumu reklamēšanu spēlē Zole bez iepriekšējas saskaņošanas ar spēles administrāciju.
                          </li>
                        </ol>
                        <p>
                Spēles administrācija patur tiesības bloķēt spēlētāja piekļuvi spēlei bez iepriekšējā brīdinājuma uz nenoteiktu laiku pēc saviem ieskatiem. Spēlētāja bloķēšanas gadījumā spēlēs izmantotās vLs summas nekādā veidā netiek kompensētas.
                        </p>
                        <b className="rules-page-text-yellow">Ieteikumi iesācējiem</b>
                        <p>
                Zoles „zelta likums”: caur savējo ej ar vienīgo! Respektīvi, mazais, izdarot gājienu caur otru mazo, liek tās masts kārti, kas ir vienīgā uz rokas.
                        </p>
                        <p>
                Ievēro, ka spēlē ir 14 trumpes. Ir svarīgi sekot līdzi atlikušo trumpju skaitam spēles laikā. Mazajiem jācenšas iegūt punktus no trumpju desmitnieka un dūža (viens no mazajiem liek dūzi vai desmitnieku uz trupmes, ar kuru izgājis lielais, ja ir pārliecība, ka otram mazajam ir trumpe, kas spēcīgāka par lielā izlikto).
                        </p>
                        <p>
                Ja, spēlējot kā lielajam, ir daudz „lieku” kāršu un grūti izvēlēties, kuras 2 kārtis „norakt, tad vēlams rokās paturēt vienas masts liekās kārtis.
                        </p>
                        <p>
                Ja lielais spēlē ZOLI, tad mazajiem jācenšas iziet ar (netrumpes) dūzi, jo ir relatīvi liela iespējamība, ka lielajam būs kāda netrumpes kārts, kas mazāka par dūzi (ņemot vērā, ka nav iespēja „norakt” kārtis). Tā kā spēles situāciju ir daudz, augstāk minētie ieteikumi nav universāli piemērojami jebkurā situācijā. Spēles izpratni var iegūt tikai spēlējot. Tādēļ atliek tikai mēģināt.
                        </p>
                      </Col>
                    </Row>
                  </TabPane>
                  <TabPane tabId="2">
                    <Row>
                      <Col sm="12">
                        <table className="rules-page-desc-table">
                          <tr>
                            <td className="rules-page-desc-table-label">P</td>
                            <td className="rules-page-desc-table-desc">parastā zole</td>
                          </tr>
                          <tr>
                            <td className="rules-page-desc-table-label">G</td>
                            <td className="rules-page-desc-table-desc">zole ar galdiņu</td>
                          </tr>
                          <tr>
                            <td className="rules-page-desc-table-label">M</td>
                            <td className="rules-page-desc-table-desc">mazā zole</td>
                          </tr>
                          <tr>
                            <td className="rules-page-desc-table-label"><img src={fast} alt="atra" style={{ display: 'inline-block', height: 25, width: 25 }} /></td>
                            <td className="rules-page-desc-table-desc">ātrā istaba, kurā būs samazināts gājiena laiks (5 sekundes)</td>
                          </tr>
                          <tr>
                            <td className="rules-page-desc-table-label">Iziet</td>
                            <td className="rules-page-desc-table-desc">iziet no istabas</td>
                          </tr>
                        </table>

                      </Col>
                    </Row>
                  </TabPane>
                  <TabPane tabId="3">
                    <Row>
                      <Col sm="12">
                        <b className="rules-page-text-header">
                    Kas ir virtuālā nauda jeb spēles EUR?
                        </b>
                        <p>
                    Uzsākot spēli, katram spēlētājam sākotnēji tiek piešķirti EUR 500. Spēlēt iespējams tik ilgi kamēr spēlētāja virtuālajā kontā ir pietiekami daudz EUR. Ja virtuālā nauda ir beigusies, to iespējams papildus iegādāties sadaļā ‘Veikals’. Virtuāla nauda jeb spēles EUR ir paredzēta tikai tehniskai spēles nodrošināšanai, tā nevar nekādā veidā tikt izmaksāta, apmainīta vai aizstāta ar reālu naudu vai cita veida materiālajām vērtībām, vai balvām.
                        </p>
                        <b>
                    Punkti un spēles EUR
                        </b>
                        <p>
                    Veidojot jaunu istabu, Tu vari noteikt kāda būs punktu un spēles EUR attiecība.
                        </p>
                        <p>
                  Piemērs: Punkti : EUR ir 1:20, tad par katru zaudēto zoles punktu spēlē Tu zaudēsi 20 EUR. Par spēles uzsākšanu tiek paņemti 20% no spēles likmes.
                        </p>
                        <p>
                  Piemērs:
                        </p>
                        <p>
                  Punkti : EUR - 1:10, spēle beidzas ar rezultātu:
                        </p>
                        <p>
                  Jānis +5; Andris -2; Kārlis – 3.
                        </p>
                        <p className="rules-page-text-header">
                  Spēles naudas izmaksas:
                        </p>
                        <p>
                  Jānis +50 EUR; Andris -20 EUR; Kārlis –30 EUR.
                        </p>
                        <p>
                  Par pieslēgšanos istabai vai par jaunas istabas izveidi maksa ir 20% no likmes. Piemēram, ja likme ir 1:5, tad 1 EUR, ja 1:50, tad pievienošanās maksa būs 10 EUR.
                        </p>
                        <b>
                  Minimālais EUR apmērs, lai uzsāktu spēli
                        </b>
                        <p>
                  Šādai minimālajai spēles EUR summai ir jābūt Tavā virtuālajā kotā, lai sāktu spēli:
                        </p>
                        <ul>
                          <li>
                            162 EUR istabai ar attiecību 1:10 EUR par punktu
                          </li>
                          <li>
                            405 EUR istabai ar attiecību 1:25 EUR par punktu
                          </li>
                          <li>
                            810 EUR istabai ar attiecību 1:50 EUR par punktu.
                          </li>
                          <li>
                            1 620 EUR istabai ar attiecību 1:100 EUR par punktu.
                          </li>
                          <li>
                            8 100 EUR istabai ar attiecību 1:500 EUR par punktu.
                          </li>
                          <li>
                            16 200 EUR istabai ar attiecību 1:1000 EUR par punktu.
                          </li>
                          <li>
                            81 000 EUR istabai ar attiecību 1:5000 EUR par punktu.
                          </li>
                          <li>
                            162 000 EUR istabai ar attiecību 1:10000 EUR par punktu.
                          </li>
                        </ul>
                        {/*    <p>
                  +20% no likmes par spēles uzsākšanu
                        </p> */}
                        <b>
                  Draugu uzaicināšana
                        </b>
                        <p>
                    Spēles administrācija var piešķirt papildus spēles EUR par uzaucinātajiem draugiem gadījumos, kad konkrētie uzaicinātie cilvēki līdz tam nav reģistrējušies (spēlējuši) zolē. Spēles EUR tiek piešķirti tikai pēc tam, kad uzaicinātais draugs ir lietojis Zole aplikāciju (iespēja vēl nav pilnbā iestrādāta spēlē).
                        </p>
                        <b className="rules-page-text-header">
                  Dienas bonuss
                        </b>
                        <p>
                  Reizi 24 stundās spēlētājs var iegriezt laimes ratu un laimēt kādu no pieejamajām spēles naudas balvām (līdz pat 100 EUR).
                        </p>
                      </Col>
                    </Row>
                  </TabPane>
                  <TabPane tabId="4">
                    <Row>
                      <Col sm="12">
                      <b className="rules-page-text-yellow">
                        Spēlētāja līmenis
                      </b>
                      <p>
                      Katra spēlētāja līmenis tiek aprēķināts pēc šāda algoritma:
                      </p>

                      <table className="rules-page-levels-table">
                        <tr>
                          <td className="rules-page-levels-table-header">Spēlētāja līmenis</td>
                          <td className="rules-page-levels-table-header">Izspēlētās spēles</td>
                          <td className="rules-page-levels-table-header">Iegūtie punkti</td>
                        </tr>
                        <tr>
                          <td>1</td>
                          <td>0</td>
                          <td>0</td>
                        </tr>
                        <tr>
                          <td>2</td>
                          <td>Vismaz 5</td>
                          <td>Jebkāds</td>
                        </tr>
                        <tr>
                          <td>3</td>
                          <td>Vismaz 10</td>
                          <td>Jebkāds</td>
                        </tr>
                        <tr>
                          <td>4</td>
                          <td>Vismaz 20</td>
                          <td>Vismaz 10</td>
                        </tr>
                        <tr>
                          <td>Katrs nākamais līmenis</td>
                          <td>Vismaz (Iepriekšējā līmeņa x 1.2)</td>
                          <td>Vismaz (Iepriekšējā līmeņa + 5)</td>
                        </tr>
                      </table>

                      <p>
                      Ja spēlētājs ir sasniedzis noteiktu līmeni, tas vairs nesamazinās. Piemēram, ja spēlētājam ir līmenis 10 un viņa punkti ir kritušies, viņš vairs nevar nonākt līmenī 9.
                      </p>
                      <p>
                      Spēlētāja līmenis tiek attēlots pie profila attēla kā cipars sarkanā aplītī.
                      </p>

                      </Col>
                    </Row>
                  </TabPane>
                  <TabPane tabId="5">
                    <Row>
                      <Col sm="12">
                        <b className="rules-page-text-yellow">
                          J: Ko darīt, ja esmu atradis spēlē kļūdu?
                        </b>
                        <p>
                          A: Spiediet uz pogas ‘Sazināties ar atbalstu’, lai atvērtu čata logu un sāktu sarunu ar administrāciju. Tiklīdz kāds no administrācijas būs pieejams online, tā Tev tiks sniegta atbilde. Ja kļūda tiks precīzi aprakstīta un tā skar lielu daļu spēlētāju, vai arī ja regulāri palīdzēsi testēt spēli un ziņot par spēles nepilnībām, tad spēles administrācija pirmajiem ziņotājiem var izteikt pateicību, piešķirot balvu spēles naudā vai arī citu balvu veidolā.
                        </p>
                        <b className="rules-page-text-yellow">
                          J: Man ir ideja, kuru vēlos redzēt spēlē - kā man rīkoties, lai to ieviestu?
                        </b>
                        <p>
                          A: Sazinieties ar administrāciju, spiežot uz pogas ‘Sazināties ar atbalstu’. Mēs - spēles administrācija - vienmēr esam atvērti jaunām idejām un ievedumiem, ja vien tās atbilst vispārējam spēles konceptam, ir reāli ieviešamas un gūs atbalstu arī no citu spēlētāju puses.
                        </p>
                        <b className="rules-page-text-yellow">
                          J: Kas ir turnīri un kā tajos piedalīties?
                        </b>
                        <p>
                          A: Spēlē ik pēc noteikta laika tiek rīkotas īpašas sacensības jeb turnīri. Katrs turnīrs ilgst noteiktu laiku un tajā var reģistrēties, samaksājot iestāšanos maksu,. Turnīrā pastāv atsevišķi nodalīta spēles nauda jeb turnīra EUR. Katrā turnīrā var būt atšķirīga likme un nosacījumi, kā arī iespējamās balvas.
                        </p>
                      </Col>
                    </Row>
                  </TabPane>
                </TabContent>
              </Col>
            </Row>
          </div>
        )}
        {member && member.uid && (
        <Modal size="lg" isOpen={!member.firstTimeModal} toggle={this.closeFirstTime} className="firstTimeModal">
          <ModalHeader
            toggle={this.closeFirstTime}
            close={
              <Media src={closeImg} className="notification-header-close" alt="X" onClick={this.closeFirstTime} />
            }
          >
            Sveiciens jaunajā Zoles versijā!
          </ModalHeader>
          <ModalBody style={{ textTransform: 'none', fontSize: 13, lineHeight: 1.35 }}>
            <p>Sveiciens jaunajā Zoles versijā!</p>
            <p>
              Šī ir jauna spēles versija, pie kuras esam strādājuši pēdējo mēnešu laikā. Dati par spēlētājiem (iegūtie punkti, spēles nauda, TOP rezultāti u.c.) ir saglabāti no vecās spēles versijas, tomēr ir dzēsti veco turnīru dati, kā arī sasniegumi un esošie rangi (to vietā nāks citi).
            </p>
            <p>
              Ar ko tad šī versija atšķiras no iepriekšējās - vecās Zoles versijas:
            </p>
            <ul>
              <li>- pilnīgi jauns izskats un dizains;</li>
              <li>- atteikšanās no Flash un ar to saistītajām problēmām (nevarēja atvērt spēli un savienojuma pazušana);</li>
              <li>- dienas bonuss jeb laimes rats, kuru var iegriezt reizi dienā un iegūt kādu no naudas balvām, tāpat arī turnīros tagad piedāvāsim vairāk reālas balvas;</li>
              <li>- sākuma bonuss jaunajiem spēlētājiem tagad ir 500 Zoles monētas un vēl izdevīgāki piedāvājumi veikalā;</li>
              <li>- pārveidota līmeņu uzskaites sistēma;</li>
              <li>- čats jeb tieša saziņa ar administrāciju, lai ziņotu par kļūdām un problēmām, un izteiktu ierosinājumus;</li>
              <li>- iespēja redzēt savas bilanca vēsturi un izmaiņas par pēdējām 3 dienām;</li>
              <li>- jauni iegūstami sasniegumi;</li>
              <li>- iespēja ievietot kādu spēlētāju ignorēto sarakstā, lai nespēlētu vienā istabā;</li>
              <li>- draugu uzaicināšana un citas lietas.</li>
            </ul>
            <p>
              Tā kā sūdzību skaits par veco versiju un tajā sastopamajām kļūdām arvien pieauga, izlēmām uzstādīt jauno versiju mazliet ātrām, tāpēc atsevišķas lietas vēl nav pielnībā ieviestas, tāpat arī ir iespējams kādas kļūdas vai vizuālas nepilnības, pie kuru novēršanas cītīgi tagad strādāsim. Nākamā gada sākumā būs pieejama arī mobilā aplikācija Android un iOS platformās.
            </p>
            <p>
              Visos spēles skatos ir pieejama poga ‘Tehniskā Palīdzība’ jeb čats - ar tā palīdzību varat ērti un ātri ziņot par jebkādu novērotu kļūdu, nepilnību vai vienkārši viedokli par jauno versiju. Saprotam, ka jaunais izskats kādam patiks, kādam varbūt nē, tāpēc esam atvērti konstruktīvai kritikai un ieteikumiem.
            </p>
            <p>
              Veiksmi spēlē!
            </p>
            <p>
              Zoles administrācija
            </p>
          </ModalBody>
          <ModalFooter>
            <Button className="notification-footer-button" color="secondary" onClick={this.closeFirstTime}>
              {t('common.close')}
            </Button>
          </ModalFooter>
        </Modal>
        )}

        <Modal isOpen={balanceHistoryModalOpen} toggle={this.toggleBalanceHistory} size="lg">
          <ModalHeader
            toggle={this.toggleBalanceHistory}
            close={
              <Media src={closeImg} className="notification-header-close" alt="X" onClick={this.toggleBalanceHistory} />
            }
          >
            {t('menu.moneyHistory')}
          </ModalHeader>
          <ModalBody>
            {balanceHistoryModalOpen && (
              <MoneyHistory
                fetchBalanceHistory={fetchBalanceHistory}
                balanceHistory={member.balanceHistory}
              />
            )}
          </ModalBody>
          <ModalFooter>
            <Button className="modal-footer-button" color="secondary" onClick={this.toggleBalanceHistory}>
              {t('common.close')}
            </Button>
          </ModalFooter>
        </Modal>

        <Modal isOpen={bannedUsersModalOpen} toggle={this.toggleBannedUsers} size="lg">
          <ModalHeader
            toggle={this.toggleBannedUsers}
            close={
              <Media src={closeImg} className="notification-header-close" alt="X" onClick={this.toggleBannedUsers} />
            }
          >
            {t('menu.bannedUsers')}
          </ModalHeader>
          <ModalBody>
            <BannedUsers
              bannedUsers={bannedUsers}
              bannedUsersCount={bannedUsersCount}
            />
          </ModalBody>
          <ModalFooter>
            <Button className="modal-footer-button" color="secondary" onClick={this.toggleBannedUsers}>
              {t('common.close')}
            </Button>
          </ModalFooter>
        </Modal>

        <NewVersion member={member} t={t} closeNewVersionModal={this.newVersionChecked} />
        {/*  <Modal isOpen={onlineUsersModalOpen} toggle={this.toggleOnlineUsers} size="lg" className="rules-modal">
          <ModalHeader toggle={this.toggleOnlineUsers} className="rules-modal-header">
            {t('menu.onlineUsers')}
          </ModalHeader>
          <ModalBody className="rules-modal-body">
            <OnlineUsers
              onlineUsers={onlineUsers}
            />
          </ModalBody>
          <ModalFooter className="rules-modal-footer">
            <Button className="rules-modal-footer-button" color="secondary" onClick={this.toggleOnlineUsers}>
              {t('common.close')}
            </Button>
          </ModalFooter>
        </Modal>  */}
      </Fragment>


    );
  }
}


export default withTranslation('common')(Menu);
