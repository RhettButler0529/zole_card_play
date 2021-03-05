import React, { Fragment } from 'react';
import PropTypes from 'prop-types';

// import Moment from 'react-moment';

import { withTranslation } from 'react-i18next';
import isEqual from "react-fast-compare";

/* import {
  Pagination,
  PaginationItem,
  PaginationLink,
} from 'reactstrap'; */

import Pagination from 'reactstrap/lib/Pagination';
import PaginationItem from 'reactstrap/lib/PaginationItem';
import PaginationLink from 'reactstrap/lib/PaginationLink';

import CustomDate from '../UI/CustomDate';

class BannedUsers extends React.Component {
  static propTypes = {
  //  t: PropTypes.func.isRequired,
    bannedUsers: PropTypes.shape({
      name: PropTypes.shape({}),
      endDate: PropTypes.shape({}),
      reason: PropTypes.shape({}),
    }),
    bannedUsersCount: PropTypes.number,
  }

  static defaultProps = {
    bannedUsers: {},
    bannedUsersCount: 0,
  }

  constructor(props) {
    super(props);
    this.state = {
      currentPage: 0,
      pageSize: 50,
    };
  }

  componentDidMount() {
  //  const { fetchBalanceHistory } = this.props;

  //  fetchBalanceHistory('today');
  }

  shouldComponentUpdate(nextProps) {
    if (!isEqual(nextProps, this.props)) {
      return true;
    }

    return false;
  }

  table() {
    const {
      bannedUsers, bannedUsersCount,
    } = this.props;
    const {
      currentPage,
      pageSize,
    } = this.state;

    let pagesCount = 0;
    if (bannedUsersCount) {
      pagesCount = Math.ceil(Object.keys(bannedUsersCount).length / pageSize);
    }

    return (
      <Fragment>
        {bannedUsers && Object.keys(bannedUsers)
          .map((key, index) => (
              <Fragment key={key}>
                <tr key={key} className={`allUsers-table-row ${index % 2 === 0 ? ('odd') : ('even')}`}>
                  <td className="allUsers-table-col">
                    {bannedUsers[key].name}
                  </td>
                  <td className="allUsers-table-col">
                  {/*  <Moment format="DD-MM-YYYY, HH:mm" locale="lv">
                      {bannedUsers[key].endDate}
                    </Moment> */}
                    <CustomDate format="DD-MM-YYYY, hh:mm" date={bannedUsers[key].endDate} />
                  </td>
                  <td className="allUsers-table-col">
                    {bannedUsers[key].reason}
                  </td>
                </tr>
              </Fragment>
            ))}
        {bannedUsersCount > pageSize && (
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
  }

  render() {
    const { t } = this.props;

    return (
      <Fragment>
        <div>
          <table style={{ width: '100%', fontSize: 12 }}>
            <colgroup>
              <col span="1" className="" />
            </colgroup>
            <thead>
              <tr>
                <th style={{ textAlign: 'center' }}>
                  {t('common.name')}
                </th>
                <th style={{ textAlign: 'center' }}>
                  {t('bannedUsers.end')}
                </th>
                <th style={{ textAlign: 'center' }}>
                  {t('bannedUsers.reason')}
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

export default withTranslation('common')(BannedUsers);
