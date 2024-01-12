import { useRef, useState } from 'react';
import { supabase } from '../supabase/supabase';

export default function SettingsModal({
  swapModal,
  logout,
  uppercaseEmail,
  userAccount,
  setUserAccount,
  setUserUpdated,
}) {
  const modalRef = useRef();
  const [settingsModalName, setSettingsModalName] = useState(userAccount?.Name);
  const [settingsModalImage, setSettingsModalImage] = useState(
    userAccount?.user_image
  );
  const [settingsModalCompanyName, setSettingsModalCompanyName] = useState(
    userAccount?.Company_Name
  );

  async function handleUpdate(e) {
    e.preventDefault();
    console.log();

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
      }
      // Update the client data with the new image path
      const { data: updateData, error: updateError } = await supabase
        .from('Users')
        .update({
          Name: settingsModalName,
          Company_Name: settingsModalCompanyName,
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
      <div className="settingsFormContainer">
        <form className="settingsForm" onSubmit={(e) => handleUpdate(e)}>
          <div className="settingsModalImageContainer">
            <label htmlFor="image">User Image: </label>
            <input
              type="file"
              placeholder={userAccount?.user_image || 'Not Required'}
              id="image"
              onChange={(e) => setSettingsModalImage(e.target.files[0])}
            />
          </div>
          <div className="settingsModalNameContainer">
            <label htmlFor="Name">Name: </label>
            <input
              type="text"
              placeholder={userAccount?.Name || 'Not Required'}
              id="Name"
              value={settingsModalName}
              onChange={(e) => setSettingsModalName(e.target.value)}
            />
          </div>
          <div className="settingsModalCompanyNameContainer">
            <label htmlFor="CompanyName">Company Name: </label>
            <input
              type="text"
              placeholder={userAccount?.Company_Name || 'Not Required'}
              id="CompanyName"
              value={settingsModalCompanyName}
              onChange={(e) => setSettingsModalCompanyName(e.target.value)}
            />
          </div>
          <button>Submit</button>
        </form>
      </div>
      <h2 className="settingsEmail">Email: {uppercaseEmail}</h2>
      <button
        onClick={(e) => handleClick(e)}
        ref={modalRef}
        className="settingsButton"
      >
        Log Out
      </button>
    </div>
  );
}
