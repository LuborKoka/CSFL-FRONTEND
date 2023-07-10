import React, { useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import '../../styles/navbar.css'
import { SeasonType } from '../../App'

type Props = {
    seasons: SeasonType[]
}

export default function Nav({ seasons }: Props){
    const [isOpen, setIsOpen] = useState(false)
    const [routes, setRoutes] = useState<JSX.Element[]>([])

    const location = useLocation()

    function closeNavbar() {
        setIsOpen(false)
    }

    useEffect(()=> {
        if ( !seasons ) return
        setRoutes(
            seasons.map(s => {
                return <Link onClick={closeNavbar} to={`/seasons/${s.id}`} key={s.id}>{s.name}</Link>
            })
        )
    }, [seasons])

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



