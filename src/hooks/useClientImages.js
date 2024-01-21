import { useEffect, useState } from 'react';
import { supabase } from '../supabase/supabase';

async function useClientImages({ UUID, client_UUID }) {
  const CLIENTPROPERTYIMAGESURL =
    'https://sqdpatjugbkiwgugfjzy.supabase.co/storage/v1/object/public/client_images/';
  const [images, setImages] = useState([]);

  useEffect(() => {
    const fetchImages = async () => {
      const { data, error } = await supabase.storage
        .from(`client_images/${UUID}/${client_UUID}`)
        .list();

      if (error) {
        console.error('Error fetching images:', error);
        return;
      }

      // setImages(data);
      console.log(data);
    };

    fetchImages();
  }, []);

  //   return images;
}

export default useClientImages;
