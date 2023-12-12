import { MdKeyboardArrowDown } from 'react-icons/md';
import Modal from './Modal';
import SettingsModal from './SettingsModal';

export default function HeaderAccount({ setShowModal, showModal }) {
  function toggleModal() {
    setShowModal(!showModal);
  }

  return (
    <div className="headeraccount">
      <div>
        <img
          src="./GavinAvatar.jpg"
          className="headeraccount-avatar"
          alt="avatar"
        />
      </div>
      {showModal && (
        <Modal
          swapModal={toggleModal}
          className={'settingsModal'}
          ModalForm={<SettingsModal swapModal={toggleModal} />}
        />
      )}
      <div className="header-text-Container">
        <div className="headeraccount-text">Welcome Back!</div>
        <div className="headeraccount-name">Gavin</div>
      </div>
      <div onClick={() => toggleModal()} className="headeraccount-arrow">
        <MdKeyboardArrowDown />
      </div>
    </div>
  );
}
