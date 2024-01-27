function HomeClientTodaysScheduleCards({ client }) {
  const clientDueDate = new Date(client?.due_date);
  console.log(clientDueDate);

  return (
    <div className="homeClientScheduleCard">
      <div className="homeClientScheduleCardTitle">{client.client_name}</div>
      <div className="homeClientScheduleCardAddress">
        {client.client_address} , {client.client_state} {client.client_zipcode}
      </div>
      <div className="homeClientScheduleCardTime">
        {clientDueDate.toLocaleTimeString()}
      </div>
    </div>
  );
}

export default HomeClientTodaysScheduleCards;
