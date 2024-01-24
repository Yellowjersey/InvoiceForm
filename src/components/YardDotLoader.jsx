import { BeatLoader } from 'react-spinners';

function YardDotLoader({ color, loading, size }) {
  return (
    <div className="spinnerContainer">
      <BeatLoader color={color} loading={loading} size={size} />
    </div>
  );
}

export default YardDotLoader;
