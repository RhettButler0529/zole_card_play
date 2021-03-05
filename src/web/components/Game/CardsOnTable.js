import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { gsap } from 'gsap';

import playCardSound from '../../../sounds/card_played.wav';

class CardsOnTable extends Component {
  static propTypes = {
    currentTable: PropTypes.arrayOf(PropTypes.shape()),
    myPos: PropTypes.string,
    removeSelectedCard: PropTypes.func.isRequired,
    tableInProgress: PropTypes.func.isRequired,
    userSettings: PropTypes.shape().isRequired,
    globalParams: PropTypes.shape().isRequired
  }

  static defaultProps = {
    currentTable: [],
    myPos: null,
  };

  constructor(props) {
    super(props);



    this.state = {
      cardsAdded: {},
      remSelectedCard: false,
      animSpeed: 0.35,
      animSpeedSet: false,
      showCardsTimeout: 1.0,
      cardsRemAnimInProgress: false
    };

    this.playCardAudio = new Audio(playCardSound);
  }

  componentDidMount() {
    const { currentTable, globalParams } = this.props;

    if (currentTable) {
      this.setState({ currentTable });
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.globalParams && nextProps.globalParams.fastGame && !this.state.animSpeedSet) {
      this.setState({ animSpeed: this.state.animSpeed / 1.65, animSpeedSet: true });
    }
  }

  shouldComponentUpdate(nextProps, nextState) {
    const {
      myPos,
      currentTable,
    } = nextProps;
    const {
      myPos: curMyPos,
      currentTable: curCurrentTable
    } = this.props;

    const { currentTable: nextStateTable, cardsAdded: nextStateCardsAdded } = nextState;
    const { currentTable: stateTable, cardsAdded: stateCardsAdded } = this.state;

    if (JSON.stringify(nextStateCardsAdded) !== JSON.stringify(stateCardsAdded)) {
      return true;
    }

    if (JSON.stringify(currentTable) !== JSON.stringify(curCurrentTable)) {
      return true;
    }

    if (JSON.stringify(nextStateTable) !== JSON.stringify(stateTable)) {
      return true;
    }

    if (JSON.stringify(nextStateTable) !== JSON.stringify(stateTable)) {
      return true;
    }

    if (myPos !== curMyPos) {
      return true;
    }

    return false;
  }

  componentDidUpdate() {
    const { currentTable: newTable, removeSelectedCard, tableInProgress, userSettings, globalParams } = this.props;
    const { currentTable, cardsAdded, remSelectedCard, cardsRemAnimInProgress } = this.state;

  //  console.log(this.props);

    if(remSelectedCard){
      setTimeout(() => { removeSelectedCard(); }, 0); // To avoid blinking
      this.setState({remSelectedCard: false});
    }

    if (currentTable.length > 2 && Object.keys(cardsAdded).length === 0) {

      if(cardsRemAnimInProgress){
        return;
      }

      var playerTurnElColl = document.getElementsByClassName("is-player-turn");
      var tableCardElColl = document.getElementsByClassName("table-card");

      tableInProgress(true);

      if(playerTurnElColl && playerTurnElColl.length > 0 && tableCardElColl && tableCardElColl.length > 0){
        var playerTurnEl = playerTurnElColl[0];
        var tableCardEl = tableCardElColl[0];

        const playerTurnElRect = playerTurnEl.getBoundingClientRect();
        const tableCardElRect = tableCardEl.getBoundingClientRect();

        const targetX = playerTurnElRect.left - tableCardElRect.left;
        const targetY = playerTurnElRect.top - tableCardElRect.top;

        gsap.to(".table-card", {x:targetX, y:targetY, delay: this.state.showCardsTimeout, duration: this.state.animSpeed, scale: 0.7, opacity: 0.0, ease: "none"});
      }else{
        gsap.to(".table-card", {y:-270, delay: this.state.showCardsTimeout, duration: 1, ease: "none"});
      }

      this.setState({cardsRemAnimInProgress: true});

      this.timeoutID = setTimeout(() => {
        tableInProgress(false);
        this.setState({ currentTable: [], cardsRemAnimInProgress: false });
      }, (this.state.animSpeed * 1000) + (this.state.showCardsTimeout * 1000) + 100);

      return;

    } else {

      if(Object.keys(cardsAdded).length > 0){
        for(const cardAddedKey in cardsAdded){

          if(cardsAdded[cardAddedKey]['animating']){
            continue;
          }

          const playeCardsEl = document.getElementById(`hand-card-${cardAddedKey}`);
          const tagetTableCardEl = document.getElementById(`table-card-${cardAddedKey}`);

          if(playeCardsEl && tagetTableCardEl){ // First person
            tableInProgress(true);

            const playeCardsElRot = gsap.getProperty(playeCardsEl, "rotate");

            gsap.set(playeCardsEl, {rotate: 0});
            gsap.set(tagetTableCardEl, {x: 0, y: 0});

            const tagetTableCardRect = tagetTableCardEl.getBoundingClientRect();
            const animCardRect = playeCardsEl.getBoundingClientRect();

            const scaleX = tagetTableCardRect.width / animCardRect.width;
            const scaleY = tagetTableCardRect.height / animCardRect.height;

            gsap.set(playeCardsEl, {rotate: playeCardsElRot});

            const targetX = tagetTableCardRect.left - animCardRect.left;
            const targetY = tagetTableCardRect.top - animCardRect.top;

            if(userSettings && userSettings.soundOn) this.playCardAudio.play();

            cardsAdded[cardAddedKey]['animating'] = true;
            gsap.to(playeCardsEl, {x: targetX, y:targetY, rotate: 0, duration: this.state.animSpeed, scaleX: scaleX, scaleY: scaleY, ease: "sine.out", onComplete: ()=> {
              gsap.set(playeCardsEl, {display: 'none'});
              const { currentTable, cardsAdded } = this.state;
              let uppdCardsAdded = {...cardsAdded};
              delete uppdCardsAdded[cardAddedKey];
              this.setState({ cardsAdded:uppdCardsAdded, remSelectedCard: true });
              if(currentTable && currentTable.length < 3) tableInProgress(false);
            }});
          }else if(tagetTableCardEl){ // From player on sides
            const playerAvatarEl = document.getElementById(`player-${cardsAdded[cardAddedKey].player}`);

            if(playerAvatarEl){
              tableInProgress(true);
              const tagetTableCardRect = tagetTableCardEl.getBoundingClientRect();
              const playerAvatarRect = playerAvatarEl.getBoundingClientRect();

              const targetX = playerAvatarRect.left - tagetTableCardRect.left;
              const targetY = playerAvatarRect.top - tagetTableCardRect.top;

              gsap.set(tagetTableCardEl, {x: targetX, y: targetY, visibility: 'visible', scale: 0.2});

              if(userSettings && userSettings.soundOn) this.playCardAudio.play();

              cardsAdded[cardAddedKey]['animating'] = true;
              gsap.to(tagetTableCardEl, {x: 0, y:0, duration: this.state.animSpeed, delay:0.1, scale: 1, ease: "sine.out", onComplete: ()=> {
                const { currentTable, cardsAdded } = this.state;
                let uppdCardsAdded = {...cardsAdded};
                delete uppdCardsAdded[cardAddedKey];
                this.setState({ cardsAdded:uppdCardsAdded });
                if(currentTable && currentTable.length < 3) tableInProgress(false);
              }});

            }else{
              let uppdCardsAdded = {...this.state.cardsAdded};
              delete uppdCardsAdded[cardAddedKey];
              this.setState({ cardsAdded:uppdCardsAdded });
            }
          }
        }
      }

      if(cardsRemAnimInProgress || (currentTable && currentTable.length > 2)){
        return;
      }

      var _cardsAdded = cardsAdded;

      if(newTable && newTable.length) {

        for(const maybeNewCard of newTable){
          var cardPresent = false;

          for(const currentCard of currentTable){
            if(maybeNewCard && currentCard && maybeNewCard.card == currentCard.card) {
              cardPresent = true;
              break;
            }
          }

          if(!cardPresent && maybeNewCard) {
            _cardsAdded[maybeNewCard.card] = {...maybeNewCard};
          }
        }
      }

      this.setState({ currentTable: newTable, cardsAdded: _cardsAdded });
    }
  }

  componentWillUnmount() {
    clearTimeout(this.timeoutID);
  }

  render() {
    const {
      myPos
    } = this.props;

    const { currentTable, cardsAdded, animSpeed } = this.state;

    return (
      <div className="played-cards">
        {myPos === 'player1' && (
        <Fragment>
          {currentTable && Object.keys(currentTable).map((key, index) => (
            <Fragment key={currentTable[key].card}>
              {currentTable[key].player === 'player1' && (
              <div style={{visibility: cardsAdded[currentTable[key].card] ? 'hidden':'visible'}} key={currentTable[key].card} id={`table-card-${currentTable[key].card}`} className={`table-card card card-1 card-order-${index} card-${currentTable[key].card}`} />
              )}
              {currentTable[key].player === 'player2' && (
              <div style={{visibility: cardsAdded[currentTable[key].card] ? 'hidden':'visible'}} key={currentTable[key].card} id={`table-card-${currentTable[key].card}`} className={`table-card card card-0 card-order-${index} card-${currentTable[key].card}`} />
              )}
              {currentTable[key].player === 'player3' && (
              <div style={{visibility: cardsAdded[currentTable[key].card] ? 'hidden':'visible'}} key={currentTable[key].card} id={`table-card-${currentTable[key].card}`} className={`table-card card card-2 card-order-${index} card-${currentTable[key].card}`} />
              )}
            </Fragment>
          ))}
        </Fragment>
        )}
        {myPos === 'player2' && (
        <Fragment>
          {currentTable && Object.keys(currentTable).map((key, index) => (
            <Fragment key={currentTable[key].card}>
              {currentTable[key].player === 'player1' && (
              <div style={{visibility: cardsAdded[currentTable[key].card] ? 'hidden':'visible'}} key={currentTable[key].card} id={`table-card-${currentTable[key].card}`} className={`table-card card card-2 card-order-${index} card-${currentTable[key].card}`} />
              )}
              {currentTable[key].player === 'player2' && (
              <div style={{visibility: cardsAdded[currentTable[key].card] ? 'hidden':'visible'}} key={currentTable[key].card} id={`table-card-${currentTable[key].card}`} className={`table-card card card-1 card-order-${index} card-${currentTable[key].card}`} />
              )}
              {currentTable[key].player === 'player3' && (
              <div style={{visibility: cardsAdded[currentTable[key].card] ? 'hidden':'visible'}} key={currentTable[key].card} id={`table-card-${currentTable[key].card}`} className={`table-card card card-0 card-order-${index} card-${currentTable[key].card}`} />
              )}
            </Fragment>
          ))}
        </Fragment>
        )}
        {myPos === 'player3' && (
        <Fragment>
          {currentTable && Object.keys(currentTable).map((key, index) => (
            <Fragment key={currentTable[key].card}>
              {currentTable[key].player === 'player1' && (
              <div style={{visibility: cardsAdded[currentTable[key].card] ? 'hidden':'visible'}} key={currentTable[key].card} id={`table-card-${currentTable[key].card}`} className={`table-card card card-0 card-order-${index} card-${currentTable[key].card}`} />
              )}
              {currentTable[key].player === 'player2' && (
              <div style={{visibility: cardsAdded[currentTable[key].card] ? 'hidden':'visible'}} key={currentTable[key].card} id={`table-card-${currentTable[key].card}`} className={`table-card card card-2 card-order-${index} card-${currentTable[key].card}`} />
              )}
              {currentTable[key].player === 'player3' && (
              <div style={{visibility: cardsAdded[currentTable[key].card] ? 'hidden':'visible'}} key={currentTable[key].card} id={`table-card-${currentTable[key].card}`} className={`table-card card card-1 card-order-${index} card-${currentTable[key].card}`} />
              )}
            </Fragment>
          ))}
        </Fragment>
        )}
      </div>
    );
  }
}

export default CardsOnTable;
