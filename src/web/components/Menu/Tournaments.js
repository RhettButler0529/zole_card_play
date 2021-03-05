import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
// import Moment from 'react-moment';

import { withTranslation } from 'react-i18next';
// import ReactTableContainer from 'react-table-container';

/* import {
  Row,
  Col,
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Media,
} from 'reactstrap'; */

import Row from 'reactstrap/lib/Row';
import Col from 'reactstrap/lib/Col';
import Button from 'reactstrap/lib/Button';
import Media from 'reactstrap/lib/Media';
import Modal from 'reactstrap/lib/Modal';
import ModalHeader from 'reactstrap/lib/ModalHeader';
import ModalBody from 'reactstrap/lib/ModalBody';
import ModalFooter from 'reactstrap/lib/ModalFooter';

import Leaderboard from './TournamentLeaderboard';
import CustomDate from '../UI/CustomDate';

import tournamentsImg from '../../../images/icons/tournaments.png';

class Tournaments extends React.Component {
  static propTypes = {
    tournaments: PropTypes.shape(),
    tournamentPlayers: PropTypes.shape(),
    myTournamentsData: PropTypes.shape(),
    member: PropTypes.shape(),
    //  i18n: PropTypes.shape(),
    t: PropTypes.func.isRequired,
    joinTournament: PropTypes.func.isRequired,
    joinTournamentRoom: PropTypes.func.isRequired,
    buyTournamentMoney: PropTypes.func.isRequired,
    leaveTournament: PropTypes.func.isRequired,
    changeTab: PropTypes.func.isRequired,
    cancelWaitRoom: PropTypes.func.isRequired,
  }

  static defaultProps = {
    tournaments: {},
    tournamentPlayers: {},
    myTournamentsData: {},
    //  i18n: {},
    member: {},
  }

  constructor(props) {
    super(props);
    this.state = {
      openModal: false,
      openJoinModal: false,
      tournamentId: '',
      tournamentBets: {},
    };

  //  this.toggle = this.toggle.bind(this);
  //  this.openModal = this.openModal.bind(this);
  //  this.joinTournamentNotification = this.joinTournamentNotification.bind(this);
  }

  componentWillMount() {
    const { tournaments } = this.props;
    const tournamentBets = {};

    if (tournaments) {
      Object.keys(tournaments).map((key) => {
        const { bet } = tournaments[key];

        if (bet === '1:1') {
          tournamentBets[key] = 1;
        } else if (bet === '1:5') {
          tournamentBets[key] = 5;
        } else if (bet === '1:10') {
          tournamentBets[key] = 10;
        } else if (bet === '1:25') {
          tournamentBets[key] = 25;
        } else if (bet === '1:50') {
          tournamentBets[key] = 50;
        } else if (bet === '1:100') {
          tournamentBets[key] = 100;
        } else if (bet === '1:500') {
          tournamentBets[key] = 500;
        } else if (bet === '1:1000') {
          tournamentBets[key] = 1000;
        } else if (bet === '1:5000') {
          tournamentBets[key] = 5000;
        } else if (bet === '1:10000') {
          tournamentBets[key] = 10000;
        }
        return null;
      });

      this.setState({ tournamentBets });
    }
  }

  componentWillReceiveProps(nextProps) {
    const { tournaments } = nextProps;
    const tournamentBets = {};

    if (tournaments) {
      Object.keys(tournaments).map((key) => {
        const { bet } = tournaments[key];

        if (bet === '1:1') {
          tournamentBets[key] = 1;
        } else if (bet === '1:5') {
          tournamentBets[key] = 5;
        } else if (bet === '1:10') {
          tournamentBets[key] = 10;
        } else if (bet === '1:25') {
          tournamentBets[key] = 25;
        } else if (bet === '1:50') {
          tournamentBets[key] = 50;
        } else if (bet === '1:100') {
          tournamentBets[key] = 100;
        } else if (bet === '1:500') {
          tournamentBets[key] = 500;
        } else if (bet === '1:1000') {
          tournamentBets[key] = 1000;
        } else if (bet === '1:5000') {
          tournamentBets[key] = 5000;
        } else if (bet === '1:10000') {
          tournamentBets[key] = 10000;
        }
        return null;
      });

      this.setState({ tournamentBets });
    }
  }

  joinTournamentNotification = (tournamentId) => {
    this.setState({
      openJoinModal: true,
      tournamentToJoin: tournamentId,
    });
  }

  toggleJoin = () => {
    this.setState(prevState => ({
      openJoinModal: !prevState.openJoinModal,
    }));
  }

  joinTournament = (tournamentId) => {
    const { joinTournament } = this.props;

    if (tournamentId) {
      joinTournament(tournamentId);
    }

    setTimeout(() => {
      this.setState({
        openJoinModal: false,
        tournamentToJoin: '',
      });
    }, 250);
  }

  openModal = (id) => {
    const { tournamentPlayers } = this.props;
    const leaderboard = tournamentPlayers[id];

    this.setState({
      tournamentId: id,
      openModal: true,
      leaderboard,
    });
  }

  toggle = () => {
    this.setState(prevState => ({
      openModal: !prevState.openModal,
    }));
  }

  buyMoney = (tournamentId) => {
    const { buyTournamentMoney } = this.props;

    buyTournamentMoney(tournamentId);
  }

  cancelWait = (tournamentId) => {
    const { cancelWaitRoom } = this.props;

    cancelWaitRoom(tournamentId);
  }

  toggleJoin = () => {
    this.setState(prevState => ({
      openJoinModal: !prevState.openJoinModal,
    }));
  }

  toggleLeave = () => {
    this.setState(prevState => ({
      openLeaveModal: !prevState.openLeaveModal,
    }));
  }

  leaveTournamentNotification = (tournamentId) => {
    this.setState({
      openLeaveModal: true,
      tournamentToLeave: tournamentId,
    });
  }

  leaveTournament = (tournamentId) => {
    const { leaveTournament } = this.props;

    if (tournamentId) {
      leaveTournament(tournamentId);
    }

    setTimeout(() => {
      this.setState({
        openLeaveModal: false,
        tournamentToLeave: '',
      });
    }, 250);
  }

  //  leaveTournament = (tournamentId) => {
  //    const { leaveTournament } = this.props;
  //    leaveTournament(tournamentId);
  //  }

  render() {
    const {
      t,
      //  i18n,
      tournaments,
      joinTournamentRoom,
      myTournamentsData,
      member,
      changeTab,
    } = this.props;

    const {
      openModal,
      leaderboard,
      tournamentId,
      tournamentToJoin,
      openJoinModal,
      tournamentBets,
      tournamentToLeave,
      openLeaveModal,
    } = this.state;

    return (
      <div className="tournaments">
        <Row className="tournaments-header">
          <Col sm="3">
            <Media src={tournamentsImg} className="tournaments-header-image" />
            <div className="tournaments-header-text">
              {t('tournaments.tournaments')}
            </div>
          </Col>
          <Col sm="2" />
          <Col sm="3">
            <Button
              color="link"
              className="tournaments-header-button"
              onClick={() => changeTab('6')}
            >
              {t('tournaments.futureTournaments')}
            </Button>
          </Col>
          <Col sm="3">
            <Button color="link" className="tournaments-header-button" onClick={() => changeTab('7')}>
              {t('tournaments.tournamentHistory')}
            </Button>
          </Col>
        </Row>

        {/*  <ReactTableContainer
          width="100%"
          height="350px"
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
              background: 'ddd',
              width: 2,
              left: -3,
            },

            foregroundFocus: {
              background: 'ddd',
              width: 2,
              left: -3,
            },
          }}
        > */}
        <table className="tournaments-table">
          <colgroup>
            <col span="1" />
          </colgroup>
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
              {/*  <th>
                {t('tournaments.endTime')}
              </th> */}
              <th className="tournaments-table-header-col">
                {t('tournaments.tournamentBal')}
              </th>

            </tr>
          </thead>
          <tbody className="tournaments-table-body">
            {tournaments && Object.keys(tournaments).map(key => (
                <Fragment key={key}>
                  {tournaments && tournaments[key]
                     && (tournaments[key].status === 'running' || tournaments[key].status === 'paused') && (
                     <tr key={key} className="tournaments-table-row">
                       <td className="tournaments-table-col">
                         {(!myTournamentsData || (myTournamentsData && !myTournamentsData[key])
                         || (myTournamentsData && myTournamentsData[key] && !myTournamentsData[key].registered))
                      && tournaments[key].registrationStart < (Date.now() + member.offset)
                      && tournaments[key].registrationEnd > (Date.now() + member.offset) && (
                      <div className="tournaments-table-col tournaments-table-button-col" style={{ width: '100%' }}>
                        <Button className="tournaments-table-button" onClick={() => this.joinTournamentNotification(key)}>
                          {t('tournaments.register')}
                        </Button>
                      </div>
                         )}
                         {myTournamentsData && myTournamentsData[key]
                           && myTournamentsData[key].registered
                           && tournaments[key].running === true && (
                           <Fragment>
                             {myTournamentsData && myTournamentsData[key]
                           && myTournamentsData[key].status ? (
                             <Fragment>
                               <div className="tournaments-table-col tournaments-table-button-col">
                                 <div className="tournaments-table-waiting" onClick={() => {}}>
                                   {t('tournaments.waitingForRoom')}
                                 </div>
                               </div>
                               <div className="tournaments-table-col tournaments-table-button-col">
                                 <Button className="tournaments-table-button" onClick={() => this.cancelWait(key)}>
                                 Atcelt
                                 </Button>
                               </div>
                             </Fragment>
                               ) : (
                                 <Fragment>
                                   {myTournamentsData[key]
                                 && tournamentBets[key] * 16 >= myTournamentsData[key].bal ? (
                                   <div className="tournaments-table-col tournaments-table-button-col">
                                     <Button className="tournaments-table-button" onClick={() => this.buyMoney(key)}>
                                       {t('tournaments.buy')}
                                     </Button>
                                   </div>
                                     ) : (
                                       <div className="tournaments-table-col tournaments-table-button-col">
                                         <Button className="tournaments-table-button" onClick={() => joinTournamentRoom(key)}>
                                           {t('tournaments.play')}
                                         </Button>
                                       </div>
                                     )}

                                   <div className="tournaments-table-col tournaments-table-button-col">
                                     <Button className="tournaments-table-button" onClick={() => this.leaveTournamentNotification(key)}>
                                       {t('tournaments.leave')}
                                     </Button>
                                   </div>
                                 </Fragment>
                               )}
                           </Fragment>
                         )}
                       </td>

                       <td className="tournaments-table-col">
                         {tournaments[key].name}
                       </td>
                       <td className="tournaments-table-col">
                         {tournaments[key].totalBank}
                       </td>
                       <td className="tournaments-table-col">
                         {tournaments[key].entryFee}
                       </td>
                       <td className="tournaments-table-col">
                         <div>
                          {/* <Moment format="DD.MM.YYYY">
                             {tournaments[key].startDate}
                           </Moment> */}
                           <CustomDate format="DD.MM.YYYY" date={tournaments[key].startDate} />
                         </div>
                         <div>
                          {/* <Moment format="HH:mm">
                             {tournaments[key].startTime}
                           </Moment> */}
                           <CustomDate format="hh:mm" date={tournaments[key].startTime} />
                         </div>
                       </td>
                       <td className="tournaments-table-col">
                         {myTournamentsData && myTournamentsData[key] && myTournamentsData[key].bal}
                       </td>
                       {/*   {(!myTournamentsData || (myTournamentsData && !myTournamentsData[key]))
                        && tournaments[key].registrationStart < (Date.now() + member.offset)
                        && tournaments[key].registrationEnd > (Date.now() + member.offset) && (
                        <td className="tournaments-table-col" style={{ width: '13%' }}>
                          <Button className="tournaments-table-button" onClick={() => this.joinTournamentNotification(key)}>
                            {t('tournaments.register')}
                          </Button>
                        </td>
                       )}
                       {myTournamentsData && myTournamentsData[key]
                         && tournaments[key].running === true && (
                         <Fragment>
                           {myTournamentsData && myTournamentsData[key]
                             && myTournamentsData[key].status ? (
                               <td className="tournaments-table-col" style={{ width: '13%' }}>
                                 <Button className="tournaments-table-button" onClick={() => {}}>
                                   {t('tournaments.waitingForRoom')}
                                 </Button>
                               </td>
                             ) : (
                               <Fragment>
                                 {myTournamentsData[key]
                                   && tournamentBets[key] * 16 >= myTournamentsData[key].bal ? (
                                     <td className="tournaments-table-col" style={{ width: '13%' }}>
                                       <Button className="tournaments-table-button" onClick={() => this.buyMoney(key)}>
                                         {t('tournaments.buy')}
                                       </Button>
                                     </td>
                                   ) : (
                                     <td className="tournaments-table-col" style={{ width: '13%' }}>
                                       <Button className="tournaments-table-button" onClick={() => joinTournamentRoom(key)}>
                                         {t('tournaments.play')}
                                       </Button>
                                     </td>
                                   )}

                                 <td className="tournaments-table-col" style={{ width: '13%' }}>
                                   <Button className="tournaments-table-button" onClick={() => this.leaveTournamentNotification(key)}>
                                     {t('tournaments.leave')}
                                   </Button>
                                 </td>
                               </Fragment>
                             )}
                         </Fragment>
                       )} */}
                       {/*   <td className="tournaments-table-col" style={{ width: '13%' }}>
                         <Button className="tournaments-table-button" onClick={() => this.openModal(key)}>
                           {t('tournaments.leaderboard')}
                         </Button>
                       </td>  */}
                     </tr>
                  )}
                </Fragment>
              ))}
          </tbody>
        </table>
        {/*  </ReactTableContainer>  */}
        <Modal isOpen={openModal} toggle={this.toggle}>
          <ModalHeader toggle={this.toggle}>
            {t('tournaments.top')}
          </ModalHeader>
          <ModalBody>
            <Leaderboard leaderboard={leaderboard} tournamentId={tournamentId} />
          </ModalBody>
          <ModalFooter>
            <Button color="secondary" onClick={this.toggle}>{t('tournaments.close')}</Button>
          </ModalFooter>
        </Modal>
        <Modal isOpen={openJoinModal} toggle={this.toggleJoin}>
          <ModalHeader toggle={this.toggleJoin}>
            {t('tournaments.joinTournament')}
          </ModalHeader>
          <ModalBody>
            {`Vai tiešām vēlies pievienoties turnīram? Dalības maksa ${tournamentToJoin && tournaments[tournamentToJoin] && tournaments[tournamentToJoin].entryFee} EUR`}
          </ModalBody>
          <ModalFooter>
            <Button className="modal-footer-button" onClick={() => this.joinTournament(tournamentToJoin)}>
              {t('tournaments.register')}
            </Button>
            <Button className="modal-footer-button" color="secondary" onClick={this.toggleJoin}>{t('tournaments.close')}</Button>
          </ModalFooter>
        </Modal>
        <Modal isOpen={openLeaveModal} toggle={this.toggleLeave}>
          <ModalHeader toggle={this.toggleLeave}>
            {t('tournaments.leaveTournament')}
          </ModalHeader>
          <ModalBody>
            {t('tournaments.leaveTournamentBody')}
          </ModalBody>
          <ModalFooter>
            <Button onClick={() => this.leaveTournament(tournamentToLeave)}>
              {t('tournaments.leave')}
            </Button>
            <Button color="secondary" onClick={this.toggleLeave}>{t('tournaments.close')}</Button>
          </ModalFooter>
        </Modal>
      </div>
    );
  }
}

export default withTranslation('common')(Tournaments);
