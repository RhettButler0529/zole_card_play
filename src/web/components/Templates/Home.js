import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import Container from 'reactstrap/lib/Container';

import { Helmet } from 'react-helmet';

const Template = ({ pageTitle, addClassName, children }) => (
  <Container className={`landing-container ${addClassName}`}>
    <div className="landing-bg" />
    <Helmet>
      <title>{pageTitle}</title>
    </Helmet>

    <Fragment>{children}</Fragment>
  </Container>
);

Template.propTypes = {
  pageTitle: PropTypes.string,
  children: PropTypes.element.isRequired,
};

Template.defaultProps = {
  pageTitle: 'Zole',
  addClassName: ''
};

export default Template;
