import React, { Fragment } from 'react';
import PropTypes from 'prop-types';

import CustomDate from './UI/CustomDate';

/* import {
  Row,
  Col,
} from 'reactstrap'; */

import Row from 'reactstrap/lib/Row';
import Col from 'reactstrap/lib/Col';

const SupportMessage = React.memo(({
  message, date, userUid, uid,
}) => {
  if (message) {
    const splitMessage = message.split(/\n/);
    console.log('support message render');
    return (
      <Fragment>
        {uid && userUid && userUid.toString() === uid.toString() ? (
          <Row className="contact-support-chat-message-row">
            <Col md="12" className="contact-support-chat-message">
              <div className="contact-support-chat-message-user-time">
                { date && (
                <CustomDate format="MM/DD hh:mm" date={date} />
                )}
              </div>
              <div className="contact-support-chat-message-user">
                {splitMessage.map(row => (
                  <p style={{ marginBottom: 0, lineHeight: '20px' }}>
                    {row}
                  </p>
                ))}
              </div>
            </Col>
          </Row>
        ) : (
          <Row className="contact-support-chat-message-row">
            <Col md="12" className="contact-support-chat-message">
              <div className="contact-support-chat-message-other-time">
                { date && (
                  <CustomDate format="MM/DD hh:mm" date={date} />
                )}
              </div>
              <div className="contact-support-chat-message-other">
                {splitMessage.map(row => (
                  <p style={{ marginBottom: 0, lineHeight: '20px' }}>
                    {row}
                  </p>
                ))}
              </div>
            </Col>
          </Row>
        )}
      </Fragment>
    );
  }
  return null;
});

SupportMessage.propTypes = {
  message: PropTypes.string,
  date: PropTypes.number,
  userUid: PropTypes.string,
  uid: PropTypes.string,
};

SupportMessage.defaultProps = {
  message: null,
  uid: null,
  userUid: null,
  date: null,
};

export default SupportMessage;
