import HomeClientCards from './HomeClientCards';

export default function ClientTotals({ clients, user }) {
  return clients
    .sort((a, b) => a.client_name.localeCompare(b.client_name))
    .map((client) => {
      return (
        <HomeClientCards
          key={client.client_UUID}
          Name={client.client_name}
          clientImg={client.client_image}
          total={client.client_balance}
          clientId={client.client_UUID}
          user={user}
          clientAddress={client.client_address}
          clientZip={client.client_zipcode}
          clientState={client.client_state}
        />
      );
    });
}
