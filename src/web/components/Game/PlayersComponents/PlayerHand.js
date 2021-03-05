import React from 'react';
import PropTypes from 'prop-types';

/* import {
  Media,
} from 'reactstrap'; */

import Media from 'reactstrap/lib/Media';

import rokaImg from '../../../../images/Game/Roka.svg';

const PlayerType = React.memo(({
  gameState, currentHand, playerPosition, currentTurn,
}) => (
  <div className={`player-current-hand ${(gameState === 'choose' && currentTurn === playerPosition) ? '' : 'display-none'}`}>
    <div className="player-current-hand-text">
      {`${currentHand}. `}
    </div>
    <Media src={rokaImg} className="player-current-hand-image" />
  </div>
));

PlayerType.propTypes = {
  gameState: PropTypes.string,
  currentHand: PropTypes.number,
  playerPosition: PropTypes.string,
  currentTurn: PropTypes.string,
};

PlayerType.defaultProps = {
  gameState: null,
  currentHand: null,
  playerPosition: null,
  currentTurn: null,
};

export default PlayerType;
