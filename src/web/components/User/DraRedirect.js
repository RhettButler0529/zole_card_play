import React from 'react';
import { withRouter } from "react-router-dom";

class DraRedirect extends React.Component {
  static propTypes = {}
  static defaultProps = {}

  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {
    const { search } = window.location;

    let authCodeText;
    try {
        const urlParams = new URLSearchParams(search);
        authCodeText = urlParams.get('dr_auth_code');
    } catch (err) {
        authCodeText = this.getParameterByName('dr_auth_code');
    }

    const evt = document.createEvent('CustomEvent');
    evt.initCustomEvent('dr_auth_code', false, false, { dr_auth_code: authCodeText });
    window.opener.dispatchEvent(evt);
    window.close();
  }

  render() {
    return (
      null
    );
  }
}

export default DraRedirect;