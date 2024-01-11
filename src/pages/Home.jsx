import ClientTotals from '../components/HomeComponents/ClientTotals';

export default function Home({ clients, user }) {
  return (
    <div className="home">
      <div className="homeClientTotalsListTitle">
        {clients?.length > 0 ? <h1>Client Totals</h1> : <h1>No Clients</h1>}
      </div>
      <div className="homeClientTotalsList">
        {<ClientTotals clients={clients} user={user} />}
      </div>
    </div>
  );
}
