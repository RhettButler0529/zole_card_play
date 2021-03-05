import React, { Fragment } from 'react';
import PropTypes from 'prop-types';

import { withTranslation } from 'react-i18next';

import { LinearGradient } from 'expo-linear-gradient';

import {
  TouchableOpacity, Image, View, StyleSheet, Picker,
} from 'react-native';
import {
  Text, Button,
} from 'native-base';
// import { Actions } from 'react-native-router-flux';

import startGameBlock from '../../../images/Start-game-block-icon.png';

import CheckBox from '../UI/CheckBox';

class NewGame extends React.Component {
  static propTypes = {
    createRoom: PropTypes.func.isRequired,
    lvl: PropTypes.number,
    t: PropTypes.func.isRequired,
  }

  static defaultProps = {
    lvl: null,
  }

  constructor(props) {
    super(props);
    this.state = {
      parasta: true,
      MG: false,
      atra: false,
      pro: false,
      bet: '1:10',
      createRoomClicked: false,
    };

    this.toggleParasta = this.toggleParasta.bind(this);
    this.toggleMG = this.toggleMG.bind(this);
    this.toggleAtra = this.toggleAtra.bind(this);
    this.togglePro = this.togglePro.bind(this);
    this.selectBet = this.selectBet.bind(this);

    this.createRoomClicked = this.createRoomClicked.bind(this);
  }

  toggleParasta = () => {
    const { parasta } = this.state;
    if (parasta) {
      this.setState({ parasta: false, MG: true });
    } else {
      this.setState({ parasta: true, MG: false });
    }
  }

  toggleMG = () => {
    const { MG } = this.state;
    if (MG) {
      this.setState({ parasta: true, MG: false });
    } else {
      this.setState({ parasta: false, MG: true });
    }
  }

  toggleAtra = () => {
    console.log('toggleAtra');
    const { atra } = this.state;

    console.log(atra);
    if (atra) {
      this.setState({ atra: false });
    } else {
      this.setState({ atra: true });
    }
  }

  togglePro = () => {
    const { pro } = this.state;
    if (pro) {
      this.setState({ pro: false });
    } else {
      this.setState({ pro: true });
    }
  }

  selectBet = (itemValue, itemIndex) => {
  //  this.setState({ bet: e.target.value });
    this.setState({ bet: itemValue });
  }

  createRoomClicked = () => {
    const { createRoom } = this.props;
    const {
      parasta,
      MG,
      atra,
      pro,
      bet,
      createRoomClicked,
    } = this.state;

    if (!createRoomClicked) {
      this.setState({ createRoomClicked: true });

      createRoom(parasta, MG, atra, pro, bet);

      setTimeout(() => {
        this.setState({ createRoomClicked: false });
      }, 2500);
    }
  }

  render() {
    const { lvl, t } = this.props;
    const {
      parasta,
      MG,
      atra,
      pro,
      bet,
      createRoomClicked,
    } = this.state;

    return (
      <View style={{ flex: 1, flexDirection: 'column' }}>
        <View style={{ flex: 1, flexDirection: 'column' }}>
          <Image
            style={{
              width: 60, height: 40, marginLeft: 'auto', marginRight: 'auto',
            }}
            source={startGameBlock}
          />
        </View>
        <View style={{ flex: 1, flexDirection: 'column' }}>
          <Text style={{ color: '#afe84e', textAlign: 'center' }}>
            {t('newGame.newGame')}
          </Text>
        </View>
        <View style={{ flex: 1, flexDirection: 'column' }}>
          <Text style={{ color: '#fff', textAlign: 'center' }}>
            {t('newGame.gameType')}
          </Text>
        </View>
        <View style={{
          flex: 1, flexDirection: 'row', marginLeft: 'auto', marginRight: 'auto',
        }}
        >
          <View style={{
            flex: 1, flexDirection: 'row', marginTop: 10, marginLeft: '10%',
          }}
          >
            <TouchableOpacity activeOpacity={0.8} onPress={this.toggleParasta}>
              <CheckBox checked={parasta} />
            </TouchableOpacity>
            <Text style={{ color: '#e4ffb9', marginLeft: 10 }}>
              P
            </Text>
          </View>
          <View style={{ flex: 1, flexDirection: 'row', marginTop: 10 }}>
            <TouchableOpacity activeOpacity={0.8} onPress={this.toggleMG}>
              <CheckBox checked={MG} />
            </TouchableOpacity>
            <Text style={{ color: '#e4ffb9', marginLeft: 10 }}>
              GM
            </Text>
          </View>
        </View>
        <View style={{ flex: 1, flexDirection: 'row' }}>
          <View style={{
            flex: 1, flexDirection: 'row', marginTop: 10, marginLeft: '10%',
          }}
          >
            <TouchableOpacity activeOpacity={0.8} onPress={this.toggleAtra}>
              <CheckBox checked={atra} />
            </TouchableOpacity>
            <Text style={{ color: '#e4ffb9', marginLeft: 10 }}>
              {t('newGame.fastGame')}
            </Text>
          </View>
          <View style={{ flex: 1, flexDirection: 'row', marginTop: 10 }}>
            <TouchableOpacity activeOpacity={0.8} onPress={this.togglePro}>
              <CheckBox checked={pro} />
            </TouchableOpacity>
            <Text style={{ color: '#e4ffb9', marginLeft: 10 }}>
              {t('newGame.proGame')}
            </Text>
          </View>
        </View>
        <View>
          <Text style={{ color: '#fff', textAlign: 'center' }}>
            {t('newGame.bet')}
          </Text>
        </View>
        <View>
          <LinearGradient
            colors={['#adadad', '#222']}
            style={{
              alignItems: 'center', height: 22, width: '60%', marginLeft: '20%', marginRight: '20%',
            }}
          >
            <Picker
              selectedValue={bet}
              style={{
                height: 22, width: '100%', backgroundColor: 'trasparent', color: '#e4ffb9',
              }}
              onValueChange={(itemValue, itemIndex) => this.selectBet(itemValue, itemIndex)}
            >
              <Picker.Item label="1:1" value="1:1" />
              <Picker.Item label="1:5" value="1:5" />
              <Picker.Item label="1:10" value="1:10" />
              <Picker.Item label="1:25" value="1:25" />
              <Picker.Item label="1:50" value="1:50" />
              <Picker.Item label="1:100" value="1:100" />
              <Picker.Item label="1:500" value="1:500" />
              <Picker.Item label="1:1000" value="1:1000" />
              <Picker.Item label="1:5000" value="1:5000" />
              <Picker.Item label="1:10000" value="1:10000" />
            </Picker>
          </LinearGradient>
        </View>
        <View style={{ flex: 1, flexDirection: 'column' }}>
          <LinearGradient
            colors={['#b4ec51', '#429321']}
            style={{
              alignItems: 'center', height: 26, width: '80%', marginLeft: 'auto', marginRight: 'auto', borderRadius: 3, marginTop: 5,
            }}
          >
            <Button
              style={{
                height: 26,
                width: '100%',
                backgroundColor: 'transparent',
                borderRadius: 3,
                fontWeight: '700',
                fontSize: 12,
                lineHeight: 18,
                textAlign: 'center',
                letterSpacing: 0.2,
                color: '#fff',
                padding: 0,
              }}
              disabled={createRoomClicked}
              onClick={() => { this.createRoomClicked(); }}
            >
              <Text>
                {t('newGame.startGame')}
              </Text>
            </Button>
          </LinearGradient>
        </View>
      </View>
    );
  }
}

export default withTranslation('common')(NewGame);
