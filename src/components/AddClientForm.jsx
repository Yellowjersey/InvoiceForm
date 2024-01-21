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

    const propertyImages = Array.from(form.propertyImages.files);

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
      <label htmlFor="clientImg">Client Profile Image</label>
      <input type="file" id="clientImg" />
      <label htmlFor="propertyImages">Property Images</label>
      <input type="file" id="propertyImages" multiple />
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
