import React, { createContext, useState, useEffect } from 'react';
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
import EditRace from './components/subcompontents/admin/edit race related/EditRace';
import Standings from './components/subcompontents/user/Standings';
import SeasonNav from './components/controls/SeasonNav';
import Welcome from './components/screens/Welcome';
import RaceNav from './components/controls/RaceNav';
import AddReport from './components/subcompontents/user/AddReport';
import './styles/shared.css'
import './styles/confirmation.css'
import AdminNav from './components/controls/AdminNav';
import CreateSeason from './components/subcompontents/admin/edit season related/CreateSeason';
import CreateSchedule from './components/subcompontents/admin/edit season related/Schedule';
import AssignDriversTeams from './components/subcompontents/admin/edit season related/AssignDriversTeams';
import AddReserves from './components/subcompontents/admin/edit season related/AddReserves';
import ManageFIA from './components/subcompontents/admin/edit season related/ManageFIA';
import jwtDecode from 'jwt-decode';
import { storageKeyName } from './constants';
import { Forbidden, NotFound } from './components/controls/BadReq';
import RaceOverview from './components/subcompontents/user/RaceOverview';
import axios from 'axios';
import getenv from 'getenv'

export const URI = 'http://192.168.100.22:8000/api'

export const randomURIkey = generateRandomString(10)

type User = {
  username: string,
  id: string,
  token: string,
  roles: string[]
}

export type UserTypes = {
  user: User | null,
  setUser: React.Dispatch<React.SetStateAction<User | null>>
}

const queryClient = new QueryClient()

export const UserContext = createContext<UserTypes | null>(null)

function App() {
  const [user, setUser] = useState<User | null>(null)

  useEffect(() => {
    const token = localStorage.getItem(storageKeyName)


    if (token !== null) {
      const data = jwtDecode(token) as { username: string, id: string }

      axios.get(`${URI}/roles/${data.id}/`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
        .then(r => {
          setUser({ ...data, token: token, roles: r.data.roles })
        })
        .catch(e => {
          setUser({ ...data, token: token, roles: [] })
        })
    }


  }, [setUser])

  return (
    <UserContext.Provider value={{ user, setUser }}>
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
              <Route path=':seasonID/race' element={<RaceNav />}>
                <Route path=':raceID' element={<RaceOverview />} />
                <Route path=':raceID/standings' element={<Standings />} />
                <Route path=':raceID/reports' element={<Reports />} />
                <Route path=':raceID/results' element={<RaceResults />} />
                <Route path=':raceID/reports/new' element={<AddReport />} />

              </Route>
              {/*<Route path=':seasonID/race/:raceID' element={<RaceDetails />} />
              <Route path=':seasonID/race/:raceID/reports' element={<Reports />} />
  <Route path=':seasonID/race/:raceID/results' element={<RaceResults />} />*/}
            </Route>

            <Route path={`/${randomURIkey}/admin`} element={<AdminNav />}>
              <Route index element={<AdminUI />} />
              <Route path='new-season' element={<CreateSeason />} />
              <Route path='season/:seasonID' element={<EditSeason />} />
              <Route path='season/:seasonID/drivers' element={<AssignDriversTeams />} />
              <Route path='season/:seasonID/schedule' element={<CreateSchedule />} />
              <Route path='season/:seasonID/reserves' element={<AddReserves />} />
              <Route path='season/:seasonID/fia' element={<ManageFIA />} />

              <Route path='season/:seasonID/race/:raceID' element={<EditRace />} />
            </Route>

            <Route path='*' element={<NotFound />} />
            <Route path='/forbidden' element={<Forbidden />} />
            {/* <Route path={`/${randomURIkey}/admin`} element={<AdminUI />} />
            <Route path={`/${randomURIkey}/admin/season/:seasonID`} element={<EditSeason />} />
<Route path={`/${randomURIkey}/admin/season/:seasonID/race/:raceID`} element={<EditRace />} />*/}
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


export function insertTokenIntoHeader(token: string | undefined | null) {
  if (token !== undefined && token !== null) return token
  return ''
}