import React, { Fragment } from 'react';
import PropTypes from 'prop-types';

import { withTranslation } from 'react-i18next';

import {
  IoMdClose,
} from 'react-icons/io';

// import IoMdClose from 'react-icons/lib/io/MdClose';

import isEqual from "react-fast-compare";

/* import {
  Row,
  Col,
  Button,
  Form,
  Input,
  Media,
} from 'reactstrap'; */

import Row from 'reactstrap/lib/Row';
import Col from 'reactstrap/lib/Col';
import Media from 'reactstrap/lib/Media';
import Button from 'reactstrap/lib/Button';
import Input from 'reactstrap/lib/Input';
import Form from 'reactstrap/lib/Form';

import ScrollArea from 'react-scrollbar';
import Message from './Message';

import chatIcon from '../../../images/icons/chat.png';
import supportIcon from '../../../images/icons/info_chats.svg';
import emotionIcon from '../../../images/icons/emo.svg';

import chatInSound from '../../../sounds/chat_notification.wav';


class Chat extends React.Component {
  static propTypes = {
    chatMessages: PropTypes.shape(),
    uid: PropTypes.string,
    emotions: PropTypes.shape(),
    toggleChat: PropTypes.func.isRequired,
    sendMessage: PropTypes.func.isRequired,
    setEmotion: PropTypes.func.isRequired,
    toggleSupport: PropTypes.func.isRequired,
    playButtonSound: PropTypes.func.isRequired,
    supportChatStatus: PropTypes.shape(),
    userSettings: PropTypes.shape().isRequired,
    openChat: PropTypes.bool
  }

  static defaultProps = {
    chatMessages: {},
    uid: null,
    emotions: {},
    openChat: false,
    supportChatStatus: {}
  }

  constructor(props) {
    super(props);
    this.state = {
      inputMessage: '',
      openEmotions: false,
      unreadMessages: 0
    };


    this.chatInAudio = new Audio(chatInSound);
  }

  componentDidMount() {
    this.scrollToBottom();
  }

  shouldComponentUpdate(nextProps, nextState) {

    if (nextProps.openChat !== this.props.openChat) {
    //  this.scrollToBottom();
      return true;
    }

    if (!isEqual(nextProps, this.props)) {
      this.scrollToBottom();
      return true;
    }

    if (!isEqual(nextState, this.state)) {
    //  this.scrollToBottom();
      return true;
    }

    return false;

  /*  const { chatMessages, openChat, uid } = nextProps;
    const { inputMessage, openEmotions } = nextState;
    const { chatMessages: curChatMessages, openChat: curOpenChat, uid: curUid } = this.props;

    const { inputMessage: curInputMessage, openEmotions: curOpenEmotions } = this.state;

    if (chatMessages && chatMessages.messages) {
      if (Object.keys(chatMessages.messages).length || Object.keys(chatMessages.messages).length === 0) {
        if ((!curChatMessages && chatMessages)
        || (chatMessages && curChatMessages && !curChatMessages.messages && chatMessages.messages)
        || Object.keys(chatMessages.messages).length !== Object.keys(curChatMessages.messages).length) {
          this.scrollToBottom();

          return true;
        }
      }
    }

    if (uid !== curUid) {
      return true;
    }

    if (inputMessage !== curInputMessage) {
      return true;
    }

    if (openChat !== curOpenChat) {
      return true;
    }

    if (openEmotions !== curOpenEmotions) {
      return true;
    }

    return false; */
  }

  componentDidUpdate(prevProps) {
    const { chatMessages, openChat, userSettings, supportChatStatus } = this.props;
    const oldSupportChatStatus = prevProps.supportChatStatus;
    const oldChatMessages = prevProps.chatMessages;
    const oldOpenChat = prevProps.openChat;
    const { unreadMessages } = this.state;

    if (openChat && !oldOpenChat) {
      this.scrollToBottom();
      this.setState({unreadMessages: 0})
      return;
    }

    if(!openChat){
      var newMessages = unreadMessages;
      var reverseMessageKeys = Object.keys(chatMessages.messages).reverse();

      for(const key of reverseMessageKeys){
        if(!oldChatMessages.messages[key] && chatMessages.messages[key].userUid !== "game"){
          newMessages++;
        }else if(oldChatMessages.messages[key] && oldChatMessages.messages[key].userUid !== "game"){
          break;
        }
      }

      if(userSettings && userSettings.soundOn){
        if(unreadMessages !== newMessages){
          this.chatInAudio.play();
        }
        else if((!oldSupportChatStatus || oldSupportChatStatus.read === true) && supportChatStatus && supportChatStatus.read === false){
          this.chatInAudio.play();
        }
      }



      this.setState({unreadMessages: newMessages})
    }

    /*if (chatMessages && chatMessages.messages && oldChatMessages && oldChatMessages.messages
      && Object.keys(chatMessages.messages).length
      !== Object.keys(oldChatMessages.messages).length) {
    //  this.scrollToBottom();
    }*/


  }

  scrollToBottom = () => {
  //  if (this.messagesEnd) {
  //    this.messagesEnd.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  //  }
    if (this.messagesScrollbar) {
      setTimeout(() => {
        if (this.messagesScrollbar) {
          this.messagesScrollbar.scrollBottom();
        }
      }, 2);
    }
  }

  scrollToBottomInstant = () => {
    if (this.messagesScrollbar) {
      this.messagesScrollbar.scrollBottom();
    }
  }

  handleChange = (event) => {
    if (event.key !== 'Enter' || (event.key === 'Enter' && event.shiftKey)) {
      const value = event.target.type === 'checkbox' ? event.target.checked : event.target.value;

      this.setState({
        [event.target.name]: value,
      });
    }
  }

  handleEnter = (event) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      this.handleSubmit();
    }
  }

  handleSubmit = () => {
  //  e.preventDefault();
    const { sendMessage } = this.props;
    const { inputMessage } = this.state;

    sendMessage(inputMessage).then((res) => {
      if (res === 'success') {
      //  toggleChat();
        this.setState({ inputMessage: '' });
      }
    });
  //  toggleChat();
  }


  openChat = () => {
    const { toggleChat, openChat } = this.props;

    toggleChat();

    if (!openChat) {
      this.setState({ openEmotions: false });
    }
  }

  openEmotions = () => {
    const { toggleChat, openChat, playButtonSound } = this.props;
    const { openEmotions } = this.state;

    if (!openEmotions && openChat) {
      toggleChat();
    }

    playButtonSound();
    this.setState(prevState => ({ openEmotions: !prevState.openEmotions }));
  }

  setEmotion = (key) => {
    const { setEmotion } = this.props;

    setEmotion(key);
  }

  renderMessages = (key, message, uid) => {
  //  const { chatMessages, uid } = this.props;
  //  if (chatMessages) {
  //    const { messages } = chatMessages;
  //    if (messages) {
        return(
          <Fragment key={key}>
            <Message uid={uid} message={message} />
          </Fragment>
        )
  //    }
  //  }
  }

  render() {
    const {
      t,
      chatMessages,
      uid,
      toggleChat,
      openChat,
      emotions,
      toggleSupport,
      supportChatStatus
    } = this.props;

    const { inputMessage, openEmotions, unreadMessages } = this.state;

    return (
      <>
        <div className={`chat ${openChat ? ('chat-open') : ('chat-closed')}`}>
          <Row className={`chat-header ${openChat ? ('') : ('chat-header-closed')}`}>
            <Col md="9" className="chat-header-name">
              {t('chat')}
            </Col>
            <Col md="1">
              {!openChat && chatMessages && chatMessages.status
              && !chatMessages.status[uid] && (
              <span className="contact-support-button-dot" />
              )}
            </Col>
            <Col md="1">
              <Row className="chat-header-button-row" style={{ float: 'right' }}>
                <Col className="chat-header-button-col" md="12" style={{ padding: 0 }}>
                  {openChat && (
                  <Button
                    className="chat-header-button"
                    onClick={() => { toggleChat(); }}
                  >
                    <IoMdClose />
                  </Button>
                  )}
                </Col>
              </Row>
            </Col>
          </Row>

          <Row className={`chat-body ${openChat ? ('chat-body-open') : ('chat-body-closed')}`}>
            <Col className="chat-body-wrapper" md="12">
              <ScrollArea
                speed={0.55}
                className="chat-body-scroll-area"
                contentClassName="chat-body-scroll-content"
              //  smoothScrolling
                verticalContainerStyle={{
                  background: 'transparent',
                  opacity: 1,
                  width: 7,
                }}
                verticalScrollbarStyle={{
                  background: '#fff',
                  borderRadius: 1,
                  width: 4,
                  minHeight: 10,
                  minScrollSize: 25,
                }}
                horizontal={false}
                ref={(el) => { this.messagesScrollbar = el; }}
              >
              {chatMessages && chatMessages.messages && Object.keys(chatMessages.messages).map((key) => this.renderMessages(key, chatMessages.messages[key], uid))}
              {/*  {chatMessages && chatMessages.messages
                  && Object.keys(chatMessages.messages).map(key => (
                    <Fragment key={key}>
                      <Message uid={uid} message={chatMessages.messages[key]} />
                    </Fragment>
                  ))}  */}
              </ScrollArea>
            </Col>
          </Row>
          <Row className={`chat-footer ${openChat ? ('chat-footer-open') : ('chat-footer-closed')}`}>
            <Form className="chat-footer-input-form">
              <Col className="chat-footer-input-wrapper" md="12">
                <Input
                  className="chat-footer-input"
                  type="textarea"
                  name="inputMessage"
                  id="inputMessage"
                  autoComplete="off"
                  placeholder="Rakstīt ziņu..."
                  value={inputMessage}
                  onChange={this.handleChange}
                  onKeyPress={this.handleEnter}
                />

              </Col>
              {/*  <Col md={{ size: 2, offset: 10 }} style={{ padding: 0 }}>
                  <Button className="chat-footer-button" onClick={this.handleSubmit}>
                    <IoMdThumbsUp />
                  </Button>
                </Col> */}
            </Form>
          </Row>

        </div>

        <div className={`emotions ${openEmotions ? ('emotions-open') : ('emotions-closed')}`}>
          <Row className={`emotions-header ${openEmotions ? ('') : ('emotions-header-closed')}`} onClick={this.openEmotions}>
            <Col md="9" className="emotions-header-name">
            {t('emotions')}
            </Col>
            <Col sm="1" />
            <Col md="1">
              <Row className="emotions-header-button-row" style={{ float: 'right' }}>
                <Col className="emotions-header-button-col" md="12" style={{ padding: 0 }}>
                  {openEmotions && (
                  <Button
                    className="emotions-header-button"
                    onClick={this.toggleEmotions}
                  >
                    <IoMdClose />
                  </Button>
                  )}
                </Col>
              </Row>
            </Col>
          </Row>

          <Row className="emotions-body">
            <Col className="emotions-body-wrapper" md="12">
              <Row className="emotions-wrapper">
                {emotions && Object.keys(emotions).map(key => (
                  <div key={key} className="emotions-emotion">
                    <Media
                      src={emotions[key] ? emotions[key].image : null}
                      className="emotions-emotion-image"
                      onClick={() => this.setEmotion(key)}
                    />
                  </div>
                ))}
              </Row>
            </Col>
          </Row>
        </div>

        <Row className="chat-bar">
          <Col sm="6" className="chat-bar-left">
            <div className={`${unreadMessages > 0 ? 'unread-messages': ''}`}>
              <Media src={chatIcon} className="chat-bar-left-button" onClick={this.openChat} />
            </div>
            <div className={`${supportChatStatus && supportChatStatus.read === false ? 'support-reply': ''}`}>
              <Media src={supportIcon} className={`chat-bar-left-button`} onClick={toggleSupport} />
            </div>
            <Media src={emotionIcon} className="chat-bar-left-button" onClick={this.openEmotions} />
          </Col>
          <Col sm="6" className="chat-bar-right">
            <Button className={`${openChat ? ('chat-bar-right-button') : ('chat-bar-right-button-closed')}`} onClick={this.handleSubmit}>
              {t('common:common.send')}
            </Button>
          </Col>
        </Row>
      </>
    );
  }
}

export default withTranslation(['game', 'common'])(Chat);
