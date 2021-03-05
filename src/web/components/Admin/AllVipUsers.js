import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import Moment from 'react-moment';

/* import {
  Pagination,
  PaginationItem,
  PaginationLink,
} from 'reactstrap'; */

import Pagination from 'reactstrap/lib/Pagination';
import PaginationItem from 'reactstrap/lib/PaginationItem';
import PaginationLink from 'reactstrap/lib/PaginationLink';

import { withRouter } from 'react-router-dom';

class AllVipUsers extends React.Component {
  static propTypes = {
    member: PropTypes.shape({
      email: PropTypes.string,
    }),
    allVipUsers: PropTypes.shape({}),
    history: PropTypes.shape({
      push: PropTypes.func.isRequired,
    }).isRequired,
  //  fetchAllVipUsers: PropTypes.func.isRequired,
  }

  static defaultProps = {
    member: {},
    allVipUsers: {},
  }

  constructor(props) {
    super(props);
    this.state = {
      currentPage: 0,
      pageSize: 50,
    };

    this.handleClick = this.handleClick.bind(this);
  }

  // componentWillMount() {
  //  const { fetchAllVipUsers } = this.props;

  //  fetchAllVipUsers();
  //  }

  handleClick(e, index) {
    e.preventDefault();

    this.setState({
      currentPage: index,
    });
  }

  table() {
    const {
      allVipUsers,
    } = this.props;
    const {
      currentPage,
      pageSize,
    } = this.state;

    const pagesCount = Math.ceil(Object.keys(allVipUsers).length / pageSize);

    return (
      <Fragment>
        {allVipUsers && Object.keys(allVipUsers)
          .slice(
            currentPage * pageSize,
            (currentPage + 1) * pageSize,
          )
          .map((key, index) => (
            <Fragment key={key}>
              <tr key={key} className={`allUsers-table-row ${index % 2 === 0 ? ('odd') : ('even')}`}>
                <td className="allUsers-table-col">
                  {allVipUsers[key].name}
                </td>
                <td className="allUsers-table-col">
                  <Moment format="DD-MM-YYYY, HH:mm" locale="lv">
                    {allVipUsers[key].lastLogin}
                  </Moment>
                </td>
                <td className="allUsers-table-col">
                  {allVipUsers[key].bal}
                </td>
                <td className="allUsers-table-col">
                  {allVipUsers[key].uid}
                </td>
              </tr>
            </Fragment>
          ))}
        {Object.keys(allVipUsers).length > pageSize && (
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
    return (
      <Fragment>
        <div style={{ marginTop: 100 }}>
          <h2>
          Visi VIP lietotāji
          </h2>
          <table style={{ width: '100%', fontSize: 12 }}>
            <colgroup>
              <col span="1" className="" />
            </colgroup>
            <thead>
              <tr>
                <th>
                  Vārds
                </th>
                <th>
                  Last login
                </th>
                <th>
                  Balance
                </th>
                <th>
                  Uid
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

export default withRouter(AllVipUsers);
