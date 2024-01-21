import { useState } from 'react';

function ClientPropertyImageModal({
  clientPropertyImages,
  showClientPropertyImageModal,
  setShowClientPropertyImageModal,
}) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  return (
    <div className="clientPropertyImageModal">
      <div className="clientPropertyImageModalContainer">
        <div className="clientPropertyImageModalHeader">
          <h2>Property Images</h2>
          <button className="closeModalButton">X</button>
        </div>
        <div className="clientPropertyImageModalBody">
          <img src={clientPropertyImages[currentImageIndex]} />
        </div>
      </div>
    </div>
  );
}

export default ClientPropertyImageModal;
