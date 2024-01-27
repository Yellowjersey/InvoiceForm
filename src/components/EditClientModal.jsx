import React, { useEffect, useState } from 'react';
import { supabase } from '../supabase/supabase';
import { v4 as uuidv4 } from 'uuid';

function EditClientModal({
  setEditClient,
  user,
  editedClient,
  initialClientName,
  setClientsUpdated,
  setClients,
}) {
  const {
    client_UUID,
    client_name,
    client_address,
    client_phone,
    client_email,
    client_notes,
    client_image,
    client_rate,
    is_hourly,
    client_balance,
    client_zipcode,
    client_state,
    due_date,
    repeat_frequency,
  } = editedClient[0];

  const dueDateObj = new Date(due_date);
  console.log(console.log(dueDateObj.toISOString()));

  const [clientName, setClientName] = useState(client_name);
  const [clientAddress, setClientAddress] = useState(client_address);
  const [clientPhone, setClientPhone] = useState(client_phone);
  const [clientEmail, setClientEmail] = useState(client_email);
  const [clientId, setClientId] = useState(client_UUID);
  const [clientNotes, setClientNotes] = useState(client_notes);
  const [clientImg, setClientImg] = useState(client_image);
  const [clientRate, setClientRate] = useState(client_rate);
  const [isHourly, setIsHourly] = useState(is_hourly);
  const [clientBalance, setClientBalance] = useState(client_balance);
  const [clientZip, setClientZip] = useState(client_zipcode);
  const [clientState, setClientState] = useState(client_state);
  const [dueDate, setDueDate] = useState(
    dueDateObj.toISOString().split('.')[0]
  );
  const [repeatFrequency, setRepeatFrequency] = useState();
  const [pathName, setPathName] = useState('');

  async function updateClientDueDate() {
    const newDueDateObj = new Date(dueDate);
    const timezoneOffsetMinutes = newDueDateObj.getTimezoneOffset();
    newDueDateObj.setMinutes(
      newDueDateObj.getMinutes() - timezoneOffsetMinutes
    );

    const newDueDateISO = newDueDateObj.toISOString();
  }

  async function handleUpdate(e) {
    e.preventDefault();

    setClientsUpdated(true);

    // Fetch client data
    const { data: clientData, error: clientError } = await supabase
      .from('Clients')
      .select('*')
      .filter('client_UUID', 'eq', clientId);

    // Check if there's an error fetching client data
    if (clientError) {
      console.error('Error fetching client data:', clientError);
      return;
    }

    // List all files in the client's folder
    const { data: storageData, error: storageError } = await supabase.storage
      .from('client_images')
      .list(`${clientId}/`);

    // Check if there's an error listing files
    if (storageError) {
      console.error('Error listing files:', storageError);
      return;
    }

    // If the client's folder is empty, create a new file
    if (storageData && storageData.length === 0) {
      const slicedImage = clientImg?.name?.replace(/\s/g, '');
      const pathName = `${clientId}/${slicedImage}`;

      // Upload the file
      if (slicedImage !== undefined) {
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('client_images')
          .upload(user?.id + '/' + clientId + '/' + slicedImage, clientImg, {
            cacheControl: '3600',
          });

        // Check if there's an error uploading the file
        if (uploadError) {
          console.error('Error uploading file:', uploadError);
          return;
        }
      }

      const newDueDateObj = new Date(dueDate);
      const timezoneOffsetMinutes = newDueDateObj.getTimezoneOffset();
      newDueDateObj.setMinutes(
        newDueDateObj.getMinutes() - timezoneOffsetMinutes
      );

      const newDueDateISO = newDueDateObj.toISOString();

      // Update the client data with the new image path
      const { data: updateData, error: updateError } = await supabase
        .from('Clients')
        .update({
          client_name: clientName,
          client_address: clientAddress,
          client_phone: clientPhone,
          client_email: clientEmail,
          client_notes: clientNotes,
          client_image: slicedImage,
          client_rate: clientRate,
          is_hourly: isHourly,
          client_balance: clientBalance,
          client_zipcode: clientZip,
          client_state: clientState,
          due_date: newDueDateISO,
          repeat_frequency: repeatFrequency,
        })
        .match({ client_UUID: clientId });

      const { data: updateData2, error: updateError2 } = await supabase
        .from('Clients')
        .select('*');

      const loggedInClients = updateData2.filter(
        (client) => client.user_UUID === user.id
      );
      setClients(loggedInClients);

      // Check if there's an error updating the client data
      if (updateError) {
        console.error('Error updating client data:', updateError);
        return;
      }
    }
    setEditClient(false);
  }

  return (
    <div className="editClientModal">
      <form
        className="editClientModalContent"
        key={clientId}
        onSubmit={(e) => handleUpdate(e)}
      >
        <h1>Edit {clientName}'s Profile</h1>
        <h3>Upload a new client profile image</h3>

        <input
          type="file"
          placeholder={client_image}
          id="img"
          onChange={(e) => setClientImg(e.target.files[0])}
        />
        <h3>Update {clientName}'s information</h3>
        <input type="hidden" value={clientId} id="id" />
        <label htmlFor="clientName">Name</label>
        <input
          type="text"
          placeholder={clientName}
          id="clientName"
          value={clientName}
          onChange={(e) => setClientName(e.target.value)}
        />
        <label htmlFor="address">Address</label>
        <input
          type="text"
          placeholder={clientAddress}
          id="address"
          value={clientAddress}
          onChange={(e) => setClientAddress(e.target.value)}
        />
        <div className="clientZipStateContainer">
          <div className="clientZip">
            <label htmlFor="clientZip">Client Zip</label>
            <input
              type="number"
              id="clientZip"
              className="add-client-form-input"
              value={clientZip}
              onChange={(e) => setClientZip(e.target.value)}
            />
          </div>
          <div className="clientState">
            <label htmlFor="clientState">Client State</label>
            <select
              id="clientState"
              className="add-client-form-input"
              value={clientState}
              onChange={(e) => setClientState(e.target.value)}
            >
              <option value="AL">Alabama</option>
              <option value="AK">Alaska</option>
              <option value="AZ">Arizona</option>
              <option value="AR">Arkansas</option>
              <option value="CA">California</option>
              <option value="CO">Colorado</option>
              <option value="CT">Connecticut</option>
              <option value="DE">Delaware</option>
              <option value="FL">Florida</option>
              <option value="GA">Georgia</option>
              <option value="HI">Hawaii</option>
              <option value="ID">Idaho</option>
              <option value="IL">Illinois</option>
              <option value="IN">Indiana</option>
              <option value="IA">Iowa</option>
              <option value="KS">Kansas</option>
              <option value="KY">Kentucky</option>
              <option value="LA">Louisiana</option>
              <option value="ME">Maine</option>
              <option value="MD">Maryland</option>
              <option value="MA">Massachusetts</option>
              <option value="MI">Michigan</option>
              <option value="MN">Minnesota</option>
              <option value="MS">Mississippi</option>
              <option value="MO">Missouri</option>
              <option value="MT">Montana</option>
              <option value="NE">Nebraska</option>
              <option value="NV">Nevada</option>
              <option value="NH">New Hampshire</option>
              <option value="NJ">New Jersey</option>
              <option value="NM">New Mexico</option>
              <option value="NY">New York</option>
              <option value="NC">North Carolina</option>
              <option value="ND">North Dakota</option>
              <option value="OH">Ohio</option>
              <option value="OK">Oklahoma</option>
              <option value="OR">Oregon</option>
              <option value="PA">Pennsylvania</option>
              <option value="RI">Rhode Island</option>
              <option value="SC">South Carolina</option>
              <option value="SD">South Dakota</option>
              <option value="TN">Tennessee</option>
              <option value="TX">Texas</option>
              <option value="UT">Utah</option>
              <option value="VT">Vermont</option>
              <option value="VA">Virginia</option>
              <option value="WA">Washington</option>
              <option value="WV">West Virginia</option>
              <option value="WI">Wisconsin</option>
              <option value="WY">Wyoming</option>
            </select>
          </div>
        </div>

        <div className="edit-client-form-due-date-container">
          <div className="edit-client-form-due-date">
            <label htmlFor="dueDate">Due Date:</label>
            <input
              id="dueDate"
              type="datetime-local"
              className="edit-client-form-due-date-input"
              onChange={(e) => {
                setDueDate(e.target.value);
              }}
              value={dueDate}
            />
          </div>
          <div className="edit-client-form-frequency-container">
            <label htmlFor="frequency">Frequency visited:</label>
            <select
              id="frequency"
              onChange={(e) => {
                setRepeatFrequency(e.target.value);
              }}
              value={repeatFrequency}
            >
              <option value="weekly">Weekly</option>
              <option value="biweekly">Bi-Weekly</option>
              <option value="monthly">Monthly</option>
              <option value="bimonthly">Bi-Monthly</option>
              <option value="yearly">Yearly</option>
            </select>
          </div>
        </div>

        <label htmlFor="phone">Phone</label>
        <input
          type="text"
          placeholder={clientPhone}
          id="phone"
          value={clientPhone}
          onChange={(e) => setClientPhone(e.target.value)}
        />
        <label htmlFor="email">Email</label>
        <input
          type="text"
          placeholder={clientEmail}
          id="email"
          value={clientEmail}
          onChange={(e) => setClientEmail(e.target.value)}
        />
        <label htmlFor="note">Notes</label>
        <input
          type="text"
          placeholder={clientNotes}
          id="note"
          value={clientNotes}
          onChange={(e) => setClientNotes(e.target.value)}
        />
        <label htmlFor="rate">Rate</label>
        <input
          type="number"
          placeholder={clientRate}
          id="rate"
          value={clientRate}
          onChange={(e) => setClientRate(e.target.value)}
        />

        <div className="hourlyEditDiv">
          <input
            type="checkbox"
            id="hourly"
            checked={isHourly ? true : false}
            onChange={(e) => {
              setIsHourly(isHourly ? false : true);
            }}
          />
          <label htmlFor="hourly">Hourly</label>
        </div>

        <label htmlFor="clientBalance">Balance</label>
        <input
          type="number"
          placeholder={clientBalance}
          id="clientBalance"
          value={clientBalance}
          onChange={(e) => setClientBalance(e.target.value)}
        />
        <button>Submit</button>
      </form>
      <div
        className="editClientModalBackground"
        onClick={() => setEditClient(false)}
      ></div>
    </div>
  );
}

export default EditClientModal;
