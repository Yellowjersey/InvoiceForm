import Navbar from './Navbar';

export default function Sidebar({ setClients }) {
  return (
    <div className="sidebar">
      <Navbar setClients={setClients} />
    </div>
  );
}
