import React, { createContext, useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation, useNavigate } from 'react-router-dom';
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
import Rules from './components/screens/Rules';
import secureLocalStorage from 'react-secure-storage';
import EditRules from './components/subcompontents/admin/EditRules';
import DiscordVerification from './components/subcompontents/user/discord/DiscordVerification';
import Roles from './components/subcompontents/admin/Roles';

export const URI = `http://192.168.100.22:8000/api`

export const randomURIkey = generateRandomString(10)

type User = {
  isLoggedIn: boolean,
  username?: string,
  id?: string,
  token?: string,
  driverID?: string,
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
    const token = secureLocalStorage.getItem(storageKeyName) as string | null //localStorage.getItem(storageKeyName)

    async function getUserData() {
      if (token !== null) {
        const data = jwtDecode(token) as { username: string, id: string, driverID: string }

        try {
          const rolesRes = await axios.get(`${URI}/roles/${data.id}/`, {
            headers: {
              Authorization: `Bearer ${token}`
            }
          })

          setUser({...data, token: token, roles: rolesRes.data.roles, isLoggedIn: true})

        } catch(e: unknown) {
          setUser({ ...data, token: token, roles: [], isLoggedIn: false })
        }
      }
    }

    
    getUserData()

  }, [setUser])

  return (
    <UserContext.Provider value={{ user, setUser }}>
      <QueryClientProvider client={queryClient}>
        <Router>
          <Nav />
          <Routes>
            <Route path='/' element={<Welcome />} />
            <Route path='/auth' element={<Auth />} />
            <Route path='/rules' element={<Rules />} />
            <Route path='/settings' element={<Settings />} />
            <Route path='/verify-user' element={<DiscordVerification />} />
            <Route path='/seasons' element={<SeasonNav />} >
              <Route path=':seasonID' element={<Season />} />
              <Route path=':seasonID/standings' element={<Standings />} />
              <Route path=':seasonID/race' element={<RaceNav />}>
                <Route path=':raceID/overview' element={<RaceOverview />} />
                <Route path=':raceID/standings' element={<Standings />} />
                <Route path=':raceID/reports' element={<Reports />} />
                <Route path=':raceID/results' element={<RaceResults />} />
                <Route path=':raceID/new-report' element={<AddReport />} />

              </Route>
              {/*<Route path=':seasonID/race/:raceID' element={<RaceDetails />} />
              <Route path=':seasonID/race/:raceID/reports' element={<Reports />} />
  <Route path=':seasonID/race/:raceID/results' element={<RaceResults />} />*/}
            </Route>

            <Route path={`/${randomURIkey}/admin`} element={<AdminNav />}>
              <Route path='seasons' element={<AdminUI />} />
              <Route path='roles' element={<Roles />} />
              <Route path='rules' element={<EditRules />} />
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