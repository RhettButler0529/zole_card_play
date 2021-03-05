import React, { Fragment } from 'react';
import PropTypes from 'prop-types';

/* import {
  Media,
} from 'reactstrap'; */

import Media from 'reactstrap/lib/Media';

//import lielaisImg from '../../../../images/Game/LIELAIS.svg';
//import mazaisImg from '../../../../images/Game/MAZAIS.svg';

const PlayerType = React.memo(({
  t, currentType, gameState, largePlayer,
}) => (
  <Fragment>
    {currentType !== 'galdins' && (gameState === 'play'
|| gameState === 'burry') && (
<div className="player-type-wrapper">

  <Fragment>
    {largePlayer ? (
      <div className="player-type-lielais">{t('large')}</div>
    ) : (
      <div className="player-type-mazais">{t('small')}</div>
    )}
  </Fragment>
</div>
    )}
  </Fragment>
));

PlayerType.propTypes = {
  currentType: PropTypes.string,
  gameState: PropTypes.string,
  largePlayer: PropTypes.bool,
};

PlayerType.defaultProps = {
  currentType: null,
  gameState: null,
  largePlayer: false,
};

export default PlayerType;
