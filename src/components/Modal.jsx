import { useRef } from 'react';

export default function Modal({ ModalForm, swapModal, className }) {
  const modalRef = useRef();

  const handleClick = (event) => {
    if (event.target === modalRef.current) {
      swapModal();
    }
  };

  return (
    <div className="modal" onClick={handleClick} ref={modalRef}>
      <div className={className}>{ModalForm}</div>
    </div>
  );
}
