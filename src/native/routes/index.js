import React, { Fragment } from 'react';
import { Scene, Tabs, Stack } from 'react-native-router-flux';
import { Icon } from 'native-base';

import DefaultProps from '../constants/navigation';
import AppConfig from '../../constants/config';

import SignUpContainer from '../../containers/SignUp';
import SignUpComponent from '../components/User/SignUp';

import LoginContainer from '../../containers/Login';
import LoginComponent from '../components/User/Login';

import ForgotPasswordContainer from '../../containers/ForgotPassword';
import ForgotPasswordComponent from '../components/User/ForgotPassword';

import MemberContainer from '../../containers/Member';
import ProfileComponent from '../components/User/Profile';

// import AboutComponent from '../components/About';

import ZoleContainer from '../../containers/Game/Zole';
import ZoleComponent from '../components/Game/Zole';

import MenuContainer from '../../containers/Menu/Menu';
import MenuComponent from '../components/Menu/Menu';

const Index = (
  <Fragment>
    {/*
    <Scene hideNavBar>
      <Tabs
        key="tabbar"
        swipeEnabled
        hideNavBar
        type="replace"
        showLabel={false}
        {...DefaultProps.tabProps}
      >
        <Stack
          key="menu"
          hideNavBar
          title={AppConfig.appName.toUpperCase()}
          icon={() => <Icon name="menu" {...DefaultProps.icons} />}
          {...DefaultProps.navbarProps}
        >
          <Scene key="menuScene" hideNavBar component={MenuContainer} Layout={MenuComponent} showNotification={null} />
        </Stack>

        <Stack
          key="zole"
          hideNavBar
          title={AppConfig.appName.toUpperCase()}
          icon={() => <Icon name="planet" {...DefaultProps.icons} />}
          {...DefaultProps.navbarProps}
        >
          <Scene key="zoleScene" hideNavBar component={ZoleContainer} Layout={ZoleComponent} showNotification={null} />
        </Stack>

        {/*  <Stack
          key="home"
          title={AppConfig.appName.toUpperCase()}
          icon={() => <Icon name="planet" {...DefaultProps.icons} />}
          {...DefaultProps.navbarProps}
        >
          <Scene key="home" component={AboutComponent} />
        </Stack>  *

        <Stack
          key="profile"
          title="PROFILE"
          icon={() => <Icon name="contact" {...DefaultProps.icons} />}
          {...DefaultProps.navbarProps}
        >
          <Scene key="profileHome" component={MemberContainer} Layout={ProfileComponent} />
          <Scene
            back
            key="signUp"
            title="SIGN UP"
            {...DefaultProps.navbarProps}
            component={SignUpContainer}
            Layout={SignUpComponent}
          />
          <Scene
            back
            key="login"
            title="LOGIN"
            {...DefaultProps.navbarProps}
            component={LoginContainer}
            Layout={LoginComponent}
          />
          <Scene
            back
            key="forgotPassword"
            title="FORGOT PASSWORD"
            {...DefaultProps.navbarProps}
            component={ForgotPasswordContainer}
            Layout={ForgotPasswordComponent}
          />
        </Stack>
      </Tabs>
    </Scene>

    */}

    <Scene
      key="menuScene"
      title="Menu"
      hideNavBar
      hideTabBar
      {...DefaultProps.navbarProps}
      component={MenuContainer}
      Layout={MenuComponent}
    />

    <Scene
      key="zoleScene"
      title="zole"
      hideNavBar
      hideTabBar
      {...DefaultProps.navbarProps}
      component={ZoleContainer}
      Layout={ZoleComponent}
    />
  </Fragment>
);

export default Index;
