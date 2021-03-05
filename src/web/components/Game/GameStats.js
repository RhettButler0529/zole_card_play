import React, { Fragment } from 'react';
import PropTypes from 'prop-types';

import GameTimer from './GameTimer';

class GameStats extends React.Component {
  static propTypes = {
    t: PropTypes.func.isRequired,
    gameStartTime: PropTypes.number,
    offset: PropTypes.number,
    gameType: PropTypes.string,
    smallGame: PropTypes.bool,
    bet: PropTypes.string,
    party: PropTypes.number,
    scoreTableOpen: PropTypes.bool,
  }

  static defaultProps = {
    gameStartTime: null,
    offset: null,
    gameType: null,
    smallGame: null,
    bet: null,
    party: null,
    scoreTableOpen: true,
  }

  constructor(props) {
    super(props);
    this.state = {

    };
  }

  componentDidMount() {

  }

  shouldComponentUpdate(nextProps) {
    const {
      gameStartTime,
      offset,
      gameType,
      smallGame,
      bet,
      party,
      scoreTableOpen,
    } = nextProps;
    const {
      gameStartTime: curGameStartTime,
      offset: curOffset,
      gameType: curGameType,
      smallGame: curSmallGame,
      bet: curBet,
      party: curParty,
      scoreTableOpen: curScoreTableOpen,
    } = this.props;

    if (scoreTableOpen !== curScoreTableOpen) {
      return true;
    }

    if (gameStartTime !== curGameStartTime) {
      return true;
    }

    if (offset !== curOffset) {
      return true;
    }

    if (gameType !== curGameType) {
      return true;
    }

    if (smallGame !== curSmallGame) {
      return true;
    }

    if (bet !== curBet) {
      return true;
    }

    if (party !== curParty) {
      return true;
    }

    return false;
  }


  render() {
    const {
      t,
      gameStartTime,
      offset,
      gameType,
      smallGame,
      bet,
      party,
      scoreTableOpen,
    } = this.props;

    return (
      <div className={`game-stats ${!scoreTableOpen ? 'display-none' : ''}`}>
        <table className="game-stats-table">
          <tbody>
            <tr>
              <th className="game-stats-table-col">{t('type')}</th>
              <th className="game-stats-table-col">{t('time')}</th>
              <th className="game-stats-table-col">{t('parties')}</th>
              <th className="game-stats-table-col">{t('bet')}</th>
            </tr>
            <tr>
              <th className="game-stats-table-col">
                {gameType === 'P' ? (
                  <Fragment>
                    {smallGame ? (
                      <div>
                    PM
                      </div>
                    ) : (
                      <div>
                    P
                      </div>
                    )}
                  </Fragment>
                ) : (
                  <Fragment>
                    {smallGame ? (
                      <div>
                    MG
                      </div>
                    ) : (
                      <div>
                    G
                      </div>
                    )}
                  </Fragment>
                )}
              </th>
              <th className="game-stats-table-col">
                {gameStartTime && offset && (
                <GameTimer
                  gameStartTime={gameStartTime}
                  offset={offset}
                />
                )}
              </th>
              <th className="game-stats-table-col">{party}</th>
              <th className="game-stats-table-col">{bet}</th>
            </tr>
          </tbody>
        </table>
      </div>
    );
  }
}

export default GameStats;
