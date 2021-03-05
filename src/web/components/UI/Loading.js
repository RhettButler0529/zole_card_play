import React, { Fragment } from 'react';
// import { Row, Col, Progress } from 'reactstrap';

import Row from 'reactstrap/lib/Row';
import Col from 'reactstrap/lib/Col';
import Progress from 'reactstrap/lib/Progress';

const Loading = ({ loading, loadingProgress }) => (
  <Fragment>
    <div className="logo-wrapper loading">
      <div className="logo loading" />
    </div>
    
    <div className="loadingScreen">
      <Row>
        <Col md={{ size: 4, offset: 4 }}>
          <div>
            <Progress color="success" value={loadingProgress} />
          </div>
        </Col>
      </Row>
      <Row className="loadingText">
        <Col md={{ size: 4, offset: 4 }}>
          IELĀDĒJAM
        </Col>
      </Row>
    </div>
  </Fragment>
);

export default Loading;
