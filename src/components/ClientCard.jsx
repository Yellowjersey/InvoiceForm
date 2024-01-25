import { useEffect, useState } from 'react';
import EditClientModal from './EditClientModal';
import { supabase } from '../supabase/supabase';
import ConfirmDelete from './ConfirmDelete';
import { FcAddImage } from 'react-icons/fc';
import ClientPropertyImageModal from './ClientPropertyImageModal';
import { Spinner } from 'react-bootstrap';
import { BeatLoader } from 'react-spinners';
import YardDotLoader from './YardDotLoader';

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
  clientZip,
  clientState,
}) {
  const [clientImage, setClientImage] = useState('');
  const [confirmation, setConfirmation] = useState(false);
  const [clientPropertyImages, setClientPropertyImages] = useState([]); // ['image1', 'image2', 'image3'
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showClientPropertyImageModal, setShowClientPropertyImageModal] =
    useState(false); // ['image1', 'image2', 'image3'
  const [imageAdded, setImageAdded] = useState(false); // ['image1', 'image2', 'image3'
  const [loading, setLoading] = useState(true);

  const CDNURL =
    'https://sqdpatjugbkiwgugfjzy.supabase.co/storage/v1/object/public/client_images/';

  // const placeholderUrl = `https://sqdpatjugbkiwgugfjzy.supabase.co/storage/v1/object/public/client_images/${user.id}/${clientId}/property_images/.emptyFolderPlaceholder`;

  const addPropertyImageURL = `https://sqdpatjugbkiwgugfjzy.supabase.co/storage/v1/object/public/client_images/${user.id}/${clientId}/property_images/addPropertyImage.jpg`;

  const firstImageUrl = clientPropertyImages[0]
    ? clientPropertyImages[0].replace(/\/$/, '')
    : '';
  const addPropertyImageUrlNormalized = addPropertyImageURL.replace(/\/$/, '');

  const adjustedCurrentImageIndex =
    firstImageUrl === addPropertyImageUrlNormalized
      ? currentImageIndex + 1
      : currentImageIndex;

  const uppercasedClientName =
    clientName.charAt(0).toUpperCase() + clientName.slice(1);

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
        const addPropertyImageURL = `${CDNURL}${user.id}/${clientId}/property_images/addPropertyImage.jpg`;

        // Find the index of addPropertyImageURL in the array
        const index = data.findIndex(
          (item) => item.name === 'addPropertyImage.jpg'
        );

        // If addPropertyImageURL is in the array, remove it
        if (index !== -1) {
          data.splice(index, 1);
        }

        const imageUrls = data.map(
          (image) =>
            `${CDNURL}${user.id}/${clientId}/property_images/${image.name}`
        );

        // Add addPropertyImageURL to the start of the array
        imageUrls.unshift(addPropertyImageURL);

        const firstImageIndex = imageUrls.findIndex(
          (url) => url !== addPropertyImageURL
        );

        // if(firstImageIndex !== 0 && imageUrls.length > 1) {
        setCurrentImageIndex(firstImageIndex !== -1 ? firstImageIndex : 0);

        // Update the state with the image URLs
        setClientPropertyImages(imageUrls);
        setLoading(false);
      }
    }

    fetchPropertyImages();
  }, [clientId, user.id, imageAdded]);

  const handleNextImage = (e) => {
    e.stopPropagation();
    setCurrentImageIndex((prevIndex) => {
      if (clientPropertyImages.length > 0) {
        let nextIndex = (prevIndex + 1) % clientPropertyImages.length;

        // If the next image is addPropertyImageURL, skip it
        if (clientPropertyImages[nextIndex] === addPropertyImageURL) {
          nextIndex = (nextIndex + 1) % clientPropertyImages.length;
        }

        return nextIndex;
      } else {
        return prevIndex;
      }
    });
  };

  const handlePreviousImage = (e) => {
    e.stopPropagation();
    setCurrentImageIndex((prevIndex) => {
      if (clientPropertyImages.length > 0) {
        let newIndex =
          (prevIndex - 1 + clientPropertyImages.length) %
          clientPropertyImages.length;

        // If the previous image is addPropertyImageURL, skip it
        if (clientPropertyImages[newIndex] === addPropertyImageURL) {
          newIndex =
            (newIndex - 1 + clientPropertyImages.length) %
            clientPropertyImages.length;
        }

        return newIndex;
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
    document.body.classList.add('modal-open');
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

  let imagesToPass = clientPropertyImages;

  if (firstImageUrl === addPropertyImageUrlNormalized) {
    imagesToPass = clientPropertyImages.slice(1);
  }

  return (
    <>
      {showClientPropertyImageModal ? (
        <ClientPropertyImageModal
          clientPropertyImages={imagesToPass}
          setShowClientPropertyImageModal={setShowClientPropertyImageModal}
          showClientPropertyImageModal={showClientPropertyImageModal}
          setClientPropertyImages={setClientPropertyImages}
          setImageAdded={setImageAdded}
          clientName={uppercasedClientName}
          UUID={user.id}
          client_UUID={clientId}
          imageAdded={imageAdded}
        />
      ) : null}

      {confirmation ? (
        <ConfirmDelete
          clientName={uppercasedClientName}
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
          initialClientName={uppercasedClientName}
          user={user}
          setClients={setClients}
          handleDeleteClient={handleDeleteClient}

          // clientBalance={clientBalance}
        />
      ) : null}
      <div className="clientContainer">
        <button
          className="client-delete-button"
          title={`Delete Client ${uppercasedClientName} `}
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
              {loading ? (
                <YardDotLoader color={'green'} size={20} loading={loading} />
              ) : (
                <img src={clientImage} className="clientProfileImage" />
              )}
              <h2 className="clientName">Name: {uppercasedClientName}</h2>
            </div>
            <div className="propertyImagesTitle">
              <h3>
                {firstImageUrl === addPropertyImageUrlNormalized &&
                clientPropertyImages.slice(1).length === 0
                  ? ''
                  : 'Property Images'}
              </h3>
            </div>
            {loading ? (
              <YardDotLoader color={'green'} size={20} loading={loading} />
            ) : firstImageUrl === addPropertyImageUrlNormalized &&
              clientPropertyImages.slice(1).length === 0 ? (
              <div className="addPropertyImagesContainer">
                <h3 className="addPropertyImagesTitle">Add Property Images</h3>
                <FcAddImage
                  className="addPropertyImagesButton"
                  onClick={(e) => handleClientPropertyImageInspect(e)}
                />
              </div>
            ) : (
              <div className="PropertyImageContainer">
                <button
                  onClick={(e) => handlePreviousImage(e)}
                  className="previousClientPropertyImageButton"
                >{`<`}</button>

                <img
                  onClick={(e) => handleClientPropertyImageInspect(e)}
                  className="clientPropertyImages"
                  src={clientPropertyImages[currentImageIndex]}
                  alt={`Property image ${clientPropertyImages[currentImageIndex]?.name}`}
                />

                <button
                  onClick={(e) => handleNextImage(e)}
                  className="nextClientPropertyImageButton"
                >{`>`}</button>
              </div>
            )}
            <div className="clientCardInformation">
              {/* <h2 className="clientName">Name: {clientName}</h2> */}

              <h3 className="clientAddress">Address: {clientAddress}</h3>
              <div className="clientZipStateContainer">
                {' '}
                <h3 className="clientZipCard">ZipCode: {clientZip}</h3>
                <h3 className="clientStateCard">State: {clientState}</h3>
              </div>
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
            Edit {uppercasedClientName}'s Profile
          </button>
        </div>
      </div>
    </>
  );
}
