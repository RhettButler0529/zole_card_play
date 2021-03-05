import React from 'react';
import PropTypes from 'prop-types';

import Media from 'reactstrap/lib/Media';
import Button from 'reactstrap/lib/Button';
import Modal from 'reactstrap/lib/Modal';
import ModalHeader from 'reactstrap/lib/ModalHeader';
import ModalBody from 'reactstrap/lib/ModalBody';
import ModalFooter from 'reactstrap/lib/ModalFooter';

import ScoreTable from '../../../containers/Game/ScoreTable';

import closeImg from '../../../images/icons/close.png';
import leaderboardImg from '../../../images/icons/leaderboard.png';

const EndResultModal = React.memo(({ roomId, leaveRoom, t, playButtonSound }) => {
  return (
    <div>
      <Modal isOpen={true} toggle={leaveRoom} className="end-result-modal">
        <ModalHeader toggle={leaveRoom}
          className="end-result-modal-header"
          close={
            <Media src={closeImg} className="notification-header-close" alt="X" onClick={() => { playButtonSound(); leaveRoom();}} />
          }
        >
          <Media className="end-result-modal-header-image" src={leaderboardImg}/>
          <div className="end-result-modal-header-text">Rezultāti </div>
        </ModalHeader>
        <ModalBody className="end-result-modal-body">
          <ScoreTable
            roomId={roomId}
            scoreTableOpen={true}
          />
        </ModalBody>
        <ModalFooter className="end-result-modal-footer">
          <Button className="end-result-modal-footer-button" onClick={() => { playButtonSound(); leaveRoom();}}>
            Labi
          </Button>
        </ModalFooter>
      </Modal>
    </div>
  )}
);

EndResultModal.propTypes = {
  roomId: PropTypes.string,
  leaveRoom: PropTypes.func.isRequired,
  playButtonSound: PropTypes.func.isRequired,
};

EndResultModal.defaultProps = {
  roomId: null,
};

export default EndResultModal;
