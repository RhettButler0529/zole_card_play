import React, { Fragment } from 'react';
// import { Row, Col } from 'reactstrap';

import Row from 'reactstrap/lib/Row';
import Col from 'reactstrap/lib/Col';

// import Moment from 'react-moment';
import CustomDate from './CustomDate';

const Blocked = ({ banEndDate, banReason }) => (
  <Fragment>
    <div className="loading-background" />
    <div className="loading-logo" />
    <div className="bannedScreen" style={{ marginTop: '18%', color: '#fff' }}>
      <Row>
        <Col md={{ size: 4, offset: 4 }}>
          <Row>
            <Col md="12">
              <h2>
                Jūs esat bloķēts
              </h2>
            </Col>
          </Row>
          <Row>
            <Col md="6">
              {'Līdz:'}
            {/*  <Moment format="DD-MM-YYYY" locale="lv">
                {banEndDate}
              </Moment> */}
              <CustomDate format="DD-MM-YYYY" date={banEndDate} />
            </Col>
            <Col md="6">
              {`Iemesls: ${banReason}`}
            </Col>
          </Row>
        </Col>
      </Row>
    </div>
  </Fragment>
);

export default Blocked;
