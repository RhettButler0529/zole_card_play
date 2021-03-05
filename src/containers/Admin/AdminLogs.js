import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { withRouter } from 'react-router-dom';
import { Firebase } from '../../lib/firebase';

import {
//  getAllRoomsLogs,
  getRoomLog,
  getRoomLogsRange,
  getRoomLogCount,
  getFilteredRoomLogs,
} from '../../actions/admin';

class AdminLogs extends Component {
  static propTypes = {
    Layout: PropTypes.func.isRequired,
    history: PropTypes.shape({
      push: PropTypes.func.isRequired,
    }).isRequired,
    member: PropTypes.shape({
      role: PropTypes.shape({}),
    }),
    admin: PropTypes.shape({
      allRoomsLogs: PropTypes.arrayOf(PropTypes.shape({})),
      roomData: PropTypes.shape({}),
      filteredRoomsLogs: PropTypes.shape({}),
      roomsPlayedCount: PropTypes.number,
    }),
    match: PropTypes.shape({ params: PropTypes.shape({}) }),
    //  fetchAllRoomsLogs: PropTypes.func.isRequired,
    fetchRoomLog: PropTypes.func.isRequired,
    fetchRoomLogCount: PropTypes.func.isRequired,
    fetchRoomLogsRange: PropTypes.func.isRequired,
    fetchFilteredRoomLogs: PropTypes.func.isRequired,
  //  showNotification: PropTypes.func.isRequired,
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

    this.fetchRoomLog = this.fetchRoomLog.bind(this);
  }

  componentDidMount = () => {
    Firebase.auth().onAuthStateChanged((user) => {
      const { member } = this.props;
      if (user) {
      //  if (member && member.role === 'admin') {
        if (member && (member.role === 'admin' || member.role === 'tester')) {
        //  this.fetchAllRoomsLogs();
          this.fetchRoomLogCount();
          this.fetchFilteredRoomLogs('', '');
        //  this.fetchRoomLogsRange(1, 50);
        } else {
        //  history.push('/');
        }
      } else {
      //  console.log('no user');
      }
    });
  }


    fetchRoomLogCount = () => {
      const { fetchRoomLogCount } = this.props;

      fetchRoomLogCount().then((res) => {
        if (res && res.data) {
          this.fetchRoomLogsRange(res.data - 50, res.data);
        }
      });
    }

    fetchRoomLogsRange = (start, end) => {
      const { fetchRoomLogsRange } = this.props;

      fetchRoomLogsRange(start, end).then(() => {
      //  console.log(res);
      });
    }


    fetchFilteredRoomLogs = (filter, filterType) => {
      const { fetchFilteredRoomLogs } = this.props;

      fetchFilteredRoomLogs(filter, filterType).then(() => {
      });
    }

    fetchRoomLog(roomId) {
      const { fetchRoomLog } = this.props;

      fetchRoomLog(roomId).then(() => {
      });
    }

  render = () => {
    const {
      Layout,
      member,
      admin,
    } = this.props;

    const {
      error,
    } = this.state;

    return (
      <Layout
        error={error}
        member={member}
        allRooms={admin.allRoomsLogs}
        roomData={admin.roomData}
        roomsPlayedCount={admin.roomsPlayedCount}
        filteredRoomsLogs={admin.filteredRoomsLogs}
      //  fetchAllRoomsLogs={this.fetchAllRoomsLogs}
        fetchRoomLog={this.fetchRoomLog}
        fetchUserCount={this.fetchUserCount}
        fetchRoomLogsRange={this.fetchRoomLogsRange}
        fetchFilteredRoomLogs={this.fetchFilteredRoomLogs}
      />
    );
  }
}

const mapStateToProps = state => ({
  member: state.member || {},
  admin: state.admin || {},
});

const mapDispatchToProps = {
//  fetchAllRoomsLogs: getAllRoomsLogs,
  fetchRoomLog: getRoomLog,
  fetchRoomLogsRange: getRoomLogsRange,
  fetchFilteredRoomLogs: getFilteredRoomLogs,
  //  fetchFilteredUsers: getFilteredUsers,
  fetchRoomLogCount: getRoomLogCount,
};

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(AdminLogs));
