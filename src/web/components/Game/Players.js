import React, { Fragment } from 'react';
import PropTypes from 'prop-types';

/* import {
  Button,
  Media,
} from 'reactstrap'; */

import Media from 'reactstrap/lib/Media';
import Button from 'reactstrap/lib/Button';

import isEqual from 'react-fast-compare';

import TurnTimer from './TurnTimer';

import PlayerImage from './PlayersComponents/PlayerImage';
import PlayerType from './PlayersComponents/PlayerType';
import PlayerHand from './PlayersComponents/PlayerHand';
import PlayerInfo from './PlayersComponents/PlayerInfo';
import PlayerGift from './PlayersComponents/PlayerGift';
import PlayerEmotion from './PlayersComponents/PlayerEmotion';

// import defaultImage from '../../../images/Game/defaultImage.jpg';

// import lielaisImg from '../../../images/Game/LIELAIS.svg';
// import mazaisImg from '../../../images/Game/MAZAIS.svg';

import blockImg from '../../../images/Game/block.svg';
import unblockImg from '../../../images/Game/unblock.svg';
// import giftImg from '../../../images/Game/gift.svg';

// import coinImg from '../../../images/coin.svg';

import myTurnSound from '../../../sounds/my_turn4.mp3';

/*
const playersArranged = [];

const Players = React.memo(({
  players,
  myPos,
  t,
  //  member,
  uid,
  offset,
  nextTimeStamp,
  currentTurn,
  largePlayer,
  //  currentTable,
  currentType,
  gameState,
  talking,
  lowBalPlayers,
  lastRound,
  disableTimer,
  gameResult,
  roomClosed,
  currentHand,
  fastGame,
  endRoom,
  //  globalParams,
  gameResultModalShown,
  gameSettings,
//  user,
  quitRound,
  quitRoundFunction,
  gifts,
  toggleGiftsModal,
  roomGifts,
  ignoredUsers,
  unBlockUser,
  toggleBlockUser,
  emotions,
  closeResultModal,
  toggleLastRound,
  cardPlayed,
}) => {
  if (!uid || !players || !players.playerList) {
    return null;
  }

//  const playersArranged = [];

  if (players && players.playerList && playersArranged.length === 0) {
    if (myPos === 'player1') {
      playersArranged[0] = { ...players.player2, position: 'player2' };
      playersArranged[1] = { ...players.player3, position: 'player3' };
      playersArranged[2] = { ...players.player1, position: 'player1' };
    }
    if (myPos === 'player2') {
      playersArranged[0] = { ...players.player3, position: 'player3' };
      playersArranged[1] = { ...players.player1, position: 'player1' };
      playersArranged[2] = { ...players.player2, position: 'player2' };
    }
    if (myPos === 'player3') {
      playersArranged[0] = { ...players.player1, position: 'player1' };
      playersArranged[1] = { ...players.player2, position: 'player2' };
      playersArranged[2] = { ...players.player3, position: 'player3' };
    }
  }

  return (
    <Fragment>
      {playersArranged && playersArranged.map((player, index) => (
        <Fragment key={player.position}>
          {player && player.uid && (
          <div key={player.position} className={`player ${index === 0 && ' player-left'} ${index === 1 && ' player-right'} ${index === 2 && ' player-firstperson'}`}>
            <div
              style={{
                position: 'relative',
                width: 114,
                height: 114,
                padding: 7,
                marginLeft: 5,
              }}
            >
              <PlayerImage photo={player.photo} />
              <div className={(talking && player.uid && uid
          && ((gameState === 'choose' && talking.toString() === player.uid.toString())
          || (gameState === 'play' && player.position === currentTurn)
          || (gameState === 'burry' && player.position === currentTurn)
          || (gameState === 'lowBal' && lowBalPlayers)
          || (gameState === 'results' && player.uid.toString() === uid.toString()))) ? '' : 'display-none'}
              >
                <TurnTimer
                  endRoom={endRoom}
                  nextTimeStamp={nextTimeStamp}
                  players={players}
                  offset={offset}
                  gameResult={gameResult}
                  gameState={gameState}
                  lowBalPlayers={lowBalPlayers}
                  disableTimer={disableTimer || null}
                  fastGame={fastGame}
                  roomClosed={roomClosed}
                  closeResultModal={closeResultModal}
                  gameResultModalShown={gameResultModalShown}
                  gameSettings={gameSettings}
                  cardPlayed={cardPlayed}
                />
              </div>
            </div>

            {largePlayer && (
              <PlayerType
                currentType={currentType}
                gameState={gameState}
                largePlayer={!!((largePlayer && player.position === largePlayer))}
              />
            )}


            <PlayerHand
              gameState={gameState}
              currentHand={currentHand}
              playerPosition={player.position}
              currentTurn={currentTurn}
            />

            <PlayerInfo
              lvl={player.lvl}
              name={player.name}
              bal={player.bal}
            />

            <PlayerGift
              index={index}
              gifts={gifts}
              roomGifts={roomGifts}
              uid={player.uid}
              toggleGiftsModal={toggleGiftsModal}
            />

            <PlayerEmotion
              index={index}
              emotion={players[player.position].emotion}
            />

            {((index === 0 || index === 1)) && (
            <Fragment>
              {(ignoredUsers && player.uid && ignoredUsers[player.uid.toString()]) ? (
                <Fragment>
                  <Button color="link" className="block-button" onClick={() => unBlockUser(player.uid.toString())}>
                    <Media
                      className="block-button-image"
                      src={unblockImg}
                      alt=""
                    />
                  </Button>
                </Fragment>
              ) : (
                <Fragment>
                  <Button color="link" className="block-button" onClick={() => toggleBlockUser(player.uid.toString(), player.name)}>
                    <Media
                      className="block-button-image"
                      src={blockImg}
                      alt=""
                    />
                  </Button>
                </Fragment>
              )}
            </Fragment>
            )}
          </div>
          )}

          {player && player.uid && player.uid === uid && (
          <Fragment>
            <div className="last-round">
              <Button
                disabled={lastRound}
                className={`last-round-button ${lastRound && 'active'}`}
                onClick={toggleLastRound}
              >
                {t('lastRound')}
              </Button>
            </div>

            {!!((largePlayer && player.position === largePlayer)) && (
            <div className="quit-round">
              <Button className={`quit-round-button ${quitRound && 'active'}`} onClick={quitRoundFunction}>
                {t('quitRound')}
              </Button>
            </div>
            )}
          </Fragment>
          )}
        </Fragment>
      ))}
    </Fragment>
  );
});

Players.propTypes = {
  t: PropTypes.func.isRequired,
  nextTimeStamp: PropTypes.number,
  endRoom: PropTypes.func.isRequired,
  players: PropTypes.shape().isRequired,
  member: PropTypes.shape(),
  uid: PropTypes.string,
  offset: PropTypes.number,
  currentTurn: PropTypes.string.isRequired,
  gameResultModalShown: PropTypes.bool,
  gameSettings: PropTypes.shape(),
  currentType: PropTypes.string,
//  user: PropTypes.string,
  quitRound: PropTypes.bool,
  quitRoundFunction: PropTypes.func.isRequired,
  gifts: PropTypes.shape(),
  toggleGiftsModal: PropTypes.func.isRequired,
  roomGifts: PropTypes.shape(),
  ignoredUsers: PropTypes.shape(),
  unBlockUser: PropTypes.func.isRequired,
  toggleBlockUser: PropTypes.func.isRequired,
  emotions: PropTypes.shape(),
  closeResultModal: PropTypes.func.isRequired,
  toggleLastRound: PropTypes.func.isRequired,
  myPos: PropTypes.string,
  largePlayer: PropTypes.string,
  gameState: PropTypes.string,
  talking: PropTypes.string,
  currentHand: PropTypes.string,
  lowBalPlayers: PropTypes.shape(),
  lastRound: PropTypes.bool,
  disableTimer: PropTypes.bool,
  gameResult: PropTypes.shape(),
  roomClosed: PropTypes.bool,
  fastGame: PropTypes.bool,
};

Players.defaultProps = {
  nextTimeStamp: null,
  member: {},
  currentType: null,
  gameResultModalShown: true,
  gameSettings: {},
//  user: null,
  quitRound: false,
  gifts: {},
  roomGifts: {},
  ignoredUsers: {},
  emotions: {},
  myPos: null,
  largePlayer: null,
  gameState: null,
  talking: null,
  currentHand: null,
  lowBalPlayers: null,
  lastRound: false,
  disableTimer: null,
  gameResult: null,
  roomClosed: false,
  fastGame: null,
};

export default Players; */

class Players extends React.Component {
  static propTypes = {
    t: PropTypes.func.isRequired,
    nextTimeStamp: PropTypes.number,
    endRoom: PropTypes.func.isRequired,
    roomId: PropTypes.string.isRequired,
    players: PropTypes.shape().isRequired,
    member: PropTypes.shape(),
    uid: PropTypes.string,
    offset: PropTypes.number,
    currentTurn: PropTypes.string,
    gameResultModalShown: PropTypes.bool,
    gameSettings: PropTypes.shape(),
    currentType: PropTypes.string,
    //  user: PropTypes.string,
    quitRound: PropTypes.bool,
    quitRoundFunction: PropTypes.func.isRequired,
    gifts: PropTypes.shape(),
    toggleGiftsModal: PropTypes.func.isRequired,
    roomGifts: PropTypes.shape(),
    ignoredUsers: PropTypes.shape(),
    unBlockUser: PropTypes.func.isRequired,
    toggleBlockUser: PropTypes.func.isRequired,
    emotions: PropTypes.shape(),
    closeResultModal: PropTypes.func.isRequired,
    toggleLastRound: PropTypes.func.isRequired,
    refetchRoomData: PropTypes.func.isRequired,
    myPos: PropTypes.string,
    largePlayer: PropTypes.string,
    gameState: PropTypes.string,
    talking: PropTypes.string,
    currentHand: PropTypes.number,
    lowBalPlayers: PropTypes.shape(),
    lastRound: PropTypes.bool,
    disableTimer: PropTypes.bool,
    gameResult: PropTypes.shape(),
    roomClosed: PropTypes.bool,
    fastGame: PropTypes.bool,
    userSettings: PropTypes.shape().isRequired
  };

  static defaultProps = {
    nextTimeStamp: null,
    member: {},
    currentType: null,
    gameResultModalShown: true,
    gameSettings: {},
    //  user: null,
    quitRound: false,
    gifts: {},
    roomGifts: {},
    ignoredUsers: {},
    emotions: {},
    myPos: null,
    largePlayer: null,
    gameState: null,
    talking: null,
    currentHand: null,
    lowBalPlayers: null,
    lastRound: false,
    disableTimer: null,
    gameResult: null,
    roomClosed: false,
    fastGame: null,
  };

  constructor(props) {
    super(props);
    this.state = {
      playersArranged: [],
    };
    this.myTurnAudio = new Audio(myTurnSound);
  }

  componentDidMount() {}

  componentWillReceiveProps(nextProps) {
    const { players, myPos } = nextProps;

    const playersArranged = [];

    if (players && players.playerList) {
      if (myPos === 'player1') {
        playersArranged[0] = { ...players.player2, position: 'player2' };
        playersArranged[1] = { ...players.player3, position: 'player3' };
        playersArranged[2] = { ...players.player1, position: 'player1' };
      }
      if (myPos === 'player2') {
        playersArranged[0] = { ...players.player3, position: 'player3' };
        playersArranged[1] = { ...players.player1, position: 'player1' };
        playersArranged[2] = { ...players.player2, position: 'player2' };
      }
      if (myPos === 'player3') {
        playersArranged[0] = { ...players.player1, position: 'player1' };
        playersArranged[1] = { ...players.player2, position: 'player2' };
        playersArranged[2] = { ...players.player3, position: 'player3' };
      }
    }

    this.setState({ playersArranged })
  }

  shouldComponentUpdate(nextProps) {
    if (!isEqual(nextProps, this.props)) {
      return true;
    }

    return false;
  }

  componentDidUpdate(prevProps) {

    const { gameState, talking, member, currentTurn, roomId, userSettings } = this.props;
    const { gameState: prevGameState, currentTurn: prevCurrentTurn, talking: prevTalking } = prevProps;

    if(userSettings && userSettings.soundOn){

      let turnChanged = prevCurrentTurn !== currentTurn;
      let position = undefined;

      if(member && member.joinedRooms && member.joinedRooms[roomId]){
        position =  member.joinedRooms[roomId].position;
      }

      if((prevGameState !== 'choose' || !prevTalking) && gameState === 'choose' && member.uid && talking && talking.toString() === member.uid.toString()){
        this.myTurnAudio.play();
      }else if(gameState === 'burry' && (position && position === currentTurn) && turnChanged){
        this.myTurnAudio.play();
      }else if(gameState === 'play' && (position && position === currentTurn) && turnChanged){
      //  this.myTurnAudio.play();
      }
    }
  }

  render() {
    const {
      players,
      myPos,
      t,
      //  member,
      uid,
      offset,
      nextTimeStamp,
      currentTurn,
      largePlayer,
      //  currentTable,
      currentType,
      gameState,
      talking,
      lowBalPlayers,
      lastRound,
      disableTimer,
      gameResult,
      roomClosed,
      currentHand,
      fastGame,
      endRoom,
      //  globalParams,
      gameResultModalShown,
      gameSettings,
      //  user,
      quitRound,
      quitRoundFunction,
      gifts,
      toggleGiftsModal,
      roomGifts,
      ignoredUsers,
      unBlockUser,
      toggleBlockUser,
      //  emotions,
      closeResultModal,
      toggleLastRound,
      cardPlayed,
      refetchRoomData,
    } = this.props;

    const { playersArranged } = this.state;

  /*  const playersArranged = [];

    if (players && players.playerList && playersArranged.length === 0) {
      if (myPos === 'player1') {
        playersArranged[0] = { ...players.player2, position: 'player2' };
        playersArranged[1] = { ...players.player3, position: 'player3' };
        playersArranged[2] = { ...players.player1, position: 'player1' };
      }
      if (myPos === 'player2') {
        playersArranged[0] = { ...players.player3, position: 'player3' };
        playersArranged[1] = { ...players.player1, position: 'player1' };
        playersArranged[2] = { ...players.player2, position: 'player2' };
      }
      if (myPos === 'player3') {
        playersArranged[0] = { ...players.player1, position: 'player1' };
        playersArranged[1] = { ...players.player2, position: 'player2' };
        playersArranged[2] = { ...players.player3, position: 'player3' };
      }
    } */

    return (
    <Fragment>
      {playersArranged && playersArranged.map((player, index) => (
        <Fragment key={player.position}>
          {player && player.uid && (
          <div id={`player-${player.position}`} key={player.position} className={`player ${(gameState === 'play' && player.position === currentTurn) && ' is-player-turn'} ${index === 0 && ' player-left'} ${index === 1 && ' player-right'} ${index === 2 && ' player-firstperson'}`}>

            <div className="player-status-wrapper">
              {(gameState === 'choose' && talking.toString() === player.uid.toString()) && (
                 <div className="player-status">{t('actionChoose')}</div>
              )}
              {(gameState === 'burry' && player.position === currentTurn) && (
                 <div className="player-status">{t('actionBurry')}</div>
              )}
              {(gameState === 'play' && player.position === currentTurn) && (
                 <div className="player-status">{t('actionMove')}</div>
              )}
            </div>

            <div className="player-image-timer-wrapper">
              <PlayerImage
                photo={player.photo || ''}
                currentType={currentType}
                gameState={gameState}
                largePlayer={!!(largePlayer && player.position === largePlayer)}
              />
                {(talking && player.uid && uid
            && ((gameState === 'choose' && talking.toString() === player.uid.toString())
            || (gameState === 'play' && player.position === currentTurn)
            || (gameState === 'burry' && player.position === currentTurn)
            || (gameState === 'results' && player.uid.toString() === uid.toString())
            || (gameState === 'lowBal' && lowBalPlayers))) && (

                    <TurnTimer
                      endRoom={endRoom}
                      nextTimeStamp={nextTimeStamp}
                    //  players={players}
                      offset={offset}
                      gameResult={gameResult}
                      gameState={gameState}
                      lowBalPlayers={lowBalPlayers}
                      disableTimer={disableTimer || null}
                      fastGame={fastGame}
                      roomClosed={roomClosed}
                      closeResultModal={closeResultModal}
                      gameResultModalShown={gameResultModalShown}
                      gameSettings={gameSettings}
                      cardPlayed={cardPlayed}
                      refetchRoomData={refetchRoomData}
                      currentTurn={currentTurn}
                      myPos={myPos}
                    />

                  )}

                  <PlayerGift
                    index={index}
                    gifts={gifts}
                    roomGifts={roomGifts}
                    uid={player.uid}
                    toggleGiftsModal={toggleGiftsModal}
                  />


                  {(index === 0 || index === 1) && (
                    <>
                      {ignoredUsers && player.uid && ignoredUsers[player.uid.toString()] ? (
                        <>
                          <Button
                            color="link"
                            className="block-button"
                            onClick={() => unBlockUser(player.uid.toString())}
                          >
                            <Media className="block-button-image" src={unblockImg} alt="" />
                          </Button>
                        </>
                      ) : (
                        <>
                          <Button
                            color="link"
                            className="block-button"
                            onClick={() => toggleBlockUser(player.uid.toString(), player.name)}
                          >
                            <Media className="block-button-image" src={blockImg} alt="" />
                          </Button>
                        </>
                      )}
                    </>
                  )}


            </div>

                  {largePlayer && (
                    <PlayerType
                      t={t}
                      currentType={currentType}
                      gameState={gameState}
                      largePlayer={!!(largePlayer && player.position === largePlayer)}
                    />
                  )}

                  <PlayerHand
                    gameState={gameState}
                    currentHand={currentHand}
                    playerPosition={player.position}
                    currentTurn={currentTurn}
                  />

                  <PlayerInfo lvl={player.lvl} name={player.name} bal={player.bal} />



                  <PlayerEmotion index={index} emotion={players[player.position].emotion} />


                </div>
              )}
            </Fragment>
          ))}
        <Fragment>
          {/* Last round button */}
          <div className="last-round">
            <Button
              disabled={lastRound}
              className={`last-round-button ${lastRound && 'active'}`}
              onClick={toggleLastRound}
            >
              {t('lastRound')}
            </Button>
          </div>

          {/* Quit round button */}
          {!!(largePlayer && myPos === largePlayer) && (
            <div className="quit-round">
              <Button
                className={`quit-round-button ${quitRound && 'active'}`}
                onClick={quitRoundFunction}
              >
                {t('quitRound')}
              </Button>
            </div>
          )}
        </Fragment>
      </Fragment>
    );
  }
}

export default Players;
