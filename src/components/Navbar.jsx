import { Link } from 'react-router-dom';
import { HiMiniPlusCircle } from 'react-icons/hi2';
import { useState } from 'react';
import Modal from './Modal';
import AddClientForm from './AddClientForm';

export default function Navbar({ setClients }) {
  const [showModal, setShowModal] = useState(false);

  function swapModal() {
    setShowModal(!showModal);
  }

  return (
    <nav className="navbar">
      <div className="logo-container">
        <img src="./YardManager.png" alt="logo" className="logo" />
        <hr className="hr" />
      </div>
      <div className="navbar-content">
        <div className="links">
          <Link to="/" className="NavLink">
            Home
          </Link>
          <Link to="/createinvoice" className="NavLink">
            Create Invoice
          </Link>
          <Link to="/clients" className="NavLink">
            Clients
          </Link>
        </div>
        {showModal && (
          <Modal
            ModalForm={
              <AddClientForm
                setClients={setClients}
                closeModal={setShowModal}
              />
            }
            swapModal={swapModal}
          />
        )}
        <div>
          <HiMiniPlusCircle
            role="button"
            onClick={swapModal}
            className="add-client"
          />
        </div>
      </div>
    </nav>
  );
}
