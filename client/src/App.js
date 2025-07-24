import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { Box } from '@mui/material';

// Components
import Navbar from './components/Layout/Navbar';
import Footer from './components/Layout/Footer';

// Pages
import AirdropPage from './pages/AirdropPage';

function App() {

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        background: 'linear-gradient(135deg, #0f0f23 0%, #1a1a3a 50%, #2d2d5f 100%)',
        backgroundAttachment: 'fixed',
      }}
    >
      <Navbar />
      
      <Routes>
        <Route path="/" element={<AirdropPage />} />
        <Route path="/airdrop" element={<AirdropPage />} />
      </Routes>

      <Footer />
    </Box>
  );
}

export default App;