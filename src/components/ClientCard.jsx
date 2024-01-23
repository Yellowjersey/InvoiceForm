import { useEffect, useState } from 'react';
import EditClientModal from './EditClientModal';
import { supabase } from '../supabase/supabase';
import ConfirmDelete from './ConfirmDelete';
import { FcAddImage } from 'react-icons/fc';
import ClientPropertyImageModal from './ClientPropertyImageModal';

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
  const [confirmation, setConfirmation] = useState(false);
  const [clientPropertyImages, setClientPropertyImages] = useState([]); // ['image1', 'image2', 'image3'
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showClientPropertyImageModal, setShowClientPropertyImageModal] =
    useState(false); // ['image1', 'image2', 'image3'
  const [imageAdded, setImageAdded] = useState(false); // ['image1', 'image2', 'image3'

  const CDNURL =
    'https://sqdpatjugbkiwgugfjzy.supabase.co/storage/v1/object/public/client_images/';

  const placeholderUrl = `https://sqdpatjugbkiwgugfjzy.supabase.co/storage/v1/object/public/client_images/${user.id}/${clientId}/property_images/.emptyFolderPlaceholder`;

  // Filter out the placeholder URL

  // Update the state

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
            if (
              image.name === 'YardMan.png' ||
              image.name === 'YardMan1.png' ||
              image.name === 'YardMan2.png' ||
              image.name === 'YardMan3.png' ||
              image.name === 'YardMan4.png' ||
              image.name === 'YardMan5.png'
            ) {
              setClientImage(CDNURL + yardManImage);
              break;
            }
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

  useEffect(() => {
    async function fetchPropertyImages() {
      const { data, error } = await supabase.storage
        .from('client_images')
        .list(user.id + '/' + clientId + '/' + 'property_images');

      if (data) {
        // Map the data to an array of image URLs
        const imageUrls = data.map(
          (image) =>
            `${CDNURL}${user.id}/${clientId}/property_images/${image.name}`
        );

        // Update the state with the image URLs
        setClientPropertyImages(imageUrls);
        if (clientPropertyImages[0] === placeholderUrl) {
          setClientPropertyImages(clientPropertyImages.slice(1));
        }
      }

      if (error) {
        console.error('Error fetching images:', error);
      }
    }

    fetchPropertyImages();
  }, [clientId, clientImg, user.id, imageAdded]);

  const handleNextImage = (e) => {
    e.stopPropagation();
    setCurrentImageIndex((prevIndex) => {
      if (clientPropertyImages.length > 0) {
        return (prevIndex + 1) % clientPropertyImages.length;
      } else {
        return prevIndex;
      }
    });
  };

  const handlePreviousImage = (e) => {
    e.stopPropagation();
    setCurrentImageIndex((prevIndex) => {
      if (clientPropertyImages.length > 0) {
        return (
          (prevIndex - 1 + clientPropertyImages.length) %
          clientPropertyImages.length
        );
      } else {
        return prevIndex;
      }
    });
  };

  async function handleClientClick(e) {
    e.stopPropagation();
    const { data, error } = await supabase
      .from('Clients')
      .select('*')
      .match({ client_UUID: clientId });

    if (data) {
      setEditedClient(data);

      setEditClient(true);
    }
  }

  async function handleClientPropertyImageInspect(e) {
    e.stopPropagation();
    setShowClientPropertyImageModal(true);
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
      {showClientPropertyImageModal ? (
        <ClientPropertyImageModal
          clientPropertyImages={clientPropertyImages}
          setShowClientPropertyImageModal={setShowClientPropertyImageModal}
          showClientPropertyImageModal={showClientPropertyImageModal}
          setClientPropertyImages={setClientPropertyImages}
          setImageAdded={setImageAdded}
          clientName={clientName}
          UUID={user.id}
          client_UUID={clientId}
        />
      ) : null}

      {confirmation ? (
        <ConfirmDelete
          clientName={clientName}
          setConfirmation={setConfirmation}
          handleDeleteClient={handleDeleteClient}
        />
      ) : null}

      {editClient ? (
        <EditClientModal
          setEditedClient={setEditedClient}
          editedClient={editedClient}
          setClientsUpdated={setClientsUpdated}
          setEditClient={setEditClient}
          initialClientName={clientName}
          user={user}
          setClients={setClients}
          handleDeleteClient={handleDeleteClient}

          // clientBalance={clientBalance}
        />
      ) : null}
      <div className="clientContainer">
        <button
          className="client-delete-button"
          title={`Delete Client ${clientName} `}
          onClick={(e) => {
            e.stopPropagation();
            setConfirmation(true);
          }}
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
              <img src={clientImage} className="clientProfileImage" />
              <h2 className="clientName">Name: {clientName}</h2>
            </div>
            <div className="propertyImagesTitle">
              <h2>
                {clientPropertyImages[0] !==
                'https://sqdpatjugbkiwgugfjzy.supabase.co/storage/v1/object/public/client_images/addImage.jpg'
                  ? 'Property Images'
                  : ''}
              </h2>
            </div>
            {clientPropertyImages[0] !==
            'https://sqdpatjugbkiwgugfjzy.supabase.co/storage/v1/object/public/client_images/addImage.jpg' ? (
              <div className="PropertyImageContainer">
                <button
                  onClick={(e) => handlePreviousImage(e)}
                  className="previousClientPropertyImageButton"
                >{`<`}</button>

                <img
                  onClick={(e) => handleClientPropertyImageInspect(e)}
                  className="clientPropertyImages"
                  src={clientPropertyImages[currentImageIndex]}
                  // width="30px"
                  // height="30px"
                  alt={clientPropertyImages[currentImageIndex]?.name}
                />

                <button
                  onClick={(e) => handleNextImage(e)}
                  className="nextClientPropertyImageButton"
                >{`>`}</button>
              </div>
            ) : (
              <div className="addPropertyImagesContainer">
                <h3 className="addPropertyImagesTitle">Add Property Images</h3>
                <FcAddImage
                  className="addPropertyImagesButton"
                  onClick={(e) => handleClientPropertyImageInspect(e)}
                />
              </div>
            )}
            <div className="clientCardInformation">
              {/* <h2 className="clientName">Name: {clientName}</h2> */}

              <h3 className="clientAddress">Address: {clientAddress}</h3>
              <h3 className="clientPhone">Phone Number: {clientPhone}</h3>
              <h3 className="clientEmail">Email: {clientEmail}</h3>
              <p className="clientNotes">Notes: {clientNotes}</p>
              <h3 className="clientPay">
                Rate: $ {clientRate} {isHourly ? <p>/hr</p> : <p>/wk</p>}
              </h3>

              <h4 className="clientBalance">Balance: $ {clientBalance}</h4>
            </div>
          </div>
        </div>
        <div className="editClientButtonContainer">
          <button
            className="editClientButton"
            onClick={(e) => handleClientClick(e)}
          >
            Edit {clientName}'s Profile
          </button>
        </div>
      </div>
    </>
  );
}
