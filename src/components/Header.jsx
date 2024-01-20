import { useState } from 'react';
import HeaderAccount from './HeaderAccount';

export default function Header({
  setIsLoginPage,
  userAccount,
  setUserAccount,
  setUUID,
  showToastMessage,
  setIsLoggingOutandIn,
  setUser,
  user,
}) {
  const [showModal, setShowModal] = useState(false);

  return (
    <div className="header">
      <HeaderAccount
        setIsLoginPage={setIsLoginPage}
        setShowModal={setShowModal}
        showModal={showModal}
        userAccount={userAccount}
        setUserAccount={setUserAccount}
        setUUID={setUUID}
        showToastMessage={showToastMessage}
        setIsLoggingOutandIn={setIsLoggingOutandIn}
        setUser={setUser}
        user={user}
      />
    </div>
  );
}
