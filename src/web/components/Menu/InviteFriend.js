import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';

import { withTranslation } from 'react-i18next';

/* import {
  Row,
  Col,
  Button,
} from 'reactstrap'; */

import Row from 'reactstrap/lib/Row';
import Col from 'reactstrap/lib/Col';
import Button from 'reactstrap/lib/Button';

class InviteFriend extends Component {
  static propTypes = {
    member: PropTypes.shape({}).isRequired,
    t: PropTypes.func.isRequired,
  }

  constructor(props) {
    super(props);
    this.state = {
    };
  }


  inviteFriend = () => {
    window.FB.ui({
      method: 'apprequests',
      message: 'Come Play Zole',
    }, () => {
    });
  }

  render() {
    const { t, member } = this.props;

    return (
      <Fragment>
        {member && member.socProvider === 'facebook' && (
          <Row>
            <Col sm="4">
              <Button color="link" className="send-money-block-invite-button" onClick={this.inviteFriend}>
                {t('sendMoney.inviteFriend')}
              </Button>
            </Col>
          </Row>
        )}
      </Fragment>
    );
  }
}


export default withTranslation('common')(InviteFriend);
