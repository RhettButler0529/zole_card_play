import React, { Fragment } from 'react';
import PropTypes from 'prop-types';

import Moment from 'react-moment';
import moment from 'moment';

import ScrollArea from 'react-scrollbar';

/* import {
  Row,
  Col,
  Form,
  Input,
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Pagination,
  PaginationItem,
  PaginationLink,
} from 'reactstrap'; */

import Row from 'reactstrap/lib/Row';
import Col from 'reactstrap/lib/Col';
import Form from 'reactstrap/lib/Form';
import Input from 'reactstrap/lib/Input';
import Button from 'reactstrap/lib/Button';
import Pagination from 'reactstrap/lib/Pagination';
import PaginationItem from 'reactstrap/lib/PaginationItem';
import PaginationLink from 'reactstrap/lib/PaginationLink';
import Modal from 'reactstrap/lib/Modal';
import ModalHeader from 'reactstrap/lib/ModalHeader';
import ModalBody from 'reactstrap/lib/ModalBody';
import ModalFooter from 'reactstrap/lib/ModalFooter';

import { withRouter } from 'react-router-dom';

import Message from './AdminSupportMessage';

class UserMessages extends React.Component {
  static propTypes = {
    member: PropTypes.shape({
      email: PropTypes.string,
    }),
    //  allChats: PropTypes.arrayOf(PropTypes.shape({})),
    chatMessages: PropTypes.shape({}),
    history: PropTypes.shape({
      push: PropTypes.func.isRequired,
    }).isRequired,
    getUserMessages: PropTypes.func.isRequired,
    cancelUserMessages: PropTypes.func.isRequired,
    answerSupportMessage: PropTypes.func.isRequired,
    setSupportMessageAsResponded: PropTypes.func.isRequired,
    messageAll: PropTypes.func.isRequired,
    readMessages: PropTypes.arrayOf(PropTypes.shape({
      lastResponse: PropTypes.string,
      responded: PropTypes.bool,
      active: PropTypes.bool,
      name: PropTypes.string,
    })),
    unreadMessages: PropTypes.arrayOf(PropTypes.shape({
      lastResponse: PropTypes.string,
      responded: PropTypes.bool,
      active: PropTypes.bool,
      name: PropTypes.string,
    })),
  }

  static defaultProps = {
    member: {},
    chatMessages: {},
    readMessages: {},
    unreadMessages: {},
  }

  constructor(props) {
    super(props);
    this.state = {
      openModal: false,
      currentPage: 0,
      pageSize: 50,
      uid: '',
      inputMessage: '',
      readMessages: [],
      unreadMessages: [],
      messageAllInput: '',
      messageAllModal: false,
    };

    this.openModal = this.openModal.bind(this);
    this.handleClick = this.handleClick.bind(this);
  }

  componentWillMount() {
    const { readMessages, unreadMessages } = this.state;
    const { props } = this;

    if (props.readMessages && readMessages
      && readMessages.length !== props.readMessages.length) {
      this.setState({ readMessages: props.readMessages });
    }

  /*  if (props.unreadMessages && unreadMessages
      && unreadMessages.length !== props.unreadMessages.length) {
    //  console.log('are equal');

      this.setState({ unreadMessages: props.unreadMessages });
    } */

    if (props.unreadMessages && unreadMessages
      && Object.keys(unreadMessages).length !== Object.keys(props.unreadMessages).length) {
      console.log('are not equal');

      const unreadMessagesArr = [];
      Object.keys(props.unreadMessages).map((key) => {
        unreadMessagesArr.push({
          ...props.unreadMessages[key],
          key,
        });
        return null;
      });

      console.log('unreadMessagesArr');
      console.log(unreadMessagesArr);

      unreadMessagesArr.sort((a, b) => b.lastResponse - a.lastResponse);

      this.setState({ unreadMessages: unreadMessagesArr });
    }
  }

  componentWillUpdate(nextProps) {
    const { readMessages, unreadMessages } = this.state;

    if (nextProps.readMessages && readMessages
      && readMessages.length !== nextProps.readMessages.length) {
      console.log('are not equal');

      this.setState({ readMessages: nextProps.readMessages });
    }

    if (nextProps.unreadMessages && unreadMessages
      && Object.keys(unreadMessages).length !== Object.keys(nextProps.unreadMessages).length) {
      console.log('are not equal');

      const unreadMessagesArr = [];
      Object.keys(nextProps.unreadMessages).map((key) => {
        unreadMessagesArr.push({
          ...nextProps.unreadMessages[key],
          key,
        });
        return null;
      });

      console.log('unreadMessagesArr');
      console.log(unreadMessagesArr);

      unreadMessagesArr.sort((a, b) => b.lastResponse - a.lastResponse);

      this.setState({ unreadMessages: unreadMessagesArr });
    }
  }

  //  handleChange = (event) => {
  //    const value = event.target.type === 'checkbox' ? event.target.checked : event.target.value;
  //
  //    this.setState({
  //      [event.target.name]: value,
  //    });
  //  }

  scrollToBottom = () => {
    if (this.messagesScrollbar) {
      setTimeout(() => {
        if (this.messagesScrollbar) {
          this.messagesScrollbar.scrollBottom();
        }
      }, 50);
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
      this.submitMessage();
    }
  }

  submitMessage = () => {
  //  e.preventDefault();
    const { answerSupportMessage } = this.props;
    const { inputMessage, uid } = this.state;

    answerSupportMessage({ uid, message: inputMessage }).then(() => {
    //  if (res === 'success') {
      this.setState({ inputMessage: '' });
    //  }
    });
  }

  setSupportMessageAsResponded = () => {
    const { setSupportMessageAsResponded } = this.props;
    const { uid } = this.state;

    setSupportMessageAsResponded({ uid }).then(() => {
      this.setState({
        openModal: false,
        uid: '',
      });
    });
  }

  toggleMessageAll = () => {
    this.setState(prevState => ({
      messageAllModal: !prevState.messageAllModal,
      messageAllInput: '',
    }));
  }


  toggle = () => {
    const { openModal, uid } = this.state;

    if (openModal) {
      const { cancelUserMessages } = this.props;

      cancelUserMessages(uid);
    }

    this.setState(prevState => ({
      openModal: !prevState.openModal,
      uid: '',
    }));
  }


  handleChangeMessageAll = (event) => {
    if (event.key !== 'Enter' || (event.key === 'Enter' && event.shiftKey)) {
      const value = event.target.type === 'checkbox' ? event.target.checked : event.target.value;

      this.setState({
        [event.target.name]: value,
      });
    }
  }

  handleEnterMessageAll = (event) => {
    if (event.key === 'Enter' && !event.shiftKey) {
    //  this.submitMessage();
    }
  }

  messageAll = () => {
    const { messageAll } = this.props;
    const { messageAllInput } = this.state;

    messageAll({ message: messageAllInput }).then(() => {
      this.setState({ messageAllInput: '' });
    });
  }

  openModal(uid) {
    const { getUserMessages } = this.props;

    getUserMessages(uid).then((res) => {
      this.scrollToBottom();
    });

    this.setState({
      openModal: true,
      uid,
    });
  }


  handleClick(e, index) {
    e.preventDefault();

    this.setState({
      currentPage: index,
    });
  }


  table() {
    const {
      readMessages,
  //    unreadMessages,
    } = this.props;
    const {
      currentPage,
      pageSize,
      unreadMessages,
    } = this.state;

    //  let allChats = [];
    //  if (unreadMessages && readMessages && (unreadMessages.length || unreadMessages.length === 0)
    //    && (readMessages.length || readMessages.length === 0)) {
    //    allChats = [...unreadMessages, ...readMessages];
    //  }

    let messagesLength = 0;
    //  let readLength = 0;
    let unreadLength = 0;
    if (readMessages && unreadMessages) {
    //  readLength = Object.keys(readMessages).length;
      unreadLength = unreadMessages.length;
      messagesLength = Object.keys(readMessages).length + Object.keys(unreadMessages).length;
    }

    const pagesCount = Math.ceil(messagesLength / pageSize);

    return (
      <Fragment>
        <Fragment>
          {currentPage * pageSize < unreadLength ? (
            <Fragment>
              {(unreadLength - (currentPage * pageSize)) >= pageSize ? (
                <Fragment>
                  {unreadMessages && unreadMessages.length && unreadMessages
                    .slice(
                      currentPage * pageSize - unreadLength,
                      (currentPage + 1) * pageSize,
                    )
                    .map((message, index) => (
                      <Fragment key={message.key}>
                        <tr key={message.key} className={`allUsers-table-row ${index % 2 === 0 ? ('odd') : ('even')}`}>
                          <td className="allUsers-table-col">
                            {message.key}
                          </td>
                          <td className="allUsers-table-col">
                            {message.name}
                          </td>
                          <td className="allUsers-table-col">
                            {message.lastResponse && (
                            <Moment format="DD-MM-YYYY, HH:mm" locale="lv">
                              {moment(message.lastResponse)}
                            </Moment>
                            )}
                          </td>
                          <td className="allUsers-table-col">
                            {message.responded ? 'Atbildēts' : 'Nav Atbildēts'}
                          </td>
                          <td className="allUsers-table-col">
                            {message.active ? 'Aktīvs' : 'Neaktīvs'}
                          </td>
                          <td className="allUsers-table-col">
                            <Button color="primary" onClick={() => this.openModal(message.key)}>
                        Atvērt
                            </Button>
                          </td>
                        </tr>
                      </Fragment>
                    ))}

                </Fragment>
              ) : (
                <Fragment>
                  {unreadMessages && unreadMessages.length && unreadMessages
                    .slice(
                      currentPage * pageSize - unreadLength,
                      (currentPage + 1) * pageSize,
                    )
                    .map((message, index) => (
                      <Fragment key={message.key}>
                        <tr key={message.key} className={`allUsers-table-row ${index % 2 === 0 ? ('odd') : ('even')}`}>
                          <td className="allUsers-table-col">
                            {message.key}
                          </td>
                          <td className="allUsers-table-col">
                            {message.name}
                          </td>
                          <td className="allUsers-table-col">
                            {message.lastResponse && (
                            <Moment format="DD-MM-YYYY, HH:mm" locale="lv">
                              {moment(message.lastResponse)}
                            </Moment>
                            )}
                          </td>
                          <td className="allUsers-table-col">
                            {message.responded ? 'Atbildēts' : 'Nav Atbildēts'}
                          </td>
                          <td className="allUsers-table-col">
                            {message.active ? 'Aktīvs' : 'Neaktīvs'}
                          </td>
                          <td className="allUsers-table-col">
                            <Button color="primary" onClick={() => this.openModal(message.key)}>
                            Atvērt
                            </Button>
                          </td>
                        </tr>
                      </Fragment>
                    ))}
                  {readMessages && Object.keys(readMessages)
                    .slice(
                      0,
                      (currentPage + 1) * pageSize - unreadLength,
                    )
                    .map((key, index) => (
                      <Fragment key={key}>
                        <tr key={key} className={`allUsers-table-row ${unreadLength % 2 ? (index % 2 === 1 ? ('odd') : ('even')) : (index % 2 === 0 ? ('odd') : ('even'))}`}>
                          <td className="allUsers-table-col">
                            {key}
                          </td>
                          <td className="allUsers-table-col">
                            {readMessages[key].name}
                          </td>
                          <td className="allUsers-table-col">
                            {readMessages[key].lastResponse && (
                            <Moment format="DD-MM-YYYY, HH:mm" locale="lv">
                              {moment(readMessages[key].lastResponse)}
                            </Moment>
                            )}
                          </td>
                          <td className="allUsers-table-col">
                            {readMessages[key].responded ? 'Atbildēts' : 'Nav Atbildēts'}
                          </td>
                          <td className="allUsers-table-col">
                            {readMessages[key].active ? 'Aktīvs' : 'Neaktīvs'}
                          </td>
                          <td className="allUsers-table-col">
                            <Button color="primary" onClick={() => this.openModal(key)}>
                              Atvērt
                            </Button>
                          </td>
                        </tr>
                      </Fragment>
                    ))}
                </Fragment>
              )}
            </Fragment>
          ) : (
            <Fragment>
              {readMessages && Object.keys(readMessages)
                .slice(
                  currentPage * pageSize - unreadLength,
                  (currentPage + 1) * pageSize - unreadLength,
                )
                .map((key, index) => (
                  <Fragment key={key}>
                    <tr key={key} className={`allUsers-table-row ${index % 2 === 0 ? ('odd') : ('even')}`}>
                      <td className="allUsers-table-col">
                        {key}
                      </td>
                      <td className="allUsers-table-col">
                        {readMessages[key].name}
                      </td>
                      <td className="allUsers-table-col">
                        {readMessages[key].lastResponse && (
                        <Moment format="DD-MM-YYYY, HH:mm" locale="lv">
                          {moment(readMessages[key].lastResponse)}
                        </Moment>
                        )}
                      </td>
                      <td className="allUsers-table-col">
                        {readMessages[key].responded ? 'Atbildēts' : 'Nav Atbildēts'}
                      </td>
                      <td className="allUsers-table-col">
                        {readMessages[key].active ? 'Aktīvs' : 'Neaktīvs'}
                      </td>
                      <td className="allUsers-table-col">
                        <Button color="primary" onClick={() => this.openModal(key)}>
                        Atvērt
                        </Button>
                      </td>
                    </tr>
                  </Fragment>
                ))}
            </Fragment>
          )}


          {/*  <Fragment>
              {unreadMessages && Object.keys(unreadMessages)
                .slice(
                  currentPage * pageSize,
                  (currentPage + 1) * pageSize,
                )
                .map((chat, index) => (
                  <Fragment key={chat.key}>
                    <tr key={chat.key} className={`allUsers-table-row ${index % 2 === 0 ? ('odd') : ('even')}`}>
                      <td className="allUsers-table-col">
                        {chat.key}
                      </td>
                      <td className="allUsers-table-col">
                        {chat.name}
                      </td>
                      <td className="allUsers-table-col">
                        {chat.lastResponse && (
                        <Moment format="DD-MM-YYYY, HH:mm" locale="lv">
                          {moment(chat.lastResponse)}
                        </Moment>
                        )}
                      </td>
                      <td className="allUsers-table-col">
                        {chat.responded ? 'Atbildēts' : 'Nav Atbildēts'}
                      </td>
                      <td className="allUsers-table-col">
                        {chat.active ? 'Aktīvs' : 'Neaktīvs'}
                      </td>
                      <td className="allUsers-table-col">
                        <Button color="primary" onClick={() => this.openModal(chat.key)}>
                      Atvērt
                        </Button>
                      </td>
                    </tr>
                  </Fragment>
                ))} */}
        </Fragment>

        {/*
        {allChats && allChats.length > 0 && allChats
          .slice(
            currentPage * pageSize,
            (currentPage + 1) * pageSize,
          )
          .map((chat, index) => (
            <Fragment key={chat.key}>
              <tr key={chat.key} className={`allUsers-table-row ${index % 2 === 0 ? ('odd') : ('even')}`}>
                <td className="allUsers-table-col">
                  {chat.key}
                </td>
                <td className="allUsers-table-col">
                  {chat.name}
                </td>
                <td className="allUsers-table-col">
                  {chat.lastResponse && (
                  <Moment format="DD-MM-YYYY, HH:mm" locale="lv">
                    {moment(chat.lastResponse)}
                  </Moment>
                  )}
                </td>
                <td className="allUsers-table-col">
                  {chat.responded ? 'Atbildēts' : 'Nav Atbildēts'}
                </td>
                <td className="allUsers-table-col">
                  {chat.active ? 'Aktīvs' : 'Neaktīvs'}
                </td>
                <td className="allUsers-table-col">
                  <Button color="primary" onClick={() => this.openModal(chat.key)}>
                    Atvērt
                  </Button>
                </td>
              </tr>
            </Fragment>
          ))}
          */}


        {messagesLength > pageSize && (
        <div className="pagination-wrapper">
          <Pagination aria-label="Page navigation example">
            <PaginationItem disabled={currentPage <= 0}>
              <PaginationLink
                onClick={e => this.handleClick(e, currentPage - 1)}
                previous
                href="#"
              />
            </PaginationItem>

            <PaginationItem disabled={currentPage < 3}>
              <PaginationLink onClick={e => this.handleClick(e, 0)} href="#">
                  1
              </PaginationLink>
            </PaginationItem>

            {[...Array(pagesCount)].map((page, i) => {
              if (i > currentPage - 3 && i < currentPage + 3) {
                return (
                  <PaginationItem active={i === currentPage} key={page}>
                    <PaginationLink onClick={e => this.handleClick(e, i)} href="#">
                      {i + 1}
                    </PaginationLink>
                  </PaginationItem>
                );
              }

              return null;
            })}

            {currentPage < (pagesCount - 3) && (
            <PaginationItem disabled={currentPage >= pagesCount - 1}>
              <PaginationLink onClick={e => this.handleClick(e, pagesCount - 1)} href="#">
                {pagesCount}
              </PaginationLink>
            </PaginationItem>
            )}

            <PaginationItem disabled={currentPage >= pagesCount - 1}>
              <PaginationLink
                onClick={e => this.handleClick(e, currentPage + 1)}
                next
                href="#"
              />
            </PaginationItem>
          </Pagination>
        </div>
        )}
      </Fragment>
    );
  }

  render() {
    const {
      chatMessages,
    } = this.props;

    const {
      openModal,
      inputMessage,
      messageAllModal,
      messageAllInput,
    } = this.state;

    return (
      <Fragment>
        <div style={{ marginTop: 100 }}>
          <Row>
            <Col md="6">
              <h2>
            Sarakstes
              </h2>
            </Col>
            <Col md="6">
              <Button type="button" color="primary" onClick={this.toggleMessageAll}>Rakstīt ziņu visiem lietotājiem</Button>
            </Col>
          </Row>
          <table style={{ width: '100%', fontSize: 12, color: '#fff' }}>
            <colgroup>
              <col span="1" className="" />
            </colgroup>
            <thead>
              <tr>
                <th style={{ textAlign: 'center' }}>
                  Uid
                </th>
                <th style={{ textAlign: 'center' }}>
                  Vārds
                </th>
                <th style={{ textAlign: 'center' }}>
                  Pēdējā ziņa
                </th>
                <th style={{ textAlign: 'center' }}>
                  Atbildēts
                </th>
                <th style={{ textAlign: 'center' }}>
                  Aktīvs
                </th>
              </tr>
            </thead>
            <tbody>
              {this.table()}
            </tbody>
          </table>

        </div>
        <Modal isOpen={openModal} toggle={this.toggle}>
          <ModalHeader toggle={this.toggle}>
            Sarakste
          </ModalHeader>
          <ModalBody>
            <Row className="chat-body">
              <Col className="chat-body-wrapper" md="12">
                <ScrollArea
                  speed={0.65}
                  className="admin-chat-scroll-area"
                  contentClassName="admin-chat-scroll-content"
                  smoothScrolling
                  verticalContainerStyle={{
                    background: 'transparent',
                    opacity: 1,
                    width: 10,
                  }}
                  verticalScrollbarStyle={{
                    background: '#fff',
                    borderRadius: 2,
                    width: 6,
                    minHeight: 30,
                    minScrollSize: 35,
                  }}
                  horizontal={false}
                  ref={(el) => { this.messagesScrollbar = el; }}
                >
                  {chatMessages && Object.keys(chatMessages).map(key => (
                    <Row>
                      <Col md="12">
                        <Message message={chatMessages[key]} />
                      </Col>
                    </Row>
                  ))}
                {/*  <div
                    style={{ float: 'left', clear: 'both' }}
                    ref={(el) => { this.messagesEnd = el; }}
                  /> */}
                </ScrollArea>
              </Col>
            </Row>
            <Row className="chat-footer" style={{ height: '20%' }}>
              <Form style={{ width: '100%' }}>
                <Col md="12">
                  <Input
                    className="chat-footer-input"
                    type="textarea"
                    name="inputMessage"
                    id="inputMessage"
                    autocomplete="off"
                    placeholder="Rakstīt ziņu..."
                    style={{

                    }}
                    value={inputMessage}
                    onChange={this.handleChange}
                    onKeyPress={this.handleEnter}
                  />

                </Col>
              </Form>
            </Row>
          </ModalBody>
          <ModalFooter>
            <Button type="button" color="secondary" onClick={this.setSupportMessageAsResponded}>Atzīmēt kā lasītu</Button>
            <Button className="contact-support-footer-button" color="primary" onClick={this.submitMessage}>
              Sūtīt
            </Button>
            <Button type="button" color="secondary" onClick={this.toggle}>Aizvērt</Button>
          </ModalFooter>
        </Modal>


        <Modal isOpen={messageAllModal} toggle={this.toggleMessageAll}>
          <ModalHeader toggle={this.toggleMessageAll}>
            Rakstīt visiem
          </ModalHeader>
          <ModalBody>
            <Row className="chat-footer" style={{ height: '80%' }}>
              <Form style={{ width: '100%' }}>
                <Col md="12">
                  <Input
                    className="chat-footer-input"
                    type="textarea"
                    name="messageAllInput"
                    id="messageAllInput"
                    autocomplete="off"
                    placeholder="Rakstīt ziņu..."
                    value={messageAllInput}
                    onChange={this.handleChangeMessageAll}
                    onKeyPress={this.handleEnterMessageAll}
                  />

                </Col>
              </Form>
            </Row>
          </ModalBody>
          <ModalFooter>
            <Button className="contact-support-footer-button" color="primary" onClick={this.messageAll}>
              Sūtīt visiem
            </Button>
            <Button type="button" color="secondary" onClick={this.toggleMessageAll}>Aizvērt</Button>
          </ModalFooter>
        </Modal>
      </Fragment>
    );
  }
}

export default withRouter(UserMessages);
