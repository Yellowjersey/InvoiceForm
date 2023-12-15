import ClientTotals from '../components/HomeComponents/ClientTotals';

export default function Home({ clients }) {
  return (
    <div className="home">
      <div className="homeClientTotalsListTitle">
        <h1>Client Totals</h1>
      </div>
      <div className="homeClientTotalsList">
        {clients ? <ClientTotals clients={clients} /> : <h1>No Clients</h1>}
      </div>
    </div>
  );
}
