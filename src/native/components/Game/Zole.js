import React, { Fragment } from 'react';
import PropTypes from 'prop-types';

import { LinearGradient } from 'expo-linear-gradient';

import {
  FlatList, TouchableOpacity, RefreshControl, Image, View, Dimensions, TouchableHighlight,
} from 'react-native';
import {
  Container, Content, Card, CardItem, Body, Text, Button,
} from 'native-base';
import { Actions } from 'react-native-router-flux';


import { withTranslation } from 'react-i18next';


import Loading from '../UI/Loading';
import Error from '../UI/Error';
import Header from '../UI/Header';
import Spacer from '../UI/Spacer';


import exit from '../../../images/Game/IC_Back.png';
import pro from '../../../images/Label - pro.png';
import fast from '../../../images/Label - speed.png';

import lastRoundImg from '../../../images/Game/IC Last Round.png';
import quitRoundImg from '../../../images/Game/IC Drop Cards.png';

import cardImg from './cardImages';


// import TurnTimer from './TurnTimer';
// import GameTimer from './GameTimer';
// import Notification from '../Notification';
// import ContactSupport from '../ContactSupport';

const erci = ['♥-9', '♥-K', '♥-10', '♥-A'];
const kreisti = ['♣︎-9', '♣︎-K', '♣︎-10', '♣︎-A'];
const piki = ['♠︎-9', '♠︎-K', '♠︎-10', '♠︎-A'];
const trumpji = ['♦︎-7', '♦︎-8', '♦︎-9', '♦︎-K', '♦︎-10', '♦︎-A', '♦︎-J', '♥-J', '♠︎-J', '♣︎-J', '♦︎-Q', '♥-Q', '♠︎-Q', '♣︎-Q'];

// const { height, width } = Dimensions.get('window');

/*
const cardImages = {
  '♠︎-9': { img: require('../../../images/cards-gradient/♠︎ - 9.png') },
  '♠︎-K': { img: require('../../../images/cards-gradient/♠︎ - K.png') },
  '♠︎-10': { img: require('../../../images/cards-gradient/♠︎ - 10.png') },
  '♠︎-A': { img: require('../../../images/cards-gradient/♠︎ - A.png') },
  '♠︎-J': { img: require('../../../images/cards-gradient/♠︎ - J.png') },
  '♠︎-Q': { img: require('../../../images/cards-gradient/♠︎ - Q.png') },
  '♣︎-9': { img: require('../../../images/cards-gradient/♣︎ - 9.png') },
  '♣︎-K': { img: require('../../../images/cards-gradient/♣︎ - K.png') },
  '♣︎-10': { img: require('../../../images/cards-gradient/♣︎ - 10.png') },
  '♣︎-A': { img: require('../../../images/cards-gradient/♣︎ - A.png') },
  '♣︎-J': { img: require('../../../images/cards-gradient/♣︎ - J.png') },
  '♣︎-Q': { img: require('../../../images/cards-gradient/♣︎ - Q.png') },
  '♥-9': { img: require('../../../images/cards-gradient/♥ - 9.png') },
  '♥-K': { img: require('../../../images/cards-gradient/♥ - K.png') },
  '♥-10': { img: require('../../../images/cards-gradient/♥ - 10.png') },
  '♥-A': { img: require('../../../images/cards-gradient/♥ - A.png') },
  '♥-J': { img: require('../../../images/cards-gradient/♥ - J.png') },
  '♥-Q': { img: require('../../../images/cards-gradient/♥ - Q.png') },
  '♦︎-7': { img: require('../../../images/cards-gradient/♦︎ - 7.png') },
  '♦︎-8': { img: require('../../../images/cards-gradient/♦︎ - 8.png') },
  '♦︎-9': { img: require('../../../images/cards-gradient/♦︎ - 9.png') },
  '♦︎-K': { img: require('../../../images/cards-gradient/♦︎ - K.png') },
  '♦︎-10': { img: require('../../../images/cards-gradient/♦︎ - 10.png') },
  '♦︎-A': { img: require('../../../images/cards-gradient/♦︎ - A.png') },
  '♦︎-J': { img: require('../../../images/cards-gradient/♦︎ - J.png') },
  '♦︎-Q': { img: require('../../../images/cards-gradient/♦︎ - Q.png') },
};

*/

class Zole extends React.Component {
  static propTypes = {
    globalParams: PropTypes.shape(),
    players: PropTypes.shape().isRequired,
    points: PropTypes.shape(),
    totalPoints: PropTypes.shape(),
    user: PropTypes.string,
    chooseGameType: PropTypes.func.isRequired,
    playCard: PropTypes.func.isRequired,
    endRoom: PropTypes.func.isRequired,
    setLastRound: PropTypes.func.isRequired,
    leaveRoom: PropTypes.func.isRequired,
    quitRound: PropTypes.func.isRequired,
    closeResultNotif: PropTypes.func.isRequired,

  }

  static defaultProps = {
    user: '',
    points: {},
    totalPoints: {},
    globalParams: {},
  }

  constructor(props) {
    super(props);
    this.state = {
      cards: [],
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

    this.chooseType = this.chooseType.bind(this);
    this.openModal = this.openModal.bind(this);
    this.closeModal = this.closeModal.bind(this);
    this.closeResultModal = this.closeResultModal.bind(this);
    this.endRoom = this.endRoom.bind(this);
    this.leaveRoom = this.leaveRoom.bind(this);
    this.exitRoomNotification = this.exitRoomNotification.bind(this);
    this.lastRound = this.lastRound.bind(this);
    this.playCard = this.playCard.bind(this);
  }

  componentDidMount() {
    console.log('componentDidMount');
    const {
      //  currentTurn,
      //  players,
    } = this.props;

    const cards = ['♦︎-7', '♦︎-8', '♦︎-9', '♦︎-K', '♦︎-10', '♦︎-A', '♦︎-J', '♥-J'];

    const mappedCards = cards.reverse().map(card => ({ card, allowed: false }));

    this.setState({ cards: mappedCards });
  }

  componentWillReceiveProps(nextProps) {
    console.log('componentDidMount');
    const {
    //  currentTurn,
    //  players,
    } = nextProps;

    const cards = ['♦︎-7', '♦︎-8', '♦︎-9', '♦︎-K', '♦︎-10', '♦︎-A', '♦︎-J', '♥-J'];

    const mappedCards = cards.reverse().map(card => ({ card, allowed: false }));

    this.setState({ cards: mappedCards });
  }

  quitRound = () => {
    const { quitRound } = this.props;

    quitRound(false);
    this.setState({ quitRound: true });
  }

  chooseType = (selectedType) => {
    const { chooseGameType } = this.props;
    this.setState({ chooseTypeClicked: true });

    chooseGameType({ selectedType }, false);

    setTimeout(() => {
      this.setState({ chooseTypeClicked: false });
    }, 1500);
  }

  openModal = () => {
    this.setState({ openModal: true });
  }

  closeModal = () => {
    this.setState({
      openModal: false,
      modalType: '',
    });
  }

  closeResultModal() {
    const { closeResultNotif, globalParams } = this.props;
    const { gameResultModalShown } = this.state;


    if (gameResultModalShown && globalParams && globalParams.gameState === 'results') {
      closeResultNotif(false);
      this.setState({ openGameResultModal: false, gameResultModalShown: false, quitRound: false });
    }
  }

  endRoom() {
    const { endRoom, globalParams } = this.props;
    if (!globalParams.roomClosed) {
      endRoom();
    }
  }

  leaveRoom() {
    const { leaveRoom } = this.props;
    leaveRoom();
  }

  exitRoomNotification() {
    const { players } = this.props;
    if (players && players.player1 && players.player2 && players.player3) {
      this.setState({
        openModal: true,
        modalType: 'leaveRoom',
      });
    } else {
      this.leaveRoom();
    }
  }

  lastRound() {
    const { setLastRound } = this.props;
    setLastRound();
  }

  playCard(card) {
    console.log('play card');
    console.log(card);
    const { playCard } = this.props;
    if (card.allowed) {
      playCard({ selectedCard: card.card, init: false });
    } else {
      console.log('cannot play that card');
    }
  }

  render() {
    const {
    //  user,
      totalPoints,
      points,
      //  players,
      t,
    } = this.props;
    const {
      cards,
      width,
      height,
      orientation,
    } = this.state;

    //  console.log(this.state);

    const players = {
      player1: {
        uid: '12345',
        largePlayer: true,
        photo: 'https://graph.facebook.com/1298591920304492/picture?type=large',
        name: 'Mikus',
        bal: 1234,
        lvl: 6,
      },
      player2: {
        uid: '12346',
        largePlayer: false,
        photo: 'https://graph.facebook.com/1298591920304492/picture?type=large',
        name: 'Mikus 2',
        bal: 345,
        lvl: 3,
      },
      player3: {
        uid: '12347',
        largePlayer: false,
        photo: 'https://graph.facebook.com/1298591920304492/picture?type=large',
        name: 'Mikus 3',
        bal: 4321,
        lvl: 12,
      },
    };

    const playersArranged = [];
    const totalPointsArranged = {};
    const pointsArranged = {};

    //  if (players && players.playerList) {
    //    const myPos = players.playerList[user];
    const myPos = 'player2';

    if (myPos === 'player1') {
      playersArranged[0] = { ...players.player2, position: 'player2' };
      playersArranged[1] = { ...players.player3, position: 'player3' };
      playersArranged[2] = { ...players.player1, position: 'player1' };

      totalPointsArranged.player1 = totalPoints.player3 ? totalPoints.player3 : 0;
      totalPointsArranged.player2 = totalPoints.player1 ? totalPoints.player1 : 0;
      totalPointsArranged.player3 = totalPoints.player2 ? totalPoints.player2 : 0;

      Object.keys(points).map((key) => {
        pointsArranged[key] = {
          player1: points[key].player3,
          player2: points[key].player1,
          player3: points[key].player2,
          pule: points[key].pule,
        };
        return null;
      });
    }
    if (myPos === 'player2') {
      playersArranged[0] = { ...players.player3, position: 'player3' };
      playersArranged[1] = { ...players.player1, position: 'player1' };
      playersArranged[2] = { ...players.player2, position: 'player2' };

      totalPointsArranged.player1 = totalPoints.player1 ? totalPoints.player1 : 0;
      totalPointsArranged.player2 = totalPoints.player2 ? totalPoints.player2 : 0;
      totalPointsArranged.player3 = totalPoints.player3 ? totalPoints.player3 : 0;

      Object.keys(points).map((key) => {
        pointsArranged[key] = {
          player1: points[key].player1,
          player2: points[key].player2,
          player3: points[key].player3,
          pule: points[key].pule,
        };
        return null;
      });
    }
    if (myPos === 'player3') {
      playersArranged[0] = { ...players.player1, position: 'player1' };
      playersArranged[1] = { ...players.player2, position: 'player2' };
      playersArranged[2] = { ...players.player3, position: 'player3' };

      totalPointsArranged.player1 = totalPoints.player2 ? totalPoints.player2 : 0;
      totalPointsArranged.player2 = totalPoints.player3 ? totalPoints.player3 : 0;
      totalPointsArranged.player3 = totalPoints.player1 ? totalPoints.player1 : 0;

      Object.keys(points).map((key) => {
        pointsArranged[key] = {
          player1: points[key].player2,
          player2: points[key].player3,
          player3: points[key].player1,
          pule: points[key].pule,
        };
        return null;
      });
    }
    //  }

    //  console.log('cards');
    //  console.log(cards);

    //  const ScreenHeight = Dimensions.get('window').height;
    //  const ScreenWidth = Dimensions.get('window').width;

    const ScreenWidth = width;
    const ScreenHeight = height - 54;

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
            }}
          >
            <Image
              source={require('../../../images/gameplay-bg-o.png')}
              style={{
                width: ScreenWidth,
                height: ScreenHeight,
                zIndex: -200,
              }}
            />
          </View>


          {/*
          <View
            style={{
              width: ScreenWidth,
              height: orientation === 'portrait' ? (ScreenHeight / 2) : (ScreenHeight / 1.5),
              position: 'absolute',
              top: orientation === 'portrait' ? (200) : (200),
              left: 0,
              zIndex: -100,
              justifyContent: 'center',
              alignItems: 'center',
              overflow: 'visible',
            }}
          >

            <Image
              source={require('../../../images/table-o.png')}
              style={{
                height: undefined,
                width: '100%',
                aspectRatio: 1,
              }}
            />
          </View>
          */}

          <View
            style={{
              width: ScreenWidth,
              height: orientation === 'portrait' ? (ScreenHeight / 2) : (ScreenHeight),
              position: 'absolute',
              top: orientation === 'portrait' ? (200) : (75),
              left: 0,
              zIndex: -100,
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >

            <View
              style={{
                width: orientation === 'portrait' ? ('100%') : ('75%'),
                height: '50%',
                zIndex: -100,
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              <Image
                source={require('../../../images/table-o.png')}
                style={{
                  width: orientation === 'portrait' ? ('100%') : ('100%'),
                  height: orientation === 'portrait' ? (undefined) : (undefined),
                  aspectRatio: 3 / 2,
                }}
              />
            </View>
          </View>


          <View
            style={{
              width: ScreenWidth,
              height: orientation === 'portrait' ? (ScreenHeight / 4) : (ScreenHeight / 2),
              position: 'absolute',
              top: 0,
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

          <View
            style={{
              width: 40,
              height: 40,
              position: 'absolute',
              top: 5,
              left: 5,
            }}
          >
            <Image
              source={require('../../../images/Game/IC_Back.png')}
              style={{
                width: '100%',
                height: '100%',
              }}
            />
          </View>

          <View
            style={{
              width: 80,
              height: 80,
              position: 'absolute',
              top: orientation === 'portrait' ? (220) : (100),
              left: 10,
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <Image
              source={require('../../../images/Game/IC_Drop_Cards.png')}
              style={{
                width: '50%',
                height: '50%',
              }}
            />
            <Text style={{ color: '#e4ffb9' }}>
              Atmesties
            </Text>
          </View>

          <View
            style={{
              position: 'absolute',
              top: 15,
              left: 50,
              width: 27,
              height: 18,
              borderRadius: 3,
            }}
          >
            <LinearGradient
              colors={['#9a9999', '#fff']}
              style={{ alignItems: 'center' }}
            >
              <Text
                style={{
                  width: '100%',
                  height: '100%',
                  margin: 'auto',
                  fontWeight: '700',
                  fontSize: 13,
                  lineHeight: 18,
                  textAlign: 'center',
                  letterSpacing: 0.5,
                  color: '#5d8b39',
                }}
              >
              P
              </Text>
            </LinearGradient>
          </View>

          <View
            style={{
              width: 80,
              height: 80,
              position: 'absolute',
              top: orientation === 'portrait' ? (220) : (100),
              right: 10,
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <Image
              source={require('../../../images/Game/IC_Last_Round.png')}
              style={{
                width: '50%',
                height: '50%',
              }}
            />
            <Text style={{ color: '#e4ffb9' }}>
              Pedējā partija
            </Text>
          </View>


          <View
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: ScreenWidth,
              height: ScreenHeight,
              minHeight: ScreenHeight,
              minWidth: ScreenWidth,
              zIndex: 100,
            }}
          >
            {cards.map((card, index) => {
              let src;
              if (card.card === '♠︎-9') src = cardImg.P9.img;
              if (card.card === '♠︎-K') src = cardImg.PK.img;
              if (card.card === '♠︎-10') src = cardImg.P10.img;
              if (card.card === '♠︎-A') src = cardImg.PA.img;
              if (card.card === '♠︎-J') src = cardImg.PJ.img;
              if (card.card === '♠︎-Q') src = cardImg.PQ.img;
              if (card.card === '♣︎-9') src = cardImg.K9.img;
              if (card.card === '♣︎-K') src = cardImg.KK.img;
              if (card.card === '♣︎-10') src = cardImg.K10.img;
              if (card.card === '♣︎-A') src = cardImg.KA.img;
              if (card.card === '♣︎-J') src = cardImg.KJ.img;
              if (card.card === '♣︎-Q') src = cardImg.KQ.img;
              if (card.card === '♥-9') src = cardImg.E9.img;
              if (card.card === '♥-K') src = cardImg.EK.img;
              if (card.card === '♥-10') src = cardImg.E10.img;
              if (card.card === '♥-A') src = cardImg.EA.img;
              if (card.card === '♥-J') src = cardImg.EJ.img;
              if (card.card === '♥-Q') src = cardImg.EQ.img;
              if (card.card === '♦︎-9') src = cardImg.KA9.img;
              if (card.card === '♦︎-K') src = cardImg.KAK.img;
              if (card.card === '♦︎-10') src = cardImg.KA10.img;
              if (card.card === '♦︎-A') src = cardImg.KAA.img;
              if (card.card === '♦︎-J') src = cardImg.KAJ.img;
              if (card.card === '♦︎-Q') src = cardImg.KAQ.img;
              if (card.card === '♦︎-7') src = cardImg.KA8.img;
              if (card.card === '♦︎-8') src = cardImg.KA7.img;

              //  console.log(src);

              return (
                <View
                  key={card.card}
                  style={{
                    position: 'absolute',
                    bottom: orientation === 'portrait' ? (25) : (70),
                    left: orientation === 'portrait' ? (120 + (index * 35)) : (null),
                    right: orientation === 'portrait' ? (null) : ((ScreenWidth / 2) - (index * 55)),
                    width: orientation === 'portrait' ? (ScreenWidth / 8) : (ScreenWidth / 6),
                    height: orientation === 'portrait' ? (ScreenHeight / 4) : (ScreenHeight / 4),
                    zIndex: 100,
                  }}
                >
                  <TouchableOpacity
                    activeOpacity={0.5}
                    onPress={() => this.playCard(card)}
                    style={{ borderWidth: 3, borderColor: '#ddd' }}
                  >
                    <View style={{
                      width: orientation === 'portrait' ? ('100%') : ('100%'),
                      height: orientation === 'portrait' ? ('100%') : (undefined),
                      aspectRatio: orientation === 'portrait' ? (null) : (2 / 3),
                    }}
                    >
                      <Image
                        key={card.card}
                        source={src}
                        style={{
                          width: orientation === 'portrait' ? ('100%') : ('100%'),
                          height: orientation === 'portrait' ? ('100%') : ('100%'),
                        }}
                      />
                    </View>
                  </TouchableOpacity>
                </View>

              );
            })}
          </View>

          <Text style={{
            top: 300, left: 200, position: 'absolute', fontSize: 28, color: '#FFF',
          }}
          >
            {t('waitingForPlayers')}
          </Text>

          {/* Players */}
          <View
            style={{
              width: ScreenWidth,
              height: ScreenHeight,
              position: 'absolute',
              top: 0,
              left: 0,
              zIndex: 200,
            }}
          >
            {playersArranged && playersArranged.map((player, index) => {
            //  console.log(player);
              let top;
              let bottom;
              let left;
              let right;
              let color;
              let pWidth;
              let pHeight;
              if (index === 1) {
                if (orientation === 'portrait') {
                  bottom = 30;
                  left = 0;
                  pWidth = '25%';
                  pHeight = '25%';
                } else {
                  bottom = 45;
                  left = 15;
                  pWidth = '30%';
                  pHeight = '30%';
                }
              } else if (index === 2) {
                if (orientation === 'portrait') {
                  top = 50;
                  left = 45;
                  pWidth = '23%';
                  pHeight = '23%';
                } else {
                  top = 35;
                  left = 70;
                  pWidth = '27%';
                  pHeight = '27%';
                }
              } else if (index === 0) {
                if (orientation === 'portrait') {
                  top = 50;
                  right = 45;
                  pWidth = '23%';
                  pHeight = '23%';
                } else {
                  top = 35;
                  right = 70;
                  pWidth = '25%';
                  pHeight = '25%';
                }
              }
              if (player.largePlayer) {
                color = 'red';
              } else {
                color = '#28a745';
              }
              return (
                <Fragment key={player.position}>
                  {player && player.uid && (
                  <View
                    style={{
                      width: pWidth,
                      height: pHeight,
                      position: 'absolute',
                      top: top || null,
                      bottom: bottom || null,
                      left: left || null,
                      right: right || null,
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}
                    key={player.position}
                    className={`player ${index === 0 && ' player-left'} ${index === 1 && ' player-right'} ${index === 2 && ' player-firstperson'}`}
                  >
                    <View
                      style={{
                        color,
                        textAlign: 'center',
                        top: orientation === 'portrait' ? (0) : (40),
                        left: orientation === 'portrait' ? (0) : ((index === 0 && -100) || (index === 1 && -95) || (index === 2 && 80)),
                      }}
                    >
                      <Text style={{ color, textAlign: 'center' }}>
                        {player.largePlayer ? 'Lielais' : 'Mazais'}
                      </Text>
                    </View>
                    <View
                      style={{
                        position: 'relative',
                        width: index === 1 ? (orientation === 'portrait' ? (142) : (162)) : (orientation === 'portrait' ? (120) : (130)),
                        height: index === 1 ? (orientation === 'portrait' ? (142) : (162)) : (orientation === 'portrait' ? (120) : (130)),
                        padding: 0,
                        marginLeft: 5,
                        overflow: 'hidden',
                      }}
                    >
                      <View
                        style={{
                          width: index === 1 ? (orientation === 'portrait' ? (120) : (134)) : (orientation === 'portrait' ? (100) : (110)),
                          height: index === 1 ? (orientation === 'portrait' ? (120) : (134)) : (orientation === 'portrait' ? (100) : (110)),
                          borderRadius: index === 1 ? (70) : (80),
                          borderColor: '#dcbe66',
                          borderWidth: 5,
                          backgroundColor: '#847753',
                          overflow: 'hidden',
                        }}
                      >
                        <Image
                          style={{
                            width: index === 1 ? (orientation === 'portrait' ? (120) : (134)) : (orientation === 'portrait' ? (100) : (110)),
                            height: index === 1 ? (orientation === 'portrait' ? (120) : (134)) : (orientation === 'portrait' ? (100) : (110)),
                            borderRadius: index === 1 ? (70) : (80),
                            overflow: 'hidden',
                          }}
                          source={{ uri: player.photo }}
                        />
                      </View>
                      {/*  {(cards &&
                    <Fragment>
                      <TurnTimer
                        endRoom={endRoom}
                        nextTimeStamp={nextTimeStamp}
                        players={players}
                        offset={member.offset}
                        globalParams={globalParams}
                        currentTable={currentTable}
                        closeResultModal={this.closeResultModal}
                        gameResultModalShown={gameResultModalShown}
                      />
                    </Fragment>
                  )}  */}
                    </View>
                    <View
                      style={{ color, textAlign: 'center', top: orientation === 'portrait' ? (-20) : (-24) }}
                    >
                      <Text
                        style={{
                          color: '#fff', textAlign: 'center',
                        }}
                      >
                        {player.name}
                      </Text>
                    </View>
                    <View
                      style={{ color, textAlign: 'center', top: orientation === 'portrait' ? (-20) : (-24) }}
                    >
                      <Text style={{ color: '#ffc107', textAlign: 'center' }}>{`€ ${player.bal}`}</Text>
                    </View>
                    <View
                      style={{
                        color: '#FFF',
                        borderRadius: 20,
                        padding: 2,
                        textAlign: 'center',
                        width: 34,
                        height: 34,
                        position: 'absolute',
                        left: orientation === 'portrait' ? (-20) : (22),
                        top: index === 1 ? (orientation === 'portrait' ? (50) : (15)) : (orientation === 'portrait' ? (40) : (15)),
                        backgroundColor: '#242442',
                        borderColor: '#73bb73',
                        borderWidth: 2,
                      }}
                    >
                      <Text
                        style={{
                          color: '#FFF',
                          padding: 2,
                          textAlign: 'center',
                        //  borderColor: '#73bb73',
                        //  borderWidth: 2,
                        //  width: 32,
                        //  height: 32,
                        //  position: 'absolute',
                        //  top: 70,
                        //  background: '#242442',
                        //  border: '2px solid #73bb73',
                        }}
                      >
                        {player.lvl}
                      </Text>
                    </View>
                    {/*  <div className="player-gift"><i className="icon-present" /></div>  */}
                  </View>
                  )}
                </Fragment>
              );
            })}
            {((playersArranged[0] && !playersArranged[0].uid)
              || (playersArranged[1] && !playersArranged[1].uid)
              || (playersArranged[2] && !playersArranged[2].uid)) && (
              <Text style={{
                top: 300, left: 390, position: 'absolute', fontSize: 28, color: '#FFF',
              }}
              >
                {t('waitingForPlayers')}
              </Text>
            )}
          </View>
        </Content>
      </Container>
    );
  }
}

export default withTranslation('game')(Zole);
