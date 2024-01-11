import { useEffect, useState } from 'react';
import { supabase } from '../../supabase/supabase';

export default function HomeClientCards({
  Name,
  img,
  total,
  clientId,
  clientImg,
  user,
}) {
  const [clientImage, setClientImage] = useState('');

  const CDNURL =
    'https://sqdpatjugbkiwgugfjzy.supabase.co/storage/v1/object/public/client_images/';

  useEffect(() => {
    async function fetchImage() {
      const { data, error } = await supabase.storage
        .from('client_images')
        .list(user.id + '/' + clientId + '/');

      if (data !== null) {
        for (const image of data) {
          if (image.name === clientImg) {
            const imageUrl = `${CDNURL}${user.id}/${clientId}/${image.name}`;
            setClientImage(imageUrl);

            break; // Exit the loop once the image is found
          }
        }
      }

      if (error) {
        console.error('Error fetching image:', error);
      }
    }

    fetchImage();
  }, [clientId, clientImg, user.id]);

  return (
    <div className="homeClientCard">
      <img
        src={clientImage}
        width="100px"
        alt={Name}
        className="clientCardImg"
      />
      <div className="clientInfoRows">
        <h1>Name: {Name}</h1>
        <h2>Client Balance: {total}</h2>
      </div>
    </div>
  );
}
