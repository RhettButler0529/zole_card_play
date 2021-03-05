import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import Moment from 'react-moment';

import { withTranslation } from 'react-i18next';

import { Col, Row, Grid } from 'react-native-easy-grid';

import {
  View, StyleSheet, ImageBackground, Animated, Easing, Picker, Modal,
} from 'react-native';
import {
  Text, Button,
} from 'native-base';

import { Actions } from 'react-native-router-flux';

// import Leaderboard from './TournamentLeaderboard';

const styles = StyleSheet.create({
  top: {
  },

  header: {
    color: '#8d8e90',
    fontSize: 13,
  },
});

class Tournaments extends React.Component {
  static propTypes = {
    tournaments: PropTypes.shape(),
    tournamentPlayers: PropTypes.shape(),
    myTournamentsData: PropTypes.shape(),
    i18n: PropTypes.shape(),
    t: PropTypes.func.isRequired,
    joinTournament: PropTypes.func.isRequired,
    joinTournamentRoom: PropTypes.func.isRequired,
    buyTournamentMoney: PropTypes.func.isRequired,
  }

  static defaultProps = {
    tournaments: {},
    tournamentPlayers: {},
    myTournamentsData: {},
    i18n: {},
  }

  constructor(props) {
    super(props);
    this.state = {
      openModal: false,
      openJoinModal: false,
      tournamentId: '',
      tournamentBets: {},
    };
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
      });

      this.setState({ tournamentBets });
    }
  }

  joinTournamentNotification = (tournamentId) => {
    console.log('joinTournamentNotification');
    this.setState({
      openJoinModal: true,
      tournamentToJoin: tournamentId,
    });
  }

  toggleJoin = () => {
    console.log('toggleJoin');
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
    console.log('toggle');
    this.setState(prevState => ({
      openModal: !prevState.openModal,
    }));
  }

  buyMoney = (tournamentId) => {
    const { buyTournamentMoney, tournaments } = this.props;

    buyTournamentMoney(tournamentId);
  }

  render() {
    const {
      t,
      tournaments,
      joinTournamentRoom,
      myTournamentsData,
      member,
    } = this.props;

    const {
      openModal,
      leaderboard,
      tournamentId,
      tournamentToJoin,
      openJoinModal,
      tournamentBets,
    } = this.state;

    console.log(tournaments);

    return (
      <Fragment>
        <Grid>
          <Row>
            <Col>
              <Text style={[styles.header]}>
                {t('tournaments.title')}
              </Text>
            </Col>
            <Col>
              <Text style={[styles.header]}>
                {t('tournaments.winningPot')}
              </Text>
            </Col>
            <Col>
              <Text style={[styles.header]}>
                {t('tournaments.entryFee')}
              </Text>
            </Col>
            <Col>
              <Text style={[styles.header]}>
                {t('tournaments.startTime')}
              </Text>
            </Col>
            <Col>
              <Text style={[styles.header]}>
                {t('tournaments.endTime')}
              </Text>
            </Col>
            <Col>
              <Text style={[styles.header]}>
                {t('tournaments.tournamentBal')}
              </Text>
            </Col>
            <Col style={{ width: '10%' }} />
            <Col style={{ width: '10%' }} />
          </Row>
          {tournaments && Object.keys(tournaments).map((key, index) => (
            <Fragment key={key}>
              {tournaments && tournaments[key]
            && tournaments[key].status === 'running' && (
              <Row key={key} style={[styles.row, index % 2 === 0 ? styles.even : styles.odd]}>
                <Col style={{ width: '10%', justifyContent: 'center' }}>
                  <Text style={[styles.top]}>
                    {tournaments[key].name}
                  </Text>
                </Col>
                <Col style={{ width: '10%', justifyContent: 'center' }}>
                  <Text style={[styles.top]}>
                    {tournaments[key].winningPot}
                  </Text>
                </Col>
                <Col style={{ width: '10%', justifyContent: 'center' }}>
                  <Text style={[styles.top]}>
                    {tournaments[key].entryFee}
                  </Text>
                </Col>
                <Col style={{ width: '10%', justifyContent: 'center' }}>
                  <Text style={[styles.top]}>
                    {tournaments[key].startTime}
                  </Text>
                </Col>
                <Col style={{ width: '10%', justifyContent: 'center' }}>
                  <Text style={[styles.top]}>
                    {tournaments[key].endTime}
                  </Text>
                </Col>
                <Col style={{ width: '10%', justifyContent: 'center' }}>
                  <Text style={[styles.top]}>
                    {myTournamentsData && myTournamentsData[key] && myTournamentsData[key].bal}
                  </Text>
                </Col>
                <Col style={{ width: '10%', justifyContent: 'center' }}>
                  {(!myTournamentsData || (myTournamentsData && !myTournamentsData[key]) || (
                    myTournamentsData[key] && !myTournamentsData[key].registered))
               && tournaments[key].registrationStart < (Date.now() + member.offset)
               && tournaments[key].registrationEnd > (Date.now() + member.offset) && (
               <View className="tournaments-table-col">
                 <Button className="tournaments-table-button" onPress={() => this.joinTournamentNotification(key)}>
                   <Text>
                     {t('tournaments.register')}
                   </Text>
                 </Button>
               </View>
                  )}
                  {myTournamentsData && myTournamentsData[key]
                && myTournamentsData[key].registered
                && tournaments[key].startTime < (Date.now() + member.offset)
                && tournaments[key].endTime > (Date.now() + member.offset) && (
                <Fragment>
                  {myTournamentsData && myTournamentsData[key]
                    && myTournamentsData[key].status ? (
                      <View className="tournaments-table-col">
                        <Button className="tournaments-table-button" onPress={() => {}}>
                          <Text>
                            {t('tournaments.waitingForRoom')}
                          </Text>
                        </Button>
                      </View>
                    ) : (
                      <Fragment>
                        {myTournamentsData[key]
                         && tournamentBets[key] * 16 >= myTournamentsData[key].bal ? (
                           <View className="tournaments-table-col">
                             <Button className="tournaments-table-button" onPress={() => this.buyMoney(key)}>
                               <Text>
                                 Pirkt
                               </Text>
                             </Button>
                           </View>
                          ) : (
                            <View className="tournaments-table-col">
                              <Button className="tournaments-table-button" onPress={() => joinTournamentRoom(key)}>
                                <Text>
                                  {t('tournaments.play')}
                                </Text>
                              </Button>
                            </View>
                          )}
                      </Fragment>
                    )}
                </Fragment>
                  )}
                </Col>

                <Col style={{ width: '10%', justifyContent: 'center' }}>
                  <Button onPress={() => this.openModal(key)}>
                    <Text>
                      {t('tournaments.leaderboard')}
                    </Text>
                  </Button>
                </Col>
              </Row>
              )}
            </Fragment>
          ))}
        </Grid>

        {/*
        <View style={{ width: '100%' }}>
          <View className="tournaments-table-header">
            <View style={{ flex: 1, flexDirection: 'row' }}>
              <Text>
                {t('tournaments.title')}
              </Text>
              <Text>
                {t('tournaments.winningPot')}
              </Text>
              <Text>
                {t('tournaments.entryFee')}
              </Text>
              <Text>
                {t('tournaments.startTime')}
              </Text>
              <Text>
                {t('tournaments.endTime')}
              </Text>
              <Text>
                {t('tournaments.tournamentBal')}
              </Text>
              <Text style={{ width: '10%' }} />
              <Text style={{ width: '10%' }} />
            </View>
            {tournaments && Object.keys(tournaments).map((key, index) => (
              <Fragment key={key}>
                {tournaments && tournaments[key]
                   && tournaments[key].status === 'running' && (
                   <View style={{ flex: 1, flexDirection: 'row' }}>
                     <Text style={{ color: '#fff' }} className="tournaments-table-col">
                       {tournaments[key].name}
                     </Text>
                     <Text style={{ color: '#fff' }} className="tournaments-table-col">
                       {tournaments[key].winningPot}
                     </Text>
                     <Text style={{ color: '#fff' }} className="tournaments-table-col">
                       {tournaments[key].entryFee}
                     </Text>
                     <View className="tournaments-table-col">
                       {/*   <Moment format="DD MMMM, HH:mm" locale={i18n.language === 'ru' ? ('ru') : ('lv')}>
                           {tournaments[key].startTime}
                         </Moment>
                     </View>
                     <View className="tournaments-table-col">
                       {/*   <Moment format="DD MMMM, HH:mm" locale={i18n.language === 'ru' ? ('ru') : ('lv')}>
                           {tournaments[key].endTime}
                         </Moment>
                     </View>
                     <Text className="tournaments-table-col">
                       {myTournamentsData && myTournamentsData[key] && myTournamentsData[key].bal}
                     </Text>
                       {(!myTournamentsData || (myTournamentsData && !myTournamentsData[key]) || (
                         myTournamentsData[key] && !myTournamentsData[key].registered))
                      && tournaments[key].registrationStart < (Date.now() + member.offset)
                      && tournaments[key].registrationEnd > (Date.now() + member.offset) && (
                      <View className="tournaments-table-col">
                        <Button className="tournaments-table-button" onPress={() => this.joinTournamentNotification(key)}>
                          <Text>
                            {t('tournaments.register')}
                          </Text>
                        </Button>
                      </View>
                       )}
                       {myTournamentsData && myTournamentsData[key]
                       && myTournamentsData[key].registered
                       && tournaments[key].startTime < (Date.now() + member.offset)
                       && tournaments[key].endTime > (Date.now() + member.offset) && (
                       <Fragment>
                         {myTournamentsData && myTournamentsData[key]
                           && myTournamentsData[key].status ? (
                             <View className="tournaments-table-col">
                               <Button className="tournaments-table-button" onPress={() => {}}>
                                 <Text>
                                   {t('tournaments.waitingForRoom')}
                                 </Text>
                               </Button>
                             </View>
                           ) : (
                             <Fragment>
                               {myTournamentsData[key]
                                && tournamentBets[key] * 16 >= myTournamentsData[key].bal ? (
                                  <View className="tournaments-table-col">
                                    <Button className="tournaments-table-button" onPress={() => this.buyMoney(key)}>
                                      <Text>
                                        Pirkt
                                      </Text>
                                    </Button>
                                  </View>
                                 ) : (
                                   <View className="tournaments-table-col">
                                     <Button className="tournaments-table-button" onPress={() => joinTournamentRoom(key)}>
                                       <Text>
                                         {t('tournaments.play')}
                                       </Text>
                                     </Button>
                                   </View>
                                 )}
                             </Fragment>
                           )}
                       </Fragment>
                       )}
                     <View className="tournaments-table-col">
                       <Button className="tournaments-table-button" onPress={() => this.openModal(key)}>
                         <Text>
                           {t('tournaments.leaderboard')}
                         </Text>
                       </Button>
                     </View>
                   </View>
                )}
              </Fragment>
            ))}
          </View>
        </View>

        */}
        {/*  <Modal vissible={openModal} toggle={this.toggle}>
          <View toggle={this.toggle}>
            <Text>
              {t('tournaments.top')}
            </Text>
          </View>
          <View>
            <Leaderboard leaderboard={leaderboard} tournamentId={tournamentId} />
          </View>
          <View>
            <Button color="secondary" onPress={this.toggle}>
              <Text>
                {t('tournaments.close')}
              </Text>
            </Button>
          </View>
        </Modal>
        */}

        {/*  <Modal
          vissible={false}
          animationType="slide"
          transparent={false}
          onRequestClose={() => { console.log('Modal has been closed.'); }}
        >
          <View>
            <Text>
              {t('tournaments.joinTournament')}
            </Text>
          </View>
          <View>
            <Text>
              {`Vai tiešām vēlies pievienoties turnīram, pievienosanās maksā ${tournamentToJoin && tournaments[tournamentToJoin] && tournaments[tournamentToJoin].entryFee} vLs`}
            </Text>
          </View>
          <View>
            <Button onPress={() => this.joinTournament(tournamentToJoin)}>
              <Text>
                {t('tournaments.register')}
              </Text>
            </Button>
            <Button color="secondary" onPress={this.toggleJoin}>
              <Text>
                {t('tournaments.close')}
              </Text>
            </Button>
          </View>
        </Modal>

        */}

      </Fragment>
    );
  }
}

export default withTranslation('common')(Tournaments);
