import React, { createContext, useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Auth from './components/screens/Auth';
import Reports from './components/screens/Reports';
import Nav from './components/controls/Nav';
import Settings from './components/screens/Settings';

export const URI = 'http://192.168.100.22:8000'

type User = {
  username: string,
  id: string
}

export type UserTypes = {
  user: User | null,
  setUser: React.Dispatch<React.SetStateAction<User | null>>
}

export const UserContext = createContext<UserTypes | null>(null)

function App() {
  const [user, setUser] = useState<User | null>(null)

  const contextValue = {
    user: user,
    setUser: setUser
  }

  return (
    <UserContext.Provider value={contextValue}>
      <Router>
        <Nav />
        <Routes>
          <Route path='/' element={<Auth />} />

          <Route path='/reports' element={<Reports />} />
          <Route path='/settings' element={<Settings />} />
        </Routes>
      </Router>
    </UserContext.Provider>
  )
}

export default App;

