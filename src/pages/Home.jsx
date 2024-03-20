import { useEffect, useState } from 'react';
import HomeClientTodaysScheduleCards from '../components/HomeClientTodaysScheduleCards';
import ClientTotals from '../components/HomeComponents/ClientTotals';
import HomeClientCards from '../components/HomeComponents/HomeClientCards';
const googleMapsApiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

export default function Home({ clients, user }) {
  const [mapOpen, setMapOpen] = useState(false);
  const [clientMapLocation, setClientMapLocation] = useState({});

  const clientsToday = clients.filter((client) => {
    const clientDueDate = new Date(client?.due_date);

    return (
      clientDueDate?.getDate() === new Date().getDate() &&
      clientDueDate?.getMonth() === new Date().getMonth() &&
      clientDueDate?.getFullYear() === new Date().getFullYear()
    );
  });

  useEffect(() => {
    console.log(clientMapLocation);
  }, [clientMapLocation]);

  function getClientMapLocation(client) {
    setClientMapLocation({
      address: `https://www.google.com/maps?q=${client?.client_address}+${client?.client_city}+${client?.client_state}+${client?.client_zipcode}`,
    });

    window.open(clientMapLocation.address, '_blank');
    // if (mapOpen === false) {
    //   setMapOpen(true);
    // }
  }

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
          {clientsToday.length > 0 ? (
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
                  getClientMapLocation={getClientMapLocation}
                  key={client.client_UUID}
                  client={client}
                  setMapOpen={setMapOpen}
                />
              );
            })}
        </div>
        {/* {mapOpen && (
          <div className="clientLocationMapContainer">
            <div className="homeClientLocationMapTitle">
              {clients?.length > 0 ? (
                <h1>Client Locations</h1>
              ) : (
                <h1>No Clients</h1>
              )}
            </div>
            <div className="homeClientLocationMap">
              <iframe
                title="Client Location"
                width="100%"
                height="100%"
                frameBorder="0"
                style={{ border: 0 }}
                src={clientMapLocation}
                allowFullScreen
              ></iframe>
              {console.log(clientMapLocation)}
            </div>
          </div>
        )} */}
      </div>
    </div>
  );
}
