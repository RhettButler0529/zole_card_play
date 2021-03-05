import React, { Fragment } from 'react';
import PropTypes from 'prop-types';

import { withTranslation } from 'react-i18next';

import ScrollArea from 'react-scrollbar';
import isEqual from "react-fast-compare";

// import moment from 'moment';
// import Moment from 'react-moment';

/* import {
  Row,
  Col,
  Button,
  Media,
} from 'reactstrap'; */

import Row from 'reactstrap/lib/Row';
import Col from 'reactstrap/lib/Col';
import Media from 'reactstrap/lib/Media';
import Button from 'reactstrap/lib/Button';

import CustomDate from '../UI/CustomDate';

import myInfoImg from '../../../images/icons/my_profile.png';

class IgnoredUsers extends React.Component {
  static propTypes = {
    member: PropTypes.shape({
      ignoredUsers: PropTypes.shape({}),
    }).isRequired,
  //  t: PropTypes.func.isRequired,
    unBlockUser: PropTypes.func.isRequired,
    fetchIgnoredPlayers: PropTypes.func.isRequired,
    changeTab: PropTypes.func.isRequired,
    playButtonSound: PropTypes.func.isRequired,
  }

  constructor(props) {
    super(props);
    this.state = {
    };
  }

  componentWillMount() {
    const { fetchIgnoredPlayers } = this.props;

    fetchIgnoredPlayers();
  }

  shouldComponentUpdate(nextProps) {
    if (!isEqual(nextProps, this.props)) {
      return true;
    }

    return false;
  }

  unblock = (id) => {
    const { unBlockUser, fetchIgnoredPlayers, playButtonSound } = this.props;

    playButtonSound();
    unBlockUser(id).then((res) => {
      if (res && res.status === 'success') {
        fetchIgnoredPlayers();
      }
    });
  }

  render() {
    const {
      member, changeTab, t,
    } = this.props;
  //  const { ignoredUsers } = member;

    return (
      <div className="my-info">
        <Row className="my-info-header">
          <Col sm="4">
            <Media src={myInfoImg} className="my-info-header-image" />
            <div className="my-info-header-text">
              {t('myInfo.ignoredPlayers')}
            </div>
          </Col>
          <Col className="menu-topTab">
            <Button color="link" className="my-info-header-button" onClick={() => changeTab('9')}>
              {t('myInfo.friends')}
            </Button>
          </Col>
          <Col className="menu-topTab">
            <Button color="link" className="my-info-header-button active" onClick={() => changeTab('10')}>
              {t('myInfo.ignoredPlayers')}
            </Button>
          </Col>
          <Col className="menu-topTab" style={{ marginRight: 15 }}>
            <Button color="link" className="my-info-header-button" onClick={() => changeTab('11')}>
              {t('myInfo.achievements')}
            </Button>
          </Col>
        </Row>
        <Row>
          <Col sm="12">
            <Row className="ignored-users">
              <Col sm="12" className="ignored-users-table" style={{ height: 300 }}>
                <Row className="ignored-users-table-header">
                  <Col sm="4" className="ignored-users-table-header-col">
                    {t('common.name')}
                  </Col>
                  <Col sm="4" className="ignored-users-table-header-col">
                    {t('common.date')}
                  </Col>
                  <Col sm="4" className="ignored-users-table-header-col">
                    {t('ignoredUsers.unBlock')}
                  </Col>
                </Row>
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
                  {member.ignoredUsers && Object.keys(member.ignoredUsers).map(key => (
                      <Fragment>
                        {member.ignoredUsers[key] && (
                        <Row key={key} className="ignored-users-table-row">
                          <Col sm="4" className="ignored-users-table-row-col ignored-users-table-row-col-text">
                            {member.ignoredUsers[key].name}
                          </Col>
                          <Col sm="4" className="ignored-users-table-row-col ignored-users-table-row-col-text">
                          {/*  <Moment format="DD-MM-YYYY, HH:mm" locale="lv">
                              {ignoredUsers[key].date}
                            </Moment> */}
                            <CustomDate format="DD-MM-YYYY, hh:mm" date={member.ignoredUsers[key].date} />
                          </Col>
                          <Col sm="4" className="ignored-users-table-row-col">
                            <Button color="success" className="ignored-users-table-button" onClick={() => this.unblock([key])}>
                              {t('ignoredUsers.unBlock')}
                            </Button>
                          </Col>
                        </Row>
                        )}
                      </Fragment>
                    ))}
                </ScrollArea>
              </Col>
            </Row>
          </Col>
        </Row>
      </div>
    );
  }
}


export default withTranslation('common')(IgnoredUsers);
