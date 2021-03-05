import React from 'react';
import PropTypes from 'prop-types';
import { withTranslation } from 'react-i18next';
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
import { connect } from 'react-redux';
import { Firebase } from '../../../lib/firebase';

import logoImg from '../../../images/Menu/zole_logo.png';

import { checkLoginState as checkFacebookLoginState } from '../../../actions/member';
import { draugiemAuth } from '../../../actions/member';

import draLoginImg from '../../../images/landing-view/dra-login.png';
import fbLoginImg from '../../../images/landing-view/fb-login.png';
import googleLoginImg from '../../../images/landing-view/google-login.png';

import closeImg from '../../../images/landing-view/close.svg';

class Login extends React.Component {
  static propTypes = {
    member: PropTypes.shape({
      email: PropTypes.string,
    }),
    error: PropTypes.string,
    success: PropTypes.string,
    getDraugiemAuthUrl:PropTypes.func.isRequired,
    onFormSubmit: PropTypes.func.isRequired,
    history: PropTypes.shape({
      push: PropTypes.func.isRequired,
    }).isRequired,
    t: PropTypes.func.isRequired,
    checkFacebookLogin: PropTypes.func.isRequired,
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
      password: '',
      FB: null,
      error: null,
      success: null,
      loading: false,
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.FBLogin = this.FBLogin.bind(this);
    this.googleLogin = this.googleLogin.bind(this);
    this.draLogin = this.draLogin.bind(this);
    this.draAuthHandler = this.draAuthHandler.bind(this);
  }


  componentDidMount() {
    if(window.FB){
      this.setState({FB: window.FB})
    }else{
      document.addEventListener('FBObjectReady', this.initializeFacebookLogin);
    }
  }

  componentWillUnmount() {
    document.removeEventListener('FBObjectReady', this.initializeFacebookLogin);
  }

  // FB stuff

  initializeFacebookLogin = () => {
    this.setState({FB: window.FB})
    //this.checkFacebookLoginStatus();
  }

  /*checkFacebookLoginStatus = () => {
    const { FB } = this.state;
    FB.getLoginStatus(this.facebookLoginHandler);
  }*/

  facebookLoginHandler = (response, fromLoginForm) => {
    const { checkFacebookLogin, history } = this.props;

    checkFacebookLogin(response).then((res) => {
      if(res.data){
        if(res.data.uid){
          history.push("/")
        }else{
          if(fromLoginForm) this.setState({error: 'notLoggedIn', success: null})
          this.setState({loading: false});
        }
      }else{
        if(fromLoginForm) this.setState({error: 'notLoggedIn', success: null})
        this.setState({loading: false});
      }
    }).catch((err) => {
      this.setState({error: err, success: null, loading: false})
    });
  }


  FBLogin = (e) => {
    e.preventDefault();
    const { FB, loading } = this.state;

    this.setState({loading: true});

    if (!FB || loading) return;

    FB.getLoginStatus((response) => {
      if (response.status === 'connected') {
        this.facebookLoginHandler(response, true);
      } else {
        FB.login((response2) => { this.facebookLoginHandler(response2, true); });
      }
    });
  }

  googleLogin = (e) => {
    e.preventDefault();
    const { i18n, history } = this.props;
    const { loading } = this.state;

    if(loading) return;

    this.setState({loading: true});

    const provider = new Firebase.auth.GoogleAuthProvider();
    Firebase.auth().languageCode = i18n.language;

    Firebase.auth().signInWithPopup(provider).then((_result) => {
      history.push('/');
    }).catch((error) => {
      if(error.code != "auth/popup-closed-by-user"){
        this.setState({error: error.code, success: null})
      }
      this.setState({loading: false});
    });
  }

  // Draugiem stuff

  draAuthHandler = (e) => {
    window.removeEventListener('dr_auth_code', this.draAuthHandler);

    const { history } = this.props;
    const code = (e.detail && e.detail.dr_auth_code) ? e.detail.dr_auth_code : null;

    if(!code){
      this.setState({error: 'loginFailure', success: null, loading: false})
      return;
    }

    this.setState({loading: true});

    draugiemAuth(code).then(()=>{
      if(Firebase.auth().currentUser){
        history.push("/");
      }else{
        this.setState({loading: false, error: 'loginFailure', success: null });
      }
    }).catch((_error)=>{
      this.setState({loading: false, error: 'loginFailure', success: null});
    });
  };

  draLogin = (e) => {
    e.preventDefault();
    const { getDraugiemAuthUrl } = this.props;
    const { loading } = this.state;

    if(loading) return;

    this.setState({loading: true});

    const loc = window.location;
    const redirectUrl = loc.protocol + "//" + loc.host + "/dra-redirect";

    getDraugiemAuthUrl(redirectUrl).then((result) => {
      const popup = window.open(result.data.url, "Draugiem.lv", "width=200,height=200");
      window.addEventListener('dr_auth_code', this.draAuthHandler, false);

      const timer = setInterval(() => {
        if(popup.closed) {
          clearInterval(timer);
          this.setState({loading: false});
        }
      }, 1000);

    }).catch((_error) => {
      this.setState({loading: false});
    });
  }

  // Form stuff

  handleChange = e => this.setState({ [e.target.name]: e.target.value });

  handleSubmit = (e) => {
    e.preventDefault();

    const { onFormSubmit, history, i18n } = this.props;
    const { email, password, loading } = this.state;

    if(loading) return;

    this.setState({loading: true});

    return onFormSubmit({email: email, password: password}, i18n.language)
      .then(() => { history.push('/')})
      .catch(() => { this.setState({loading: false}); });
  }

  // Render

  render() {
    const { success, error, t } = this.props;
    const { email, password, FB, success: stateSuccess, error: stateError, loading } = this.state;

    return (

      <div className="landing-container-body">
        <Row className="landing-header">
          <Col sm="10">
            <img className="landing-header-logo" src={logoImg} />
          </Col>
          <Col sm="2" className="landing-header-links">
            <Link to="/landing">{t('home.close')}<img src={closeImg} /></Link>
          </Col>
        </Row>

        <div className="landing-content">

            <div className="landing-form-title">
              <h1>{t('home.loginWith')}</h1>
            </div>

            <div className="landing-login-with">
              <a href="#" className={!FB || loading ? 'disabled': ''} onClick={this.FBLogin}><img src={fbLoginImg} /></a>
              <a href="#" className={loading ? 'disabled': ''} onClick={this.googleLogin}><img src={googleLoginImg} /></a>
              <a href="#" className={loading ? 'disabled': ''} onClick={this.draLogin}><img src={draLoginImg} /></a>
            </div>

            <div className="landing-login-or">
              <hr />
              <span>{t('home.or')}</span>
            </div>

            <Row style={{margin:0}}>
              <Col lg={{ size: 4, offset: 4 }} style={{textAlign: 'center'}}>
                {(!!success || !!stateSuccess) && <Alert color="success">{t(`member.${success || stateSuccess}`)}</Alert>}
                {(!!error || !!stateError) && <Alert color="danger">{t(`member.${error || stateError}`)}</Alert>}

                <Form onSubmit={this.handleSubmit} className="common-form">
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

                  <Row>
                    <Col sm="6" className="text-left">
                      <Link className="common-link" to="/sign-up">{t('home.register')}</Link>
                    </Col>
                    <Col sm="6" className="text-right">
                      <Link className="common-link" to="/forgot-password">{t('home.forgotPass')}</Link>
                    </Col>
                  </Row>

                  <Button className="common-button lite-shadow submit-button" disabled={loading}>
                    {loading ? t('home.loading') : t('home.login') }
                  </Button>
                </Form>
              </Col>
            </Row>
          </div>

        </div>

    );
  }
}

const mapStateToProps = state => ({
  member: state.member || {},
});

const mapDispatchToProps = {
  checkFacebookLogin: checkFacebookLoginState
};

export default withTranslation('common')(withRouter(connect(mapStateToProps, mapDispatchToProps)(Login)));
