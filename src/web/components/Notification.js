import React, { Fragment } from 'react';
import PropTypes from 'prop-types';

import { withTranslation } from 'react-i18next';

import { Link } from 'react-router-dom';

import Lottie from 'react-lottie';


import Row from 'reactstrap/lib/Row';
import Col from 'reactstrap/lib/Col';
import Button from 'reactstrap/lib/Button';
import Media from 'reactstrap/lib/Media';
import Modal from 'reactstrap/lib/Modal';
import ModalHeader from 'reactstrap/lib/ModalHeader';
import ModalBody from 'reactstrap/lib/ModalBody';
import ModalFooter from 'reactstrap/lib/ModalFooter';
// import Nav from 'reactstrap/lib/Nav';
// import NavItem from 'reactstrap/lib/NavItem';
// import NavLink from 'reactstrap/lib/NavLink';
import TabPane from 'reactstrap/lib/TabPane';
import TabContent from 'reactstrap/lib/TabContent';
import Progress from 'reactstrap/lib/Progress';

import closeImg from '../../images/icons/close.png';
import winnerAnimImg from '../../images/Game/winner.json';
import loserAnimImg from '../../images/Game/loser.json';

import winSound from '../../sounds/game_win.mp3';
import loseSound from '../../sounds/game_lose.mp3';

class Notification extends React.Component {
  static propTypes = {
    leaveRoom: PropTypes.func,
    closeModal: PropTypes.func.isRequired,
    closeResultModal: PropTypes.func,
    gameResult: PropTypes.shape(),
    member: PropTypes.shape().isRequired,
    openModal: PropTypes.bool,
    modalType: PropTypes.string,
    openGameResultModal: PropTypes.bool,
    ignoredMessageName: PropTypes.string,
    notificationPlayer: PropTypes.string,
    t: PropTypes.func.isRequired,
    switchTabs: PropTypes.func,
    newLevel: PropTypes.string,
    buyMoney: PropTypes.func,
    closeLevelNotification: PropTypes.func.isRequired,
    userSettings: PropTypes.shape()
  }

  static defaultProps = {
    gameResult: null,
    modalType: '',
    ignoredMessageName: '',
    notificationPlayer: '',
    newLevel: '',
    openModal: false,
  }

  constructor(props) {
    super(props);
    this.state = {
      activeTab: '1',
      playWinAnim: false
    };

    this.closeModal = this.closeModal.bind(this);
    this.closeResultModal = this.closeResultModal.bind(this);
    this.closeLevelUpNotification = this.closeLevelUpNotification.bind(this);
    this.buyMoney = this.buyMoney.bind(this);
    this.toggle = this.toggle.bind(this);

    this.winAudio = new Audio(winSound);
    this.loseAudio = new Audio(loseSound);
  }

  closeModal() {
    const { closeModal, modalType } = this.props;

    if (modalType === 'levelUp') {
      this.closeLevelUpNotification();
    } else {
      closeModal();
    }
  }

  closeLevelUpNotification() {
    const { closeLevelNotification, closeModal } = this.props;

    closeLevelNotification().then(() => {
      closeModal();
    });
  }

  closeResultModal() {
    console.log('closeResultModal');
    const { closeResultModal, closeModal, closeLevelNotification } = this.props;

    closeLevelNotification().then(() => {
      closeResultModal();
      closeModal();
    });
  }

  buyMoney() {
    const { closeModal, switchTabs } = this.props;
    switchTabs('5');
    closeModal();
  }

  toggle(tab) {
    const { activeTab } = this.state;
    if (activeTab !== tab) {
      this.setState({
        activeTab: tab,
      });
    }
  }

  render() {
    const {
      leaveRoom,
      t,
      gameResult,
      buyMoney,
      notificationPlayer,
      newLevel,
      modalType,
      openModal,
      ignoredMessageName,
      lowBalPlayer,
      insufficientBalanceAmount,
      insufficientBalanceBet,
      member,
      openGameResultModal,
      userSettings
    } = this.props;
    const {
      activeTab,
      playWinAnim
    } = this.state;

    if(!!gameResult && !playWinAnim){
      setTimeout(() => {

        if(userSettings && userSettings.soundOn){

          if(gameResult && gameResult.type !== 'pass'){
            if(gameResult.winnerUID && gameResult.winnerUID.includes(member.uid)){
              this.winAudio.play();
            }else{
              this.loseAudio.play();
            }
          }
        }

        this.setState({playWinAnim: true});
      }, 1500);
    }else if(!gameResult && playWinAnim){
      this.setState({playWinAnim: false})
    }

    return (
      <div>
        <Modal isOpen={(openModal && !gameResult) || (openModal && !openGameResultModal) || (openModal && modalType/* && modalType !== 'levelUp'*/)} toggle={modalType === 'lowBalPlayers' ? (leaveRoom) : (this.closeModal)} className="notification">
          <ModalHeader
            toggle={this.closeModal}
            className="notification-header"
            close={
              <Media src={closeImg} className="notification-header-close" alt="X" onClick={this.closeModal} />
            }
          >
          </ModalHeader>
          <ModalBody className="notification-body">
            {modalType && modalType === 'noBalance' && (
              <div>
                {t('noMoneyDescription')}
              </div>
            )}

            {modalType && modalType === 'lowBalance' && (
              <div>
                {`Spēlētajam ${lowBalPlayer} nepietiek naudas lai turpinātu, istaba tiks aizvērta`}
              </div>
            )}

            {modalType && modalType === 'lowBalanceTournament' && (
              <div>
                Pirkt naudu
              </div>
            )}

            {modalType && modalType === 'noBalanceMenu' && (
              <div>
                {t('noMoneyMenuDescription', { amount: insufficientBalanceAmount, bet: insufficientBalanceBet  })}
              </div>
            )}

            {modalType && modalType === 'noBalanceTournament' && (
              <div>
                {t('noBalanceTournament')}
              </div>
            )}

            {modalType && modalType === 'proRoom' && (
              <div>
                {t('onlyProDescription')}
              </div>
            )}

            {modalType && modalType === 'proRoomMenu' && (
              <div>
                {t('onlyProDescription')}
              </div>
            )}

            {modalType && modalType === 'proBetMenu' && (
              <div>
                {t('onlyProBet')}
              </div>
            )}

            {modalType && modalType === 'leaveRoom' && (
              <div>
                {t('leaveRoomWarning')}
              </div>
            )}

            {modalType && modalType === 'leaveRoomNotStarted' && (
              <div>
                {t('leaveRoomNotStarted')}
              </div>
            )}


            {modalType && modalType === 'tournamentEnd' && (
              <div>
                {t('tournamentEnd')}
              </div>
            )}

            {modalType && modalType === 'missedTurn' && (
              <div>
                {t('missedTurn', { player: notificationPlayer })}
              </div>
            )}

            {modalType && modalType === 'lowBal' && (
              <div>
                {t('lowBal', { player: notificationPlayer })}
                {/*`Spēlētajam ${notificationPlayer} beidzās nauda, tāpēc istaba tiks aizvēra`*/}
              </div>
            )}

            {modalType && modalType === 'leftRoom' && (
              <div>
                {t('leftRoom', { player: notificationPlayer })}
              </div>
            )}

            {modalType && modalType === 'lastRound' && (
              <div>
                {t('lastRound', { player: notificationPlayer })}
              </div>
            )}

            {modalType && modalType === 'gameError' && (
              <div>
                {t('gameError')}
              </div>
            )}

            {modalType && modalType === 'youIgnoredPlayer' && (
              <div>
                {t('youIgnoredPlayer', { player: ignoredMessageName })}
              </div>
            )}

            {modalType && modalType === 'playerIgnoredYou' && (
              <div>
                {t('playerIgnoredYou', { player: ignoredMessageName })}
              </div>
            )}

            {modalType && modalType === 'lowBalanceGift' && (
              <div>
                {t('lowBalanceGift')}
              </div>
            )}

            {modalType && modalType === 'levelUp' && (
              <Fragment>
                <div>
                  {t('newLevel')}
                </div>
                <div className="levelProgress-old">
                  <Progress
                    color="success"
                    value={100}
                    className="levelProgress-old-bar"
                  />
                  <div className="levelProgress-old-level-wrapper" style={{ left: '45%' }}>
                    <div
                      className="levelProgress-old-level"
                      style={{ top: 10 }}
                    >
                      {newLevel}
                    </div>
                  </div>
                </div>
              </Fragment>
            )}
          </ModalBody>
          <ModalFooter className="notification-footer">

            {modalType && modalType === 'leaveRoom' && (
              <Fragment>
                <Button className="notification-footer-button" onClick={leaveRoom}>{t('yes')}</Button>
                <Button className="notification-footer-button" onClick={this.closeModal}>{t('no')}</Button>
              </Fragment>
            )}

            {modalType && modalType === 'leaveRoomNotStarted' && (
              <Fragment>
                <Button className="notification-footer-button" onClick={leaveRoom}>{t('yes')}</Button>
                <Button className="notification-footer-button" onClick={this.closeModal}>{t('no')}</Button>
              </Fragment>
            )}

            {modalType && (modalType === 'proRoomMenu' || modalType === 'proRoom' || modalType === 'proBetMenu') && (
              <Button className="notification-footer-button" color="primary" onClick={this.closeModal}>{t('ok')}</Button>
            )}

            {modalType && modalType === 'noBalance' && (
              <Button className="notification-footer-button" color="primary" onClick={this.closeModal}>{t('buyMoney')}</Button>
            )}

            {modalType && modalType === 'lowBalance' && (
              <Fragment>
                <Button className="notification-footer-button" color="primary" onClick={leaveRoom}>{t('common:common.leave')}</Button>
              </Fragment>
            )}

            {modalType && modalType === 'lowBalanceTournament' && (
              <Fragment>
                <Button className="notification-footer-button" color="primary" onClick={() => buyMoney(false)}>{t('buyMoney')}</Button>
                <Button className="notification-footer-button" color="primary" onClick={leaveRoom}>{t('common:common.leave')}</Button>
              </Fragment>
            )}

            {modalType && (modalType === 'noBalanceMenu' || modalType === 'noBalanceTournament') && (
              <Button className="notification-footer-button" color="primary" onClick={this.buyMoney}>{t('buyMoney')}</Button>
            )}

            {modalType && modalType === 'tournamentEnd' && (
              <Fragment>
                <Link to="/" className="btn notification-footer-button">
                  {t('exit')}
                </Link>
              </Fragment>
            )}

            {modalType && (modalType === 'missedTurn' || modalType === 'lowBal') && (
              <Fragment>
              <Button onClick={leaveRoom} className="btn notification-footer-button">
                {t('exit')}
              </Button>
              </Fragment>
            )}

            {modalType && modalType === 'leftRoom' && (
              <Fragment>
              <Button onClick={leaveRoom} className="btn notification-footer-button">
                {t('exit')}
              </Button>
              </Fragment>
            )}

            {modalType && modalType === 'lastRound' && (
              <Fragment>
              {/*  <Link to="/" className="btn notification-footer-button">
                  {t('exit')}
                </Link> */}
                <Button className="notification-footer-button" color="primary" onClick={this.closeModal}>{t('ok')}</Button>
              </Fragment>
            )}

            {modalType && modalType === 'gameError' && (
              <Fragment>
                <Button onClick={leaveRoom} className="btn notification-footer-button">
                  {t('exit')}
                </Button>
              </Fragment>
            )}

            {modalType && modalType === 'lowBalanceGift' && (
              <Button className="notification-footer-button" color="primary" onClick={this.closeModal}>{t('ok')}</Button>
            )}

            {modalType && modalType === 'youIgnoredPlayer' && (
              <Button className="notification-footer-button" color="primary" onClick={this.closeModal}>{t('ok')}</Button>
            )}

            {modalType && modalType === 'playerIgnoredYou' && (
              <Button className="notification-footer-button" color="primary" onClick={this.closeModal}>{t('ok')}</Button>
            )}

            {modalType && modalType === 'levelUp' && (
              <Button className="notification-footer-button" color="primary" onClick={this.closeLevelUpNotification}>{t('ok')}</Button>
            )}

          </ModalFooter>
        </Modal>

        <Modal isOpen={openGameResultModal && !!gameResult/* && modalType !== 'lastRound'*/} toggle={this.closeResultModal} className="notification gameResultNotification">
          <ModalHeader
            className="notification-header"
            close={
              <Media src={closeImg} className="notification-header-close" alt="X" onClick={this.closeResultModal} />
            }
          >

            {gameResult && (
            <Fragment>
              {gameResult.type === 'parasta' && (
                `${t('large')} ${gameResult.winner === 'large' ? (t('wins')) : (t('loses'))}`
              )}
              {gameResult.type === 'zole' && (
                `${t('large')} ${gameResult.winner === 'large' ? (t('wins')) : (t('loses'))} ${t('zoli')}`
              )}
              {gameResult.type === 'mazaZole' && (
                `${gameResult.largePlayer} ${gameResult.winner === 'large' ? (t('wins')) : (t('loses'))} ${t('mazoZoli')}`
              )}
              {gameResult.type === 'galdins' && (
                `${gameResult.winner} ${t('loses')} ${t('table')}`
              )}
              {gameResult.type === 'pass' && (
                `${t('allPassed')}`
              )}
            </Fragment>
            )}
          </ModalHeader>
          <ModalBody className="notification-body">
            <TabContent activeTab={activeTab}>
              <Fragment>
                {gameResult && gameResult.scoreType && (
                <TabPane className="notification-body-tab" tabId={'1'}>
                  <Row>
                    <Col sm="12">
                      <Fragment>
                        {(gameResult.type === 'parasta' || gameResult.type === 'zole') && (
                        <Fragment>
                          {gameResult.scoreType === 'parasts' && gameResult.winner === 'large' && (
                            `${t('largeWinsWith')} ${gameResult.largePoints} ${t('points')}`
                          )}
                          {gameResult.scoreType === 'parasts' && gameResult.winner === 'small' && (
                            `${t('largeLosesWith')} ${gameResult.largePoints} ${t('points')}`
                          )}
                          {gameResult.scoreType === 'jani' && gameResult.winner === 'large' && (
                            `${t('largeWinsWith')} ${gameResult.largePoints} ${t('points')}`
                          )}
                          {gameResult.scoreType === 'jani' && gameResult.winner === 'small' && (
                            `${t('largeLosesWith')} ${gameResult.largePoints} ${t('points')}`
                          )}
                          {gameResult.scoreType === 'bezstikis' && gameResult.winner === 'large' && (
                            `${t('largeWinsWith')} ${t('noTricks')}`
                          )}
                          {gameResult.scoreType === 'bezstikis' && gameResult.winner === 'small' && (
                            `${t('largeLosesWith')} ${t('noTricks')}`
                          )}
                        </Fragment>
                        )}
                        {gameResult.type === 'mazaZole' && (
                        <Fragment>
                          {gameResult.winner === 'large' && (
                            `${t('largeWins')}!`
                          )}
                          {gameResult.winner === 'small' && (
                            `${t('smallWin')}!`
                          )}
                        </Fragment>
                        )}
                        {gameResult.type === 'galdins' && (
                          `${gameResult.largeTricks} ${t('tricks')} (+${gameResult.largePoints})`
                        )}
                      </Fragment>

                    </Col>
                  </Row>
                </TabPane>
                )}

                {gameResult && gameResult.type === 'pass' && (
                  <div style={{ fontSize: 24 }}>{`${t('allPassedBody')}`}</div>
                )}

                {gameResult && gameResult.type !== 'pass' && (
                <Fragment>
                  {(gameResult && gameResult.winnerUID && gameResult.winnerUID.includes(member.uid)) ? (
                  <div
                    className="winner-anim-image"
                    >
                      <Lottie options={{
                        loop: false,
                        autoplay: false,
                        animationData: winnerAnimImg,
                        rendererSettings: {
                          preserveAspectRatio: 'xMidYMid slice'
                        }
                      }}
                        height={202}
                        width={450}
                        isStopped={false}
                        isPaused={!playWinAnim}
                      />
                  </div>
                  ) : (
                  <div
                    className="winner-anim-image"
                    >
                      <Lottie options={{
                        loop: false,
                        autoplay: false,
                        animationData: loserAnimImg,
                        rendererSettings: {
                          preserveAspectRatio: 'xMidYMid slice'
                        }
                      }}
                        height={202}
                        width={450}
                        isStopped={false}
                        isPaused={!playWinAnim}
                      />
                  </div>
                  )}
                </Fragment>
                )}
              </Fragment>
            </TabContent>
          </ModalBody>
          <ModalFooter className="notification-footer">
            <Button className="notification-footer-button" color="primary" onClick={this.closeResultModal}>{t('ok')}</Button>
          </ModalFooter>
        </Modal>
      </div>
    );
  }
}

export default withTranslation(['notifications', 'common'])(Notification);
