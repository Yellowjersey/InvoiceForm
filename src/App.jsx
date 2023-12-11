import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './pages/Home';
import CreateInvoice from './pages/CreateInvoice';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import Clients from './pages/Clients';

function App() {
  return (
    <Router>
      <div className="Applayout">
        <Sidebar />
        <div className="content-container">
          <Header />
          <div className="content">
            <Routes>
              <Route exact path="/" element={<Home />} />
              <Route path="/createinvoice" element={<CreateInvoice />} />
              <Route path="/clients" element={<Clients />} />
            </Routes>
          </div>
        </div>
      </div>
    </Router>
  );
}

export default App;
