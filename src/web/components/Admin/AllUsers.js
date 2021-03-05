import React, { Fragment } from 'react';
import PropTypes from 'prop-types';

import ReactTableContainer from 'react-table-container';

import Moment from 'react-moment';
// import 'imrc-datetime-picker/dist/imrc-datetime-picker.min.css';
// import { DatetimePickerTrigger } from 'imrc-datetime-picker';
import moment from 'moment';

import ReactDateTime from 'react-datetime';
import 'react-datetime/css/react-datetime.css';

/* import {
  Col,
  Row,
  Form,
  Label,
  Input,
  Button,
  FormGroup,
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
import FormGroup from 'reactstrap/lib/FormGroup';
import Label from 'reactstrap/lib/Label';
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

class AllUsers extends React.Component {
  static propTypes = {
    member: PropTypes.shape({
      email: PropTypes.string,
    }),
    allUsers: PropTypes.shape({}),
    filteredUsers: PropTypes.shape({}),
    userBalanceHistory: PropTypes.shape({}),
    usersCount: PropTypes.number,
    deleteUser: PropTypes.func.isRequired,
    blockUser: PropTypes.func.isRequired,
    editUser: PropTypes.func.isRequired,
    fetchUsersRange: PropTypes.func.isRequired,
    fetchFilteredUsers: PropTypes.func.isRequired,
    fetchUserBalanceHistory: PropTypes.func.isRequired,
  }

  static defaultProps = {
    member: {},
    allUsers: {},
    filteredUsers: {},
    usersCount: 0,
    userBalanceHistory: {},
  }

  constructor(props) {
    super(props);
    this.state = {
      balance: 0,
      editUserId: null,
      openModal: false,
      currentPage: 0,
      pageSize: 50,
      blockUserId: null,
      openBlockModal: false,
      endDate: moment(),
      reason: '',
      //  userFilter: '',
      filteredUsers: null,
      filterType: 'lowerCaseName',
      filter: '',
      bilanceHistoryModalOpen: false,
      openDeleteConfirmation: false,
      deleteUserId: null,
    };

    this.openModal = this.openModal.bind(this);
    this.openModalBlock = this.openModalBlock.bind(this);
    this.toggle = this.toggle.bind(this);
    this.toggleBlock = this.toggleBlock.bind(this);
    this.editUser = this.editUser.bind(this);
    this.blockUser = this.blockUser.bind(this);
    this.handleChange = this.handleChange.bind(this);

    this.handleClick = this.handleClick.bind(this);
    this.changeEndDate = this.changeEndDate.bind(this);
  }

  componentWillMount() {
  //  const { fetchAllUsers } = this.props;

  //  fetchAllUsers();
  }

  componentWillReceiveProps = (nextProps) => {
    const nextFilteredUsers = nextProps.filteredUsers;
    const { filteredUsers } = this.props;

    if (filteredUsers && !nextFilteredUsers) {
      this.setState({ currentPage: 0, filteredUsers: null });
    } else if (nextFilteredUsers) {
      this.setState({ currentPage: 0, filteredUsers: nextFilteredUsers });
    }
  }

  componentWillUnmount = () => {
    const { fetchFilteredUsers } = this.props;

    fetchFilteredUsers('');
  }

  handleChange = (event) => {
    const value = event.target.type === 'checkbox' ? event.target.checked : event.target.value;

    this.setState({
      [event.target.name]: value,
    });
  }

  handleKeyPress = (target) => {
    if(target.charCode === 13) {
      this.filter();
    }
  }

  selectType = (e) => {
    this.setState({ filterType: e.target.value });
  }

  changeEndDate = (date) => {
    this.setState({ endDate: date });
  }

  filter = () => {
    const { fetchFilteredUsers } = this.props;
    const { filter, filterType } = this.state;

    fetchFilteredUsers(filter, filterType);
  }
  /*
  filterName = () => {
    const { fetchFilteredUsers } = this.props;
    const { userFilter } = this.state;

    fetchFilteredUsers(userFilter);
  } */

  getUserBalanceHistory = (userId) => {
    const { fetchUserBalanceHistory } = this.props;
    if (userId) {
      fetchUserBalanceHistory(userId);

      this.setState({
        bilanceHistoryModalOpen: true,
      });
    }
  }

  closeBilanceHistory = () => {
    this.setState({
      bilanceHistoryModalOpen: false,
    });
  }

  openModal(uid) {
    const { allUsers } = this.props;
    const { filteredUsers } = this.state;
    if (filteredUsers) {
      const user = filteredUsers[uid];

      this.setState({
        editUserId: uid,
        openModal: true,
        balance: user.bal,
        gamesPlayed: user.gPlayed,
        level: user.lvl,
        totalPnts: user.totalPnts,
      });
    } else {
      const user = allUsers[uid];

      this.setState({
        editUserId: uid,
        openModal: true,
        balance: user.bal,
        gamesPlayed: user.gPlayed,
        level: user.lvl,
        totalPnts: user.totalPnts,
      });
    }
  }

  openModalBlock(uid) {
    this.setState({
      blockUserId: uid,
      openBlockModal: true,
    });
  }

  editUser() {
    const { editUser } = this.props;
    const {
      editUserId, balance, level, gamesPlayed, totalPnts,
    } = this.state;

    editUser(editUserId, balance, level, gamesPlayed, totalPnts);
    this.setState({ openModal: false });
  }

  blockUser() {
    const { blockUser } = this.props;
    const {
      blockUserId, reason, endDate,
    } = this.state;

    blockUser(blockUserId, endDate, reason);
    this.setState({ openBlockModal: false });
  }

  toggle() {
    this.setState(prevState => ({
      openModal: !prevState.openModal,
    }));
  }

  toggleBlock() {
    this.setState(prevState => ({
      openBlockModal: !prevState.openBlockModal,
    }));
  }

  toggleDelete = () => {
    this.setState(prevState => ({
      openDeleteConfirmation: !prevState.openDeleteConfirmation,
      deleteUserId: null,
    }));
  }

  openDeleteModal = (uid) => {
    this.setState({
      deleteUserId: uid,
      openDeleteConfirmation: true,
    });
  }

  deleteUser = () => {
    const { deleteUser } = this.props;
    const { deleteUserId } = this.state;

    console.log('deleteUserId');
    console.log(deleteUserId);
    if (deleteUserId) {
      deleteUser(deleteUserId);
      this.setState({
        deleteUserId: null,
        openDeleteConfirmation: false,
      })
    }
  }


  handleClick(e, index) {
    e.preventDefault();
    const { fetchUsersRange } = this.props;
    //  const { fetchAllUsers, allUsersLastKey } = this.props;
    //  fetchAllUsers(index, allUsersLastKey);
    const start = (50 * index) + 1;
    const end = (50 * index) + 50;

    fetchUsersRange(start, end);

    this.setState({
      currentPage: index,
    });
  }


  table() {
    const {
      allUsers,
    //  deleteUser,
      usersCount,
      toggleLogRocket,
    } = this.props;
    const {
      currentPage,
      pageSize,
      filteredUsers,
    } = this.state;

    if (filteredUsers) {
      const pagesCount = Math.ceil(Object.keys(filteredUsers).length / pageSize);

      return (
        <Fragment>
          {filteredUsers && Object.keys(filteredUsers)
            .slice(
              currentPage * pageSize,
              (currentPage + 1) * pageSize,
            )
            .map((key, index) => (
              <Fragment key={key}>
                <tr key={key} className={`allUsers-table-row ${index % 2 === 0 ? ('odd') : ('even')}`}>
                  <td className="allUsers-table-col">
                    {filteredUsers[key].name}
                  </td>
                  <td className="allUsers-table-col" style={{ minWidth: 130 }}>
                    <Moment format="DD-MM-YYYY, HH:mm" locale="lv">
                      {filteredUsers[key].lastLogin}
                    </Moment>
                  </td>
                  <td className="allUsers-table-col">
                    {filteredUsers[key].lvl}
                  </td>
                  <td className="allUsers-table-col">
                    {`${filteredUsers[key].bal}€`}
                  </td>
                  <td className="allUsers-table-col">
                    {filteredUsers[key].totalPnts}
                  </td>
                  <td className="allUsers-table-col">
                    {filteredUsers[key].gPlayed}
                  </td>
                  <td className="allUsers-table-col">
                    {filteredUsers[key].socId}
                  </td>
                  <td className="allUsers-table-col">
                    {filteredUsers[key].uid}
                  </td>
                  <td className="allUsers-table-col">
                    <Button color="primary" style={{ fontSize: 10 }} onClick={() => this.getUserBalanceHistory(key)}>
                      Bilances vēsture
                    </Button>
                  </td>
                  <td className="allUsers-table-col">
                    <Button color="primary" onClick={() => this.openModal(key)}>
                      Labot
                    </Button>
                  </td>
                  <td className="allUsers-table-col">
                    <Button color={filteredUsers[key].enableLogRocket ? 'success' : 'warning'} onClick={() => toggleLogRocket(key)}>
                      Logrocket
                    </Button>
                  </td>
                  <td className="allUsers-table-col">
                    {filteredUsers[key].blocked ? (
                      <Label style={{ textAlign: 'center', fontSize: 14 }}>
                        Bloķēts
                      </Label>
                    ) : (
                      <Button color="primary" onClick={() => this.openModalBlock(key)}>
                        Bloķēt
                      </Button>
                    )}
                  </td>
                  <td className="allUsers-table-col">
                    <Button color="danger" onClick={() => this.openDeleteModal(key)}>
                      Dzēst
                    </Button>
                  </td>
                </tr>
              </Fragment>
            ))}
          {pagesCount && Object.keys(filteredUsers).lengt > pageSize && (
            <div className="pagination-wrapper">
              <Pagination aria-label="Page navigation example">
                <PaginationItem disabled={currentPage <= 0}>
                  <PaginationLink
                    onClick={e => this.handleClick(e, currentPage - 1)}
                    previous
                    href="#"
                  />
                </PaginationItem>

                <PaginationItem disabled={currentPage === 0}>
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

    const pagesCount = Math.ceil(usersCount / pageSize);

    return (
      <Fragment>
        {allUsers && Object.keys(allUsers)
        //  .slice(
        //    currentPage * pageSize,
        //    (currentPage + 1) * pageSize,
        //  )
          .map((key, index) => (
            <Fragment key={key}>
              <tr key={key} className={`allUsers-table-row ${index % 2 === 0 ? ('odd') : ('even')}`}>
                <td className="allUsers-table-col">
                  {allUsers[key].name}
                </td>
                <td className="allUsers-table-col" style={{ minWidth: 130 }}>
                  <Moment format="DD-MM-YYYY, HH:mm" locale="lv">
                    {allUsers[key].lastLogin}
                  </Moment>
                </td>
                <td className="allUsers-table-col">
                  {allUsers[key].lvl}
                </td>
                <td className="allUsers-table-col">
                  {`${allUsers[key].bal}€`}
                </td>
                <td className="allUsers-table-col">
                  {allUsers[key].totalPnts}
                </td>
                <td className="allUsers-table-col">
                  {allUsers[key].gPlayed}
                </td>
                <td className="allUsers-table-col">
                  {allUsers[key].socId}
                </td>
                <td className="allUsers-table-col">
                  {key}
                </td>
                <td className="allUsers-table-col">
                  <Button color="primary" style={{ fontSize: 10 }} onClick={() => this.getUserBalanceHistory(key)}>
                    Bilances vēsture
                  </Button>
                </td>
                <td className="allUsers-table-col">
                  <Button color="primary" onClick={() => this.openModal(key)}>
                    Labot
                  </Button>
                </td>
                <td className="allUsers-table-col">
                  <Button color={allUsers[key].enableLogRocket ? 'success' : 'warning'} onClick={() => toggleLogRocket(key)}>
                    Logrocket
                  </Button>
                </td>
                <td className="allUsers-table-col">
                  {allUsers[key].blocked ? (
                    <Label style={{ textAlign: 'center', fontSize: 14 }}>
                      Bloķēts
                    </Label>
                  ) : (
                    <Button color="primary" onClick={() => this.openModalBlock(key)}>
                      Bloķēt
                    </Button>
                  )}
                </td>
                <td className="allUsers-table-col">
                  <Button color="danger" onClick={() => this.openDeleteModal(key)}>
                    Dzēst
                  </Button>
                </td>
              </tr>
            </Fragment>
          ))}
        {pagesCount && usersCount > pageSize && (
          <div className="pagination-wrapper">
            <Pagination aria-label="Page navigation example">
              <PaginationItem disabled={currentPage <= 0}>
                <PaginationLink
                  onClick={e => this.handleClick(e, currentPage - 1)}
                  previous
                  href="#"
                />
              </PaginationItem>

              <PaginationItem disabled={currentPage === 0}>
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
    const { userBalanceHistory } = this.props;
    const {
      openModal,
      balance,
      level,
      gamesPlayed,
      endDate,
      reason,
      openBlockModal,
      //  userFilter,
      filterType,
      filter,
      bilanceHistoryModalOpen,
      totalPnts,
      openDeleteConfirmation,
    } = this.state;

    //  console.log('userBalanceHistory');
    //  console.log(userBalanceHistory);

    return (
      <Fragment>
        <div style={{ marginTop: 100, color: '#fff' }}>
          <h2>
          Visi lietotāji
          </h2>
          <Row>
            <Col sm="5">
              <Label for="filterType">
                Filtrēt pēc
              </Label>
              <Input type="select" className="game-bet-select" value={filterType} onChange={this.selectType}>
                <option value="lowerCaseName" style={{ backgroundColor: '#222' }}>Vārds</option>
                {/*  <option value="lowerLName" style={{ backgroundColor: '#222' }}>Uzvārds</option>  */}
                <option value="uid" style={{ backgroundColor: '#222' }}>Uid</option>
              </Input>
            </Col>
            <Col sm="5">
              <Label for="filter">
                Vērtība
              </Label>
              <Input
                type="text"
                name="filter"
                id="filter"
                value={filter}
                onChange={this.handleChange}
                onKeyPress={this.handleKeyPress}
              />
            </Col>
            <Col sm="2">
              <Button onClick={this.filter}>
              Filtrēt
              </Button>
            </Col>
          </Row>
          <table style={{ width: '100%', fontSize: 12 }}>
            <colgroup>
              <col span="1" className="" />
            </colgroup>
            <thead>
              <tr>
                <th style={{ textAlign: 'center' }}>
                  Vārds
                </th>
                <th style={{ textAlign: 'center' }}>
                  Pēdējā reizie online
                </th>
                <th style={{ textAlign: 'center' }}>
                  Līmenis
                </th>
                <th style={{ textAlign: 'center' }}>
                  Bilance
                </th>
                <th style={{ textAlign: 'center' }}>
                  Punkti
                </th>
                <th style={{ textAlign: 'center' }}>
                  Izspēlētās spēles
                </th>
                <th style={{ textAlign: 'center' }}>
                  Soc id
                </th>
                <th style={{ textAlign: 'center' }}>
                  Uid
                </th>
                <th style={{ textAlign: 'center' }}>
                  Bilances vēsture
                </th>
                <th style={{ textAlign: 'center' }}>
                  Labot
                </th>
                <th style={{ textAlign: 'center' }}>
                  Logrocket
                </th>
                <th style={{ textAlign: 'center' }}>
                  Bloķēt
                </th>
                <th style={{ textAlign: 'center' }}>
                  Dzēst
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
            Labot lietotāju
          </ModalHeader>
          <ModalBody>
            <Form>
              <FormGroup>
                <Label for="balance">
                  Bilance
                </Label>
                <Input
                  type="text"
                  name="balance"
                  id="balance"
                  value={balance}
                  onChange={this.handleChange}
                />
              </FormGroup>
              <FormGroup>
                <Label for="level">
                  Līmenis
                </Label>
                <Input
                  type="text"
                  name="level"
                  id="level"
                  value={level}
                  onChange={this.handleChange}
                />
              </FormGroup>
              <FormGroup>
                <Label for="gamesPlayed">
                  Izspēlētās spēles
                </Label>
                <Input
                  type="text"
                  name="gamesPlayed"
                  id="gamesPlayed"
                  value={gamesPlayed}
                  onChange={this.handleChange}
                />
              </FormGroup>
              <FormGroup>
                <Label for="totalPnts">
                  Punkti
                </Label>
                <Input
                  type="text"
                  name="totalPnts"
                  id="totalPnts"
                  value={totalPnts}
                  onChange={this.handleChange}
                />
              </FormGroup>
            </Form>
          </ModalBody>
          <ModalFooter>
            <Button color="primary" onClick={this.editUser}>Labot</Button>
            <Button color="secondary" onClick={this.toggle}>Aizvērt</Button>
          </ModalFooter>
        </Modal>
        <Modal isOpen={openBlockModal} toggle={this.toggleBlock}>
          <ModalHeader toggle={this.toggleBlock}>
            Bloķēt lietotāju
          </ModalHeader>
          <ModalBody>
            <Form>
              <FormGroup>
                <Label for="endDate">
                  Līdz
                </Label>
                {/*
                <DatetimePickerTrigger
                  id="endDate"
                  shortcuts={shortcuts}
                  moment={endDate}
                  onChange={this.changeEndDate}
                >
                  <input type="text" value={endDate.format('YYYY-MM-DD HH:mm')} readOnly />
                </DatetimePickerTrigger>
                */}
                <ReactDateTime
                  closeOnSelect
                  onChange={this.changeEndDate}
                  value={endDate}
                  id="endDate"
                />
              </FormGroup>
              <FormGroup>
                <Label for="reason">
                  Iemesls
                </Label>
                <Input
                  type="text"
                  name="reason"
                  id="reason"
                  value={reason}
                  onChange={this.handleChange}
                />
              </FormGroup>
            </Form>
          </ModalBody>
          <ModalFooter>
            <Button color="primary" onClick={this.blockUser}>Bloķēt</Button>
            <Button color="secondary" onClick={this.toggleBlock}>Aizvērt</Button>
          </ModalFooter>
        </Modal>

        <Modal isOpen={openDeleteConfirmation} toggle={this.toggleDelete}>
          <ModalHeader toggle={this.toggleDelete}>
            Vai tiešām vēlies dzēst lietotāju
          </ModalHeader>
          <ModalBody>
          </ModalBody>
          <ModalFooter>
            <Button color="primary" onClick={this.deleteUser}>Izdzēst</Button>
            <Button color="secondary" onClick={this.toggleDelete}>Aizvērt</Button>
          </ModalFooter>
        </Modal>

        <Modal size="lg" isOpen={bilanceHistoryModalOpen} toggle={this.closeBilanceHistory}>
          <ModalHeader toggle={this.closeBilanceHistory}>
            Bilances vēsture
          </ModalHeader>
          <ModalBody>
            <Row>
              <Col sm="12">
                <table className="top-table">
                  <thead>
                    <tr className="top-table-header-row">
                      <th className="top-table-header-col">
                  Laiks
                      </th>
                      <th className="top-table-header-col">
                  Tips
                      </th>
                      <th className="top-table-header-col">
                  Vecā bilance
                      </th>
                      <th className="top-table-header-col">
                  Jaunā bilance
                      </th>
                      <th className="top-table-header-col">
                  Izmaiņas
                      </th>
                    </tr>
                  </thead>
                  <tbody />
                </table>
                <ReactTableContainer
                  width="100%"
                  height="420px"
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
                  <table className="top-table">
                    <colgroup>
                      <col span="1" className="" />
                    </colgroup>
                    {/*  <thead>
                      <tr className="top-table-header-row">
                        <th className="top-table-header-col">
                      Laiks
                        </th>
                        <th className="top-table-header-col">
                      Tips
                        </th>
                        <th className="top-table-header-col">
                      Vecā bilance
                        </th>
                        <th className="top-table-header-col">
                      Jaunā bilance
                        </th>
                        <th className="top-table-header-col">
                      Izmaiņas
                        </th>
                      </tr>
                    </thead> */}
                    <thead />
                    <tbody>
                      {userBalanceHistory && Object.keys(userBalanceHistory)
                        .reverse().map((key, index) => (
                          <Fragment key={key}>
                            <tr key={key} className={`top-table-row ${index % 2 === 0 ? ('odd') : ('even')}`}>
                              <td className="top-table-col">
                                <Moment format="DD-MM-YYYY, HH:mm" locale="lv">
                                  {userBalanceHistory[key].time}
                                </Moment>
                              </td>
                              <td className="top-table-col col-player">
                                {userBalanceHistory[key].type === 'game' && (
                                  'Spēles rezultāts'
                                )}
                                {userBalanceHistory[key].type === 'joinPrice' && (
                                  'Istabas pievienošanās maksas'
                                )}
                                {userBalanceHistory[key].type === 'dailyBonus' && (
                                  'Dienas bonuss'
                                )}
                                {userBalanceHistory[key].type === 'leaveTournament' && (
                                  'Turnīra pamešanas maksas'
                                )}
                                {userBalanceHistory[key].type === 'joinTournament' && (
                                  'Turnīra reģistrācijas maksas'
                                )}
                                {userBalanceHistory[key].type === 'winTournament' && (
                                  'Turnīra laimests'
                                )}
                                {userBalanceHistory[key].type === 'buyTournamentMoney' && (
                                  'Turnīra Naudas pirkums'
                                )}
                                {userBalanceHistory[key].type === 'friendReceived' && (
                                  'Saņemts no drauga'
                                )}
                                {userBalanceHistory[key].type === 'friendSent' && (
                                  'Nosūtīts draugam'
                                )}
                                {userBalanceHistory[key].type === 'purchaseCallback' && (
                                  'Naudas pirkums'
                                )}
                                {userBalanceHistory[key].type === 'purchase' && (
                                  'Naudas pirkums'
                                )}
                                {userBalanceHistory[key].type === 'missTurnMe' && (
                                  'Sods par gājiena nokavēšanu'
                                )}
                                {userBalanceHistory[key].type === 'missTurnOther' && (
                                  'Cits spēlētājs nokaveja gājienu'
                                )}
                                {userBalanceHistory[key].type === 'leftRoom' && (
                                  'Sods par spēles pamešanu'
                                )}
                                {userBalanceHistory[key].type === 'adminChange' && (
                                  'Administrācijas labojums'
                                )}
                                {userBalanceHistory[key].type === 'endRoomPules' && (
                                  'Puļu aprēķins pēc istabas beigām'
                                )}
                                {userBalanceHistory[key].type === 'giftsSent' && (
                                  'Nosūtītas dāvanas'
                                )}
                                {userBalanceHistory[key].type === 'achievement' && (
                                  'Sasniegums'
                                )}
                              </td>
                              <td className="top-table-col">
                                {userBalanceHistory[key].old}
                              </td>
                              <td className="top-table-col">
                                {userBalanceHistory[key].new}
                              </td>
                              <td className="top-table-col">
                                {userBalanceHistory[key].change}
                              </td>
                            </tr>
                          </Fragment>
                        ))}
                    </tbody>
                  </table>
                </ReactTableContainer>
              </Col>
            </Row>
          </ModalBody>
          <ModalFooter>
            <Button color="secondary" onClick={this.closeBilanceHistory}>Aizvērt</Button>
          </ModalFooter>
        </Modal>
      </Fragment>
    );
  }
}

export default withRouter(AllUsers);
