import React, { Fragment } from 'react';
import PropTypes from 'prop-types';

import { withTranslation } from 'react-i18next';
import ReactTableContainer from 'react-table-container';

import { Link } from 'react-router-dom';

/* import {
  Row,
  Col,
  Button,
  Media,
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
import ModalHeader from 'reactstrap/lib/ModalHeader';
import ModalBody from 'reactstrap/lib/ModalBody';
import ModalFooter from 'reactstrap/lib/ModalFooter';
import Dropdown from 'reactstrap/lib/Dropdown';
import DropdownToggle from 'reactstrap/lib/DropdownToggle';
import DropdownMenu from 'reactstrap/lib/DropdownMenu';
import DropdownItem from 'reactstrap/lib/DropdownItem';

import pro from '../../../images/icons/pro.svg';
import speed from '../../../images/icons/aatraa_istaba.svg';
import roomsImg from '../../../images/icons/search.png';
import closeImg from '../../../images/icons/close.png';
import keyImg from '../../../images/atslega.svg';
import { object } from 'firebase-functions/lib/providers/storage';

import playerJoinedSound from '../../../sounds/player_joined.wav';
// import buttonClickedSound from '../../../sounds/click_feedback.flac';

class RoomsTable extends React.Component {
  static propTypes = {
    rooms: PropTypes.shape(),
    joinedRooms: PropTypes.shape(),
    GameTypeMap: PropTypes.shape(),
    GameBetMap: PropTypes.shape(),
    joinRoom: PropTypes.func.isRequired,
    uid: PropTypes.string,
    level: PropTypes.number,
    t: PropTypes.func.isRequired,
    leaveRoom: PropTypes.func.isRequired,
    userSettings: PropTypes.shape().isRequired,
    playButtonSound: PropTypes.func.isRequired,
  }

  static defaultProps = {
    uid: '',
    level: null,
    rooms: {},
    joinedRooms: {},
  }

  constructor(props) {
    super(props);
    this.state = {
      joinRoomClicked: false,
      typeFilter: '-',
      betFilter: '-',
      rooms: [],
      joinedRoom: {},
      password: [],
      privateRoomConfirm: false,
      privateRoomConfirmError: '',
      privateRoomId: '',
      privateRoomPosition: '',
      prevRooms: {},
      gameTypeFilterOpen: false,
      gameBetFilterOpen: false,
      gameTypeFilterMap: null,
      gameBetFilterMap: null,
    };

    this.joinRoomClicked = this.joinRoomClicked.bind(this);
    this.toggleGameTypeFilter = this.toggleGameTypeFilter.bind(this);
    this.toggleGameBetFilter = this.toggleGameBetFilter.bind(this);

    this.digit2 = React.createRef();
    this.digit3 = React.createRef();
    this.digit4 = React.createRef();

    this.playerJoinedAudio = new Audio(playerJoinedSound);
  //  this.buttonClickedAudio = new Audio(buttonClickedSound);
  }

  _roomFilled(room) {
    return room.playersList
      && room.playersList.player1 && room.playersList.player1.uid
      && room.playersList.player2 && room.playersList.player2.uid
      && room.playersList.player3 && room.playersList.player3.uid;
  }

  componentDidMount() {
    const { rooms, myRooms, joinedRooms } = this.props;
    const {
      typeFilter,
      betFilter,
    } = this.state;

    const roomsArray = [];

    if (rooms) {
    //  this.state.prevRooms = { ...rooms };
      this.setState({ prevRooms: rooms });

      Object.keys(rooms).map((key) => {
        roomsArray.push({
          filled: this._roomFilled(rooms[key]),
          key,
          ...rooms[key],
        });
        return null;
      });

      if (roomsArray && roomsArray.length > 0) {
        let typeFilteredRooms = roomsArray;
        let betFilteredRooms = [];

        if (typeFilter === 'P') {
          typeFilteredRooms = roomsArray.filter(room => room.globalParams && room.globalParams.gameType === 'P' && !room.globalParams.smallGame);
        } else if (typeFilter === 'PM') {
          typeFilteredRooms = roomsArray.filter(room => room.globalParams && room.globalParams.gameType === 'P' && room.globalParams.smallGame);
        } else if (typeFilter === 'G') {
          typeFilteredRooms = roomsArray.filter(room => room.globalParams && room.globalParams.gameType === 'G' && !room.globalParams.smallGame);
        } else if (typeFilter === 'MG') {
          typeFilteredRooms = roomsArray.filter(room => room.globalParams && room.globalParams.gameType === 'G' && room.globalParams.smallGame);
        }

        if (!betFilter || betFilter === '-') {
          betFilteredRooms = typeFilteredRooms;
        } else {
          betFilteredRooms = typeFilteredRooms.filter(room => room.globalParams && room.globalParams.bet === betFilter);
        }

        this.setState({ rooms: betFilteredRooms });
      }
    }

    if (myRooms) {
      let joinedRoom;

      if (joinedRooms) {
        Object.keys(joinedRooms).map((joinedRoomKey) => {
          joinedRoom = { ...myRooms[joinedRoomKey], key: joinedRoomKey } || null;
          return null;
        });
      }

      this.setState({ joinedRoom });
    }
  }

  componentWillReceiveProps(nextProps, nextState) {
    const { t, rooms, myRooms, joinedRooms, userSettings, GameTypeMap, GameBetMap } = nextProps;
    const { joinedRoom: prevJoinedRoom } = nextState;

    const {
      typeFilter,
      betFilter,
      privateRoomId,
      gameTypeFilterMap,
      gameBetFilterMap,
    } = this.state;

    if (!gameTypeFilterMap || !gameBetFilterMap) {
      const gameTypeFilterMap = {'-': t('common.all'), ...GameTypeMap};
      const gameBetFilterMap = {'-': t('common.all'), ...GameBetMap};

      this.setState({ gameTypeFilterMap, gameBetFilterMap });
    }

    this.filterRooms(rooms, null, null);

    /*
    if (Object.keys(rooms).length > 0 || Object.keys(this.state.prevRooms).length > 0) {
      if (privateRoomId) {
        const joinedPrivateRoom = rooms[privateRoomId];

        if (!joinedPrivateRoom) {
          this.setState({
            password: [], privateRoomConfirm: false, privateRoomId: '', privateRoomPosition: '', privateRoomConfirmError: '',
          });
        }
      }

      const exRooms = {};
      const newRooms = { ...rooms };

      for (const roomKey in this.state.prevRooms) {
        if (!rooms[roomKey]) {
          exRooms[roomKey] = this.state.prevRooms[roomKey];
          exRooms[roomKey].removal = true;

          this.timeoutID = setTimeout(() => {
            const { prevRooms } = this.state;
            delete prevRooms[roomKey];

            this.setState({
              rooms: this.state.rooms.filter(_room => _room.key !== roomKey),
              prevRooms,
            });
          }, 2000);
        } else {
          exRooms[roomKey] = rooms[roomKey];
          exRooms[roomKey].removal = this._roomFilled(rooms[roomKey]);
        }

        delete newRooms[roomKey];
      }

      const allRooms = { ...exRooms, ...newRooms };

      const roomsArray = [];

      Object.keys(allRooms).map((key) => {
        if (allRooms[key].filled === true) {
          return null;
        }

        roomsArray.push({
          filled: allRooms[key].removal || this._roomFilled(allRooms[key]),
          key,
          ...allRooms[key],
        });
        return null;
      });

      //  this.state.prevRooms = { ...allRooms };
      this.setState({ prevRooms: allRooms });

      if (roomsArray && roomsArray.length > 0) {
        let typeFilteredRooms = roomsArray;
        let betFilteredRooms = [];

        if (typeFilter === 'P') {
          typeFilteredRooms = roomsArray.filter(room => room.globalParams && room.globalParams.gameType === 'P' && !room.globalParams.smallGame);
        } else if (typeFilter === 'PM') {
          typeFilteredRooms = roomsArray.filter(room => room.globalParams && room.globalParams.gameType === 'P' && room.globalParams.smallGame);
        } else if (typeFilter === 'G') {
          typeFilteredRooms = roomsArray.filter(room => room.globalParams && room.globalParams.gameType === 'G' && !room.globalParams.smallGame);
        } else if (typeFilter === 'MG') {
          typeFilteredRooms = roomsArray.filter(room => room.globalParams && room.globalParams.gameType === 'G' && room.globalParams.smallGame);
        }

        if (!betFilter || betFilter === '-') {
          betFilteredRooms = typeFilteredRooms;
        } else {
          betFilteredRooms = typeFilteredRooms.filter(room => room.globalParams && room.globalParams.bet === betFilter);
        }

        this.setState({ rooms: betFilteredRooms });
      }
    } */

    if (myRooms) {
      let joinedRoom;


      if (joinedRooms) {
        Object.keys(joinedRooms).map((joinedRoomKey) => {
          if (myRooms[joinedRoomKey]) {
            joinedRoom = {
              filled: this._roomFilled(myRooms[joinedRoomKey]),
              key: joinedRoomKey,
              ...myRooms[joinedRoomKey],
            };
          }
          return null;
        });
      }

      if(userSettings && userSettings.soundOn) {
        if(this.state.joinedRoom && this.state.joinedRoom.playersList && joinedRoom && joinedRoom.playersList){
          const prevPl = this.state.joinedRoom.playersList.playerList;
          const newPl = joinedRoom.playersList.playerList;

          if(!prevPl && newPl){
          //  this.playerJoinedAudio.play();
          }else if(prevPl && newPl && Object.keys(prevPl).length < Object.keys(newPl).length){
          //  this.playerJoinedAudio.play();
          }
        }
      }

      this.setState({ joinedRoom });
    }
  }

componentWillUnmount() {
  if(this.timeoutID) clearTimeout(this.timeoutID);
}

filterRooms = (rooms, passedTypeFilter, passedBetFilter) => {
//  console.log('filterRooms');
//  console.log(rooms);

  const {
    prevRooms,
    privateRoomId,
  } = this.state;

  let {
    typeFilter,
    betFilter,
  } = this.state;

//  console.log(passedTypeFilter);
//  console.log(passedBetFilter);

  if (passedTypeFilter) {
    typeFilter = passedTypeFilter;
  }

  if (passedBetFilter) {
    betFilter = passedBetFilter;
  }

//  console.log(typeFilter);
//  console.log(betFilter);

  if (Object.keys(rooms).length > 0 || Object.keys(prevRooms).length > 0) {
    if (privateRoomId) {
      const joinedPrivateRoom = rooms[privateRoomId];

      if (!joinedPrivateRoom) {
        this.setState({
          password: [], privateRoomConfirm: false, privateRoomId: '', privateRoomPosition: '', privateRoomConfirmError: '',
        });
      }
    }

    const exRooms = {};
    const newRooms = { ...rooms };

    for (const roomKey in prevRooms) {
      if (!rooms[roomKey]) {
        exRooms[roomKey] = prevRooms[roomKey];
        exRooms[roomKey].removal = true;

        this.timeoutID = setTimeout(() => {
          const { prevRooms: prevRooms2 } = this.state;
          delete prevRooms2[roomKey];

          this.setState({
            rooms: this.state.rooms.filter(_room => _room.key !== roomKey),
            prevRooms: prevRooms2,
          });
        }, 2000);
      } else {
        exRooms[roomKey] = rooms[roomKey];
        exRooms[roomKey].removal = this._roomFilled(rooms[roomKey]);
      }

      delete newRooms[roomKey];
    }

    const allRooms = { ...exRooms, ...newRooms };

    const roomsArray = [];

    Object.keys(allRooms).map((key) => {
      if (allRooms[key].filled === true) {
        return null;
      }

      roomsArray.push({
        filled: allRooms[key].removal || this._roomFilled(allRooms[key]),
        key,
        ...allRooms[key],
      });
      return null;
    });

    //  this.state.prevRooms = { ...allRooms };
    this.setState({ prevRooms: allRooms });

    if (roomsArray && roomsArray.length > 0) {
      let typeFilteredRooms = roomsArray;
      let betFilteredRooms = [];

      if (typeFilter === 'P') {
        typeFilteredRooms = roomsArray.filter(room => room.globalParams && room.globalParams.gameType === 'P' && !room.globalParams.smallGame);
      } else if (typeFilter === 'PM') {
        typeFilteredRooms = roomsArray.filter(room => room.globalParams && room.globalParams.gameType === 'P' && room.globalParams.smallGame);
      } else if (typeFilter === 'G') {
        typeFilteredRooms = roomsArray.filter(room => room.globalParams && room.globalParams.gameType === 'G' && !room.globalParams.smallGame);
      } else if (typeFilter === 'MG') {
        typeFilteredRooms = roomsArray.filter(room => room.globalParams && room.globalParams.gameType === 'G' && room.globalParams.smallGame);
      }

      if (!betFilter || betFilter === '-') {
        betFilteredRooms = typeFilteredRooms;
      } else {
        betFilteredRooms = typeFilteredRooms.filter(room => room.globalParams && room.globalParams.bet === betFilter);
      }

      this.setState({ rooms: betFilteredRooms });
    }
  }
}

  filterType = (gameTypeKey) => {
    console.log('filterType');
    console.log(gameTypeKey);
    /*if (e.target) {
      if (e.target.value) {
        this.setState({ typeFilter: e.target.value });
      } else {
        this.setState({ typeFilter: '-' });
      }
    }*/
    const { playButtonSound, rooms } = this.props;
    playButtonSound();

    this.setState({ typeFilter: gameTypeKey });

    console.log('rooms');
    console.log(rooms);

    this.filterRooms(rooms, gameTypeKey, null);
  }

  filterBet = (betKey) => {
    /*if (e.target) {
      if (e.target.value) {
        this.setState({ betFilter: e.target.value });
      } else {
        this.setState({ betFilter: '-' });
      }
    }*/
    const { playButtonSound, rooms } = this.props;
    playButtonSound();

    this.setState({ betFilter: betKey });

    this.filterRooms(rooms, null, betKey);
  }

  closePrivateRoomEnter = () => {
    this.setState({
      password: [], privateRoomConfirm: false, privateRoomId: '', privateRoomPosition: '', privateRoomConfirmError: '',
    });
  }

  handleChangeDigit = (e) => {
    const { password } = this.state;

    if (e.target) {
      const { value, name } = e.target;

      const newVal = value.charAt(value.length - 1);

      if (!isNaN(newVal) || !newVal) {
        password[name] = newVal;

        if (newVal) {
          if (name === 0 || name === '0') {
            if (this.digit2) {
              this.digit2.current.focus();
            }
          }
          if (name === 1 || name === '1') {
            if (this.digit3) {
              this.digit3.current.focus();
            }
          }
          if (name === 2 || name === '2') {
            if (this.digit4) {
              this.digit4.current.focus();
            }
          }
        }

        this.setState({
          password,
        });
      }
    }
  }

  joinPrivateRoomConfirm = (roomId, position) => {
    this.setState({
      privateRoomConfirm: true,
      privateRoomId: roomId,
      privateRoomPosition: position,
      privateRoomConfirmError: '',
    });
  }

  joinPrivateRoomClicked = () => {
    const { joinRoom, playButtonSound } = this.props;
    const { privateRoomId, privateRoomPosition, password } = this.state;

    if (password && password.length === 4) {
      this.setState({ joinRoomClicked: true });

      const passString = password.join('');

      playButtonSound();

      joinRoom({ roomId: privateRoomId, position: privateRoomPosition, password: passString }).then((res) => {
        if (res && res.status === 'success') {
          this.setState({ privateRoomConfirm: false });
        } else if (res && res.status === 'error') {
          if (res.error === 'wrong password') {
            this.setState({ privateRoomConfirmError: 'Nepareizs kods' });
          } else if (res.error === 'room closed') {
            this.setState({ privateRoomConfirmError: 'Istaba ir aizvērta' });
          } else if (res.error === 'position taken') {
            this.setState({ privateRoomConfirmError: 'Vieta aizņemta' });
          } else {
            this.setState({ privateRoomConfirmError: 'Radās kļūda pievienojoties, mēģini vēlreiz' });
          }
        }
      });

      setTimeout(() => {
        this.setState({ joinRoomClicked: false });
      //  this.closePrivateRoomPassword();
      }, 750);
    } else {
      console.log('no password');
    }
  }

  showPrivateRoomPassword = () => {
    const { privateRoomPassword } = this.props;

    if (privateRoomPassword) {
      this.setState({
        showPrivateRoomPassword: true,
      });
    }
  }

  closePrivateRoomPassword = () => {
    this.setState({
      showPrivateRoomPassword: false,
    });
  }


  joinRoomClicked(roomId, position) {
    const { joinRoom, rooms, playButtonSound } = this.props;
    let bet = null;
    if (rooms[roomId] && rooms[roomId].globalParams) {
      bet = rooms[roomId].globalParams.bet;
    }

    this.setState({ joinRoomClicked: true });
    playButtonSound();

    joinRoom({ roomId, position, password: '', bet });

    setTimeout(() => {
      this.setState({ joinRoomClicked: false });
    }, 750);
  }

  toggleGameTypeFilter() {
    this.setState(prevState => ({
      gameTypeFilterOpen: !prevState.gameTypeFilterOpen,
    }));
  }

  toggleGameBetFilter() {
    this.setState(prevState => ({
      gameBetFilterOpen: !prevState.gameBetFilterOpen,
    }));
  }

//  playButtonSound = () => {
  //  const { userSettings } = this.props;

  //  if (userSettings && userSettings.soundOn) {
  //    this.buttonClickedAudio.play();
  //  }
//  }


  render() {
    const {
      uid, t, level, leaveRoom, privateRoomPassword,
    //  GameTypeMap, GameBetMap
    } = this.props;

  //  const gameTypeFilterMap = {'-': t('common.all'), ...GameTypeMap};
  //  const gameBetFilterMap = {'-': t('common.all'), ...GameBetMap};


    const {
      joinRoomClicked,
      typeFilter,
      betFilter,
      rooms,
      privateRoomConfirm,
      privateRoomConfirmError,
      password,
      joinedRoom,
      showPrivateRoomPassword,
      gameTypeFilterOpen,
      gameBetFilterOpen,
      gameTypeFilterMap,
      gameBetFilterMap,
    } = this.state;

    let digitsArr = [];

    if (showPrivateRoomPassword && privateRoomPassword) {
    //  const digits = privateRoomPassword.toString().split('');
      digitsArr = privateRoomPassword.toString().split('').map(Number);
    }

    return (
      <div className="rooms-table">
        <div className="rooms-table-header">
          <Row>
            <Col sm="5">
              <Media src={roomsImg} className="rooms-table-header-image" />
              <div className="rooms-table-header-text">
                {t('roomsTable.chooseRoom')}
              </div>
            </Col>

            {/*
            <Col className="rooms-table-select-type">
              <Input type="select" className="rooms-table-select" value={typeFilter} onChange={this.filterType}>
                <option disabled hidden value="-">Spēles veids</option>
                <option value="-">Visi</option>
                <option value="P">P</option>
                <option value="PM">PM</option>
                <option value="G">G</option>
                <option value="MG">MG</option>
              </Input>
            </Col>*/}

            <Col className="rooms-table-select-type">
              {gameTypeFilterMap && (
                <Dropdown isOpen={gameTypeFilterOpen} toggle={this.toggleGameTypeFilter}>
                  <DropdownToggle caret>
                      {typeFilter == "-" ? t('common.gameType') : gameTypeFilterMap[typeFilter]}
                    </DropdownToggle>
                  <DropdownMenu>
                    {Object.keys(gameTypeFilterMap).map((gtKey) => {
                      return <DropdownItem key={gtKey} onClick={(e) => {this.filterType(gtKey)}}>{gameTypeFilterMap[gtKey]}</DropdownItem>
                    })}
                  </DropdownMenu>
                </Dropdown>
              )}
            </Col>

            <Col className="rooms-table-select-bet">
              {gameBetFilterMap && (
                <Dropdown isOpen={gameBetFilterOpen} toggle={this.toggleGameBetFilter}>
                  <DropdownToggle caret>
                      {betFilter == "-" ? t('common.bet') : gameBetFilterMap[betFilter]}
                    </DropdownToggle>
                  <DropdownMenu>
                    {Object.keys(gameBetFilterMap).map((bKey) => {
                      if(level && level >= 3 && (bKey == "1:1" || bKey == "1:5")){
                        return null;
                      }
                      return <DropdownItem key={bKey} onClick={(e) => {this.filterBet(bKey)}}>{gameBetFilterMap[bKey]}</DropdownItem>;
                    })}
                  </DropdownMenu>
              </Dropdown>
              )}

              {/*}
              <Input type="select" className="rooms-table-select" value={betFilter} onChange={this.filterBet}>
                <option disabled hidden value="-">Likme</option>
                <option value="-">Visi</option>
                {level && level < 3 && (
                  <Fragment>
                    <option value="1:1">1:1</option>
                    <option value="1:5">1:5</option>
                  </Fragment>
                )}
                <option value="1:10">1:10</option>
                <option value="1:25">1:25</option>
                <option value="1:50">1:50</option>
                <option value="1:100">1:100</option>
                <option value="1:500">1:500</option>
                <option value="1:1000">1:1000</option>
                <option value="1:5000">1:5000</option>
                <option value="1:10000">1:10000</option>
                </Input>*/}
            </Col>
          </Row>
        </div>
        <ReactTableContainer
          style={{paddingRight: '15px'}}
          width="100%"
          height="332px"
          scrollbarStyle={{
            background: {
              background: 'transparent',
              width: 1,
              marginRight: 3,
            },

            backgroundFocus: {
              background: 'transparent',
              width: 1,
              marginRight: 3,
            },
            foreground: {
              background: 'fff',
              width: 4,
              left: -1,
            },

            foregroundFocus: {
              background: 'fff',
              width: 4,
              left: -1,
            },
          }}
        >
          <table className="rooms-table-table" style={{ width: '100%' }}>
            <colgroup>
              <col span="1" className="" />
            </colgroup>
            <thead>
              <tr>
                <th style={{ width: '9%' }} />
                <th style={{ width: '5%' }} />
                <th style={{ width: '7%' }} />
                <th style={{ width: '5%' }} />
                <th style={{ width: '5%' }} />
                <th style={{ width: '23%' }} />
                <th style={{ width: '23%' }} />
                <th style={{ width: '23%' }} />
              </tr>
            </thead>
            <tbody className="rooms-table-body">
              {joinedRoom && joinedRoom.key && joinedRoom.globalParams
                && joinedRoom.playersList && (
                <tr key={joinedRoom.key} className="rooms-table-row rooms-table-row-joined">
                  <td className="rooms-table-col">
                    {joinedRoom.globalParams.bet}
                  </td>
                  <td className="rooms-table-col">
                    {joinedRoom.globalParams.gameType === 'P' ? (
                      <Fragment>
                        {joinedRoom.globalParams.smallGame ? (
                          <div className="gameType">
                            <p className="gameType-text">
                            PM
                            </p>
                          </div>
                        ) : (
                          <div className="gameType">
                            <p className="gameType-text">
                            P
                            </p>
                          </div>
                        )}
                      </Fragment>
                    ) : (
                      <Fragment>
                        {joinedRoom.globalParams.smallGame ? (
                          <div className="gameType">
                            <p className="gameType-text">
                            MG
                            </p>
                          </div>
                        ) : (
                          <div className="gameType">
                            <p className="gameType-text">
                            G
                            </p>
                          </div>
                        )}
                      </Fragment>
                    )}
                  </td>
                  <td className="rooms-table-col">
                    {joinedRoom.globalParams.privateRoom && (
                    <Fragment>
                      <Media className="label-private" src={keyImg} alt="Privāta" />
                    </Fragment>
                    )}
                  </td>
                  <td className="rooms-table-col" style={{ padding: 0, paddingTop: 5, paddingLeft: 10 }}>
                    {joinedRoom.globalParams.fastGame && (
                    <Fragment>
                      <Media className="label-speed" src={speed} alt="Ātrā" />
                    </Fragment>
                    )}
                  </td>
                  <td className="rooms-table-col">
                    {joinedRoom.globalParams.proGame && (
                    <Fragment>
                      <Media className="label-pro" src={pro} alt="Pro" />
                    </Fragment>
                    )}
                  </td>

                  {joinedRoom.playersList && ['player1', 'player2', 'player3'].map((pkey) => {
                    return (
                      <td key={`rtc-${pkey}`} className="rooms-table-col">
                        {joinedRoom.playersList[pkey] ? (
                        <div className="rooms-table-player">
                          <div className="rooms-table-player-lvl">
                            <div className="rooms-table-player-lvl-text">
                              {`${joinedRoom.playersList[pkey].lvl || 1}`}
                            </div>
                          </div>
                          <div className="rooms-table-player-name">
                            {`${joinedRoom.playersList[pkey].shortName || joinedRoom.playersList[pkey].name}`}
                          </div>
                        </div>) :
                        (t('roomsTable.waiting'))}
                      </td>
                    )
                    })}

                    <td className="rooms-table-col">
                      {((joinedRoom.playersList.player1 && joinedRoom.playersList.player1.uid === uid) ||
                      (joinedRoom.playersList.player2 && joinedRoom.playersList.player2.uid === uid) ||
                      (joinedRoom.playersList.player3 && joinedRoom.playersList.player3.uid === uid))
                      && (
                      <Fragment>
                        {joinedRoom.playersList.player1 && joinedRoom.playersList.player2 && joinedRoom.playersList.player3 ? (
                          <Link to={`/zole/${joinedRoom.key}`} className="join-room-button button btn">
                            {t('roomsTable.return')}
                          </Link>
                        ) : (
                          <Button disabled={joinedRoom.filled} className="join-room-button join-room-button-alreadyJoined" onClick={() => leaveRoom(joinedRoom.key)}>
                            {t('roomsTable.leave')}
                          </Button>
                        )}
                      </Fragment>
                      )}
                    </td>

                  {/*

                  <td className="rooms-table-col">
                    {joinedRoom.playersList && joinedRoom.playersList.player1 ? (
                      <Fragment>
                        {joinedRoom.playersList.player1.uid === uid ? (
                          <Fragment>
                            {joinedRoom.playersList.player1 && joinedRoom.playersList.player2 && joinedRoom.playersList.player3 ? (
                              <Link to={`/zole/${joinedRoom.key}`} className="join-room-button button btn">
                                {t('roomsTable.return')}
                              </Link>
                            ) : (
                              <Button disabled={joinedRoom.filled} className="join-room-button join-room-button-alreadyJoined" onClick={() => leaveRoom(joinedRoom.key)}>
                              Iziet
                              </Button>
                            )}
                          </Fragment>
                        ) : (
                          <div className="rooms-table-player">
                            <div className="rooms-table-player-lvl">
                              <div className="rooms-table-player-lvl-text">
                                {`${joinedRoom.playersList.player1.lvl || 1}`}
                              </div>
                            </div>
                            <div className="rooms-table-player-name">
                              {`${joinedRoom.playersList.player1.shortName || joinedRoom.playersList.player1.name}`}
                            </div>
                          </div>
                        )}
                      </Fragment>
                    ) : (
                      <div>
                        {joinedRoom.playersList && ((joinedRoom.playersList.player2
                    && joinedRoom.playersList.player2.uid === uid)
                    || (joinedRoom.playersList.player3
                    && joinedRoom.playersList.player3.uid === uid)) ? (
                      <div className="rooms-table-player-name">
                        {t('roomsTable.alreadyJoined')}
                      </div>
                          ) : (
                            <Fragment>
                              {joinedRoom.globalParams.privateRoom ? (
                                <Button className="join-room-button" disabled={joinRoomClicked} onClick={() => this.joinPrivateRoomConfirm(joinedRoom.key, 'player1')}>
                                  {t('roomsTable.join')}
                                </Button>
                              ) : (
                                <Button className="join-room-button" disabled={joinRoomClicked} onClick={() => this.joinRoomClicked(joinedRoom.key, 'player1')}>
                                  {t('roomsTable.join')}
                                </Button>
                              )}
                            </Fragment>
                          )}
                      </div>
                    )}
                  </td>
                  <td className="rooms-table-col">
                    {joinedRoom.playersList && joinedRoom.playersList.player2 ? (
                      <Fragment>
                        {joinedRoom.playersList.player2.uid === uid ? (
                          <Fragment>
                            {joinedRoom.playersList.player1 && joinedRoom.playersList.player2 && joinedRoom.playersList.player3 ? (
                              <Link to={`/zole/${joinedRoom.key}`} className="join-room-button button btn">
                                {t('roomsTable.return')}
                              </Link>
                            ) : (
                              <Button disabled={joinedRoom.filled} className="join-room-button join-room-button-alreadyJoined" onClick={() => leaveRoom(joinedRoom.key)}>
                              Iziet
                              </Button>
                            )}
                          </Fragment>
                        ) : (
                          <div className="rooms-table-player">
                            <div className="rooms-table-player-lvl">
                              <div className="rooms-table-player-lvl-text">
                                {`${joinedRoom.playersList.player2.lvl || 1}`}
                              </div>
                            </div>
                            <div className="rooms-table-player-name">
                              {`${joinedRoom.playersList.player2.shortName || joinedRoom.playersList.player2.name}`}
                            </div>
                          </div>
                        )}
                      </Fragment>
                    ) : (
                      <div>
                        {joinedRoom.playersList && ((joinedRoom.playersList.player1
                    && joinedRoom.playersList.player1.uid === uid)
                    || (joinedRoom.playersList.player3
                      && joinedRoom.playersList.player3.uid === uid)) ? (
                        <div className="rooms-table-player-name">
                          {t('roomsTable.alreadyJoined')}
                        </div>
                          ) : (
                            <Fragment>
                              {joinedRoom.globalParams.privateRoom ? (
                                <Button className="join-room-button" disabled={joinRoomClicked} onClick={() => this.joinPrivateRoomConfirm(joinedRoom.key, 'player2')}>
                                  {t('roomsTable.join')}
                                </Button>
                              ) : (
                                <Button className="join-room-button" disabled={joinRoomClicked} onClick={() => this.joinRoomClicked(joinedRoom.key, 'player2')}>
                                  {t('roomsTable.join')}
                                </Button>
                              )}
                            </Fragment>
                          )}
                      </div>
                    )}
                  </td>
                  <td className="rooms-table-col">
                    {joinedRoom.playersList && joinedRoom.playersList.player3 ? (
                      <Fragment>
                        {joinedRoom.playersList.player3.uid === uid ? (
                          <Fragment>
                            {joinedRoom.playersList.player1 && joinedRoom.playersList.player2 && joinedRoom.playersList.player3 ? (
                              <Link to={`/zole/${joinedRoom.key}`} className="join-room-button button btn">
                                {t('roomsTable.return')}
                              </Link>
                            ) : (
                              <Button disabled={joinedRoom.filled} className="join-room-button join-room-button-alreadyJoined" onClick={() => leaveRoom(joinedRoom.key)}>
                              Iziet
                              </Button>
                            )}
                          </Fragment>
                        ) : (
                          <div className="rooms-table-player">
                            <div className="rooms-table-player-lvl">
                              <div className="rooms-table-player-lvl-text">
                                {`${joinedRoom.playersList.player3.lvl || 1}`}
                              </div>
                            </div>
                            <div className="rooms-table-player-name">
                              {`${joinedRoom.playersList.player3.shortName || joinedRoom.playersList.player3.name}`}
                            </div>
                          </div>
                        )}
                      </Fragment>
                    ) : (
                      <div>
                        {joinedRoom.playersList && ((joinedRoom.playersList.player1
                    && joinedRoom.playersList.player1.uid === uid)
                    || (joinedRoom.playersList.player2
                    && joinedRoom.playersList.player2.uid === uid)) ? (
                      <div className="rooms-table-player-name">
                        {t('roomsTable.alreadyJoined')}
                      </div>
                          ) : (
                            <Fragment>
                              {joinedRoom.globalParams.privateRoom ? (
                                <Button className="join-room-button" disabled={joinRoomClicked} onClick={() => this.joinPrivateRoomConfirm(joinedRoom.key, 'player3')}>
                                  {t('roomsTable.join')}
                                </Button>
                              ) : (
                                <Button className="join-room-button" disabled={joinRoomClicked} onClick={() => this.joinRoomClicked(joinedRoom.key, 'player3')}>
                                  {t('roomsTable.join')}
                                </Button>
                              )}
                            </Fragment>
                          )}
                      </div>
                    )}
                   </td>*/}

                </tr>
              )}
              {rooms && rooms.length > 0 && rooms.map((room) => {
                if (joinedRoom && joinedRoom.key && joinedRoom.globalParams && joinedRoom.playersList && room.key === joinedRoom.key) {
                  return null;
                }
                return (
                  <Fragment key={`${room.key}_frag`}>
                    {(room.globalParams && room.playersList) && (
                      <tr key={room.key} data-roomkey={room.key} style={room.removal ? { opacity: 0 } : { opacity: 1 }} className="rooms-table-row">
                        <td className="rooms-table-col">
                          {room.globalParams.bet}
                        </td>
                        <td className="rooms-table-col">
                          {room.globalParams.gameType === 'P' ? (
                            <Fragment>
                              {room.globalParams.smallGame ? (
                                <div className="gameType">
                                  <p className="gameType-text">
                                  PM
                                  </p>
                                </div>
                              ) : (
                                <div className="gameType">
                                  <p className="gameType-text">
                                  P
                                  </p>
                                </div>
                              )}
                            </Fragment>
                          ) : (
                            <Fragment>
                              {room.globalParams.smallGame ? (
                                <div className="gameType">
                                  <p className="gameType-text">
                                  MG
                                  </p>
                                </div>
                              ) : (
                                <div className="gameType">
                                  <p className="gameType-text">
                                  G
                                  </p>
                                </div>
                              )}
                            </Fragment>
                          )}
                        </td>
                        <td className="rooms-table-col pri">
                          {room.globalParams.privateRoom && (
                          <Fragment>
                            <Media className="label-private" src={keyImg} alt="Privāta" />
                          </Fragment>
                          )}
                        </td>
                        <td className="rooms-table-col" style={{ padding: 0, paddingTop: 5, paddingLeft: 10 }}>
                          {room.globalParams.fastGame && (
                          <Fragment>
                            <Media className="label-speed" src={speed} alt="Ātrā" />
                          </Fragment>
                          )}
                        </td>
                        <td className="rooms-table-col">
                          {room.globalParams.proGame && (
                          <Fragment>
                            <Media className="label-pro" src={pro} alt="Pro" />
                          </Fragment>
                          )}
                        </td>

                        {room.playersList && ['player1', 'player2', 'player3'].map((pkey) => {

                          return (
                            <td key={'rtc-'+pkey} className="rooms-table-col">
                              {room.playersList[pkey] ? (
                              <div className="rooms-table-player">
                                <div className="rooms-table-player-lvl">
                                  <div className="rooms-table-player-lvl-text">
                                    {`${room.playersList[pkey].lvl || 1}`}
                                  </div>
                                </div>
                                <div className="rooms-table-player-name">
                                  {`${room.playersList[pkey].shortName || room.playersList[pkey].name}`}
                                </div>
                              </div>) :
                              (t('roomsTable.waiting'))}
                            </td>
                          )
                        })}

                        <td className="rooms-table-col">

                            {(room.playersList.player1 && room.playersList.player1.uid === uid) ||
                             (room.playersList.player2 && room.playersList.player2.uid === uid) ||
                             (room.playersList.player3 && room.playersList.player3.uid === uid)
                            ? (
                            <Fragment>
                              {room.playersList.player1 && room.playersList.player2 && room.playersList.player3 ? (
                                <Link to={`/zole/${room.key}`} className="join-room-button button btn">
                                  {t('roomsTable.return')}
                                </Link>
                              ) : (
                                <Button disabled={room.filled} className="join-room-button join-room-button-alreadyJoined" onClick={() => leaveRoom(room.key)}>
                                  {t('roomsTable.leave')}
                                </Button>
                              )}
                            </Fragment>
                            ) : (
                            <Fragment>
                              {room.globalParams.privateRoom ? (
                                <Button disabled={joinRoomClicked ? true : (joinedRoom ? true : false)} color="link" className="join-room-button" onClick={() => this.joinPrivateRoomConfirm(room.key, 'player1')}>
                                  {t('roomsTable.join')}
                                </Button>
                              ) : (
                                <Button disabled={joinRoomClicked ? true : (joinedRoom ? true : false)} color="link" className="join-room-button" onClick={() => this.joinRoomClicked(room.key, 'player1')}>
                                  {t('roomsTable.join')}
                                </Button>
                              )}
                            </Fragment>
                            )}
                        </td>

                        {/*

                        <td className="rooms-table-col">
                          {room.playersList && room.playersList.player1 ? (
                            <Fragment>
                              {room.playersList.player1.uid === uid ? (
                                <Fragment>
                                  {room.playersList.player1 && room.playersList.player2 && room.playersList.player3 ? (
                                    <Link to={`/zole/${room.key}`} className="join-room-button button btn">
                                      {t('roomsTable.return')}
                                    </Link>
                                  ) : (
                                    <Button disabled={room.filled} className="join-room-button join-room-button-alreadyJoined" onClick={() => leaveRoom(room.key)}>
                                    Iziet
                                    </Button>
                                  )}
                                </Fragment>
                              ) : (
                                <div className="rooms-table-player">
                                  <div className="rooms-table-player-lvl">
                                    <div className="rooms-table-player-lvl-text">
                                      {`${room.playersList.player1.lvl || 1}`}
                                    </div>
                                  </div>
                                  <div className="rooms-table-player-name">
                                    {`${room.playersList.player1.shortName || room.playersList.player1.name}`}
                                  </div>
                                </div>
                              )}
                            </Fragment>
                          ) : (
                            <div>
                              {room.playersList && ((room.playersList.player2
                          && room.playersList.player2.uid === uid)
                          || (room.playersList.player3
                          && room.playersList.player3.uid === uid)) ? (
                            <div className="rooms-table-player-name">
                              {t('roomsTable.alreadyJoined')}
                            </div>
                                ) : (
                                  <Fragment>
                                    {room.globalParams.privateRoom ? (
                                      <Button disabled={joinRoomClicked ? true : (joinedRoom ? true : false)} color="link" className="join-room-button" onClick={() => this.joinPrivateRoomConfirm(room.key, 'player1')}>
                                        {t('roomsTable.join')}
                                      </Button>
                                    ) : (
                                      <Button disabled={joinRoomClicked ? true : (joinedRoom ? true : false)} color="link" className="join-room-button" onClick={() => this.joinRoomClicked(room.key, 'player1')}>
                                        {t('roomsTable.join')}
                                      </Button>
                                    )}
                                  </Fragment>
                                )}
                            </div>
                          )}
                        </td>
                        <td className="rooms-table-col">
                          {room.playersList && room.playersList.player2 ? (
                            <Fragment>
                              {room.playersList.player2.uid === uid ? (
                                <Fragment>
                                  {room.playersList.player1 && room.playersList.player2 && room.playersList.player3 ? (
                                    <Link to={`/zole/${room.key}`} className="join-room-button button btn">
                                      {t('roomsTable.return')}
                                    </Link>
                                  ) : (
                                    <Button disabled={room.filled} className="join-room-button join-room-button-alreadyJoined" onClick={() => leaveRoom(room.key)}>
                                    Iziet
                                    </Button>
                                  )}
                                </Fragment>
                              ) : (
                                <div className="rooms-table-player">
                                  <div className="rooms-table-player-lvl">
                                    <div className="rooms-table-player-lvl-text">
                                      {`${room.playersList.player2.lvl || 1}`}
                                    </div>
                                  </div>
                                  <div className="rooms-table-player-name">
                                    {`${room.playersList.player2.shortName || room.playersList.player2.name}`}
                                  </div>
                                </div>
                              )}
                            </Fragment>
                          ) : (
                            <div>
                              {room.playersList && ((room.playersList.player1
                          && room.playersList.player1.uid === uid)
                          || (room.playersList.player3
                            && room.playersList.player3.uid === uid)) ? (
                              <div className="rooms-table-player-name">
                                {t('roomsTable.alreadyJoined')}
                              </div>
                                ) : (
                                  <Fragment>
                                    {room.globalParams.privateRoom ? (
                                      <Button disabled={joinRoomClicked ? true : (joinedRoom ? true : false)}  color="link" className="join-room-button" onClick={() => this.joinPrivateRoomConfirm(room.key, 'player2')}>
                                        {t('roomsTable.join')}
                                      </Button>
                                    ) : (
                                      <Button disabled={joinRoomClicked ? true : (joinedRoom ? true : false)}  color="link" className="join-room-button" onClick={() => this.joinRoomClicked(room.key, 'player2')}>
                                        {t('roomsTable.join')}
                                      </Button>
                                    )}
                                  </Fragment>
                                )}
                            </div>
                          )}
                        </td>
                        <td className="rooms-table-col">
                          {room.playersList && room.playersList.player3 ? (
                            <Fragment>
                              {room.playersList.player3.uid === uid ? (
                                <Fragment>
                                  {room.playersList.player1 && room.playersList.player2 && room.playersList.player3 ? (
                                    <Link to={`/zole/${room.key}`} className="join-room-button button btn">
                                      {t('roomsTable.return')}
                                    </Link>
                                  ) : (
                                    <Button disabled={room.filled} className="join-room-button join-room-button-alreadyJoined" onClick={() => leaveRoom(room.key)}>
                                    Iziet
                                    </Button>
                                  )}
                                </Fragment>
                              ) : (
                                <div className="rooms-table-player">
                                  <div className="rooms-table-player-lvl">
                                    <div className="rooms-table-player-lvl-text">
                                      {`${room.playersList.player3.lvl || 1}`}
                                    </div>
                                  </div>
                                  <div className="rooms-table-player-name">
                                    {`${room.playersList.player3.shortName || room.playersList.player3.name}`}
                                  </div>
                                </div>
                              )}
                            </Fragment>
                          ) : (
                            <div>
                              {room.playersList && ((room.playersList.player1
                          && room.playersList.player1.uid === uid)
                          || (room.playersList.player2
                          && room.playersList.player2.uid === uid)) ? (
                            <div className="rooms-table-player-name">
                              {t('roomsTable.alreadyJoined')}
                            </div>
                                ) : (
                                  <Fragment>
                                    {room.globalParams.privateRoom ? (
                                      <Button disabled={joinRoomClicked ? true : (joinedRoom ? true : false)} color="link" className="join-room-button" onClick={() => this.joinPrivateRoomConfirm(room.key, 'player3')}>
                                        {t('roomsTable.join')}xx
                                      </Button>
                                    ) : (
                                      <Button disabled={joinRoomClicked ? true : (joinedRoom ? true : false)}  color="link" className="join-room-button" onClick={() => this.joinRoomClicked(room.key, 'player3')}>
                                        {t('roomsTable.join')}xx
                                      </Button>
                                    )}
                                  </Fragment>
                                )}
                            </div>
                          )}
                        </td>
                      */}
                      </tr>
                    )}
                  </Fragment>
                );
              })}
            </tbody>
          </table>
        </ReactTableContainer>
        <Modal isOpen={privateRoomConfirm} toggle={() => this.closePrivateRoomEnter()} className="notification">
          <ModalHeader
            className="notification-header"
            close={
              <Media src={closeImg} className="notification-header-close" alt="X" onClick={() => this.closePrivateRoomEnter()} />
            }
          >
            Ievadi privātas istabas kodu:
          </ModalHeader>
          <ModalBody className="notification-body" style={{ fontSize: 28 }}>
            <Row>
              <Col>
                {privateRoomConfirmError && (
                  <div className="room-password-error">
                    {privateRoomConfirmError}
                  </div>
                )}
              </Col>
            </Row>
            <Input
              className="room-password-digit"
              type="text"
              name={0}
              id="digit1"
            //  maxLength="1"
              value={password[0] || ''}
              onChange={this.handleChangeDigit}
              innerRef={(el) => { this.digit1 = el; }}
            />
            <Input
              className="room-password-digit"
            //  style={{ color: 'transparent', textShadow: '0 0 0 #000' }}
              type="text"
              name={1}
              id="digit2"
            //  maxLength="1"
              value={password[1] || ''}
              onChange={this.handleChangeDigit}
            //  ref={(el) => { this.digit2 = el; }}
              innerRef={this.digit2}
            />
            <Input
              className="room-password-digit"
              type="text"
              name={2}
              id="digit3"
            //  maxLength="1"
              value={password[2] || ''}
              onChange={this.handleChangeDigit}
            //  ref={(el) => { this.digit3 = el; }}
              innerRef={this.digit3}
            />
            <Input
              className="room-password-digit"
              type="text"
              name={3}
              id="digit4"
            //  maxLength="1"
              value={password[3] || ''}
              onChange={this.handleChangeDigit}
            //  ref={(el) => { this.digit4 = el; }}
              innerRef={this.digit4}
            />
          </ModalBody>
          <ModalFooter className="notification-footer">
            <Button type="button" className="btn notification-footer-button" onClick={() => this.joinPrivateRoomClicked()}>
              Ok
            </Button>
          </ModalFooter>
        </Modal>

        <Modal isOpen={showPrivateRoomPassword} toggle={() => this.closePrivateRoomPassword()} className="notification">
          <ModalHeader
            className="notification-header"
            close={
              <Media src={closeImg} className="notification-header-close" alt="X" onClick={() => this.closePrivateRoomPassword()} />
            }
          >
            Tavas privātās istabas kods:
          </ModalHeader>
          <ModalBody className="notification-body" style={{ fontSize: 28 }}>
            {digitsArr.map(digit => (
              <div className="room-password-digit">
                {digit}
              </div>
            ))}
          </ModalBody>
          <ModalFooter className="notification-footer">
            <Button type="button" className="btn notification-footer-button" onClick={() => this.closePrivateRoomPassword()}>
              Ok
            </Button>
          </ModalFooter>
        </Modal>
      </div>
    );
  }
}

export default withTranslation('common')(RoomsTable);
