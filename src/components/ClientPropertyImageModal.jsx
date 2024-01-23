import { supabase } from '../supabase/supabase';
import { insert } from 'formik';
import { useEffect, useState } from 'react';
import { CiCirclePlus } from 'react-icons/ci';
import PropertyImageCards from './PropertyImageCards';

function ClientPropertyImageModal({
  clientPropertyImages,
  showClientPropertyImageModal,
  setShowClientPropertyImageModal,
  setImageAdded,
  clientName,
  UUID,
  client_UUID,
  setClientPropertyImages,
}) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [fileInserted, setFileInserted] = useState(false);
  const [filesToUpload, setFilesToUpload] = useState([]);
  const [previewUrls, setPreviewUrls] = useState([]);

  const capitilizeClientName =
    clientName.charAt(0).toUpperCase() + clientName.slice(1);

  // Define the placeholder URL
  const placeholderUrl = `https://sqdpatjugbkiwgugfjzy.supabase.co/storage/v1/object/public/client_images/${UUID}/${client_UUID}/property_images/.emptyFolderPlaceholder`;
  const placeholderImg = `https://sqdpatjugbkiwgugfjzy.supabase.co/storage/v1/object/public/client_images/addImage.jpg`;

  // Filter out the placeholder URL
  const validImages = clientPropertyImages.filter(
    (url) => url !== placeholderUrl
  );

  useEffect(() => {
    if (clientPropertyImages[0] === placeholderUrl) {
      // setClientPropertyImages([placeholderImg]);
    }

    // Create object URLs from the files in filesToUpload
    const urls = filesToUpload.map((file) => URL.createObjectURL(file));

    // Store the URLs in the previewUrls state
    setPreviewUrls(urls);

    // Revoke the object URLs when the component is unmounted
    return () => urls.forEach((url) => URL.revokeObjectURL(url));
  }, [filesToUpload]);

  const handleFileChange = (e) => {
    // Log e.target.files to the console

    if (e.target.files.length > 0) {
      setFilesToUpload((prevFiles) => [...prevFiles, e.target.files[0]]);
    }
  };

  async function insertClient(e) {
    e.preventDefault();

    // Get the bucket name
    const bucket = `client_images/${UUID}/${client_UUID}/property_images`;

    // List all the files in the bucket

    const { data: files, error: listError } = await supabase.storage
      .from('client_images')
      .list(`${UUID}/${client_UUID}/property_images`);

    // If there was an error listing the files, log it and return
    if (listError) {
      console.error('Error listing files:', listError.message);
      return;
    }

    // if (
    //   clientPropertyImages[0] !==
    //     `https://sqdpatjugbkiwgugfjzy.supabase.co/storage/v1/object/public/client_images/${UUID}/${client_UUID}/property_images/.emptyFolderPlaceholder` ||
    //   clientPropertyImages.length === 1
    // ) {
    //   // Delete each file
    //   for (const file of files) {
    //     const { error: deleteError } = await supabase.storage
    //       .from(bucket)
    //       .remove([file.name]);

    //     // If there was an error deleting the file, log it
    //     if (deleteError) {
    //       console.error('Error deleting file:', deleteError.message);
    //     }
    //   }
    // }

    // Upload the new files
    for (const file of filesToUpload) {
      const { data: filesuploaded, error: uploadError } = await supabase.storage
        .from('client_images')
        .upload(`${UUID}/${client_UUID}/property_images/${file.name}`, file);
      // If there was an error uploading the file, log it
      if (uploadError) {
        console.error('Error uploading file:', uploadError.message);
      }
      if (filesuploaded) {
        setClientPropertyImages((prev) => [...prev, file[0]]);
      }
    }
  }

  function handleModalCloseCLick(e) {
    e.stopPropagation();
    setShowClientPropertyImageModal(false);
  }

  return (
    <div className="clientPropertyImageModal">
      <div className="clientPropertyImageModalContainer">
        <button className="closeModalButton">X</button>
        <div className="clientPropertyImageModalHeader">
          <h2>{capitilizeClientName}'s Property Images</h2>
        </div>
        <div className="clientPropertyImageModalBody">
          {/* <img
           src={clientPropertyImages[currentImageIndex]} /> */}
          {clientPropertyImages.map((image, index) => {
            return (
              // <div key={index} className="propertyImageContainers">
              //   <img src={image} />
              // </div>
              <PropertyImageCards image={image} index={index} />
            );
          })}
          {previewUrls.map((url, index) => (
            <div key={index} className="propertyImageContainers">
              {/* Display the image for the file */}
              <img src={url} />
            </div>
          ))}
          <form
            className="clientPropertyImageAddImageButtonContainer"
            onSubmit={(e) => insertClient(e)}
          >
            <label htmlFor="clientPropertyImageAddImageButton">
              <CiCirclePlus className="clientPropertyImageAddImageButton" />
            </label>
            <input
              type="file"
              id="clientPropertyImageAddImageButton"
              onChange={handleFileChange}
            />
            {filesToUpload.length !== 0 && (
              <button
                type="submit"
                className="addClientPropertyImageFormSubmitButton"
              >
                Submit
              </button>
            )}
          </form>
        </div>
      </div>
      <div
        className="clientPropertyImageModalBackground"
        onClick={(e) => handleModalCloseCLick(e)}
      ></div>
    </div>
  );
}

export default ClientPropertyImageModal;
