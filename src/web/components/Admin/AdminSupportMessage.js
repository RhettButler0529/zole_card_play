import React, { Fragment } from 'react';
import PropTypes from 'prop-types';

import Moment from 'react-moment';
import moment from 'moment';

/* import {
  Row,
  Col,
} from 'reactstrap'; */

import Row from 'reactstrap/lib/Row';
import Col from 'reactstrap/lib/Col';


const AdminSupportMessage = ({ message }) => {
  if (message.message) {
    const splitMessage = message.message.split(/\n/);
    return (
      <Fragment>
        {!message.userUid ? (
          <Fragment>
            { message.date && (
            <div style={{
              backgroundColor: '#027b00',
              color: '#0f2c0e',
              float: 'right',
              minWidth: '10%',
              maxWidth: '50%',
              borderRadius: 20,
              marginLeft: 15,
              marginRight: 15,
              marginTop: 5,
              marginBottom: 5,
              paddingLeft: 10,
              paddingRight: 10,
              fontSize: 12,
              textTransform: 'none',
            }}
            >
              <Moment format="MM/DD HH:mm" locale="lv">
                {moment(message.date)}
              </Moment>
            </div>
            )}
            <div
              style={{
                backgroundColor: '#027b00',
                color: '#0f2c0e',
                float: 'right',
                minWidth: '10%',
                maxWidth: '50%',
                borderRadius: 20,
                marginLeft: 15,
                marginRight: 15,
                marginTop: 5,
                marginBottom: 5,
                paddingLeft: 10,
                paddingRight: 10,
                fontSize: 12,
                textTransform: 'none',
              }}
              className="message"
            >
              {splitMessage.map(row => (
                <p style={{ marginBottom: 0, lineHeight: '20px' }}>
                  {row}
                </p>
              ))}
            </div>
          </Fragment>
        ) : (
          <Row style={{
            marginTop: 5, marginBottom: 5, paddingLeft: 10, paddingTop: 5, paddingBottom: 5,
          }}
          >
            <Col
              md="12"
              className="message"
              style={{ paddingLeft: 0 }}
            >
              { message.date && (
              <div style={{
                backgroundColor: '#060f0f',
                color: '#676262',
                float: 'left',
                minWidth: '10%',
                maxWidth: '50%',
                borderRadius: 20,
                marginRight: 15,
                paddingLeft: 10,
                paddingRight: 10,
                fontSize: 12,
                textTransform: 'none',
              }}
              >
                <Moment format="MM/DD HH:mm" locale="lv">
                  {moment(message.date)}
                </Moment>
              </div>
              )}
              <div style={{
                backgroundColor: '#060f0f',
                color: '#676262',
                float: 'left',
                minWidth: '10%',
                maxWidth: '50%',
                borderRadius: 20,
                marginRight: 15,
                paddingLeft: 10,
                paddingRight: 10,
                fontSize: 12,
                textTransform: 'none',
              }}
              >
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
};

AdminSupportMessage.propTypes = {
  message: PropTypes.shape(),
};

AdminSupportMessage.defaultProps = {
  message: {},
};

export default AdminSupportMessage;
