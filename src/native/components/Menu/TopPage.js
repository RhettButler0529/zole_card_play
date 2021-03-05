import React, { Fragment } from 'react';
import PropTypes from 'prop-types';

import { withTranslation } from 'react-i18next';

import { Col, Row, Grid } from 'react-native-easy-grid';

import {
  StyleSheet,
} from 'react-native';
import {
  Text,
} from 'native-base';

const styles = StyleSheet.create({
  header: {
    height: 24,
    color: '#fcffb6',
    overflow: 'hidden',
    backgroundColor: '#000',
    justifyContent: 'center',
  },
  playerRow: {
    height: 22,
    color: '#fcffb6',
    overflow: 'hidden',
    backgroundColor: 'rgba(247,180,90,.3)',
    justifyContent: 'center',
  },
  row: {
    height: 20,
    color: '#fcffb6',
    overflow: 'hidden',
    justifyContent: 'center',
  },
  odd: {
    backgroundColor: 'transparent',
  },
  even: {
    backgroundColor: 'rgba(97,89,73,.3)',
  },
  gradient: {
    alignItems: 'center',
    width: '85%',
    margin: 'auto',
  },
  button: {
    borderRadius: 3,
    height: 26,
    fontWeight: '700',
    textAlign: 'center',
    padding: 0,
    margin: 'auto',
    color: '#fff',
    backgroundColor: 'transparent',
  },
});

class TopPage extends React.Component {
  static propTypes = {
    leaderboard: PropTypes.arrayOf(PropTypes.shape()).isRequired,
    myLeaderboard: PropTypes.shape().isRequired,
    t: PropTypes.func.isRequired,
  }

  constructor(props) {
    super(props);
    this.state = {
    };
  }

  render() {
    const {
      leaderboard, myLeaderboard, t,
    } = this.props;

    return (
      <Fragment>
        <Grid>
          <Row style={[styles.header]}>
            <Col style={{ width: '15%' }}>
              <Text style={{ color: '#fff', fontSize: 10 }}>
                {t('top.position')}
              </Text>
            </Col>
            <Col style={{ width: '40%' }}>
              <Text style={{ color: '#fff', fontSize: 10 }}>
                {t('top.player')}
              </Text>
            </Col>
            <Col style={{ width: '15%' }}>
              <Text style={{ color: '#fff', fontSize: 10 }}>
                {t('top.points')}
              </Text>
            </Col>
            <Col style={{ width: '15%' }}>
              <Text style={{ color: '#fff', fontSize: 10 }}>
                {t('top.money')}
              </Text>
            </Col>
            <Col style={{ width: '15%' }}>
              <Text style={{ color: '#fff', fontSize: 10 }}>
                {t('top.parties')}
              </Text>
            </Col>
          </Row>

          <Fragment>
            {myLeaderboard && myLeaderboard.position > 10 && (
              <Row style={[styles.playerRow]}>
                <Col style={{ width: '15%' }}>
                  <Text style={{ color: '#fff', fontSize: 10 }}>
                    {myLeaderboard.position}
                  </Text>
                </Col>
                <Col style={{ width: '40%' }}>
                  <Text style={{ color: '#fff', fontSize: 10 }}>
                    {myLeaderboard.name}
                  </Text>
                </Col>
                <Col style={{ width: '15%' }}>
                  <Text style={{ color: '#fff', fontSize: 10 }}>
                    {myLeaderboard.points}
                  </Text>
                </Col>
                <Col style={{ width: '15%' }}>
                  <Text style={{ color: '#fff', fontSize: 10 }}>
                    {myLeaderboard.balance}
                  </Text>
                </Col>
                <Col style={{ width: '15%' }}>
                  <Text style={{ color: '#fff', fontSize: 10 }}>
                    {myLeaderboard.gamesPlayed}
                  </Text>
                </Col>
              </Row>
            )}
          </Fragment>
          {leaderboard && leaderboard.map((pos, index) => {
            if (index <= 10) {
              return (
                <Row
                  key={pos.position}
                  style={[styles.row, index % 2 === 0 ? styles.even : styles.odd]}
                >
                  <Col style={{ width: '15%' }}>
                    <Text style={{ color: '#fff', fontSize: 10 }}>
                      {index + 1}
                    </Text>
                  </Col>
                  <Col style={{ width: '40%' }}>
                    <Text style={{ color: '#fff', fontSize: 10 }}>
                      {pos.name}
                    </Text>
                  </Col>
                  <Col style={{ width: '15%' }}>
                    <Text style={{ color: '#fff', fontSize: 10 }}>
                      {pos.points}
                    </Text>
                  </Col>
                  <Col style={{ width: '15%' }}>
                    <Text style={{ color: '#fff', fontSize: 10 }}>
                      {pos.balance}
                    </Text>
                  </Col>
                  <Col style={{ width: '15%' }}>
                    <Text style={{ color: '#fff', fontSize: 10 }}>
                      {pos.gamesPlayed}
                    </Text>
                  </Col>
                </Row>
              );
            }
            return null;
          })}
        </Grid>
      </Fragment>
    );
  }
}

export default withTranslation('common')(TopPage);
