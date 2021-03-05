import React, { Fragment } from 'react';
import PropTypes from 'prop-types';

import { withTranslation } from 'react-i18next';

import { Col, Row, Grid } from 'react-native-easy-grid';

import { LinearGradient } from 'expo-linear-gradient';

import {
  Image, View, StyleSheet,
} from 'react-native';
import {
  Text, Button,
} from 'native-base';

import pro from '../../../images/Label-pro.png';
import speed from '../../../images/Label-speed.png';

const styles = StyleSheet.create({
  row: {
    height: 34,
  },
  odd: {
    backgroundColor: 'transparent',
  },
  even: {
    backgroundColor: 'rgba(97,89,73,.3)',
  },

  bet: {
    fontWeight: '700',
    fontSize: 13,
    lineHeight: 18,
    textAlign: 'center',
    color: '#8d8e90',
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

  gameType: {
    width: 27,
    height: 18,
    margin: 'auto',
    fontWeight: '700',
    fontSize: 13,
    lineHeight: 18,
    textAlign: 'center',
    letterSpacing: 0.5,
    color: '#5d8b39',
  },

  gameTypeContainer: {
    width: 27,
    height: 18,
    justifyContent: 'center',
  },

  gameTypeGradient: {
    width: 27,
    height: 18,
    borderRadius: 3,
  },
});

class RoomsTable extends React.Component {
  static propTypes = {
    rooms: PropTypes.shape().isRequired,
    joinRoom: PropTypes.func.isRequired,
    uid: PropTypes.string,
    t: PropTypes.func.isRequired,
  }

  static defaultProps = {
    uid: '',
  }

  constructor(props) {
    super(props);
    this.state = {
      joinRoomClicked: false,
      //  orientation: Dimensions.get('window').width < Dimensions.get('window').height ? ('portrait') : ('landscape'),
    };

    /*  Dimensions.addEventListener('change', (e) => {
    //  console.log(e);
      this.setState();

      if (e.window.width < e.window.height) {
        this.setState({ ...e.window, orientation: 'portrait' });
      } else {
        this.setState({ ...e.window, orientation: 'landscape' });
      }
    });
    */

    this.joinRoomClicked = this.joinRoomClicked.bind(this);
  }


  joinRoomClicked(roomId, position) {
    const { joinRoom } = this.props;

    this.setState({ joinRoomClicked: true });
    joinRoom({ roomId, position });

    setTimeout(() => {
      this.setState({ joinRoomClicked: false });
    }, 1500);
  }


  render() {
    const {
      uid, t, rooms,
    } = this.props;

    const {
      joinRoomClicked,
    } = this.state;

    return (
      <Fragment>
        <View style={{ flex: 3, flexDirection: 'column' }}>
          <Grid>
            {rooms && Object.keys(rooms).map((key, index) => (
              <Fragment key={key}>
                {rooms[key].globalParams && !rooms[key].globalParams.roomClosed
                  && rooms[key].playersList && (
                  <Row key={key} style={[styles.row, index % 2 === 0 ? styles.even : styles.odd]}>
                    <Col style={{ width: '10%', justifyContent: 'center' }}>
                      <Text style={[styles.bet]}>
                        {rooms[key].globalParams.bet}
                      </Text>
                    </Col>
                    <Col style={{ width: '5%', justifyContent: 'center' }}>
                      {rooms[key].globalParams.gameType === 'P' ? (
                        <View style={[styles.gameTypeContainer]}>
                          <LinearGradient
                            colors={['#fff', '#6a6969']}
                            start={[0, 0.5]}
                            style={[styles.gameTypeGradient]}
                          >
                            <Text style={[styles.gameType]}>
                              P
                            </Text>
                          </LinearGradient>
                        </View>
                      ) : (
                        <View style={[styles.gameTypeContainer]}>
                          <LinearGradient
                            colors={['#fff', '#6a6969']}
                            start={[0, 0.5]}
                            style={[styles.gameTypeGradient]}
                          >
                            <Text style={[styles.gameType]}>
                              MG
                            </Text>
                          </LinearGradient>
                        </View>
                      )}
                    </Col>
                    <Col style={{
                      width: '5%', padding: 0, paddingTop: 5, paddingLeft: 10, justifyContent: 'center',
                    }}
                    >
                      {rooms[key].globalParams.fastGame && (
                      <Fragment>
                        <Image source={speed} />
                      </Fragment>
                      )}
                    </Col>
                    <Col style={{ width: '5%', justifyContent: 'center' }}>
                      {rooms[key].globalParams.proGame && (
                      <Fragment>
                        <Image source={pro} />
                      </Fragment>
                      )}
                    </Col>
                    <Col style={{ width: '25%', justifyContent: 'center' }}>
                      {rooms[key].playersList && rooms[key].playersList.player1 ? (
                        <Fragment>
                          {rooms[key].playersList.player1.uid === uid ? (
                            <LinearGradient colors={['#b4ec51', '#429321']} style={[styles.gradient]}>
                              <Text
                                style={[styles.button]}
                                to={`/zole/${key}`}
                              >
                                {t('roomsTable.return')}
                              </Text>
                            </LinearGradient>
                          ) : (
                            <Text style={{ color: '#fff' }}>
                              {`${rooms[key].playersList.player1.name}`}
                            </Text>
                          )}
                        </Fragment>
                      ) : (
                        <View>
                          {rooms[key].playersList && ((rooms[key].playersList.player2
                            && rooms[key].playersList.player2.uid === uid)
                            || (rooms[key].playersList.player3
                            && rooms[key].playersList.player3.uid === uid)) ? (
                              <LinearGradient colors={['#b4ec51', '#429321']} style={[styles.gradient]}>
                                <Button
                                  onPress={() => console.log('already joned room')}
                                  style={[styles.button]}
                                >
                                  <Text>
                                    {t('roomsTable.alreadyJoined')}
                                  </Text>
                                </Button>
                              </LinearGradient>
                            ) : (
                              <LinearGradient colors={['#b4ec51', '#429321']} style={[styles.gradient]}>
                                <Button
                                  disabled={joinRoomClicked}
                                  onPress={() => this.joinRoomClicked(key, 'player1')}
                                  style={[styles.button]}
                                >
                                  <Text>
                                    {t('roomsTable.join')}
                                  </Text>
                                </Button>
                              </LinearGradient>
                            )}
                        </View>
                      )}
                    </Col>
                    <Col style={{ width: '25%', justifyContent: 'center' }}>
                      {rooms[key].playersList && rooms[key].playersList.player2 ? (
                        <Fragment>
                          {rooms[key].playersList.player2.uid === uid ? (
                            <LinearGradient colors={['#b4ec51', '#429321']} style={[styles.gradient]}>
                              <Text
                                style={[styles.button]}
                                to={`/zole/${key}`}
                              >
                                {t('roomsTable.return')}
                              </Text>
                            </LinearGradient>
                          ) : (
                            <Text style={{ color: '#fff' }}>
                              {`${rooms[key].playersList.player2.name}`}
                            </Text>
                          )}
                        </Fragment>
                      ) : (
                        <View>
                          {rooms[key].playersList && ((rooms[key].playersList.player1
                            && rooms[key].playersList.player1.uid === uid)
                            || (rooms[key].playersList.player3
                            && rooms[key].playersList.player3.uid === uid)) ? (
                              <LinearGradient colors={['#b4ec51', '#429321']} style={[styles.gradient]}>
                                <Button
                                  onPress={() => console.log('already joned room')}
                                  style={[styles.button]}
                                >
                                  <Text>
                                    {t('roomsTable.alreadyJoined')}
                                  </Text>
                                </Button>
                              </LinearGradient>
                            ) : (
                              <LinearGradient colors={['#b4ec51', '#429321']} style={[styles.gradient]}>
                                <Button
                                  disabled={joinRoomClicked}
                                  onPress={() => this.joinRoomClicked(key, 'player2')}
                                  style={[styles.button]}
                                >
                                  <Text>
                                    {t('roomsTable.join')}
                                  </Text>
                                </Button>
                              </LinearGradient>
                            )}
                        </View>
                      )}
                    </Col>
                    <Col style={{ width: '25%', justifyContent: 'center' }}>
                      {rooms[key].playersList && rooms[key].playersList.player3 ? (
                        <Fragment>
                          {rooms[key].playersList.player3.uid === uid ? (
                            <LinearGradient colors={['#b4ec51', '#429321']} style={[styles.gradient]}>
                              <Text
                                style={[styles.button]}
                                to={`/zole/${key}`}
                              >
                                {t('roomsTable.return')}
                              </Text>
                            </LinearGradient>
                          ) : (
                            <Text style={{ color: '#fff' }}>
                              {`${rooms[key].playersList.player3.name}`}
                            </Text>
                          )}
                        </Fragment>
                      ) : (
                        <View>
                          {rooms[key].playersList && ((rooms[key].playersList.player1
                            && rooms[key].playersList.player1.uid === uid)
                            || (rooms[key].playersList.player2
                            && rooms[key].playersList.player2.uid === uid)) ? (
                              <LinearGradient colors={['#b4ec51', '#429321']} style={[styles.gradient]}>
                                <Button
                                  style={[styles.button]}
                                  onPress={() => console.log('already joned room')}
                                >
                                  <Text>
                                    {t('roomsTable.alreadyJoined')}
                                  </Text>
                                </Button>
                              </LinearGradient>
                            ) : (
                              <LinearGradient colors={['#b4ec51', '#429321']} style={[styles.gradient]}>
                                <Button
                                  disabled={joinRoomClicked}
                                  onPress={() => this.joinRoomClicked(key, 'player3')}
                                  style={[styles.button]}
                                >
                                  <Text>
                                    {t('roomsTable.join')}
                                  </Text>
                                </Button>
                              </LinearGradient>
                            )}
                        </View>
                      )}
                    </Col>
                  </Row>
                )}
              </Fragment>
            ))}
          </Grid>
        </View>
        <View style={{ flex: 1, flexDirection: 'row' }}>
          <View style={{ flex: 1, flexDirection: 'row' }} />
          <View style={{ flex: 2, flexDirection: 'row' }}>
            <View style={{ flex: 1, flexDirection: 'row' }}>
              <View style={[styles.gameTypeContainer]}>
                <LinearGradient
                  colors={['#fff', '#6a6969']}
                  start={[0, 0.5]}
                  style={[styles.gameTypeGradient]}
                >
                  <Text style={[styles.gameType]}>
                    P
                  </Text>
                </LinearGradient>
              </View>
            </View>
            <View style={{ flex: 3, flexDirection: 'row', color: '#fff' }}>
              <Text style={{ color: '#fff' }}>
                {t('roomsTable.regular')}
              </Text>
            </View>
          </View>

          <View style={{ flex: 3, flexDirection: 'row' }}>
            <View style={{ flex: 1, flexDirection: 'row' }}>
              <View style={[styles.gameTypeContainer]}>
                <LinearGradient
                  colors={['#fff', '#6a6969']}
                  start={[0, 0.5]}
                  style={[styles.gameTypeGradient]}
                >
                  <Text style={[styles.gameType]}>
                  GM
                  </Text>
                </LinearGradient>
              </View>
            </View>
            <View style={{ flex: 3, flexDirection: 'row', color: '#fff' }}>
              <Text style={{ color: '#fff' }}>
                {t('roomsTable.galdsMaza')}
              </Text>
            </View>
          </View>

          <View style={{ flex: 2, flexDirection: 'row' }}>
            <View style={{ flex: 1, flexDirection: 'row' }}>
              <View>
                <Image source={speed} />
              </View>
            </View>
            <View style={{ flex: 3, flexDirection: 'row', color: '#fff' }}>
              <Text style={{ color: '#fff' }}>
                {t('roomsTable.fastGame')}
              </Text>
            </View>
          </View>
        </View>
      </Fragment>
    );
  }
}

export default withTranslation('common')(RoomsTable);
