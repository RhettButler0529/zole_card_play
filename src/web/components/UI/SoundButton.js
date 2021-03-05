import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import Media from 'reactstrap/lib/Media';
import CustomInput from 'reactstrap/lib/CustomInput';

import {
  toggleSound,
} from '../../../actions/userSettings';

import soundOnIcon from '../../../images/icons/volume_on.png';
import soundOffIcon from '../../../images/icons/volume_off.png';
import sound from '../../../sounds/audio.mp3';

class SoundButton extends Component {
  static propTypes = {
    userSettings: PropTypes.shape().isRequired,
    changeSound: PropTypes.func.isRequired,
  }

  static defaultProps = {
    match: null,
    history: {},
  }

  constructor(props) {
    super(props);
    this.state = {
    };

    this.audio = new Audio(sound);
  }

  toggleSound = () => {
    const { changeSound, uid, userSettings } = this.props;

    if (userSettings[uid]) {
      if (!userSettings[uid].soundOn) {
        this.audio.play();
      }
    }

    changeSound(uid);
  }

  render = () => {
    const {
      userSettings,
      uid,
    } = this.props;

    if (!uid || !userSettings) {
      return null;
    }

    let soundOn = false;

    if (userSettings[uid]) {
      if (userSettings[uid].soundOn) {
        soundOn = true;
      } else {
        soundOn = false;
      }
    } else if (userSettings.default) {
      if (userSettings.default.soundOn) {
        soundOn = true;
      } else {
        soundOn = false;
      }
    }

    return (
      <div className="sound-button">
        <Media src={soundOn ? (soundOnIcon) : (soundOffIcon)} className="sound-button-image" onClick={this.toggleSound} />
        <CustomInput type="switch" id="sound-switch" name="sound-switch" className="sound-button-switch" checked={soundOn} onChange={this.toggleSound}/>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  userSettings: state.userSettings || {},
});

const mapDispatchToProps = {
  changeSound: toggleSound,
};

export default connect(mapStateToProps, mapDispatchToProps)(SoundButton);
