import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Firebase } from '../../lib/firebase';

import {
  getPoints,
} from '../../actions/points';

import ScoreTableComponent from '../../web/components/Game/ScoreTable';

class ScoreTable extends Component {
  static propTypes = {
  //  game: PropTypes.shape(),
    player1ShortName: PropTypes.string,
    player2ShortName: PropTypes.string,
    player3ShortName: PropTypes.string,
    totalPnts: PropTypes.shape(),
    points: PropTypes.shape(),
    myPos: PropTypes.string,
    bet: PropTypes.string,
    party: PropTypes.number,
    member: PropTypes.shape(),
    globalParams: PropTypes.shape({
      gameState: PropTypes.string,
    }),
    fetchPoints: PropTypes.func.isRequired,
  }

  static defaultProps = {
    match: null,
  //  game: {},
    history: {},
    player1ShortName: null,
    player2ShortName: null,
    player3ShortName: null,
    totalPnts: null,
    points: null,
    myPos: null,
    bet: null,
    party: null,
  }

  constructor(props) {
    super(props);
    this.state = {
      uid: '',
      scoreTableOpen: true,
    };

  }

  componentDidMount = () => {
    const {
      fetchPoints,
      roomId,
    } = this.props;

    Firebase.auth().onAuthStateChanged((user) => {
      if (user) {

        if (roomId) {
          fetchPoints(roomId);
        }
      }
    });
  }

  componentWillUnmount() {
  }

  toggleScoreTable = () => {
    const { scoreTableOpen } = this.state;

    if (!scoreTableOpen) {
    //  console.log('set scrollToBottom');
    //  this.scrollToBottom();
    }
    this.setState(prevState => ({
      scoreTableOpen: !prevState.scoreTableOpen,
    }));
  }

  render = () => {
    const {
      player1ShortName,
      player2ShortName,
      player3ShortName,
      totalPoints,
      points,
      myPos,
      scoreTableOpen,
      bet,
      party,
      roomId,
    } = this.props;

    return (
      <ScoreTableComponent
        player1ShortName={player1ShortName}
        player2ShortName={player2ShortName}
        player3ShortName={player3ShortName}
        totalPnts={totalPoints}
        points={points}
        myPos={myPos}
        scoreTableOpen={scoreTableOpen}
        bet={bet}
        party={party}
      />
    );
  }
}

const mapStateToProps = (state, ownProps) => {
  const { roomId } = ownProps;

  if (state.game) {
    return ({
      totalPoints: state.points.totalPoints || {},
      points: state.points.points || {},
      myPos: state.game.myPos || null,
      bet: state.game.globalParams.bet || null,
      party: state.game.globalParams.party || null,
      player1ShortName: state.game.players.player1 ? state.game.players.player1.shortName : '',
      player2ShortName: state.game.players.player2 ? state.game.players.player2.shortName : '',
      player3ShortName: state.game.players.player3 ? state.game.players.player3.shortName : '',
    });
  } else {
    return null;
  }
};

const mapDispatchToProps = {
  fetchPoints: getPoints,
};

export default connect(mapStateToProps, mapDispatchToProps)(ScoreTable);
