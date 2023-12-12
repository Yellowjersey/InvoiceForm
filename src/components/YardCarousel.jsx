import { useState } from 'react';
import ReactSimplyCarousel from 'react-simply-carousel';

function YardCarousel() {
  const [activeSlideIndex, setActiveSlideIndex] = useState(0);

  const yards = [
    {
      name: 'yard 1',
      address: '1234 street',
      city: 'city',
      state: 'state',
      zip: '12345',
      phone: '123-456-7890',
      img: './yard1.png',
    },
    {
      name: 'yard 2',
      address: '1234 street',
      city: 'city',
      state: 'state',
      zip: '12345',
      phone: '123-456-7890',
      img: './yard1.png',
    },
    {
      name: 'yard 3',
      address: '1234 street',
      city: 'city',
      state: 'state',
      zip: '12345',
      phone: '123-456-7890',
      img: './yard1.png',
    },
    {
      name: 'yard 4',
      address: '1234 street',
      city: 'city',
      state: 'state',
      zip: '12345',
      phone: '123-456-7890',
      img: './yard1.png',
    },
  ];

  return (
    <div>
      <ReactSimplyCarousel
        activeSlideIndex={activeSlideIndex}
        onRequestChange={setActiveSlideIndex}
        itemsToShow={1}
        itemsToScroll={1}
        forwardBtnProps={{
          //here you can also pass className, or any other button element attributes
          style: {
            alignSelf: 'center',
            background: 'black',
            border: 'none',
            borderRadius: '50%',
            color: 'white',
            cursor: 'pointer',
            fontSize: '20px',
            height: 30,
            lineHeight: 1,
            textAlign: 'center',
            width: 30,
            margin: '0 10px',
          },
          children: <span>{`>`}</span>,
        }}
        backwardBtnProps={{
          //here you can also pass className, or any other button element attributes
          style: {
            margin: '0 10px',
            alignSelf: 'center',
            background: 'black',
            border: 'none',
            borderRadius: '50%',
            color: 'white',
            cursor: 'pointer',
            fontSize: '20px',
            height: 30,
            lineHeight: 1,
            textAlign: 'center',
            width: 30,
          },
          children: <span>{`<`}</span>,
        }}
        responsiveProps={[
          {
            itemsToShow: 1,
            itemsToScroll: 1,
            minWidth: 768,
          },
        ]}
        speed={400}
        easing="linear"
      >
        {yards.map((yard) => (
          <div
            key={yard.name}
            style={{
              width: 300,
              height: 300,
              background: '#ff80ed',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <img
              src={yard.img}
              alt="yard"
              style={{ width: 200, height: 200, borderRadius: '50%' }}
            />
            <div>{yard.name}</div>
            <div>{yard.address}</div>
            <div>{yard.city}</div>
            <div>{yard.state}</div>
            <div>{yard.zip}</div>
            <div>{yard.phone}</div>
          </div>
        ))}
      </ReactSimplyCarousel>
    </div>
  );
}

export default YardCarousel;
