import React, { useEffect, useState } from 'react';
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
  useNavigate,
} from 'react-router-dom';
import Home from './pages/Home';
import CreateInvoice from './pages/CreateInvoice';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import Clients from './pages/Clients';
import { supabase } from './supabase/supabase';
import LoginRegisterPage from './pages/LoginRegisterPage';

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { MoonLoader } from 'react-spinners';
import { Toast } from 'react-bootstrap';
import AppLayout from './components/AppLayout';
import { replace } from 'formik';

function App() {
  const [clients, setClients] = useState(null);
  const [user, setUser] = useState(null);

  const [isLoginPage, setIsLoginPage] = useState(true);
  const [isLoggingOutandIn, setIsLoggingOutandIn] = useState(false);
  const [UUID, setUUID] = useState('');
  const [userAccount, setUserAccount] = useState('');
  const [clientsUpdated, setClientsUpdated] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [editClient, setEditClient] = useState(false);
  const [loggedIn, setLoggedIn] = useState(false);
  const [userImage, setUserImage] = useState('YardMan.png');
  const navigate = useNavigate();

  useEffect(() => {
    // setIsLoggingOutandIn(true);
    supabase
      .from('Users')
      .select('*')
      .then((users) => {
        const loggedInAccount = users.data.find((user) => user.id === UUID);

        if (!loggedInAccount || loggedInAccount === undefined) {
          pushData();
        }

        if (loggedInAccount) {
          setUserAccount(loggedInAccount);
        }

        return supabase.from('Clients').select('*');
      })
      .then((clients) => {
        const loggedInClients = clients.data.filter(
          (client) => client.user_UUID === UUID
        );

        setClients(loggedInClients);
        // setIsLoggingOutandIn(false);
      });
  }, [UUID, clientsUpdated]);

  useEffect(() => {
    if (!user) {
      navigate('/', { replace: true });
    }
  }, [user]);

  // Inside your component

  function swapModal() {
    setShowModal(!showModal);
  }

  async function getUserEmail() {
    const { data: userEmailData, error: userEmailError } =
      await supabase.auth.getUser();

    return userEmailData;
  }

  async function pushData() {
    const userEmail = await getUserEmail();

    const { data: userProfile, error: userError } = await supabase
      .from('Users')
      .insert([
        {
          id: UUID,
          email: userEmail?.user?.email,
          user_image: `YardMan.png`,
        },
      ]);

    if (!userError) {
      setUUID(userEmail?.user?.id);
    }
    if (userError) {
      console.error('Error fetching client data:', userError);
    }
  }

  // useEffect(() => {
  //   if (!UUID) return;

  //   async function pushData() {
  //     const { data: userProfile, error: userError } = await supabase
  //       .from('Users')
  //       .insert([
  //         {
  //           id: UUID,
  //           email: userAccount?.email,
  //           user_image: `https://picsum.photos/200`,
  //         },
  //       ]);
  //   }
  //   if (UUID !== undefined && UUID !== null && user.id !== UUID) {
  //     pushData();
  //   }
  // }, [UUID]);

  async function clientDataQueryForUUID() {
    const { data, error } = await supabase
      .from('Clients')
      .select('*')
      .eq('user_UUID', UUID);
    if (error) {
      console.error('Error fetching client data:', error);
    }

    return data;
  }

  // async function getUserAccount(session) {
  //   if (session.user === null) return;
  // }

  function showToastMessage(type) {
    switch (type) {
      case 'signIn':
        toast.success('You have successfully signed in!', {
          position: 'top-center',
          autoClose: 3000,
          hideProgressBar: true,
          closeOnClick: true,
        });
        break;
      case 'signOut':
        toast.success('You have successfully logged out!', {
          position: 'top-center',
          autoClose: 3000,
          hideProgressBar: true,
          closeOnClick: true,
        });
        break;
      case 'signUp':
        toast.info('You must confirm your email before signing in!', {
          position: 'top-center',
          autoClose: 3000,
          hideProgressBar: true,
          closeOnClick: true,
        });
        break;
      case 'invalidcreditials':
        toast.error('Please enter valid login creditials!', {
          position: 'top-center',
          autoClose: 3000,
          hideProgressBar: true,
          closeOnClick: true,
        });
        break;
      case 'emailEmpty':
        toast.error('Please enter a valid email address!', {
          position: 'top-center',
          autoClose: 3000,
          hideProgressBar: true,
          closeOnClick: true,
        });
        break;
      case 'passwordEmpty':
        toast.error('Please enter a valid password!', {
          position: 'top-center',
          autoClose: 3000,
          hideProgressBar: true,
          closeOnClick: true,
        });
        break;
      case 'invalidEmail':
        toast.error('Please enter a valid email address!', {
          position: 'top-center',
          autoClose: 3000,
          hideProgressBar: true,
          closeOnClick: true,
        });
        break;
      default:
        toast.error('An unknown error occurred.', {
          position: 'top-center',
          autoClose: 3000,
          hideProgressBar: true,
          closeOnClick: true,
        });
        break;
    }
  }

  async function signUpNewUser(newUser) {
    const { data, error: newUserProfileError } = await supabase.auth.signUp({
      email: newUser.email,
      password: newUser.password,
      data: {
        id: newUser.UUID,
      },

      options: {
        emailRedirectTo: 'https//example.com/welcome',
      },
      then: showToastMessage('signUp'),
    });

    if (newUserProfileError) {
      console.error('Error creating new user:', newUserProfileError);
    }

    setIsLoginPage(true);
  }

  // let error = null;

  return (
    <div className="app">
      <ToastContainer />
      <Routes>
        <Route
          index
          path="/"
          element={
            <LoginRegisterPage
              isLoginPage={isLoginPage}
              setIsLoginPage={setIsLoginPage}
              setUser={setUser}
              signUpNewUser={signUpNewUser}
              // signInWithEmail={signInWithEmail}
              showToastMessage={showToastMessage}
              setUUID={setUUID}
              setIsLoggingOutandIn={setIsLoggingOutandIn}
            />
          }
        />
        {/* {isLoggingOutandIn && (
          <div className="loading">
          <MoonLoader
          size={150}
          color={'#12bc1b'}
          loading={isLoggingOutandIn}
          />
          </div>
        )} */}
        {/* {user === null ? (
          <div>
          <LoginRegisterPage
          isLoginPage={isLoginPage}
          setIsLoginPage={setIsLoginPage}
          setUser={setUser}
          signUpNewUser={signUpNewUser}
          signInWithEmail={signInWithEmail}
          showToastMessage={showToastMessage}
          />
          </div> */}
        <Route
          path={`/${UUID}/*`}
          element={
            <AppLayout
              user={user}
              UUID={UUID}
              userAccount={userAccount}
              clientDataQueryForUUID={clientDataQueryForUUID}
              setClientsUpdated={setClientsUpdated}
              showModal={showModal}
              setShowModal={setShowModal}
              swapModal={swapModal}
              setClients={setClients}
              setEditClient={setEditClient}
              editClient={editClient}
              clients={clients}
              // getUserAccount={getUserAccount}
              setUUID={setUUID}
              setUser={setUser}
              setIsLoggingOutandIn={setIsLoggingOutandIn}
              setUserAccount={setUserAccount}
              showToastMessage={showToastMessage}
            />
          }
        />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </div>
  );
}

export default App;
