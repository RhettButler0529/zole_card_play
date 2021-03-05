import React, { Fragment } from 'react';
import PropTypes from 'prop-types';

/* import {
  Button,
  Media,
  UncontrolledTooltip,
} from 'reactstrap'; */

import Media from 'reactstrap/lib/Media';
import Button from 'reactstrap/lib/Button';
import UncontrolledTooltip from 'reactstrap/lib/UncontrolledTooltip';

import giftImg from '../../../../images/Game/gift.svg';

const PlayerGift = React.memo(({
  index, gifts, roomGifts, uid, toggleGiftsModal,
}) => (
  <Fragment>
    <Button color="link" className="player-gift" onClick={() => toggleGiftsModal(uid)}>
      <Media
        className="player-gift-image"
        src={giftImg}
        alt=""
      />
    </Button>
    <div className={`player-gift-added ${index === 0 && ' player-left-gift'} ${index === 1 && ' player-right-gift'} ${index === 2 && ' player-firstperson-gift'}`}>
      {gifts && roomGifts && uid && roomGifts[uid.toString()] && (
      <>
        <Media
          className="player-receivedGift-image"
          id={`player-receivedGift-${index}`}
          trigger="hover"
          src={gifts[roomGifts[uid.toString()].giftId] ? gifts[roomGifts[uid.toString()].giftId].image : ''}
        />
        <UncontrolledTooltip
          className="player-receivedGift-tooltip"
          placement="bottom"
          target={`player-receivedGift-${index}`}
        >
          <div className="player-receivedGift-tooltip-from">
            {roomGifts[uid.toString()].fromName || ''}
          </div>
          <div className="player-receivedGift-tooltip-comment">
            {roomGifts[uid.toString()].comment || ''}
          </div>
        </UncontrolledTooltip>
      </>
      )}
    </div>
  </Fragment>
));

PlayerGift.propTypes = {
  index: PropTypes.number,
  gifts: PropTypes.shape(),
  roomGifts: PropTypes.shape(),
  uid: PropTypes.string,
  toggleGiftsModal: PropTypes.func.isRequired,
};

PlayerGift.defaultProps = {
  index: null,
  gifts: {},
  roomGifts: {},
  uid: null,
};

export default PlayerGift;
