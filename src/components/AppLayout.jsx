import { Route, Routes, useNavigate } from 'react-router-dom';
import Header from './Header';
import Sidebar from './Sidebar';
import Home from '../pages/Home';
import CreateInvoice from '../pages/CreateInvoice';
import Clients from '../pages/Clients';
import { useEffect } from 'react';
import { supabase } from '../supabase/supabase';

export default function AppLayout({
  logout,
  user,
  UUID,
  userAccount,
  clientDataQueryForUUID,
  setClientsUpdated,
  showModal,
  setShowModal,
  swapModal,
  setClients,
  // getUserAccount,
  setUser,
  setUUID,
  setEditClient,
  editClient,
  clients,
  setUserAccount,
  setIsLoggingOutandIn,
  showToastMessage,
}) {
  const navigate = useNavigate();

  useEffect(() => {
    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (event !== 'SIGNED_OUT') {
          setUser(session?.user);
          setUUID(session?.user?.id);

          // if (!userAccount) {
          //   getUserAccount(session.user);
          // }
        } else {
          setUser('');
          setUUID('');
          navigate('/', { replace: true });
        }
      }
    );
  }, []);
  return (
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
        <Header
          logout={logout}
          userAccount={userAccount}
          setUserAccount={setUserAccount}
          setUUID={setUUID}
          setIsLoggingOutandIn={setIsLoggingOutandIn}
          setUser={setUser}
          showToastMessage={showToastMessage}
        />
        <div className="center-content">
          <Routes>
            <Route
              exact
              path="/home"
              element={<Home clients={clients} user={user} />}
            />
            <Route
              path="/createinvoice"
              element={<CreateInvoice clients={clients} />}
            />
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
                  user={user}
                />
              }
            />
          </Routes>
        </div>
      </div>
    </div>
  );
}
