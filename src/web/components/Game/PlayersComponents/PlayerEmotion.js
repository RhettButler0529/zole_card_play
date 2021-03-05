import React from 'react';
import PropTypes from 'prop-types';

/* import {
  Media,
} from 'reactstrap'; */

import Media from 'reactstrap/lib/Media';

const PlayerEmotion = React.memo(({
  index, emotion,
}) => (
    <div className={`${index === 0 && ' player-left-emotion'} ${index === 1 && ' player-right-emotion'} ${index === 2 && ' player-firstperson-emotion'}`}>
        <Media
          className="player-emotion-image"
          src={emotion || ''}
        />
    </div>
));

PlayerEmotion.propTypes = {
  index: PropTypes.number,
//  emotions: PropTypes.shape(),
  emotion: PropTypes.string,
};

PlayerEmotion.defaultProps = {
  index: null,
//  emotions: {},
  emotion: null,
};

export default PlayerEmotion;
