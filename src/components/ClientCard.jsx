export default function ClientCard({
  clientName,
  clientAddress,
  clientPhone,
  clientEmail,
  key,
  clientNotes,
  clientImg,
}) {
  return (
    <div className="clientCard">
      <div className="client" key={key}>
        <img src={clientImg} />
        <h2 className="clientName">{clientName}</h2>
        <h3 className="clientAddress">{clientAddress}</h3>
        <h3 className="clientPhone">{clientPhone}</h3>
        <h3 className="clientEmail">{clientEmail}</h3>
        <p className="clientNotes">{clientNotes}</p>
      </div>
    </div>
  );
}
