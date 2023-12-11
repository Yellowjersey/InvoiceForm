import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './pages/Home';
import CreateInvoice from './pages/CreateInvoice';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import Clients from './pages/Clients';
import { useState } from 'react';

function App() {
  const [clients, setClients] = useState([]);

  return (
    <Router>
      <div className="Applayout">
        <Sidebar setClients={setClients} />
        <div className="content-container">
          <Header />
          <div className="">
            <Routes>
              <Route exact path="/" element={<Home />} />
              <Route path="/createinvoice" element={<CreateInvoice />} />
              <Route path="/clients" element={<Clients clients={clients} />} />
            </Routes>
          </div>
        </div>
      </div>
    </Router>
  );
}

export default App;
