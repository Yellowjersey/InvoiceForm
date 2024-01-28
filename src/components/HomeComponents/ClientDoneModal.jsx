function ClientDoneModal({
  toggleDoneModal,
  client,
  clientDoneforDay,
  setClientDoneforDay,
  updateClientDoneforDay,
}) {
  const capitalizedClientName =
    client.client_name.charAt(0).toUpperCase() + client.client_name.slice(1);

  const handleModalClick = (e) => {
    e.stopPropagation();
  };

  return (
    <div className="clientDoneModalContainer" onClick={toggleDoneModal}>
      <div className="clientDoneModal" onClick={handleModalClick}>
        {!clientDoneforDay ? (
          <h1>Set {capitalizedClientName}'s Status to Done? </h1>
        ) : (
          <h1>Set {capitalizedClientName}'s Status to Not Done? </h1>
        )}
        <div className="clientDoneModalButtons">
          <button onClick={toggleDoneModal}>Cancel</button>
          <button
            onClick={() => {
              setClientDoneforDay((prev) => !prev);
              updateClientDoneforDay();
              toggleDoneModal();
            }}
          >
            {clientDoneforDay ? 'Not Done' : 'Done'}
          </button>
        </div>
      </div>
      <div className="clientDoneModalBackground"></div>
    </div>
  );
}

export default ClientDoneModal;
