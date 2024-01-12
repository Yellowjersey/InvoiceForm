import { useEffect, useState } from 'react';
import EditClientModal from './EditClientModal';
import { supabase } from '../supabase/supabase';

export default function ClientCard({
  clientName,
  clientAddress,
  clientPhone,
  clientEmail,
  clientId,
  clientNotes,
  clientImg,
  clientRate,
  isHourly,
  clients,
  setUpdatedClient,
  updatedClient,
  editedClient,
  setEditedClient,
  clientBalance,
  setEditClient,
  editClient,
  clientDataQueryForUUID,
  setClientsUpdated,
  setClients,
  user,
}) {
  const [clientImage, setClientImage] = useState('');

  const CDNURL =
    'https://sqdpatjugbkiwgugfjzy.supabase.co/storage/v1/object/public/client_images/';

  useEffect(() => {
    async function fetchImage() {
      const { data, error } = await supabase.storage
        .from('client_images')
        .list(user.id + '/' + clientId + '/');

      const yardManImage =
        'YardMan' + Math.floor(Math.random() * 5 + 1) + '.png';

      if (data === null || data === undefined || data.length === 0) {
        setClientImage(CDNURL + yardManImage);
      }

      if (data !== null) {
        for (const image of data) {
          if (image.name === clientImg) {
            const imageUrl = `${CDNURL}${user.id}/${clientId}/${image.name}`;
            setClientImage(imageUrl);

            break; // Exit the loop once the image is found
          }
        }
      }

      if (error) {
        console.error('Error fetching image:', error);
      }
    }

    fetchImage();
  }, [clientId, clientImg, user.id]);

  async function handleClientClick(e) {
    const { data, error } = await supabase
      .from('Clients')
      .select('*')
      .match({ client_UUID: clientId });

    if (data) {
      setEditedClient(data);

      setEditClient(true);
    }
  }

  async function handleDeleteClient() {
    const { data, error } = await supabase
      .from('Clients')
      .delete()
      .match({ client_UUID: clientId });

    const res = await clientDataQueryForUUID();
    setClients(res);

    if (error) {
      console.error('Error deleting client:', error.message);
    }
  }

  return (
    <>
      {editClient ? (
        <EditClientModal
          setEditedClient={setEditedClient}
          editedClient={editedClient}
          setClientsUpdated={setClientsUpdated}
          setEditClient={setEditClient}
          initialClientName={clientName}
          user={user}
          setClients={setClients}

          // clientBalance={clientBalance}
        />
      ) : null}
      <div className="clientContainer">
        <button
          className="client-delete-button"
          title={`Delete Client ${clientName} `}
          onClick={handleDeleteClient}
        >
          X
        </button>
        <div className="clientCard" key={clientId}>
          <div
            className="client"
            // onClick={(e) => {
            //   handleClientClick(e);
            // }}
          >
            <div className="clientImgContainer">
              <img src={clientImage} />
            </div>
            <h2 className="clientName">Name: {clientName}</h2>
            <h3 className="clientAddress">Address: {clientAddress}</h3>
            <h3 className="clientPhone">Phone Number: {clientPhone}</h3>
            <h3 className="clientEmail">Email: {clientEmail}</h3>
            <p className="clientNotes">Notes: {clientNotes}</p>

            <h3 className="clientPay">
              Rate: $ {clientRate} {isHourly ? <p>/hr</p> : <p>/wk</p>}
            </h3>
            {/* <div>
            <input
            id="isHourly"
            type="checkbox"
            className="checkBox"
            checked={isHourly}
            disabled
            />
            <label htmlFor="isHourly">Hourly</label>
          </div> */}
            <h4 className="clientBalance">Balance: $ {clientBalance}</h4>
            <div className="editClientButtonContainer">
              <button className="editClientButton" onClick={handleClientClick}>
                Edit {clientName}'s Profile
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
