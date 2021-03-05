import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { withRouter } from 'react-router-dom';
import { Firebase } from '../../lib/firebase';

import {
  getAllUsers,
  //  getUsersCount,
  getAllVipUsers,
  deleteUser,
  toggleLogRocket,
  blockUser,
  unblockUser,
  editUser,
  getAllBans,
  editBan,
  getAllTournaments,
  addTournament,
  editTournament,
  deleteTournament,
  getTournamentPlayers,
  getUserMessages,
  cancelUserMessages,
  answerSupportMessage,
  //  getActiveMessages,
  setSupportMessageAsResponded,
  messageAll,
  getUserCount,
  getUsersRange,
  getFilteredUsers,
  getActiveReadMessages,
  getActiveUnreadMessages,
  getPaymentsRange,
  getPaymentsCount,
  getBansRange,
  getBansCount,
  getUserBalanceHistory,
  getSmartLookEnabled,
  changeSmartLook,
  getCardPlayedLog,
//  getCardPlayedLog2,
} from '../../actions/admin';

class Admin extends Component {
  static propTypes = {
    Layout: PropTypes.func.isRequired,
    history: PropTypes.shape({
      push: PropTypes.func.isRequired,
    }).isRequired,
    member: PropTypes.shape({
      role: PropTypes.shape({}),
    }),
    admin: PropTypes.shape({
      allUsers: PropTypes.shape({}),
      //  allUsersLastKey: PropTypes.shape({}),
      vipUsers: PropTypes.shape({}),
      allBans: PropTypes.shape({}),
      allTransactions: PropTypes.shape({}),
      allTournaments: PropTypes.shape({}),
      tournamentPlayers: PropTypes.shape({}),
      chatMessages: PropTypes.shape({}),
      userCount: PropTypes.number,
      filteredUsers: PropTypes.shape({}),
      allPayments: PropTypes.shape({}),
      paymentsCount: PropTypes.number,
      userBalanceHistory: PropTypes.shape({}),
      bansCount: PropTypes.number,
      readMessages: PropTypes.shape({}),
      unreadMessages: PropTypes.shape({}),
    }),
    match: PropTypes.shape({ params: PropTypes.shape({}) }),
    fetchAllUsers: PropTypes.func.isRequired,
    fetchUsersRange: PropTypes.func.isRequired,
    fetchPaymentsRange: PropTypes.func.isRequired,
    fetchBansRange: PropTypes.func.isRequired,
    fetchBansCount: PropTypes.func.isRequired,
    fetchUserBalanceHistory: PropTypes.func.isRequired,
    fetchFilteredUsers: PropTypes.func.isRequired,
    fetchUserCount: PropTypes.func.isRequired,
    fetchPaymentsCount: PropTypes.func.isRequired,
    fetchAllVipUsers: PropTypes.func.isRequired,
    fetchAllBans: PropTypes.func.isRequired,
    deleteAUser: PropTypes.func.isRequired,
    blockAUser: PropTypes.func.isRequired,
    unblockAUser: PropTypes.func.isRequired,
    editAUser: PropTypes.func.isRequired,
    showNotification: PropTypes.func.isRequired,
    editABan: PropTypes.func.isRequired,
    fetchAllTournaments: PropTypes.func.isRequired,
    addATournament: PropTypes.func.isRequired,
    editATournament: PropTypes.func.isRequired,
    deleteATournament: PropTypes.func.isRequired,
    fetchTournamentPlayers: PropTypes.func.isRequired,
    fetchUserMessages: PropTypes.func.isRequired,
    fetchActiveUnreadMessages: PropTypes.func.isRequired,
    fetchActiveReadMessages: PropTypes.func.isRequired,
    answerSupportMsg: PropTypes.func.isRequired,
    setSupportMsgAsResponded: PropTypes.func.isRequired,
    messageAllUsers: PropTypes.func.isRequired,
    fetchSmartLookEnabled: PropTypes.func.isRequired,
    toggleSmartLook: PropTypes.func.isRequired,
  }

  static defaultProps = {
    match: null,
    member: {},
    admin: {},
  }

  constructor(props) {
    super(props);
    this.state = {
      error: null,
    };
  }

  componentDidMount = () => {
    Firebase.auth().onAuthStateChanged((user) => {
      const { member, history, fetchSmartLookEnabled, fetchCardPlayedLog } = this.props;
      if (user) {
        if (member && (!member.role || member.role === 'admin' || member.role === 'tester')) {
      //  if (member && (member.role === 'admin' || member.role === 'tester')) {
          this.fetchUsersRange(1, 50);
          this.fetchFilteredUsers('', '');

          fetchSmartLookEnabled();

        //  fetchCardPlayedLog('-M6-f5M0zrBJXpiDj_vN');
        //  fetchCardPlayedLog2();

        //  this.fetchPaymentsRange(1, 50);
          this.fetchPaymentsCount();

          this.fetchBansRange(1, 50);
          this.fetchBansCount();

          this.fetchUserCount();
          this.fetchAllVipUsers();
          this.fetchAllBans();
          this.fetchAllTournaments();
          this.getActiveMessages();
        } else {
          history.push('/');
        }
      } else {
        history.push('/');
      }
    });
  }


  deleteUser = (uid) => {
    const { deleteAUser, showNotification } = this.props;

    deleteAUser(uid).then((res) => {
      if (res.data && res.data.status === 'success') {
        showNotification('Lietotājs izdēsts', 'Lietotājs izdēsts veiksmīgi', 'success');
      } else {
        showNotification('Neizdevās izdēst lietotāju', 'Neizdevās izdēst lietotāju', 'danger');
      }
    });
  }

  toggleLogRocket = (uid) => {
    const { changeLogRocket, showNotification } = this.props;

    changeLogRocket(uid).then((res) => {
      if (res && res.status === 'success') {
        if (res.enabled) {
          showNotification('Logrocket ieslēgts veiksmīgi', 'Logrocket ieslēgts veiksmīgi', 'success');
        } else {
          showNotification('Logrocket izslēgts veiksmīgi', 'Logrocket izslēgts veiksmīgi', 'success');
        }
      } else {
        showNotification('Neizdevās mainīt logrocket', 'Neizdevās mainīt logrocket', 'danger');
      }
    });
  }

  blockUser = (uid, endDate, reason) => {
    const { blockAUser, showNotification } = this.props;

    blockAUser(uid, endDate, reason).then((res) => {
      if (res.status === 'success') {
        showNotification('Lietotājs bloķēts', 'Lietotājs bloķēts veiksmīgi', 'success');
      } else {
        showNotification('Neizdevās bloķēt lietotāju', 'Neizdevās bloķēt lietotāju', 'danger');
      }
    });
  }

  unblockUser = (uid, endDate, reason) => {
    const { unblockAUser, showNotification } = this.props;

    unblockAUser(uid, endDate, reason).then((res) => {
      if (res.status === 'success') {
        showNotification('Lietotājs atbloķēts', 'Lietotājs atbloķēts veiksmīgi', 'success');
      } else {
        showNotification('Neizdevās atbloķēt lietotāju', 'Neizdevās atbloķēt lietotāju', 'danger');
      }
    });
  }


  editUser = (uid, balance, level, gamesPlayed, totalPnts) => {
    const { editAUser, showNotification } = this.props;

    editAUser(uid, balance, level, gamesPlayed, totalPnts).then((res) => {
      if (res.status === 'success') {
        showNotification('Lietotājs labots', 'Lietotājs labots veiksmīgi', 'success');
      } else {
        showNotification('Neizdevās labot lietotāju', res.message, 'danger');
      }
    });
  }

  editBan = (uid, endDate, reason) => {
    const { editABan, showNotification } = this.props;

    editABan(uid, endDate, reason).then((res) => {
      if (res.status === 'success') {
        showNotification('Bans labots', 'Bans labots veiksmīgi', 'success');
      } else {
        showNotification('Neizdevās labot banu', res.message, 'danger');
      }
    });
  }

  addTournament = (data) => {
    const { addATournament, showNotification } = this.props;

    addATournament(data).then((res) => {
      if (res && res.status === 'success') {
        showNotification('Turnīrs pievienots', 'Turnīrs pievienots veiksmīgi', 'success');
        return 'success';
      }
      showNotification('Neizdevās pievienot turnīru', res.message, 'danger');
      return null;
    });
  }

  editTournament = (data) => {
    const { editATournament, showNotification } = this.props;

    editATournament(data).then((res) => {
      if (res.status === 'success') {
        showNotification('Turnīrs labots', 'Turnīrs labots veiksmīgi', 'success');
      } else {
        showNotification('Neizdevās labot turnīru', res.message, 'danger');
      }
    });
  }

  deleteTournament = (tournamentId) => {
    const { deleteATournament, showNotification } = this.props;

    deleteATournament(tournamentId).then((res) => {
      if (res.status === 'success') {
        showNotification('Turnīrs izdēsts', 'Turnīrs izdēsts veiksmīgi', 'success');
      } else {
        showNotification('Neizdevās izdēst turnīru', 'Neizdevās izdēst turnīru', 'danger');
      }
    });
  }

  answerSupportMessage = (data) => {
    const { answerSupportMsg } = this.props;

    return answerSupportMsg(data).catch((err) => {
      console.log(err);
    });
  }

  setSupportMessageAsResponded = (data) => {
    const { setSupportMsgAsResponded } = this.props;

    return setSupportMsgAsResponded(data).catch((err) => {
      console.log(err);
    });
  }


  messageAll = (message) => {
    const { messageAllUsers } = this.props;

    return messageAllUsers(message).catch((err) => {
      console.log(err);
    });
  }


  getActiveMessages = () => {
    const { fetchActiveReadMessages, fetchActiveUnreadMessages } = this.props;

    fetchActiveReadMessages().then(() => {
    //  console.log(res);
    });

    fetchActiveUnreadMessages().then(() => {
    //  console.log(res);
    });
  }

  getUserMessages = (uid) => {
    const { fetchUserMessages } = this.props;

    return fetchUserMessages(uid).then(() => 'success');
  }

  cancelUserMessages = (uid) => {
    const { cancelActiveUserMessages } = this.props;

    return cancelActiveUserMessages(uid).then(() => 'success');
  }

  fetchTournamentPlayers = (tournamentId) => {
    const { fetchTournamentPlayers } = this.props;

    fetchTournamentPlayers(tournamentId);
  }

  fetchUserCount = () => {
    const { fetchUserCount } = this.props;

    fetchUserCount();
  }

  fetchUsersRange = (start, end) => {
    const { fetchUsersRange } = this.props;

    fetchUsersRange(start, end);
  }

  fetchFilteredUsers = (filter, filterType) => {
    const { fetchFilteredUsers } = this.props;

    fetchFilteredUsers(filter, filterType);
  }


    fetchPaymentsRange = (start, end) => {
      const { fetchPaymentsRange } = this.props;

      fetchPaymentsRange(start, end);
    }

    fetchPaymentsCount = () => {
      const { fetchPaymentsCount } = this.props;

      fetchPaymentsCount();
    }


    fetchBansRange = (start, end) => {
      const { fetchBansRange } = this.props;

      fetchBansRange(start, end);
    }

    fetchBansCount = () => {
      const { fetchBansCount } = this.props;

      fetchBansCount();
    }

    fetchUserBalanceHistory = (userId) => {
      const { fetchUserBalanceHistory } = this.props;

      fetchUserBalanceHistory(userId);
    }

    fetchAllUsers() {
      const { fetchAllUsers } = this.props;

      fetchAllUsers().then(() => {
        //  console.log(res);
      });
    }


    fetchAllVipUsers() {
      const { fetchAllVipUsers } = this.props;

      fetchAllVipUsers().then(() => {
        //  console.log(res);
      });
    }

    fetchAllBans() {
      const { fetchAllBans } = this.props;

      fetchAllBans().then(() => {
        //  console.log(res);
      });
    }

    fetchAllTournaments() {
      const { fetchAllTournaments } = this.props;

      fetchAllTournaments().then(() => {
        //  console.log(res);
      });
    }

  render = () => {
    const {
      Layout,
      member,
      admin,
      toggleSmartLook,
    } = this.props;

    const {
      error,
    } = this.state;

    //  console.log(admin);


    return (
      <Layout
        error={error}
        member={member}
        allUsers={admin.allUsers}
        usersCount={admin.userCount}
        filteredUsers={admin.filteredUsers}
        allPayments={admin.allPayments}
        paymentsCount={admin.paymentsCount}
        userBalanceHistory={admin.userBalanceHistory}
        allBans={admin.allBans}
        bansCount={admin.bansCount}
        allVipUsers={admin.vipUsers}
      //  allBans={admin.allBans}
        allTransactions={admin.allTransactions}
        allTournaments={admin.allTournaments}
        tournamentPlayers={admin.tournamentPlayers}
        readMessages={admin.readMessages}
        unreadMessages={admin.unreadMessages}
        chatMessages={admin.chatMessages}
        deleteUser={this.deleteUser}
        toggleLogRocket={this.toggleLogRocket}
        blockUser={this.blockUser}
        unblockUser={this.unblockUser}
        editUser={this.editUser}
        fetchAllUsers={this.fetchAllUsers}
        fetchUsersRange={this.fetchUsersRange}
        fetchPaymentsRange={this.fetchPaymentsRange}
        fetchBansRange={this.fetchBansRange}
        fetchFilteredUsers={this.fetchFilteredUsers}
        fetchRoomLogCount={this.fetchRoomLogCount}
        fetchAllVipUsers={this.fetchAllVipUsers}
        editBan={this.editBan}
        addTournament={this.addTournament}
        editTournament={this.editTournament}
        deleteTournament={this.deleteTournament}
        fetchTournamentPlayers={this.fetchTournamentPlayers}
        getUserMessages={this.getUserMessages}
        cancelUserMessages={this.cancelUserMessages}
        answerSupportMessage={this.answerSupportMessage}
        setSupportMessageAsResponded={this.setSupportMessageAsResponded}
        messageAll={this.messageAll}
        fetchUserBalanceHistory={this.fetchUserBalanceHistory}
        toggleSmartLook={toggleSmartLook}
        smartLookStatus={admin.smartLookStatus}
      />
    );
  }
}

const mapStateToProps = state => ({
  member: state.member || {},
  admin: state.admin || {},
});

const mapDispatchToProps = {
  fetchAllUsers: getAllUsers,
  fetchUsersRange: getUsersRange,
  fetchFilteredUsers: getFilteredUsers,
  fetchUserCount: getUserCount,
  fetchAllVipUsers: getAllVipUsers,
  deleteAUser: deleteUser,
  changeLogRocket: toggleLogRocket,
  blockAUser: blockUser,
  unblockAUser: unblockUser,
  editAUser: editUser,
  fetchPaymentsRange: getPaymentsRange,
  fetchPaymentsCount: getPaymentsCount,
  fetchBansRange: getBansRange,
  fetchBansCount: getBansCount,
  fetchAllBans: getAllBans,
  editABan: editBan,
  fetchAllTournaments: getAllTournaments,
  addATournament: addTournament,
  editATournament: editTournament,
  deleteATournament: deleteTournament,
  fetchTournamentPlayers: getTournamentPlayers,
  fetchUserMessages: getUserMessages,
  cancelActiveUserMessages: cancelUserMessages,
  answerSupportMsg: answerSupportMessage,
  // fetchActiveMessages: getActiveMessages,
  fetchActiveUnreadMessages: getActiveUnreadMessages,
  fetchActiveReadMessages: getActiveReadMessages,
  setSupportMsgAsResponded: setSupportMessageAsResponded,
  messageAllUsers: messageAll,
  fetchUserBalanceHistory: getUserBalanceHistory,
  fetchSmartLookEnabled: getSmartLookEnabled,
  toggleSmartLook: changeSmartLook,
  fetchCardPlayedLog: getCardPlayedLog,
//  fetchCardPlayedLog2: getCardPlayedLog2,
};

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(Admin));
