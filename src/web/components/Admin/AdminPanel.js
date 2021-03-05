import React from 'react';
import PropTypes from 'prop-types';

/*import {
  Row,
  Col,
  TabContent,
  TabPane,
  Nav,
  NavItem,
  NavLink,
} from 'reactstrap'; */

import Row from 'reactstrap/lib/Row';
import Col from 'reactstrap/lib/Col';
import TabContent from 'reactstrap/lib/TabContent';
import TabPane from 'reactstrap/lib/TabPane';
import Nav from 'reactstrap/lib/Nav';
import NavItem from 'reactstrap/lib/NavItem';
import NavLink from 'reactstrap/lib/NavLink';
import Button from 'reactstrap/lib/Button';

import { withRouter } from 'react-router-dom';

import AllUsers from './AllUsers';
import AllVipUsers from './AllVipUsers';
import AllBans from './AllBans';
import AllTransactions from './AllTransactions';
import AllTournaments from './AllTournaments';
// import ErrorSubmitions from './ErrorSubmitions';
import UserMessages from './UserMessages';

import AdminLogsContainer from '../../../containers/Admin/AdminLogs';
import AdminLogsComponent from './AdminLogsRooms';

class AdminPanel extends React.Component {
  static propTypes = {
    member: PropTypes.shape({
      email: PropTypes.string,
    }),
    allUsers: PropTypes.shape({}),
    usersCount: PropTypes.number,
    filteredUsers: PropTypes.shape({}),
    userBalanceHistory: PropTypes.shape({}),
    allPayments: PropTypes.shape({}),
    paymentsCount: PropTypes.number,
    allVipUsers: PropTypes.shape({}),
    allBans: PropTypes.shape({}),
    bansCount: PropTypes.number,
    allTransactions: PropTypes.shape({}),
    allTournaments: PropTypes.shape({}),
    tournamentPlayers: PropTypes.shape({}),
    activeMessages: PropTypes.shape({}),
    readMessages: PropTypes.arrayOf(PropTypes.shape({})),
    unreadMessages: PropTypes.arrayOf(PropTypes.shape({})),
    chatMessages: PropTypes.shape({}),
    history: PropTypes.shape({
      push: PropTypes.func.isRequired,
    }).isRequired,
    deleteUser: PropTypes.func.isRequired,
    toggleLogRocket: PropTypes.func.isRequired,
    blockUser: PropTypes.func.isRequired,
    unblockUser: PropTypes.func.isRequired,
    editUser: PropTypes.func.isRequired,
    fetchAllUsers: PropTypes.func.isRequired,
    fetchFilteredUsers: PropTypes.func.isRequired,
    fetchUsersRange: PropTypes.func.isRequired,
    fetchAllVipUsers: PropTypes.func.isRequired,
    editBan: PropTypes.func.isRequired,
    editTournament: PropTypes.func.isRequired,
    addTournament: PropTypes.func.isRequired,
    deleteTournament: PropTypes.func.isRequired,
    fetchTournamentPlayers: PropTypes.func.isRequired,
    answerSupportMessage: PropTypes.func.isRequired,
    setSupportMessageAsResponded: PropTypes.func.isRequired,
    messageAll: PropTypes.func.isRequired,
    getUserMessages: PropTypes.func.isRequired,
    cancelUserMessages: PropTypes.func.isRequired,
    showNotification: PropTypes.func.isRequired,
    fetchPaymentsRange: PropTypes.func.isRequired,
    fetchUserBalanceHistory: PropTypes.func.isRequired,
    fetchBansRange: PropTypes.func.isRequired,
    toggleSmartLook: PropTypes.func.isRequired,
  }

  static defaultProps = {
    member: {},
    allUsers: {},
    usersCount: 0,
    filteredUsers: {},
    userBalanceHistory: {},
    allPayments: {},
    paymentsCount: 0,
    allVipUsers: {},
    allBans: {},
    bansCount: 0,
    allTransactions: {},
    allTournaments: {},
    tournamentPlayers: {},
    activeMessages: {},
    readMessages: {},
    unreadMessages: {},
    chatMessages: {},
  }

  constructor(props) {
    super(props);
    this.state = {
      activeTab: '0',
    };

    this.toggle = this.toggle.bind(this);
  }

  toggle(tab) {
    const { activeTab } = this.state;
    if (activeTab !== tab) {
      this.setState({
        activeTab: tab,
      });
    }
  }

  toggleSmartLook = () => {
    const { smartLookStatus, toggleSmartLook } = this.props;

    toggleSmartLook(!smartLookStatus);
  }

  render() {
    const {
      allUsers,
      usersCount,
      filteredUsers,
      allVipUsers,
      allBans,
      //  allTransactions,
      deleteUser,
      toggleLogRocket,
      blockUser,
      unblockUser,
      editUser,
      fetchAllUsers,
      fetchUsersRange,
      fetchFilteredUsers,
      fetchAllVipUsers,
      editBan,
      allTournaments,
      editTournament,
      addTournament,
      deleteTournament,
      tournamentPlayers,
      fetchTournamentPlayers,
      showNotification,
      answerSupportMessage,
      setSupportMessageAsResponded,
      messageAll,
      //  activeMessages,
      readMessages,
      unreadMessages,
      chatMessages,
      getUserMessages,
      cancelUserMessages,
      allPayments,
      paymentsCount,
      fetchPaymentsRange,
      fetchBansRange,
      bansCount,
      fetchUserBalanceHistory,
      userBalanceHistory,
      smartLookStatus,
    } = this.props;

    const { activeTab } = this.state;

    return (
      <div className="admin-panel">
        <Nav tabs style={{ color: '#fff' }}>
          <NavItem>
            <NavLink
              className={{ active: activeTab === '1' }}
              onClick={() => { this.toggle('1'); }}
            >
              Lietotāji
            </NavLink>
          </NavItem>
          <NavItem>
            <NavLink
              className={{ active: activeTab === '2' }}
              onClick={() => { this.toggle('2'); }}
            >
              Vips
            </NavLink>
          </NavItem>
          <NavItem>
            <NavLink
              className={{ active: activeTab === '3' }}
              onClick={() => { this.toggle('3'); }}
            >
              Bani
            </NavLink>
          </NavItem>
          <NavItem>
            <NavLink
              className={{ active: activeTab === '4' }}
              onClick={() => { this.toggle('4'); }}
            >
                Pārskaitījumi
            </NavLink>
          </NavItem>
          <NavItem>
            <NavLink
              className={{ active: activeTab === '5' }}
              onClick={() => { this.toggle('5'); }}
            >
                Turnīri
            </NavLink>
          </NavItem>
          <NavItem>
            <NavLink
              className={{ active: activeTab === '6' }}
              onClick={() => { this.toggle('6'); }}
            >
                Logs
            </NavLink>
          </NavItem>
          <NavItem>
            <NavLink
              className={{ active: activeTab === '7' }}
              onClick={() => { this.toggle('7'); }}
            >
              Lietotāju sarakstes
            </NavLink>
          </NavItem>
        </Nav>
        <Button onClick={this.toggleSmartLook}>
          {`${smartLookStatus ? 'Izslēgt' : 'Ieslēgt'} smartlook`}
        </Button>
        <TabContent activeTab={activeTab}>
          <TabPane tabId="1">
            <Row>
              <Col md="12">
                <AllUsers
                  allUsers={allUsers}
                  usersCount={usersCount}
                  userBalanceHistory={userBalanceHistory}
                  filteredUsers={filteredUsers}
                  fetchAllUsers={fetchAllUsers}
                  fetchUsersRange={fetchUsersRange}
                  fetchFilteredUsers={fetchFilteredUsers}
                  deleteUser={deleteUser}
                  toggleLogRocket={toggleLogRocket}
                  blockUser={blockUser}
                  editUser={editUser}
                  fetchUserBalanceHistory={fetchUserBalanceHistory}
                />
              </Col>
            </Row>
          </TabPane>
          <TabPane tabId="2">
            <Row>
              <Col md="12">
                <AllVipUsers
                  allVipUsers={allVipUsers}
                  fetchAllVipUsers={fetchAllVipUsers}
                />
              </Col>
            </Row>
          </TabPane>
          <TabPane tabId="3">
            <Row>
              <Col md="12">
                <AllBans
                  allBans={allBans}
                  bansCount={bansCount}
                  editBan={editBan}
                  unblockUser={unblockUser}
                  fetchBansRange={fetchBansRange}
                />
              </Col>
            </Row>
          </TabPane>
          <TabPane tabId="4">
            <Row>
              <Col md="12">
                <AllTransactions
                //  allTransactions={allTransactions}
                  allPayments={allPayments}
                  paymentsCount={paymentsCount}
                  fetchPaymentsRange={fetchPaymentsRange}
                />
              </Col>
            </Row>
          </TabPane>
          <TabPane tabId="5">
            <Row>
              <Col md="12">
                <AllTournaments
                  allTournaments={allTournaments}
                  tournamentPlayers={tournamentPlayers}
                  allUsers={allUsers}
                  editTournament={editTournament}
                  addTournament={addTournament}
                  deleteTournament={deleteTournament}
                  fetchTournamentPlayers={fetchTournamentPlayers}
                />
              </Col>
            </Row>
          </TabPane>
          <TabPane tabId="6">
            <Row>
              <Col sm="12">
                <AdminLogsContainer
                  Layout={AdminLogsComponent}
                  showNotification={showNotification}
                />
              </Col>
            </Row>
          </TabPane>
          {activeTab === '7' && (
            <TabPane tabId="7">
              <Row>
                <Col sm="12">
                  <UserMessages
                    answerSupportMessage={answerSupportMessage}
                    setSupportMessageAsResponded={setSupportMessageAsResponded}
                    messageAll={messageAll}
                    getUserMessages={getUserMessages}
                    cancelUserMessages={cancelUserMessages}
                  //  allChats={activeMessages}
                    readMessages={readMessages}
                    unreadMessages={unreadMessages}
                    chatMessages={chatMessages}
                  />
                </Col>
              </Row>
            </TabPane>
          )}
        </TabContent>
      </div>
    );
  }
}

export default withRouter(AdminPanel);
