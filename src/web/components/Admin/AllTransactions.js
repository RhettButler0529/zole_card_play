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

import Moment from 'react-moment';
// import moment from 'moment';

import { withRouter } from 'react-router-dom';

class AllBans extends React.Component {
  static propTypes = {
    member: PropTypes.shape({
      email: PropTypes.string,
    }),
    //  allTransactions: PropTypes.shape({}),
    allPayments: PropTypes.shape({}),
    //  allUsers: PropTypes.shape({}),
    history: PropTypes.shape({
      push: PropTypes.func.isRequired,
    }).isRequired,
    fetchPaymentsRange: PropTypes.func.isRequired,
  }

  static defaultProps = {
    member: {},
    //  allTransactions: {},
    allPayments: {},
  }

  constructor(props) {
    super(props);
    this.state = {
      currentPage: 0,
      pageSize: 50,
    };

    this.handleClick = this.handleClick.bind(this);
  }

  componentDidMount() {
    const { fetchPaymentsRange, paymentsCount } = this.props;

    const start = paymentsCount - 50;
    const end = paymentsCount - 1;

    console.log(start);
    console.log(end);

    fetchPaymentsRange(start, end);
  }

  /* handleClick(e, index) {
    e.preventDefault();
    this.setState({
      currentPage: index,
    });
  } */

  handleClick(e, index) {
    e.preventDefault();
    const { fetchPaymentsRange, paymentsCount } = this.props;

    const start = paymentsCount - (50 * index) - 50;
    const end = paymentsCount - (50 * index) - 1;

  //  const start = (50 * index) + 1;
  //  const end = (50 * index) + 50;

    console.log(start);
    console.log(end);

    fetchPaymentsRange(start, end);

    this.setState({
      currentPage: index,
    });
  }

  table() {
    const {
      paymentsCount, allPayments,
    } = this.props;
    const {
      currentPage,
      pageSize,
    } = this.state;

    const pagesCount = Math.ceil(paymentsCount / pageSize);

    return (
      <Fragment>
        {allPayments && allPayments.length > 0 && allPayments
          .map((payment, index) => (
            <Fragment key={payment.id}>
              <tr key={payment.id} className={`allUsers-table-row ${index % 2 === 0 ? ('odd') : ('even')}`}>
                <td className="allUsers-table-col">
                  { payment.id }
                </td>
                <td className="allUsers-table-col">
                  <Moment format="DD-MM-YYYY, HH:mm" locale="lv">
                    {payment.date}
                  </Moment>
                </td>
                <td className="allUsers-table-col">
                  { payment.userUid }
                </td>
                <td className="allUsers-table-col">
                  { payment.productNr }
                </td>
                <td className="allUsers-table-col">
                  { payment.status }
                </td>

              </tr>
            </Fragment>
          ))}
        {paymentsCount > pageSize && (
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
  //  const { fetchPaymentsRange, allPayments } = this.props;

    return (
      <Fragment>
        <div style={{ marginTop: 100, color: '#fff' }}>
          <h2>
            Transactions
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
                  Datums
                </th>
                <th>
                  User Id
                </th>
                <th>
                  Producta Nr
                </th>
                <th>
                  Status
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

export default withRouter(AllBans);
