import { useState } from 'react';
import EditClientModal from './EditClientModal';

export default function ClientCard({
  clientName,
  clientAddress,
  clientPhone,
  clientEmail,
  clientId,
  clientNotes,
  clientImg,
  clientRate,
  isHourly,
  clients,
  setUpdatedClient,
  updatedClient,
  editedClient,
  setEditedClient,
  clientBalance,
}) {
  const [editClient, setEditClient] = useState(false);

  function handleClientClick(e) {
    console.log(clientId);
    if (e.target.className === 'clientCard') {
      setEditClient(!editClient);
    }
  }

  return (
    <>
      {editClient ? (
        <EditClientModal
          clients={clients}
          setEditedClient={setEditedClient}
          editedClient={editedClient}
          setUpdatedClient={setUpdatedClient}
          updatedClient={updatedClient}
          name={clientName}
          address={clientAddress}
          phone={clientPhone}
          email={clientEmail}
          id={clientId}
          note={clientNotes}
          img={clientImg}
          rate={clientRate}
          hour={isHourly}
          setEditClient={setEditClient}
          clientBalance={clientBalance}
        />
      ) : null}

      <div
        className="clientCard"
        key={clientId}
        onClick={(e) => {
          handleClientClick(e);
        }}
      >
        <div className="client">
          <div className="clientImgContainer">
            <img src={clientImg} />
          </div>
          <h2 className="clientName">Name: {clientName}</h2>
          <h3 className="clientAddress">Address: {clientAddress}</h3>
          <h3 className="clientPhone">Phone Number: {clientPhone}</h3>
          <h3 className="clientEmail">Email: {clientEmail}</h3>
          <p className="clientNotes">Notes: {clientNotes}</p>

          <h3 className="clientPay">
            Rate: $ {clientRate} {isHourly ? <p>/hr</p> : <p>/wk</p>}
          </h3>
          {/* <div>
            <input
            id="isHourly"
              type="checkbox"
              className="checkBox"
              checked={isHourly}
              disabled
              />
              <label htmlFor="isHourly">Hourly</label>
            </div> */}
          <h4 className="clientBalance">Balance: $ {clientBalance}</h4>
        </div>
      </div>
    </>
  );
}
