import React, { Fragment } from 'react';
import PropTypes from 'prop-types';

import { withTranslation } from 'react-i18next';
import ScrollArea from 'react-scrollbar';

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

import myInfoImg from '../../../images/icons/my_profile.png';


const findAchievement = (key, borders, value, t, rev) => {
  let name = '';
  if (key === 'gamesPlayed') {
    if (value === 1) {
      name = t('firstGame');
    } else {
      name = t('gamesPlayed');
    }
  } else if (key === 'gamesWon') {
    if (value < 3) {
      name = t('firstWin');
    } else {
      name = t('wins');
    }
  } else if (key === 'zolePlayed') {
    if (value < 3) {
      name = t('zolePlayed');
    } else {
      name = t('zolesPlayed');
    }
  } else if (key === 'zoleWon') {
    if (value < 5) {
      name = t('zoleWon');
    } else {
      name = t('zolesWon');
    }
  } else if (key === 'mazaZolePlayed') {
    if (value < 3) {
      name = t('mazaZolePlayed');
    } else {
      name = t('mazasZolesPlayed');
    }
  } else if (key === 'mazaZoleWon') {
    if (value < 5) {
      name = t('mazaZoleWon');
    } else {
      name = t('mazasZolesWon');
    }
  } else if (key === 'giftsSent') {
    if (value === 1) {
      name = t('giftSent');
    } else {
      name = t('giftsSent');
    }
  } else if (key === 'giftsReceived') {
    if (value === 1) {
      name = t('giftReceived');
    } else {
      name = t('giftsReceived');
    }
  }
  else if (key === 'storePurchase') {
    if (value === 1) {
      name = t('storePurchase');
    } else {
      name = t('storePurchases');
    }
  }
  else if (key === 'supportMessagesSent') {
    if (value === 1) {
      name = t('supportMessageSent');
    } else {
      name = t('supportMessagesSent');
    }
  } else if (key === 'maxParties') {
    name = t('maxParties');
  } else if (key === 'maxSuccessionWins') {
    name = t('maxSuccessionWins');
  } else if (key === 'maxSuccessionLosses') {
    name = t('maxSuccessionLosses');
  }else if (key === 'fastGamesPlayed') {
    if (value === 1) {
      name = t('fastGamePlayed');
    } else {
      name = t('fastGamesPlayed');
    }
  } else if (key === 'bonusSpins'){
    name = t('bonusSpins');
  } else if (key === 'joinedTournaments'){
    name = t('joinedTournaments');
  } else if (key === 'reachedTournamentTop10'){
    name = t('reachedTournamentTop10');
  } else if (key === 'balance'){
    name = t('balance');
  } else if (key === 'winLarge61') {
    name = t('winLarge61');
  } else if (key === 'winLarge91') {
    name = t('winLarge91');
  } else if (key === 'winLarge120') {
    name = t('winLarge120');
  } else if (key === 'winSmall60') {
    name = t('winSmall60');
  } else if (key === 'winZoleAll') {
    name = t('winZoleAll');
  } else if (key === 'winZoleTwoAces') {
    name = t('winZoleTwoAces');
  } else if (key === 'loseLarge60') {
    name = t('loseLarge60');
  } else if (key === 'loseLarge30') {
    name = t('loseLarge30');
  } else if (key === 'loseLarge0') {
    name = t('loseLarge0');
  } else if (key === 'reachedTop100') {
    /*if (value === 1) {
      name = 'diena';
    } else if (value < 7) {
      name = 'dienas';
    } else if (value < 14) {
      name = 'nedēļa';
    } else if (value < 30) {
      name = 'nedēļas';
    } else if (value < 60) {
      name = 'mēnesis';
    } else if (value < 365) {
      name = 'mēneši';
    } else if (value < 730) {
      name = 'gads';
    } else if (value >= 730) {
      name = 'gadi';
    }*/

    name = t('reachedTop100');
  } else if (key === 'take3Aces'){
    name = t('take3Aces');
  } else if (key === 'take0Points'){
    name = t('take0Points');
  }

  var noCounter = ['winLarge61', 'winLarge91', 'winLarge120', 'winSmall60',
    'reachedTop100', 'winZoleAll', 'take3Aces', 'winZoleTwoAces', 'loseLarge60', 'loseLarge30', 'loseLarge0', 'take0Points'];

  for (let i = 0; i < borders.length; i += 1) {
    if ((borders[i + 1] && value >= borders[i] && value < borders[i + 1]) || (!borders[i + 1] && value >= borders[i])) {
      var img;

      try{
        if(borders[i + 1]){
          img = require(`../../../images/Ach/${key}_${borders[i]}_${borders[i + 1]}.svg`);
        }else{
          img = require(`../../../images/Ach/${key}_${borders[i]}.svg`);
        }
      } catch(e) {

      }

      var val = borders[i] >= 1000 ? (borders[i] / 1000)+'k' : borders[i];

      return (
          <Col sm="2" className="ach-column" key={key}>
            <div><Media src={img} /></div>
            {!rev ? (
              <span>{`${noCounter.includes(key) ? ('') : (val)} ${name}`}</span>
            ):(
              <span>{`${name} ${noCounter.includes(key) ? ('') : (val)}`}</span>
            )}
          </Col>
      );
    }
  }
  return null;
};

class Achievements extends React.Component {
  static propTypes = {
    t: PropTypes.func.isRequired,
    fetchAchievements: PropTypes.func.isRequired,
    changeTab: PropTypes.func.isRequired,
    member: PropTypes.shape({
      achievements: PropTypes.shape({}),
      gamesPlayed: PropTypes.number,
      gamesWon: PropTypes.number,
    }),
  }

  static defaultProps = {
    member: {},
  }

  constructor(props) {
    super(props);
    this.state = {
    };
  }

  componentDidMount() {
    const { fetchAchievements } = this.props;

    fetchAchievements();
  }

  render() {
    const {
      t, changeTab, member,
    } = this.props;

    const { userAchievements, gamesPlayed, gamesWon, balance } = member;

    return (
      <div className="my-info">
        <Row className="my-info-header">
          <Col sm="4">
            <Media src={myInfoImg} className="my-info-header-image" />
            <div className="my-info-header-text">
              {t('common:myInfo.achievements')}
            </div>
          </Col>
          <Col className="menu-topTab">
            <Button color="link" className="my-info-header-button" onClick={() => changeTab('9')}>
              {t('common:myInfo.friends')}
            </Button>
          </Col>
          <Col className="menu-topTab">
            <Button color="link" className="my-info-header-button" onClick={() => changeTab('10')}>
              {t('common:myInfo.ignoredPlayers')}
            </Button>
          </Col>
          <Col className="menu-topTab" style={{ marginRight: 15 }}>
            <Button color="link" className="my-info-header-button active" onClick={() => changeTab('11')}>
              {t('common:myInfo.achievements')}
            </Button>
          </Col>
        </Row>
        <Row style={{marginTop:20}}>
          <Col sm="12">
            <ScrollArea
              speed={0.65}
              className="ach-table-scrollarea"
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

              <Row>

              {findAchievement('gamesPlayed', [1, 5, 10, 50, 100, 250, 500, 1000, 5000, 10000, 50000, 100000, 250000, 500000, 1000000], gamesPlayed, t)}

              {findAchievement('gamesWon', [1, 3, 5, 10, 25, 50, 100, 250, 500, 1000, 5000, 10000, 25000, 100000, 500000], gamesWon, t)}

              {findAchievement('balance', [1000, 2500, 5000, 10000, 25000, 50000, 75000, 100000, 250000, 500000, 1000000, 3000000, 5000000, 10000000], balance, t, true)}


              {userAchievements && Object.keys(userAchievements).map(key => (
                <Fragment>

                  {/* in */}
                  {key === 'maxSuccessionWins' && (
                    findAchievement(key, [3, 5, 10, 25, 50, 100, 250, 500, 1000, 5000, 10000, 25000, 100000, 500000], userAchievements[key], t)
                  )}

                  {/* in */}
                  {key === 'maxSuccessionLosses' && (
                    findAchievement(key, [3, 5, 7, 10, 15, 20, 25, 30, 40, 50, 60, 70, 80, 90, 100], userAchievements[key], t)
                  )}

                  {/* in */}
                  {key === 'zolePlayed' && (
                    findAchievement(key, [1, 3, 5, 10, 100, 250, 500, 1000, 5000, 10000, 50000, 100000, 250000, 500000, 1000000], userAchievements[key], t)
                  )}

                  {/* in */}
                  {key === 'zoleWon' && (
                    findAchievement(key, [1, 5, 10, 25, 50, 75, 100, 250, 500, 1000, 2500, 5000, 10000, 25000, 50000], userAchievements[key], t)
                  )}

                  {/* in */}
                  {key === 'fastGamesPlayed' && (
                    findAchievement(key, [1, 3, 5, 10, 100, 250, 500, 1000, 5000, 10000, 50000, 100000, 250000, 500000, 1000000], userAchievements[key], t)
                  )}

                  {/* in */}
                  {key === 'mazaZolePlayed' && (
                    findAchievement(key, [1, 3, 5, 10, 100, 250, 500, 1000, 10000, 25000, 50000], userAchievements[key], t)
                  )}

                  {/* in */}
                  {key === 'mazaZoleWon' && (
                    findAchievement(key, [1, 5, 10, 25, 50, 75, 100, 250, 500, 1000, 2500, 5000, 10000, 25000, 50000], userAchievements[key], t)
                  )}

                  {/* in */}
                  {key === 'bonusSpins' && (
                    findAchievement(key, [3, 5, 7, 10, 15, 20, 25, 30, 40, 50, 75, 100, 250, 500, 1000], userAchievements[key], t)
                  )}

                  {/* in */}
                  {key === 'joinedTournaments' && (
                    findAchievement(key, [3, 5, 7, 10, 15, 20, 25, 30, 40, 50, 75, 100, 250, 500, 1000], userAchievements[key], t)
                  )}

                  {/* in */}
                  {key === 'giftsReceived' && (
                    findAchievement(key, [1, 3, 5, 10, 25, 50, 75, 100, 250, 500, 750, 1000, 2000, 3000, 5000], userAchievements[key], t)
                  )}

                  {/* in */}
                  {key === 'reachedTournamentTop10' && (
                    findAchievement(key, [1, 3, 5, 7, 10, 15, 20, 25, 30, 35, 50, 75, 100, 250, 500], userAchievements[key], t)
                  )}

                  {/* in */}
                  {key === 'winLarge61' && (
                    findAchievement(key, [1], userAchievements[key], t)
                  )}

                  {/* in */}
                  {key === 'winLarge91' && (
                    findAchievement(key, [1], userAchievements[key], t)
                  )}

                  {/* in */}
                  {key === 'winLarge120' && (
                    findAchievement(key, [1], userAchievements[key], t)
                  )}

                  {/* in */}
                  {key === 'winSmall60' && (
                    findAchievement(key, [1], userAchievements[key], t)
                  )}

                  {/* in */}
                  {key === 'reachedTop100' && (
                    findAchievement(key, [1, 3, 5, 7, 14, 30, 60, 90, 120, 150, 180, 270, 365, 730, 1095], userAchievements[key], t)
                  )}

                  {/* in */}
                  {key === 'giftsSent' && (
                    findAchievement(key, [1, 3, 5, 10, 25, 50, 75, 100, 250, 500, 750, 1000, 2000, 3000, 5000], userAchievements[key], t)
                  )}

                  {/* in */}
                  {key === 'maxParties' && (
                    findAchievement(key, [3, 5, 7, 10, 15, 20, 25, 50, 75, 100, 150, 200, 250, 500, 1000], userAchievements[key], t)
                  )}

                  {/* in */}
                  {key === 'supportMessagesSent' && (
                    findAchievement(key, [1, 2, 3, 5, 7, 10, 15, 20, 25, 50, 75, 100, 250, 500, 1000], userAchievements[key], t)
                  )}

                  {/* in */}
                  {key === 'storePurchase' && (
                    findAchievement(key, [1, 2, 3, 5, 10, 15, 20, 25, 30, 35, 50, 75, 100, 250, 500], userAchievements[key], t)
                  )}

                  {/* in */}
                  {key === 'winZoleAll' && (
                    findAchievement(key, [1], userAchievements[key], t)
                  )}

                  {/* in */}
                  {key === 'take3Aces' && (
                    findAchievement(key, [1], userAchievements[key], t)
                  )}

                  {/* in */}
                  {key === 'take0Points' && (
                    findAchievement(key, [1], userAchievements[key], t)
                  )}

                  {/* in */}
                  {key === 'winZoleTwoAces' && (
                    findAchievement(key, [1], userAchievements[key], t)
                  )}

                  {/* in */}
                  {key === 'loseLarge60' && (
                    findAchievement(key, [1], userAchievements[key], t)
                  )}

                  {/* in */}
                  {key === 'loseLarge30' && (
                    findAchievement(key, [1], userAchievements[key], t)
                  )}

                  {/* in */}
                  {key === 'loseLarge0' && (
                    findAchievement(key, [1], userAchievements[key], t)
                  )}
                </Fragment>
              ))}

              </Row>

            </ScrollArea>
          </Col>
        </Row>
      </div>
    );
  }
}

export default withTranslation(['achievements', 'common'])(Achievements);
