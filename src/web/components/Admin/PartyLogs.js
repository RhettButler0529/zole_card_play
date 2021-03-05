import React, { Fragment } from 'react';
import PropTypes from 'prop-types';

/* import {
  Pagination,
  PaginationItem,
  PaginationLink,
} from 'reactstrap'; */

import Pagination from 'reactstrap/lib/Pagination';
import PaginationItem from 'reactstrap/lib/PaginationItem';
import PaginationLink from 'reactstrap/lib/PaginationLink';

import { withRouter } from 'react-router-dom';

class PartyLogs extends React.Component {
  static propTypes = {
    member: PropTypes.shape({
      email: PropTypes.string,
    }),
    roomData: PropTypes.shape({}),
    roomId: PropTypes.string,
    history: PropTypes.shape({
      push: PropTypes.func.isRequired,
    }).isRequired,
  }

  static defaultProps = {
    member: {},
    roomData: {},
    roomId: '',
  }

  constructor(props) {
    super(props);
    this.state = {
      currentPage: 0,
      pageSize: 50,
    };

    this.handleClick = this.handleClick.bind(this);
  }

  handleClick(e, index) {
    e.preventDefault();

    this.setState({
      currentPage: index,
    });
  }

  table() {
    const {
      roomData,
      roomId,
    } = this.props;
    const {
      currentPage,
      pageSize,
    } = this.state;

    const pagesCount = Math.ceil(Object.keys(roomData).length / pageSize);
    if (roomData && roomId && roomData[roomId]) {
      const data = roomData[roomId];
      return (
        <Fragment>
          {data && Object.keys(data)
            .slice(
              currentPage * pageSize,
              (currentPage + 1) * pageSize,
            )
            .map((key, index) => (
              <Fragment key={key}>
                <tr key={key} className={`allUsers-table-row ${index % 2 === 0 ? ('odd') : ('even')}`}>
                  <td className="allUsers-table-col">
                    {key}
                  </td>
                  <td className="allUsers-table-col">
                    {data[key].type}
                  </td>
                  <td className="allUsers-table-col">
                    {data[key].message}
                  </td>
                  <td className="allUsers-table-col">
                    {data[key].time}
                  </td>
                  <td className="allUsers-table-col">
                    {data[key].data && Object.keys(data[key].data)
                      .map((key2) => {
                        if (key2 === 'playerCards' && data[key].data[key2]) {
                          const players = data[key].data[key2];
                          return (
                            <div>
                              <div>
                                Player cards:
                              </div>
                              {Object.keys(players).map(key3 => (
                                <div>
                                  {` ${key3}: ${players[key3]},`}
                                </div>
                              ))}
                            </div>
                          );
                        } if (key2 === 'currentTable') {
                          return (
                            <div>
                            Current Table -
                              {data[key].data[key2].map(card => (
                                ` ${card.player} : ${card.card},`
                              ))}
                            </div>
                          );
                        } if (key2 === 'points') {
                          const points = data[key].data[key2];
                          return (
                            <div>
                            Points -
                              {Object.keys(points).map(pointsKey => (
                                ` ${pointsKey} : ${points[pointsKey]},`
                              ))}
                            </div>
                          );
                        } if (key2 === 'gameResult') {
                          const gameResult = data[key].data[key2];
                          return (
                            <div>
                            Game result -
                              {Object.keys(gameResult).map((resultsKey) => {
                                if (resultsKey === 'largePlayer') {
                                  return (
                                    <div>
                                      {` ${resultsKey} : ${gameResult[resultsKey].name}, ${gameResult[resultsKey].uid}`}
                                    </div>
                                  );
                                }
                                return (
                                  <div>
                                    {` ${resultsKey} : ${gameResult[resultsKey]}`}
                                  </div>
                                );
                              })}
                            </div>
                          );
                        }
                        return (
                          <div>
                            {`${[key2]}: ${data[key].data[key2]}`}
                          </div>
                        );
                      })}
                  </td>
                </tr>
              </Fragment>
            ))}
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
      <Fragment>
        <div style={{ marginTop: 100 }}>
          <h2>
          Logs
          </h2>
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
                  Ziņa
                </th>
                <th>
                  Laiks
                </th>
                <th>
                  Dati
                </th>
              </tr>
            </thead>
            <tbody>
              {this.table()}
            </tbody>
          </table>
        </div>
      </Fragment>
    );
  }
}

export default withRouter(PartyLogs);
