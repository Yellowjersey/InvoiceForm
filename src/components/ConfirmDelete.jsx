function ConfirmDelete({ clientName, handleDeleteClient, setConfirmation }) {
  return (
    <div className="confirmDeleteContainer">
      <div className="confirmDelete">
        <h2>Are you sure you want to delete {clientName}?</h2>
        <div className="deletebuttons">
          <button className="confirmDeleteButton" onClick={handleDeleteClient}>
            Yes
          </button>
          <button
            className="cancelDeleteButton"
            onClick={() => setConfirmation(false)}
          >
            No
          </button>
        </div>
        <div
          className="confirmDeleteBackground"
          onClick={() => setConfirmation(false)}
        ></div>
      </div>
    </div>
  );
}

export default ConfirmDelete;
