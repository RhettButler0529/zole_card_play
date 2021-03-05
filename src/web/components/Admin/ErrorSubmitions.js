import React, { Fragment } from 'react';
import PropTypes from 'prop-types';

/* import {
  Button,
  Pagination,
  PaginationItem,
  PaginationLink,
} from 'reactstrap'; */

import Button from 'reactstrap/lib/Button';
import Pagination from 'reactstrap/lib/Pagination';
import PaginationItem from 'reactstrap/lib/PaginationItem';
import PaginationLink from 'reactstrap/lib/PaginationLink';

import { withRouter } from 'react-router-dom';

class ErrorSubmitions extends React.Component {
  static propTypes = {
    member: PropTypes.shape({
      email: PropTypes.string,
    }),
    allErrors: PropTypes.shape({}),
    history: PropTypes.shape({
      push: PropTypes.func.isRequired,
    }).isRequired,
  }

  static defaultProps = {
    member: {},
    allErrors: {},
  }

  constructor(props) {
    super(props);
    this.state = {
      currentPage: 0,
      pageSize: 50,
    };

    this.handleClick = this.handleClick.bind(this);
    this.toggle = this.toggle.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }

  componentWillMount() {
  }

  handleChange = (event) => {
    const value = event.target.type === 'checkbox' ? event.target.checked : event.target.value;

    this.setState({
      [event.target.name]: value,
    });
  }

  openModal() {
    this.setState({
      openModal: true,
    });
  }

  toggle() {
    this.setState(prevState => ({
      openModal: !prevState.openModal,
    }));
  }

  handleClick(e, index) {
    e.preventDefault();
    this.setState({
      currentPage: index,
    });
  }

  table() {
    const {
      allErrors,
    } = this.props;
    const {
      currentPage,
      pageSize,
    } = this.state;

    const pagesCount = Math.ceil(Object.keys(allErrors).length / pageSize);

    return (
      <Fragment>
        {allErrors && Object.keys(allErrors)
          .slice(
            currentPage * pageSize,
            (currentPage + 1) * pageSize,
          )
          .map((key, index) => (
            <Fragment key={key}>
              <tr key={key} className={`allUsers-table-row ${index % 2 === 0 ? ('odd') : ('even')}`}>
                <td className="allUsers-table-col">
                  {allErrors[key].reason}
                </td>
                <td className="allUsers-table-col">
                  {allErrors[key].uid}
                </td>
                <td className="allUsers-table-col">
                  <Button onClick={() => this.openModal(key)}>
                    Labot
                  </Button>
                </td>
              </tr>
            </Fragment>
          ))}
        {Object.keys(allErrors).length > pageSize && (
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
  //  const {
  //    openModal,
  //  } = this.state;

    return (
      <Fragment>
        <div style={{ marginTop: 100 }}>
          <h2>
          Visi kļūdu ziņojumi
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
                  Reason
                </th>
                <th>
                  Uid
                </th>
                <th>
                  Labot
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

export default withRouter(ErrorSubmitions);
