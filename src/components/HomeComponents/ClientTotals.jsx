import HomeClientCards from './HomeClientCards';

export default function ClientTotals({ clients, user }) {
  return clients?.map((client) => {
    return (
      <HomeClientCards
        key={client.client_UUID}
        Name={client.client_name}
        clientImg={client.client_image}
        total={client.client_balance}
        clientId={client.client_UUID}
        user={user}
      />
    );
  });
}
