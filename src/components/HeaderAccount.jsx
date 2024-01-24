import React, { useEffect, useState } from 'react';
import { MdKeyboardArrowDown } from 'react-icons/md';
import Modal from './Modal';
import SettingsModal from './SettingsModal';
import { supabase } from '../supabase/supabase';
import { useNavigate } from 'react-router-dom';
import YardDotLoader from './YardDotLoader';

function HeaderAccount({
  setShowModal,
  showModal,
  setIsLoginPage,
  userAccount,
  setUUID,
  setUser,
  setIsLoggingOutandIn,
  setUserAccount,
  showToastMessage,
  user,
}) {
  const [shouldLogout, setShouldLogout] = useState(false);
  const [userUpdated, setUserUpdated] = useState(false);
  const [imagePath, setImagePath] = useState('');
  const navigate = useNavigate();

  const [userImage, setUserImage] = useState('');
  const [userName, setUserName] = useState('');
  const [loading, setLoading] = useState(false);

  const uppercaseEmail = userAccount?.email
    ? userAccount?.email?.charAt(0)?.toUpperCase() +
      userAccount?.email?.slice(1)
    : '';
  const CDNURL =
    'https://sqdpatjugbkiwgugfjzy.supabase.co/storage/v1/object/public/user_images/';

  useEffect(() => {
    setLoading(true);
    async function fetchImage() {
      const { data, error } = await supabase.storage
        .from('user_images')
        .list(user.id + '/');

      const yardManImage =
        'YardMan' + Math.floor(Math.random() * 5 + 1) + '.png';

      if (data === null || data === undefined || data.length === 0) {
        setUserImage(CDNURL + yardManImage);
        setImagePath(CDNURL + yardManImage);
      }

      if (data !== null) {
        for (const image of data) {
          if (image.name === userAccount?.user_image) {
            const imageUrl = `${CDNURL}${user.id}/${image.name}`;
            setUserImage(imageUrl);
            setImagePath(imageUrl);

            break; // Exit the loop once the image is found
          }
        }
      }

      if (error) {
        console.error('Error fetching image:', error);
      }
      setLoading(false);
    }

    fetchImage();
    if (userAccount?.First_Name && userAccount?.Last_Name) {
      setUserName(userAccount.First_Name + ' ' + userAccount.Last_Name);
    } else if (userAccount?.First_Name && !userAccount?.Last_Name) {
      setUserName(userAccount.First_Name);
    } else if (!userAccount?.First_Name) {
      setUserName(uppercaseEmail);
    }
  }, [user.id, userAccount?.user_image, userUpdated]);

  function toggleModal() {
    setShowModal(!showModal);
  }

  // Inside your component

  useEffect(() => {
    if (shouldLogout) {
      navigate('/login', { replace: true });
    }
  }, [shouldLogout]);

  async function logout() {
    setIsLoggingOutandIn(true);
    supabase.auth
      .signOut()
      .then(() => {
        setUser(null);
        showToastMessage('signOut');
        setIsLoggingOutandIn(false);
        setShouldLogout(true);
        setUserAccount('');
        setUUID('');
        setIsLoginPage(true);
      })
      .catch((error) => {
        console.error('Error signing out:', error);
        setIsLoggingOutandIn(false);
      });
  }

  return (
    <div className="headeraccount">
      <div>
        {loading ? (
          <YardDotLoader color={'green'} size={10} loading={loading} />
        ) : (
          <img src={userImage} className="headeraccount-avatar" alt="avatar" />
        )}
      </div>
      {showModal && (
        <Modal
          swapModal={toggleModal}
          className={'settingsModal'}
          ModalForm={
            <SettingsModal
              logout={logout}
              swapModal={toggleModal}
              uppercaseEmail={uppercaseEmail}
              userAccount={userAccount}
              setUserAccount={setUserAccount}
              setUserUpdated={setUserUpdated}
              setImagePath={setImagePath}
              imagePath={imagePath}
              CDNURL={CDNURL}
            />
          }
        />
      )}
      <div className="header-text-Container">
        <div className="headeraccount-text">Welcome Back!</div>
        <div className="headeraccount-name">{userName}</div>
      </div>

      <div onClick={() => toggleModal()} className="headeraccount-arrow">
        <MdKeyboardArrowDown />
      </div>
    </div>
  );
}

export default React.memo(HeaderAccount);
