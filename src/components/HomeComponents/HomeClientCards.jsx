import { useEffect, useState } from 'react';
import { supabase } from '../../supabase/supabase';
import YardDotLoader from '../YardDotLoader';
import { FaLocationArrow } from 'react-icons/fa';

export default function HomeClientCards({
  Name,
  img,
  total,
  clientId,
  clientImg,
  user,
  clientAddress,
  clientZip,
  clientState,
}) {
  const [clientImage, setClientImage] = useState('');
  const [loading, setLoading] = useState(true);
  const addressString = `${clientAddress} ${clientState} ${clientZip}`; // Replace these with your actual address, state, and zip variables

  const CDNURL =
    'https://sqdpatjugbkiwgugfjzy.supabase.co/storage/v1/object/public/client_images/';

  useEffect(() => {
    setLoading(true);
    async function fetchImage() {
      const { data, error } = await supabase.storage
        .from('client_images')
        .list(user.id + '/' + clientId + '/');

      const yardManImage =
        'YardMan' + Math.floor(Math.random() * 5 + 1) + '.png';

      if (data === null || data === undefined || data.length === 0) {
        setClientImage(CDNURL + yardManImage);
      }

      if (data !== null) {
        for (const image of data) {
          if (
            image.name === 'YardMan.png' ||
            image.name === 'YardMan1.png' ||
            image.name === 'YardMan2.png' ||
            image.name === 'YardMan3.png' ||
            image.name === 'YardMan4.png' ||
            image.name === 'YardMan5.png'
          ) {
            setClientImage(CDNURL + yardManImage);
            break;
          }
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
      setLoading(false);
    }

    fetchImage();
  }, [clientId, clientImg, user.id]);

  return (
    <div className="homeClientCard">
      {loading ? (
        <YardDotLoader color={'green'} size={20} loading={loading} />
      ) : (
        <img src={clientImage} alt={Name} className="clientCardImg" />
      )}
      <div className="clientInfoRows">
        <h1>Name: {Name}</h1>
        <h2>Client Balance: {total}</h2>
        <h2>{addressString}</h2>
      </div>
      <div className="clientLocationDiv">
        {/* <h2>Address: {clientAddress}</h2>
        <h2>
          {clientZip}, {clientState}
        </h2> */}
      </div>
    </div>
  );
}
