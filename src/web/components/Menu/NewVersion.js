import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { withTranslation } from 'react-i18next';

import Button from 'reactstrap/lib/Button';
import Media from 'reactstrap/lib/Media';
import Modal from 'reactstrap/lib/Modal';
import ModalHeader from 'reactstrap/lib/ModalHeader';
import ModalBody from 'reactstrap/lib/ModalBody';
import ModalFooter from 'reactstrap/lib/ModalFooter';


import closeImg from '../../../images/icons/close.png';

class NewVersion extends React.Component {
    static propTypes = {
      member: PropTypes.shape().isRequired,
      t: PropTypes.func.isRequired,
      closeNewVersionModal: PropTypes.func.isRequired
    }

    static defaultProps = {
      member: {}
    }

    constructor(props) {
      super(props);
      this.state = {
        version: 0.20
      };

      this.closeModal = this.closeModal.bind(this);
    }

    closeModal(){
        const { closeNewVersionModal } = this.props;
        const { version } = this.state;
        closeNewVersionModal(version);
    }

    render() {

        const { member, t } = this.props;
        const { version } = this.state;

        if(!member || member.newVersion >= version){
            return null;
        }

        return (
          <Modal isOpen={true} size="lg" className="notification new-version-modal">
            <ModalHeader
                toggle={this.closeModal}
                className="notification-header"
                close={
                <Media src={closeImg} className="notification-header-close" alt="X" onClick={this.closeModal} />
                }
            >
            </ModalHeader>
            <ModalBody className="notification-body">
                <h2>Dārgie spēlētāji!</h2>
                <p>Ņemot vērā vairākus saņemtos ieteikumus un lūgumus, pēdējo nedēļu laikā esam veikuši vairākus uzlabojumus un izmaiņas spēlē:</p>
                <ul>
                    <li>kopējā istabas skatā izmainīts izkārtojums, lai visi spēles veidi ir pieejami uzreiz (un nevis paslēpti izvēlnē), un katrai istabai ir tikai viena poga 'Ienākt';</li>
                    <li>tiek rādīts online esošo spēlētāju un aktīvo istabu skaits;</li>
                    <li>mainīts pogu izkārtojums ekrāna lejas daļā;</li>
                    <li>salabotas emociju pogas un to attēlošana istabas skatā;</li>
                    <li>uzlabots partijas nobeiguma logs;</li>
                    <li>jauni attēli emocijām un dāvanām;</li>
                    <li>tiek rādīts trūkstošās naudas apjoms, pievienojoties istabai;</li>
                    <li>izlabota kļūda līmeņu aprēķinā;</li>
                    <li>papildināta Palīdzība ar sadaļu par līmeņiem un to aprēķināšanu;</li>
                    <li>uzlabota nākamā līmeņa prasību attēlošana sadaļā Mans Info;</li>
                    <li>pabeigta sadaļā Sasniegumi (attēli un balvas);</li>
                    <li>ja čatā ir jauna ziņa, tiek rādīta attiecīga ikona pie čata pogas;</li>
                    <li>ieviesta iespēja ieslēgt/izslēgt spēles skaņas;</li>
                    <li>izlabotas vairākas maznozīmīgas kļūdas un problēmas.</li>
                </ul>
                <p>Aktīvi strādājam pie labojumiem saistībā ar istabu uzkāršanos (dažreiz nevar iziet ar kārti, tiek piešķirts nepamatots zaudējums vai nokavēts gājiens u.tml.). Tāpat arī turpinās darbs pie mobilo aplikāciju izstrādādes iOS un Android telefoniem/planšetēm.</p>
                <p>Jūsu Zoles administrācija</p>
            </ModalBody>
            <ModalFooter className="notification-footer">
                <Button className="notification-footer-button" color="primary" onClick={this.closeModal}>{t('ok')}</Button>
            </ModalFooter>
          </Modal>
        );
    }
}

export default withTranslation('common')(NewVersion);
