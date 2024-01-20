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
  const [invoiceSent, setInvoiceSent] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    async function refreshClients() {
      const res = await clientDataQueryForUUID();
      setClients(res);
    }
    refreshClients();
  }, [showModal]);

  useEffect(() => {
    supabase
      .from('Users')
      .select('*')
      .then((users) => {
        const loggedInAccount = users.data.find((user) => user.id === UUID);

        if (
          !isLoginPage &&
          (!loggedInAccount || loggedInAccount === undefined)
        ) {
          pushData();
        }

        //invoices: [],

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
  }, [UUID, clientsUpdated, invoiceSent]);

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

    if (!isLoginPage) {
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
        setUserAccount(userProfile);
        setUserAccount({
          id: UUID,
          email: userEmail?.user?.email,
          user_image: `YardMan.png`,
        });
      }
      if (userError && !isLoginPage) {
        console.error('Error fetching client data:', userError);
      }
    }
  }

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
      case 'invoiceSent':
        toast.success('Your invoice has been successfully sent!', {
          position: 'top-center',
          autoClose: 3000,
          hideProgressBar: true,
          closeOnClick: true,
        });
        break;
      case 'invoiceFailed':
        toast.error('An Error has Occurred while sending your invoice!', {
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
              setUUID={setUUID}
              setUser={setUser}
              setIsLoggingOutandIn={setIsLoggingOutandIn}
              setUserAccount={setUserAccount}
              showToastMessage={showToastMessage}
              invoiceSent={invoiceSent}
              setInvoiceSent={setInvoiceSent}
              setIsLoginPage={setIsLoginPage}
            />
          }
        />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </div>
  );
}

export default App;
