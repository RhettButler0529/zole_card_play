import React from 'react';
import PropTypes from 'prop-types';
import { Col, Row } from 'reactstrap';
import { Splide, SplideSlide } from '@splidejs/react-splide';
import { withTranslation } from 'react-i18next';

import LanguageSelect from './UI/LanguageSelect';

import slide1Img from '../../images/landing-view/slide1.png';
import slide2Img from '../../images/landing-view/slide2.png';
import slide3Img from '../../images/landing-view/slide3.png';
import slide4Img from '../../images/landing-view/slide4.png';
import loginIconImg from '../../images/landing-view/login-icon.svg';

import logoImg from '../../images/Menu/zole_logo.png';

class Home extends React.Component {

  static propTypes = {
    t: PropTypes.func.isRequired,
    history: PropTypes.shape({
      push: PropTypes.func.isRequired,
    }).isRequired
  }

  constructor(props) {
    super(props);
    this.state = {
    };

    this.goToLogin = this.goToLogin.bind(this);
  }

  goToLogin(e) {
    e.preventDefault();
    const { history } = this.props;
    history.push('/login');
  }

  render() {

    const { t } = this.props;

    let slideHeight = 312;
    let slideWidth = 474;

    const fithScreenH = window.innerHeight / 4;

    if(fithScreenH < slideHeight){
      const scaleDown = fithScreenH / slideHeight;
      slideHeight = fithScreenH;
      slideWidth = slideWidth * scaleDown;
    }

    return (
      <div className="landing-container-body">
        <Row className="landing-header">
          <Col sm="10">
            <img className="landing-header-logo" src={logoImg} />
          </Col>
          <Col sm="2" className="landing-header-links">
            <a href="#" onClick={this.goToLogin}><img src={loginIconImg}/>{t('home.login')}</a>
          </Col>
        </Row>

        <div className="landing-content">
          <div className="landing-content-title">
            <h1>{t('home.cardGameZole')}</h1>
            <h3>{t('home.cardGameZolePopular')}</h3>

            <button onClick={this.goToLogin} className="common-button lite-shadow">{t('home.login')}</button>
          </div>
          <div className="landing-content-slider">
            <Splide
              options={ {
                type: 'loop',
                perPage: 1,
                gap: '20',
                width: (slideWidth * 3) + (30*2) + (slideWidth/2),
                autoplay: true,
                pauseOnHover : false,
                fixedWidth  : slideWidth,
                fixedHeight : slideHeight,
                isNavigation: false,
                gap         : 30,
                focus       : 'center',
                pagination  : false,
                //cover       : true,
                arrows: false,
                autoplay: true,
                trimSpace: false
              }}
            >
              <SplideSlide>
                <img className="slide-img" src={slide1Img} />
              </SplideSlide>
              <SplideSlide>
                <img className="slide-img" src={slide2Img} />
              </SplideSlide>
              <SplideSlide>
                <img className="slide-img" src={slide3Img} />
              </SplideSlide>
              <SplideSlide>
                <img className="slide-img" src={slide4Img} />
              </SplideSlide>

            </Splide>
          </div>

          <LanguageSelect />    

        </div>
       

      </div>
    );
  }
}

export default withTranslation('common')(Home);
