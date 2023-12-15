import { useEffect, useState } from 'react';
import ClientCard from '../components/ClientCard';

export default function Clients({ clients, setClients }) {
  const [editClient, setEditClient] = useState(false);
  const [updatedClient, setUpdatedClient] = useState([...clients]);
  const [editedClient, setEditedClient] = useState([]);

  return (
    <div className="clients">
      {updatedClient.length > 0 ? (
        updatedClient.map((client) => {
          return (
            <ClientCard
              editedClient={editedClient}
              setEditedClient={setEditedClient}
              updatedClient={updatedClient}
              setUpdatedClient={setUpdatedClient}
              editClient={editClient}
              setEditClient={setEditClient}
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
