import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
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

function App() {
  const [clients, setClients] = useState(null);
  const [user, setUser] = useState(null);

  const [isLoginPage, setIsLoginPage] = useState(true);
  const [isLoggingOutandIn, setIsLoggingOutandIn] = useState(false);
  const [UUID, setUUID] = useState('');
  const [userAccount, setUserAccount] = useState(user);
  const [clientsUpdated, setClientsUpdated] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [editClient, setEditClient] = useState(false);
  const [loggedIn, setLoggedIn] = useState(false);

  useEffect(() => {
    setIsLoggingOutandIn(true);
    supabase
      .from('Users')
      .select('*')
      .then((users) => {
        const loggedInAccount = users.data.find((user) => user.id === UUID);

        if (loggedInAccount) {
          setUserAccount(loggedInAccount);
        }

        // Introduce a delay before setting loading to false
        setTimeout(() => {
          setIsLoggingOutandIn(false);
        }, 1000); // 1000ms = 1 second
      });
  }, [user]);

  function swapModal() {
    setShowModal(!showModal);
  }

  useEffect(() => {
    async function clientQuery() {
      const res = await clientDataQueryForUUID();
      setClients(res);
    }

    clientQuery();
  }, [clientsUpdated, user]);

  // useEffect(() => {
  //   setClientsUpdated(false);
  // }, [clients]);

  // useEffect(() => {
  //   const fetchClients = async () => {
  //     if (UUID) {
  //       const results = await clientDataQueryForUUID();
  //       setClients(results);
  //     }
  //   };

  //   fetchClients();
  // }, [UUID]);

  useEffect(() => {
    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (event === 'SIGNED_IN') {
          setUser(session.user);
          setUUID(session.user.id);

          if (!userAccount) {
            getUserAccount(session.user);
          }
        }
      }
    );
  }, []);

  useEffect(() => {
    if (!UUID) return;

    async function pushData() {
      const { data: userProfile, error: userError } = await supabase
        .from('Users')
        .insert([
          {
            id: UUID,
            email: userAccount?.email,
            user_image: `https://picsum.photos/200`,
          },
        ]);
    }
    if (UUID !== undefined && UUID !== null) {
      pushData();
    }
  }, [UUID]);

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

  // const subscription = supabase.auth.onAuthStateChange((event, session) => {
  //   console.log(event);
  //   if (event === 'SIGNED_IN') {
  //     setUser(session.user);
  //     setUUID(session.user.id);

  //     // setUserAccount(session.user);
  //     getUserAccount(session.user);
  //   }
  //   if (event === 'SIGNED_OUT') {
  //     setUser(null);
  //     setUserAccount('');
  //     setUUID('');
  //   }
  // });

  async function getUserAccount(session) {
    if (session.user === null) return;
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
    const { data, error } = await supabase.auth.signUp({
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

  async function logout() {
    setIsLoggingOutandIn(true);
    supabase.auth
      .signOut()
      .then(() => {
        setUser(null);
        showToastMessage('signOut');
        setIsLoggingOutandIn(false);

        setUserAccount('');
        setUUID('');
      })
      .catch((error) => {
        console.error('Error signing out:', error);
        setIsLoggingOutandIn(false);
      });
  }

  let error = null;

  async function signInWithEmail(user) {
    setIsLoggingOutandIn(true);
    if (
      user !== null &&
      user !== undefined &&
      user.email !== '' &&
      user.password !== ''
    ) {
      const { user: session, error: signInError } =
        await supabase.auth.signInWithPassword({
          email: user.email,
          password: user.password,
        });

      // if (!signInError) {
      //   setUser(session.user);
      //   setUUID(session.user.id);
      // }
      if (signInError) {
        console.error('Error signing in:', signInError);
        return;
      }

      setIsLoggingOutandIn(false);

      if (error && error.message === 'Invalid login credentials.') {
        showToastMessage('invalidcreditials');
        return;
      } else if (user.email === '') {
        showToastMessage('emailEmpty');
        return;
      } else if (user.password === '') {
        showToastMessage('passwordEmpty');
        return;
      } else if (error && error.message === 'Email not confirmed') {
        showToastMessage('signUp');
        return;
      }

      if (error) {
        showToastMessage();
      }
    }
  }

  return (
    <Router>
      <div>
        {isLoggingOutandIn && (
          <div className="loading">
            <MoonLoader
              size={150}
              color={'#12bc1b'}
              loading={isLoggingOutandIn}
            />
          </div>
        )}
        {user === null ? (
          <div>
            <LoginRegisterPage
              isLoginPage={isLoginPage}
              setIsLoginPage={setIsLoginPage}
              setUser={setUser}
              signUpNewUser={signUpNewUser}
              signInWithEmail={signInWithEmail}
              showToastMessage={showToastMessage}
            />
            <ToastContainer />
          </div>
        ) : (
          <div className="Applayout">
            <Sidebar
              user={user}
              UUID={UUID}
              userAccount={userAccount}
              clientDataQueryForUUID={clientDataQueryForUUID}
              setClientsUpdated={setClientsUpdated}
              showModal={showModal}
              setShowModal={setShowModal}
              swapModal={swapModal}
              setClients={setClients}
            />
            <div className="content-container">
              <Header logout={logout} userAccount={userAccount} />
              <div className="center-content">
                <Routes>
                  <Route exact path="/" element={<Home clients={clients} />} />
                  <Route path="/createinvoice" element={<CreateInvoice />} />
                  <Route
                    path="/clients"
                    element={
                      <Clients
                        clients={clients}
                        showModal={showModal}
                        setShowModal={setShowModal}
                        swapModal={swapModal}
                        clientDataQueryForUUID={clientDataQueryForUUID}
                        UUID={UUID}
                        setClientsUpdated={setClientsUpdated}
                        editClient={editClient}
                        setEditClient={setEditClient}
                        setClients={setClients}
                      />
                    }
                  />
                </Routes>
              </div>
            </div>
            <ToastContainer />
          </div>
        )}
      </div>
    </Router>
  );
}

export default App;
