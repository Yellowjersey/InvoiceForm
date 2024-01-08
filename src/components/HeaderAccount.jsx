import React, { useEffect, useState } from 'react';
import { MdKeyboardArrowDown } from 'react-icons/md';
import Modal from './Modal';
import SettingsModal from './SettingsModal';
import { supabase } from '../supabase/supabase';
import { useNavigate } from 'react-router-dom';

function HeaderAccount({
  setShowModal,
  showModal,
  logout,
  userAccount,
  setUUID,
  setUser,
  setIsLoggingOutandIn,
  setUserAccount,
  showToastMessage,
}) {
  const [shouldLogout, setShouldLogout] = useState(false);
  const navigate = useNavigate();

  function toggleModal() {
    setShowModal(!showModal);
  }

  // Inside your component

  useEffect(() => {
    if (shouldLogout) {
      navigate('/login', { replace: true });
    }
  }, [shouldLogout]);

  async function logout() {
    setIsLoggingOutandIn(true);
    supabase.auth
      .signOut()
      .then(() => {
        setUser(null);
        showToastMessage('signOut');
        setIsLoggingOutandIn(false);
        setShouldLogout(true);
        setUserAccount('');
        setUUID('');
      })
      .catch((error) => {
        console.error('Error signing out:', error);
        setIsLoggingOutandIn(false);
      });
  }

  const uppercaseEmail = userAccount?.email
    ? userAccount?.email?.charAt(0)?.toUpperCase() +
      userAccount?.email?.slice(1)
    : '';

  return (
    <div className="headeraccount">
      <div>
        <img
          src={userAccount?.user_image}
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

export default React.memo(HeaderAccount);
