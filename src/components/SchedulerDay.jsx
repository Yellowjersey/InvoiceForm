import { useEffect, useState } from 'react';
import ClientDueDateModal from './ClientDueDateModal';

function SchedulerDay({
  day,
  date,
  clients,
  currentWeek,
  newDate,
  setClientDueDateModal,
  currentWeekAsDateString,
  setDueDateChanged,
  dueDateChanged,
}) {
  const [selectedClient, setSelectedClient] = useState(null);
  // Convert date to a Date object if it's not already one
  date = new Date(date);

  function calculateNextDueDates(client) {
    const repeatFrequencies = {
      weekly: 7,
      biweekly: 14,
      monthly: 30,
      bimonthly: 60,
      yearly: 365,
    };

    const frequency = repeatFrequencies[client.repeat_frequency];
    if (!frequency) return client;

    const dueDate = new Date(client.due_date);
    const nextDueDates = [];

    for (let i = 1; i <= 4; i++) {
      // Calculate next 4 due dates
      const nextDueDate = new Date(dueDate);
      nextDueDate.setDate(dueDate.getDate() + frequency * i);
      nextDueDates.push(nextDueDate);
    }

    return { ...client, nextDueDates };
  }
  // Filter clients based on due_date

  const clientsOnThisDay = clients
    .map(calculateNextDueDates)
    .filter((client) => {
      const clientDueDate = new Date(client.due_date);
      const matchesOriginalDueDate =
        clientDueDate.getDate() === date.getDate() &&
        clientDueDate.getMonth() === date.getMonth() &&
        clientDueDate.getFullYear() === date.getFullYear();

      return matchesOriginalDueDate;
    });

  const nextDueDates = clients.map(calculateNextDueDates).filter((client) => {
    const matchesNextDueDates = client.nextDueDates?.some(
      (nextDueDate) =>
        nextDueDate.getDate() === date.getDate() &&
        nextDueDate.getMonth() === date.getMonth() &&
        nextDueDate.getFullYear() === date.getFullYear()
    );
    return matchesNextDueDates;
  });

  function refreshClientsOnThisDay() {
    clients.filter((client) => {
      const clientDueDate = new Date(client?.due_date);

      return (
        clientDueDate?.getDate() === date?.getDate() &&
        clientDueDate?.getMonth() === date?.getMonth() &&
        clientDueDate?.getFullYear() === date?.getFullYear()
      );
    });
  }
  useEffect(() => {
    refreshClientsOnThisDay();
  }, [clients, date, dueDateChanged]);

  const todaysDate = newDate.toDateString();

  return (
    <div className="schedulerDays">
      <div
        className={`schedulerDayTitle ${
          todaysDate === date.toDateString() ? 'todaysDate' : ''
        }`}
      >
        {date.toDateString()}
        <div>
          {clientsOnThisDay.length > 0
            ? `Client Amount: ${clientsOnThisDay.length}`
            : ''}
        </div>
      </div>

      <div className="schedulerDayClientsContainer">
        {currentWeekAsDateString.includes(todaysDate)
          ? clientsOnThisDay
              .sort((a, b) => a.client_name.localeCompare(b.client_name))
              .map((client) => {
                return (
                  <div
                    key={client.client_UUID}
                    className="schedulerDayClient"
                    onClick={(event) => {
                      event.stopPropagation(); // Prevent the event from bubbling up
                      setSelectedClient(client); // Set the selected client
                    }}
                  >
                    <div className="schedulerDayClientName">
                      Name: {client.client_name}
                    </div>
                    <div className="schedulerDayClientAddress">
                      Address: {client.client_address}
                    </div>
                    {selectedClient && (
                      <ClientDueDateModal
                        currentDueDate={selectedClient.due_date}
                        setClientDueDateModal={setClientDueDateModal}
                        setSelectedClient={setSelectedClient}
                        client={selectedClient}
                        setDueDateChanged={setDueDateChanged}
                        dueDateChanged={dueDateChanged}
                        clientsOnThisDay={clientsOnThisDay}
                      />
                    )}
                  </div>
                );
              })
          : nextDueDates
              .sort((a, b) => a.client_name.localeCompare(b.client_name))
              .map((client) => {
                return (
                  <div
                    label={client.client_name + "'s" + ' Next Due Date'}
                    key={client.client_UUID}
                    className="schedulerDayClientNextDueDates"
                    onClick={(event) => {
                      if (!client.isInteractable) return; // Check the isInteractable property of client
                      event.stopPropagation(); // Prevent the event from bubbling up
                      setSelectedClient(client); // Set the selected client
                    }}
                  >
                    <div className="schedulerDayClientNameNextDueDates">
                      Name: {client.client_name}
                    </div>
                    <div className="schedulerDayClientAddressNextDueDates">
                      Address: {client.client_address}
                    </div>
                  </div>
                );
              })}
      </div>
    </div>
  );
}

export default SchedulerDay;
