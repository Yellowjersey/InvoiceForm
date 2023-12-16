import HomeClientCards from './HomeClientCards';

export default function ClientTotals({ clients }) {
  return clients.map((client) => {
    return (
      <HomeClientCards
        Name={client.clientName}
        img={client.clientImg}
        total={client.clientBalance}
      />
    );
  });
}
