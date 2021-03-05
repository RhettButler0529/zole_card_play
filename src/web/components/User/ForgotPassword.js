import React from 'react';
import PropTypes from 'prop-types';
import {
  Row,
  Col,
  Form,
  Label,
  Alert,
  Input,
  Button,
  FormGroup,
} from 'reactstrap';
import { Link, withRouter } from 'react-router-dom';
import { withTranslation } from 'react-i18next';

import logoImg from '../../../images/Menu/zole_logo.png';
import closeImg from '../../../images/landing-view/close.svg';

class ForgotPassword extends React.Component {
  static propTypes = {
    member: PropTypes.shape({
      email: PropTypes.string,
    }),
    error: PropTypes.string,
    success: PropTypes.string,
    loading: PropTypes.bool.isRequired,
    onFormSubmit: PropTypes.func.isRequired,
    history: PropTypes.shape({
      push: PropTypes.func.isRequired,
    }).isRequired,
    t: PropTypes.func.isRequired,
  }

  static defaultProps = {
    error: null,
    success: null,
    member: {},
  }

  constructor(props) {
    super(props);
    this.state = {
      email: (props.member && props.member.email) ? props.member.email : '',
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange = e => this.setState({ [e.target.name]: e.target.value })

  handleSubmit = (e) => {
    e.preventDefault();
    const { onFormSubmit, history } = this.props;

    return onFormSubmit(this.state)
      .then(() => setTimeout(() => history.push('/login'), 1000))
      .catch(() => {});
  }

  render() {
    const { loading, error, success, t } = this.props;
    const { email } = this.state;

    return (


      <div className="landing-container-body">
        <Row className="landing-header">
          <Col sm="10">
            <img className="landing-header-logo" src={logoImg} />
          </Col>
          <Col sm="2" className="landing-header-links">            
            <Link to="/login">{t('home.close')}<img src={closeImg} /></Link>
          </Col>
        </Row>

        <div className="landing-content">       

            <div className="landing-form-title">   
              <h1>{t('home.iForgotPass')}</h1>
            </div>    

            <Row style={{margin:0}}>
              <Col lg={{ size: 4, offset: 4 }} style={{textAlign: 'center'}}>
                {!!error && <Alert color="danger">{t(`member.${error}`)}</Alert>}
                {!!success && <Alert color="success">{t(`member.${success}`)}</Alert>}

                <Form onSubmit={this.handleSubmit}  className="common-form">
                  <FormGroup>
                    <Label for="email">{t('home.email')}*</Label>
                    <Input
                      type="email"
                      name="email"
                      id="email"
                      placeholder="john@doe.corp"
                      value={email}
                      disabled={loading}
                      onChange={this.handleChange}
                    />
                  </FormGroup>
                  <Button className="common-button lite-shadow submit-button" disabled={loading}>
                    {loading ? t('home.loading') : t('home.send')}
                  </Button>
                </Form>
              </Col>
            </Row>
          </div>

        </div>
    );
  }
}

export default  withTranslation('common')(withRouter(ForgotPassword));
