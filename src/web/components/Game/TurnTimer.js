import React from 'react';
import PropTypes from 'prop-types';

import CircularProgressbar from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';

class TurnTimer extends React.Component {
  static propTypes = {
    nextTimeStamp: PropTypes.number,
    endRoom: PropTypes.func.isRequired,
    closeResultModal: PropTypes.func.isRequired,
  //  players: PropTypes.shape(),
    //  globalParams: PropTypes.shape(),
    //  currentTable: PropTypes.arrayOf(PropTypes.shape()),
    gameSettings: PropTypes.shape(),
    offset: PropTypes.number,
    gameResultModalShown: PropTypes.bool,
    cardPlayed: PropTypes.string,
    disableTimer: PropTypes.bool,
    fastGame: PropTypes.bool,
    roomClosed: PropTypes.bool,
    gameState: PropTypes.string,
    gameResult: PropTypes.shape(),
    lowBalPlayers: PropTypes.shape(),
  };

  static defaultProps = {
    nextTimeStamp: null,
  //  players: {},
    //  globalParams: {},
    //  currentTable: [],
    gameSettings: {},
    offset: 0,
    gameResultModalShown: false,
    cardPlayed: null,
    disableTimer: null,
    fastGame: null,
    roomClosed: false,
    gameState: null,
    gameResult: null,
    lowBalPlayers: {},
  };

  constructor(props) {
    super(props);
    this.state = {
      percentage: 100,
      timer: '',
      stopTimer: false,
      closeResultModalCalled: false,
      endRoomCalled: false,
      dataFetched: false,
    };
  }

  componentDidMount() {
    let nextTimerTime;
    this.intervalID = setInterval(() => {
      const {
      //  players,
        nextTimeStamp, offset, fastGame, gameSettings, gameState,
      } = this.props;
      const { stopTimer } = this.state;

      if (
        gameSettings
        && nextTimeStamp
        && nextTimeStamp !== null
      //  && players
      //  && players.player1
      //  && players.player2
      //  && players.player3
        && !stopTimer
        && offset
      ) {
        nextTimerTime = (nextTimeStamp - (Date.now() + offset - 500)) / 1000;

        this.setState({
          //  percentage: (nextTimerTime / (fastGame
          //    ? (gameSettings.fastSpeed || 10) : (gameSettings.normalSpeed || 20)) * 100),
          percentage:
            (nextTimerTime
              / (gameState === 'results'
                ? 6
                : fastGame
                  ? gameSettings.fastSpeed || 10
                  : gameSettings.normalSpeed || 20))
            * 100,
          timer: Math.round(nextTimerTime),
        });
      } else {
        this.setState({
          timer: 0,
        });
      }
    }, 1000);
  }

  componentDidUpdate() {
    const { timer, stopTimer, dataFetched } = this.state;

    const {
      roomClosed,
      gameState,
      gameResult,
      nextTimeStamp,
      gameResultModalShown,
      disableTimer,
      cardPlayed,
      gameSettings,
      currentTurn,
      myPos,
      fastGame,
      refetchRoomData,
    } = this.props;

    let refetchLimit;

    if (fastGame) {
      refetchLimit = Math.round((gameSettings.fastSpeed / 2));
    } else {
      refetchLimit = Math.round((gameSettings.normalSpeed / 2));
    }

  //  console.log(refetchLimit);

    if (gameState !== 'results'
      && !dataFetched
      && !stopTimer
      && !disableTimer
      && !cardPlayed
      && currentTurn !== myPos
      && timer === refetchLimit
    ) {
      console.log('refetch data');
      this.setState({ dataFetched: true });
      refetchRoomData();

      this.timeoutID = setTimeout(() => {
        this.setState({ dataFetched: false });
      }, 7500);
    }

    if (
      (gameState === 'results' || gameResult)
      && nextTimeStamp
      && timer < 0
      && gameResultModalShown
    ) {
      this.closeResultModal();
    }

    if (
      !roomClosed
      && !gameResult
      && gameState !== 'results'
      && nextTimeStamp
      && timer < 0
      && !stopTimer
      && !disableTimer
      && !cardPlayed
    ) {
      this.endRoom();
    }
  }

  shouldComponentUpdate(nextState) {
    const { timer } = this.state;
    const nextTimer = nextState;

    if (timer !== nextTimer) {
      return true;
    }

    return true;
  }

  componentWillUnmount() {
    clearInterval(this.intervalID);
    clearTimeout(this.timeoutID);
  }

  closeResultModal = () => {
    const { closeResultModal } = this.props;
    const { closeResultModalCalled } = this.state;

    if (!closeResultModalCalled) {
      this.setState({ closeResultModalCalled: true });

      closeResultModal();

      setTimeout(() => {
        this.setState({ closeResultModalCalled: false });
      }, 2000);
    }
  };

  endRoom = () => {
    const { endRoom } = this.props;
    const { endRoomCalled, timer } = this.state;

    if (!endRoomCalled) {
      let timeout = 4000;
      if (timer > -2 && timer <= 0) {
        timeout = 2000;
      } else if (timer > -3 && timer <= -2) {
        timeout = 4000;
      } else if (timer > -5 && timer <= -3) {
        timeout = 8000;
      } else if (timer > -6 && timer <= -5) {
        timeout = 12000;
      } else if (timer > -8 && timer <= -6) {
        timeout = 25000;
      } else if (timer <= -8) {
        timeout = 45000;
      }

    //  console.log('timeout');
    //  console.log(timeout);

      this.setState({ endRoomCalled: true });

      endRoom();

      setTimeout(() => {
        this.setState({ endRoomCalled: false });
      }, timeout);
    }
  };

  render() {
    const {
      timer,
    //  stopTimer,
      percentage
    } = this.state;

  /*  const {
      endRoom,
      roomClosed,
      gameState,
      gameResult,
      lowBalPlayers,
      disableTimer,
      nextTimeStamp,
      //  closeResultModal,
      gameResultModalShown,
      cardPlayed,
    } = this.props; */

    //  if ((gameState === 'results' || gameResult) && nextTimeStamp && timer < 0 && gameResultModalShown) {
    //  this.closeResultModal();
    //    return null;
    //  }

    //  if ((gameState === 'results' || gameResult) && nextTimeStamp && timer > 0) {
    //      return null;
    //  }

    //  if ((gameState === 'lowBal' || lowBalPlayers) && nextTimeStamp && timer < 0 && !stopTimer) {
    //    endRoom();
    //    return null;
    //  }

    //  if ((gameState === 'lowBal' || lowBalPlayers) && nextTimeStamp && timer > 0) {
    //    return null;
    //  }

    //  if (!roomClosed && !gameResult && gameState !== 'results'
    //    && nextTimeStamp && timer < 0 && !stopTimer && !disableTimer && !cardPlayed) {
    //    endRoom();
    //  }

    if (!timer && timer !== 0) {
      return null;
    }

    return (
      <div className="turn-timer-wrapper">
        <CircularProgressbar
          percentage={percentage}
          text={`${timer > 0 ? timer : '0'}`}
          counterClockwise="true"
          className="timer"
          background
          styles={{
            path: {
              stroke: 'rgba(251,216,90)',
              strokeLinecap: 'butt',
              transition: `stroke-dashoffset ${percentage > 97 ? '0' : '1'}s linear 0s`,
              //  transition: 'stroke-dashoffset 1s linear 0s',
              zIndex: 50,
            },
            trail: {
              stroke: 'transparent',
            },
            text: {
              fill: '#fff',
              fontSize: '32px',
              fontWeight: 600,
              zIndex: 30,
            },
            background: {
              fill: 'rgba(197,79,79,0.6)',
              zIndex: 10,
            },
          }}
        />
      </div>
    );
  }
}

export default TurnTimer;
