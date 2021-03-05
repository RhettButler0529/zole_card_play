import React, { Fragment } from 'react';
import PropTypes from 'prop-types';

/* import {
  Row,
  Col,
  Button,
  Pagination,
  PaginationItem,
  PaginationLink,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Label,
  Input,
} from 'reactstrap'; */

import Row from 'reactstrap/lib/Row';
import Col from 'reactstrap/lib/Col';
import Button from 'reactstrap/lib/Button';
import Media from 'reactstrap/lib/Media';
import Pagination from 'reactstrap/lib/Pagination';
import PaginationItem from 'reactstrap/lib/PaginationItem';
import PaginationLink from 'reactstrap/lib/PaginationLink';
import Modal from 'reactstrap/lib/Modal';
import ModalHeader from 'reactstrap/lib/ModalHeader';
import ModalBody from 'reactstrap/lib/ModalBody';
import ModalFooter from 'reactstrap/lib/ModalFooter';
import Label from 'reactstrap/lib/Label';
import Input from 'reactstrap/lib/Input';

import { withRouter } from 'react-router-dom';

import Moment from 'react-moment';

import RoomLogs from './RoomLogs';

class AdminLogsRooms extends React.Component {
  static propTypes = {
    member: PropTypes.shape({
      email: PropTypes.string,
    }),
    //  allRooms: PropTypes.shape({}),
    allRooms: PropTypes.arrayOf(PropTypes.shape({})),
    roomData: PropTypes.shape({}),
    history: PropTypes.shape({
      push: PropTypes.func.isRequired,
    }).isRequired,
    fetchRoomLog: PropTypes.func.isRequired,
    fetchRoomLogsRange: PropTypes.func.isRequired,
    filteredRoomsLogs: PropTypes.shape({}),
    fetchFilteredRoomLogs: PropTypes.func.isRequired,
    roomsPlayedCount: PropTypes.number,
  }

  static defaultProps = {
    member: {},
    allRooms: [],
    roomData: {},
    filteredRoomsLogs: null,
    roomsPlayedCount: 0,
  }

  constructor(props) {
    super(props);
    this.state = {
      currentPage: 0,
      pageSize: 50,
      //  roomFilter: '',
      //  tournamentFilter: '',
      filteredRoomsLogs: null,
      filter: '',
      filterType: 'roomId',
    };

    this.toggle = this.toggle.bind(this);
    this.openModal = this.openModal.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleClick = this.handleClick.bind(this);
  }

  componentWillReceiveProps = (nextProps) => {
    const nextFilteredRoomsLogs = nextProps.filteredRoomsLogs;
    const { filteredRoomsLogs } = this.props;

    if (filteredRoomsLogs && !nextFilteredRoomsLogs) {
      this.setState({ currentPage: 0, filteredRoomsLogs: null });
    } else if (nextFilteredRoomsLogs) {
      this.setState({ currentPage: 0, filteredRoomsLogs: nextFilteredRoomsLogs });
    }
  }

  componentWillUnmount = () => {
    const { fetchFilteredRoomLogs } = this.props;

    fetchFilteredRoomLogs('');
  }


  filter = () => {
    const { fetchFilteredRoomLogs } = this.props;
    const { filter, filterType } = this.state;

    fetchFilteredRoomLogs(filter, filterType);
  }

  selectType = (e) => {
    this.setState({ filterType: e.target.value });
  }

  openModal(room) {
    const { fetchRoomLog } = this.props;

    fetchRoomLog(room.roomId);

    this.setState({
      roomId: room.roomId,
      room,
      openModal: true,
    });
  }

  toggle() {
    this.setState(prevState => ({
      openModal: !prevState.openModal,
    }));
  }

  handleChange(event) {
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

  handleClick(e, index) {
    e.preventDefault();

    const { fetchRoomLogsRange, roomsPlayedCount, filteredRoomsLogs } = this.props;
    if (filteredRoomsLogs && filteredRoomsLogs.length > 0) {
      console.log('has filtered');
    } else {
      const end = roomsPlayedCount - (50 * index);
      const start = roomsPlayedCount - ((50 * index) + 50);


      fetchRoomLogsRange(start, end);
    }
    this.setState({
      currentPage: index,
    });
  }


  table() {
    const {
      allRooms,
      roomsPlayedCount,
    } = this.props;
    const {
      currentPage,
      pageSize,
      filteredRoomsLogs,
    } = this.state;

    let rooms = allRooms;
    let pagesCount = Math.ceil(roomsPlayedCount / pageSize);

    if (filteredRoomsLogs && (filteredRoomsLogs.length || filteredRoomsLogs.length === 0)) {
      rooms = filteredRoomsLogs.slice(
        currentPage * pageSize,
        (currentPage + 1) * pageSize,
      );
      pagesCount = Math.ceil(filteredRoomsLogs.length / pageSize);
    }

    if (!allRooms.length) {
      return null;
    }


    return (
      <Fragment>
        {rooms
          .map((room, index) => (
            <Fragment key={room.roomId}>
              <tr key={room.roomId} className={`allUsers-table-row ${index % 2 === 0 ? ('odd') : ('even')}`}>
                <td className="allUsers-table-col">
                  {room.date && (
                    <Moment format="DD-MM-YYYY, HH:mm:ss" locale="lv">
                      {room.date}
                    </Moment>
                  )}
                </td>
                <td className="allUsers-table-col">
                  {room.roomId}
                </td>
                <td className="allUsers-table-col">
                  {room.tournamentId}
                </td>
                <td className="allUsers-table-col">
                  <Button onClick={() => this.openModal(room)}>
                    Skatīt
                  </Button>
                </td>
              </tr>
            </Fragment>
          ))}
        {roomsPlayedCount > pageSize && (
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
    const {
      openModal, roomId, room, filterType, filter,
    } = this.state;

    const { roomData } = this.props;

    return (
      <Fragment>
        <div style={{ marginTop: 100, color: '#fff' }}>
          <h2>
            Istabas
          </h2>
          <Row>
            <Col sm="5">
              <Label for="filterType">
                Filtrēt pēc
              </Label>
              <Input type="select" className="game-bet-select" value={filterType} onChange={this.selectType}>
                <option value="roomId" style={{ backgroundColor: '#222' }}>Istabas Id</option>
                <option value="tournamentId" style={{ backgroundColor: '#222' }}>Turnīra Id</option>
                <option value="userId" style={{ backgroundColor: '#222' }}>Spēlētāja Id</option>
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
          <table style={{ width: '100%', fontSize: 12, color: '#fff' }}>
            <colgroup>
              <col span="1" className="" />
            </colgroup>
            <thead>
              <tr>
                <th>
                  Datums
                </th>
                <th>
                  Istabas Id
                </th>
                <th>
                  Turnīra Id
                </th>
                <th>
                  Skatīt
                </th>
              </tr>
            </thead>
            <tbody>
              {this.table()}
            </tbody>
          </table>
        </div>
        <Modal isOpen={openModal} toggle={this.toggle} style={{ maxWidth: '65%' }}>
          <ModalHeader toggle={this.toggle}>
            {`Partijas: ${room && room.roomId}`}
          </ModalHeader>
          <ModalBody>
            <RoomLogs roomData={roomData} roomId={roomId} roomParams={room} />
          </ModalBody>
          <ModalFooter>
            <Button color="secondary" onClick={this.toggle}>Aizvērt</Button>
          </ModalFooter>
        </Modal>
      </Fragment>
    );
  }
}

export default withRouter(AdminLogsRooms);
