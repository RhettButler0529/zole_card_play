import React from 'react';
import PropTypes from 'prop-types';

/* import {
  Col,
  Media,
  Button,
} from 'reactstrap'; */

import Media from 'reactstrap/lib/Media';
// import Col from 'reactstrap/lib/Col';
import Button from 'reactstrap/lib/Button';

import coinImg from '../../../images/coin.svg';

class Gift extends React.Component {
  static propTypes = {
    t: PropTypes.func,
    giftId: PropTypes.string,
    id: PropTypes.string,
    gift: PropTypes.shape(),
    selectGift: PropTypes.func.isRequired,
  }

  static defaultProps = {
    giftId: null,
    id: null,
    gift: {},
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
      giftId,
      id,
    //  gift,
    } = nextProps;
    const {
      giftId: curGiftId,
      id: curId,
    //  gift: curGift,
    } = this.props;


    if (giftId !== curGiftId && giftId === curId) {
      return true;
    }

    if (giftId !== curGiftId && curGiftId === curId) {
      return true;
    }

    if (id !== curId) {
      return true;
    }

    //  if (gift !== curGift) {
    //    return true;
    //  }

    return false;
  }


  render() {
    const {
    //  t,
      giftId,
      id,
      gift,
      selectGift,
    } = this.props;

    return (
      <div key={id} className="gifts-gift">
        <Media src={gift.image} className="gifts-gift-image" onClick={() => selectGift(id)} />
        <div>
          <Button
            className={`gifts-gift-button-type ${giftId === id ? ('gifts-gift-button-active gifts-gift-button') : ('gifts-gift-button')}`}
            onClick={() => selectGift(id)}
          >
            <div className="gifts-gift-button-price">
              {gift.price}
            </div>
            <Media src={coinImg} className="gifts-gift-button-coin" />
          </Button>
        </div>
      </div>
    );
  }
}

export default Gift;
