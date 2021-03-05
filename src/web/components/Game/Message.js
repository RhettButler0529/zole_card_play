import React, { Fragment } from 'react';
import PropTypes from 'prop-types';

/* import {
  Row,
  Col,
  Media,
} from 'reactstrap'; */

import Row from 'reactstrap/lib/Row';
import Col from 'reactstrap/lib/Col';
import Media from 'reactstrap/lib/Media';

import CustomDate from '../UI/CustomDate';

const Message = React.memo(({ message, uid }) => {
  if (message.message) {
    const splitMessage = message.message.split(/\n/);
  /*  let dd;
    let hh;
    let mm;
    if (message.time) {
      dd = new Date(message.time).getUTCDate().toString();
      hh = new Date(message.time).getUTCHours().toString();
      mm = new Date(message.time).getUTCMinutes().toString();
    } */

    if (!uid) {
      return null;
    }

    return (
      <Fragment>
        {message.userUid && message.userUid === 'game' ? (
          <Fragment>
            <Row>
              <Col md="2" className="chat-message-col-left">
                <div className="chat-message-game-label">
                ZOLE
                </div>
                <div className="chat-message-game-time">
                  { message.time && (
                    <CustomDate format="DD/ hh:mm" date={message.time} />
                  )}
                </div>
              </Col>
              <Col sm="10" className="chat-message-col-right">
                <div className="chat-message-game">
                  {message.message}
                </div>
              </Col>
            {/*  <Col sm="12" className="chat-message-col">
                <div className="chat-message-game-time">
                  { message.time && (
                    <CustomDate format="DD/ hh:mm" date={message.time} />
                  )}
                </div>
              </Col> */}
            </Row>
          </Fragment>
        ) : (
          <Fragment>
            {message.userUid && message.userUid.toString() === uid.toString() ? (
              <Fragment>
                <Row>
                  <Col sm="12" className="chat-message-col">
                    <div className="chat-message-user">
                      {splitMessage.map((row, index) => (
                        <div key={index}>
                          {row}
                        </div>
                      ))}
                    </div>
                  </Col>
                  <Col sm="12" className="chat-message-col">
                    <div className="chat-message-user-time">
                      { message.time && (
                        <CustomDate format="DD/ hh:mm" date={message.time} />
                      )}
                    </div>
                  </Col>
                </Row>
              </Fragment>
            ) : (
              <Fragment>
                <Row>
                  <Col md="1" className="chat-message-col">
                    <Media
                      className="chat-message-other-image"
                      src={message.userPhoto}
                      alt="photo"
                    />

                  </Col>
                  <Col sm="9" className="chat-message-col">
                    <Row>
                      <Col sm="12">
                        <div className="chat-message-other">
                          {splitMessage.map((row, index) => (
                            <p key={index} style={{ marginBottom: 0, lineHeight: '20px' }}>
                              {row}
                            </p>
                          ))}
                        </div>
                      </Col>
                    </Row>
                  </Col>
                </Row>
                <Row>
                  <Col sm="12">
                    { message.time && (
                    <div className="chat-message-other-time">
                      <CustomDate format="DD/ hh:mm" date={message.time} />
                    </div>
                    )}
                  </Col>
                </Row>
              </Fragment>
            )}
          </Fragment>
        )}
      </Fragment>
    );
  }
  return null;
});

Message.propTypes = {
  message: PropTypes.shape(),
  uid: PropTypes.string,
//  member: PropTypes.shape(),
};

Message.defaultProps = {
  message: {},
  uid: '',
//  member: {},
};

export default Message;
