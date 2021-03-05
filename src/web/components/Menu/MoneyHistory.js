import React, { Fragment } from 'react';
import PropTypes from 'prop-types';

// import Moment from 'react-moment';
import ScrollArea from 'react-scrollbar';

import isEqual from "react-fast-compare";

import { withTranslation } from 'react-i18next';

/* import {
  Row,
  Col,
  NavLink,
} from 'reactstrap'; */

import Row from 'reactstrap/lib/Row';
import Col from 'reactstrap/lib/Col';
import NavLink from 'reactstrap/lib/NavLink';

import CustomDate from '../UI/CustomDate';

class MoneyHistory extends React.Component {
  static propTypes = {
    t: PropTypes.func.isRequired,
    fetchBalanceHistory: PropTypes.func.isRequired,
    balanceHistory: PropTypes.shape({}),
  }

  static defaultProps = {
    balanceHistory: {},
  }

  constructor(props) {
    super(props);
    this.state = {
      activeTab: '1',
    };
  }

  componentDidMount() {
  //  const { fetchBalanceHistory } = this.props;

  //  fetchBalanceHistory('today');
  }

  shouldComponentUpdate(nextProps, nextState) {
    if (!isEqual(nextProps, this.props)) {
      return true;
    }

    if (!isEqual(nextState, this.state)) {
      return true;
    }

    return false;
  }

  toggle = (tab) => {
    const { fetchBalanceHistory } = this.props;

    if (tab === '1') {
      fetchBalanceHistory('today');
    } else if (tab === '2') {
      fetchBalanceHistory('yesterday');
    } else if (tab === '3') {
      fetchBalanceHistory('2daysBefore');
    }

    const { activeTab } = this.state;
    if (activeTab !== tab) {
      this.setState({
        activeTab: tab,
      });
    }
  }

  render() {
    const {
      balanceHistory, t,
    } = this.props;

    const { activeTab } = this.state;

    return (
      <Fragment>
        <Row className="money-history-tabs" style={{marginBottom:10}}>
          <Col sm="12">
            <Row>
              <Col sm={{ size: 2, offset: 3 }} className="money-history-tab">
                <div className={`money-history-tab-wrapper ${activeTab === '1' && 'active'}`}>
                  <NavLink
                    className="money-history-tab-link"
                    onClick={() => { this.toggle('1'); }}
                  >
                    {t('moneyHistory.today')}
                  </NavLink>
                </div>
              </Col>
              <Col sm="2" className="money-history-tab">
                <div className={`money-history-tab-wrapper ${activeTab === '2' && 'active'}`}>
                  <NavLink
                    className="money-history-tab-link"
                    onClick={() => { this.toggle('2'); }}
                  >
                    {t('moneyHistory.yesterday')}
                  </NavLink>
                </div>
              </Col>
              <Col sm="2" className="money-history-tab">
                <div className={`money-history-tab-wrapper ${activeTab === '3' && 'active'}`}>
                  <NavLink
                    className="money-history-tab-link"
                    onClick={() => { this.toggle('3'); }}
                  >
                    {t('moneyHistory.2daysAgo')}
                  </NavLink>
                </div>
              </Col>
            </Row>
          </Col>
        </Row>
        <Row>
          <Col sm="12">
            <Row className="money-history-table-header">
              <Col sm="2" className="money-history-table-header-col">
                {t('moneyHistory.time')}
              </Col>
              <Col sm="4" className="money-history-table-header-col">
                {t('moneyHistory.type')}
              </Col>
              <Col className="money-history-table-header-col">
                {t('moneyHistory.old')}
              </Col>
              <Col className="money-history-table-header-col">
                {t('moneyHistory.new')}
              </Col>
              <Col className="money-history-table-header-col">
                {t('moneyHistory.change')}
              </Col>
            </Row>
            <ScrollArea
              speed={0.65}
              className="money-history-table-scrollarea"
              contentClassName="money-history-table-body"
              smoothScrolling
              verticalContainerStyle={{
                background: 'transparent',
                opacity: 1,
                width: 5,
              }}
              verticalScrollbarStyle={{
                background: '#fff',
                borderRadius: 0,
                width: 4,
              }}
              horizontal={false}
              ref={(el) => { this.messagesScrollbar = el; }}
            >

              {balanceHistory && Object.keys(balanceHistory).reverse().map((key, index) => (
                  <Row key={key} className={`top-table-row ${index % 2 === 0 ? ('odd') : ('even')}`}>
                    <Col sm="2" className="money-history-table-col">
                    {/*  <Moment format="DD-MM-YYYY, HH:mm" locale="lv">
                        {balanceHistory[key].time}
                      </Moment> */}
                      <CustomDate format="DD-MM-YYYY, hh:mm" date={balanceHistory[key].time} />
                    </Col>
                    <Col sm="4" className="money-history-table-col">
                      {balanceHistory[key].type === 'game' && (
                        t('moneyHistory.gameResult')
                      )}
                      {balanceHistory[key].type === 'joinPrice' && (
                        t('moneyHistory.joinPrice')
                      )}
                      {balanceHistory[key].type === 'dailyBonus' && (
                        t('moneyHistory.dailyBonus')
                      )}
                      {balanceHistory[key].type === 'leaveTournament' && (
                        t('moneyHistory.leaveTournament')
                      )}
                      {balanceHistory[key].type === 'joinTournament' && (
                        t('moneyHistory.joinTournament')
                      )}
                      {balanceHistory[key].type === 'winTournament' && (
                        t('moneyHistory.winTournament')
                      )}
                      {balanceHistory[key].type === 'buyTournamentMoney' && (
                        t('moneyHistory.buyTournamentMoney')
                      )}
                      {balanceHistory[key].type === 'friendReceived' && (
                        t('moneyHistory.friendReceived')
                      )}
                      {balanceHistory[key].type === 'friendSent' && (
                        t('moneyHistory.friendSent')
                      )}
                      {balanceHistory[key].type === 'purchaseCallback' && (
                        t('moneyHistory.purchaseCallback')
                      )}
                      {balanceHistory[key].type === 'purchase' && (
                        t('moneyHistory.purchase')
                      )}
                      {balanceHistory[key].type === 'missTurnMe' && (
                        t('moneyHistory.missTurnMe')
                      )}
                      {balanceHistory[key].type === 'missTurnOther' && (
                        t('moneyHistory.missTurnOther')
                      )}
                      {balanceHistory[key].type === 'leftRoom' && (
                        t('moneyHistory.leftRoom')
                      )}
                      {balanceHistory[key].type === 'adminChange' && (
                        t('moneyHistory.adminChange')
                      )}
                      {balanceHistory[key].type === 'giftsSent' && (
                        t('moneyHistory.giftsSent')
                      )}
                      {balanceHistory[key].type === 'endRoomPules' && (
                        t('moneyHistory.endRoomPules')
                      )}
                      {balanceHistory[key].type === 'achievement' && (
                        t('moneyHistory.achievement')
                      )}
                    </Col>
                    <Col className="money-history-table-col">
                      {balanceHistory[key].old}
                    </Col>
                    <Col className="money-history-table-col">
                      {balanceHistory[key].new}
                    </Col>
                    <Col className="money-history-table-col">
                      {balanceHistory[key].change}
                    </Col>
                  </Row>
                ))}
            </ScrollArea>
          </Col>
        </Row>


      </Fragment>
    );
  }
}

export default withTranslation('common')(MoneyHistory);
