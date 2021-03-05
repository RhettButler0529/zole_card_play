import React from 'react';
import PropTypes from 'prop-types';

import { connect } from 'react-redux';

import smartlookClient from 'smartlook-client';

import { withRouter } from "react-router-dom";

import { Firebase } from '../../lib/firebase';

import config from '../../constants/config';

import {
  checkLoginState, draugiemAuth, getTimeOffset, logout, removeUserOnDisconnect, initSmartLook, failedLoginLog, getUserData,
} from '../../actions/member';


class Auth extends React.Component {
  static propTypes = {
    checkLogin: PropTypes.func.isRequired,
    removeOnDisconnect: PropTypes.func.isRequired,
    getOffset: PropTypes.func.isRequired,
    member: PropTypes.shape({
      uid: PropTypes.string,
      name: PropTypes.string,
      email: PropTypes.string,
    }),
    signOut: PropTypes.func.isRequired,
  }

  static defaultProps = {
    member: {},
  }

  constructor(props) {
    super(props);
    this.state = {};

    this.checkLoginState = this.checkLoginState.bind(this);
  }

  componentWillMount() {
    //const { initSmartLookApp } = this.props;
    //initSmartLookApp();
  }

  componentDidMount() {
    const { removeOnDisconnect, getOffset, fetchUserData } = this.props;

    removeOnDisconnect();

    /*setTimeout(() => {
      const { member } = this.props;
      if (member && member.smartLookStatus && member.uid && member.name) {
        try {
          smartlookClient.consentAPI('Here goes consent text from your website.');
          smartlookClient.identify(member.uid, {
            name: member.name,
            email: member.email,
            provider: member.socProvider,
          });
        } catch (err) {
          console.log(err);
        }
      }
    }, 1500);
    */

    getOffset();

    const { hostname, search, pathname } = window.location;

    if (!config.isInAppFrame()) {
      const unsb = Firebase.auth().onAuthStateChanged(user => {
        unsb();
        if (!user && !pathname.includes('dra-redirect')) {
          this.props.history.push('/landing');
        }else if(user && !pathname.includes('admin') && !pathname.includes('zole/')){
          console.log('push 6');
          this.props.history.push('/');
        }
      });

      return;
    }

    if (hostname == 'dra.spelezoli.lv' || hostname == 'dra.dev.spelezoli.lv') {

      let authCodeText;
      let devMode;

      if (hostname == 'dra.dev.spelezoli.lv') {
        devMode = true;
      }

      try {
        const urlParams = new URLSearchParams(search);
        authCodeText = urlParams.get('dr_auth_code');
      } catch (err) {
        authCodeText = this.getParameterByName('dr_auth_code');
      }

      if (authCodeText && hostname.includes('dra')) {
        draugiemAuth(authCodeText, devMode).then((res) => {
        //  console.log('draugiem res');
        //  console.log(res);

          fetchUserData();
        });
      } else if (hostname.includes('dra')) {

        setTimeout(() => {
          let authCodeText2;

          const search2 = window.location.search;

          try {
            const urlParams = new URLSearchParams(search2);
            authCodeText2 = urlParams.get('dr_auth_code');
          } catch (err) {
            authCodeText2 = this.getParameterByName('dr_auth_code');
          }

          if (authCodeText2) {
            draugiemAuth(authCodeText2, devMode).then((res) => {
            //  console.log('draugiem res 2');
            //  console.log(res);

              fetchUserData();
            });
          }
        }, 1500);
      }
    }

    else if (hostname == 'fb.spelezoli.lv') {
      if (window.FB) {
        window.FB.getLoginStatus((response) => {
          this.checkLoginState(response);
        });
      } else {
        document.addEventListener('FBObjectReady', this.initializeFacebookLogin);
      }
    }

  }

  componentWillUnmount() {
    const { signOut } = this.props;
    signOut();
  }

  getParameterByName = (name, url) => {
    let url2;
    if (!url) {
      url2 = window.location.href;
    } else {
      url2 = url;
    }

    const name2 = name.replace(/[\[\]]/g, '\\$&');
    const regex = new RegExp(`[?&]${name2}(=([^&#]*)|&|#|$)`);

    const results = regex.exec(url2);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, ' '));
  }


  initializeFacebookLogin = () => {
    window.FB.getLoginStatus((response) => {
      this.checkLoginState(response);
    });
  }


  checkLoginState(event) {
    const { checkLogin, signOut, fetchUserData } = this.props;
    console.log('event');
    console.log(event);

    if (event.status === 'connected') {
      window.FB.api('/me', { fields: 'email' }, (response2) => {
        if (response2 && response2.email) {
          checkLogin(event, response2.email).then(() => {
            fetchUserData();
          });
        } else {
          checkLogin(event, null).then(() => {
            fetchUserData();
          });
        }
      });
    } else if (event.status === 'not_authorized') {
      signOut().then(() => {
        window.FB.login((response2) => {
          window.FB.api('/me', { fields: 'email' }, (response3) => {

            if (response3 && response3.email) {
              if (response2.authResponse) {
                checkLogin(response2, response3.email).then((res) => {
                  // Nothing?
                });
              } else {
                checkLogin(response2, response3.email).then((res) => {
                  // Nothing?
                });
              }
            } else {
              checkLogin(response2, null).then((res) => {
                // Nothing?
              });
            }
          });
        }, { scope: 'email' });
      });
    } else {
      signOut().then(() => {
        window.FB.login((response2) => {
          console.log(response2);

          window.FB.api('/me', { fields: 'email' }, (response3) => {

            if (response3 && response3.email) {
              if (response2.authResponse) {
                checkLogin(response2, response3.email).then((res) => {
                  // Nothing?
                });
              } else {
                checkLogin(response2, response3.email).then((res) => {
                  // Nothing?
                });
              }
            } else {
              checkLogin(response2, null).then((res) => {
                // Nothing?
              });
            }
          });
        }, { scope: 'email' });
      });
    }
  }

  render() {
    return (
      null
    );
  }
}

const mapStateToProps = state => ({
  member: state.member || {},
});

const mapDispatchToProps = {
  checkLogin: checkLoginState,
  getOffset: getTimeOffset,
  signOut: logout,
  removeOnDisconnect: removeUserOnDisconnect,
  initSmartLookApp: initSmartLook,
  setFailedLoginLog: failedLoginLog,
  fetchUserData: getUserData,
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Auth));
