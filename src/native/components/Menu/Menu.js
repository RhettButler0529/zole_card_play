import React, { Fragment } from 'react';
import PropTypes from 'prop-types';

import { LinearGradient } from 'expo-linear-gradient';

import {
  FlatList, TouchableOpacity, RefreshControl, Image, View, Dimensions, StyleSheet, ImageBackground,
} from 'react-native';
import {
  Container, Content, Card, CardItem, Body, Text, Button,
} from 'native-base';
import { Actions } from 'react-native-router-flux';

import { withTranslation } from 'react-i18next';

import LoadingPage from '../UI/Loading';

import playerBackground from '../../../images/Player-Picture-Lobby.png';


import MyInfo from './MyInfo';
import NewGame from './NewGame';
import HeaderRight from './HeaderRight';
// import LevelProgress from './LevelProgress';
import RoomsTable from './RoomsTable';
import BonusPage from './BonusPage';
// import BuyPage from './BuyPage';
// import SendMoneyToFriend from './SendMoneyToFriend';
import TopPage from './TopPage';
import Tournaments from './Tournaments';
// import TournamentsHistory from './TournamentsHistory';
// import ContactSupport from '../ContactSupport';


// import Notification from '../Notification';


const styles = StyleSheet.create({
  tab: {
    fontWeight: '700',
    fontSize: 15,
    marginTop: 7,
    textAlign: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
    borderTopLeftRadius: 5,
    borderTopRightRadius: 5,
    color: '#fcffb6',
    height: '100%',
  },
});


class Menu extends React.Component {
  static propTypes = {
    rooms: PropTypes.shape(),
    leaderboard: PropTypes.arrayOf(PropTypes.shape()),
    myLeaderboard: PropTypes.shape(),
    tournaments: PropTypes.shape(),
    tournamentPlayers: PropTypes.shape(),
    myTournamentsData: PropTypes.shape(),
    tournamentsHistory: PropTypes.shape(),
    tournamentsHistoryPlayers: PropTypes.shape(),
    lastRoom: PropTypes.string,
    roomCount: PropTypes.number,
    userCount: PropTypes.number,
    joinRoom: PropTypes.func.isRequired,
    createRoom: PropTypes.func.isRequired,
    uid: PropTypes.string,
    loadingProgress: PropTypes.number.isRequired,
    member: PropTypes.shape().isRequired,
    loading: PropTypes.bool.isRequired,
    spinWheel: PropTypes.func.isRequired,
    t: PropTypes.func.isRequired,
    handleFBLogin: PropTypes.func.isRequired,
    fetchPositionInLeaderboard: PropTypes.func.isRequired,
    fetchLeaderboard: PropTypes.func.isRequired,
    sendMoney: PropTypes.func.isRequired,
    joinTournament: PropTypes.func.isRequired,
    joinTournamentRoom: PropTypes.func.isRequired,
    fetchTournamentPlayers: PropTypes.func.isRequired,
    fetchTournamentsHistory: PropTypes.func.isRequired,
    fetchTournamentHistory: PropTypes.func.isRequired,
    resetErrorNotif: PropTypes.func.isRequired,
    submitError: PropTypes.func.isRequired,
    errorNotification: PropTypes.string,
    //  showNotification: PropTypes.func.isRequired,
    lastJoinedRoom: PropTypes.shape(),
    resetCloseErrorSubmit: PropTypes.func.isRequired,
    closeErrorSubmit: PropTypes.bool,
  }

  static defaultProps = {
    uid: '',
    errorNotification: '',
    rooms: {},
    leaderboard: [],
    myLeaderboard: {},
    tournaments: {},
    tournamentPlayers: {},
    myTournamentsData: {},
    tournamentsHistory: {},
    tournamentsHistoryPlayers: {},
    lastRoom: '',
    lastJoinedRoom: {},
    roomCount: 0,
    userCount: 0,
    closeErrorSubmit: false,
  }

  constructor(props) {
    super(props);
    this.state = {
      activeTab: '1',
      width: Dimensions.get('window').width,
      height: Dimensions.get('window').height,
      orientation: Dimensions.get('window').width < Dimensions.get('window').height ? ('portrait') : ('landscape'),
    };

    Dimensions.addEventListener('change', (e) => {
    //  console.log(e);
      this.setState();

      if (e.window.width < e.window.height) {
        this.setState({ ...e.window, orientation: 'portrait' });
      } else {
        this.setState({ ...e.window, orientation: 'landscape' });
      }
    });

    //  this.toggle = this.toggle.bind(this);
    this.refetchLeaderboard = this.refetchLeaderboard.bind(this);
  //  this.closeModal = this.closeModal.bind(this);
  }

  componentDidUpdate(prevProps, prevState) {
    console.log('componentDidUpdate');
    const {
      member,
      errorNotification,
      rooms,
    } = this.props;
    const { openModal, modalType } = prevState;

    const oldMember = prevProps.member;

    console.log('rooms');
    console.log(rooms);

    if (errorNotification) {
      if (errorNotification === 'insufficient balance') {
        if (!(openModal && modalType === 'noBalanceMenu')) {
          this.UpdateModal(true, 'noBalanceMenu', null);
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
      }
    }

    if (member && oldMember && member.level && oldMember.level
      && member.level !== oldMember.level) {
      if (!(openModal && modalType === 'levelUp')) {
        this.UpdateModal(true, 'levelUp', member.level);
      }
    }
  }

  UpdateModal = (openModal, modalType, newLevel) => {
    this.setState({
      openModal, modalType, newLevel,
    });
  }


  toggle = (tab) => {
    const { activeTab } = this.state;
    if (activeTab !== tab) {
      this.setState({
        activeTab: tab,
      });
    }
  }

  closeModal = () => {
    const { resetErrorNotif } = this.props;
    const { modalType } = this.state;
    if (modalType === 'noBalanceMenu' || modalType === 'proRoomMenu' || modalType === 'proBetMenu' || modalType === 'noBalanceTournament') {
      resetErrorNotif();
    }
    this.setState({ openModal: false, modalType: '' });
  }


  refetchLeaderboard() {
    const { fetchLeaderboard, fetchPositionInLeaderboard } = this.props;
    fetchLeaderboard();
    fetchPositionInLeaderboard();
  }

  render() {
    const {
      uid,
      member,
      loading,
      createRoom,
      loadingProgress,
      joinRoom,
      rooms,
      spinWheel,
      t,
      handleFBLogin,
      leaderboard,
      myLeaderboard,
      sendMoney,
      tournaments,
      tournamentPlayers,
      myTournamentsData,
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
      roomCount,
      userCount,
      buyTournamentMoney,
    } = this.props;

    const {
      activeTab,
      openModal,
      modalType,
      newLevel,
      orientation,
      height,
      width,
    } = this.state;

    const ScreenWidth = width;
    const ScreenHeight = height;

    return (
      <Container>
        <Content
          style={{
            minHeight: '100%', maxHeight: '100%', minWidth: '100%', maxWidth: '100%',
          }}
        >
          <View
            style={{
              width: ScreenWidth,
              height: ScreenHeight,
              zIndex: -200,
              position: 'absolute',
              top: 0,
              left: 0,
            }}
          >
            <Image
              source={require('../../../images/Lobby-background-app.png')}
              style={{
                width: ScreenWidth,
                height: ScreenHeight,
                zIndex: -200,
              }}
            />
          </View>

          <View
            style={{
              width: ScreenWidth,
              height: orientation === 'portrait' ? (ScreenHeight / 4) : (ScreenHeight / 2),
              position: 'absolute',
              top: -30,
              left: 0,
              zIndex: -80,
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >

            <View
              style={{
                width: orientation === 'portrait' ? ('27%') : ('19%'),
                height: orientation === 'portrait' ? ('32%') : ('30%'),
                zIndex: -80,
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              <Image
                source={require('../../../images/zole-logo.png')}
                style={{
                  width: '100%',
                  height: undefined,
                  aspectRatio: 3 / 2,
                }}
              />
            </View>
          </View>

          {/* Content */}
          <View
            style={{
              width: ScreenWidth,
              height: ScreenHeight,
            }}
          >

            {/* Header */}
            <View
              style={{
                flex: 2,
                flexDirection: 'column',
              }}
            >
              {/* Player info   */}
              <View
                style={{
                  width: '100%',
                  height: '100%',
                  flex: 1,
                  flexDirection: 'row',
                }}
              >
                <View style={{ flex: 3, flexDirection: 'row' }} className="player-profile">
                  <View
                    style={{
                      position: 'relative',
                      width: orientation === 'portrait' ? (100) : (100),
                      height: orientation === 'portrait' ? (100) : (100),
                      padding: 0,
                      overflow: 'hidden',
                    }}
                  >

                    <ImageBackground
                      source={playerBackground}
                      style={{
                        width: 100,
                        height: 100,
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        zIndex: -1,
                      }}
                    >
                      <View
                        style={{
                          width: 80,
                          height: 80,
                          position: 'absolute',
                          top: 11,
                          left: 10,
                          borderRadius: 100,
                          //  border: 0,
                          overflow: 'hidden',
                          //  padding: 0,
                          zIndex: 2,
                        }}
                      >
                        <Image style={{ width: '100%', height: '100%' }} source={{ uri: member.photo }} />
                      </View>
                    </ImageBackground>

                    {/*
                    <View
                      style={{
                        width: orientation === 'portrait' ? (80) : (90),
                        height: orientation === 'portrait' ? (80) : (90),
                        borderRadius: 80,
                        borderColor: '#dcbe66',
                        borderWidth: 5,
                        backgroundColor: '#847753',
                        overflow: 'hidden',
                      }}
                    >
                      <Image
                        style={{
                          width: orientation === 'portrait' ? (80) : (90),
                          height: orientation === 'portrait' ? (80) : (90),
                          borderRadius: 80,
                          overflow: 'hidden',
                        }}
                        source={{ uri: member.photo }}
                      />
                    </View>
                    */}
                  </View>

                  <View style={{ flexDirection: 'column' }}>
                    <View style={{ marginTop: 10, marginBottom: 5 }}>
                      <Text style={{ color: '#fff' }}>{member && member.name}</Text>
                    </View>
                    <View style={{ marginTop: 5, marginBottom: 5, flexDirection: 'row' }}>
                      <Text
                        style={{
                          textAlign: 'center',
                          color: '#e4ffb9',
                        }}
                      >
                        {member && member.balance !== undefined && `€ ${member.balance}`}
                      </Text>

                      <View
                        style={{
                          borderRadius: 15,
                          padding: 0,
                          textAlign: 'center',
                          width: 24,
                          height: 24,
                          position: 'relative',
                          top: 0,
                          left: 0,
                          marginLeft: 10,
                          background: '#242442',
                          borderWidth: 2,
                          borderColor: '#73bb73',
                        }}
                      >
                        <Text
                          style={{
                            textAlign: 'center',
                            fontWeight: '400',
                            fontSize: 13,
                            lineHeight: 18,
                            color: '#fff',
                          }}
                        >
                          {member && member.level !== undefined && (member.level)}
                        </Text>
                      </View>
                      <Text
                        style={{
                          textAlign: 'center',
                          fontWeight: '400',
                          fontSize: 13,
                          lineHeight: 18,
                          color: '#fff',
                          marginLeft: 10,
                        }}
                      >
                        {member && member.level !== undefined && (t('menu.level'))}
                      </Text>
                    </View>
                  </View>
                </View>

                {/* Spacer */}
                <View style={{ flex: 1, flexDirection: 'row' }} />

                {/* Header Right */}
                <View style={{ flex: 2, flexDirection: 'row' }}>
                  <HeaderRight changeTab={this.toggle} member={member} activeTab={activeTab} />
                </View>
              </View>
            </View>

            <View
              style={{
                flex: 5,
                flexDirection: 'row',
              }}
            >
              <View
                style={{
                  flex: 5,
                  flexDirection: 'column',
                }}
              >
                {/* Page */}
                <View
                  style={{
                    flex: 1,
                    flexDirection: 'column',
                    height: '100%',
                  }}
                >
                  {/* Tabs header */}
                  <View
                    style={{
                      flex: 1,
                      flexDirection: 'row',
                    }}
                  >
                    <TouchableOpacity
                      activeOpacity={0.8}
                      onPress={() => { this.toggle('1'); }}
                      style={{
                        width: '20%',
                        borderBottomLeftRadius: 0,
                        borderBottomRightRadius: 0,
                        borderTopLeftRadius: 5,
                        borderTopRightRadius: 5,
                        height: '100%',
                      }}
                    >
                      <LinearGradient
                        colors={['rgba(255,176,70,.65)', 'rgba(94,70,45,.65)']}
                        style={{ alignItems: 'center', height: '100%' }}
                      >
                        <Text style={styles.tab}>
                          {t('menu.rooms')}
                        </Text>
                      </LinearGradient>
                    </TouchableOpacity>
                    <TouchableOpacity
                      activeOpacity={0.8}
                      onPress={() => { this.toggle('2'); }}
                      style={{
                        width: '20%',
                        borderBottomLeftRadius: 0,
                        borderBottomRightRadius: 0,
                        borderTopLeftRadius: 5,
                        borderTopRightRadius: 5,
                        height: '100%',
                      }}
                    >
                      <LinearGradient
                        colors={['rgba(255,176,70,.65)', 'rgba(94,70,45,.65)']}
                        style={{ alignItems: 'center', height: '100%' }}
                      >
                        <Text style={styles.tab}>
                          {t('menu.top')}
                        </Text>
                      </LinearGradient>
                    </TouchableOpacity>
                    <TouchableOpacity
                      activeOpacity={0.8}
                      onPress={() => { this.toggle('3'); }}
                      style={{
                        width: '20%',
                        borderBottomLeftRadius: 0,
                        borderBottomRightRadius: 0,
                        borderTopLeftRadius: 5,
                        borderTopRightRadius: 5,
                        height: '100%',
                      }}
                    >
                      <LinearGradient
                        colors={['rgba(255,176,70,.65)', 'rgba(94,70,45,.65)']}
                        style={{ alignItems: 'center', height: '100%' }}
                      >
                        <Text style={styles.tab}>
                          {t('menu.myInfo')}
                        </Text>
                      </LinearGradient>
                    </TouchableOpacity>
                    <TouchableOpacity
                      activeOpacity={0.8}
                      onPress={() => { this.toggle('6'); }}
                      style={{
                        width: '20%',
                        borderBottomLeftRadius: 0,
                        borderBottomRightRadius: 0,
                        borderTopLeftRadius: 5,
                        borderTopRightRadius: 5,
                        height: '100%',
                      }}
                    >
                      <LinearGradient
                        colors={['rgba(255,176,70,.65)', 'rgba(94,70,45,.65)']}
                        style={{ alignItems: 'center', height: '100%' }}
                      >
                        <Text style={styles.tab}>
                          {t('menu.tournaments')}
                        </Text>
                      </LinearGradient>
                    </TouchableOpacity>

                  </View>
                </View>

                <View
                  style={{
                    flex: 7,
                    flexDirection: 'row',
                    marginTop: 5,
                  }}
                >
                  <View
                    style={{
                      flex: 2,
                      flexDirection: 'row',
                    }}
                  >
                    {/* Tabs */}
                    <View
                      style={{
                        flex: 4,
                        flexDirection: 'row',
                      }}
                    >
                      {/* Tabs content */}
                      {activeTab && activeTab === '1' && (
                      <View
                        style={{
                          flex: 3,
                          flexDirection: 'column',
                        }}
                      >
                        <RoomsTable rooms={rooms} joinRoom={joinRoom} uid={uid} />
                      </View>
                      )}
                      {activeTab && activeTab === '2' && (
                      <View
                        style={{
                          flex: 3,
                          flexDirection: 'column',
                        }}
                      >
                        <TopPage
                          leaderboard={leaderboard}
                          myLeaderboard={myLeaderboard}
                          refetchLeaderboard={this.refetchLeaderboard}
                        />
                      </View>
                      )}
                      {activeTab && activeTab === '3' && (
                      <View
                        style={{
                          flex: 3,
                          flexDirection: 'column',
                        }}
                      >
                        <MyInfo
                          member={member}
                        />
                      </View>
                      )}
                      {activeTab && activeTab === '4' && (
                      <View
                        style={{
                          flex: 3,
                          flexDirection: 'column',
                        }}
                      >
                        <BonusPage member={member} spinWheel={spinWheel} changeTab={this.toggle} />
                      </View>
                      )}
                      {activeTab && activeTab === '5' && (
                      <View
                        style={{
                          flex: 3,
                          flexDirection: 'column',
                        }}
                      >
                        <Text> Buy Page </Text>
                      </View>
                      )}
                      {activeTab && activeTab === '6' && (
                      <View
                        style={{
                          flex: 3,
                          flexDirection: 'column',
                        }}
                      >
                        <Tournaments
                          member={member}
                          tournaments={tournaments}
                          tournamentPlayers={tournamentPlayers}
                          myTournamentsData={myTournamentsData}
                          joinTournament={joinTournament}
                          joinTournamentRoom={joinTournamentRoom}
                          fetchTournamentPlayers={fetchTournamentPlayers}
                          buyTournamentMoney={buyTournamentMoney}
                          changeTab={this.toggle}
                        />
                      </View>
                      )}

                    </View>
                  </View>
                </View>
              </View>
              <View
                style={{
                  flex: 2,
                  flexDirection: 'row',
                }}
              >
                <NewGame createRoom={createRoom} lvl={member.level} changeTab={this.toggle} />
              </View>
            </View>
          </View>

        </Content>
      </Container>
    );
  }
}

export default withTranslation('common')(Menu);
