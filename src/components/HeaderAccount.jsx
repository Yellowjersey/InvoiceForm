import { MdKeyboardArrowDown } from 'react-icons/md';
import Modal from './Modal';
import SettingsModal from './SettingsModal';
import { supabase } from '../supabase/supabase';
import { useEffect } from 'react';

export default function HeaderAccount({
  setShowModal,
  showModal,
  logout,
  userAccount,
}) {
  function toggleModal() {
    setShowModal(!showModal);
  }

  const uppercaseEmail =
    userAccount.email.charAt(0).toUpperCase() + userAccount.email.slice(1);

  return (
    <div className="headeraccount">
      <div>
        <img
          src={userAccount.user_image}
          className="headeraccount-avatar"
          alt="avatar"
        />
      </div>
      {showModal && (
        <Modal
          swapModal={toggleModal}
          className={'settingsModal'}
          ModalForm={
            <SettingsModal
              logout={logout}
              swapModal={toggleModal}
              uppercaseEmail={uppercaseEmail}
            />
          }
        />
      )}
      <div className="header-text-Container">
        <div className="headeraccount-text">Welcome Back!</div>
        <div className="headeraccount-name">{uppercaseEmail}</div>
      </div>
      <div onClick={() => toggleModal()} className="headeraccount-arrow">
        <MdKeyboardArrowDown />
      </div>
    </div>
  );
}
