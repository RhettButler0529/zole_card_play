import React, { Fragment } from 'react';
import PropTypes from 'prop-types';

import ScrollArea from 'react-scrollbar';

import { withTranslation } from 'react-i18next';

/* import {
  Row,
  Col,
  Media,
  Input,
} from 'reactstrap'; */

import Row from 'reactstrap/lib/Row';
import Col from 'reactstrap/lib/Col';
import Media from 'reactstrap/lib/Media';
import Input from 'reactstrap/lib/Input';

import onlineImg from '../../../images/icons/online.png';
// import offlineImg from '../../../images/icons/offline.png';
import waitingImg from '../../../images/icons/waiting.png';


import caretUp from '../../../images/icons/caret_up.png';
import caretDown from '../../../images/icons/caret_down.png';

import defaultImage from '../../../images/Game/defaultImage.jpg';


class OnlineUsers extends React.Component {
  static propTypes = {
  //  t: PropTypes.func.isRequired,
    changeSortFilter: PropTypes.func.isRequired,
    changeSortDirection: PropTypes.func.isRequired,
    fetchOnlineUsersLazy: PropTypes.func.isRequired,
    onlineUsers: PropTypes.shape({}),
    member: PropTypes.shape({
      uid: PropTypes.string,
      balance: PropTypes.number,
      level: PropTypes.number,
      photo: PropTypes.string,
      name: PropTypes.string,
    }),
  }

  static defaultProps = {
    onlineUsers: {},
    member: {},
  }

  constructor(props) {
    super(props);
    this.state = {
      onlineUsers: [],
      orderBy: '-',
      orderDirection: 'desc',
    };
  }

  componentDidMount() {
    const { onlineUsers, member } = this.props;
    const { orderBy, orderDirection } = this.state;

    const usersArray = [];
    if (onlineUsers) {
      Object.keys(onlineUsers).map((key) => {
        let shortName = '';
        if (onlineUsers[key] && onlineUsers[key].name) {
          const { name } = onlineUsers[key];

          const split = name.split(' ');
          if (split && split[0] && split[1]) {
            shortName = `${split[0]} ${split[1].charAt(0)}`;
          } else if (split && split[0]) {
            shortName = `${split[0]}`;
          }
        }
        if (key !== member.uid) {
          usersArray.push({
            key,
            ...onlineUsers[key],
            shortName,
          });
        } else {
          usersArray.push({
            key,
            ...onlineUsers[key],
            bal: member.balance,
            lvl: member.level,
            name: member.name,
            photo: member.photo,
            shortName,
          });
        }
        return null;
      });

      const orderedUsers = usersArray;

      if (orderBy === 'name') {
        if (orderDirection === 'desc') {
          orderedUsers.sort(this.compareNamesAsc);
        } else {
          orderedUsers.sort(this.compareNamesDesc);
        }
      } else if (orderBy === 'balance') {
        if (orderDirection === 'desc') {
          orderedUsers.sort((a, b) => (a.bal - b.bal));
        } else {
          orderedUsers.sort((a, b) => (b.bal - a.bal));
        }
      } else if (orderBy === 'level') {
        if (orderDirection === 'desc') {
          orderedUsers.sort((a, b) => (a.lvl - b.lvl));
        } else {
          orderedUsers.sort((a, b) => (b.lvl - a.lvl));
        }
      }

      this.setState({ onlineUsers: orderedUsers });
    }
  }

  componentWillReceiveProps(nextProps) {
    const { onlineUsers, member } = nextProps;
    const { orderBy, orderDirection } = this.state;

    const usersArray = [];
    if (onlineUsers) {
      Object.keys(onlineUsers).map((key) => {
        let shortName = '';
        if (onlineUsers[key] && onlineUsers[key].name) {
          const { name } = onlineUsers[key];

          const split = name.split(' ');
          if (split && split[0] && split[1]) {
            shortName = `${split[0]} ${split[1].charAt(0)}`;
          } else if (split && split[0]) {
            shortName = `${split[0]}`;
          }
        }

        if (key !== member.uid) {
          usersArray.push({
            key,
            ...onlineUsers[key],
            shortName,
          });
        } else {
          usersArray.push({
            key,
            ...onlineUsers[key],
            bal: member.balance,
            lvl: member.level,
            name: member.name,
            photo: member.photo,
            shortName,
          });
        }
        return null;
      });

      const orderedUsers = usersArray;

      if (orderBy === 'name') {
        if (orderDirection === 'desc') {
          orderedUsers.sort(this.compareNamesAsc);
        } else {
          orderedUsers.sort(this.compareNamesDesc);
        }
      } else if (orderBy === 'balance') {
        if (orderDirection === 'desc') {
          orderedUsers.sort((a, b) => (b.bal - a.bal));
        } else {
          orderedUsers.sort((a, b) => (a.bal - b.bal));
        }
      } else if (orderBy === 'level') {
        if (orderDirection === 'desc') {
          orderedUsers.sort((a, b) => (b.lvl - a.lvl));
        } else {
          orderedUsers.sort((a, b) => (a.lvl - b.lvl));
        }
      }

      this.setState({ onlineUsers: orderedUsers });
    }
  }

  orderType = (e) => {
    const { changeSortFilter } = this.props;
    if (e.target) {
      if (e.target.value) {
        let orderDirection = 'desc';
        // change to lowerCaseName
        if (e.target.value === 'lowerCaseName') {
          orderDirection = 'asc';
        }
        this.setState({ orderBy: e.target.value, orderDirection });
        if (e.target.value === 'lowerCaseName') {
          // change to lowerCaseName
          changeSortFilter('lowerCaseName');
        } else if (e.target.value === 'balance') {
          changeSortFilter('bal');
        } else if (e.target.value === 'level') {
          changeSortFilter('lvl');
        }
      } else {
        this.setState({ orderBy: '-' });
      }
    }
  }

  orderDirection = (direction) => {
    const { changeSortDirection } = this.props;
    if (direction) {
      this.setState({ orderDirection: direction });
      changeSortDirection(direction);
    }
  }

  compareNamesAsc = (a, b) => {
    if (a.name < b.name) {
      return -1;
    }
    if (a.name > b.name) {
      return 1;
    }
    return 0;
  }

  compareNamesDesc = (a, b) => {
    if (a.name < b.name) {
      return 1;
    }
    if (a.name > b.name) {
      return -1;
    }
    return 0;
  }

  handleScroll = (e) => {
    const bottom = e.realHeight - Math.ceil(e.topPosition) <= (e.containerHeight + 30);

    if (bottom) {
      const { fetchOnlineUsersLazy } = this.props;

      fetchOnlineUsersLazy();
    }
  }

  render() {
  //  const {
    //  onlineUsers,
    //  fetchOnlineUsersLazy,
    //  t,
  //  } = this.props;

    const {
      onlineUsers,
      orderBy,
      //  orderDirection,
    } = this.state;

    //  const onlineUsersProps = this.props.onlineUsers;

    /*  const orderedUsers = onlineUsers;

    if (orderBy === 'name') {
      if (orderDirection === 'desc') {
        orderedUsers.sort(this.compareNamesAsc);
      } else {
        orderedUsers.sort(this.compareNamesDesc);
      }
    } else if (orderBy === 'balance') {
      if (orderDirection === 'desc') {
        orderedUsers.sort((a, b) => (a.bal - b.bal));
      } else {
        orderedUsers.sort((a, b) => (b.bal - a.bal));
      }
    } else if (orderBy === 'level') {
      if (orderDirection === 'desc') {
        orderedUsers.sort((a, b) => (a.lvl - b.lvl));
      } else {
        orderedUsers.sort((a, b) => (b.lvl - a.lvl));
      }
    } */

    return (
      <Fragment>
        <div className="online-users">
          <Row>
            <Col sm="12" className="online-users-header">
            Spēlētāji online
            </Col>
          </Row>
          <Row className="online-users-header-row">
            <Col sm="9" className="online-users-header">
              <Input type="select" className="online-users-select" value={orderBy} onChange={this.orderType}>
                <option disabled hidden value="-">Kārtot pēc</option>
                <option value="lowerCaseName">Vārds</option>
                <option value="balance">Bilance</option>
                <option value="level">Līmenis</option>
              </Input>
            </Col>
            <Col className="online-users-caret-up">
              <Media src={caretUp} className="online-users-caret" onClick={() => { this.orderDirection('desc'); }} />
            </Col>
            <Col className="online-users-caret-down">
              <Media src={caretDown} className="online-users-caret" onClick={() => { this.orderDirection('asc'); }} />
            </Col>
          </Row>
          <Row>
            <Col sm="12" style={{ height: 280 }}>

              <ScrollArea
                speed={0.65}
                className="chat-body-scroll-area"
                contentClassName="online-users-ReactTableContainer"
                onScroll={this.handleScroll}
                smoothScrolling
                verticalContainerStyle={{
                  background: 'transparent',
                  opacity: 1,
                  width: 7,
                }}
                verticalScrollbarStyle={{
                  background: '#fff',
                  borderRadius: 1,
                  width: 4,
                  minScrollSize: 25,
                }}
                horizontal={false}
                ref={(el) => { this.messagesScrollbar = el; }}
              >
                {onlineUsers && onlineUsers.map((user) => {
                  if (user && user.shortName && user.photo) {
                    return (
                      <Fragment key={user.key}>
                        <Row key={user.key} className="online-users-table-row">
                          <Col sm="4" className="online-users-table-col">
                            <div className="online-users-avatar">
                              <img src={user.photo || defaultImage} alt="" />
                            </div>
                            <div style={{ position: 'relative' }}>
                              <div className="online-users-level-wrapper">
                                <div className="online-users-level">
                                  <div className="online-users-level-text">
                                    {user.lvl || 1}
                                  </div>
                                </div>
                              </div>
                            </div>
                          </Col>
                          <Col sm="5" className="online-users-table-col-name">
                            <div style={{
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                              whiteSpace: 'nowrap',
                            }}
                            >
                              {user.shortName}
                            </div>
                            <div className="online-users-table-col-balance">
                              {user.bal && (`€${user.bal}`)}
                            </div>
                          </Col>
                          <Col sm="2" className="online-users-table-col-status">
                            {user.status && (user.isWaitingRoom ? (
                              <Media src={waitingImg} className="online-users-table-image" />
                            ) : (
                              <Media src={onlineImg} className="online-users-table-image" />
                            ))}
                          </Col>
                          <Col sm="1" />
                        </Row>
                      </Fragment>
                    );
                  }
                  return null;
                })}
              </ScrollArea>
            </Col>
          </Row>
        </div>
        <Row className="online-users-legend">
          <Col sm="6" className="online-users-legend-item">
            <Media src={onlineImg} className="online-users-legend-image" />
            <div className="online-users-legend-text"> Online </div>
          </Col>
          {/* <Col sm="4" className="online-users-legend-item">
            <Media src={offlineImg} className="online-users-legend-image" />
            <div className="online-users-legend-text"> Offline </div>
          </Col> */}
          <Col sm="6" className="online-users-legend-item">
            <Media src={waitingImg} className="online-users-legend-image" />
            <div className="online-users-legend-text"> Gaida </div>
          </Col>
        </Row>
      </Fragment>
    );
  }
}

export default withTranslation('common')(OnlineUsers);
