import { useEffect, useState } from 'react';
import ClientCard from '../components/ClientCard';

export default function Clients({ clients, setClients }) {
  const [updatedClient, setUpdatedClient] = useState([...clients]);
  const [editedClient, setEditedClient] = useState([]);

  useEffect(() => {
    setClients([...updatedClient]);
  }, [updatedClient]);

  return (
    <div className="clients">
      {clients.length > 0 ? (
        clients.map((client) => {
          return (
            <ClientCard
              clients={clients}
              editedClient={editedClient}
              setEditedClient={setEditedClient}
              updatedClient={updatedClient}
              setUpdatedClient={setUpdatedClient}
              clientId={client.clientId}
              key={client.clientId}
              clientName={client.clientName}
              clientAddress={client.clientAddress}
              clientPhone={client.clientPhone}
              clientEmail={client.clientEmail}
              clientNotes={client.clientNotes}
              clientImg={client.clientImg}
              clientRate={client.clientRate}
              isHourly={client.isHourly}
              clientBalance={client.clientBalance}
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
