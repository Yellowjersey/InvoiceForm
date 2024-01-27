import { useEffect, useRef, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { supabase } from '../supabase/supabase';
import FormRange from 'react-bootstrap/esm/FormRange';

import useSetClientImages from '../hooks/useSetClientImages';

export default function AddClientForm({
  clientDataQueryForUUID,
  closeModal,
  UUID,
  setClientsUpdated,
  setClients,
}) {
  const modalRef = useRef();

  const newClientUUID = uuidv4();

  // const clientPropertyImages = useSetClientImages({ client_UUID: newClientUUID,  });

  async function handleSubmit(event) {
    event.preventDefault();
    const form = event.target;

    let propertyImages = Array.from(form.propertyImages.files);

    const response = await fetch(
      `https://sqdpatjugbkiwgugfjzy.supabase.co/storage/v1/object/public/client_images/addImage.jpg`
    );
    const blob = await response.blob();
    const file = new File([blob], 'addPropertyImage.jpg', {
      type: 'image/jpeg',
    });
    propertyImages.unshift(file);

    await useSetClientImages({
      UUID,
      client_UUID: newClientUUID,
      propertyImages,
    });

    const propertyImageNames = propertyImages.map((file) => file.name);

    const client = {
      client_name: form.clientName.value,
      client_address: form.clientAddress.value,
      client_phone: form.clientPhone.value,
      client_email: form.clientEmail.value,
      client_notes: form.clientNotes.value,
      client_image: form?.clientImg?.files[0]?.name
        ? form?.clientImg?.files[0]?.name
        : `YardMan.png`,
      user_UUID: UUID,
      client_UUID: newClientUUID,
      client_rate: form.clientRate.value,
      is_hourly: form.isHourly.checked,
      client_balance: 0,
      invoices: [],
      client_property_images: propertyImageNames,
      client_zipcode: form.clientZip.value,
      client_state: form.clientState.value,
      due_date: form.dueDate.value,
      repeat_frequency: form.frequency.value,
    };

    if (
      (event.target === modalRef.current) &
      (form.clientName.value !== '') &
      (form.clientAddress.value !== '') &
      (form.clientPhone.value !== '') &
      (form.clientEmail.value !== '')
    ) {
      async function insertClient() {
        const { data, error } = await supabase.from('Clients').insert([client]);

        const { data: clientImageSubmit, error: clientImageError } =
          await supabase.storage
            .from('client_images')
            .upload(
              `${UUID}/${client.client_UUID}/${client.client_image}`,
              form.clientImg.files[0]
            );

        if (data) {
          console.log('Insert successful:', data);
        }

        if (error) {
          console.error('Error inserting client:', error.message);
        }
      }
      setClientsUpdated(true);
      const res = await clientDataQueryForUUID();

      if (
        client.client_email !== res.client_email &&
        client.client_UUID !== res.client_UUID
      ) {
        await insertClient().then(setClientsUpdated(false));
      }

      await setClients(res);

      form.reset();

      if (event.target === modalRef.current) {
        closeModal(false);
      }
    }
  }

  return (
    <form className="add-client-form" onSubmit={handleSubmit} ref={modalRef}>
      <div className="add-client-form-top-container">
        <div className="add-client-form-images-container">
          <label htmlFor="clientImg">Client Profile Image</label>
          <input type="file" id="clientImg" />
          <label htmlFor="propertyImages">Property Images</label>
          <input type="file" id="propertyImages" multiple />
        </div>
        <div className="add-client-form-due-date-container">
          <div className="add-client-form-due-date">
            <label htmlFor="dueDate">Due Date:</label>
            <input
              id="dueDate"
              type="datetime-local"
              className="add-client-form-due-date-input"
            />
          </div>
          <div className="add-client-form-frequency-container">
            <label htmlFor="frequency">Frequency visited:</label>
            <select id="frequency">
              <option value="weekly">Weekly</option>
              <option value="biweekly">Bi-Weekly</option>
              <option value="monthly">Monthly</option>
              <option value="bimonthly">Bi-Monthly</option>
              <option value="yearly">Yearly</option>
            </select>
          </div>
        </div>
      </div>
      <label htmlFor="clientName">Client Name</label>
      <input type="text" id="clientName" className="add-client-form-input" />
      <label htmlFor="clientAddress">Client Address</label>
      <input type="text" id="clientAddress" className="add-client-form-input" />
      <div className="clientZipStateContainer">
        <div className="clientZip">
          <label htmlFor="clientZip">Client Zip</label>
          <input
            type="number"
            id="clientZip"
            className="add-client-form-input"
          />
        </div>
        <div className="clientState">
          <label htmlFor="clientState">Client State</label>
          <select id="clientState" className="add-client-form-input">
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
      <label htmlFor="clientPhone">Client Phone</label>
      <input type="tel" id="clientPhone" className="add-client-form-input" />
      <label htmlFor="clientEmail">Client Email</label>
      <input type="text" id="clientEmail" className="add-client-form-input" />
      <label htmlFor="clientNotes">Client Notes</label>
      <input type="text" id="clientNotes" className="add-client-form-input" />
      <div className="clientRate">
        <div className="rateInput">
          <label htmlFor="clientRate">Client Rate</label>
          <input
            type="number"
            id="clientRate"
            className="add-client-form-input"
          />
        </div>
        <div className="checkBoxContainer">
          <input type="checkbox" id="isHourly" className="checkBox" />
          <label htmlFor="isHourly">Hourly</label>
        </div>
      </div>
      <button type="submit">Add Client</button>
    </form>
  );
}
