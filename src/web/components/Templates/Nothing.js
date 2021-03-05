import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import Row from 'reactstrap/lib/Row';
import Col from 'reactstrap/lib/Col';
import Container from 'reactstrap/lib/Container';


import { Helmet } from 'react-helmet';


const Template = ({ pageTitle, containerClassName, state, children }) => (
  <Container className={`app-wrapper ${containerClassName}`}>
    <div className={`game-bg ${state.isLoading ? 'loading-bg' : ''}`} />
    <Helmet>
      <title>{pageTitle}</title>
    </Helmet>

    <Row style={{ height: '100%' }}>
      <Col sm="12">{children}</Col>
    </Row>
  </Container>
);

Template.propTypes = {
  pageTitle: PropTypes.string,
  children: PropTypes.element.isRequired,
  state: PropTypes.shape({
    isLoading: PropTypes.bool,
  }),
};

Template.defaultProps = {
  pageTitle: 'Zole',
  containerClassName: ''
};

const mapStateToProps = state => ({
  state: state.state || {}
});

const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(Template);
