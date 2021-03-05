import React, { Fragment } from 'react';
import PropTypes from 'prop-types';

import { withTranslation } from 'react-i18next';

/* import {
  Row,
  Col,
  Media,
  Button,
} from 'reactstrap'; */

import Row from 'reactstrap/lib/Row';
import Col from 'reactstrap/lib/Col';
import Media from 'reactstrap/lib/Media';
import Button from 'reactstrap/lib/Button';

import Countdown from 'react-countdown-now';

import styled, { keyframes } from 'styled-components';

import wheel from '../../../images/BonusPage/bonusu_rats_2.png';
import stand from '../../../images/BonusPage/bonusu_rats_stand.png';
import wheelArrow from '../../../images/BonusPage/bonus_wheel_arrow.png';

import bonusPageImg from '../../../images/icons/gift.png';
import coinImg from '../../../images/coin.svg';

import InviteFriend from './InviteFriend';

const rotate = r => keyframes`
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(${r}deg);
  }
`;

const Wheel = styled.div`
  display: inline-block;
  animation: ${(props => rotate(props.rotation))} 3.25s ease-in-out 1 forwards;
`;

class BonusPage extends React.Component {
  static propTypes = {
    spinWheel: PropTypes.func.isRequired,
    claimSpin: PropTypes.func.isRequired,
    changeTab: PropTypes.func.isRequired,
    member: PropTypes.shape().isRequired,
    t: PropTypes.func.isRequired,
    playButtonSound: PropTypes.func.isRequired,
  //  sendMoney: PropTypes.func.isRequired,
  }

  constructor(props) {
    super(props);
    this.state = {
      rotation: 0,
      spinResult: 0,
      spinComplete: false,
      spinning: false,
    };

    this.spinWheel = this.spinWheel.bind(this);
    this.confirmResult = this.confirmResult.bind(this);
  }

  spinWheel() {
    const { spinWheel, claimSpin, playButtonSound } = this.props;

    playButtonSound();
    spinWheel().then((res) => {
      if (!res.data.error) {
        const { spinResult } = res.data;
        let rotation;
        switch (spinResult) {
          case 10:
            rotation = 1100;
            break;
          case 20:
            rotation = 1125;
            break;
          case 25:
            rotation = 1205;
            break;
          case 50:
            rotation = 1150;
            break;
          case 100:
            rotation = 1065;
            break;
          default:
            rotation = 1200;
        }

        this.setState({ rotation, spinning: true });

        setTimeout(
          () => {
            this.setState({
              spinResult, spinComplete: true, spinning: false, rotation: 0,
            });

            claimSpin();
          },
          4500,
        );
      } else {
        console.log('kūda griežot ratu');
      }
    });
  }

  confirmResult() {
    const { changeTab, claimSpin } = this.props;

    claimSpin();

    changeTab('1');
    this.setState({ spinResult: 0, spinComplete: false, rotation: 0 });
  }

  render() {
    const { member, t } = this.props;

    const {
      rotation, spinComplete, spinResult, spinning,
    } = this.state;


    const notSpined =
      (member && member.lastBonusSpin && new Date(member.lastBonusSpin).setHours(0, 0, 0, 0) !== new Date(Date.now() + member.offset).setHours(0, 0, 0, 0)) ||
      (!member.lastBonusSpin);

    return (
      <div className="bonus-page">
        <Row>
          {/*  <Col sm="12" className="bonus-page-title">
            {t('bonusPage.dailyBonus')}
          </Col> */}
          <Col sm="12" className="bonus-page-block">
            <Row>
              <Col className="bonus-page-header">
                <Media src={bonusPageImg} className="bonus-page-header-image" />
                <div className="bonus-page-header-text">
                  {t('bonusPage.dailyBonus')}
                </div>
              </Col>
            </Row>
            <div className="bonus-page-block-container">
              <div className="bonus-page-block-background" />
              {!spinComplete ? (
              <Fragment>
                <Row>
                  <Col sm="2" className="bonus-page-block-left" />
                  <Col sm="6" className="bonus-page-block-wheel">
                    <Media className="wheel-bg" src={stand} alt="" />
                    <Wheel rotation={rotation}>
                      <Media className="wheel" src={wheel} alt="" />
                    </Wheel>
                    <Media className="triangle-wrapper" src={wheelArrow} alt="" />
                    {/*  <div className="triangle-wrapper">
                      <div className="triangle" />
                      <div className="triangle2" />
                      <div className="triangle3" />
                    </div> */}
                  </Col>
                  <Col sm="3" className="bonus-page-block-button">
                    <Row className="spin-button-container">
                      <Col>

                        <Button className="spin-button" onClick={this.spinWheel} disabled={spinning || !notSpined}>
                          {t('bonusPage.spinWheel')}
                        </Button>

                      </Col>
                    </Row>
                    <Row className="bonus-page-block-left">
                      <Col sm="12" className="bonus-page-block-left-text">
                        {t('bonusPage.spinAndWin')}
                      </Col>
                      <Col sm="12" className="bonus-page-block-left-money">
                        <Media className="bonus-page-block-left-money-image" src={coinImg} alt="" />
                        <div className="bonus-page-block-left-money-text">
                        100
                        </div>
                      </Col>
                    </Row>



                  </Col>
                </Row>
                {!notSpined && (
                <Row className="bonus-page-block-warn">
                  <Col sm="12" className="bonus-page-block-left-text">
                    {t('bonusPage.hoursLimit')}
                  {/*  Dienas bonusu varat saņemt ne biežāk kā reizi 24 stundās. Lai iegrieztu ratu atkārtoti, ir jāgaida vēl  */}
                    <Countdown
                      date={new Date(Date.now() + member.offset).setHours(23, 59, 59)}
                    //  zeroPadTime={2}
                      renderer={props => (
                        <div className="spin-timer">
                          {`${props.hours < 10 ? `0${props.hours}` : props.hours}:${props.minutes < 10 ? `0${props.minutes}` : props.minutes}:${props.seconds < 10 ? `0${props.seconds}` : props.seconds}`}
                        </div>
                      )}
                      onComplete={() => {
                        this.forceUpdate();
                      }}
                    />
                  </Col>
                </Row>
                )}
              </Fragment>
              ) : (
                <Row>
                  <Col sm="6" className="bonus-page-block-complete-wheel">
                    <Media className="wheel-bg" src={stand} alt="" />
                    <Media className="wheel" src={wheel} alt="" style={{ transform: `rotate(${rotation}deg)` }} />
                    {/* }  <Media className="triangle-wrapper" src={wheelArrow} alt="" />  */}
                    {/*  <div className="triangle-wrapper">
                      <div className="triangle" />
                      <div className="triangle2" />
                      <div className="triangle3" />
                    </div> */}
                  </Col>
                  <Col sm="6" className="bonus-page-block-complete">
                    <Row>
                      <Col sm={{ size: 6, offset: 3 }} className="bonus-page-block-complete-text">
                        {t('bonusPage.youReceivedBonus')}
                      </Col>
                      <Col sm={{ size: 6, offset: 3 }} className="bonus-page-block-complete-money">
                        <Media className="bonus-page-block-complete-money-image" src={coinImg} alt="" />
                        <div className="bonus-page-block-complete-money-text">
                          {spinResult}
                        </div>
                      </Col>
                    </Row>
                    <Row>
                      <Col sm={{ size: 6, offset: 3 }} className="bonus-page-block-complete-button">
                        <div className="accept-button-container">
                          <Button className="accept-button" onClick={this.confirmResult}>
                            {t('bonusPage.okButton')}
                          </Button>
                        </div>
                      </Col>
                    </Row>
                  </Col>
                  {/*  <Col sm="3" className="bonus-page-block-complete-button">
                  <div className="accept-button-container">
                    <Button className="accept-button" onClick={this.confirmResult}>
                      {t('bonusPage.okButton')}
                    </Button>
                  </div>
                  </Col> */}
                </Row>
              )}
            </div>
          </Col>
        </Row>
        {/*!spinComplete && (
          <Row style={{ position: 'absolute', width: '100%' }}>
            <Col>
              <InviteFriend member={member} />
            </Col>
          </Row>
        )*/}
      </div>
    );
  }
}


export default withTranslation('common')(BonusPage);
