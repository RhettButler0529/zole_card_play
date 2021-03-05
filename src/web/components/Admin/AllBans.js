import React, { Fragment } from 'react';
import PropTypes from 'prop-types';

import Moment from 'react-moment';
// import 'imrc-datetime-picker/dist/imrc-datetime-picker.min.css';
// import { DatetimePickerTrigger } from 'imrc-datetime-picker';

import ReactDateTime from 'react-datetime';
import 'react-datetime/css/react-datetime.css';

import moment from 'moment';

/* import {
  Form,
  FormGroup,
  Label,
  Input,
  Button,
  Pagination,
  PaginationItem,
  PaginationLink,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from 'reactstrap'; */

import Button from 'reactstrap/lib/Button';
import Pagination from 'reactstrap/lib/Pagination';
import PaginationItem from 'reactstrap/lib/PaginationItem';
import PaginationLink from 'reactstrap/lib/PaginationLink';
import Modal from 'reactstrap/lib/Modal';
import ModalHeader from 'reactstrap/lib/ModalHeader';
import ModalBody from 'reactstrap/lib/ModalBody';
import ModalFooter from 'reactstrap/lib/ModalFooter';
import Label from 'reactstrap/lib/Label';
import Input from 'reactstrap/lib/Input';
import Form from 'reactstrap/lib/Form';
import FormGroup from 'reactstrap/lib/FormGroup';

import { withRouter } from 'react-router-dom';

class AllBans extends React.Component {
  static propTypes = {
    member: PropTypes.shape({
      email: PropTypes.string,
    }),
    allBans: PropTypes.shape({}),
    allUsers: PropTypes.shape({}),
    history: PropTypes.shape({
      push: PropTypes.func.isRequired,
    }).isRequired,
    editBan: PropTypes.func.isRequired,
    unblockUser: PropTypes.func.isRequired,
  }

  static defaultProps = {
    member: {},
    allBans: {},
    allUsers: {},
  }

  constructor(props) {
    super(props);
    this.state = {
      currentPage: 0,
      pageSize: 50,
      userId: null,
      reason: '',
      endDate: moment(),
    };

    this.handleClick = this.handleClick.bind(this);
    this.editBan = this.editBan.bind(this);
    this.toggle = this.toggle.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.changeEndDate = this.changeEndDate.bind(this);
  }

  componentWillMount() {
  }

  handleChange = (event) => {
    const value = event.target.type === 'checkbox' ? event.target.checked : event.target.value;

    this.setState({
      [event.target.name]: value,
    });
  }

  changeEndDate = (date) => {
    this.setState({ endDate: date });
  }

  unblockUser = (uid) => {
    const { unblockUser } = this.props;

    unblockUser(uid);
  }

  openModal(uid) {
    const { allBans } = this.props;
    const user = allBans[uid];

    this.setState({
      userId: uid,
      openModal: true,
      reason: user.reason,
      endDate: moment(user.endDate),
    });
  }

  editBan() {
    const { editBan } = this.props;
    const {
      userId, reason, endDate,
    } = this.state;

    //  const endDateParsed = Date.parse(endDate);

    editBan(userId, endDate, reason);
    this.setState({ openModal: false });
  }

  toggle() {
    this.setState(prevState => ({
      openModal: !prevState.openModal,
    }));
  }

  handleClick(e, index) {
    e.preventDefault();
    this.setState({
      currentPage: index,
    });
  }

  table() {
    const {
      allBans,
    } = this.props;
    const {
      currentPage,
      pageSize,
    } = this.state;

    const pagesCount = Math.ceil(Object.keys(allBans).length / pageSize);

    return (
      <Fragment>
        {allBans && Object.keys(allBans)
          .slice(
            currentPage * pageSize,
            (currentPage + 1) * pageSize,
          )
          .map((key, index) => (
            <Fragment key={key}>
              <tr key={key} className={`allUsers-table-row ${index % 2 === 0 ? ('odd') : ('even')}`}>
                <td className="allUsers-table-col">
                  {allBans[key].name}
                </td>
                <td className="allUsers-table-col">
                  <Moment format="DD-MM-YYYY, HH:mm" locale="lv">
                    {allBans[key].endDate}
                  </Moment>
                </td>
                <td className="allUsers-table-col">
                  {allBans[key].reason}
                </td>
                <td className="allUsers-table-col">
                  {allBans[key].uid}
                </td>
                <td className="allUsers-table-col">
                  <Button color="primary" onClick={() => this.openModal(key)}>
                    Labot
                  </Button>
                </td>
                <td className="allUsers-table-col">
                  {allBans[key].blocked ? (
                    <Button color="danger" onClick={() => this.unblockUser(key)}>
                    Atbloķēt
                    </Button>
                  ) : (
                    'Beidzies'
                  )}
                </td>
              </tr>
            </Fragment>
          ))}
        {Object.keys(allBans).length > pageSize && (
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
      endDate,
      reason,
      openModal,
    } = this.state;

    return (
      <Fragment>
        <div style={{ marginTop: 100, color: '#fff' }}>
          <h2>
            Visi bloķētie lietotāji
          </h2>
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
                  Beigsies
                </th>
                <th style={{ textAlign: 'center' }}>
                  Iemesls
                </th>
                <th style={{ textAlign: 'center' }}>
                  Uid
                </th>
                <th style={{ textAlign: 'center' }}>
                  Labot
                </th>
                <th style={{ textAlign: 'center' }}>
                  Atbloķēt
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
            Labot banu
          </ModalHeader>
          <ModalBody>
            <Form>
              <FormGroup>
                <Label for="endDate">
                  Līdz
                </Label>
                {/*  <DatetimePickerTrigger
                  id="endDate"
                  shortcuts={shortcuts}
                  moment={endDate}
                  onChange={this.changeEndDate}
                >
                  <input type="text" value={endDate.format('YYYY-MM-DD HH:mm')} readOnly />
                </DatetimePickerTrigger> */}
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
            <Button color="primary" onClick={this.editBan}>Labot</Button>
            {' '}
            <Button color="secondary" onClick={this.toggle}>Aizvērt</Button>
          </ModalFooter>
        </Modal>
      </Fragment>
    );
  }
}

export default withRouter(AllBans);
