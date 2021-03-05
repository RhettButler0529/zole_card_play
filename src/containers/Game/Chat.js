import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
// import { Firebase } from '../../lib/firebase';

import {
  sendChatMsg,
  readChat,
  setChatAsRead,
  getEmotions,
  setEmotion,
} from '../../actions/room';

import ChatComponent from '../../web/components/Game/Chat';

class Chat extends Component {
  static propTypes = {
  //  Layout: PropTypes.func.isRequired,
    name: PropTypes.string,
    photo: PropTypes.string,
    match: PropTypes.shape({
      params: PropTypes.shape({
        id: PropTypes.string,
      }),
    }),
    emotions: PropTypes.shape(),
    roomChats: PropTypes.shape(),
    sendChatMessage: PropTypes.func.isRequired,
    setChatMessageAsRead: PropTypes.func.isRequired,
    readChatMessages: PropTypes.func.isRequired,
    sendEmotion: PropTypes.func.isRequired,
    fetchEmotions: PropTypes.func.isRequired,
    playButtonSound: PropTypes.func.isRequired,
    supportChatStatus: PropTypes.shape()
  }

  static defaultProps = {
    match: null,
    name: '',
    photo: '',
    emotions: {},
    roomChats: {},
  }

  constructor(props) {
    super(props);
    this.state = {
      roomId: '',
      uid: '',
      openChat: true,
    };
  }

  componentDidMount = () => {
    const {
      roomId,
    } = this.props;

    this.fetchEmotions();
      if (roomId) {
        this.readChatMessages(roomId);
      }
  }

  componentWillUnmount() {

  }

  toggleChat = () => {
    const { setChatMessageAsRead, roomId, playButtonSound } = this.props;
    setChatMessageAsRead(roomId);
    playButtonSound();
    this.setState(prevState => ({
      openChat: !prevState.openChat,
    }));
  }

  fetchEmotions = () => {
    const { fetchEmotions } = this.props;

    return fetchEmotions();
  }


  sendChatMessage = (inputMessage) => {
    const { sendChatMessage, name, photo, uid, roomId, playButtonSound } = this.props;

    playButtonSound();
    return sendChatMessage(roomId, inputMessage, name, uid, photo)
      .then(res => (res.status))
      .catch(err => console.log(err));
  }


  setEmotion = (key) => {
    const { sendEmotion, emotions, roomId, playButtonSound } = this.props;
    const { emotionSetClicked } = this.state;

    if (emotions[key] && !emotionSetClicked) {
      playButtonSound();
      this.setState({ emotionSetClicked: true });

      setTimeout(() => {
        this.setState({ emotionSetClicked: false });
      }, 2000);
    //  console.log('setEmotion');
      return sendEmotion(roomId, emotions[key].image)
        .catch(err => console.log(err));
    } else {
      console.log('canot set emotion');
      return null;
    }
  }

  setChatAsRead = () => {
    const { setChatMessageAsRead, roomId } = this.props;

    return setChatMessageAsRead(roomId)
      .then(res => (res.status))
      .catch(err => console.log(err));
  }

  readChatMessages = (roomId) => {
    const { readChatMessages } = this.props;

    return readChatMessages(roomId)
      .catch(err => this.setState({
        loading: false,
        error: err,
      }));
  }


  render = () => {
    const {
      emotions,
      roomChats,
      toggleSupport,
      roomId,
      uid,
      supportChatStatus,
      userSettings,
      playButtonSound,
    } = this.props;

    const {
      openChat,
    } = this.state;

    return (
      <ChatComponent
        openChat={openChat}
        toggleChat={this.toggleChat}
        toggleSupport={toggleSupport}
        uid={uid}
        roomId={roomId}
        emotions={emotions}
        chatMessages={roomChats}
        sendMessage={this.sendChatMessage}
        setChatAsRead={this.setChatAsRead}
        setEmotion={this.setEmotion}
        supportChatStatus={supportChatStatus}
        userSettings={userSettings[uid] || userSettings.default || {}}
        playButtonSound={playButtonSound}
      />
    );
  }
}

const mapStateToProps = (state) => {
  return ({
    name: state.member.name || '',
    photo: state.member.photo || '',
    emotions: state.rooms.emotions || {},
    roomChats: state.rooms.roomChats ? state.rooms.roomChats : {},
    userSettings: state.userSettings || {},
  });
};

const mapDispatchToProps = {
  sendChatMessage: sendChatMsg,
  setChatMessageAsRead: setChatAsRead,
  readChatMessages: readChat,
  fetchEmotions: getEmotions,
  sendEmotion: setEmotion,
};

export default connect(mapStateToProps, mapDispatchToProps)(Chat);
