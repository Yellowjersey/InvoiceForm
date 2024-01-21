import { useEffect, useState } from 'react';
import { supabase } from '../supabase/supabase';

async function useSetClientImages({ UUID, client_UUID, propertyImages }) {
  await Promise.all(
    propertyImages.map((file) =>
      supabase.storage
        .from(`client_images/${UUID}/${client_UUID}/property_images`)
        .upload(file.name, file)
    )
  );

  //   return images;
}

export default useSetClientImages;
