import React, { useState } from 'react';
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
  const [clients, setClients] = useState([]);
  const [user, setUser] = useState(null);
  const [notLoggedIn, setNotLoggedIn] = useState(user === null ? true : false);
  const [isLoginPage, setIsLoginPage] = useState(true);
  const [isLoggingOutandIn, setIsLoggingOutandIn] = useState(false);

  supabase.auth.onAuthStateChange((event, session) => {
    setUser(session ? session.user : null);
  });

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
      options: {
        emailRedirectTo: 'https//example.com/welcome',
      },
      then: showToastMessage('signUp'),
    });
    setIsLoginPage(true);
  }

  async function logout() {
    setIsLoggingOutandIn(true);
    await supabase.auth.signOut();

    setUser(null);
    showToastMessage('signOut');
    setIsLoggingOutandIn(false);
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
      const { data, error: signInError } =
        await supabase.auth.signInWithPassword({
          email: user.email,
          password: user.password,
        });

      error = signInError;
      if (!error) {
        showToastMessage('signIn');
      }
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
            <Sidebar setClients={setClients} user={user} />
            <div className="content-container">
              <Header logout={logout} />
              <div className="">
                {/* {notLoggedIn ? (
              <Routes>
              <Route
              path="/login-register"
              element={
                
              }
              />
              </Routes>
            ) : ( */}
                <Routes>
                  <Route exact path="/" element={<Home clients={clients} />} />
                  <Route path="/createinvoice" element={<CreateInvoice />} />
                  <Route
                    path="/clients"
                    element={
                      <Clients clients={clients} setClients={setClients} />
                    }
                  />
                </Routes>
                {/* )} */}
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
