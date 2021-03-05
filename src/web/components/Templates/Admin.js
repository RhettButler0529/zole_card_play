import React from 'react';
import PropTypes from 'prop-types';
// import { Container, Row, Col } from 'reactstrap';

import Row from 'reactstrap/lib/Row';
import Col from 'reactstrap/lib/Col';
import Container from 'reactstrap/lib/Container';


import { Helmet } from 'react-helmet';

// const currentVersion = require('./../../../../package.json').version;


const Template = ({ pageTitle, children }) => (
  <Container fluid>
    <div className="game-bg" />
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
};

Template.defaultProps = {
  pageTitle: 'Admin',
};

export default Template;
