import React, { Fragment } from 'react';
import PropTypes from 'prop-types';

import { withTranslation } from 'react-i18next';

import Lottie from 'react-lottie';


import Row from 'reactstrap/lib/Row';
import Col from 'reactstrap/lib/Col';
import Media from 'reactstrap/lib/Media';

import bonusPageImg from '../../../images/icons/gift.png';
import shopImg from '../../../images/icons/shoping_cart.png';

import lowBalAnimImg from '../../../images/Menu/lowBal.json'

class HeaderRight extends React.Component {
  static propTypes = {
    member: PropTypes.shape({}).isRequired,
    changeTab: PropTypes.func.isRequired,
    t: PropTypes.func.isRequired,
    //  i18n: PropTypes.shape({}).isRequired,
    activeTab: PropTypes.string,
  }

  static defaultProps = {
    activeTab: '',
  }

  constructor(props) {
    super(props);
    this.state = {
      playLowBalAnim: false
    };
  }

  componentDidMount() {
    const { member } = this.props;

    if(member.balance < 162){
      setTimeout(() => {
        this.setState({playLowBalAnim: true});
      }, 1500);
    }
  }

  componentDidUpdate() {
    const { member } = this.props;

    if(member.balance < 162){
      setTimeout(() => {
        this.setState({playLowBalAnim: true});
      }, 1500);
    }
  }

  render() {
    const {
      changeTab, activeTab, t, member
    } = this.props;

    const { playLowBalAnim } = this.state;

    const notSpined =
      (member && member.lastBonusSpin && new Date(member.lastBonusSpin).setHours(0, 0, 0, 0) !== new Date(Date.now() + member.offset).setHours(0, 0, 0, 0)) ||
      (!member.lastBonusSpin);

    return (
      <Fragment>
        <Row className="header-right">
          <Col xs="12" sm="6" className="header-right-daily bonus-tab" onClick={() => changeTab('4')}>
            <div className={`daily-bonus ${activeTab === '4' && 'active'} ${notSpined && 'not-spined'}`}>
              <div className="daily-bonus-wrapper">
                <Media src={bonusPageImg} className="daily-bonus-image" />
                <div className="daily-bonus-text">
                  {t('headerRight.dailyBonus')}
                </div>
              </div>
            </div>
          </Col>
          <Col xs="12" sm="6" className="header-right-buy shop-tab" onClick={() => changeTab('5')}>
            <div className={`buy-button ${activeTab === '5' && 'active'}`}>
              <div className="buy-button-wrapper">
                <Media src={shopImg} className="buy-button-image" />
                <div className="buy-button-text">
                  {t('headerRight.buy')}
                </div>

                {(member && member.balance < 162) && (
                <div
                  className="low-bal-anim-image"
                  >
                    <Lottie options={{
                      loop: false,
                      autoplay: true,
                      animationData: lowBalAnimImg,
                      rendererSettings: {
                        preserveAspectRatio: 'xMidYMid slice'
                      }
                    }}
                      height={50}
                      width={50}
                      isStopped={false}
                      isPaused={!playLowBalAnim}
                    />
                </div>
                )}
              </div>
            </div>
          </Col>
        </Row>
      </Fragment>
    );
  }
}

export default withTranslation('common')(HeaderRight);
