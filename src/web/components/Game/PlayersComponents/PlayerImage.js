import React from 'react';
import PropTypes from 'prop-types';

import defaultImage from '../../../../images/Game/defaultImage.jpg';

const PlayerImage = React.memo(({
  photo,currentType,gameState,largePlayer
}) => (
  <div className="player-avatar-wrapper">
    <div className={`player-avatar ${(currentType !== 'galdins' && (gameState === 'play' || gameState === 'burry')) && ' player-avatar-active'} ${largePlayer ? ' player-avatar-lielais': ' player-avatar-mazais'}`}>
      <img src={photo || defaultImage} alt="" />
    </div>
  </div>
));

PlayerImage.propTypes = {
  photo: PropTypes.string,
  currentType: PropTypes.string,
  gameState: PropTypes.string,
  largePlayer: PropTypes.bool,
};

PlayerImage.defaultProps = {
  photo: null,
  currentType: null,
  gameState: null,
  largePlayer: false,
};

export default PlayerImage;
