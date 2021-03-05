import React, { Fragment } from 'react';
import PropTypes from 'prop-types';

import { withTranslation } from 'react-i18next';
import ReactTableContainer from 'react-table-container';

import Row from 'reactstrap/lib/Row';
import Col from 'reactstrap/lib/Col';
import Media from 'reactstrap/lib/Media';
import TabPane from 'reactstrap/lib/TabPane';
import TabContent from 'reactstrap/lib/TabContent';
import Dropdown from 'reactstrap/lib/Dropdown';
import DropdownToggle from 'reactstrap/lib/DropdownToggle';
import DropdownMenu from 'reactstrap/lib/DropdownMenu';
import DropdownItem from 'reactstrap/lib/DropdownItem';

import leaderboardImg from '../../../images/icons/leaderboard.png';
import coinImg from '../../../images/coin.svg';

const FilterMap = {
  "5" :  "Visu laiku",
  "1" :  "Šodien",
  "2" :  "Šonedēļ",
  "3" :  "Šomēnes",
  "4" :  "Šogad"
};

const FilterMapRu = {
  "5" :  "Все время",
  "1" :  "сегодня",
  "2" :  "На этой неделе",
  "3" :  "Этот месяц",
  "4" :  "Этот год"
};

const FilterMapEn = {
  "5" :  "All Time",
  "1" :  "Today",
  "2" :  "This Week",
  "3" :  "This Month",
  "4" :  "This Year"
};

class TopPage extends React.Component {
  static propTypes = {
    leaderboardData: PropTypes.shape().isRequired,
    myLeaderboard: PropTypes.shape().isRequired,
    t: PropTypes.func.isRequired,

    //  fetchLeaderboard: PropTypes.func.isRequired,
    fetchLeaderboardYear: PropTypes.func.isRequired,
    fetchLeaderboardMonth: PropTypes.func.isRequired,
    fetchLeaderboardWeek: PropTypes.func.isRequired,
    fetchLeaderboardDaily: PropTypes.func.isRequired,
    //  fetchPositionInLeaderboard: PropTypes.func.isRequired,
    fetchPositionInLeaderboardYear: PropTypes.func.isRequired,
    fetchPositionInLeaderboardMonth: PropTypes.func.isRequired,
    fetchPositionInLeaderboardWeek: PropTypes.func.isRequired,
    fetchPositionInLeaderboardDaily: PropTypes.func.isRequired,
    playButtonSound: PropTypes.func.isRequired,
  }

  constructor(props) {
    super(props);
    this.state = {
      activeTab: '5',
      filterOpen: false
    };

    this.toggleFilter = this.toggleFilter.bind(this);
  }

  componentDidMount() {
  //  const { refetchLeaderboard } = this.props;

  //  refetchLeaderboard();
  }

  toggle = (key) => {
    const {
      fetchLeaderboardYear,
      fetchLeaderboardMonth,
      fetchLeaderboardWeek,
      fetchLeaderboardDaily,
      fetchPositionInLeaderboardYear,
      fetchPositionInLeaderboardMonth,
      fetchPositionInLeaderboardWeek,
      fetchPositionInLeaderboardDaily,
      playButtonSound,
    } = this.props;

    if (key) {
      const { activeTab } = this.state;
      if (activeTab !== key) {
        playButtonSound();

        if (key === '1') {
          fetchLeaderboardDaily();
          fetchPositionInLeaderboardDaily();
        }
        if (key === '2') {
          fetchLeaderboardWeek();
          fetchPositionInLeaderboardWeek();
        }
        if (key === '3') {
          fetchLeaderboardMonth();
          fetchPositionInLeaderboardMonth();
        }
        if (key === '4') {
          fetchLeaderboardYear();
          fetchPositionInLeaderboardYear();
        }
        this.setState({
          activeTab: key,
        });
      }
    }
  }

  table = (leaderboard, myLeaderboard) => {
    const { t } = this.props;

    //  const leaderboard2 = Object.keys(leaderboard).map(key => ({
    //    position: leaderboard[key].pos,
    //    points: leaderboard[key].totalPnts,
    //    gamesPlayed: leaderboard[key].gPlayed,
    //    name: leaderboard[key].name,
    //    balance: leaderboard[key].bal,
    //    lvl: leaderboard[key].lvl,
    //  }));

    //  leaderboard2.sort((a, b) => (a.position - b.position));

    return (
      <Fragment>
        <table className="top-table-header">
          <thead className="top-table-header">
            <tr className="top-table-header-row">
              <th className="top-table-header-col col-index">
                {t('common.position')}
              </th>
              <th className="top-table-header-col col-player">
                {t('top.player')}
              </th>
              <th className="top-table-header-col">
                {t('common.level')}
              </th>
              <th className="top-table-header-col">
                {t('common.points')}
              </th>
              <th className="top-table-header-col">
                <Media src={coinImg} className="top-table-header-coin" />
              </th>
              <th className="top-table-header-col">
                {t('common.parties')}
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
          <table className="top-table">
            <colgroup>
              <col span="1" className="" />
            </colgroup>
            {/*  <thead>
              <tr className="top-table-header-row">
                <th className="top-table-header-col col-index">
                  {t('top.position')}
                </th>
                <th className="top-table-header-col col-player">
                  {t('top.player')}
                </th>
                <th className="top-table-header-col">
                  {t('top.level')}
                </th>
                <th className="top-table-header-col">
                  {t('top.points')}
                </th>
                <th className="top-table-header-col">
                  {t('top.money')}
                </th>
                <th className="top-table-header-col">
                  {t('top.parties')}
                </th>
              </tr>
            </thead> */}
            <thead />
            <tbody>
              <Fragment>
                {myLeaderboard && myLeaderboard.position > 10 && (
                  <tr className="top-table-row-user">
                    <td className="top-table-col col-index">
                      {myLeaderboard.position}
                    </td>
                    <td className="top-table-col col-player">
                      {myLeaderboard.name}
                    </td>
                    <td className="top-table-col col-lvl">
                      <div style={{ position: 'relative' }}>
                        <div className="col-lvl-wrapper">
                          <div className="col-lvl-lvl">
                            <div className="col-lvl-text">
                              {myLeaderboard.lvl}
                            </div>
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="top-table-col">
                      {myLeaderboard.points}
                    </td>
                    <td className="top-table-col">
                      {myLeaderboard.balance}
                    </td>
                    <td className="top-table-col">
                      {myLeaderboard.gamesPlayed}
                    </td>
                  </tr>
                )}
              </Fragment>
              {leaderboard && leaderboard.map((pos, index) => {
                if (index <= 9) {
                  return (
                    <Fragment key={pos.key}>
                      <tr key={pos.key} className="top-table-row">
                        <td className="top-table-col">
                          {index + 1}
                        </td>
                        <td className="top-table-col col-player">
                          {pos.name}
                        </td>
                        <td className="top-table-col col-lvl">
                          <div style={{ position: 'relative' }}>
                            <div className="col-lvl-wrapper">
                              <div className="col-lvl-lvl">
                                <div className="col-lvl-text">
                                  {pos.lvl}
                                </div>
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="top-table-col">
                          {pos.points || 0}
                        </td>
                        <td className="top-table-col">
                          {pos.balance}
                        </td>
                        <td className="top-table-col">
                          {pos.gamesPlayed || 0}
                        </td>
                      </tr>
                    </Fragment>
                  );
                }
                return null;
              })}
            </tbody>
          </table>
        </ReactTableContainer>
      </Fragment>
    );
  }

  toggleFilter() {
    this.setState(prevState => ({
      filterOpen: !prevState.filterOpen,
    }));
  }

  render() {
    const {
      leaderboardData,
      t,
      i18n,
    } = this.props;

    const { activeTab, filterOpen } = this.state;

    const {
      leaderboard,
      myLeaderboard,
      leaderboardYear,
      leaderboardMonth,
      leaderboardWeek,
      leaderboardDaily,
      myLeaderboardYear,
      myLeaderboardMonth,
      myLeaderboardWeek,
      myLeaderboardDaily,
    } = leaderboardData;

    return (
      <div className="top">
        <Row className="top-tabs">
          <Col sm="12">
            <Row className="top-tabs-header">
              <Col sm="3">
                <Media src={leaderboardImg} className="top-tabs-header-image" />
                <div className="top-tabs-header-text">
                  {t('top.top')}
                </div>
              </Col>
              <Col sm="9">
                <Dropdown className="top-select" isOpen={filterOpen} toggle={this.toggleFilter}>
                  <DropdownToggle caret>
                    {i18n && i18n.language === 'lv' && (
                      FilterMap[activeTab]
                    )}
                    {i18n && i18n.language === 'ru' && (
                      FilterMapRu[activeTab]
                    )}
                    {i18n && i18n.language === 'en' && (
                      FilterMapEn[activeTab]
                    )}
                    </DropdownToggle>
                  <DropdownMenu>
                    {Object.keys(FilterMap).map((key) => {
                      return (
                        <DropdownItem key={key} onClick={(e) => {this.toggle(key)}}>
                        {i18n && i18n.language === 'lv' && (
                          FilterMap[key]
                        )}
                        {i18n && i18n.language === 'ru' && (
                          FilterMapRu[key]
                        )}
                        {i18n && i18n.language === 'en' && (
                          FilterMapEn[key]
                        )}
                        </DropdownItem>
                      )
                    })}
                  </DropdownMenu>
                </Dropdown>
              </Col>
            </Row>
          </Col>
        </Row>
        <Row>
          <Col sm="12">
            <TabContent activeTab={activeTab}>
              <TabPane tabId="1">
                <Row>
                  <Col sm="12">
                    {this.table(leaderboardDaily, myLeaderboardDaily)}
                  </Col>
                </Row>
              </TabPane>
              <TabPane tabId="2">
                <Row>
                  <Col sm="12">
                    {this.table(leaderboardWeek, myLeaderboardWeek)}
                  </Col>
                </Row>
              </TabPane>
              {activeTab && activeTab === '3' && (
              <TabPane tabId="3">
                <Row>
                  <Col sm="12">
                    {this.table(leaderboardMonth, myLeaderboardMonth)}
                  </Col>
                </Row>
              </TabPane>
              )}
              {activeTab && activeTab === '4' && (
              <TabPane tabId="4">
                <Row>
                  <Col sm="12">
                    {this.table(leaderboardYear, myLeaderboardYear)}
                  </Col>
                </Row>
              </TabPane>
              )}
              {activeTab && activeTab === '5' && (
              <TabPane tabId="5">
                <Row>
                  <Col sm="12">
                    {this.table(leaderboard, myLeaderboard)}
                  </Col>
                </Row>
              </TabPane>
              )}
            </TabContent>
          </Col>
        </Row>
      </div>
    );
  }
}

export default withTranslation('common')(TopPage);
