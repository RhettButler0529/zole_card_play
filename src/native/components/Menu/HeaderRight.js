import React, { Fragment } from 'react';
import PropTypes from 'prop-types';

import { withTranslation } from 'react-i18next';

import {
  Image, View, TouchableOpacity, StyleSheet,
} from 'react-native';
import { Text } from 'native-base';

import DailyBonus from '../../../images/Menu/Daily-bonus-button-normal.png';
import BuyButton from '../../../images/Menu/Buy-money-button-normal.png';

import DailyBonusPressed from '../../../images/Menu/Daily-bonus-button-pressed.png';
import BuyButtonPressed from '../../../images/Menu/Buy-money-button-pressed.png';

const styles = StyleSheet.create({
  buyButtonText: {
    fontFamily: 'Roboto',
    fontWeight: '700',
    position: 'absolute',
    width: 117,
    height: 18,
    top: 21,
    left: 43,
    fontSize: 13,
    lineHeight: 18,
    textAlign: 'center',
    letterSpacing: 0.2,
    color: '#fff',
  },
  bonusButtonText: {
    fontFamily: 'Roboto',
    fontWeight: '700',
    position: 'absolute',
    width: 117,
    height: 18,
    top: 25,
    left: 47,
    fontSize: 13,
    lineHeight: 18,
    textAlign: 'center',
    letterSpacing: 0.2,
    color: '#fff',
  },
  languages: {
    position: 'absolute',
    top: 5,
    right: 0,
  },
  languageText: {
    fontWeight: '700',
    fontSize: 13,
    textAlign: 'center',
    letterSpacing: 0.2,
    color: '#fff',
  },
});

class HeaderRight extends React.Component {
  static propTypes = {
    member: PropTypes.shape({}).isRequired,
    changeTab: PropTypes.func.isRequired,
    t: PropTypes.func.isRequired,
    i18n: PropTypes.shape({
      changeLanguage: PropTypes.func.isRequired,
    }).isRequired,
    activeTab: PropTypes.string,
  }

  static defaultProps = {
    activeTab: '',
  }

  constructor(props) {
    super(props);
    this.state = {

    };

    this.changeLanguage = this.changeLanguage.bind(this);
  }

  changeLanguage(lang) {
  //  console.log('changeLanguage');
  //  console.log(lang);
    const { i18n } = this.props;

    i18n.changeLanguage(lang);
    this.forceUpdate();
  }

  render() {
    const {
      changeTab, activeTab, t,
    } = this.props;

    return (
      <Fragment>
        <View style={{ flex: 1, flexDirection: 'column', alignItems: 'flex-start' }}>
          <View style={{ flex: 1, flexDirection: 'column' }}>
            <TouchableOpacity
              activeOpacity={0.8}
              style={{ height: '90%' }}
              onPress={() => changeTab('4')}
            >
              <Image source={activeTab === '4' ? DailyBonusPressed : DailyBonus} />
              <Text
                onClick={() => changeTab('4')}
                style={[styles.bonusButtonText]}
              >
                {t('headerRight.dailyBonus')}
              </Text>
            </TouchableOpacity>
          </View>
          <View style={{ flex: 1, flexDirection: 'column' }}>
            <TouchableOpacity
              activeOpacity={0.8}
              style={{ height: '90%' }}
              onPress={() => changeTab('5')}
            >
              <Image source={activeTab === '5' ? BuyButtonPressed : BuyButton} />
              <Text
                onClick={() => changeTab('5')}
                style={[styles.buyButtonText]}
              >
                {t('headerRight.buy')}
              </Text>
            </TouchableOpacity>
          </View>
          <View style={[styles.languages]}>
            <TouchableOpacity activeOpacity={1} onPress={() => this.changeLanguage('lv')}>
              <Text style={[styles.languageText]}>
                LV
              </Text>
            </TouchableOpacity>
            <TouchableOpacity activeOpacity={1} style={{ top: 20 }} onPress={() => this.changeLanguage('ru')}>
              <Text style={[styles.languageText]}>
                RU
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Fragment>
    );
  }
}

export default withTranslation('common')(HeaderRight);
