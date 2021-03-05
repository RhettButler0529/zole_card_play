import React, { Fragment } from 'react';
import PropTypes from 'prop-types';

import { withTranslation } from 'react-i18next';

import {
  Image, View, Animated, Easing,
} from 'react-native';
import {
  Text, Button,
} from 'native-base';

import Countdown from 'react-countdown-now';

import coinStack from '../../../images/BonusPage/Coins-Stack-xxl.png';
import wheel from '../../../images/BonusPage/Wheel-Big.png';
import wheelArrow from '../../../images/BonusPage/Wheel-Arrow.png';

class BonusPage extends React.Component {
  static propTypes = {
    spinWheel: PropTypes.func.isRequired,
    changeTab: PropTypes.func.isRequired,
    member: PropTypes.shape().isRequired,
    t: PropTypes.func.isRequired,
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

    this.RotateValueHolder = new Animated.Value(0);
  }

  StartImageRotateFunction() {
    this.RotateValueHolder.setValue(0);
    Animated.timing(this.RotateValueHolder, {
      toValue: 1,
      duration: 2500,
      easing: Easing.inOut(Easing.ease),
    }).start();
  }

  spinWheel() {
    const { spinWheel } = this.props;

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

        this.StartImageRotateFunction();

        this.setState({ rotation, spinning: true });

        setTimeout(
          () => {
            this.setState({ spinResult, spinComplete: true, spinning: false });
          },
          4500,
        );
      } else {
        console.log('kļūda griežot ratu');
      }
    });
  }

  confirmResult() {
    const { changeTab } = this.props;

    changeTab('1');
    this.setState({ spinResult: 0, spinComplete: false });
  }

  render() {
    const { member, t } = this.props;

    const {
      rotation, spinComplete, spinResult, spinning,
    } = this.state;

    const RotateData = this.RotateValueHolder.interpolate({
      inputRange: [0, 1],
      outputRange: ['0deg', `${rotation}deg`],
    });

    return (
      <Fragment>
        <View style={{ flex: 1, flexDirection: 'column' }}>
          <Text style={{ color: '#fff' }}>
            {t('bonusPage.dailyBonus')}
          </Text>
          <View>
            <View>
              <View />
              {!spinComplete ? (
                <View style={{ flex: 1, flexDirection: 'row' }}>
                  <View style={{ flex: 1, flexDirection: 'column' }}>
                    <View style={{ flex: 1, flexDirection: 'column' }}>
                      <Text style={{ color: '#fff' }}>
                        {t('bonusPage.spinAndWin')}
                      </Text>
                      <View>
                        <Image source={coinStack} />
                      </View>
                      <View style={{ flex: 1, flexDirection: 'row' }}>
                        <Text style={{ color: '#fff' }}>
                          €
                        </Text>
                        <Text style={{ color: '#fff' }}>
                          100
                        </Text>
                      </View>
                      <Text style={{ color: '#fff' }}>
                        {t('bonusPage.everyDay')}
                      </Text>
                    </View>
                  </View>
                  <View style={{ flex: 2, flexDirection: 'column' }}>
                    <Animated.Image
                      style={{ transform: [{ rotate: RotateData }] }}
                      source={wheel}
                    />
                    <Image source={wheelArrow} />
                  </View>
                  <View style={{ flex: 1, flexDirection: 'column' }}>
                    <View>
                      {(member && member.nextBonusSpin
                        && member.nextBonusSpin < (Date.now() + member.offset))
                        || (!member.nextBonusSpin) || spinning ? (
                          <Button onPress={this.spinWheel} disabled={spinning}>
                            <Text>
                              {t('bonusPage.spinWheel')}
                            </Text>
                          </Button>
                        ) : (
                          <Countdown
                            date={member.nextBonusSpin}
                            renderer={props => <Text style={{ color: '#fff' }}>{`${props.days}:${props.hours}:${props.minutes}:${props.seconds}`}</Text>}
                            onComplete={() => {
                              this.forceUpdate();
                            }}
                          />
                        )}
                    </View>
                  </View>
                </View>
              ) : (
                <View style={{ flex: 1, flexDirection: 'row' }}>
                  <View style={{ flex: 2, flexDirection: 'row' }}>
                    <Animated.Image source={wheel} style={{ transform: [{ rotate: (`${rotation}deg`) }] }} />
                    <Image source={wheelArrow} />
                  </View>
                  <View style={{ flex: 1, flexDirection: 'column' }}>
                    <View style={{ flex: 1, flexDirection: 'column' }}>
                      <Text>
                        {t('bonusPage.youReceivedBonus')}
                      </Text>
                      <View>
                        <Image source={coinStack} />
                      </View>
                      <View style={{ flexDirection: 'row' }}>
                        <Text style={{ flex: 1, flexDirection: 'row' }}>
                        €
                        </Text>
                        <Text style={{ flex: 2, flexDirection: 'row' }}>
                          {spinResult}
                        </Text>
                      </View>
                    </View>
                  </View>
                  <View style={{ flex: 1, flexDirection: 'column' }}>
                    <View>
                      <Button onPress={this.confirmResult}>
                        <Text>
                          {t('bonusPage.okButton')}
                        </Text>
                      </Button>
                    </View>
                  </View>
                </View>
              )}
            </View>
          </View>
        </View>
      </Fragment>
    );
  }
}


export default withTranslation('common')(BonusPage);
