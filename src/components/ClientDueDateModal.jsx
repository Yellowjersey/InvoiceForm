import { useEffect, useState } from 'react';
import { supabase } from '../supabase/supabase';

function ClientDueDateModal({
  currentDueDate,
  client,
  setClientDueDateModal,
  setSelectedClient,
  setDueDateChanged,
  dueDateChanged,
  clientsOnThisDay,
  userAccount,
}) {
  currentDueDate = new Date(currentDueDate).toISOString().slice(0, 16);

  const [newDueDate, setNewDueDate] = useState(currentDueDate);

  const clientNameCapitalized =
    client.client_name.charAt(0).toUpperCase() + client.client_name.slice(1);

  async function updateClientDueDate() {
    const newDueDateObj = new Date(newDueDate);
    const userTimeZone = userAccount.Time_Zone; // Get user's time zone

    // Adjust new due date to user's time zone
    const newDueDateISO = newDueDateObj.toLocaleString('en-US', {
      timeZone: userTimeZone,
      hour12: false,
    });

    const { data, error } = await supabase
      .from('Clients')
      .update({ due_date: newDueDateISO })
      .match({ client_UUID: client.client_UUID });

    if (!error) {
      setDueDateChanged((prev) => !prev);
      setSelectedClient('');
      setClientDueDateModal(false);
    }
  }

  return (
    <div className="clientDueDateModalContainer">
      <div className="clientDueDateModal">
        <div className="clientDueDateModalDueDate">
          {clientNameCapitalized}'s Current Due Date: {currentDueDate}
        </div>
        <div className="clientDueDateModalTitle">
          <label htmlFor="dueDate">New Due Date:</label>
          <input
            id="dueDate"
            type="datetime-local"
            className="dueDateInput"
            value={newDueDate}
            onChange={(e) => {
              e.stopPropagation();
              setNewDueDate(e.target.value);
            }}
          />
        </div>

        <div className="clientDueDateModalButtons">
          <button
            className="cancelButton"
            onClick={(e) => {
              e.stopPropagation();
              setSelectedClient('');
              setClientDueDateModal(false);
            }}
          >
            Cancel
          </button>
          <button
            className="saveButton"
            onClick={(e) => {
              e.stopPropagation();
              updateClientDueDate();
            }}
          >
            Save
          </button>
        </div>
      </div>
      <div
        className="dueDateModalBackground"
        onClick={(e) => {
          e.stopPropagation();
          setSelectedClient('');
          setClientDueDateModal(false);
        }}
      ></div>
    </div>
  );
}

export default ClientDueDateModal;
