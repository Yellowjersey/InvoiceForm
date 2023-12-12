import { useRef } from 'react';

export default function SettingsModal({ swapModal }) {
  const modalRef = useRef();
  function handleClick(e) {
    if (e.target === modalRef.current) {
      swapModal(false);
    }
  }

  return (
    <div>
      <h1>Gavin Bradford</h1>
      <h2>Bradfordgavin@gmail.com</h2>
      <button onClick={(e) => handleClick(e)} ref={modalRef}>
        Log Out
      </button>
    </div>
  );
}
