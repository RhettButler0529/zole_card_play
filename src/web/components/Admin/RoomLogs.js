import React, { Fragment } from 'react';
import PropTypes from 'prop-types';

import Moment from 'react-moment';

/* import {
  Collapse,
  Row,
  Col,
  Pagination,
  PaginationItem,
  PaginationLink,
} from 'reactstrap'; */

import Row from 'reactstrap/lib/Row';
import Col from 'reactstrap/lib/Col';
import Collapse from 'reactstrap/lib/Collapse';
import Pagination from 'reactstrap/lib/Pagination';
import PaginationItem from 'reactstrap/lib/PaginationItem';
import PaginationLink from 'reactstrap/lib/PaginationLink';

import { withRouter } from 'react-router-dom';

class RoomLogs extends React.Component {
  static propTypes = {
    member: PropTypes.shape({
      email: PropTypes.string,
    }),
    roomData: PropTypes.shape({}),
    roomId: PropTypes.string,
    history: PropTypes.shape({
      push: PropTypes.func.isRequired,
    }).isRequired,
    roomParams: PropTypes.shape({}),
  }

  static defaultProps = {
    member: {},
    roomData: {},
    roomId: '',
    roomParams: {},
  }

  constructor(props) {
    super(props);
    this.state = {
      currentPage: 0,
      pageSize: 50,
      collapse: false,
    };

    this.toggle = this.toggle.bind(this);
    this.openCollapse = this.openCollapse.bind(this);
    this.handleClick = this.handleClick.bind(this);
  }

  handleClick(e, index) {
    e.preventDefault();

    this.setState({
      currentPage: index,
    });
  }

  toggle() {
    this.setState(state => ({ collapse: !state.collapse }));
  }

  openCollapse(key) {
    const { collapse } = this.state;
    if (collapse === key) {
      this.setState({ collapse: '' });
    } else {
      this.setState({ collapse: key });
    }
  }

  table() {
    const {
      roomData,
      roomId,
    //  roomParams,
    } = this.props;
    const {
      currentPage,
      pageSize,
      collapse,
    } = this.state;

    if (roomData && roomId && roomData[roomId]) {
      const pagesCount = Math.ceil(Object.keys(roomData[roomId]).length / pageSize);
      const data = roomData[roomId];
      return (
        <Fragment>
          {data && Object.keys(data)
            .slice(
              currentPage * pageSize,
              (currentPage + 1) * pageSize,
            )
            .map((key, index) => {
              const party = data[key];
              if (!party) {
                return null;
              }
              const { gameResult } = party;
              return (
                <Fragment key={key}>
                  <tr onClick={() => this.openCollapse(key)} key={key} className={`allUsers-table-row ${index % 2 === 0 ? ('odd') : ('even')}`}>
                    <td className="allUsers-table-col">
                      {key}
                    </td>
                    <td className="allUsers-table-col">
                      {gameResult && gameResult.type}
                    </td>
                    <td className="allUsers-table-col">
                      {gameResult && gameResult.largePlayer}
                    </td>
                    <td className="allUsers-table-col">
                      {gameResult && gameResult.largePoints}
                    </td>
                    <td className="allUsers-table-col">
                      {gameResult && gameResult.largeTricks}
                    </td>
                    <td className="allUsers-table-col">
                      {gameResult && gameResult.winner}
                    </td>
                    <td className="allUsers-table-col">
                      {gameResult && gameResult.scoreType}
                    </td>
                  </tr>
                  {collapse === key && (
                    <tr style={{ borderTop: '2px solid gray' }}>
                      <td colSpan="7">
                        <Collapse isOpen={collapse === key}>
                          <Row>
                            {Object.keys(party)
                              .map((partyKey) => {
                                const action = party[partyKey];
                                if (partyKey === 'gameResult') {
                                  return null;
                                }

                                if (action.type === 'updatePoints') {
                                  return (
                                    <Fragment>
                                      <Col sm="2" style={{ borderBottom: '1px solid gray' }}>
                                        <b>
                                          Points updated
                                        </b>
                                      </Col>
                                      <Col sm="3" style={{ borderBottom: '1px solid gray' }}>
                                        <Moment format="DD-MM-YYYY, HH:mm:ss SS" locale="lv">
                                          {action.time}
                                        </Moment>
                                      </Col>
                                      <Col sm="7" style={{ borderBottom: '1px solid gray' }}>
                                        <div>
                                          {`Player ${action.data.playerName}, uid: ${action.data.playerUid}`}
                                        </div>
                                        <div>
                                          {`Old bilance: ${action.data.oldBal}, New bilance: ${action.data.newBal}`}
                                        </div>
                                        <div>
                                          {`Old points: ${action.data.oldPnts}, New points: ${action.data.newPnts}`}
                                        </div>
                                      </Col>
                                    </Fragment>
                                  );
                                }

                                if (action.type === 'cardPlayed') {
                                  return (
                                    <Fragment>
                                      <Col sm="2" style={{ borderBottom: '1px solid gray' }}>
                                        <b>
                                          Card played
                                        </b>
                                      </Col>
                                      <Col sm="3" style={{ borderBottom: '1px solid gray' }}>
                                        <Moment format="DD-MM-YYYY, HH:mm:ss SS" locale="lv">
                                          {action.time}
                                        </Moment>
                                      </Col>
                                      <Col sm="7" style={{ borderBottom: '1px solid gray' }}>
                                        <div>
                                          {`${action.data.player} played card ${action.data.playedCard}`}
                                        </div>
                                      </Col>
                                    </Fragment>
                                  );
                                }

                                if (action.type === 'determineStrongest') {
                                  return (
                                    <Fragment>
                                      <Col sm="2" style={{ borderBottom: '1px solid gray' }}>
                                        <b>
                                          Determine strongest card
                                        </b>
                                      </Col>
                                      <Col sm="3" style={{ borderBottom: '1px solid gray' }}>
                                        <Moment format="DD-MM-YYYY, HH:mm:ss SS" locale="lv">
                                          {action.time}
                                        </Moment>
                                      </Col>
                                      <Col sm="7" style={{ borderBottom: '1px solid gray' }}>
                                        <div>
                                          {`Strongest card is ${action.data.card} played by ${action.data.winPlayer}. ${action.data.tablePoints ? (`Take ${action.data.tablePoints} points`) : ('')} `}
                                        </div>
                                      </Col>
                                    </Fragment>
                                  );
                                }

                                if (action.type === 'selectType') {
                                  return (
                                    <Fragment>
                                      <Col sm="2" style={{ borderBottom: '1px solid gray' }}>
                                        <b>
                                          Select game type
                                        </b>
                                      </Col>
                                      <Col sm="3" style={{ borderBottom: '1px solid gray' }}>
                                        <Moment format="DD-MM-YYYY, HH:mm:ss SS" locale="lv">
                                          {action.time}
                                        </Moment>
                                      </Col>
                                      <Col sm="7" style={{ borderBottom: '1px solid gray' }}>
                                        <div>
                                          {`Player ${action.data.player} selected ${action.data.type}`}
                                          {action.data.type === 'garam' && action.data.action === 'next' && (' ')}
                                          {action.data.type === 'garam' && action.data.action === 'galdins' && (', and galdins will be played')}
                                          {action.data.type === 'garam' && action.data.action === 'nextRound' && (', and next round will be dealt')}
                                        </div>
                                      </Col>
                                    </Fragment>
                                  );
                                }

                                if (action.type === 'burriedCard') {
                                  return (
                                    <Fragment>
                                      <Col sm="2" style={{ borderBottom: '1px solid gray' }}>
                                        <b>
                                          Buried card
                                        </b>
                                      </Col>
                                      <Col sm="3" style={{ borderBottom: '1px solid gray' }}>
                                        <Moment format="DD-MM-YYYY, HH:mm:ss SS" locale="lv">
                                          {action.time}
                                        </Moment>
                                      </Col>
                                      <Col sm="7" style={{ borderBottom: '1px solid gray' }}>
                                        <div>
                                          {`Player burried card - ${action.data.burriedCard} Player burried ${action.data.newPnts} points`}
                                          {/*  {!!action.data.newPnts && (`Player burried ${action.data.newPnts} points`)}  */}
                                        </div>
                                      </Col>
                                    </Fragment>
                                  );
                                }

                                if (action.type === 'roundResult') {
                                  return (
                                    <Fragment>
                                      <Col sm="2" style={{ borderBottom: '1px solid gray' }}>
                                        <b>
                                          Round result
                                        </b>
                                      </Col>
                                      <Col sm="3" style={{ borderBottom: '1px solid gray' }}>
                                        <Moment format="DD-MM-YYYY, HH:mm:ss SS" locale="lv">
                                          {action.time}
                                        </Moment>
                                      </Col>
                                      <Col sm="7" style={{ borderBottom: '1px solid gray' }}>
                                        <div>
                                          {`Large player(${action.data.largePlayer}) ${action.data.winner === 'large' ? ('wins') : ('loses')} ${action.data.type}`}
                                          {action.data.scoreType === 'jani' && (' with jani')}
                                          {action.data.scoreType === 'bezstikis' && (' with bezstikis')}
                                        </div>
                                      </Col>
                                    </Fragment>
                                  );
                                }

                                if (action.type === 'playerQuit') {
                                  return (
                                    <Fragment>
                                      <Col sm="2" style={{ borderBottom: '1px solid gray' }}>
                                        <b>
                                          Player quit
                                        </b>
                                      </Col>
                                      <Col sm="3" style={{ borderBottom: '1px solid gray' }}>
                                        <Moment format="DD-MM-YYYY, HH:mm:ss SS" locale="lv">
                                          {action.time}
                                        </Moment>
                                      </Col>
                                      <Col sm="7" style={{ borderBottom: '1px solid gray' }}>
                                        <div>
                                          {`${action.data.player} quit round with type ${action.data.roundType}`}
                                        </div>
                                      </Col>
                                    </Fragment>
                                  );
                                }

                                if (action.type === 'roundOver') {
                                  return (
                                    <Fragment>
                                      <Col sm="2" style={{ borderBottom: '1px solid gray' }}>
                                        <b>
                                          Round over
                                        </b>
                                      </Col>
                                      <Col sm="3" style={{ borderBottom: '1px solid gray' }}>
                                        <Moment format="DD-MM-YYYY, HH:mm:ss SS" locale="lv">
                                          {action.time}
                                        </Moment>
                                      </Col>
                                      <Col sm="7" style={{ borderBottom: '1px solid gray' }}>
                                        <div />
                                      </Col>
                                    </Fragment>
                                  );
                                }

                                if (action.type === 'roomClosed') {
                                  return (
                                    <Fragment>
                                      <Col sm="2" style={{ borderBottom: '1px solid gray' }}>
                                        <b>
                                          Room closed
                                        </b>
                                      </Col>
                                      <Col sm="3" style={{ borderBottom: '1px solid gray' }}>
                                        <Moment format="DD-MM-YYYY, HH:mm:ss SS" locale="lv">
                                          {action.time}
                                        </Moment>
                                      </Col>
                                      <Col sm="7" style={{ borderBottom: '1px solid gray' }}>
                                        {action.data.type === 'tournamentEnd' && (
                                          <div>
                                            Room was closed, because tournament ended
                                          </div>
                                        )}
                                        {action.data.type === 'lastRound' && (
                                          <div>
                                            {`Room was closed, because ${action.data.player} played last round`}
                                          </div>
                                        )}
                                        {action.data.type === 'missedTurn' && (
                                          <div>
                                            {`Room was closed, because ${action.data.player} missed turn`}
                                          </div>
                                        )}
                                        {action.data.type === 'leftRoom' && (
                                          <div>
                                            {`Room was closed, because ${action.data.player} left room`}
                                          </div>
                                        )}
                                        {action.data.type === 'lastPlayerLeftRoom' && (
                                          <div>
                                            Room was closed, because last player left room before it started
                                          </div>
                                        )}

                                      </Col>
                                    </Fragment>
                                  );
                                }

                                if (action.type === 'cardsDealt') {
                                  return (
                                    <Fragment>
                                      <Col sm="2" style={{ borderBottom: '1px solid gray' }}>
                                        <b>
                                          Dealt cards
                                        </b>
                                      </Col>
                                      <Col sm="3" style={{ borderBottom: '1px solid gray' }}>
                                        <Moment format="DD-MM-YYYY, HH:mm:ss SS" locale="lv">
                                          {action.time}
                                        </Moment>
                                      </Col>
                                      <Col sm="7" style={{ borderBottom: '1px solid gray' }}>
                                        <div>
                                          {`${action.data.player1 && action.data.player1.player}: ${action.data.player1 && action.data.player1.cards}`}
                                        </div>
                                        <div>
                                          {`${action.data.player2 && action.data.player2.player}: ${action.data.player1 && action.data.player2.cards}`}
                                        </div>
                                        <div>
                                          {`${action.data.player3 && action.data.player3.player}: ${action.data.player1 && action.data.player3.cards}`}
                                        </div>
                                        <div>
                                          {`${action.data.cardsOnTable && action.data.cardsOnTable}`}
                                        </div>
                                      </Col>
                                    </Fragment>
                                  );
                                }

                                if (action.type === 'endRoomPules') {
                                  return (
                                    <Fragment>
                                      <Col sm="2" style={{ borderBottom: '1px solid gray' }}>
                                        <b>
                                          Pules spēles beigās
                                        </b>
                                      </Col>
                                      <Col sm="3" style={{ borderBottom: '1px solid gray' }}>
                                        <Moment format="DD-MM-YYYY, HH:mm:ss SS" locale="lv">
                                          {action.time}
                                        </Moment>
                                      </Col>
                                      <Col sm="7" style={{ borderBottom: '1px solid gray' }}>
                                        <div>
                                          {`${action.data.player1 && action.data.player1.uid}: ${action.data.player1 && action.data.player1.points}`}
                                          {`${action.data.player2 && action.data.player2.uid}: ${action.data.player2 && action.data.player2.points}`}
                                          {`${action.data.player3 && action.data.player3.uid}: ${action.data.player3 && action.data.player3.points}`}
                                        </div>
                                      </Col>
                                    </Fragment>
                                  );
                                }

                                if (action.type === 'setLast') {
                                  return (
                                    <Fragment>
                                      <Col sm="2" style={{ borderBottom: '1px solid gray' }}>
                                        <b>
                                          Izvēlas pēdējo partiju
                                        </b>
                                      </Col>
                                      <Col sm="3" style={{ borderBottom: '1px solid gray' }}>
                                        <Moment format="DD-MM-YYYY, HH:mm:ss SS" locale="lv">
                                          {action.time}
                                        </Moment>
                                      </Col>
                                      <Col sm="7" style={{ borderBottom: '1px solid gray' }}>
                                        <div>
                                          {`Spēlētājs ${action.data.playerUid} izvelējās pēdējo partiju`}
                                        </div>
                                      </Col>
                                    </Fragment>
                                  );
                                }

                                return (
                                  <Fragment key={partyKey}>
                                    <Col sm="2" style={{ borderBottom: '1px solid gray' }}>
                                      <b>
                                        {action.message}
                                      </b>
                                    </Col>
                                    <Col sm="3" style={{ borderBottom: '1px solid gray' }}>
                                      <Moment format="DD-MM-YYYY, HH:mm:ss SS" locale="lv">
                                        {action.time}
                                      </Moment>
                                    </Col>
                                    <Col sm="7" style={{ borderBottom: '1px solid gray' }}>
                                      {action.data && Object.keys(action.data)
                                        .map((actionKey) => {
                                          const actionData = action.data[actionKey];
                                          return (
                                            <div>
                                              <b style={{ display: 'inline-block' }}>
                                                {[actionKey]}
                                              </b>
                                              {`: ${actionData} `}
                                            </div>
                                          );
                                        })}
                                    </Col>
                                  </Fragment>
                                );
                              })}
                          </Row>
                        </Collapse>
                      </td>
                    </tr>
                  )}
                </Fragment>
              );
            })}
          {console.log(Object.keys(data).length)}
          {console.log(pageSize)}
          {console.log(currentPage)}
          {console.log(pagesCount)}
          {Object.keys(data).length > pageSize && (
          <div className="pagination-wrapper">
            <Pagination aria-label="Page navigation example">
              <PaginationItem disabled={currentPage <= 0}>
                <PaginationLink
                  onClick={e => this.handleClick(e, currentPage - 1)}
                  previous
                  href="#"
                />
              </PaginationItem>

              <PaginationItem disabled={currentPage < 6}>
                <PaginationLink onClick={e => this.handleClick(e, 0)} href="#">
                  1
                </PaginationLink>
              </PaginationItem>

              {[...Array(pagesCount)].map((page, i) => {
                if (i > currentPage - 3 && i < currentPage + 3) {
                  return (
                    <PaginationItem active={i === currentPage} key={page}>
                      <PaginationLink onClick={e => this.handleClick(e, i)} href="#">
                        {i + 1}
                      </PaginationLink>
                    </PaginationItem>
                  );
                }

                return null;
              })}

              {currentPage < (pagesCount - 3) && (
                <PaginationItem disabled={currentPage >= pagesCount - 1}>
                  <PaginationLink onClick={e => this.handleClick(e, pagesCount - 1)} href="#">
                    {pagesCount}
                  </PaginationLink>
                </PaginationItem>
              )}

              <PaginationItem disabled={currentPage >= pagesCount - 1}>
                <PaginationLink
                  onClick={e => this.handleClick(e, currentPage + 1)}
                  next
                  href="#"
                />
              </PaginationItem>
            </Pagination>
          </div>
          )}
        </Fragment>
      );
    } return null;
  }

  render() {
    return (
      <table style={{ width: '100%', fontSize: 12 }}>
        <colgroup>
          <col span="1" className="" />
        </colgroup>
        <thead>
          <tr>
            <th>
              Id
            </th>
            <th>
              Tips
            </th>
            <th>
              Lielais spēlētājs
            </th>
            <th>
              Lielā punkti
            </th>
            <th>
              Lielā stiķi
            </th>
            <th>
              Uzvar
            </th>
            <th>
              Uzvaras tips
            </th>
          </tr>
        </thead>
        <tbody>
          {this.table()}
        </tbody>
      </table>
    );
  }
}

export default withRouter(RoomLogs);
