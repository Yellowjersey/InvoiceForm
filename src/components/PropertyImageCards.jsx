function PropertyImageCards({ image, index, file }) {
  return (
    <>
      {image !==
      'https://sqdpatjugbkiwgugfjzy.supabase.co/storage/v1/object/public/client_images/addImage.jpg' ? (
        <div key={index} className="propertyImageContainers">
          <img src={image} />

          <button className="deletePropertyImageButton">X</button>
        </div>
      ) : null}
    </>
  );
}

export default PropertyImageCards;
