import { useEffect, useState } from 'react';
import ClientDueDateModal from './ClientDueDateModal';
import { supabase } from '../supabase/supabase';

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
  setClients,
  getMonday,
  userAccount,
}) {
  // Convert date to a Date object if it's not already one
  date = new Date(date);

  const repeatFrequencies = {
    weekly: 7,
    biweekly: 14,
    monthly: 30,
    bimonthly: 60,
    yearly: 365,
  };

  // Function to calculate next due dates
  function calculateNextDueDates(client) {
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
      return (
        clientDueDate.getDate() === date.getDate() &&
        clientDueDate.getMonth() === date.getMonth() &&
        clientDueDate.getFullYear() === date.getFullYear()
      );
    });

  const getTimeFromDate = (dueDateString, userTimeZone) => {
    // Parse the due date string into a Date object
    const clientDueDate = new Date(dueDateString);

    // Convert the time to string representation in the user's timezone
    const timeInUserTimeZone = clientDueDate.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true, // Display time in 12-hour format
      timeZone: userTimeZone,
    });

    return timeInUserTimeZone;
  };

  const [selectedClient, setSelectedClient] = useState(null);

  const handleClientClick = (client) => {
    setSelectedClient(client); // Set the selected client
  };

  const todaysDate = newDate.toDateString();

  return (
    <div className="schedulerDays">
      <div
        className={`schedulerDayTitle ${
          todaysDate === date.toDateString() ? 'todaysDate' : ''
        }`}
      >
        <div>{date.toDateString()}</div>

        <div>
          {clientsOnThisDay.length > 0
            ? `Client Amount: ${clientsOnThisDay.length}`
            : ''}
        </div>
      </div>
      <div className="schedulerDayClientsContainer">
        {clientsOnThisDay.map((client) => (
          <div
            key={client.client_UUID}
            className="schedulerDayClient"
            onClick={() => handleClientClick(client)}
          >
            <div className="schedulerDayClientName">
              Name: {client.client_name}
            </div>
            <div className="schedulerDayClientAddress">
              Address: {client.client_address}
            </div>
            <div className="schedulerDayClientDueTime">
              Due Time:{' '}
              {getTimeFromDate(client.due_date, userAccount.Time_Zone)}
            </div>

            {/* Display client's due time */}
            {selectedClient &&
              selectedClient.client_UUID === client.client_UUID && (
                <ClientDueDateModal
                  currentDueDate={selectedClient.due_date}
                  setClientDueDateModal={setClientDueDateModal}
                  setSelectedClient={setSelectedClient}
                  client={selectedClient}
                  setDueDateChanged={setDueDateChanged}
                  dueDateChanged={dueDateChanged}
                  clientsOnThisDay={clientsOnThisDay}
                  userAccount={userAccount}
                />
              )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default SchedulerDay;
