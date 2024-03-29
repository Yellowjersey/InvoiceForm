import { useEffect } from 'react';
import Navbar from './Navbar';
import { supabase } from '../supabase/supabase';

export default function Sidebar({
  setClients,
  UUID,
  userAccount,
  clientDataQueryForUUID,
  setClientsUpdated,
  showModal,
  setShowModal,
  swapModal,
}) {
  // useEffect(() => {
  //   if (UUID === undefined || UUID === null) return;

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
  //   if (UUID !== undefined && UUID !== null) {
  //     pushData();
  //   }
  // }, [UUID]);

  return (
    <div className="sidebar">
      <Navbar
        UUID={UUID}
        clientDataQueryForUUID={clientDataQueryForUUID}
        setClientsUpdated={setClientsUpdated}
        showModal={showModal}
        setShowModal={setShowModal}
        swapModal={swapModal}
        setClients={setClients}
      />
    </div>
  );
}
