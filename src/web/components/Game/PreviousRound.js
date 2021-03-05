import React from 'react';
import PropTypes from 'prop-types';

import { withTranslation } from 'react-i18next';

import Button from 'reactstrap/lib/Button';
import Media from 'reactstrap/lib/Media';
import Modal from 'reactstrap/lib/Modal';
import ModalHeader from 'reactstrap/lib/ModalHeader';
import ModalBody from 'reactstrap/lib/ModalBody';
import ModalFooter from 'reactstrap/lib/ModalFooter';

import previousRoundImg from '../../../images/Game/previous_round.png';
import previousRoundHeaderImg from '../../../images/Game/previous_round_header.png';
import closeImg from '../../../images/icons/close.png';

class PreviousRound extends React.Component {
  static propTypes = {
    cards: PropTypes.arrayOf(PropTypes.string),
    gameState: PropTypes.string,
    t: PropTypes.func.isRequired,
    playButtonSound: PropTypes.func.isRequired,
    fetchPreviousRound: PropTypes.func,
    cardPlayed: PropTypes.string,
    currentTurnUid: PropTypes.string,
    memberUid: PropTypes.string,
    currentTable: PropTypes.arrayOf(PropTypes.shape()),
  };

  static defaultProps = {
    cards: [],
    gameState: null,
    cardPlayed: null,
    currentTurnUid: null,
    memberUid: null,
    currentTable: [],
  };

  constructor(props) {
    super(props);
    this.state = {
      modalOpen: false,
    };
  }

  componentDidMount() {
  }

  shouldComponentUpdate(nextProps, nextState) {
    const { previousRound } = nextProps;
    const { previousRound: curPreviousRound } = this.props;

    const { modalOpen } = nextState;
    const { curModalOpen } = this.state;

    if (modalOpen !== curModalOpen) {
      return true;
    }

    if (JSON.stringify(previousRound) !== JSON.stringify(curPreviousRound)) {
      return true;
    }

    return false;
  }

  toggle = () => {
    const { fetchPreviousRound, playButtonSound } = this.props;
    const { modalOpen } = this.state;

    playButtonSound();
    if (modalOpen) {
      this.setState({
        modalOpen: false,
      });
    } else {
      fetchPreviousRound().then(() => {
        this.setState({
          modalOpen: true,
        });
      });
    }
  };

  render() {
    const { previousRound, players, t } = this.props;
    const { modalOpen } = this.state;

    const { lastDealtCards, beatCardPoints } = previousRound;

    return (
      <>
        <div className="previous-round">
          <Media
            src={previousRoundImg}
            className="previous-round-image"
            onClick={this.toggle}
          />
        </div>
        <Modal
          size="lg"
          isOpen={modalOpen}
          toggle={this.toggle}
          className="previous-round-modal"
        >
          <ModalHeader
            toggle={this.toggle}
            className="previous-round-modal-header"
            close={
              <Media
                src={closeImg}
                className="previous-round-modal-header-close"
                alt="X"
                onClick={this.toggle}
              />
            }
          >
            <div className="previous-round-header">
              <Media
                src={previousRoundHeaderImg}
                className="previous-round-header-image"
                onClick={this.toggle}
              />
              <div className="previous-round-header-text">
                {t('previousRoundHeader')}
              </div>
            </div>
          </ModalHeader>
          <ModalBody className="previous-round-modal-body">
            <div className="previous-round-player1">
              <div className="previous-round-player-name">
                {players && players.player1 && players.player1.name}
              </div>
              <div className="previous-round-cards">
                {lastDealtCards && lastDealtCards.player1 && (
                  <>
                    {lastDealtCards.player1.map((card, index) => (
                      <div
                        className={`previous-round-card previous-round-card-${index} previous-round-card-${card}`}
                      />
                    ))}
                  </>
                )}
              </div>
              <div className="previous-round-points">
                {beatCardPoints && beatCardPoints.tricks && (
                  <>
                    <b className="display-inline">
                      {`${beatCardPoints.player1 || 0} `}
                    </b>
                    <p className="display-inline">{t('pointsWith')}</p>
                    <b className="display-inline">
                      {` ${beatCardPoints.tricks.player1 || 0} `}
                    </b>
                    <p className="display-inline">
                      {`${
                        beatCardPoints.tricks.player1 === 1
                          ? t('trick')
                          : t('tricks')
                      }`}
                    </p>
                  </>
                )}
              </div>
            </div>
            <div className="previous-round-player2">
              <div className="previous-round-player-name">
                {players && players.player2 && players.player2.name}
              </div>
              <div className="previous-round-cards">
                {lastDealtCards && lastDealtCards.player2 && (
                  <>
                    {lastDealtCards.player2.map((card, index) => (
                      <div
                        className={`previous-round-card previous-round-card-${index} previous-round-card-${card}`}
                      />
                    ))}
                  </>
                )}
              </div>
              <div className="previous-round-points">
                {beatCardPoints && beatCardPoints.tricks && (
                  <>
                    <b className="display-inline">
                      {`${beatCardPoints.player2 || 0} `}
                    </b>
                    <p className="display-inline">{t('pointsWith')}</p>
                    <b className="display-inline">
                      {` ${beatCardPoints.tricks.player2 || 0} `}
                    </b>
                    <p className="display-inline">
                      {`${
                        beatCardPoints.tricks.player2 === 1
                          ? t('trick')
                          : t('tricks')
                      }`}
                    </p>
                  </>
                )}
              </div>
            </div>
            <div className="previous-round-player3">
              <div className="previous-round-player-name">
                {players && players.player3 && players.player3.name}
              </div>
              <div className="previous-round-cards">
                {lastDealtCards && lastDealtCards.player3 && (
                  <>
                    {lastDealtCards.player3.map((card, index) => (
                      <div
                        className={`previous-round-card previous-round-card-${index} previous-round-card-${card}`}
                      />
                    ))}
                  </>
                )}
              </div>
              <div className="previous-round-points">
                {beatCardPoints && beatCardPoints.tricks && (
                  <>
                    <b className="display-inline">
                      {`${beatCardPoints.player3 || 0} `}
                    </b>
                    <p className="display-inline">{t('pointsWith')}</p>
                    <b className="display-inline">
                      {` ${beatCardPoints.tricks.player3 || 0} `}
                    </b>
                    <p className="display-inline">
                      {`${
                        beatCardPoints.tricks.player3 === 1
                          ? t('trick')
                          : t('tricks')
                      }`}
                    </p>
                  </>
                )}
              </div>
            </div>
            <div className="previous-round-tableCards">
              <div className="previous-round-player-name">
                Kārtis galdā
              </div>
              <div className="previous-round-table-cards">
                {lastDealtCards && lastDealtCards.cardsOnTable && (
                  <>
                    {lastDealtCards.cardsOnTable.map((card, index) => (
                      <div
                        className={`previous-round-card previous-round-card-${index} previous-round-card-${card}`}
                      />
                    ))}
                  </>
                )}
              </div>
            </div>
          </ModalBody>
          <ModalFooter className="previous-round-modal-footer">
            <Button
              type="button"
              className="previous-round-modal-footer-button"
              color="secondary"
              onClick={this.toggle}
            >
              {t('ok')}
            </Button>
          </ModalFooter>
        </Modal>
      </>
    );
  }
}

export default withTranslation('previousRound')(PreviousRound);
