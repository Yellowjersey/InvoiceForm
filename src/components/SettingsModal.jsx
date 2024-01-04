import { useRef } from 'react';

export default function SettingsModal({ swapModal, logout, uppercaseEmail }) {
  const modalRef = useRef();
  function handleClick(e) {
    logout();
    if (e.target === modalRef.current) {
      swapModal(false);
    }
  }

  return (
    <div className="settingsModalContent">
      {/* <h1 className="settingsUsername">Name: Gavin Bradford</h1> */}
      <h2 className="settingsEmail">Email: {uppercaseEmail}</h2>
      <button
        onClick={(e) => handleClick(e)}
        ref={modalRef}
        className="settingsButton"
      >
        Log Out
      </button>
    </div>
  );
}
