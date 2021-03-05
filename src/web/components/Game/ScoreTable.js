import React from 'react';
import PropTypes from 'prop-types';

/* import {
  Media,
} from 'reactstrap'; */

import Media from 'reactstrap/lib/Media';

import { withTranslation } from 'react-i18next';
import isEqual from 'react-fast-compare';

import ScrollArea from 'react-scrollbar';

import coinImg from '../../../images/coin.svg';

import ScoreTableRow from './ScoreTableRow';

// let betRatio;

class ScoreTable extends React.Component {
  static propTypes = {
    t: PropTypes.func.isRequired,
    //  players: PropTypes.shape(),
    player1ShortName: PropTypes.string,
    player2ShortName: PropTypes.string,
    player3ShortName: PropTypes.string,
    points: PropTypes.shape(),
    totalPnts: PropTypes.shape({
      player1: PropTypes.number,
      player2: PropTypes.number,
      player3: PropTypes.number,
    }),
    myPos: PropTypes.string,
    scoreTableOpen: PropTypes.bool,
    party: PropTypes.number,
    bet: PropTypes.string,
  };

  static defaultProps = {
    //  players: {},
    player1ShortName: null,
    player2ShortName: null,
    player3ShortName: null,
    points: {},
    totalPnts: {},
    myPos: null,
    scoreTableOpen: true,
    party: null,
    bet: null,
  };

  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {
    this.scrollToBottom();
  }

  shouldComponentUpdate(nextProps) {
    if (!isEqual(nextProps, this.props)) {
      this.scrollToBottom();
      return true;
    }

    return false;

    /*  const {
      points,
      //  players,
      player1ShortName,
      player2ShortName,
      player3ShortName,
      totalPnts,
      scoreTableOpen,
      myPos,
    } = nextProps;
    const {
      points: curPoints,
      //  players: curPlayers,
      player1ShortName: curPlayer1ShortName,
      player2ShortName: curPlayer2ShortName,
      player3ShortName: curPlayer3ShortName,
      myPos: curMyPos,
      totalPnts: curTotalPoints,
      scoreTableOpen: curScoreTableOpen,
    } = this.props;
    if (points) {
      if (Object.keys(points).length) {
        if (Object.keys(points).length !== Object.keys(curPoints).length) {
          return true;
        }
      }
    }

    //  if (players && Object.keys(players).length !== Object.keys(curPlayers).length) {
    //    return true;
    //  }

    if (!curPlayer1ShortName && player1ShortName) {
      return true;
    }

    if (!curPlayer2ShortName && player2ShortName) {
      return true;
    }

    if (!curPlayer3ShortName && player3ShortName) {
      return true;
    }

    if (!curMyPos && myPos) {
      return true;
    }

    if (!curTotalPoints && totalPnts) {
      return true;
    }

    if (curTotalPoints && totalPnts && (totalPnts.player1 !== curTotalPoints.player1
      || totalPnts.player2 !== curTotalPoints.player2
      || totalPnts.player3 !== curTotalPoints.player3)) {
      return true;
    }

    if (curScoreTableOpen !== scoreTableOpen) {
      return true;
    }

    return false;  */
  }

  componentDidUpdate(prevProps) {
    //  const { points, scoreTableOpen } = this.props;
    //  const oldPoints = prevProps.points;
    //  const curScoreTableOpen = prevProps.scoreTableOpen;
    //  if (points && oldPoints && Object.keys(points).length !== Object.keys(oldPoints).length) {
    //    this.scrollToBottom();
    //  }
    //  if (curScoreTableOpen !== scoreTableOpen) {
    //    this.scrollToBottom();
    //  }
  }

  componentWillUnmount() {
    clearTimeout(this.timeoutID);
  }

  scrollToBottom = () => {
    if (this.pointsScrollbar) {
      this.timeoutID = setTimeout(() => {
        if (this.pointsScrollbar) {
          this.pointsScrollbar.scrollBottom();
        }
      }, 20);
    }
  };

  setLastRef = el => {
    this.lastRef = el;
  };

  renderPoints = (key, index) => {
    const {
      points,
      player1ShortName,
      player2ShortName,
      player3ShortName,
      myPos,
      party,
    } = this.props;
    return (
      <tr
        key={key}
        className="score-table-row"
        ref={el => {
          if (party === index + 2) {
            this.lastRef = el;
          }
        }}
      >
        <ScoreTableRow
          player1={points[key].player1}
          player2={points[key].player2}
          player3={points[key].player3}
          pule={points[key].pule}
          player1ShortName={player1ShortName || ''}
          player2ShortName={player2ShortName || ''}
          player3ShortName={player3ShortName || ''}
          myPos={myPos}
          index={index}
        />
      </tr>
    );
  };

  render() {
    const {
      t,
      //  players,
      player1ShortName,
      player2ShortName,
      player3ShortName,
      totalPnts,
      points,
      myPos,
      scoreTableOpen,
      //  party,
      bet,
    } = this.props;

    let betRatio;

    if (bet) {
      betRatio = parseInt(bet.replace('1:', ''), 10);
    }

    return (
      <div className={`score-table ${!scoreTableOpen ? 'display-none' : ''}`}>
        <table className="full-width">
          <colgroup>
            <col span="1" className="" />
          </colgroup>
          <thead className="full-width">
            <tr>
              <th className="score-table-id-header width-10">#</th>
              {myPos === 'player1' && (
                <>
                  <th className="score-table-header width-25">
                    {player2ShortName || ''}
                  </th>
                  <th className="score-table-header width-25">
                    {player1ShortName || ''}
                  </th>
                  <th className="score-table-header width-25">
                    {player3ShortName || ''}
                  </th>
                </>
              )}
              {myPos === 'player2' && (
                <>
                  <th className="score-table-header width-25">
                    {player3ShortName || ''}
                  </th>
                  <th className="score-table-header width-25">
                    {player2ShortName || ''}
                  </th>
                  <th className="score-table-header width-25">
                    {player1ShortName || ''}
                  </th>
                </>
              )}
              {myPos === 'player3' && (
                <>
                  <th className="score-table-header width-25">
                    {player1ShortName || ''}
                  </th>
                  <th className="score-table-header width-25">
                    {player3ShortName || ''}
                  </th>
                  <th className="score-table-header width-25">
                    {player2ShortName || ''}
                  </th>
                </>
              )}
              <th className="score-table-pules-header width-15">
                {t('pules')}
              </th>
            </tr>
          </thead>
          <tbody />
        </table>
        <ScrollArea
          speed={0.55}
          className="score-table-scroll-area"
          contentClassName="score-table-scroll-content"
        //  smoothScrolling
          verticalContainerStyle={{
            background: 'transparent',
            opacity: 1,
            width: 7,
          }}
          verticalScrollbarStyle={{
            background: '#fff',
            borderRadius: 1,
            width: 4,
            minHeight: 10,
            minScrollSize: 25,
          }}
          horizontal={false}
          ref={el => {
            this.pointsScrollbar = el;
          }}
        >
          <table style={{ width: '100%' }}>
            <thead />
            <tbody>
              {points && Object.keys(points).map(this.renderPoints)}
              {/*  {points && Object.keys(points).map((key, index) => (
                <tr
                  key={key}
                  className="score-table-row"
                  ref={(el) => {
                    if (party === index + 2) {
                      this.lastRef = el;
                    }
                  }}
                >
                  <ScoreTableRow
                    player1={points[key].player1}
                    player2={points[key].player2}
                    player3={points[key].player3}
                    pule={points[key].pule}
                    player1ShortName={player1ShortName || ''}
                    player2ShortName={player2ShortName || ''}
                    player3ShortName={player3ShortName || ''}
                    myPos={myPos}
                    index={index}
                  />
                </tr>
              ))} */}
            </tbody>
          </table>
        </ScrollArea>
        <table className="score-table-points">
          <thead />
          <tbody style={{ width: '100%' }}>
            <tr>
              <th className="score-table-points-col-id">
                <div>{t('points')}</div>
              </th>
              <th className="score-table-points-col">
                <>
                  {myPos === 'player1' && (
                    <>{totalPnts ? totalPnts.player2 : ''}</>
                  )}
                  {myPos === 'player2' && (
                    <>{totalPnts ? totalPnts.player3 : ''}</>
                  )}
                  {myPos === 'player3' && (
                    <>{totalPnts ? totalPnts.player1 : ''}</>
                  )}
                </>
              </th>
              <th className="score-table-points-col">
                <>
                  {myPos === 'player1' && (
                    <>{totalPnts ? totalPnts.player1 : ''}</>
                  )}
                  {myPos === 'player2' && (
                    <>{totalPnts ? totalPnts.player2 : ''}</>
                  )}
                  {myPos === 'player3' && (
                    <>{totalPnts ? totalPnts.player3 : ''}</>
                  )}
                </>
              </th>
              <th className="score-table-points-col">
                <>
                  {myPos === 'player1' && (
                    <>{totalPnts ? totalPnts.player3 : ''}</>
                  )}
                  {myPos === 'player2' && (
                    <>{totalPnts ? totalPnts.player1 : ''}</>
                  )}
                  {myPos === 'player3' && (
                    <>{totalPnts ? totalPnts.player2 : ''}</>
                  )}
                </>
              </th>
              <th className="score-table-points-col-pules" />
            </tr>
          </tbody>
        </table>
        <table className="score-table-sum">
          <thead />
          <tbody style={{ width: '100%' }}>
            <tr>
              <th className="score-table-sum-col-id">
                <div>
                  <Media src={coinImg} className="player-balance-coin" />
                </div>
              </th>
              <th className="score-table-points-col">
                <>
                  {myPos === 'player1' && (
                    <>
                      {totalPnts && totalPnts.player2 && betRatio
                        ? betRatio * totalPnts.player2
                        : 0}
                    </>
                  )}
                  {myPos === 'player2' && (
                    <>
                      {totalPnts && totalPnts.player3 && betRatio
                        ? betRatio * totalPnts.player3
                        : 0}
                    </>
                  )}
                  {myPos === 'player3' && (
                    <>
                      {totalPnts && totalPnts.player1 && betRatio
                        ? betRatio * totalPnts.player1
                        : 0}
                    </>
                  )}
                </>
              </th>
              <th className="score-table-points-col">
                <>
                  {myPos === 'player1' && (
                    <>
                      {totalPnts && totalPnts.player1 && betRatio
                        ? betRatio * totalPnts.player1
                        : 0}
                    </>
                  )}
                  {myPos === 'player2' && (
                    <>
                      {totalPnts && totalPnts.player2 && betRatio
                        ? betRatio * totalPnts.player2
                        : 0}
                    </>
                  )}
                  {myPos === 'player3' && (
                    <>
                      {totalPnts && totalPnts.player3 && betRatio
                        ? betRatio * totalPnts.player3
                        : 0}
                    </>
                  )}
                </>
              </th>
              <th className="score-table-points-col">
                <>
                  {myPos === 'player1' && (
                    <>
                      {totalPnts && totalPnts.player3 && betRatio
                        ? betRatio * totalPnts.player3
                        : 0}
                    </>
                  )}
                  {myPos === 'player2' && (
                    <>
                      {totalPnts && totalPnts.player1 && betRatio
                        ? betRatio * totalPnts.player1
                        : 0}
                    </>
                  )}
                  {myPos === 'player3' && (
                    <>
                      {totalPnts && totalPnts.player2 && betRatio
                        ? betRatio * totalPnts.player2
                        : 0}
                    </>
                  )}
                </>
              </th>
              <th className="score-table-sum-col-pules" />
            </tr>
          </tbody>
        </table>
      </div>
    );
  }
}

export default withTranslation('game')(ScoreTable);
