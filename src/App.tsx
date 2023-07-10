import React, { createContext, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, RouteProps } from 'react-router-dom';
import Auth from './components/screens/Auth';
import Reports from './components/screens/Reports';
import Nav from './components/controls/Nav';
import Settings from './components/screens/Settings';
import AdminUI from './components/screens/AdminUI';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import Season from './components/screens/Season';

export const URI = 'http://192.168.100.22:8000/api'

type User = {
  username: string,
  id: string
}

export type SeasonType = {
  id: string,
  name: string
}

export type UserTypes = {
  user: User | null,
  setUser: React.Dispatch<React.SetStateAction<User | null>>
}

const queryClient = new QueryClient()

export const UserContext = createContext<UserTypes | null>(null)

function App() {
  const [user, setUser] = useState<User | null>(null)
  const [seasons, setSeasons] = useState<SeasonType[]>([])

  const contextValue = {
    user: user,
    setUser: setUser
  }

  return (
    <UserContext.Provider value={contextValue}>
      <QueryClientProvider client={queryClient}>
        <Router>
          <Nav seasons={seasons}/>
          <Routes>
            <Route path='/' element={<Auth setSeasons={setSeasons} />} />

            <Route path='/reports' element={<Reports />} />
            <Route path='/settings' element={<Settings />} />
            <Route path='/seasons/:seasonID' element={<Season />} />

            <Route path='/admin' element={<AdminUI />} />
          </Routes>
        </Router>   
      </QueryClientProvider>
    </UserContext.Provider>
  )
}

export default App;

