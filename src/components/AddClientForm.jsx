import { useEffect, useRef, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { supabase } from '../supabase/supabase';

export default function AddClientForm({
  clientDataQueryForUUID,
  closeModal,
  UUID,
  setClientsUpdated,
}) {
  const modalRef = useRef();

  async function handleSubmit(event) {
    event.preventDefault();
    const form = event.target;

    const client = {
      client_name: form.clientName.value,
      client_address: form.clientAddress.value,
      client_phone: form.clientPhone.value,
      client_email: form.clientEmail.value,
      client_notes: form.clientNotes.value,
      client_image: `https://picsum.photos/200`,
      user_UUID: UUID,
      client_UUID: uuidv4(),
      client_rate: form.clientRate.value,
      is_hourly: form.isHourly.checked,
      client_balance: 0,
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
        await insertClient();
      }

      console.log(client);

      await clientDataQueryForUUID();
      form.reset();

      if (event.target === modalRef.current) {
        closeModal(false);
      }
    }
  }

  return (
    <form className="add-client-form" onSubmit={handleSubmit} ref={modalRef}>
      {/* <label htmlFor="clientImg">Client Image</label>
      <input type="file" id="clientImg" /> */}
      <label htmlFor="clientName">Client Name</label>
      <input type="text" id="clientName" className="add-client-form-input" />
      <label htmlFor="clientAddress">Client Address</label>
      <input type="text" id="clientAddress" className="add-client-form-input" />
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
