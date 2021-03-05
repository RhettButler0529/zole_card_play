import React, { Fragment } from 'react';
import PropTypes from 'prop-types';

import { withTranslation } from 'react-i18next';

/* import {
  Media,
  Pagination,
  PaginationItem,
  PaginationLink,
} from 'reactstrap'; */

import Media from 'reactstrap/lib/Media';
import Pagination from 'reactstrap/lib/Pagination';
import PaginationItem from 'reactstrap/lib/PaginationItem';
import PaginationLink from 'reactstrap/lib/PaginationLink';

class TournamentLeaderboard extends React.Component {
  static propTypes = {
    leaderboard: PropTypes.shape().isRequired,
    t: PropTypes.func.isRequired,
  }

  constructor(props) {
    super(props);
    this.state = {
      currentPage: 0,
      pageSize: 20,
      leaderboard: [],
    };
  }

  componentWillMount() {
    const { leaderboard } = this.props;

    if (leaderboard) {
      const leaderboardArr = Object.keys(leaderboard).map(key => ({
        uid: key,
        name: leaderboard[key].name,
        photo: leaderboard[key].photo,
        bal: leaderboard[key].bal,
        totalPnts: leaderboard[key].totalPnts,
        lvl: leaderboard[key].lvl,
      }));

      leaderboardArr.sort((a, b) => b.totalPnts - a.totalPnts);

      this.setState({ leaderboard: leaderboardArr });
    }
  }

  componentWillReceiveProps(nextProps) {
    const { leaderboard } = nextProps;

    if (leaderboard) {
      const leaderboardArr = Object.keys(leaderboard).map(key => ({
        uid: key,
        name: leaderboard[key].name,
        photo: leaderboard[key].photo,
        bal: leaderboard[key].bal,
        totalPnts: leaderboard[key].totalPnts,
        lvl: leaderboard[key].lvl,
      }));

      leaderboardArr.sort((a, b) => b.totalPnts - a.totalPnts);

      this.setState({ leaderboard: leaderboardArr });
    }
  }

  handleClick(e, index) {
    e.preventDefault();
    this.setState({
      currentPage: index,
    });
  }

  render() {
    const {
      t,
    } = this.props;

    const {
      currentPage,
      pageSize,
      leaderboard,
    } = this.state;

    const pagesCount = Math.ceil(leaderboard.length / pageSize);

    return (
      <Fragment>
        <table style={{ width: '100%' }}>
          <thead>
            <tr>
              {/*  <th>
                {t('tournaments.photo')}
              </th> */}
              <th>
                {t('tournaments.name')}
              </th>
              <th>
                {t('tournaments.bal')}
              </th>
              <th>
                {t('tournaments.points')}
              </th>
              <th>
                {t('tournaments.position')}
              </th>
            </tr>
          </thead>
          <tbody>
            {leaderboard && leaderboard.slice(
              currentPage * pageSize,
              (currentPage + 1) * pageSize,
            )
              .map((leaderboardPlayer, index) => (
                <tr key={leaderboardPlayer.uid} className="leaderboard-table-row">
                  <td className="leaderboard-table-col">
                    <div style={{ display: 'inline-block' }}>
                      <Media
                        className="user-image"
                        src={leaderboardPlayer.photo}
                        alt={leaderboardPlayer.name}
                      />
                    </div>
                    {/*  </td>
                    <td className="leaderboard-table-col"> */}
                    <div style={{ display: 'inline-block' }}>
                      {leaderboardPlayer.name}
                    </div>
                  </td>
                  <td className="leaderboard-table-col">
                    {leaderboardPlayer.bal}
                  </td>
                  <td className="leaderboard-table-col">
                    {leaderboardPlayer.totalPnts}
                  </td>
                  <td>
                    {index + 1}
                  </td>
                </tr>
              ))}
            {Object.keys(leaderboard).length > pageSize && (
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
          </tbody>
        </table>
      </Fragment>
    );
  }
}

export default withTranslation('common')(TournamentLeaderboard);
