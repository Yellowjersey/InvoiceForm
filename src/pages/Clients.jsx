import ClientCard from '../components/ClientCard';

export default function Clients({ clients }) {
  return (
    <div className="clients">
      {clients.length > 0 ? (
        clients.map((client) => {
          return (
            <ClientCard
              key={client.id}
              clientName={client.clientName}
              clientAddress={client.clientAddress}
              clientPhone={client.clientPhone}
              clientEmail={client.clientEmail}
              clientNotes={client.clientNotes}
              clientImg={client.clientImg}
            />
          );
        })
      ) : (
        <h2>Add a Client</h2>
      )}
    </div>
  );
}
