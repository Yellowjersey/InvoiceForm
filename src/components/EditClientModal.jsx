import React, { useState } from 'react';

function EditClientModal({
  name: initialName,
  address: initialAddress,
  phone: initialPhone,
  email: initialEmail,
  id: initialId,
  note: initialNote,
  img: initialImg,
  rate: initialRate,
  hour: initialHour,
  setEditClient,
  setUpdatedClient,
  updatedClient,
  editedClient,
  setEditedClient,
}) {
  const [clientName, setClientName] = useState(initialName);
  const [clientAddress, setClientAddress] = useState(initialAddress);
  const [clientPhone, setClientPhone] = useState(initialPhone);
  const [clientEmail, setClientEmail] = useState(initialEmail);
  const [clientId, setClientId] = useState(initialId);
  const [clientNotes, setClientNotes] = useState(initialNote);
  const [clientImg, setClientImg] = useState(initialImg);
  const [clientRate, setClientRate] = useState(initialRate);
  const [isHourly, setIsHourly] = useState(initialHour);

  function handleUpdate(e) {
    e.preventDefault();

    const changeClient = {
      clientName,
      clientAddress,
      clientPhone,
      clientEmail,
      clientId,
      clientNotes,
      clientImg,
      clientRate,
      isHourly,
    };

    const updatedClients = updatedClient.map((client) => {
      if (client.clientId === clientId) {
        return changeClient;
      } else {
        return client;
      }
    });

    setEditClient(false);
  }

  return (
    <div className="editClientModal">
      <form
        className="editClientModalContent"
        key={clientId}
        onSubmit={(e) => handleUpdate(e)}
      >
        <h1>Edit {initialName}'s Profile</h1>
        <h3>Upload a new image</h3>
        <input
          type="file"
          placeholder={clientImg}
          id="img"
          onChange={(e) => setClientImg(e.target.value)}
        />
        <h3>Update {initialName}'s information</h3>
        <input type="hidden" value={clientId} id="id" />
        <label htmlFor="name">Name</label>
        <input
          type="text"
          placeholder={clientName}
          id="clientName"
          value={clientName}
          onChange={(e) => setClientName(e.target.value)}
        />
        <label htmlFor="address">Address</label>
        <input
          type="text"
          placeholder={clientAddress}
          id="address"
          value={clientAddress}
          onChange={(e) => setClientAddress(e.target.value)}
        />
        <label htmlFor="phone">Phone</label>
        <input
          type="text"
          placeholder={clientPhone}
          id="phone"
          value={clientPhone}
          onChange={(e) => setClientPhone(e.target.value)}
        />
        <label htmlFor="email">Email</label>
        <input
          type="text"
          placeholder={clientEmail}
          id="email"
          value={clientEmail}
          onChange={(e) => setClientEmail(e.target.value)}
        />
        <label htmlFor="note">Notes</label>
        <input
          type="text"
          placeholder={clientNotes}
          id="note"
          value={clientNotes}
          onChange={(e) => setClientNote(e.target.value)}
        />
        <label htmlFor="rate">Rate</label>
        <input
          type="number"
          placeholder={clientRate}
          id="rate"
          value={clientRate}
          onChange={(e) => setClientRate(e.target.value)}
        />

        <div className="hourlyEditDiv">
          <input
            type="checkbox"
            id="hourly"
            checked={isHourly ? true : false}
            onChange={(e) => {
              setIsHourly(isHourly ? false : true);
            }}
          />
          <label htmlFor="hourly">Hourly</label>
        </div>
        <button>Submit</button>
      </form>
    </div>
  );
}

export default EditClientModal;
