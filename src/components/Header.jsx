import { useState } from 'react';
import HeaderAccount from './HeaderAccount';

export default function Header({ logout }) {
  const [showModal, setShowModal] = useState(false);

  return (
    <div className="header">
      <HeaderAccount
        logout={logout}
        setShowModal={setShowModal}
        showModal={showModal}
      />
    </div>
  );
}
