import React, { Fragment, Suspense, lazy } from 'react';
import { Switch, Route } from 'react-router-dom';

import ReactNotification from 'react-notifications-component';
import 'react-notifications-component/dist/theme.css';

// Templates
import TemplateNothing from '../components/Templates/Nothing';
import TemplateAdmin from '../components/Templates/Admin';
import TemplateHome from '../components/Templates/Home';

// Routes
import Home from '../components/Home';

// import ForgotPasswordContainer from '../../containers/ForgotPassword';
// import ForgotPasswordComponent from '../components/User/ForgotPassword';

// import UpdateProfileContainer from '../../containers/UpdateProfile';
// import UpdateProfileComponent from '../components/User/UpdateProfile';


import Error from '../components/UI/Error';

import Auth from './Auth';

const ForgotPasswordContainer = lazy(() => import('../../containers/ForgotPassword'));
const ForgotPasswordComponent = lazy(() => import('../components/User/ForgotPassword'));

const LoginContainer = lazy(() => import('../../containers/Login'));
const LoginComponent = lazy(() => import('../components/User/Login'));

const SignUpContainer = lazy(() => import('../../containers/SignUp'));
const SignUpComponent = lazy(() => import('../components/User/SignUp'));

const AdminContainer = lazy(() => import('../../containers/Admin/Admin'));
const AdminPanelComponent = lazy(() => import('../components/Admin/AdminPanel'));

const ZoleContainer = lazy(() => import('../../containers/Game/Zole'));
const ZoleComponent = lazy(() => import('../components/Game/Zole'));

const MenuContainer = lazy(() => import('../../containers/Menu/Menu'));
const MenuComponent = lazy(() => import('../components/Menu/Menu'));

const DraRedirect = lazy(() => import('../components/User/DraRedirect'));



class Index extends React.Component {
  constructor(props) {
    super(props);
    this.showNotifications = this.showNotifications.bind(this);

    this.notificationDOMRef = React.createRef();
  }

  showNotifications = (title, message, type) => {
    this.notificationDOMRef.current.addNotification({
      title,
      message,
      type,
      insert: 'top',
      container: 'top-right',
      animationIn: ['animated', 'fadeIn'],
      animationOut: ['animated', 'fadeOut'],
      dismiss: { duration: 4000 },
      dismissable: { click: true },
    });
  }

  render() {
    return (
      <Fragment>
        <ReactNotification ref={this.notificationDOMRef} />
        <Auth />
        <Suspense fallback={<div></div>}>
        <Switch>
          <Route
            path="/zole/:id"
            render={props => (
              <TemplateNothing pageTitle="Zole">
                <ZoleContainer
                  {...props}
                  Layout={ZoleComponent}
                  showNotification={this.showNotifications}
                />
              </TemplateNothing>
            )}
          />

         <Route
            path="/dra-redirect"
            render={props => (
              <DraRedirect {...props} />
            )}
          />

         <Route
            path="/landing"
            render={props => (
              <TemplateHome pageTitle="Landing"> 
                <Home {...props} />
              </TemplateHome>
            )}
          />

          <Route
            path="/login"
            render={props => (
              <TemplateHome pageTitle="Login"  addClassName="login-container">
                <LoginContainer
                  {...props}
                  Layout={LoginComponent}
                />
              </TemplateHome>
            )}
          />

          <Route
            path="/forgot-password"
            render={props => (
              <TemplateHome pageTitle="Forgot password"  addClassName="forgot-pass-container">
                <ForgotPasswordContainer
                  {...props}
                  Layout={ForgotPasswordComponent}
                />
              </TemplateHome>
            )}
          />

          <Route
            path="/sign-up"
            render={props => (
              <TemplateHome pageTitle="Sign Up"  addClassName="sign-up-container">
                <SignUpContainer
                  {...props}
                  Layout={SignUpComponent}
                />
              </TemplateHome>
            )}
          />

          <Route
            path="/admin"
            render={props => (
              <TemplateAdmin pageTitle="Administration">
                <AdminContainer
                  {...props}
                  Layout={AdminPanelComponent}
                  showNotification={this.showNotifications}
                />
              </TemplateAdmin>
            )}
          />

          <Route
            path="/"
            render={props => (
              <TemplateNothing pageTitle="Menu">
                <MenuContainer
                  {...props}
                  Layout={MenuComponent}
                  showNotification={this.showNotifications}
                />
              </TemplateNothing>
            )}
          />

          <Route
            render={props => (
              <TemplateNothing pageTitle="404 - Page not found">
                <Error {...props} title="404" content="Sorry, the route you requested does not exist" />
              </TemplateNothing>
            )}
          />
        </Switch>
        </Suspense>
      </Fragment>
    );
  }
}

export default Index;
