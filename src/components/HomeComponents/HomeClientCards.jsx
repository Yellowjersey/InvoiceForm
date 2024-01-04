export default function HomeClientCards({ Name, img, total }) {
  return (
    <div className="homeClientCard">
      <img src={img} alt={Name} className="clientCardImg" />
      <div className="clientInfoRows">
        <h1>Name: {Name}</h1>
        <h2>Client Balance: {total}</h2>
      </div>
    </div>
  );
}
