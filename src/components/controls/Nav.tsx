import React, { useEffect, useState } from 'react'
import { Link, useLocation, NavLink } from 'react-router-dom'
import '../../styles/navbar.css'
import axios, { AxiosError, AxiosResponse } from 'axios'
import { URI } from '../../App'

type SeasonType = {
    id: string,
    name: string
  }

export default function Nav() {
    const [isOpen, setIsOpen] = useState(false)
    const [routes, setRoutes] = useState<JSX.Element[]>([])

    const location = useLocation()

    function closeNavbar() {
        setIsOpen(false)
    }

    useEffect(()=> {
        axios.get(`${URI}/seasons/`)
        .then((r: AxiosResponse) => {
            setRoutes(
                (r.data.seasons as SeasonType[]).map(s => {
                    return <NavLink onClick={closeNavbar} to={`/seasons/${s.id}`} key={s.id}>{s.name}</NavLink>
                })
            )  
        })
        .catch((e: AxiosError) => {
            console.log(e)
        })

    }, [])

    const jsx = 
        <nav className={`main-navigation ${isOpen ? 'nav-active' : ''}`}>
            <div className='navbar'>
                <div className="league-options">
                    <ul>
                        <Link onClick={closeNavbar} to={'/reports'}>Reports</Link>
                        <Link onClick={closeNavbar} to='/admin'>Admin Settings</Link>
                        {routes}
                    </ul>
                </div>

                <div className="account-options">
                    <ul>
                        <li>Toggle Theme</li>
                        <Link onClick={closeNavbar} to={'/settings'}>Nastavenia</Link>
                        <li>Odhlásiť sa</li>
                    </ul>
                </div>
            </div>

            <div className='hamburger-position' onClick={() => setIsOpen(!isOpen)}>
                <button className={`hamburger--arrowturn ${isOpen ? 'is-active' : ''}`} type="button" id='burger'>
                    <span className="hamburger-box">
                        <span className="hamburger-inner"></span>
                    </span>
                </button>
            </div>
        </nav>

    return(
        location.pathname === '/' ? null : jsx
    )
}



