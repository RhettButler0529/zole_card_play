import React, { Fragment } from 'react';
import PropTypes from 'prop-types';

import { withTranslation } from 'react-i18next';
import ReactTableContainer from 'react-table-container';

/* import {
  Row,
  Col,
  Button,
  Media,
  Modal,
  ModalHeader,
  ModalBody,
} from 'reactstrap'; */

import Row from 'reactstrap/lib/Row';
import Col from 'reactstrap/lib/Col';
import Button from 'reactstrap/lib/Button';
import Media from 'reactstrap/lib/Media';
import Modal from 'reactstrap/lib/Modal';
import ModalHeader from 'reactstrap/lib/ModalHeader';
import ModalBody from 'reactstrap/lib/ModalBody';

import TournamentHistory from './TournamentHistory';
import CustomDate from '../UI/CustomDate';

import closeImg from '../../../images/icons/close.png';
import tournamentsImg from '../../../images/icons/tournaments.png';

class TournamentsHistory extends React.Component {
  static propTypes = {
    tournamentsHistory: PropTypes.shape(),
    tournamentsHistoryPlayers: PropTypes.shape(),
    t: PropTypes.func.isRequired,
    fetchTournamentHistory: PropTypes.func.isRequired,
    fetchTournamentsHistory: PropTypes.func.isRequired,
    changeTab: PropTypes.func.isRequired,
  }

  static defaultProps = {
    tournamentsHistory: {},
    tournamentsHistoryPlayers: {},
  }

  constructor(props) {
    super(props);
    this.state = {
      openModal: false,
      tournamentId: '',
      tournaments: [],
    };

    this.toggle = this.toggle.bind(this);
    this.openModal = this.openModal.bind(this);
  }

  componentWillMount() {
    const { fetchTournamentsHistory } = this.props;

    fetchTournamentsHistory();
  }

  componentDidMount() {
    const { tournamentsHistory } = this.props;

    const tournaments = Object.keys(tournamentsHistory).map(key => ({
      id: key,
      name: tournamentsHistory[key].name,
      entryFee: tournamentsHistory[key].entryFee,
      winningPot: tournamentsHistory[key].winningPot,
      totalBank: tournamentsHistory[key].totalBank,
      startTime: tournamentsHistory[key].startTime,
      endTime: tournamentsHistory[key].endTime,
      startDate: tournamentsHistory[key].startDate,
      endDate: tournamentsHistory[key].endDate,
      //  startHours,
      //  startMinutes,
      //  endHours,
      //  endMinutes,
    }));

    tournaments.sort((a, b) => b.startTime - a.startTime);
    this.setState({ tournaments });
  }

  componentWillReceiveProps(nextProps) {
    const { tournamentsHistory } = nextProps;

    const tournaments = Object.keys(tournamentsHistory).map(key => ({
      id: key,
      name: tournamentsHistory[key].name,
      entryFee: tournamentsHistory[key].entryFee,
      winningPot: tournamentsHistory[key].winningPot,
      totalBank: tournamentsHistory[key].totalBank,
      startTime: tournamentsHistory[key].startTime,
      endTime: tournamentsHistory[key].endTime,
      startDate: tournamentsHistory[key].startDate,
      endDate: tournamentsHistory[key].endDate,
      //  startHours: new Date(tournamentsHistory[key].startTime).getHours(),
      //  startMinutes: new Date(tournamentsHistory[key].startTime).getMinutes(),
      //  endHours: new Date(tournamentsHistory[key].endTime).getHours(),
      //  endMinutes: new Date(tournamentsHistory[key].endTime).getMinutes(),
    }));

    tournaments.sort((a, b) => b.startTime - a.startTime);
    this.setState({ tournaments });
  }

  openModal(id) {
    const { fetchTournamentHistory } = this.props;

    fetchTournamentHistory(id);

    this.setState({
      tournamentId: id,
      openModal: true,
    });
  }

  toggle() {
    this.setState(prevState => ({
      openModal: !prevState.openModal,
    }));
  }

  render() {
    const {
      t,
      tournamentsHistoryPlayers,
      changeTab,
    } = this.props;

    const { openModal, tournamentId, tournaments } = this.state;

    return (
      <div className="tournaments">
        <Row className="tournaments-header">
          <Col sm="3">
          <Media src={tournamentsImg} className="tournaments-header-image" />
            <div className="tournaments-header-text">
            Turnīri
            </div>
          </Col>
          <Col sm="2" />
          <Col sm="3">
            <Button
              color="link"
              className="tournaments-header-button"
              onClick={() => changeTab('6')}
            >
              Nākotnes turnīri
            </Button>
          </Col>
          <Col sm="3">
            <Button color="link" className="tournaments-header-button" onClick={() => changeTab('7')}>
            Turnīru vēsture
            </Button>
          </Col>
        </Row>
        <table className="top-table-header">
          <thead className="tournaments-table-header">
            <tr>
              <th />
              <th className="tournaments-table-header-col">
                {t('tournaments.title')}
              </th>
              <th className="tournaments-table-header-col">
                {t('tournaments.winningPot')}
              </th>
              <th className="tournaments-table-header-col">
                {t('tournaments.entryFee')}
              </th>
              <th className="tournaments-table-header-col">
                {t('tournaments.startTime')}
              </th>
              <th className="tournaments-table-header-col">
                {t('tournaments.endTime')}
              </th>
            </tr>
          </thead>
          <tbody />
        </table>
        <ReactTableContainer
          width="100%"
          height="300px"
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
          <table className="tournaments-table">
            <colgroup>
              <col span="1" />
            </colgroup>
            {/*  <thead className="tournaments-table-header">
              <tr>
                <th />
                <th className="tournaments-table-header-col">
                  {t('tournaments.title')}
                </th>
                <th className="tournaments-table-header-col">
                  {t('tournaments.winningPot')}
                </th>
                <th className="tournaments-table-header-col">
                  {t('tournaments.entryFee')}
                </th>
                <th className="tournaments-table-header-col">
                  {t('tournaments.startTime')}
                </th>
                <th className="tournaments-table-header-col">
                  {t('tournaments.endTime')}
                </th>
              </tr>
            </thead> */}
            <thead />
            <tbody className="tournaments-table-body">
              {tournaments && tournaments.map((tournament) => {
                const {
                //  startHours,
                //  startMinutes,
                  startTime,
                  startDate,
                  //  endHours,
                  //  endMinutes,
                  endDate,
                  endTime,
                } = tournament;

                //  const startHours = Date.parse(startTime).getHours();
                //  const startMinutes = Date.parse(startTime).getMinutes();
                //  const endHours = Date.parse(endTime).getHours();
                //  const endMinutes = Date.parse(endTime).getMinutes();

                //  const start = new Date(startDate);
                //  const end = new Date(endDate);

                /*    start.setMinutes(startMinutes);
              start.setHours(startHours);

              end.setMinutes(endMinutes);
              end.setHours(endHours); */

                return (
                  <Fragment key={tournament.id}>
                    <tr key={tournament.id} className="tournaments-table-row">
                      <td className="tournaments-table-col">
                        <Button className="tournaments-table-button" onClick={() => this.openModal(tournament.id)}>
                          {t('tournaments.leaderboard')}
                        </Button>
                      </td>
                      <td className="tournaments-table-col">
                        {tournament.name}
                      </td>
                      <td className="tournaments-table-col">
                        {tournament.totalBank}
                      </td>
                      <td className="tournaments-table-col">
                        {tournament.entryFee}
                      </td>
                      <td className="tournaments-table-col">
                        <div>
                        {/*  <Moment format="DD.MM.YYYY">
                            {startDate}
                          </Moment> */}
                          <CustomDate format="DD.MM.YYYY" date={startDate} />
                        </div>
                        <div>
                        {/*  <Moment format="HH:mm">
                            {startTime}
                          </Moment> */}
                          <CustomDate format="hh:mm" date={startTime} />
                        </div>
                      </td>
                      <td className="tournaments-table-col">
                        <div>
                        {/*  <Moment format="DD.MM.YYYY">
                            {endDate}
                          </Moment> */}
                          <CustomDate format="DD.MM.YYYY" date={endDate} />
                        </div>
                        <div>
                        {/*  <Moment format="HH:mm">
                            {endTime}
                          </Moment> */}
                          <CustomDate format="hh:mm" date={endTime} />
                        </div>
                      </td>

                    </tr>
                  </Fragment>
                );
              })}
            </tbody>
          </table>
        </ReactTableContainer>
        <Modal isOpen={openModal} toggle={this.toggle} className="tournaments-modal">
          <ModalHeader toggle={this.toggle} close={<Media onClick={this.toggle} src={closeImg} className="tournaments-modal-close" alt="X" />}>
            {t('tournaments.tournamentPlayers')}
          </ModalHeader>
          <ModalBody>
            <TournamentHistory
              tournamentPlayers={tournamentsHistoryPlayers
                && tournamentsHistoryPlayers[tournamentId]}
              tournamentId={tournamentId}
            />
          </ModalBody>
        </Modal>
      </div>
    );
  }
}

export default withTranslation('common')(TournamentsHistory);
