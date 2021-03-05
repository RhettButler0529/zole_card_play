import React, { Fragment } from 'react';
import PropTypes from 'prop-types';

import { withTranslation } from 'react-i18next';

/* import {
  Row,
  Col,
  Button,
  Input,
  Label,
  Dropdown,
  DropdownMenu,
  DropdownToggle,
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
import Input from 'reactstrap/lib/Input';
import Label from 'reactstrap/lib/Label';
import Dropdown from 'reactstrap/lib/Dropdown';
import DropdownMenu from 'reactstrap/lib/DropdownMenu';
import DropdownToggle from 'reactstrap/lib/DropdownToggle';
import Modal from 'reactstrap/lib/Modal';
import ModalHeader from 'reactstrap/lib/ModalHeader';
import ModalBody from 'reactstrap/lib/ModalBody';
import ModalFooter from 'reactstrap/lib/ModalFooter';
import DropdownItem from 'reactstrap/lib/DropdownItem';

import closeImg from '../../../images/icons/close.png';
import proImg from '../../../images/Label-pro.png';
import speed from '../../../images/Label-speed.png';
import keyImg from '../../../images/atslega.svg';

// import buttonClickedSound from '../../../sounds/click_feedback.flac';

class NewGame extends React.Component {
  static propTypes = {
    createRoom: PropTypes.func.isRequired,
    lvl: PropTypes.number,
    privateRoomPassword: PropTypes.string,
    member: PropTypes.shape(),
    GameBetMap: PropTypes.shape(),
    t: PropTypes.func.isRequired,
    closePrivateRoomPassword: PropTypes.func.isRequired,
    userSettings: PropTypes.shape({
      parasta: PropTypes.bool,
      G: PropTypes.bool,
      atra: PropTypes.bool,
      pro: PropTypes.bool,
      maza: PropTypes.bool,
      privateRoom: PropTypes.bool,
      bet: PropTypes.string,
    }),
    toggleNewGameParameter: PropTypes.func.isRequired,
    setNewBet: PropTypes.func.isRequired,
    playButtonSound: PropTypes.func.isRequired,
  };

  static defaultProps = {
    lvl: null,
    userSettings: {},
    member: {},
    privateRoomPassword: null,
  };

  constructor(props) {
    super(props);
    this.state = {
      //  parasta: true,
      //  G: false,
      //  atra: false,
      //  pro: false,
      //  privateRoom: false,
      //  bet: '1:10',
      createRoomClicked: false,
      dropdownOpen: false,
      gameBetChoserOpen: false,
    };

    this.selectBet = this.selectBet.bind(this);
    this.toggleGameBetChoser = this.toggleGameBetChoser.bind(this);
    this.createRoomClicked = this.createRoomClicked.bind(this);

  //  this.buttonClickedAudio = new Audio(buttonClickedSound);
  }

  toggleParasta = () => {
    const { toggleNewGameParameter, member, playButtonSound } = this.props;

    playButtonSound();

    toggleNewGameParameter('parasta', member.uid);
    //  const { parasta } = this.state;
    //  if (parasta) {
    //    this.setState({ parasta: false, G: true });
    //  } else {
    //    this.setState({ parasta: true, G: false });
    //  }
  };

  toggleG = () => {
    const { toggleNewGameParameter, member, playButtonSound } = this.props;

    playButtonSound();

    toggleNewGameParameter('G', member.uid);
    //  const { G } = this.state;
    //  if (G) {
    //    this.setState({ parasta: true, G: false });
    //  } else {
    //    this.setState({ parasta: false, G: true });
    //  }
  };

  toggleAtra = () => {
    //  const { atra } = this.state;
    const { toggleNewGameParameter, member, playButtonSound } = this.props;

    playButtonSound();

    toggleNewGameParameter('atra', member.uid);
    //  if (atra) {
    //    this.setState({ atra: false });
    //  } else {
    //    this.setState({ atra: true });
    //  }
  };

  togglePro = () => {
    //  const { pro } = this.state;
    const { toggleNewGameParameter, member, playButtonSound } = this.props;

    playButtonSound();

    toggleNewGameParameter('pro', member.uid);
    //  if (pro) {
    //    this.setState({ pro: false });
    //  } else {
    //    this.setState({ pro: true });
    //  }
  };

  toggleSmall = () => {
    const { toggleNewGameParameter, member, playButtonSound } = this.props;

    playButtonSound();

    toggleNewGameParameter('maza', member.uid);
    //  const { maza } = this.state;
    //  if (maza) {
    //    this.setState({ maza: false });
    //  } else {
    //    this.setState({ maza: true });
    //  }
  };

  togglePrivate = () => {
    const { toggleNewGameParameter, userSettings, member, playButtonSound } = this.props;
    //  toggleNewGameParameter('privateRoom');
    const { privateRoom } = userSettings;

    playButtonSound();

    if (privateRoom) {
      this.setState({ privateRoomConfirm: false });
      toggleNewGameParameter('privateRoom', member.uid);
    } else {
      this.setState({ privateRoomConfirm: true });
    }
    //  if (privateRoom) {
    //    this.setState({ privateRoom: false });
    //  } else {
    //    this.setState({ privateRoom: true });
    //  }
  };

  confirmTogglePrivate = () => {
    const { toggleNewGameParameter, member, playButtonSound } = this.props;

    playButtonSound();

    toggleNewGameParameter('privateRoom', member.uid);
    this.setState({ privateRoomConfirm: false });
    //  const { privateRoom } = this.state;
    //  if (privateRoom) {
    //    this.setState({ privateRoom: false });
    //  } else {
    //    this.setState({ privateRoom: true });
    //  }
  };

  selectBet = newBet => {
    const { setNewBet, member, playButtonSound } = this.props;

    playButtonSound();

    setNewBet(newBet, member.uid);
    //  this.setState({ bet: e.target.value });
  };

  closePrivateConfirm = () => {
    this.setState({ privateRoomConfirm: false });
  };

  createRoomClicked = () => {
    const { createRoom, userSettings, playButtonSound } = this.props;
    const {
      //  parasta,
      //  G,
      //  atra,
      //  pro,
      //  maza,
      //  privateRoom,
      //  bet,
      createRoomClicked,
    } = this.state;

    const { parasta, G, atra, pro, maza, privateRoom, bet } = userSettings;

    if (!createRoomClicked) {
      this.setState({ createRoomClicked: true });

      playButtonSound();

      if (privateRoom) {
        //  this.setState({ privateRoomConfirm: true });
        createRoom(parasta, G, atra, pro, bet, maza, privateRoom);
      } else {
        createRoom(parasta, G, atra, pro, bet, maza, false);
      }

      setTimeout(() => {
        this.setState({ createRoomClicked: false });
      }, 1250);
    }
  };

  /*
  createPrivateRoom = () => {
    const { createRoom, userSettings } = this.props;
    const {
    //  parasta,
    //  G,
    //  atra,
    //  pro,
    //  maza,
    //  privateRoom,
    //  bet,
      createRoomClicked,
    } = this.state;

    const {
      parasta,
      G,
      atra,
      pro,
      maza,
      privateRoom,
      bet,
    } = userSettings;

    if (!createRoomClicked) {
      this.setState({ createRoomClicked: true });

      if (privateRoom) {
      //  createRoom(parasta, G, atra, pro, bet, maza, privateRoom);
      } else {
      //  createRoom(parasta, G, atra, pro, bet, maza, false);
      }

      this.setState({ privateRoomConfirm: false });

      setTimeout(() => {
        this.setState({ createRoomClicked: false });
      }, 1250);
    }
  } */

  toggle = () => {
    this.setState(prevState => ({ dropdownOpen: !prevState.dropdownOpen }));
  };

  toggleGameBetChoser() {
    this.setState(prevState => ({
      gameBetChoserOpen: !prevState.gameBetChoserOpen,
    }));
  }

  render() {
    const {
      lvl,
      t,
      privateRoomPassword,
      showPrivateRoomPassword,
      //  member,
      closePrivateRoomPassword,
      userSettings,
      joinedRoom,
      GameBetMap,
      //  toggleNewGameParameter,
    } = this.props;

    const {
      //  parasta,
      //  G,
      //  atra,
      //  maza,
      //  pro,
      //  privateRoom,
      //  bet,
      createRoomClicked,
      dropdownOpen,
      privateRoomConfirm,
      gameBetChoserOpen,
    } = this.state;

    let digitsArr = [];

    if (privateRoomPassword) {
      const digits = privateRoomPassword.toString().split('');
      digitsArr = digits.map(Number);
    }

    return (
      <Fragment>
        {joinedRoom && joinedRoom.globalParams ? (
          <div className="start-new-game">
            <Row>
              <Col sm="12" className="created-room">
                {t('newGame.activeRoom')}
              </Col>
            </Row>
            <Row>
              <Col sm={{ size: 10, offset: 1 }}>
                <div className="created-room-div">
                  {joinedRoom.globalParams.bet}
                </div>
                <div className="created-room-div">
                  {joinedRoom.globalParams.gameType === 'P' ? (
                    <Fragment>
                      {joinedRoom.globalParams.smallGame ? (
                        <div className="gameType">
                          <p className="gameType-text">PM</p>
                        </div>
                      ) : (
                        <div className="gameType">
                          <p className="gameType-text">P</p>
                        </div>
                      )}
                    </Fragment>
                  ) : (
                    <Fragment>
                      {joinedRoom.globalParams.smallGame ? (
                        <div className="gameType">
                          <p className="gameType-text">MG</p>
                        </div>
                      ) : (
                        <div className="gameType">
                          <p className="gameType-text">G</p>
                        </div>
                      )}
                    </Fragment>
                  )}
                </div>
                <div className="created-room-div">
                  {joinedRoom.globalParams.privateRoom && (
                    <Fragment>
                      <Media
                        className="label-private"
                        src={keyImg}
                        alt="Privāta"
                      />
                    </Fragment>
                  )}
                </div>
                <div
                  className="created-room-div"
                  style={{ padding: 0, paddingTop: 5, paddingLeft: 10 }}
                >
                  {joinedRoom.globalParams.fastGame && (
                    <Fragment>
                      <Media className="label-speed" src={speed} alt="Ātrā" />
                    </Fragment>
                  )}
                </div>
                <div className="created-room-div">
                  {joinedRoom.globalParams.proGame && (
                    <Fragment>
                      <Media className="label-pro" src={proImg} alt="Pro" />
                    </Fragment>
                  )}
                </div>
              </Col>
            </Row>
            {digitsArr &&
            digitsArr.length &&
            joinedRoom.globalParams.privateRoom ? (
              <Fragment>
                <Row className="created-room-code-title">
                  <Col>{t('newGame.password')}</Col>
                </Row>
                <div className="created-room-code">
                  {digitsArr.map(digit => (
                    <div key={`digit-${digit}`} className="room-password-digit">{digit}</div>
                  ))}
                </div>
              </Fragment>
            ) : (
              <div />
            )}
          </div>
        ) : (
          <div className="start-new-game">
            <Row>
              <Col sm="12" className="new-game">
                {t('newGame.newGame')}
              </Col>
            </Row>
            <Row>
              <div className="game-type-wrapper">
                <Row className="game-type-select">
                  <Col sm="12">{t('common.gameType')}</Col>
                </Row>
                <Row>
                  <Col sm="6">
                    <Label
                      className="game-type-input"
                      style={{ marginLeft: 28 }}
                    >
                      <Input
                        type="checkbox"
                        onClick={this.toggleParasta}
                        checked={userSettings.parasta}
                        readOnly
                      />
                      <span className="checkmark" style={{ marginLeft: 25 }} />
                      <div className="game-type-text">P</div>
                    </Label>
                  </Col>
                  <Col sm="6">
                    <Label
                      className="game-type-input"
                      style={{ marginLeft: 13 }}
                    >
                      <Input
                        type="checkbox"
                        onClick={this.toggleG}
                        checked={userSettings.G}
                        readOnly
                      />
                      <span className="checkmark" style={{ marginLeft: 10 }} />
                      <div className="game-type-text">G</div>
                    </Label>
                  </Col>
                  <Col sm="6">
                    <Label
                      className="game-type-input"
                      style={{ marginLeft: 28 }}
                    >
                      <Input
                        type="checkbox"
                        onClick={this.toggleAtra}
                        checked={userSettings.atra}
                        readOnly
                      />
                      <span className="checkmark" style={{ marginLeft: 25 }} />
                      <div className="game-type-text">
                        {t('newGame.fastGame')}
                      </div>
                    </Label>
                  </Col>
                  <Col sm="6">
                    <Label
                      className="game-type-input"
                      style={{ marginLeft: 13 }}
                    >
                      <Input
                        type="checkbox"
                        onClick={this.togglePro}
                        checked={userSettings.pro}
                        readOnly
                      />
                      <span className="checkmark" style={{ marginLeft: 10 }} />
                      <div className="game-type-text">
                        {t('newGame.proGame')}
                      </div>
                    </Label>
                  </Col>

                  <Col sm="6">
                    <Label
                      className="game-type-input"
                      style={{ marginLeft: 28 }}
                    >
                      <Input
                        type="checkbox"
                        onClick={this.toggleSmall}
                        checked={userSettings.maza}
                        readOnly
                      />
                      <span className="checkmark" style={{ marginLeft: 25 }} />
                      <div className="game-type-text">
                        {t('newGame.smallGame')}
                      </div>
                    </Label>
                  </Col>

                  <Col sm="6">
                    <Label
                      className="game-type-input"
                      style={{ marginLeft: 13 }}
                    >
                      <Input
                        type="checkbox"
                        onClick={this.togglePrivate}
                        checked={userSettings.privateRoom}
                        readOnly
                      />
                      <span className="checkmark" style={{ marginLeft: 10 }} />
                      <div className="game-type-text">{t('newGame.privateRoom')}</div>
                    </Label>
                  </Col>
                </Row>
              </div>
            </Row>
            {/*
            <div className="game-type-selected">
              <div className="game-type-selected-div">
                {userSettings.parasta ? (
                  <Fragment>
                    {userSettings.maza ? (
                      <div style={{ display: 'inline-block' }}>
                      PM
                      </div>
                    ) : (
                      <div style={{ display: 'inline-block' }}>
                      P
                      </div>
                    )}
                  </Fragment>
                ) : (
                  <Fragment>
                    {userSettings.maza ? (
                      <div style={{ display: 'inline-block' }}>
                      MG
                      </div>
                    ) : (
                      <div style={{ display: 'inline-block' }}>
                      G
                      </div>
                    )}
                  </Fragment>
                )}
              </div>


              {userSettings.privateRoom && (
              <div className="game-type-selected-div">
              + Privāta
              </div>
              )}


              {userSettings.atra && (
              <div className="game-type-selected-div">
              + Ātrā
              </div>
              )}


              {userSettings.pro && (
              <div className="game-type-selected-div">
              + Pro
              </div>
              )}
            </div>
            */}
            <Row className="sng-choose-bet">
              <Col>
                {/*
                <Input type="select" className="game-bet-select" value={userSettings.bet} onChange={this.selectBet}>
                  {lvl && lvl < 3 && (
                  <Fragment>
                    <option>1:1</option>
                    <option>1:5</option>
                  </Fragment>
                  )}
                  <option>1:10</option>
                  <option>1:25</option>
                  <option>1:50</option>
                  <option>1:100</option>
                  <option>1:500</option>
                  <option>1:1000</option>
                  <option>1:5000</option>
                  <option>1:10000</option>
                  </Input>*/}

                <div className="sng-choose-bet-label">
                  {t('common.bet')}
                </div>

                <Dropdown
                  className="small"
                  isOpen={gameBetChoserOpen}
                  toggle={this.toggleGameBetChoser}
                >
                  <DropdownToggle caret>
                    {GameBetMap[userSettings.bet]}
                  </DropdownToggle>
                  <DropdownMenu>
                    {Object.keys(GameBetMap).map(bKey => {
                      if (lvl && lvl >= 3 && (bKey == '1:1' || bKey == '1:5')) {
                        return null;
                      }
                      return (
                        <DropdownItem
                          key={bKey}
                          onClick={e => {
                            this.selectBet(bKey);
                          }}
                        >
                          {GameBetMap[bKey]}
                        </DropdownItem>
                      );
                    })}
                  </DropdownMenu>
                </Dropdown>
              </Col>
            </Row>
            <Row>
              <Button
                className="start-game-button"
                color="link"
                disabled={createRoomClicked}
                onClick={() => {
                  this.createRoomClicked();
                }}
              >
                {t('newGame.startGame')}
              </Button>
            </Row>
          </div>
        )}
        <Modal
          isOpen={privateRoomConfirm}
          toggle={() => this.closePrivateConfirm()}
          className="notification"
        >
          <ModalHeader
            className="notification-header"
            close={
              <Media
                src={closeImg}
                className="notification-header-close"
                alt="X"
                onClick={() => this.closePrivateConfirm()}
              />
            }
          />
          <ModalBody className="notification-body" style={{ fontSize: 18 }}>
            {t('newGame.privateRoomConfirm')}
          </ModalBody>
          <ModalFooter className="notification-footer">
            <Button
              className="btn notification-footer-button"
              onClick={this.confirmTogglePrivate}
            >
              {t('common.yes')}
            </Button>
            <Button
              type="button"
              className="btn notification-footer-button"
              onClick={() => this.closePrivateConfirm()}
            >
              {t('common.no')}
            </Button>
          </ModalFooter>
        </Modal>

        <Modal
          isOpen={!!showPrivateRoomPassword}
          toggle={() => closePrivateRoomPassword()}
          className="notification"
        >
          <ModalHeader
            className="notification-header"
            close={
              <Media
                src={closeImg}
                className="notification-header-close"
                alt="X"
                onClick={() => closePrivateRoomPassword()}
              />
            }
          >
            {t('newGame.yourPassword')}
          </ModalHeader>
          <ModalBody className="notification-body">
            {digitsArr.map(digit => (
              <div key={`digit2-${digit}`} className="room-password-digit">{digit}</div>
            ))}
          </ModalBody>
          <ModalFooter className="notification-footer">
            <Button
              type="button"
              className="btn notification-footer-button"
              onClick={() => closePrivateRoomPassword()}
            >
              {t('common.ok')}
            </Button>
          </ModalFooter>
        </Modal>

        <Row />
      </Fragment>
    );
  }
}

export default withTranslation('common')(NewGame);
