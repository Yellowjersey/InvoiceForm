import { useRef, useState } from 'react';
import { supabase } from '../supabase/supabase';
import { FaGear } from 'react-icons/fa6';
import { IoMdClose } from 'react-icons/io';
import { CiLogout } from 'react-icons/ci';

export default function SettingsModal({
  swapModal,
  logout,
  uppercaseEmail,
  userAccount,
  setUserAccount,
  setUserUpdated,
  setImagePath,
  imagePath,
  CDNURL,
}) {
  const modalRef = useRef();
  const [settingsModalFirstName, setSettingsModalFirstName] = useState('');
  const [settingsModalLastName, setSettingsModalLastName] = useState('');
  const [settingsModalImage, setSettingsModalImage] = useState(
    userAccount?.user_image
  );
  const [settingsModalCompanyName, setSettingsModalCompanyName] = useState('');
  const [previewUrl, setPreviewUrl] = useState(imagePath);
  const [fileName, setFileName] = useState('Choose An Image');
  const [initialFirstName, setInitialFirstName] = useState(
    userAccount?.First_Name
  );
  const [initialLastName, setInitialLastName] = useState(
    userAccount?.Last_Name
  );
  const [initialCompanyName, setInitialCompanyName] = useState(
    userAccount?.Company_Name
  );
  const [isEditOpen, setIsEditOpen] = useState(false);

  function handleClick(e) {
    logout();
    if (e.target === modalRef.current) {
      swapModal(false);
    }
  }

  async function handleUpdate(e) {
    e.preventDefault();

    setUserUpdated(true);
    // setClientsUpdated(true);

    // Fetch client data
    const { data: userData, error: userError } = await supabase
      .from('Users')
      .select('*')
      .filter('id', 'eq', userAccount?.id);

    // Check if there's an error fetching client data
    if (userError) {
      console.error('Error fetching client data:', userError);
      return;
    }

    // List all files in the client's folder
    const { data: storageData, error: storageError } = await supabase.storage
      .from('user_images')
      .list(`${userData?.id}/`);

    // Check if there's an error listing files
    if (storageError) {
      console.error('Error listing files:', storageError);
      return;
    }

    // If the client's folder is empty, create a new file
    if (storageData && storageData.length === 0) {
      const slicedImage = settingsModalImage?.name?.replace(/\s/g, '');
      const pathName = `${userAccount?.id}/${slicedImage}`;

      // Upload the file
      if (slicedImage !== undefined) {
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('user_images')
          .upload(userAccount?.id + '/' + slicedImage, settingsModalImage, {
            cacheControl: '3600',
          });

        // Check if there's an error uploading the file
        if (uploadError) {
          console.error('Error uploading file:', uploadError);
          return;
        }
        if (uploadData) {
          setImagePath(CDNURL + pathName);
        }
      }
      // Update the client data with the new image path
      const { data: updateData, error: updateError } = await supabase
        .from('Users')
        .update({
          First_Name: settingsModalFirstName || initialFirstName,
          Last_Name: settingsModalLastName || initialLastName,
          Company_Name: settingsModalCompanyName || initialCompanyName,
          user_image: slicedImage,
        })
        .match({ id: userAccount?.id });

      const { data: updateData2, error: updateError2 } = await supabase
        .from('Users')
        .select('*');

      const loggedInUser = updateData2.filter(
        (user) => user.id === userAccount.id
      );

      setUserAccount(loggedInUser[0]);

      // Check if there's an error updating the client data
      if (updateError) {
        console.error('Error updating client data:', updateError);
        return;
      }
    }
    // setEditClient(false);
    setUserUpdated(false);
    swapModal(false);
  }

  function handleClick(e) {
    logout();
    if (e.target === modalRef.current) {
      swapModal(false);
    }
  }

  return (
    <div className="settingsModalContent">
      <div className="userInfoDiv">
        {initialFirstName && (
          <div className="settingsUserProfileDiv">
            <img src={imagePath} className="settingsUserImage" alt="User" />
            <div className="settingsNameContainer">
              <h2 className="settingsName">First Name: {initialFirstName}</h2>
              {initialLastName && (
                <h2 className="settingsName">Last Name: {initialLastName}</h2>
              )}
            </div>
          </div>
        )}
        <div className="settingsCompanyNameEmailContainer">
          {initialCompanyName && (
            <div className="settingsCompanyName">
              <div>Company Name:</div>
              <div>{initialCompanyName}</div>
            </div>
          )}
          <div className="settingsEmail">
            <div>Email:</div>
            <div>{uppercaseEmail}</div>
          </div>
        </div>
        <div className="editUserSettingsContainer">
          {!isEditOpen && (
            <button
              className="openSettingsButton"
              title="Edit User Settings"
              onClick={() => setIsEditOpen(true)}
            >
              <FaGear />
            </button>
          )}
          {!isEditOpen && (
            <button
              onClick={(e) => handleClick(e)}
              ref={modalRef}
              className="logoutButton"
            >
              <CiLogout />
              Log Out
            </button>
          )}
        </div>
        <div className="settingsFormContainer">
          {isEditOpen && (
            <button
              className="closeSettingsButton"
              title="Close Settings"
              onClick={() => setIsEditOpen(false)}
            >
              <IoMdClose />
            </button>
          )}
          {isEditOpen && (
            <form className="settingsForm" onSubmit={(e) => handleUpdate(e)}>
              <div className="settingsModalImageContainer">
                {/* <label>User Image: </label> */}
                <label htmlFor="image" className="custom-file-upload">
                  <img
                    src={previewUrl || imagePath}
                    className="settingsUserImagePreview"
                    alt="User Image"
                  />
                  <div className="custom-file-upload-label">{fileName}</div>
                </label>
                <input
                  type="file"
                  placeholder={userAccount?.user_image || 'Not Required'}
                  id="image"
                  onChange={(e) => {
                    setSettingsModalImage(e.target.files[0]);
                    setPreviewUrl(URL.createObjectURL(e.target.files[0]));
                    setFileName(
                      e.target.files[0]
                        ? e.target.files[0].name
                        : 'Choose An Image'
                    );
                  }}
                />
              </div>
              <div className="settingsModalNameContainer">
                <label htmlFor="FirstName">First Name: </label>
                <input
                  type="text"
                  placeholder={userAccount?.First_Name || 'Not Required'}
                  id="FirstName"
                  value={settingsModalFirstName || ''}
                  onChange={(e) => setSettingsModalFirstName(e.target.value)}
                />
              </div>
              <div className="settingsModalNameContainer">
                <label htmlFor="LastName">Last Name:</label>
                <input
                  type="text"
                  placeholder={userAccount?.Last_Name || 'Not Required'}
                  id="LastName"
                  value={settingsModalLastName || ''}
                  onChange={(e) => setSettingsModalLastName(e.target.value)}
                />
              </div>
              <div className="settingsModalCompanyNameContainer">
                <label htmlFor="CompanyName">Company Name:</label>
                <input
                  type="text"
                  placeholder={userAccount?.Company_Name || 'Not Required'}
                  id="CompanyName"
                  value={settingsModalCompanyName || ''}
                  onChange={(e) => setSettingsModalCompanyName(e.target.value)}
                />
              </div>
              <button className="settingsSubmitButton" type="submit">
                Submit Changes
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
