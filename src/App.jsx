import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './pages/Home';
import CreateInvoice from './pages/CreateInvoice';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import Clients from './pages/Clients';
import { supabase } from './supabase/supabase';
import LoginRegisterPage from './pages/LoginRegisterPage';
import { Auth } from '@supabase/auth-ui-react';
import { ThemeSupa } from '@supabase/auth-ui-shared';

function App() {
  const [clients, setClients] = useState([]);
  const [user, setUser] = useState(null);
  const [notLoggedIn, setNotLoggedIn] = useState(user === null ? true : false);
  const [isLoginPage, setIsLoginPage] = useState(true);

  async function signUpNewUser(newUser) {
    const { data, error } = await supabase.auth.signUp({
      email: newUser.email,
      password: newUser.password,
      options: {
        emailRedirectTo: 'https//example.com/welcome',
      },
    });
  }

  useEffect(() => {
    supabase.auth.getSession().then(
      ({ data: { session } }) => {
        if (session) {
          setUser(session.user);
        }
        setNotLoggedIn(false);
        const {
          data: { subscription },
        } = supabase.auth.onAuthStateChange((event, session) => {
          setUser(session.user);
        });
        return () => subscription.unsubscribe();
      },
      [user]
    );
  });

  return (
    <Router>
      {user === null ? (
        <LoginRegisterPage
          isLoginPage={isLoginPage}
          setIsLoginPage={setIsLoginPage}
          setUser={setUser}
          signUpNewUser={signUpNewUser}
        />
      ) : (
        <div className="Applayout">
          <Sidebar setClients={setClients} />
          <div className="content-container">
            <Header />
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
        </div>
      )}
    </Router>
  );
}

export default App;
