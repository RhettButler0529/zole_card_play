import React from 'react';
import PropTypes from 'prop-types';

/* import {
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Media,
} from 'reactstrap'; */

import Modal from 'reactstrap/lib/Modal';
import ModalHeader from 'reactstrap/lib/ModalHeader';
import ModalBody from 'reactstrap/lib/ModalBody';
import ModalFooter from 'reactstrap/lib/ModalFooter';
import Media from 'reactstrap/lib/Media';
import Button from 'reactstrap/lib/Button';

import closeImg from '../../../../images/icons/close.png';

const LastRoundModal = React.memo(({ t, lastRoundModal, closeLastRound, lastRoundFunction }) => (
  <Modal isOpen={lastRoundModal} toggle={closeLastRound} className="notification">
    <ModalHeader
      className="notification-header"
      close={
        <Media src={closeImg} className="notification-header-close" alt="X" onClick={closeLastRound} />
      }
    />
    <ModalBody className="notification-body" style={{ fontSize: 28 }}>
      {t('lastRoundConfirm')}
    </ModalBody>
    <ModalFooter className="notification-footer">
      <Button className="btn notification-footer-button" onClick={lastRoundFunction}>
        {t('yes')}
      </Button>
      <Button type="button" className="btn notification-footer-button" onClick={closeLastRound}>
        {t('no')}
      </Button>
    </ModalFooter>
  </Modal>
));

LastRoundModal.propTypes = {
  lastRoundModal: PropTypes.bool,
  closeLastRound: PropTypes.func.isRequired,
  lastRoundFunction: PropTypes.func.isRequired,
};

LastRoundModal.defaultProps = {
  lastRoundModal: false,
};

export default LastRoundModal;
