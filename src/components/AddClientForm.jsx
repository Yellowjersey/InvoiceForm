import { useRef } from 'react';
import { v4 as uuidv4 } from 'uuid';

export default function AddClientForm({ setClients, closeModal }) {
  const modalRef = useRef();
  function handleSubmit(event) {
    event.preventDefault();
    const form = event.target;

    const client = {
      clientName: form.clientName.value,
      clientAddress: form.clientAddress.value,
      clientPhone: form.clientPhone.value,
      clientEmail: form.clientEmail.value,
      clientNotes: form.clientNotes.value,
      clientImg: 'https://picsum.photos/200',
      // clientImg: form.clientImage.value,
      clientId: uuidv4(),
      clientRate: form.clientRate.value,
      isHourly: form.isHourly.checked,
      clientBalance: 0,
    };

    if (
      (event.target === modalRef.current) &
      (form.clientName.value !== '') &
      (form.clientAddress.value !== '') &
      (form.clientPhone.value !== '') &
      (form.clientEmail.value !== '')
    ) {
      setClients((prevClients) => [...prevClients, client]);
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
      <input type="text" id="clientPhone" className="add-client-form-input" />
      <label htmlFor="clientEmail">Client Email</label>
      <input type="text" id="clientEmail" className="add-client-form-input" />
      <label htmlFor="clientNotes">Client Notes</label>
      <input type="text" id="clientNotes" className="add-client-form-input" />
      <div className="clientRate">
        <div className="rateInput">
          <label htmlFor="clientPay">Client Rate</label>
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
