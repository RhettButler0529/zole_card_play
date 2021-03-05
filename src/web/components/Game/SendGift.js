import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';

import { withTranslation } from 'react-i18next';

/* import {
  Row,
  Col,
  Media,
  Button,
  Input,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from 'reactstrap'; */

import Row from 'reactstrap/lib/Row';
import Col from 'reactstrap/lib/Col';
import Media from 'reactstrap/lib/Media';
import Button from 'reactstrap/lib/Button';
import Input from 'reactstrap/lib/Input';
import Modal from 'reactstrap/lib/Modal';
import Label from 'reactstrap/lib/Label';
import ModalHeader from 'reactstrap/lib/ModalHeader';
import ModalBody from 'reactstrap/lib/ModalBody';
import ModalFooter from 'reactstrap/lib/ModalFooter';

import Gift from './Gift';

import giftImg from '../../../images/Game/gift.svg';
import closeImg from '../../../images/icons/close.png';

class SendGift extends Component {
  static propTypes = {
  //  t: PropTypes.func.isRequired,
    sendGift: PropTypes.func.isRequired,
    toggle: PropTypes.func.isRequired,
    playButtonSound: PropTypes.func.isRequired,
    gifts: PropTypes.shape({}),
    //  member: PropTypes.shape({}),
    players: PropTypes.shape({}),
    modalOpen: PropTypes.bool,
    roomId: PropTypes.string,
    initialSelected: PropTypes.string,
  }

  static defaultProps = {
    gifts: {},
    //  member: {},
    players: {},
    modalOpen: false,
    roomId: '',
    initialSelected: '',
  }

  constructor(props) {
    super(props);
    this.state = {
      giftId: '',
      comment: '',
      playerChecked: {
        player0: false,
        player1: false,
        player2: false,
      },
      allChecked: false,
    };
  }

  componentDidMount() {
  }

  componentWillReceiveProps(nextProps) {
    const { initialSelected, players } = nextProps;

    if (players && initialSelected) {
      let selected;
      if (players.player1 && initialSelected === players.player1.uid) {
        selected = 'player0';
      } else if (players.player2 && initialSelected === players.player2.uid) {
        selected = 'player1';
      } else if (players.player3 && initialSelected === players.player3.uid) {
        selected = 'player2';
      }

      if (selected) {
        this.setState(prevState => ({
          playerChecked: {
            ...prevState.playerChecked,
            [selected]: true,
          },
        }));
      }
    }
  }

  handleChange = (event) => {
    const value = event.target.type === 'checkbox' ? event.target.checked : event.target.value;
    const { name } = event.target;
    if (name === 'allChecked') {
      const { playButtonSound } = this.props;
      playButtonSound();

      this.setState({
        playerChecked: {
          player0: value,
          player1: value,
          player2: value,
        },
        allChecked: value,
      });
    } else if (name === 'player0' || name === 'player1' || name === 'player2') {
      const { playButtonSound } = this.props;
      const { playerChecked } = this.state;
      playButtonSound();

      let { player0, player1, player2 } = playerChecked;
      if (name === 'player0') {
        player0 = value;
      } else if (name === 'player1') {
        player1 = value;
      } else if (name === 'player2') {
        player2 = value;
      }

      this.setState(prevState => ({
        playerChecked: {
          ...prevState.playerChecked,
          [name]: value,
        },
        allChecked: (!!(player0 && player1 && player2)),
      }));
    } else {
      const striped = value.replace(/[^A-Za-z0-9\s!?\u0020-\u0080\u0400-\u04FF\u0080-\u024F]/g, '');

      const trimmed = striped.substring(0, 100);

      this.setState({
        [name]: trimmed,
      });
    }
  }

  sendGift = () => {
    const {
      sendGift, players, roomId, playButtonSound,
    } = this.props;
    const { giftId, playerChecked, comment } = this.state;

    const { player0, player1, player2 } = playerChecked;

    const selectedPlayerIds = [];
    if (player0 && players.player1) {
      selectedPlayerIds.push(players.player1.uid);
    }
    if (player1 && players.player2) {
      selectedPlayerIds.push(players.player2.uid);
    }
    if (player2 && players.player3) {
      selectedPlayerIds.push(players.player3.uid);
    }

    this.setState({ confirmationModal: false });

    if (selectedPlayerIds.length > 0 && giftId) {
      playButtonSound();

      sendGift(roomId, giftId, comment, selectedPlayerIds).then((res) => {
        if (res === 'success') {
          this.closeModal();
        }
      });
    }
  }

  closeModal = () => {
    const { toggle } = this.props;

    this.setState({
      giftId: '',
      comment: '',
      playerChecked: {
        player0: false,
        player1: false,
        player2: false,
      },
      allChecked: false,
    });

    toggle(null, false);
  }

  selectGift = (key) => {
    const { playButtonSound } = this.props;
    playButtonSound();

    this.setState({ giftId: key });
  }

  toggleConfirmModal = () => {
    const { gifts, playButtonSound } = this.props;
    const { giftId, playerChecked } = this.state;

    const gift = gifts[giftId];

    if (gift) {
      const { price } = gift;

      let totalPrice = 0;
      let selectedusersCount = 0;

      Object.keys(playerChecked).map((key) => {
        if (playerChecked[key]) {
          totalPrice += price;
          selectedusersCount += 1;
        }
        return null;
      });

      this.setState(prevState => ({
        giftNotSelected: false,
        totalPrice,
        selectedusersCount,
        confirmationModal: !prevState.confirmationModal,
      }));
    } else {
      this.setState(prevState => ({
        giftNotSelected: true,
        confirmationModal: !prevState.confirmationModal,
      }));
    }
  }


  render() {
    const {
      gifts,
      t,
      //  toggle,
      modalOpen,
      players,
      playButtonSound,
    } = this.props;

    const {
      playerChecked,
      allChecked,
      giftId,
      comment,
      confirmationModal,
      totalPrice,
      selectedusersCount,
      giftNotSelected,
    } = this.state;

    return (
      <div>
        <Modal size="lg" isOpen={modalOpen} toggle={this.closeModal} className="notification gift-modal">
          <ModalHeader toggle={() => { playButtonSound(); this.closeModal(); }}
            className="notification-header"
            close={
              <Media src={closeImg} className="notification-header-close" alt="X" onClick={() => { playButtonSound(); this.closeModal(); }} />
            }
          >
            <Media src={giftImg}/> {t('gifts.gifts')}
          </ModalHeader>
          <ModalBody className="notification-body">
            <Row>
              <div style={{flex: '0 0 78%', maxWidth: '78%', padding: '15px'}}>
                  {gifts && Object.keys(gifts).map(key => (
                    <Fragment key={key}>
                      <Gift
                        id={key}
                        giftId={giftId}
                        gift={gifts[key]}
                        selectGift={this.selectGift}
                      />

                      {/*  <Col sm="4" key={key} className="gifts-gift">
                      <Media src={gifts[key].image} className="gifts-gift-image" onClick={() => this.selectGift(key)} />
                      <div>
                        <Button
                          className={`${giftId === key ? ('gifts-gift-button-active') : ('gifts-gift-button')}`}
                          onClick={() => this.selectGift(key)}
                        >
                          <div className="gifts-gift-button-price">
                            {gifts[key].price}
                          </div>
                          <Media src={coinImg} className="gifts-gift-button-coin" />
                        </Button>
                      </div>
                    </Col>  */}
                    </Fragment>
                  ))}
              </div>
              <div style={{flex: '0 0 22%', maxWidth: '22%', padding: '15px', marginTop: '-15px'}}>

                {players && Object.keys(players).map((key, index) => (
                  <div key={key} className="gifts-player-row">
                    {players[key].name && (
                      <Fragment>
                        <div className="gifts-checkbox-wrapper">
                          <Label className="gifts-checkbox">
                            <Input
                              type="checkbox"
                              disabled={!players[key].name}
                              name={`player${index}`}
                              checked={playerChecked[`player${index}`]}
                              onChange={this.handleChange}
                            />
                            <span className="checkmark" style={{ marginLeft: 0 }} />
                          </Label>
                        </div>
                        <div className="gifts-player-image-wrapper">
                          <Media src={players[key].photo} className="gifts-player-image" />
                        </div>
                        <div className="gifts-player-name">
                          {players[key].name}
                        </div>
                      </Fragment>
                    )}
                  </div>
                ))}

                <div className="gifts-player-row">
                  <div className="gifts-checkbox-wrapper">
                    <Label className="gifts-checkbox">
                      <Input
                        className="gifts-checkbox"
                        type="checkbox"
                        name="allChecked"
                        checked={allChecked}
                        onChange={this.handleChange}
                      />
                      <span className="checkmark" style={{ marginLeft: 0 }} />
                    </Label>
                  </div>
                  <div className="gifts-player-name gifts-player-name-all">
                    {t('gifts.sendAll')}
                  </div>
                </div>

                <Row>
                  <Col sm="12" className="gifts-comment-wrapper"  style={{ fontSize: 10, paddingLeft: 0 }}>
                    <div className="gifts-comment-header">
                      {t('gifts.comment')}
                    </div>
                    <div className="gifts-comment-length">
                      {comment ? (
                        `${100 - comment.length}/100`
                      ) : (
                        '100/100'
                      )}
                    </div>
                    <Input
                      className="gifts-comment"
                      type="textarea"
                      name="comment"
                      value={comment}
                      onChange={this.handleChange}
                    />
                  </Col>
                </Row>
                <Row>
                  <Col sm="12">
                    <Button className="gifts-gift-button-type gifts-gift-button-buy" onClick={this.sendGift}>
                      {t('gifts.buy')}
                    </Button>
                  </Col>
                </Row>
              </div>
            </Row>
          </ModalBody>
        </Modal>

        <Modal isOpen={confirmationModal} toggle={this.toggleConfirmModal} className="notification gifts-send-confirmation">
          <ModalHeader
            toggle={this.toggleConfirmModal}
            className="notification-header"
            close={
              <Media src={closeImg} className="notification-header-close" alt="X" onClick={this.toggleConfirmModal} />
          }
          />
          <ModalBody className="notification-body">
            {giftNotSelected ? (
              'Izvēlies dāvanu'
            ) : (
              <Fragment>
                {selectedusersCount === 0 && (
                  'Izvēlies vismaz vienu dāvanas saņēmēju'
                )}
                {selectedusersCount === 1 && (
                  `Vai tiešām vēlies nosūtīt dāvanu? Kopējā cena būs ${totalPrice}`
                )}
                {selectedusersCount > 1 && (
                  `Vai tiešām vēlies nosūtīt dāvanas? Kopējā cena būs ${totalPrice}`
                )}
              </Fragment>
            )}
          </ModalBody>
          <ModalFooter className="notification-footer">
            {giftNotSelected ? (
              <Button type="button" className="btn notification-footer-button" onClick={this.toggleConfirmModal}>
                Aizvērt
              </Button>
            ) : (
              <Fragment>
                {selectedusersCount === 0 ? (
                  <Button type="button" className="btn notification-footer-button" onClick={this.toggleConfirmModal}>
                    Aizvērt
                  </Button>
                ) : (
                  <Fragment>
                    <Button className="btn notification-footer-button" onClick={this.sendGift}>
                      Jā
                    </Button>
                    <Button type="button" className="btn notification-footer-button" onClick={this.toggleConfirmModal}>
                      Nē
                    </Button>
                  </Fragment>
                )}
              </Fragment>
            )}
          </ModalFooter>
        </Modal>
      </div>
    );
  }
}

export default withTranslation('common')(SendGift);
