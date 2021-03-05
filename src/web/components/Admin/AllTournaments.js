import React, { Fragment } from 'react';
import PropTypes from 'prop-types';

/*import {
  Row,
  Col,
  Form,
  Label,
  Input,
  Button,
  Media,
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
import Media from 'reactstrap/lib/Media';
import Pagination from 'reactstrap/lib/Pagination';
import PaginationItem from 'reactstrap/lib/PaginationItem';
import PaginationLink from 'reactstrap/lib/PaginationLink';
import Modal from 'reactstrap/lib/Modal';
import ModalHeader from 'reactstrap/lib/ModalHeader';
import ModalBody from 'reactstrap/lib/ModalBody';
import ModalFooter from 'reactstrap/lib/ModalFooter';


import { withRouter } from 'react-router-dom';

import moment from 'moment';
import Moment from 'react-moment';

// import { DateTimePicker } from 'react-widgets';
import DateTimePicker from 'react-widgets/lib/DateTimePicker';

import momentLocalizer from 'react-widgets-moment';


// import 'imrc-datetime-picker/dist/imrc-datetime-picker.min.css';
// import { DatetimePickerTrigger } from 'imrc-datetime-picker';

// import ReactDateTime from 'react-datetime';
// import 'react-datetime/css/react-datetime.css';

import 'react-widgets/dist/css/react-widgets.css';

import closeImg from '../../../images/icons/close.png';

moment.locale('lv');
momentLocalizer();


class AllBans extends React.Component {
  static propTypes = {
    member: PropTypes.shape({
      email: PropTypes.string,
    }),
    allTournaments: PropTypes.shape({}),
    tournamentPlayers: PropTypes.shape({}),
    //  allUsers: PropTypes.shape({}),
    history: PropTypes.shape({
      push: PropTypes.func.isRequired,
    }).isRequired,
    editTournament: PropTypes.func.isRequired,
    addTournament: PropTypes.func.isRequired,
    deleteTournament: PropTypes.func.isRequired,
    fetchTournamentPlayers: PropTypes.func.isRequired,
  }

  static defaultProps = {
    member: {},
    allTournaments: {},
    //  allUsers: {},
    tournamentPlayers: {},
  }

  constructor(props) {
    super(props);
    this.state = {
      currentPage: 0,
      pageSize: 50,
      tournamentToEdit: '',
      openModal: false,
      deleteModal: false,
      deleteModalSelectedTournament: '',
      openPlayersModal: false,
      name: '',
      bet: '',
      entryFee: null,
      chipsOnEnter: null,
      //  winningPot: null,
      bonus: null,
      startTime: moment(),
      endTime: moment(),
      registrationStart: moment(),
      registrationEnd: moment(),
      winnerPercent: null,
      minPlayers: null,
      //  status: '',
      everyDay: false,
      parasta: true,
      MG: false,
      atra: false,
      pro: false,
      maxPlayers: null,
      maxRndRoom: null,
      maxRndTourn: null,
      playersModalId: '',
    };

    this.handleClick = this.handleClick.bind(this);
    this.openModal = this.openModal.bind(this);
    this.openAddModal = this.openAddModal.bind(this);
    this.editTournament = this.editTournament.bind(this);
    this.addTournament = this.addTournament.bind(this);
    this.toggle = this.toggle.bind(this);
    this.toggleAdd = this.toggleAdd.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.selectBet = this.selectBet.bind(this);

    this.ChangeStartTime = this.ChangeStartTime.bind(this);
    this.ChangeEndTime = this.ChangeEndTime.bind(this);
    this.ChangeRegistrationStart = this.ChangeRegistrationStart.bind(this);
    this.ChangeRegistrationEnd = this.ChangeRegistrationEnd.bind(this);

    this.toggleParasta = this.toggleParasta.bind(this);
    this.toggleMG = this.toggleMG.bind(this);
    this.toggleAtra = this.toggleAtra.bind(this);
    this.togglePro = this.togglePro.bind(this);
  }

  handleChange = (event) => {
    const value = event.target.type === 'checkbox' ? event.target.checked : event.target.value;

    this.setState({
      [event.target.name]: value,
    });
  }

  ChangeStartTime = (date) => {
    this.setState({ startTime: date });
  }

  ChangeEndTime = (date) => {
    this.setState({ endTime: date });
  }

  ChangeStartDate = (date) => {
    this.setState({ startDate: date });
  }

  ChangeEndDate = (date) => {
    this.setState({ endDate: date });
  }

  ChangeRegistrationStart = (date) => {
    this.setState({ registrationStart: date });
  }

  ChangeRegistrationEnd = (date) => {
    this.setState({ registrationEnd: date });
  }

  /*  ChangeRegistrationStartTime = (date) => {
    this.setState({ registrationStartTime: date });
  }

  ChangeRegistrationEndTime = (date) => {
    this.setState({ registrationEndTime: date });
  } */

  openModal = (id) => {
    const { allTournaments } = this.props;
    const tournament = allTournaments[id];

    let parasta;
    let MG;
    if (tournament.gameType === 'MG') {
      parasta = false;
      MG = true;
    } else {
      parasta = true;
      MG = false;
    }

    this.setState({
      tournamentToEdit: id,
      openModal: true,
      openAddModal: false,
      deleteModal: false,
      openPlayersModal: false,
      name: tournament.name,
      bet: tournament.bet,
      entryFee: tournament.entryFee,
      chipsOnEnter: tournament.chipsOnEnter,
      //  winningPot: tournament.winningPot,
      bonus: tournament.bonus,
      startTime: new Date(tournament.startTime),
      endTime: new Date(tournament.endTime),
      startDate: new Date(tournament.startDate),
      endDate: new Date(tournament.endDate),
      registrationStart: new Date(tournament.registrationStart),
      registrationEnd: new Date(tournament.registrationEnd),
      //  registrationStartTime: new Date(tournament.registrationStartTime),
      //  registrationEndTime: new Date(tournament.registrationEndTime),
      winnerPercent: tournament.winnerPercent,
      minPlayers: tournament.minPlayers,
      //  status: tournament.status,
      everyDay: !!tournament.everyDay,
      parasta,
      MG,
      atra: !!tournament.atra,
      pro: !!tournament.pro,
      maxPlayers: tournament.maxPlayers || null,
      maxRndRoom: tournament.maxRndRoom || null,
      maxRndTourn: tournament.maxRndTourn || null,
    });
  }

  openAddModal = () => {
    this.setState({
      openModal: false,
      openAddModal: true,
      deleteModal: false,
      openPlayersModal: false,
      name: '',
      bet: '1:1',
      entryFee: '',
      chipsOnEnter: '',
      //  winningPot: '',
      bonus: '',
      startTime: new Date(),
      endTime: new Date(),
      startDate: new Date(),
      endDate: new Date(),
      registrationStart: new Date(),
      registrationEnd: new Date(),
      //  registrationStartTime: new Date(),
      //  registrationEndTime: new Date(),
      winnerPercent: null,
      minPlayers: null,
      //  status: '',
      everyDay: false,
      parasta: true,
      MG: false,
      atra: false,
      pro: false,
      maxPlayers: null,
      maxRndRoom: null,
      maxRndTourn: null,
    });
  }

  openPlayersModal = (id) => {
    const { fetchTournamentPlayers } = this.props;

    fetchTournamentPlayers(id);
    this.setState({
      openModal: false,
      openAddModal: false,
      openPlayersModal: true,
      playersModalId: id,
    });
  }

  togglePlayers = () => {
    this.setState(prevState => ({
      openPlayersModal: !prevState.openPlayersModal,
      playersModalId: '',
    }));
  }

  toggleDeleteModal = (id) => {
    this.setState(prevState => ({
      deleteModal: !prevState.deleteModal,
      deleteModalSelectedTournament: id,
    }));
  }

  deleteTournament = () => {
    const { deleteTournament } = this.props;
    const { deleteModalSelectedTournament } = this.state;

    if (deleteModalSelectedTournament) {
      deleteTournament(deleteModalSelectedTournament);

      this.setState({
        deleteModal: false,
        deleteModalSelectedTournament: '',
      });
    }
  }

  editTournament() {
    const { editTournament } = this.props;
    const {
      tournamentToEdit,
      name,
      bet,
      entryFee,
      chipsOnEnter,
      bonus,
      startTime,
      endTime,
      startDate,
      endDate,
      registrationStart,
      registrationEnd,
      winnerPercent,
      minPlayers,
      everyDay,
      parasta,
      MG,
      atra,
      pro,
      maxPlayers,
      maxRndRoom,
      maxRndTourn,
    } = this.state;

    editTournament({
      tournamentToEdit,
      name,
      bet,
      entryFee,
      chipsOnEnter,
      bonus,
      startTime,
      endTime,
      startDate,
      endDate,
      registrationStart,
      registrationEnd,
      winnerPercent,
      minPlayers,
      everyDay,
      parasta,
      MG,
      atra,
      pro,
      maxPlayers,
      maxRndRoom,
      maxRndTourn,
    });
    this.setState({ openModal: false });
  }

  addTournament() {
    const { addTournament } = this.props;
    const {
      name,
      bet,
      entryFee,
      chipsOnEnter,
      bonus,
      startTime,
      endTime,
      startDate,
      endDate,
      registrationStart,
      registrationEnd,
      winnerPercent,
      minPlayers,
      everyDay,
      parasta,
      MG,
      atra,
      pro,
      maxPlayers,
      maxRndRoom,
      maxRndTourn,
    } = this.state;

    addTournament({
      name,
      bet,
      entryFee,
      chipsOnEnter,
      bonus,
      startTime,
      endTime,
      startDate,
      endDate,
      registrationStart,
      registrationEnd,
      winnerPercent,
      minPlayers,
      everyDay,
      parasta,
      MG,
      atra,
      pro,
      maxPlayers,
      maxRndRoom,
      maxRndTourn,
    });
    this.setState({ openAddModal: false });
  }

  toggleAdd() {
    this.setState(prevState => ({
      openAddModal: !prevState.openAddModal,
    }));
  }

  toggle() {
    this.setState(prevState => ({
      openModal: !prevState.openModal,
    }));
  }

  toggleParasta() {
    const { parasta } = this.state;
    if (parasta) {
      this.setState({ parasta: false, MG: true });
    } else {
      this.setState({ parasta: true, MG: false });
    }
  }

  toggleMG() {
    const { MG } = this.state;
    if (MG) {
      this.setState({ parasta: true, MG: false });
    } else {
      this.setState({ parasta: false, MG: true });
    }
  }

  toggleAtra() {
    const { atra } = this.state;
    if (atra) {
      this.setState({ atra: false });
    } else {
      this.setState({ atra: true });
    }
  }

  togglePro() {
    const { pro } = this.state;
    if (pro) {
      this.setState({ pro: false });
    } else {
      this.setState({ pro: true });
    }
  }

  handleClick(e, index) {
    e.preventDefault();
    this.setState({
      currentPage: index,
    });
  }

  selectBet(e) {
    this.setState({ bet: e.target.value });
  }

  table() {
    const {
      allTournaments,
    } = this.props;
    const {
      currentPage,
      pageSize,
    } = this.state;

    const pagesCount = Math.ceil(Object.keys(allTournaments).length / pageSize);

    return (
      <Fragment>
        {allTournaments && Object.keys(allTournaments)
          .reverse()
          .slice(
            currentPage * pageSize,
            (currentPage + 1) * pageSize,
          )
          .map((key, index) => (
            <Fragment key={key}>
              <tr key={key} className={`allTournaments-table-row ${index % 2 === 0 ? ('odd') : ('even')}`}>
                <td className="allTournaments-table-col">
                  {allTournaments[key].name}
                </td>
                <td className="allTournaments-table-col">
                  {allTournaments[key].totalBank}
                </td>
                <td className="allTournaments-table-col">
                  <Moment format="DD-MM-YYYY" locale="lv">
                    {allTournaments[key].startDate}
                  </Moment>
                  <Moment format="HH:mm" locale="lv" style={{ marginLeft: 5 }}>
                    {allTournaments[key].startTime}
                  </Moment>
                </td>
                <td className="allTournaments-table-col">
                  <Moment format="DD-MM-YYYY" locale="lv">
                    {allTournaments[key].endDate}
                  </Moment>
                  <Moment format="HH:mm" locale="lv" style={{ marginLeft: 5 }}>
                    {allTournaments[key].endTime}
                  </Moment>
                </td>
                <td className="allTournaments-table-col">
                  {allTournaments[key].status}
                </td>
                <td className="allTournaments-table-col" style={{ width: '10%' }}>
                  <Button className="allTournaments-table-col-button" color="primary" onClick={() => this.openModal(key)}>
                    Labot
                  </Button>
                </td>
                <td className="allTournaments-table-col" style={{ width: '10%' }}>
                  <Button className="allTournaments-table-col-button" color="primary" onClick={() => this.openPlayersModal(key)}>
                    Spēlētāji
                  </Button>
                </td>
                <td className="allTournaments-table-col" style={{ width: '10%' }}>
                  <Button className="allTournaments-table-col-button" color="danger" onClick={() => this.toggleDeleteModal(key)}>
                    Izdzēst
                  </Button>
                </td>
              </tr>
            </Fragment>
          ))}
        {Object.keys(allTournaments).length > pageSize && (
        <div className="pagination-wrapper">
          <Pagination aria-label="Page navigation example">
            <PaginationItem disabled={currentPage <= 0}>
              <PaginationLink
                onClick={e => this.handleClick(e, currentPage - 1)}
                previous
                href="#"
              />
            </PaginationItem>

            <PaginationItem disabled={currentPage < 6}>
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
    const { tournamentPlayers, allTournaments } = this.props;

    const {
      deleteModal,
      name,
      bet,
      entryFee,
      chipsOnEnter,
      bonus,
      everyDay,
      startTime,
      endTime,
      startDate,
      endDate,
      registrationStart,
      registrationEnd,
      winnerPercent,
      minPlayers,
      openModal,
      openAddModal,
      parasta,
      MG,
      atra,
      pro,
      maxPlayers,
      maxRndRoom,
      maxRndTourn,
      openPlayersModal,
      playersModalId,
    } = this.state;

    return (
      <Fragment>
        <div style={{ marginTop: 100, color: '#fff' }}>
          <Row>
            <Col md="6">
              <h2>
                Turnīri
              </h2>
            </Col>
            <Col md="6">
              <Button onClick={() => this.openAddModal()}>
                Pievienot turnīru
              </Button>
            </Col>
          </Row>
          <table style={{ width: '100%', fontSize: 12, color: '#fff' }}>
            <colgroup>
              <col span="1" className="" />
            </colgroup>
            <thead>
              <tr>
                <th style={{ textAlign: 'center' }}>
                  Nosaukums
                </th>
                <th style={{ textAlign: 'center' }}>
                  Kopējā banka
                </th>
                <th style={{ textAlign: 'center' }}>
                  Sākums
                </th>
                <th style={{ textAlign: 'center' }}>
                  Beigas
                </th>
                <th style={{ textAlign: 'center' }}>
                  Status
                </th>
                <th style={{ textAlign: 'center', width: '10%' }}>
                  Labot
                </th>
                <th style={{ textAlign: 'center', width: '10%' }}>
                  Spēlētāji
                </th>
                <th style={{ textAlign: 'center', width: '10%' }}>
                  Izdzēst
                </th>
              </tr>
            </thead>
            <tbody>
              {this.table()}
            </tbody>
          </table>
        </div>

        <Modal isOpen={deleteModal} toggle={() => this.toggleDeleteModal('')} className="notification">
          <ModalHeader
            toggle={() => this.toggleDeleteModal('')}
            className="notification-header"
            close={
              <Media src={closeImg} className="notification-header-close" alt="X" onClick={() => this.toggleDeleteModal('')} />
            }
          />
          <ModalBody className="notification-body" style={{ fontSize: 28 }}>
            Vai tiešām vēlies izdzēst turnīru?
          </ModalBody>
          <ModalFooter className="notification-footer">
            <Button className="btn notification-footer-button" onClick={this.deleteTournament}>
              Jā
            </Button>
            <Button type="button" className="btn notification-footer-button" onClick={() => this.toggleDeleteModal('')}>
              Nē
            </Button>
          </ModalFooter>
        </Modal>

        {/* Edit tournament modal */}
        <Modal isOpen={openModal} toggle={this.toggle}>
          <ModalHeader toggle={this.toggle}>
            Labot turnīru
          </ModalHeader>
          <ModalBody>
            <Form>
              <FormGroup>
                <Label for="name">
                  Nosaukums
                </Label>
                <Input
                  type="text"
                  name="name"
                  id="name"
                  value={name}
                  onChange={this.handleChange}
                />
              </FormGroup>
              <FormGroup>
                <Label for="bet">
                  Likme
                </Label>
                <Input type="select" className="game-bet-select" value={bet} onChange={this.selectBet}>
                  <option style={{ backgroundColor: '#222' }}>1:1</option>
                  <option style={{ backgroundColor: '#222' }}>1:5</option>
                  <option style={{ backgroundColor: '#222' }}>1:10</option>
                  <option style={{ backgroundColor: '#222' }}>1:25</option>
                  <option style={{ backgroundColor: '#222' }}>1:50</option>
                  <option style={{ backgroundColor: '#222' }}>1:100</option>
                  <option style={{ backgroundColor: '#222' }}>1:500</option>
                  <option style={{ backgroundColor: '#222' }}>1:1000</option>
                </Input>
              </FormGroup>
              <FormGroup>
                <Label for="entryFee">
                  Ieejas maksas
                </Label>
                <Input
                  type="number"
                  name="entryFee"
                  id="entryFee"
                  value={entryFee}
                  onChange={this.handleChange}
                />
              </FormGroup>
              <FormGroup>
                <Label for="chipsOnEnter">
                  Sākuma žetoni
                </Label>
                <Input
                  type="number"
                  name="chipsOnEnter"
                  id="chipsOnEnter"
                  value={chipsOnEnter}
                  onChange={this.handleChange}
                />
              </FormGroup>
              {/*  <FormGroup>
                <Label for="winningPot">
                  Laimests
                </Label>
                <Input
                  type="number"
                  name="winningPot"
                  id="winningPot"
                  value={winningPot}
                  onChange={this.handleChange}
                />
              </FormGroup>  */}
              <FormGroup>
                <Label for="bonus">
                  Bonuss
                </Label>
                <Input
                  type="number"
                  name="bonus"
                  id="bonus"
                  value={bonus}
                  onChange={this.handleChange}
                />
              </FormGroup>
              <FormGroup>
                <Label for="maxRndRoom">
                  Max rounds played in a room
                </Label>
                <Input
                  type="number"
                  name="maxRndRoom"
                  id="maxRndRoom"
                  value={maxRndRoom}
                  onChange={this.handleChange}
                />
              </FormGroup>
              <FormGroup>
                <Label for="maxRndTourn">
                  Max rounds played in tournament
                </Label>
                <Input
                  type="number"
                  name="maxRndTourn"
                  id="maxRndTourn"
                  value={maxRndTourn}
                  onChange={this.handleChange}
                />
              </FormGroup>
              <Row>
                <Col sm="6">
                  <Label className="game-type-input" style={{ marginLeft: 40 }}>
                    <Input type="checkbox" onClick={this.toggleParasta} checked={parasta} readOnly />
                    <span className="checkmark" style={{ marginLeft: 40 }} />
                    <div className="game-type-text">
                      P
                    </div>
                  </Label>
                </Col>
                <Col sm="6">
                  <Label className="game-type-input" style={{ marginLeft: 10 }}>
                    <Input type="checkbox" onClick={this.toggleMG} checked={MG} readOnly />
                    <span className="checkmark" style={{ marginLeft: 10 }} />
                    <div className="game-type-text">
                      GM
                    </div>
                  </Label>
                </Col>
                <Col sm="6">
                  <Label className="game-type-input" style={{ marginLeft: 40 }}>
                    <Input type="checkbox" onClick={this.toggleAtra} checked={atra} readOnly />
                    <span className="checkmark" style={{ marginLeft: 40 }} />
                    <div className="game-type-text">
                      Atrā
                    </div>
                  </Label>
                </Col>
                <Col sm="6">
                  <Label className="game-type-input" style={{ marginLeft: 10 }}>
                    <Input type="checkbox" onClick={this.togglePro} checked={pro} readOnly />
                    <span className="checkmark" style={{ marginLeft: 10 }} />
                    <div className="game-type-text">
                      Pro
                    </div>
                  </Label>
                </Col>
              </Row>
              <FormGroup>
                <Label for="startTime">
                  Sākuma laiks
                </Label>
                {/*  <ReactDateTime
                  closeOnSelect
                  style={{ width: '50%' }}
                  onChange={this.ChangeStartTime}
                  value={startTime}
                  id="startTime"
                /> */}
                <Row>
                  <Col md="6">
                    <DateTimePicker
                      time={false}
                      format="DD.MM.YYYY"
                      culture="lv"
                      onChange={this.ChangeStartDate}
                      value={startDate}
                      defaultValue={new Date()}
                    />
                  </Col>
                  <Col md="6">
                    <DateTimePicker
                      date={false}
                      timeFormat="HH:mm"
                      culture="lv"
                      onChange={this.ChangeStartTime}
                      value={startTime}
                      defaultValue={new Date()}
                    />
                  </Col>
                </Row>
              </FormGroup>
              <FormGroup>
                <Label for="endTime">
                  Beigu laiks
                </Label>
                {/*  <ReactDateTime
                  closeOnSelect
                  onChange={this.ChangeEndTime}
                  value={endTime}
                  id="endTime"
                /> */}
                <Row>
                  <Col md="6">
                    <DateTimePicker
                      time={false}
                      format="DD.MM.YYYY"
                      culture="lv"
                      onChange={this.ChangeEndDate}
                      value={endDate}
                      defaultValue={new Date()}
                    />
                  </Col>
                  <Col md="6">
                    <DateTimePicker
                      date={false}
                      timeFormat="HH:mm"
                      culture="lv"
                      onChange={this.ChangeEndTime}
                      value={endTime}
                      defaultValue={new Date()}
                    />
                  </Col>
                </Row>
              </FormGroup>
              <FormGroup>
                <Label for="registrationStart">
                  Reģistrācijas sākums
                </Label>
                {/*  <ReactDateTime
                  closeOnSelect
                  onChange={this.ChangeRegistrationStart}
                  value={registrationStart}
                  id="registrationStart"
                /> */}
                <Row>
                  <Col md="12">
                    <DateTimePicker
                    //  time={false}
                      format="DD.MM.YYYY HH:mm"
                      culture="lv"
                      onChange={this.ChangeRegistrationStart}
                      value={registrationStart}
                      defaultValue={new Date()}
                    />
                  </Col>
                  {/*  <Col md="6">
                    <DateTimePicker
                      date={false}
                      timeFormat="HH:mm"
                      culture="lv"
                      onChange={this.ChangeRegistrationStartTime}
                      value={registrationStartTime}
                      defaultValue={new Date()}
                    />
                  </Col>  */}
                </Row>
              </FormGroup>
              <FormGroup>
                <Label for="registrationEnd">
                  Reģistrācijas beigas
                </Label>
                {/*  <ReactDateTime
                  closeOnSelect
                  onChange={this.ChangeRegistrationEnd}
                  value={registrationEnd}
                  id="registrationEnd"
                /> */}
                <Row>
                  <Col md="12">
                    <DateTimePicker
                    //  time={false}
                      format="DD.MM.YYYY HH:mm"
                    //  timeFormat="HH:mm"
                      culture="lv"
                      onChange={this.ChangeRegistrationEnd}
                      value={registrationEnd}
                      defaultValue={new Date()}
                    />
                  </Col>
                  {/*  <Col md="6">
                    <DateTimePicker
                      date={false}
                      timeFormat="HH:mm"
                      culture="lv"
                      onChange={this.ChangeRegistrationEndTime}
                      value={registrationEndTime}
                      defaultValue={new Date()}
                    />
                  </Col>  */}
                </Row>
              </FormGroup>
              <FormGroup>
                <Label for="minPlayers">
                  Spēlētaju skaits lai sāktu istabu (jādalās ar 3)
                </Label>
                <Input
                  type="number"
                  name="minPlayers"
                  id="minPlayers"
                  value={minPlayers}
                  onChange={this.handleChange}
                />
              </FormGroup>
              <FormGroup>
                <Label for="maxPlayers">
                  Maksimālais spēlētāju skaits turnīrā
                </Label>
                <Input
                  type="number"
                  name="maxPlayers"
                  id="maxPlayers"
                  value={maxPlayers}
                  onChange={this.handleChange}
                />
              </FormGroup>
              <FormGroup>
                <Label for="winnerPercent">
                  Uzvarētāju procents
                </Label>
                <Input
                  type="number"
                  name="winnerPercent"
                  id="winnerPercent"
                  value={winnerPercent}
                  onChange={this.handleChange}
                />
              </FormGroup>
              {/*  <FormGroup>
                <Label for="status">
                  Status
                </Label>
                <Input
                  type="text"
                  name="status"
                  id="status"
                  value={status}
                  onChange={this.handleChange}
                />
              </FormGroup> */}
            </Form>
          </ModalBody>
          <ModalFooter>
            <Button color="primary" onClick={this.editTournament}>Labot</Button>
            {' '}
            <Button color="secondary" onClick={this.toggle}>Aizvērt</Button>
          </ModalFooter>
        </Modal>

        {/* Add tournament modal */}
        <Modal isOpen={openAddModal} toggle={this.toggleAdd}>
          <ModalHeader toggle={this.toggleAdd}>
            Pievienot turnīru
          </ModalHeader>
          <ModalBody>
            <Form>
              <FormGroup>
                <Label for="name">
                  Nosaukums
                </Label>
                <Input
                  type="text"
                  name="name"
                  id="name"
                  value={name}
                  onChange={this.handleChange}
                />
              </FormGroup>
              <FormGroup>
                <Label for="bet">
                  Likme
                </Label>
                <Input type="select" className="game-bet-select" value={bet} onChange={this.selectBet}>
                  <option style={{ backgroundColor: '#222' }}>1:1</option>
                  <option style={{ backgroundColor: '#222' }}>1:5</option>
                  <option style={{ backgroundColor: '#222' }}>1:10</option>
                  <option style={{ backgroundColor: '#222' }}>1:25</option>
                  <option style={{ backgroundColor: '#222' }}>1:50</option>
                  <option style={{ backgroundColor: '#222' }}>1:100</option>
                  <option style={{ backgroundColor: '#222' }}>1:500</option>
                  <option style={{ backgroundColor: '#222' }}>1:1000</option>
                  <option style={{ backgroundColor: '#222' }}>1:5000</option>
                  <option style={{ backgroundColor: '#222' }}>1:10000</option>
                </Input>
              </FormGroup>

              <FormGroup>
                <Label for="entryFee">
                  Ieejas maksas
                </Label>
                <Input
                  type="number"
                  name="entryFee"
                  id="entryFee"
                  value={entryFee}
                  onChange={this.handleChange}
                />
              </FormGroup>
              <FormGroup>
                <Label for="chipsOnEnter">
                  Sākuma žetoni
                </Label>
                <Input
                  type="number"
                  name="chipsOnEnter"
                  id="chipsOnEnter"
                  value={chipsOnEnter}
                  onChange={this.handleChange}
                />
              </FormGroup>
              {/*  <FormGroup>
                <Label for="winningPot">
                  Laimests
                </Label>
                <Input
                  type="number"
                  name="winningPot"
                  id="winningPot"
                  value={winningPot}
                  onChange={this.handleChange}
                />
              </FormGroup> */}
              <FormGroup>
                <Label for="bonus">
                  Bonus
                </Label>
                <Input
                  type="number"
                  name="bonus"
                  id="bonus"
                  value={bonus}
                  onChange={this.handleChange}
                />
              </FormGroup>
              <FormGroup>
                <Label for="maxRndRoom">
                  Max rounds played in a room
                </Label>
                <Input
                  type="number"
                  name="maxRndRoom"
                  id="maxRndRoom"
                  value={maxRndRoom}
                  onChange={this.handleChange}
                />
              </FormGroup>
              <FormGroup>
                <Label for="maxRndTourn">
                  Max rounds played in tournament
                </Label>
                <Input
                  type="number"
                  name="maxRndTourn"
                  id="maxRndTourn"
                  value={maxRndTourn}
                  onChange={this.handleChange}
                />
              </FormGroup>
              <Row>
                <Col sm="6">
                  <Label className="game-type-input" style={{ marginLeft: 40 }}>
                    <Input type="checkbox" onClick={this.toggleParasta} checked={parasta} readOnly />
                    <span className="checkmark" style={{ marginLeft: 40 }} />
                    <div className="game-type-text">
                      P
                    </div>
                  </Label>
                </Col>
                <Col sm="6">
                  <Label className="game-type-input" style={{ marginLeft: 10 }}>
                    <Input type="checkbox" onClick={this.toggleMG} checked={MG} readOnly />
                    <span className="checkmark" style={{ marginLeft: 10 }} />
                    <div className="game-type-text">
                      GM
                    </div>
                  </Label>
                </Col>
                <Col sm="6">
                  <Label className="game-type-input" style={{ marginLeft: 40 }}>
                    <Input type="checkbox" onClick={this.toggleAtra} checked={atra} readOnly />
                    <span className="checkmark" style={{ marginLeft: 40 }} />
                    <div className="game-type-text">
                      Ātrā
                    </div>
                  </Label>
                </Col>
                <Col sm="6">
                  <Label className="game-type-input" style={{ marginLeft: 10 }}>
                    <Input type="checkbox" onClick={this.togglePro} checked={pro} readOnly />
                    <span className="checkmark" style={{ marginLeft: 10 }} />
                    <div className="game-type-text">
                      Pro
                    </div>
                  </Label>
                </Col>
              </Row>
              <Row>
                <Col sm="12">
                  <Label className="game-type-input" style={{ marginLeft: 40 }}>
                    <Input type="checkbox" name="everyDay" onClick={this.handleChange} checked={everyDay} readOnly />
                    <span className="checkmark" style={{ marginLeft: 10 }} />
                    <div className="game-type-text">
                      Katru dienu
                    </div>
                  </Label>
                </Col>
              </Row>
              <FormGroup>
                <Label for="startTime">
                  Sākuma laiks
                </Label>
                {/* }  <ReactDateTime
                  closeOnSelect
                  viewMode="time"
                  onChange={this.ChangeStartTime}
                  value={startTime}
                  id="startTime"
                /> */}
                <Row>
                  <Col md="6">
                    <DateTimePicker
                      time={false}
                      format="DD.MM.YYYY"
                      culture="lv"
                      onChange={this.ChangeStartDate}
                      value={startDate}
                      defaultValue={new Date()}
                    />
                  </Col>
                  <Col md="6">
                    <DateTimePicker
                      date={false}
                      timeFormat="HH:mm"
                      culture="lv"
                      onChange={this.ChangeStartTime}
                      value={startTime}
                      defaultValue={new Date()}
                    />
                  </Col>
                </Row>
              </FormGroup>
              <FormGroup>
                <Label for="endTime">
                  Beigu laiks
                </Label>
                {/*  <ReactDateTime
                  closeOnSelect
                  onChange={this.ChangeEndTime}
                  value={endTime}
                  id="endTime"
                /> */}
                <Row>
                  <Col md="6">
                    <DateTimePicker
                      time={false}
                      format="DD.MM.YYYY"
                      culture="lv"
                      onChange={this.ChangeEndDate}
                      value={endDate}
                      defaultValue={new Date()}
                    />
                  </Col>
                  <Col md="6">
                    <DateTimePicker
                      date={false}
                      timeFormat="HH:mm"
                      culture="lv"
                      onChange={this.ChangeEndTime}
                      value={endTime}
                      defaultValue={new Date()}
                    />
                  </Col>
                </Row>
              </FormGroup>
              <FormGroup>
                <Label for="registrationStart">
                  Reģistrācijas sākums
                </Label>
                {/*  <ReactDateTime
                  closeOnSelect
                  onChange={this.ChangeRegistrationStart}
                  value={registrationStart}
                  id="registrationStart"
                /> */}
                <Row>
                  <Col md="12">
                    <DateTimePicker
                    //  time={false}
                      format="DD.MM.YYYY HH:mm"
                    //  timeFormat="HH:mm"
                      culture="lv"
                      onChange={this.ChangeRegistrationStart}
                      value={registrationStart}
                      defaultValue={new Date()}
                    />
                  </Col>
                  {/*  <Col md="6">
                    <DateTimePicker
                      date={false}
                      timeFormat="HH:mm"
                      culture="lv"
                      onChange={this.ChangeRegistrationStartTime}
                      value={registrationStartTime}
                      defaultValue={new Date()}
                    />
                  </Col> */}
                </Row>
              </FormGroup>
              <FormGroup>
                <Label for="registrationEnd">
                  Reģistrācijas beigas
                </Label>
                {/*  <ReactDateTime
                  closeOnSelect
                  onChange={this.ChangeRegistrationEnd}
                  value={registrationEnd}
                  id="registrationEnd"
                /> */}
                <Row>
                  <Col md="12">
                    <DateTimePicker
                    //  time={false}
                    //  timeFormat="HH:mm"
                      format="DD.MM.YYYY HH:mm"
                      culture="lv"
                      onChange={this.ChangeRegistrationEnd}
                      value={registrationEnd}
                      defaultValue={new Date()}
                    />
                  </Col>
                  {/*  <Col md="6">
                    <DateTimePicker
                      date={false}
                      timeFormat="HH:mm"
                      culture="lv"
                      onChange={this.ChangeRegistrationEndTime}
                      value={registrationEndTime}
                      defaultValue={new Date()}
                    />
                  </Col> */}
                </Row>
              </FormGroup>
              <FormGroup>
                <Label for="minPlayers">
                  Spēlētaju skaits lai sāktu istabu (jādalās ar 3)
                </Label>
                <Input
                  type="number"
                  name="minPlayers"
                  id="minPlayers"
                  value={minPlayers}
                  onChange={this.handleChange}
                />
              </FormGroup>
              <FormGroup>
                <Label for="maxPlayers">
                  Maksimālais spēlētāju skaits turnīrā
                </Label>
                <Input
                  type="number"
                  name="maxPlayers"
                  id="maxPlayers"
                  value={maxPlayers}
                  onChange={this.handleChange}
                />
              </FormGroup>
              <FormGroup>
                <Label for="winnerPercent">
                  Uzvarētāju procents
                </Label>
                <Input
                  type="number"
                  name="winnerPercent"
                  id="winnerPercent"
                  value={winnerPercent}
                  onChange={this.handleChange}
                />
              </FormGroup>
            </Form>
          </ModalBody>
          <ModalFooter>
            <Button color="primary" onClick={this.addTournament}>Pievienot</Button>
            {' '}
            <Button color="secondary" onClick={this.toggleAdd}>Aizvērt</Button>
          </ModalFooter>
        </Modal>

        <Modal size="lg" isOpen={openPlayersModal} toggle={this.togglePlayers}>
          <ModalHeader toggle={this.togglePlayers}>
            Turnīra spēlētāji
          </ModalHeader>
          <ModalBody>
            {tournamentPlayers && tournamentPlayers[playersModalId] && (
              <table style={{ width: '95%' }}>
                <colgroup>
                  <col span="1" />
                </colgroup>
                <thead className="tournaments-table-header">
                  <tr>
                    <th>
                      Vārds
                    </th>
                    <th>
                      Uid
                    </th>
                    <th>
                      Punkti
                    </th>
                    <th>
                      Bilance
                    </th>
                    {allTournaments && allTournaments[playersModalId] && allTournaments[playersModalId].status === 'ended' && (
                      <th>
                        Laimēts
                      </th>
                    )}
                  </tr>
                </thead>
                <tbody className="tournaments-table-body">
                  {Object.keys(tournamentPlayers[playersModalId]).map((key, index) => (
                    <tr key={key} className={`tournaments-table-row ${index % 2 === 0 ? ('odd') : ('even')}`}>
                      <td className="tournaments-table-col">
                        {tournamentPlayers[playersModalId][key].name}
                      </td>
                      <td className="tournaments-table-col">
                        {tournamentPlayers[playersModalId][key].uid}
                      </td>
                      <td className="tournaments-table-col">
                        {tournamentPlayers[playersModalId][key].totalPnts}
                      </td>
                      <td className="tournaments-table-col">
                        {tournamentPlayers[playersModalId][key].bal}
                      </td>
                      {tournamentPlayers[playersModalId][key].winner ? (
                        <td className="tournaments-table-col">
                          {tournamentPlayers[playersModalId][key].winAmount}
                        </td>
                      ) : (
                        <td className="tournaments-table-col">
                          {tournamentPlayers[playersModalId][key].winAmount}
                        </td>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </ModalBody>
          <ModalFooter>
            <Button color="secondary" onClick={this.togglePlayers}>Aizvērt</Button>
          </ModalFooter>
        </Modal>
      </Fragment>
    );
  }
}

export default withRouter(AllBans);
