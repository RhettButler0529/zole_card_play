import React from 'react';
import PropTypes from 'prop-types';

import myTurnSound from '../../../sounds/my_turn4.mp3';

const erci = ['♥-9', '♥-K', '♥-10', '♥-A'];
const kreisti = ['♣︎-9', '♣︎-K', '♣︎-10', '♣︎-A'];
const piki = ['♠︎-9', '♠︎-K', '♠︎-10', '♠︎-A'];
const trumpji = ['♦︎-7', '♦︎-8', '♦︎-9', '♦︎-K', '♦︎-10', '♦︎-A', '♦︎-J', '♥-J', '♠︎-J', '♣︎-J', '♦︎-Q', '♥-Q', '♠︎-Q', '♣︎-Q'];

const cardOrder = ['♥-9', '♥-K', '♥-10', '♥-A', '♠︎-9', '♠︎-K', '♠︎-10', '♠︎-A', '♣︎-9', '♣︎-K', '♣︎-10', '♣︎-A', '♦︎-7', '♦︎-8', '♦︎-9', '♦︎-K', '♦︎-10', '♦︎-A', '♦︎-J', '♥-J', '♠︎-J', '♣︎-J', '♦︎-Q', '♥-Q', '♠︎-Q', '♣︎-Q'];

class PlayerCards extends React.Component {
  static propTypes = {
    cards: PropTypes.arrayOf(PropTypes.string),
    gameState: PropTypes.string,
    playCard: PropTypes.func.isRequired,
    cardPlayed: PropTypes.string,
    currentTurnUid: PropTypes.string,
    memberUid: PropTypes.string,
    currentTable: PropTypes.arrayOf(PropTypes.shape()),
    selectedCard: PropTypes.string,
    tableIsInProgress: PropTypes.bool.isRequired
  }

  static defaultProps = {
    cards: [],
    gameState: null,
    cardPlayed: null,
    currentTurnUid: null,
    memberUid: null,
    currentTable: [],
    selectedCard: null
  }

  constructor(props) {
    super(props);
    this.state = {
      cards: [],
    };

    this.myTurnAudio = new Audio(myTurnSound);
  }

  componentDidMount() {
    const {
      cards,
      currentTable,
      memberUid,
      currentTurnUid,
    } = this.props;

    const cardsClone = [...cards];

    cardsClone.sort((a, b) => cardOrder.indexOf(b) - cardOrder.indexOf(a));

    if (currentTurnUid && memberUid
        && currentTurnUid.toString() === memberUid.toString()) {
      if (currentTable && currentTable.length === 0) {
        const mappedCards = cardsClone.map(card => ({ card, allowed: true }));

        this.setState({ cards: mappedCards });
      } else {
        const firstCard = currentTable[0];

        let playerHasCards = [];

        if (firstCard.card && kreisti.indexOf(firstCard.card) !== -1) {
          playerHasCards = cardsClone.filter(value => kreisti.includes(value));
        } else if (firstCard.card && erci.indexOf(firstCard.card) !== -1) {
          playerHasCards = cardsClone.filter(value => erci.includes(value));
        } else if (firstCard.card && piki.indexOf(firstCard.card) !== -1) {
          playerHasCards = cardsClone.filter(value => piki.includes(value));
        } else if (firstCard.card && trumpji.indexOf(firstCard.card) !== -1) {
          playerHasCards = cardsClone.filter(value => trumpji.includes(value));
        }

        const mappedCards = cardsClone.map((card) => {
          if (playerHasCards && playerHasCards.length === 0) {
            return { card, allowed: true };
          }
          if (playerHasCards && playerHasCards.length > 0 && playerHasCards.includes(card)) {
            return { card, allowed: true };
          }
          return { card, allowed: false };
        });

        this.setState({ cards: mappedCards });
      }
    } else {
      const mappedCards = cardsClone.map(card => ({ card, allowed: false }));

      this.setState({ cards: mappedCards });
    }
  }

  shouldComponentUpdate(nextProps, nextState) {
    const {
      cards,
      cardPlayed,
      currentTurnUid,
      currentTable,
      gameState,
      selectedCard,
      tableIsInProgress
    } = nextProps;

    const {
      cards: curCardsProps,
      cardPlayed: curCardPlayed,
      currentTurnUid: curCurrentTurnUid,
      currentTable: curCurrentTable,
      gameState: curGameState,
      selectedCard: curSelectedCard,
      tableIsInProgress: curTableIsInProgress
    } = this.props;

    const { cards: curCards } = this.state;
    const { cards: nextCards } = nextState;

    if (tableIsInProgress !== curTableIsInProgress) {
      return true;
    }

    if (selectedCard !== curSelectedCard) {
      return true;
    }

    if (cards.length !== curCards.length) {
      return true;
    }

    if (gameState !== curGameState) {
      return true;
    }

    if (cardPlayed !== curCardPlayed) {
      return true;
    }

    if (currentTurnUid !== curCurrentTurnUid) {
      return true;
    }

    if (currentTable !== curCurrentTable) {
      return true;
    }

    if (JSON.stringify(curCards) !== JSON.stringify(nextCards)) {
      return true;
    }

    if (JSON.stringify(cards) !== JSON.stringify(curCardsProps)) {
      return true;
    }

    return false;
  }

  componentDidUpdate(prevProps) {
    const {
      cards,
      currentTurnUid,
      memberUid,
      currentTable,
      currentTurn,
      soundOn,
    } = this.props;

    let turnChanged = prevProps.currentTurn !== currentTurn;
    let tableChanged = prevProps.currentTable !== currentTable;

    const cardsClone = [...cards];

    cardsClone.sort((a, b) => cardOrder.indexOf(b) - cardOrder.indexOf(a));

    if (currentTurnUid && memberUid
      && currentTurnUid.toString() === memberUid.toString()) {
      if (soundOn && turnChanged) {
        setTimeout(() => {
          this.myTurnAudio.play();
        }, 350);
      }

      if (currentTable && currentTable.length === 0) {
      //  console.log('map all to allowed 1');
        const mappedCards = cardsClone.map(card => ({ card, allowed: true }));

        this.setState({ cards: mappedCards });
      } else {
        const firstCard = currentTable[0];

        if (firstCard) {
          let playerHasCards = [];

          if (firstCard && firstCard.card) {
            if (kreisti.indexOf(firstCard.card) !== -1) {
              playerHasCards = cardsClone.filter(value => kreisti.includes(value));
            } else if (erci.indexOf(firstCard.card) !== -1) {
              playerHasCards = cardsClone.filter(value => erci.includes(value));
            } else if (piki.indexOf(firstCard.card) !== -1) {
              playerHasCards = cardsClone.filter(value => piki.includes(value));
            } else if (firstCard.card && trumpji.indexOf(firstCard.card) !== -1) {
              playerHasCards = cardsClone.filter(value => trumpji.includes(value));
            }
          }

          const mappedCards = cardsClone.map((card) => {
            if (playerHasCards && playerHasCards.length === 0) {
              return { card, allowed: true };
            }
            if (playerHasCards && playerHasCards.length > 0 && playerHasCards.includes(card)) {
              return { card, allowed: true };
            }
            return { card, allowed: false };
          });

          this.setState({ cards: mappedCards });
        } else {
        //  console.log('map all to allowed 2');
          const mappedCards = cardsClone.map(card => ({ card, allowed: true }));

          this.setState({ cards: mappedCards });
        }
      }
    } else {
      const mappedCards = cardsClone.map(card => ({ card, allowed: false }));

      this.setState({ cards: mappedCards });
    }
  }

  renderCards = (card, index) => {
    const { cards, cardPlayed, gameState, playCard, selectedCard, tableIsInProgress } = this.props;
    let startIndex = 0;
    if (cards.length <= 1) {
      startIndex = 5;
    } else if (cards.length <= 3) {
      startIndex = 4;
    } else if (cards.length <= 5) {
      startIndex = 3;
    } else if (cards.length <= 7) {
      startIndex = 2;
    } else if (cards.length <= 9) {
      startIndex = 1;
    }

    return (
      <div
        key={card.card}
        id={`hand-card-${card.card}`}
        style={gameState && gameState === 'results' ? {'transform': 'none', 'display': 'block'}: {}}
        className={`card card-${card.card} ${selectedCard == card.card ? 'selected': ''} card-${startIndex + index} ${cardPlayed && cardPlayed === card.card ? 'card-played' : ''} ${(card.allowed && gameState && gameState !== 'choose' && !tableIsInProgress) ? 'allowed' : 'blocked'}`}
        onClick={(e) => playCard(e, card)}
      />
    );
  }


  render() {
    const {
      gameState,
    //  playCard,
    //  cardPlayed,
    } = this.props;

    const { cards } = this.state;

    return (
      <div className={`cards cards-${(cards && cards.length % 2 === 0) ? 'even' : 'odd'} ${gameState === 'results' ? 'display-none' : ''}`}>
      {cards && cards.map(this.renderCards)}
      {/*  {cards && cards.map((card, index) => {
          let startIndex = 0;
          if (cards.length <= 2) {
            startIndex = 4;
          } else if (cards.length <= 4) {
            startIndex = 3;
          } else if (cards.length <= 6) {
            startIndex = 2;
          } else if (cards.length <= 8) {
            startIndex = 1;
          }

          return (
            <div
              key={card.card}
              className={`card card-${card.card} card-${startIndex + index} ${cardPlayed && cardPlayed === card.card ? 'card-played' : ''} ${(card.allowed && gameState && gameState !== 'choose') ? 'allowed' : 'blocked'}`}
              onClick={() => playCard(card)}
            />
          );
        })}  */}
      </div>
    );
  }
}

export default PlayerCards;
