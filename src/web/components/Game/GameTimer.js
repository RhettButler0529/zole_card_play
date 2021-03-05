import React from 'react';
import PropTypes from 'prop-types';

class GameTimer extends React.Component {
  static propTypes = {
    gameStartTime: PropTypes.number,
    offset: PropTypes.number,
  }

  static defaultProps = {
    gameStartTime: 0,
    offset: 0,
  }

  constructor(props) {
    super(props);
    this.state = {
      hours: 0,
      minutes: 0,
      seconds: 0,
    };
  }

  componentDidMount() {
    this.timeoutID = setTimeout(
      () => {
        this.intervalID = setInterval(() => {
          const { gameStartTime, offset } = this.props;

          if (gameStartTime) {
            const timeNow = Date.now() + offset;
            const gameLength = timeNow - gameStartTime;
            const hours = Math.floor((gameLength % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((gameLength % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((gameLength % (1000 * 60)) / 1000);

            this.setState({
              hours: hours < 10 ? `0${hours}` : hours,
              minutes: minutes < 10 ? `0${minutes}` : minutes,
              seconds: seconds < 10 ? `0${seconds}` : seconds,
            });
          }
        }, 1000);
      },
      4000,
    );
  }


  componentWillUnmount() {
    clearTimeout(this.timeoutID);
    clearInterval(this.intervalID);
  }

  render() {
    const {
      hours,
      minutes,
      seconds,
    } = this.state;

    return (
      <div className="game-stats-timer">
        {`${hours}:${minutes}:${seconds}`}
      </div>
    );
  }
}

export default GameTimer;
