import React, { Fragment } from 'react';
import PropTypes from 'prop-types';

/* import {
  Media,
} from 'reactstrap'; */

import Media from 'reactstrap/lib/Media';

import closeImg from '../../../images/icons/close.png';
import pro from '../../../images/icons/pro.svg';
import fast from '../../../images/icons/aatraa_istaba.svg';
import pupoliImg from '../../../images/Game/pupoli.svg';

const StaticElements = React.memo(({ fastGame, proGame, exitRoomNotification }) => {
  const x = new Date();

  const date = x.getDate();
  const month = x.getMonth();

  return (
    <Fragment>
      <div className="top-left">
        <div className="top-left-exit">
          <Media className="exit-button" src={closeImg} alt="X" onClick={exitRoomNotification} />
        </div>
        {fastGame && (
        <div className="top-left-fast">
          <Media className="label-speed" src={fast} alt="Ātrā" />
        </div>
        )}
        {proGame && (
        <div className="top-left-pro">
          <Media className="label-speed" src={pro} alt="Pro" />
        </div>
        )}
        {date && month && date === 5 && month === 3 && (
          <Media className="holiday-image" src={pupoliImg} alt="" />
        )}
      </div>

      <div className="game-background" />
      <div className="game-logo-wrapper">
        <div className="game-logo" />
      </div>
    </Fragment>
  )}
);

StaticElements.propTypes = {
  fastGame: PropTypes.bool,
  proGame: PropTypes.bool,
  exitRoomNotification: PropTypes.func.isRequired,
};

StaticElements.defaultProps = {
  fastGame: null,
  proGame: null,
};

export default StaticElements;
