import { useState } from 'react';
import HeaderAccount from './HeaderAccount';

export default function Header() {
  const [showModal, setShowModal] = useState(false);

  return (
    <div className="header">
      <HeaderAccount setShowModal={setShowModal} showModal={showModal} />
    </div>
  );
}
