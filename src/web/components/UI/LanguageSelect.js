import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { withTranslation } from 'react-i18next';

import Col from 'reactstrap/lib/Col';
import Media from 'reactstrap/lib/Media';
import Dropdown from 'reactstrap/lib/Dropdown';
import DropdownToggle from 'reactstrap/lib/DropdownToggle';
import DropdownMenu from 'reactstrap/lib/DropdownMenu';
import DropdownItem from 'reactstrap/lib/DropdownItem';

import lvFlag from '../../../images/flags/lv.png';
import ruFlag from '../../../images/flags/ru.png';
import enFlag from '../../../images/flags/en.png';

  const languagesList = ['lv', 'ru', 'en'];

class LanguageSelect extends Component {
  static propTypes = {
    userSettings: PropTypes.shape(),
    changeSound: PropTypes.func,
  }

  static defaultProps = {
    match: null,
    history: {},
  }

  constructor(props) {
    super(props);
    this.state = {
      selectorOpen: false,
      curLang: null,
    };
  }

  componentDidMount () {
    const { i18n } = this.props;

    const curLang = i18n.language;

    this.setState({ curLang: curLang || 'lv' });
  }

/*
  componentDidUpdate (nextProps, nextState) {
    const { i18n } = nextProps;
    const { prevCurLang } = nextState;

    const curLang = i18n.language;

    if (prevCurLang !== curLang) {
      this.setState({ curLang: curLang || 'lv' });
    }
  } */

  toggleLanguage = (lang) => {
    const { i18n } = this.props;

    this.setState({ curLang: lang });

    i18n.changeLanguage(lang);
    if (window && window.localStorage && window.localStorage.setItem) {
      localStorage.setItem('language', lang);
    }
  }

  toggleLanguageSelector = () => {
    this.setState(prevState => ({
      selectorOpen: !prevState.selectorOpen,
    }));
  }

  renderLanguage = (lang) => {
    if (lang === 'lv') {
      return <Media src={lvFlag} className="language-image" />
    } else if (lang === 'ru') {
      return <Media src={ruFlag} className="language-image" />
    } else if (lang === 'en') {
      return <Media src={enFlag} className="language-image" />
    }
  }

  render = () => {
    const {
      userSettings,
      i18n,
    } = this.props;

    const { selectorOpen, curLang } = this.state;

    if (!curLang) {
      return null;
    }

    let soundOn = false;

    return (
      <div className="language">
      <Col className="language-select">
        <Dropdown isOpen={selectorOpen} toggle={this.toggleLanguageSelector}>
          <DropdownToggle caret>
              {this.renderLanguage(curLang)}
            </DropdownToggle>
          <DropdownMenu>
            {languagesList.map((langKey) => {
              return <DropdownItem key={langKey} onClick={(e) => {this.toggleLanguage(langKey)}}>{this.renderLanguage(langKey)}</DropdownItem>
            })}
          </DropdownMenu>
        </Dropdown>
      </Col>
      </div>
    );
  }
}

export default withTranslation('common')(LanguageSelect);
