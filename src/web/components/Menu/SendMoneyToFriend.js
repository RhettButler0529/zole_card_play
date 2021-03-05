import React, { Fragment } from 'react';
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
} from 'reactstrap'; */

import Row from 'reactstrap/lib/Row';
import Col from 'reactstrap/lib/Col';
import Button from 'reactstrap/lib/Button';
import Input from 'reactstrap/lib/Input';
import Label from 'reactstrap/lib/Label';
import Form from 'reactstrap/lib/Form';
import FormGroup from 'reactstrap/lib/FormGroup';
import Modal from 'reactstrap/lib/Modal';
import ModalHeader from 'reactstrap/lib/ModalHeader';
import ModalBody from 'reactstrap/lib/ModalBody';
import ModalFooter from 'reactstrap/lib/ModalFooter';

import { Firebase } from '../../../lib/firebase';

class SendMoneyToFriend extends React.Component {
  static propTypes = {
    member: PropTypes.shape({}).isRequired,
    t: PropTypes.func.isRequired,
    sendMoney: PropTypes.func.isRequired,
  }

  constructor(props) {
    super(props);
    this.state = {
      modal: false,
      amount: 0,
      friendId: '',
      friends: {},
    };

    this.toggle = this.toggle.bind(this);
    this.sendMoney = this.sendMoney.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }

  componentWillMount() {
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
                console.log('friends resp');
                console.log(resp);
                this.setState({ friends: resp });
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
    window.FB.ui({
      method: 'apprequests',
      message: 'Come Play Zole',
    }, () => {
    //  console.log(response);

    //  console.log(response.request);
    });
  }

  toggle() {
    this.setState(prevState => ({
      modal: !prevState.modal,
    }));
  }

  sendMoney() {
    const { sendMoney } = this.props;

    const { friendId, amount } = this.state;

    sendMoney(friendId, amount);
    this.setState(prevState => ({
      modal: !prevState.modal,
    }));
  }

  render() {
    const { t } = this.props;
    const {
      modal,
      amount,
      friendId,
      friends,
    } = this.state;

    return (
      <Fragment>
        {/*  <Row>
          <Col sm="12" className="send-money-title">
            {t('sendMoney.sendMoney')}
          </Col>
        </Row> */}
        <Row className="send-money">
          <Col sm="12" className="send-money-block" style={{ borderImage: 'url(../../../images/BuyMoney/Send money rec -o.png) 30 round' }}>
            <Row style={{ margin: 0 }}>
              <Col className="send-money-block-text" style={{ paddingRight: 0, paddingLeft: 0 }}>
                {t('sendMoney.sendUpTo')}
              </Col>
              <Col sm="3" style={{ paddingLeft: 0 }}>
                <Button color="success" className="send-money-block-left-button" onClick={this.toggle}>
                  {t('sendMoney.chooseFriend')}
                </Button>
                <Modal isOpen={modal} toggle={this.toggle}>
                  <ModalHeader toggle={this.toggle}>{t('sendMoney.chooseFriend')}</ModalHeader>
                  <ModalBody>
                    <Form>
                      <FormGroup>
                        <Label for="friendId">Draugs</Label>
                        <Input type="friendId" name="friendId" id="friendId" value={friendId} onChange={this.handleChange} />
                      </FormGroup>
                      <FormGroup>
                        <Label for="amount">Daudzums</Label>
                        <Input type="amount" name="amount" id="amount" value={amount} placeholder="0" onChange={this.handleChange} />
                      </FormGroup>
                    </Form>

                  </ModalBody>
                  <ModalFooter>
                    <Button color="primary" onClick={this.sendMoney}>Sūtīt</Button>
                    <Button color="danger" onClick={this.toggle}>Atcelt</Button>
                  </ModalFooter>
                </Modal>
              </Col>

            </Row>
            <Row>
              <Col sm="4">
                <Button color="link" className="send-money-block-invite-button" onClick={this.inviteFriend}>
                  {t('sendMoney.inviteFriend')}
                </Button>
              </Col>
            </Row>
          </Col>
          {/* }  <Col sm="5" style={{ paddingLeft: 30 }}>
            <Row>
              <Col sm="6" style={{ paddingRight: 0 }}>
                <Media className="app-store-button" src={appStore} alt="" />
              </Col>
              <Col sm="6" style={{ paddingRight: 0 }}>
                <Media className="google-play-button" src={googlePlay} alt="" />
              </Col>
            </Row>
          </Col> */}
        </Row>
      </Fragment>
    );
  }
}


export default withTranslation('common')(SendMoneyToFriend);
