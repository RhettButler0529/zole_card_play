import React from 'react';
import PropTypes from 'prop-types';

import { withTranslation } from 'react-i18next';
import ScrollArea from 'react-scrollbar';

/* import {
  Row,
  Col,
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Form,
  Input,
} from 'reactstrap'; */

import Row from 'reactstrap/lib/Row';
import Col from 'reactstrap/lib/Col';
import Button from 'reactstrap/lib/Button';
import Modal from 'reactstrap/lib/Modal';
import ModalHeader from 'reactstrap/lib/ModalHeader';
import ModalBody from 'reactstrap/lib/ModalBody';
import ModalFooter from 'reactstrap/lib/ModalFooter';
import Form from 'reactstrap/lib/Form';
import Input from 'reactstrap/lib/Input';
import Media from 'reactstrap/lib/Media';

import Message from './SupportMessage';

import closeImg from '../../images/icons/close.png';

class ContactSupport extends React.Component {
  static propTypes = {
    supportChatStatus: PropTypes.shape({
      read: PropTypes.bool,
    }),
    supportChat: PropTypes.shape({}),
    uid: PropTypes.string,
    name: PropTypes.string,
    chatMessages: PropTypes.shape({}),
    closeErrorSubmit: PropTypes.bool.isRequired,
    modalOpen: PropTypes.bool,
    resetClose: PropTypes.func.isRequired,
    t: PropTypes.func.isRequired,
    sendSupportMessage: PropTypes.func.isRequired,
    setSupportAsRead: PropTypes.func.isRequired,
    toggle: PropTypes.func.isRequired,
  };

  static defaultProps = {
    chatMessages: {},
    uid: null,
    name: '',
    supportChat: {},
    supportChatStatus: {},
    modalOpen: false,
  };

  constructor(props) {
    super(props);
    this.state = {
      modalOpen: false,
      inputMessage: '',
    };
  }

  componentDidMount() {
    this.scrollToBottom();
  }

  componentDidUpdate(prevProps) {
    const {
      closeErrorSubmit, resetClose, supportChat, modalOpen,
    } = this.props;
    const prevSupportChat = prevProps.supportChat;
    const prevModalOpen = prevProps.modalOpen;

    if (closeErrorSubmit) {
      resetClose();
      this.closeModal();
    }

    if (
      supportChat
      && (!prevSupportChat
        || (prevSupportChat
          && Object.keys(prevSupportChat).length !== Object.keys(supportChat).length))
    ) {
      this.scrollToBottom();
    }

    if (modalOpen && modalOpen !== prevModalOpen) {
      this.scrollToBottom();
    }
  }

  scrollToBottom = () => {
    setTimeout(() => {
      if (this.messagesScrollbar) {
        this.messagesScrollbar.scrollBottom();
      }
    }, 200);
  };

  closeModal = () => {
    this.setState({ modalOpen: false });
  };

  /* toggle = () => {
    const { modalOpen } = this.state;
    const { setSupportAsRead, supportChatStatus } = this.props;

    if (!modalOpen && supportChatStatus && !supportChatStatus.read) {
      setSupportAsRead();
    }
  }; */

  handleChange = (event) => {
    if (event.key !== 'Enter' || (event.key === 'Enter' && event.shiftKey)) {
      const value = event.target.type === 'checkbox' ? event.target.checked : event.target.value;

      this.setState({
        [event.target.name]: value,
      });
    }
  };

  handleEnter = (event) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      this.submitMessage();
    }
  };

  submitMessage = () => {
    const { sendSupportMessage, name } = this.props;
    const { inputMessage } = this.state;

    sendSupportMessage({ message: inputMessage, name }).then(() => {
      this.setState({ inputMessage: '' });
    });
  };

  render() {
    const { inputMessage } = this.state;

    const {
      t, modalOpen, toggle, supportChat, uid,
    } = this.props;

    return (
      <Row className="contact-support">
        <Modal isOpen={modalOpen} toggle={toggle} className="contact-support-modal">
          <ModalHeader
            toggle={toggle}
            className="contact-support-modal-header"
            close={(
              <Media
                src={closeImg}
                className="notification-header-close"
                alt="X"
                onClick={toggle}
              />
            )}
          >
            {t('support.report')}
          </ModalHeader>
          <ModalBody className="contact-support-modal-body">
            <>
              <Row>
                <Col className="contact-support-chat-body-wrapper" style={{ height: 360 }} md="12">
                  <ScrollArea
                    speed={0.65}
                    className="chat-body-scroll-area"
                    contentClassName="online-users-ReactTableContainer"
                    onScroll={this.handleScroll}
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
                      minScrollSize: 25,
                    }}
                    horizontal={false}
                    ref={(el) => {
                      this.messagesScrollbar = el;
                    }}
                  >
                    {supportChat
                      && Object.keys(supportChat).map((key) => (
                        <Row key={key}>
                          <Col md="12">
                            <Message
                              uid={uid}
                              message={supportChat[key].message || null}
                              userUid={supportChat[key].userUid || null}
                              date={supportChat[key].date || null}
                            />
                          </Col>
                        </Row>
                      ))}
                  </ScrollArea>
                </Col>
              </Row>
              <Row className="contact-support-chat-footer">
                <Form style={{ width: '100%' }} onSubmit={this.submitMessage}>
                  <Col md="12">
                    <Input
                      className="contact-support-chat-footer-input"
                      type="textarea"
                      name="inputMessage"
                      id="inputMessage"
                      autoComplete="off"
                      placeholder="Rakstīt ziņu..."
                      value={inputMessage}
                      onChange={this.handleChange}
                      onKeyPress={this.handleEnter}
                    />
                    {/*  <textarea
                        className="support-chat-footer-input"
                        defaultValue=""
                        name="inputMessage"
                        id="inputMessage"
                        placeholder="Rakstīt ziņu..."
                        value={inputMessage}
                        onKeyUp={this.handleChange}
                      />  */}
                  </Col>
                </Form>
              </Row>
            </>

            {/*  <Form>
                <FormGroup>
                  <Label for="type">
                    {t('support.type')}
                  </Label>
                  <Input type="select" className="contact-support-select" value={type} onChange={this.selectType}>
                    <option hidden disabled selected value="" />
                    <option value="error">
                      {t('support.error')}
                    </option>
                    <option value="slowPerformace">
                      {t('support.slowPerformace')}
                    </option>
                    <option value="paymentError">
                      {t('support.paymentError')}
                    </option>
                    <option value="recomendation">
                      {t('support.recomendation')}
                    </option>
                    <option value="other">
                      {t('support.other')}
                    </option>
                  </Input>
                </FormGroup>
                <FormGroup>
                  <Label for="message">
                    {t('support.message')}
                  </Label>
                  <Input
                    type="text"
                    name="message"
                    id="message"
                    value={message}
                    onChange={this.handleChange}
                  />
                </FormGroup>
              </Form>
              */}
          </ModalBody>
          <ModalFooter className="contact-support-modal-footer">
            <Button
              type="button"
              className="contact-support-modal-footer-button"
              color="primary"
              onClick={this.submitMessage}
            >
              {t('common.send')}
            </Button>
            <Button
              type="button"
              className="contact-support-modal-footer-button"
              color="secondary"
              onClick={toggle}
            >
              {t('common.cancel')}
            </Button>
          </ModalFooter>
        </Modal>
      </Row>
    );
  }
}

export default withTranslation('common')(ContactSupport);
