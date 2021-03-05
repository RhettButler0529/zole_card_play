import React from 'react';
import PropTypes from 'prop-types';

import { connect } from 'react-redux';

import axios from 'axios';
import { Firebase } from '../../lib/firebase';


import { checkLoginState, draugiemAuth, getTimeOffset } from '../../actions/member';

class Auth extends React.Component {
  static propTypes = {
    checkLogin: PropTypes.func.isRequired,
  }

  constructor(props) {
    super(props);
    this.state = {
    //  data: {},
    };

    this.checkLoginState = this.checkLoginState.bind(this);
  //  this.initializeFacebookLogin = this.initializeFacebookLogin.bind(this);
  }

  componentDidMount() {
    console.log('componentDidMount');

    const { getOffset } = this.props;
    getOffset().then((res) => {
      console.log(res);
    });

    //  console.log(window.location);
    //  console.log(window.location.search);

    const url = window.location.href;
    const queryString = url ? url.split('?').pop() : window.location.search.slice(1);

    console.log(queryString);

    const split = queryString.split('&');
    //  console.log(split[1]);
    const authCodeText = split && split[1] ? split[1].split('=') : {};
    console.log(authCodeText);
    console.log(authCodeText[1]);

    //  const draugiem_callback_url = `${process.env.PUBLIC_URL}//callback.html`;
    //  console.log(draugiem_callback_url);

    //  axios.post(`https://api.draugiem.lv/json/?app=036d5df434cf94205e2dc8cd4c9f27d4&code=${authCodeText[1]}&action=authorize`, { app: '036d5df434cf94205e2dc8cd4c9f27d4', code: authCodeText[1], action: 'authorize' })
    //    .then((res) => {
    //      console.log(res);
    //      console.log(res.data);
    //    });
    if (authCodeText[1]) {
      draugiemAuth(authCodeText[1]);
    }

    /*
    const proxyurl = 'https://cors-anywhere.herokuapp.com/';
    const url2 = `https://api.draugiem.lv/json/?app=036d5df434cf94205e2dc8cd4c9f27d4&code=${authCodeText[1]}&action=authorize`;


    axios.get(proxyurl + url2)
      .then((res) => {
        console.log(res);
        console.log(res.data);
      });
      */

    //  axios.get(proxyurl + url2)
    //    .then((res) => {
    //      console.log(res);
    //      console.log(res.data);
    //    });

    //  axios.get(`https://api.draugiem.lv/json/?app=036d5df434cf94205e2dc8cd4c9f27d4&code=${authCodeText[1]}&action=authorize`, { app: '036d5df434cf94205e2dc8cd4c9f27d4', code: authCodeText[1], action: 'authorize' })
    //    .then((res) => {
    //      console.log(res);
    //      console.log(res.data);
    //    });

    /*
    <Get url="https://api.draugiem.lv/json" params={{app: "036d5df434cf94205e2dc8cd4c9f27d4", code: authCodeText[1], action: 'authorize'}}>
        {(error, response, isLoading, makeRequest, axios) => {
          if(error) {
            return (<div>Something bad happened: {error.message} <button onClick={() => makeRequest({ params: { reload: true } })}>Retry</button></div>)
          }
          else if(isLoading) {
            return (<div>Loading...</div>)
          }
          else if(response !== null) {
            return (<div>{response.data.message} <button onClick={() => makeRequest({ params: { refresh: true } })}>Refresh</button></div>)
          }
          return (<div>Default message before request is made.</div>)
        }}
      </Get>

      */

    /*

    fetch(`https://api.draugiem.lv/json/?app=036d5df434cf94205e2dc8cd4c9f27d4&code=${authCodeText[1]}&action=authorize`, {
      type: 'GET',
      headers: {
        'Access-Control-Allow-Credentials': true,
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET',
        'Access-Control-Allow-Headers': 'application/json',
      },
    })
      .then((response) => {
        console.log(response);
        return response.text();
      })
      .then((data) => {
        console.log(data);
      })
      .catch((error) => {
        console.log(error);
      });
      */

    //  document.addEventListener('FBObjectReady', this.initializeFacebookLogin);

    if (window.FB) {
      console.log('has window FB');
      window.FB.getLoginStatus((response) => {
        console.log('window.FB response');
        console.log(response);

        //      window.FB.api('/me', { fields: 'email' }, (response2) => {
        //        console.log(response2);
        //        console.log(`Successful login for: ${response2.email}`);
        //      });

        //  window.FB.api('/me?fields=id,name,email', (response2) => {
        //    console.log(response2);
        //  });

        this.checkLoginState(response);
      });
    //  });
    } else {
      console.log('has NO window FB');
      //  document.addEventListener('FBObjectReady', this.initializeFacebookLogin);
    }

    Firebase.auth().onAuthStateChanged((user) => {
      if (!user) {
        console.log('no user');
      } else {
        console.log('******************* user ***************************');
        console.log(user);
        const { uid } = Firebase.auth().currentUser;

        //  const myConnectionsRef = Firebase.database().ref(`status/${uid}/connections`);

        //  const ref = Firebase.database().ref(`status/${uid}`);

        const statusRef = Firebase.database().ref(`status/${uid}/status`);

        //  const lastOnlineRef = Firebase.database().ref(`status/${uid}/lastOnline`);

        const connectedRef = Firebase.database().ref('.info/connected');
        connectedRef.on('value', (snap) => {
          if (snap.val() === true) {
          //  Firebase.database().ref(`status/${uid}`).onDisconnect().update({
          //    connections: null,
          //  });

            //    const date = Date.now();

            //    Firebase.database().ref(`status/${uid}/connections/${date}`).onDisconnect().remove();

            //    Firebase.database().ref(`status/${uid}/connections/${date}`).update({
            //      connected: true,
            //      timeOpened: Firebase.database.ServerValue.TIMESTAMP,
            //    });

            Firebase.database().ref(`status/${uid}`).onDisconnect().update({
              status: false,
              lastOnline: Firebase.database.ServerValue.TIMESTAMP,
            });

            Firebase.database().ref(`status/${uid}`).update({
              status: true,
            });
          } else {
            console.log('no connection');
          }
        });

        statusRef.on('value', (snap) => {
          const status = snap.val();

          console.log('****************** status *******************');
          console.log(status);

          if (!status) {
            console.log('*********** NO STATUS ******************');
            connectedRef.once('value', (snap2) => {
              if (snap2.val() === true) {
                Firebase.database().ref(`status/${uid}`).onDisconnect().update({
                  status: false,
                  lastOnline: Firebase.database.ServerValue.TIMESTAMP,
                });

                Firebase.database().ref(`status/${uid}`).update({
                  status: true,
                });
              }
            });
          } else {
            console.log('already has connections');
          }
        });

        /*    statusRef.on('value', (snap) => {
          const status = snap.val();

          console.log(status);

          connectedRef.once('value', (snap2) => {
            if (snap2.val() === true) {
              if (status && !status.connections) {
                console.log('status has no connections');
                const con = myConnectionsRef.push();

                ref.onDisconnect().update({
                  connections: null,
                });

                con.set({ connected: true, timestamp: Firebase.database.ServerValue.TIMESTAMP });
              } else {
                console.log('already has connections');
              }
            }
          });
        }); */
      }
    });
  }

  componentWillUnmount() {
  //  document.removeEventListener('FBObjectReady', this.initializeFacebookLogin);
  }

  /*

  initializeFacebookLogin = () => {
    console.log('initializeFacebookLogin');
    window.FB.getLoginStatus((response) => {
      console.log(response);

      this.checkLoginState(response);
    });
  }

  */

  checkLoginState(event) {
    console.log('checkLoginState');
    const { checkLogin } = this.props;

    if (event.status === 'connected') {
      window.FB.api('/me', { fields: 'email' }, (response2) => {
        console.log(response2);

        if (response2 && response2.email) {
          checkLogin(event, response2.email).then(() => {
          });
        } else {
          checkLogin(event, null).then(() => {
          });
        }
      });
    } else if (event.status === 'not_authorized') {
      window.FB.login((response2) => {
        console.log(response2);

        window.FB.api('/me', { fields: 'email' }, (response3) => {
          console.log(response3);

          if (response3 && response3.email) {
            if (response2.authResponse) {
              checkLogin(response2, response3.email).then((res) => {
                console.log(res);
              });
            } else {
              checkLogin(response2, response3.email).then((res) => {
                console.log(res);
              });
            }
          } else {
            checkLogin(response2, null).then((res) => {
              console.log(res);
            });
          }
        });
      }, { scope: 'email' });
    } else {
      window.FB.login((response2) => {
        console.log(response2);

        window.FB.api('/me', { fields: 'email' }, (response3) => {
          console.log(response3);

          if (response3 && response3.email) {
            if (response2.authResponse) {
              checkLogin(response2, response3.email).then((res) => {
                console.log(res);
              });
            } else {
              checkLogin(response2, response3.email).then((res) => {
                console.log(res);
              });
            }
          } else {
            checkLogin(response2, null).then((res) => {
              console.log(res);
            });
          }
        });
      }, { scope: 'email' });


    //  checkLogin(event, null).then((res) => {
    //    console.log(res);
    //  });
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
};

export default connect(mapStateToProps, mapDispatchToProps)(Auth);
