import HomeClientTodaysScheduleCards from '../components/HomeClientTodaysScheduleCards';
import ClientTotals from '../components/HomeComponents/ClientTotals';
import HomeClientCards from '../components/HomeComponents/HomeClientCards';
const googleMapsApiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

export default function Home({ clients, user }) {
  return (
    <div className="home">
      <div className="clientTotalsContainer">
        <div className="homeClientTotalsListTitle">
          {clients?.length > 0 ? <h1>Client Totals</h1> : <h1>No Clients</h1>}
        </div>
        <div className="homeClientScrollerContainer">
          <div className="homeClientScroller">
            <div className="homeClientTotalsList">
              {<ClientTotals clients={clients} user={user} />}
            </div>
          </div>
        </div>
      </div>
      <div className="homeClientTodaysSchedule">
        <div className="homeClientTodaysScheduleTitle">
          {clients?.length > 0 ? (
            <h1>Today's Schedule</h1>
          ) : (
            <h1>No Clients Today</h1>
          )}
        </div>
        <div className="homeClientTodaysScheduleList">
          {clients
            .filter((client) => {
              const clientDueDate = new Date(client?.due_date);

              return (
                clientDueDate?.getDate() === new Date().getDate() &&
                clientDueDate?.getMonth() === new Date().getMonth() &&
                clientDueDate?.getFullYear() === new Date().getFullYear()
              );
            })
            .sort((a, b) => new Date(a.due_date) - new Date(b.due_date)) // Sort the clients based on their due_date
            .map((client) => {
              return (
                <HomeClientTodaysScheduleCards
                  key={client.client_UUID}
                  client={client}
                />
              );
            })}
        </div>
      </div>

      {/* <div className="clientLocationMapContainer">
        <div className="homeClientLocationMapTitle">
          {clients?.length > 0 ? (
            <h1>Client Locations</h1>
          ) : (
            <h1>No Clients</h1>
          )}
        </div>
        <div className="homeClientLocationMap">
          <iframe
            title="Client Locations"
            width="100%"
            height="100%"
            frameBorder="0"
            style={{ border: 0 }}
            src={`https://www.google.com/maps/embed/v1/place?key=${googleMapsApiKey}&q=${clients[0]?.client_address}+${clients[0]?.client_city}+${clients[0]?.client_state}+${clients[0]?.client_zipcode}`}
            allowFullScreen
          ></iframe>
        </div>
      </div> */}
    </div>
  );
}
