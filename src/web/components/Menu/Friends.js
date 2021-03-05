import React from 'react';
import PropTypes from 'prop-types';

import { withTranslation } from 'react-i18next';

/* import {
  Row,
  Col,
  Button,
  Form,
  FormGroup,
  Label,
  Input,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Media,
} from 'reactstrap'; */

import Row from 'reactstrap/lib/Row';
import Col from 'reactstrap/lib/Col';
import Media from 'reactstrap/lib/Media';
import Button from 'reactstrap/lib/Button';
import Form from 'reactstrap/lib/Form';
import FormGroup from 'reactstrap/lib/FormGroup';
import Label from 'reactstrap/lib/Label';
import Input from 'reactstrap/lib/Input';
import Modal from 'reactstrap/lib/Modal';
import ModalHeader from 'reactstrap/lib/ModalHeader';
import ModalBody from 'reactstrap/lib/ModalBody';
import ModalFooter from 'reactstrap/lib/ModalFooter';

import { Firebase } from '../../../lib/firebase';

import myInfoImg from '../../../images/icons/my_profile.png';

class Friends extends React.Component {
  static propTypes = {
    member: PropTypes.shape({}).isRequired,
    t: PropTypes.func.isRequired,
    sendMoney: PropTypes.func.isRequired,
    fetchFBFriends: PropTypes.func.isRequired,
    playButtonSound: PropTypes.func.isRequired,
  }

  constructor(props) {
    super(props);
    this.state = {
      modal: false,
      amount: 0,
      friendId: '',
      friends: {},
    };

  //  this.toggle = this.toggle.bind(this);
  //  this.sendMoney = this.sendMoney.bind(this);
  //  this.handleChange = this.handleChange.bind(this);
  }

  componentWillMount() {
    const { fetchFBFriends } = this.props;
    Firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        window.FB.getLoginStatus((response) => {
          if (response.status === 'connected') {
            const { accessToken } = response.authResponse;

            window.FB.api(
              `/${user.providerData[0].uid}/friends`,
              'GET',
              { access_token: accessToken },
              (resp) => {
                this.setState({ friends: resp.data });

                fetchFBFriends(resp).then((res) => {

                });
              },
            );
          }
        });
      } else {
      //  console.log('no user');
      }
    });
  }

  handleChange = (event) => {
    const value = event.target.type === 'checkbox' ? event.target.checked : event.target.value;

    this.setState({
      [event.target.name]: value,
    });
  }

  inviteFriend = () => {
    const { member } = this.props;

    if (member.socProvider === 'facebook') {
      window.FB.ui({
        method: 'apprequests',
        message: 'Come Play Zole',
      }, () => {
      //  console.log(response);

      //  console.log(response.request);
      });
    } else {
      // Draugiem invite
    }
  }

  toggle = () => {
    this.setState(prevState => ({
      modal: !prevState.modal,
    }));
  }

  openModal = (id) => {
    this.setState(prevState => ({
      modal: !prevState.modal,
      friendId: id,
    }));
  }

  sendMoney = () => {
    const { sendMoney } = this.props;

    const { friendId, amount } = this.state;

    if (friendId && amount) {
      sendMoney(friendId, amount);
      this.setState(prevState => ({
        modal: !prevState.modal,
      }));
    }
  }

  render() {
    const {
      t, fbFriends, changeTab, member,
    } = this.props;
    const {
      modal,
      amount,
    //  friendId,
    //  friends,
    } = this.state;

    return (
      <div className="my-info">
        <Row className="my-info-header">
          <Col sm="4">
            <Media src={myInfoImg} className="my-info-header-image" />
            <div className="my-info-header-text">
              {t('myInfo.friends')}
            </div>
          </Col>
          <Col className="menu-topTab">
            <Button color="link" className="my-info-header-button active" onClick={() => changeTab('9')}>
              {t('myInfo.friends')}
            </Button>
          </Col>
          <Col className="menu-topTab">
            <Button color="link" className="my-info-header-button" onClick={() => changeTab('10')}>
              {t('myInfo.ignoredPlayers')}
            </Button>
          </Col>
          <Col className="menu-topTab" style={{ marginRight: 15 }}>
            <Button color="link" className="my-info-header-button" onClick={() => changeTab('11')}>
              {t('myInfo.achievements')}
            </Button>
          </Col>
        </Row>
        <Row>
          <Col sm="12">
            <Row className="friends">
              <Col sm="12" className="friends-table">
                <Row className="friends-table-header">
                  <Col sm="3" className="friends-table-header-col">
                    {t('common.name')}
                  </Col>
                  <Col sm="2" className="friends-table-header-col">
                    {t('common.balance')}
                  </Col>
                  <Col sm="2" className="friends-table-header-col">
                    {t('common.level')}
                  </Col>
                  <Col sm="2" className="friends-table-header-col">
                    {t('common.points')}
                  </Col>
                  <Col sm="3" className="friends-table-header-col">
                    {t('friends.sendMoney')}
                  </Col>
                </Row>
                {fbFriends && Object.keys(fbFriends).map(key => (
                  <Row key={key} className="friends-table-row">
                    <Col sm="3" className="friends-table-row-col">
                      {fbFriends[key].name}
                    </Col>
                    <Col sm="2" className="friends-table-row-col">
                      {fbFriends[key].bal}
                    </Col>
                    <Col sm="2" className="friends-table-row-col">
                      {fbFriends[key].lvl}
                    </Col>
                    <Col sm="2" className="friends-table-row-col">
                      {fbFriends[key].points}
                    </Col>
                    <Col sm="3" className="friends-table-row-col">
                      <Button color="success" className="friends-table-button" onClick={() => this.openModal(fbFriends[key].uid)}>
                        {t('friends.sendMoney')}
                      </Button>
                    </Col>
                  </Row>
                ))}
              </Col>
              {/*  <Col sm="3" style={{ paddingLeft: 0 }}>  */}

              <Modal className="friends-modal" isOpen={modal} toggle={this.toggle}>
                <ModalHeader className="friends-modal-header" toggle={this.toggle}>{t('sendMoney.chooseFriend')}</ModalHeader>
                <ModalBody className="friends-modal-body">
                  <Form className="friends-modal-body-form">
                    <FormGroup>
                      <Label for="amount">{t('friends.amount')}</Label>
                      <Input type="amount" name="amount" id="amount" value={amount} placeholder="0" onChange={this.handleChange} />
                    </FormGroup>
                  </Form>

                </ModalBody>
                <ModalFooter className="friends-modal-footer">
                  <Button color="primary" onClick={this.sendMoney}>{t('friends.send')}</Button>
                  <Button color="danger" onClick={this.toggle}>{t('friends.cancel')}</Button>
                </ModalFooter>
              </Modal>
              {/*  </Col> */}

            </Row>
            {member && member.socProvider === 'facebook' && (
              <Row>
                <Col sm="4">
                  <Button color="link" className="send-money-block-invite-button" onClick={this.inviteFriend}>
                    {t('sendMoney.inviteFriend')}
                  </Button>
                </Col>
              </Row>
            )}
          </Col>
        </Row>
      </div>
    );
  }
}


export default withTranslation('common')(Friends);
