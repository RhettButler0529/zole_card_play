import React from 'react';
import PropTypes from 'prop-types';

import { withTranslation } from 'react-i18next';

import Lottie from 'react-lottie';

/* import {
  Row,
  Col,
  Media,
  Button,
  TabContent,
  TabPane,
} from 'reactstrap'; */

import Row from 'reactstrap/lib/Row';
import Col from 'reactstrap/lib/Col';
import Media from 'reactstrap/lib/Media';
import Button from 'reactstrap/lib/Button';
import TabContent from 'reactstrap/lib/TabContent';
import TabPane from 'reactstrap/lib/TabPane';
import Alert from 'reactstrap/lib/Alert';

import { loadStripe } from '@stripe/stripe-js';
import config from '../../../constants/config';

import InviteFriend from './InviteFriend';

import coins1 from '../../../images/BuyMoney/veikals_paka_1.png';
import coins2 from '../../../images/BuyMoney/veikals_paka_2.png';
import coins3 from '../../../images/BuyMoney/veikals_paka_3.png';
import coins4 from '../../../images/BuyMoney/veikals_paka_4.png';
import coins5 from '../../../images/BuyMoney/veikals_paka_5.png';

import shopImg from '../../../images/icons/shoping_cart.png';

import bonus1 from '../../../images/icons/money_bonus_1.png';
import bonus2 from '../../../images/icons/money_bonus_2.png';
import bonus3 from '../../../images/icons/money_bonus_3.png';
import bonus4 from '../../../images/icons/money_bonus_4.png';

import coinImg from '../../../images/coin.svg';
import glitterAnimImg from '../../../images/BuyMoney/glitter.json'


class BuyPage extends React.Component {
  static propTypes = {
    //  t: PropTypes.func.isRequired,
    initFBPayment: PropTypes.func.isRequired,
    sendMoney: PropTypes.func.isRequired,
    fbPaymentCallback: PropTypes.func.isRequired,
    initDraugiemPayment: PropTypes.func.isRequired,
    initStripePayment: PropTypes.func.isRequired,
    member: PropTypes.shape({}),
    playButtonSound: PropTypes.func.isRequired,
  }

  static defaultProps = {
    member: {},
  }

  constructor(props) {
    super(props);
    this.state = {
      activeTab: '1',
      pauseGlitter: [true, true, true, true, true],
      processing: false
    };
  }

  componentDidMount() {
    setTimeout(() => {
      this.state.pauseGlitter[0] = false;
      this.setState({ pauseGlitter: this.state.pauseGlitter });
    }, 0);

    setTimeout(() => {
      this.state.pauseGlitter[4] = false;
      this.setState({ pauseGlitter: this.state.pauseGlitter });
    }, 270);

    setTimeout(() => {
      this.state.pauseGlitter[1] = false;
      this.setState({ pauseGlitter: this.state.pauseGlitter });
    }, 500);

    setTimeout(() => {
      this.state.pauseGlitter[3] = false;
      this.setState({ pauseGlitter: this.state.pauseGlitter });
    }, 750);

    setTimeout(() => {
      this.state.pauseGlitter[2] = false;
      this.setState({ pauseGlitter: this.state.pauseGlitter });
    }, 1000);
  }

  toggle = (tab) => {
    const { activeTab } = this.state;
    if (activeTab !== tab) {
      this.setState({
        activeTab: tab,
      });
    }
  }

  buyMoney = (prod) => {
    const {
      initFBPayment, fbPaymentCallback, member, initDraugiemPayment, playButtonSound, t
    } = this.props;


    if (!config.isInAppFrame()) {
      playButtonSound();

      this.setState({processing: true});

      const { initStripePayment } = this.props;

      const failTxt = t('menu.stripeShopNotWorking');

      initStripePayment(prod).then((result) => {
        if (result.data && result.data.status && result.data.status == 'success' && result.data.id) {
          const paymentSessionId = result.data.id;

          loadStripe(config.stripeBublicKey).then((stripe) => {
            stripe.redirectToCheckout({
              sessionId: paymentSessionId
            })
            .then(function (_result) {
              alert(failTxt);
              this.setState({processing: false});
            });

          }).catch((_e) => {
            alert(failTxt);
            this.setState({processing: false});
          });


        } else if (result.data && !result.data.status) {
          alert(failTxt);
          this.setState({processing: false});
        } else if (result.data && result.data.status && result.data.status == 'error') {
          alert(failTxt);
          this.setState({processing: false});
        }
      }).catch((e) => {
        alert(failTxt);
        this.setState({processing: false});
      })

      return;
    }

    // In App Iframe (fb/dra)
    if (member.socProvider === 'facebook') {
      playButtonSound();

      initFBPayment(prod).then((res) => {
        if (res.status === 'success') {
          const { product } = res.data;

          if (product) {
            if (window.FB && member.socProvider === 'facebook') {
              window.FB.ui({
                method: 'pay',
                action: 'purchaseitem',
                product,
                quantity: 1, // optional, defaults to 1
                request_id: res.data.token, // optional, must be unique for each payment
              },
                (resp) => {
                  fbPaymentCallback(resp);
                  return null;
                });
            } else {
              console.log('no FB.ui or not facebook provider');
            }
          } else {
            console.log('error with product');
          }
        }
      });
    } else if (member.socProvider === 'draugiem') {
      //  console.log('window.draugiemWindowOpen');
      //  console.log(window);
      //  console.log(window.draugiemWindowOpen);
      playButtonSound();
      initDraugiemPayment(prod).then((res) => {
        console.log('res');
        console.log(res);
        if (res.status === 'success') {
          const { product } = res.data;

          console.log('product');
          console.log(product);

          if (product) {
            if (window.draugiemWindowOpen && member.socProvider === 'draugiem') {
              window.draugiemWindowOpen(product, 350, 400);
            } else {
              console.log('no draugiemWindowOpen or not draugiem provider');
            }
          } else {
            console.log('error with product');
          }
        }
      });
    }
  }

  render() {
    const {
      t,
      member,
    } = this.props;

    const { activeTab, pauseGlitter, processing } = this.state;

    return (
      <Row className="buy-page">
        <Col sm="12" className="buy-page-block">
          <Row className="buy-page-header">
            <Col>
              <Media src={shopImg} className="buy-page-header-image" />
              <div className="buy-page-header-text">
                {t('buyPage.buyPage')}
              </div>
            </Col>
          </Row>
          <Row className="buy-page-main">
            <Col>
              <TabContent className="buy-page-tabContent" activeTab={activeTab}>
                <TabPane tabId="1" className="buy-page-tab">
                  <div className="buy-page-block-container">
                    <Row>
                      <Col>
                        <Row>
                          <Col sm="12">
                            <div className="buy-page-coins-imageWrapper">
                              <div className="buy-page-coins-background" />
                              <Media className="buy-page-coins-image1" src={coins1} alt="" />

                              <div
                                className="glitter-anim-image"
                                style={{ top: 30, left: 16 }}
                              >
                                <Lottie options={{
                                  loop: true,
                                  autoplay: true,
                                  animationData: glitterAnimImg,
                                  rendererSettings: {
                                    preserveAspectRatio: 'xMidYMid slice'
                                  }
                                }}
                                  height={42}
                                  width={42}
                                  isStopped={false}
                                  isPaused={pauseGlitter[0]}
                                />
                              </div>


                            </div>
                            <div className="buy-page-coins-wrapper">
                              <Media src={coinImg} className="buy-page-coins-coin" />
                              <div className="buy-page-coins-amount">
                                250
                              </div>
                            </div>
                            <Button disabled={processing} color="link" className="buy-page-coins-button" onClick={() => this.buyMoney(1)}>
                              <div className="buy-page-coins-button-text">
                                0.85 EUR
                              </div>
                            </Button>
                          </Col>
                        </Row>
                      </Col>
                      <Col>
                        <Row>
                          <Col sm="12">
                            <div className="buy-page-coins-imageWrapper">
                              <div className="buy-page-coins-background" />
                              <Media className="buy-page-coins-image2" src={coins2} alt="" />
                              <Media className="buy-page-coins-bonus-image" src={bonus1} alt="" />

                              <div
                                className="glitter-anim-image"
                                style={{ top: 38, left: 21 }}
                              >
                                <Lottie options={{
                                  loop: true,
                                  autoplay: true,
                                  animationData: glitterAnimImg,
                                  rendererSettings: {
                                    preserveAspectRatio: 'xMidYMid slice'
                                  }
                                }}
                                  height={57}
                                  width={57}
                                  isStopped={false}
                                  isPaused={pauseGlitter[1]}
                                />
                              </div>

                            </div>
                            <div className="buy-page-coins-wrapper">
                              <Media src={coinImg} className="buy-page-coins-coin" />
                              <div className="buy-page-coins-amount">
                                500
                              </div>
                            </div>
                            <Button disabled={processing} color="link" className="buy-page-coins-button" onClick={() => this.buyMoney(2)}>
                              <div className="buy-page-coins-text">
                                1.41 EUR
                              </div>
                            </Button>
                          </Col>
                        </Row>
                      </Col>
                      <Col>
                        <Row>
                          <Col sm="12">
                            <div className="buy-page-coins-imageWrapper">
                              <div className="buy-page-coins-background" />
                              <Media className="buy-page-coins-image3" src={coins3} alt="" />
                              <Media className="buy-page-coins-bonus-image" src={bonus2} alt="" />

                              <div
                                className="glitter-anim-image"
                                style={{ top: 33, left: 8 }}
                              >
                                <Lottie options={{
                                  loop: true,
                                  autoplay: true,
                                  animationData: glitterAnimImg,
                                  rendererSettings: {
                                    preserveAspectRatio: 'xMidYMid slice'
                                  }
                                }}
                                  height={72}
                                  width={72}
                                  isStopped={false}
                                  isPaused={pauseGlitter[2]}
                                />
                              </div>

                            </div>
                            <div className="buy-page-coins-wrapper">
                              <Media src={coinImg} className="buy-page-coins-coin" />
                              <div className="buy-page-coins-amount">
                                1500
                              </div>
                            </div>
                            <Button disabled={processing} color="link" className="buy-page-coins-button" onClick={() => this.buyMoney(3)}>
                              <div className="buy-page-coins-text">
                                2.85 EUR
                              </div>
                            </Button>
                          </Col>
                        </Row>
                      </Col>
                      <Col>
                        <Row>
                          <Col sm="12">
                            <div className="buy-page-coins-imageWrapper">
                              <div className="buy-page-coins-background" />
                              <Media className="buy-page-coins-image4" src={coins4} alt="" />
                              <Media className="buy-page-coins-bonus-image" src={bonus3} alt="" />

                              <div
                                className="glitter-anim-image"
                                style={{ top: 19, left: 9 }}
                              >
                                <Lottie options={{
                                  loop: true,
                                  autoplay: true,
                                  animationData: glitterAnimImg,
                                  rendererSettings: {
                                    preserveAspectRatio: 'xMidYMid slice'
                                  }
                                }}
                                  height={87}
                                  width={87}
                                  isStopped={false}
                                  isPaused={pauseGlitter[3]}
                                />
                              </div>

                            </div>
                            <div className="buy-page-coins-wrapper">
                              <Media src={coinImg} className="buy-page-coins-coin" />
                              <div className="buy-page-coins-amount">
                                4000
                              </div>
                            </div>
                            <Button disabled={processing} color="link" className="buy-page-coins-button" onClick={() => this.buyMoney(4)}>
                              <div className="buy-page-coins-text">
                                4.27 EUR
                              </div>
                            </Button>
                          </Col>
                        </Row>
                      </Col>
                      <Col>
                        <Row>
                          <Col sm="12">
                            <div className="buy-page-coins-imageWrapper">
                              <div className="buy-page-coins-background" />
                              <Media className="buy-page-coins-image5" src={coins5} alt="" />
                              <Media className="buy-page-coins-bonus-image" src={bonus4} alt="" />

                              <div
                                className="glitter-anim-image"
                                style={{ top: 18, left: -14 }}
                              >
                                <Lottie options={{
                                  loop: true,
                                  autoplay: true,
                                  animationData: glitterAnimImg,
                                  rendererSettings: {
                                    preserveAspectRatio: 'xMidYMid slice'
                                  }
                                }}
                                  height={102}
                                  width={102}
                                  isStopped={false}
                                  isPaused={pauseGlitter[4]}
                                />
                              </div>

                            </div>
                            <div className="buy-page-coins-wrapper">
                              <Media src={coinImg} className="buy-page-coins-coin" />
                              <div className="buy-page-coins-amount">
                                15000
                              </div>
                            </div>
                            <Button disabled={processing} color="link" className="buy-page-coins-button" onClick={() => this.buyMoney(5)}>
                              <div className="buy-page-coins-text">
                                14.23 EUR
                              </div>
                            </Button>
                          </Col>
                        </Row>
                      </Col>
                    </Row>
                  </div>
                </TabPane>
                <TabPane tabId="2" className="buy-page-tab">
                  <div className="buy-page-block-container">
                    <div className="buy-page-block-background" />
                  </div>
                </TabPane>
                <TabPane tabId="3" className="buy-page-tab">
                  <div className="buy-page-block-container">
                    <div className="buy-page-block-background" />
                  </div>
                </TabPane>
              </TabContent>
            </Col>
          </Row>
          <Row className="buy-page-send">
            <Col>
              <InviteFriend member={member} />
            </Col>
          </Row>
        </Col>
      </Row>
    );
  }
}

export default withTranslation('common')(BuyPage);
