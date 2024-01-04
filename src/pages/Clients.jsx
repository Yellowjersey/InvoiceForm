import { useEffect, useState } from 'react';
import ClientCard from '../components/ClientCard';

export default function Clients({ clients, setClients }) {
  const [updatedClient, setUpdatedClient] = useState([]);
  const [editedClient, setEditedClient] = useState([]);

  // useEffect(() => {
  //   setClients([...updatedClient]);
  // }, [updatedClient]);

  return (
    <div className="clients">
      {clients?.length > 0 ? (
        clients.map((client) => {
          return (
            <ClientCard
              clients={clients}
              editedClient={editedClient}
              setEditedClient={setEditedClient}
              updatedClient={updatedClient}
              setUpdatedClient={setUpdatedClient}
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
            />
          );
        })
      ) : (
        <div className="addContainer">
          <h2 className="addClient">Add a Client</h2>
        </div>
      )}
    </div>
  );
}
