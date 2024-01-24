import { supabase } from '../supabase/supabase';

function PropertyImageCards({ image, index, file, setImageAdded, imageAdded }) {
  const imageTrimmed = image?.split('/');
  const clientImagesIndex = imageTrimmed?.indexOf('client_images');

  const imageAfterClientImages = imageTrimmed
    ?.slice(clientImagesIndex + 1)
    ?.join('/');

  async function deleteImage() {
    const { error } = await supabase.storage
      .from('client_images')
      .remove(imageAfterClientImages);

    if (error) {
      console.error('Error deleting image:', error);
    }

    setImageAdded(!imageAdded);
  }

  return (
    <>
      {image !==
      'https://sqdpatjugbkiwgugfjzy.supabase.co/storage/v1/object/public/client_images/addImage.jpg' ? (
        <div key={index} className="propertyImageContainers">
          <img src={image} />

          <button className="deletePropertyImageButton" onClick={deleteImage}>
            X
          </button>
        </div>
      ) : null}
    </>
  );
}

export default PropertyImageCards;
