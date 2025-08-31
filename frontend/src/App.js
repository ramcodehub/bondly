import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Leads from './components/Leads/Leads';
import LeadForm from './components/Leads/Components/LeadForm/LeadForm';
import LeadDetail from './components/Leads/Components/LeadDetail/LeadDetail';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        {/* Your existing Navbar and other layout components */}
        <main className="py-6">
          <Routes>
            {/* Existing routes */}
            
            {/* Lead Management Routes */}
            <Route path="/leads" element={<Leads />} />
            <Route path="/leads/create" element={<LeadForm />} />
            <Route path="/leads/edit/:id" element={<LeadForm isEdit={true} />} />
            <Route path="/leads/:id" element={<LeadDetail />} />
            
            {/* Add other routes as needed */}
          </Routes>
        </main>
        <ToastContainer 
          position="top-right"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
        />
      </div>
    </Router>
  );
}

export default App;
