import { useState } from 'react';
import HeaderAccount from './HeaderAccount';

export default function Header({
  logout,
  userAccount,
  setUserAccount,
  setUUID,
  showToastMessage,
  setIsLoggingOutandIn,
  setUser,
}) {
  const [showModal, setShowModal] = useState(false);

  return (
    <div className="header">
      <HeaderAccount
        logout={logout}
        setShowModal={setShowModal}
        showModal={showModal}
        userAccount={userAccount}
        setUserAccount={setUserAccount}
        setUUID={setUUID}
        showToastMessage={showToastMessage}
        setIsLoggingOutandIn={setIsLoggingOutandIn}
        setUser={setUser}
      />
    </div>
  );
}
