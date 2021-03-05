import React, { Fragment } from 'react';
import PropTypes from 'prop-types';

/* import {
  Media,
} from 'reactstrap'; */

import Media from 'reactstrap/lib/Media';

import coinImg from '../../../../images/coin.svg';

const PlayerInfo = React.memo(({
  lvl, name, bal,
}) => (
  <Fragment>
    <div className="player-name-wrapper">
      <div className="player-level">
        <div className="player-level-text">
          {lvl}
        </div>
      </div>
      <div className="player-name">
        {name}
      </div>
    </div>
    <div className="player-balance">
      <Media src={coinImg} className="player-balance-coin" />
      <div className="player-balance-text">
        {bal}
      </div>
    </div>
  </Fragment>
));

PlayerInfo.propTypes = {
  lvl: PropTypes.number,
  name: PropTypes.string,
  bal: PropTypes.number,
};

PlayerInfo.defaultProps = {
  lvl: null,
  name: null,
  bal: null,
};

export default PlayerInfo;
