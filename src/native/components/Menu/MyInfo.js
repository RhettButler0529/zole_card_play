import React from 'react';
import PropTypes from 'prop-types';

import { withTranslation } from 'react-i18next';

import {
  Image, View, StyleSheet, ImageBackground,
} from 'react-native';
import { Text } from 'native-base';
// import { Actions } from 'react-native-router-flux';

import eur from '../../../images/EUR-amount-badge-xl.png';
import playerOverviewBg from '../../../images/Player-overview-bckgr-desktop.png';
import playerBackground from '../../../images/Player-Picture-Lobby.png';

const styles = StyleSheet.create({
  imageBackground: {
    width: 175,
    height: 175,
    position: 'absolute',
    top: 0,
    left: 0,
    zIndex: -1,
  },
  imageView: {
    width: 140,
    height: 140,
    position: 'absolute',
    top: 20,
    left: 17,
    borderRadius: 100,
    borderWidth: 0,
    overflow: 'hidden',
    padding: 0,
    zIndex: 2,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  name: {
    color: '#fff',
    fontSize: 15,
    textAlign: 'center',
    marginTop: 5,
    marginLeft: -20,
    fontWeight: '500',
  },
  coinView: {
    flex: 1,
    width: 60,
    height: 60,
    zIndex: 5,
    marginLeft: -35,
  },
  coinText: {
    position: 'absolute',
    top: 10,
    left: 20,
    fontSize: 22,
    fontWeight: '600',
    color: '#dfa11b',
  },
  balanceText: {
    flex: 2,
    fontWeight: '400',
    color: '#edf75a',
    marginTop: 14,
    marginLeft: 10,
  },
  tableTopWrap: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  tableTop: {
    fontSize: 12,
    lineHeight: 14,
    color: '#e4ffb9',
    textAlign: 'center',
  },
  tableBottom: {
    flex: 1,
    flexDirection: 'column',
    fontSize: 12,
    lineHeight: 14,
    color: '#e4ffb9',
    textAlign: 'center',
  },
});

class MyInfo extends React.Component {
  static propTypes = {
    member: PropTypes.shape().isRequired,
    t: PropTypes.func.isRequired,
  }

  constructor(props) {
    super(props);
    this.state = {
    };
  }

  render() {
    const {
      member, t,
    } = this.props;

    const {
      position,
      gamesPlayed,
      gamesWon,
      totalPoints,
      photo,
      name,
      balance,
    } = member;

    return (
      <View style={{ flex: 1, flexDirection: 'row' }}>
        <View style={{ flex: 8, flexDirection: 'row' }}>
          <View style={{ width: 170 }}>
            <ImageBackground
              source={playerBackground}
              style={[styles.imageBackground]}
            >
              <View style={[styles.imageView]}>
                <Image style={[styles.image]} source={{ uri: photo }} />
              </View>
            </ImageBackground>
          </View>

          <View style={{ width: 'auto' }}>
            <Text style={[styles.name]}>
              {name}
            </Text>

            <View style={{ flexDirection: 'row', marginTop: 40 }}>
              <View style={[styles.coinView]}>
                <Image source={eur} />
                <Text style={[styles.coinText]}> €</Text>
              </View>

              <Text style={[styles.balanceText]}>
                {balance}
              </Text>
            </View>
          </View>
        </View>

        <View style={{ flex: 6, flexDirection: 'column' }}>
          <View style={{ flex: 1 }} />

          <View style={{ flex: 3, flexDirection: 'column' }}>
            <View style={{ flex: 1, flexDirection: 'row' }}>

              <View style={[styles.tableTopWrap]}>
                <Text style={[styles.tableTop]}>
                  {t('myInfo.position')}
                </Text>
              </View>

              <View style={[styles.tableTopWrap]}>
                <Text style={[styles.tableTop]}>
                  {t('myInfo.parties')}
                </Text>
              </View>

              <View style={[styles.tableTopWrap]}>
                <Text style={[styles.tableTop]}>
                  {t('myInfo.wins')}
                </Text>
              </View>

              <View style={[styles.tableTopWrap]}>
                <Text style={[styles.tableTop]}>
                  {t('myInfo.points')}
                </Text>
              </View>
            </View>

            <View style={{ flex: 3, flexDirection: 'row' }}>
              <Image style={{ position: 'absolute', width: '100%' }} source={playerOverviewBg} />

              <Text style={[styles.tableBottom]}>
                {position}
              </Text>

              <Text style={[styles.tableBottom]}>
                {gamesPlayed}
              </Text>

              <Text style={[styles.tableBottom]}>
                {gamesWon}
              </Text>

              <Text style={[styles.tableBottom]}>
                {totalPoints}
              </Text>
            </View>
          </View>
          <View style={{ flex: 1 }} />
        </View>
        <View style={{ flex: 1 }} />
      </View>
    );
  }
}

export default withTranslation('common')(MyInfo);
