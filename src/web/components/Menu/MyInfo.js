import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { withTranslation } from 'react-i18next';
import ReactTableContainer from 'react-table-container';

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

import LevelProgress from './LevelProgress';
// import Friends from './Friends';

import myInfoImg from '../../../images/icons/my_profile.png';

class MyInfo extends Component {
  static propTypes = {
    member: PropTypes.shape().isRequired,
    t: PropTypes.func.isRequired,
    changeTab: PropTypes.func.isRequired,
    myTournamentsData: PropTypes.shape({
      name: PropTypes.string,
      position: PropTypes.number,
      points: PropTypes.number,
    }),
    leaderboardData: PropTypes.arrayOf(PropTypes.shape()),
  }

  static defaultProps = {
    myTournamentsData: {},
    leaderboardData: {},
  }

  constructor(props) {
    super(props);
    this.state = {
    //  leaderboardPosition: '',
    };
  }

  componentWillReceiveProps() {
    const { leaderboardData, member } = this.props;

    const { position, uid } = member;

    if (position < 100) {
      leaderboardData.map((item) => {
        if (item.key === uid) {
        //  this.setState({ leaderboardPosition: item.position });
        }
        return null;
      });
    }
  }

  render() {
    const {
      member, t, myTournamentsData, changeTab,
    } = this.props;

    //  const { leaderboardPosition } = this.state;

  /*  const {
      position,
      gamesPlayed,
      gamesWon,
      totalPoints,
      //  photo,
      //  name,
      //  balance,
      level,
    } = member; */

    return (
      <div className="my-info">
        <Row className="my-info-header" style={{marginBottom: 20}}>
          <Col sm="4">
            <Media src={myInfoImg} className="my-info-header-image" />
            <div className="my-info-header-text">
              {t('myInfo.myInfo')}
            </div>
          </Col>
          <Col className="menu-topTab">
            <Button color="link" className="my-info-header-button" onClick={() => changeTab('9')}>
              {t('myInfo.friends')}
            </Button>
          </Col>
          <Col className="menu-topTab">
            <Button color="link" className="my-info-header-button" onClick={() => changeTab('10')}>
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
          <Col sm="6" />
          <Col sm="6">
            <Row>
              <Col>
                {t('myInfo.tournaments')}:
              </Col>
            </Row>
          </Col>
        </Row>
        <Row>
          <Col sm="6" className="my-info-left">
            <Row style={{ color: '#fff' }}>
              <Col sm="12" className="my-info-scores">
                <div className="my-info-scores-table">
                  <Row>
                    <Col className="text">
                      {t('common.position')}
                    </Col>
                    <Col className="text">
                      {t('common.parties')}
                    </Col>
                    <Col className="text">
                      {t('common.wins')}
                    </Col>
                    <Col className="text">
                      {t('common.points')}
                    </Col>
                    <Col className="text">
                      {t('common.level')}
                    </Col>
                  </Row>
                  <Row>
                    <Col className="textData">
                      {member.position}
                    </Col>
                    <Col className="textData">
                      {member.gamesPlayed}
                    </Col>
                    <Col className="textData">
                      {member.gamesWon}
                    </Col>
                    <Col className="textData">
                      {member.totalPoints}
                    </Col>
                    <Col className="textData">
                      {member.level}
                    </Col>
                  </Row>
                </div>
              </Col>
            </Row>
            <Row style={{marginTop: 40}}>
              <Col>
                <LevelProgress member={member} />
              </Col>
            </Row>
          </Col>
          <Col sm="5" className="my-info-right">
            <Row>
              <Col>
                <ReactTableContainer
                  width="100%"
                  height="300px"
                  className="my-info-tournaments-table"
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
                      width: 4,
                      left: -1,
                    },

                    foregroundFocus: {
                      background: 'ddd',
                      width: 4,
                      left: -1,
                    },
                  }}
                >
                  <table className="my-info-tournaments">
                    <colgroup>
                      <col span="1" />
                    </colgroup>
                    <thead className="my-info-tournaments-header">
                      <tr>
                        <th className="my-info-tournaments-header-col">
                          {t('tournaments.title')}
                        </th>
                        <th className="my-info-tournaments-header-col">
                          {t('tournaments.winningPot')}
                        </th>
                        <th className="my-info-tournaments-header-col">
                          {t('tournaments.entryFee')}
                        </th>
                      </tr>
                    </thead>
                    <tbody className="my-info-tournaments-body">
                      {myTournamentsData && Object.keys(myTournamentsData).map(key => (
                        <tr key={key} className="my-info-tournaments-row">
                          <td className="my-info-tournaments-col">
                            {myTournamentsData[key].name}
                          </td>
                          <td className="my-info-tournaments-col">
                            {myTournamentsData[key].points}
                          </td>
                          <td className="my-info-tournaments-col">
                            {myTournamentsData[key].position}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </ReactTableContainer>
              </Col>
            </Row>
          </Col>
        </Row>
      </div>
    );
  }
}

export default withTranslation('common')(MyInfo);
