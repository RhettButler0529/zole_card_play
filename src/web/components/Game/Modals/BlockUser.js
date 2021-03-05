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

const BlockUserModal = React.memo(({
  t, blockUserModal, blockUserSelectedName, toggleBlockUser, blockUserFunction,
}) => (
  <Modal isOpen={blockUserModal} toggle={() => toggleBlockUser(null, null)} className="notification">
    <ModalHeader
      toggle={() => toggleBlockUser(null, null)}
      className="notification-header"
      close={
        <Media src={closeImg} className="notification-header-close" alt="X" onClick={() => toggleBlockUser(null, null)} />
      }
    />
    <ModalBody className="notification-body" style={{ fontSize: 28 }}>
      {t('blockPlayerConfirm', { player: blockUserSelectedName })}
    </ModalBody>
    <ModalFooter className="notification-footer">
      <Button className="btn notification-footer-button" onClick={blockUserFunction}>
        {t('yes')}
      </Button>
      <Button type="button" className="btn notification-footer-button" onClick={() => toggleBlockUser(null, null)}>
        {t('no')}
      </Button>
    </ModalFooter>
  </Modal>
));

BlockUserModal.propTypes = {
  blockUserModal: PropTypes.bool,
  blockUserSelectedName: PropTypes.string,
  toggleBlockUser: PropTypes.func.isRequired,
  blockUserFunction: PropTypes.func.isRequired,
};

BlockUserModal.defaultProps = {
  blockUserModal: false,
  blockUserSelectedName: null,
};

export default BlockUserModal;
