import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { login, getDraugiemAuthUrl } from '../actions/member';

class Login extends Component {
  static propTypes = {
    Layout: PropTypes.shape({}).isRequired,
    member: PropTypes.shape({}).isRequired,
    onFormSubmit: PropTypes.func.isRequired,
    getDraugiemAuthUrl:PropTypes.func.isRequired,
    history: PropTypes.shape({
      push: PropTypes.func.isRequired,
    }).isRequired
  }

  state = {
    error: null,
    success: null
  }

  onFormSubmit = (data, language) => {
    const { onFormSubmit } = this.props;

    this.setState({ loading: true });

    return onFormSubmit(data, language)
      .then(() => this.setState({
        success: 'auth/success-login',
        error: null,
      })).catch((err) => {
        this.setState({
          success: null,
          error: err,
        });
        throw err; // To prevent transition back
      });
  }

  _getDraugiemAuthUrl = (redirectUrl) => {
    const { getDraugiemAuthUrl } = this.props;
    return getDraugiemAuthUrl(redirectUrl);
  }

  render = () => {
    const { member, Layout, history, getDraugiemAuthUrl } = this.props;
    const { error, success } = this.state;

    return (
      <Layout
        error={error}
        member={member}
        success={success}
        history={history}
        getDraugiemAuthUrl={this._getDraugiemAuthUrl}
        onFormSubmit={this.onFormSubmit}
      />
    );
  }
}

const mapStateToProps = state => ({
  member: state.member || {},
});

const mapDispatchToProps = {
  onFormSubmit: login,
  getDraugiemAuthUrl: getDraugiemAuthUrl
};

export default connect(mapStateToProps, mapDispatchToProps)(Login);