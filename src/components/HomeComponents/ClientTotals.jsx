import HomeClientCards from './HomeClientCards';

export default function ClientTotals({ clients }) {
  return clients?.map((client) => {
    return (
      <HomeClientCards
        key={client.client_UUID}
        Name={client.client_name}
        img={client.client_image}
        total={client.client_balance}
      />
    );
  });
}
