import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Auth from './components/screens/Auth';
import Reports from './components/screens/Reports';
import Nav from './components/controls/Nav';

export const URI = 'http://192.168.100.22:8000'

function App() {
  return (
    <Router>
      <Nav />
      <Routes>
        <Route path='/' element={<Auth />} />

        <Route path='/reports' element={<Reports />} />
      </Routes>
    </Router>
  )
}

export default App;
