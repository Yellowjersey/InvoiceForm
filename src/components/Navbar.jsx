import { Link } from 'react-router-dom';
import { HiMiniPlusCircle } from 'react-icons/hi2';

export default function Navbar() {
  return (
    <nav className="navbar">
      <div className="logo-container">
        <img src="./YardManager.png" alt="logo" className="logo" />
        <hr className="hr" />
      </div>
      <div className="navbar-content">
        <div className="links">
          <Link to="/">Home</Link>
          <Link to="/createinvoice">Create Invoice</Link>
          <Link to="/clients">Clients</Link>
        </div>
        <div>
          <HiMiniPlusCircle role="button" className="add-client" />
        </div>
      </div>
    </nav>
  );
}
