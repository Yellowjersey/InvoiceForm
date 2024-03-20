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

  const timeZones = {
    'Pacific/Midway': '(GMT-11:00) Pacific/Midway',
    'Pacific/Honolulu': '(GMT-10:00) Pacific/Honolulu',
    'America/Anchorage': '(GMT-09:00) America/Anchorage',
    'America/Los_Angeles': '(GMT-08:00) America/Los_Angeles',
    'America/Denver': '(GMT-07:00) America/Denver',
    'America/Phoenix': '(GMT-07:00) America/Phoenix',
    'America/Chicago': '(GMT-06:00) America/Chicago',
    'America/New_York': '(GMT-05:00) America/New_York',
    'America/Caracas': '(GMT-04:30) America/Caracas',
    'America/Halifax': '(GMT-04:00) America/Halifax',
    'America/Santo_Domingo': '(GMT-04:00) America/Santo_Domingo',
    'America/St_Johns': '(GMT-03:30) America/St_Johns',
    'America/Argentina/Buenos_Aires':
      '(GMT-03:00) America/Argentina/Buenos_Aires',
    'America/Sao_Paulo': '(GMT-03:00) America/Sao_Paulo',
    'Atlantic/South_Georgia': '(GMT-02:00) Atlantic/South_Georgia',
    'Atlantic/Cape_Verde': '(GMT-01:00) Atlantic/Cape_Verde',
    'Atlantic/Azores': '(GMT-01:00) Atlantic/Azores',
    'Africa/Casablanca': '(GMT+00:00) Africa/Casablanca',
    'Europe/London': '(GMT+00:00) Europe/London',
    'Europe/Paris': '(GMT+01:00) Europe/Paris',
    'Europe/Istanbul': '(GMT+03:00) Europe/Istanbul',
    'Asia/Dubai': '(GMT+04:00) Asia/Dubai',
    'Asia/Kolkata': '(GMT+05:30) Asia/Kolkata',
    'Asia/Dhaka': '(GMT+06:00) Asia/Dhaka',
    'Asia/Shanghai': '(GMT+08:00) Asia/Shanghai',
    'Asia/Tokyo': '(GMT+09:00) Asia/Tokyo',
    'Australia/Sydney': '(GMT+10:00) Australia/Sydney',
    'Pacific/Noumea': '(GMT+11:00) Pacific/Noumea',
    'Pacific/Auckland': '(GMT+13:00) Pacific/Auckland',
  };

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
          Time_Zone: selectedTimeZone || userAccount.Time_Zone,
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

  const [selectedTimeZone, setSelectedTimeZone] = useState('');

  const handleChange = (event) => {
    setSelectedTimeZone(event.target.value);
  };

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
          <div className="settingsEmail">
            <div>TimeZone:</div>
            <div>{userAccount.Time_Zone}</div>
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

              <div className="settingsModalTimeZoneContainer">
                <label htmlFor="timeZone">Select Time Zone:</label>
                <select
                  id="TimeZone"
                  value={selectedTimeZone}
                  onChange={handleChange}
                >
                  <option value="">Select a time zone...</option>
                  {Object.entries(timeZones).map(([zone, label]) => (
                    <option key={zone} value={zone}>
                      {label}
                    </option>
                  ))}
                </select>
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
