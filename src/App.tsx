import React, { createContext, useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Auth from './components/screens/Auth';
import Reports from './components/screens/Reports';
import Nav from './components/controls/Nav';
import Settings from './components/screens/Settings';
import AdminUI from './components/screens/AdminUI';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import Season from './components/screens/Season';
import RaceResults from './components/subcompontents/user/RaceResults';
import EditSeason from './components/subcompontents/admin/EditSeason';
import EditRace from './components/subcompontents/admin/EditRace';
import RaceDetails from './components/screens/RaceDetails';
import Standings from './components/subcompontents/user/Standings';
import SeasonNav from './components/controls/SeasonNav';
import Welcome from './components/screens/Welcome';
import RaceNav from './components/controls/RaceNav';
import AddReport from './components/subcompontents/user/AddReport';
import './styles/shared.css'
import './styles/confirmation.css'

export const URI = 'http://192.168.100.22:8000/api'

export const randomURIkey = generateRandomString(10)

type User = {
  username: string,
  id: string
}

export type UserTypes = {
  user: User | null,
  setUser: React.Dispatch<React.SetStateAction<User | null>>
}

const queryClient = new QueryClient()

export const UserContext = createContext<UserTypes | null>(null)

function App() {
  const [user, setUser] = useState<User | null>(null)

  const contextValue = {
    user: user,
    setUser: setUser
  }

  return (
    <UserContext.Provider value={contextValue}>
      <QueryClientProvider client={queryClient}>
        <Router>
          <Nav />
          <Routes>
            <Route path='/' element={<Auth />} />

            <Route path='/welcome' element={<Welcome />} />
            <Route path='/reports' element={<Reports />} />
            <Route path='/settings' element={<Settings />} />
            <Route path='/seasons' element={<SeasonNav />} >
              <Route path=':seasonID' element={<Season />} />
              <Route path=':seasonID/standings' element={<Standings />} />
              <Route path=':seasonID/race' element={<RaceNav />}>
                <Route path=':raceID' element={<RaceDetails />} />
                <Route path=':raceID/reports' element={<Reports />} />
                <Route path=':raceID/results' element={<RaceResults />} />
                <Route path=':raceID/reports/new' element={<AddReport />} />
              </Route>
              {/*<Route path=':seasonID/race/:raceID' element={<RaceDetails />} />
              <Route path=':seasonID/race/:raceID/reports' element={<Reports />} />
  <Route path=':seasonID/race/:raceID/results' element={<RaceResults />} />*/}
            </Route>
            
           

            <Route path={`/${randomURIkey}/admin`} element={<AdminUI />} />
            <Route path={`/${randomURIkey}/admin/season/:seasonID`} element={<EditSeason />} />
            <Route path={`/${randomURIkey}/admin/season/:seasonID/race/:raceID`} element={<EditRace />} />
          </Routes>
        </Router>   
      </QueryClientProvider>
    </UserContext.Provider>
  )
}

export default App;



export function generateRandomString(length: number) {
  let result = '';
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  for (let i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
}