import InvoiceForm from '../components/ClientForm/InvoiceForm';

export default function CreateInvoice({
  clients,
  showToastMessage,
  invoiceSent,
  setInvoiceSent,
}) {
  return (
    <div className="createinvoice">
      {clients?.length < 1 ? (
        <h1>You have no clients yet.</h1>
      ) : (
        <InvoiceForm
          clients={clients}
          showToastMessage={showToastMessage}
          invoiceSent={invoiceSent}
          setInvoiceSent={setInvoiceSent}
        />
      )}
    </div>
  );
}
