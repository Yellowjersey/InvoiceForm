import { useRef } from 'react';

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
      clientId: Math.random(),
      clientRate: form.clientRate.value,
      isHourly: form.isHourly.checked,
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
      <label htmlFor="clientName">Client Name</label>
      <input type="text" id="clientName" />
      <label htmlFor="clientAddress">Client Address</label>
      <input type="text" id="clientAddress" />
      <label htmlFor="clientPhone">Client Phone</label>
      <input type="text" id="clientPhone" />
      <label htmlFor="clientEmail">Client Email</label>
      <input type="text" id="clientEmail" />
      <label htmlFor="clientNotes">Client Notes</label>
      <input type="text" id="clientNotes" />
      <div className="clientRate">
        <div className="rateInput">
          <label htmlFor="clientPay">Client Rate</label>
          <input type="number" id="clientRate" />
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
