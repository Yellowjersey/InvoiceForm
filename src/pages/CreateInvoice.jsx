import InvoiceForm from '../components/ClientForm/InvoiceForm';

export default function CreateInvoice({ clients }) {
  return (
    <div className="createinvoice">
      {clients?.length < 1 ? (
        <h1>You have no clients yet.</h1>
      ) : (
        <InvoiceForm clients={clients} />
      )}
    </div>
  );
}
