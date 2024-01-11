import { useEffect, useState } from 'react';
import ClientCard from '../components/ClientCard';
import Modal from '../components/Modal';
import AddClientForm from '../components/AddClientForm';
import { HiMiniPlusCircle } from 'react-icons/hi2';

export default function Clients({
  clients,

  clientDataQueryForUUID,
  UUID,
  setClientsUpdated,
  showModal,
  setShowModal,
  swapModal,
  editClient,
  setEditClient,
  user,
  setClients,
}) {
  const [editedClient, setEditedClient] = useState([]);

  function openAddClientForm() {
    setShowModal(true);
    <Modal
      className={'modal-content'}
      ModalForm={
        <AddClientForm
          closeModal={setShowModal}
          UUID={UUID}
          clientDataQueryForUUID={clientDataQueryForUUID}
          setClientsUpdated={setClientsUpdated}
          setClients={setClients}
        />
      }
      swapModal={swapModal}
    />;
  }

  return (
    <div>
      {clients?.length > 0 ? (
        <div className="clients">
          {clients.map((client) => {
            return (
              <ClientCard
                editedClient={editedClient}
                setEditedClient={setEditedClient}
                setClientsUpdated={setClientsUpdated}
                clientId={client.client_UUID}
                key={client.client_UUID}
                clientName={client.client_name}
                clientAddress={client.client_address}
                clientPhone={client.client_phone}
                clientEmail={client.client_email}
                clientNotes={client.client_notes}
                clientImg={client.client_image}
                clientRate={client.client_rate}
                isHourly={client.is_hourly}
                clientBalance={client.client_balance}
                editClient={editClient}
                setEditClient={setEditClient}
                clientDataQueryForUUID={clientDataQueryForUUID}
                setClients={setClients}
                user={user}
              />
            );
          })}
        </div>
      ) : (
        <div className="addContainer">
          <h2 className="addClient">Get started by adding a client!</h2>
          <div>
            <HiMiniPlusCircle
              role="button"
              onClick={openAddClientForm}
              className="client-page-add-button"
            />
          </div>
        </div>
      )}
    </div>
  );
}
