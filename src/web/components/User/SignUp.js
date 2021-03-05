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
import { Firebase } from '../../../lib/firebase';

import logoImg from '../../../images/Menu/zole_logo.png';
import closeImg from '../../../images/landing-view/close.svg';

class SignUp extends React.Component {
  static propTypes = {
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
  }

  state = {
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    password2: '',
  }

  constructor(props) {
    super(props);

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange = e => this.setState({ [e.target.name]: e.target.value });

  handleSubmit = (event) => {
    event.preventDefault();
    const { onFormSubmit, history, i18n } = this.props;

    Firebase.auth().languageCode = i18n.language;
    onFormSubmit(this.state)
      .then(() => setTimeout(() => history.push('/login'), 6000))
      .catch(() => {});
  }

  render() {
    const { loading, error, success, t } = this.props;
    const {
      firstName, lastName, email, password, password2,
    } = this.state;

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
              <h1>{t('home.register')}</h1>
            </div>    

            <Row style={{margin:0}}>
              <Col lg={{ size: 4, offset: 4 }} style={{textAlign: 'center'}}>
                {!!error && <Alert color="danger">{t(`member.${error}`)}</Alert>}
                {!!success && <Alert color="success">{t(`member.${success}`)}</Alert>}

                
                <Form onSubmit={this.handleSubmit}  className="common-form">
                  <FormGroup>
                    <Label for="firstName">{t('home.firstName')}*</Label>
                    <Input
                      type="text"
                      name="firstName"
                      id="firstName"
                      placeholder="John"
                      disabled={loading}
                      value={firstName}
                      onChange={this.handleChange}
                    />
                  </FormGroup>
                  <FormGroup>
                    <Label for="lastName">{t('home.lastName')}*</Label>
                    <Input
                      type="text"
                      name="lastName"
                      id="lastName"
                      placeholder="Doe"
                      disabled={loading}
                      value={lastName}
                      onChange={this.handleChange}
                    />
                  </FormGroup>
                  <FormGroup>
                    <Label for="email">{t('home.email')}*</Label>
                    <Input
                      type="email"
                      name="email"
                      id="email"
                      placeholder="john@doe.corp"
                      disabled={loading}
                      value={email}
                      onChange={this.handleChange}
                    />
                  </FormGroup>
                  <FormGroup>
                    <Label for="password">{t('home.pass')}*</Label>
                    <Input
                      type="password"
                      name="password"
                      id="password"
                      placeholder="••••••••"
                      disabled={loading}
                      value={password}
                      onChange={this.handleChange}
                    />
                  </FormGroup>
                  <FormGroup>
                    <Label for="password2">{t('home.confirmPass')}</Label>
                    <Input
                      type="password"
                      name="password2"
                      id="password2"
                      placeholder="••••••••"
                      disabled={loading}
                      value={password2}
                      onChange={this.handleChange}
                    />
                  </FormGroup>
                  <Button className="common-button lite-shadow submit-button" disabled={loading}>
                    {loading ? t('home.loading') : t('home.register')}
                  </Button>
                </Form>


              </Col>
            </Row>
          </div>

      </div>
    );
  }
}

export default withTranslation('common')(withRouter(SignUp));
