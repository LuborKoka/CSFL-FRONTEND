import React, { useState } from 'react'
import { useLocation, NavLink } from 'react-router-dom'
import '../../styles/navigation.css'
import axios from 'axios'
import { URI, randomURIkey } from '../../App'
import { useQuery } from '@tanstack/react-query'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowRightFromBracket, faGears, faLock } from '@fortawesome/free-solid-svg-icons'

type SeasonType = {
    id: string,
    name: string
}

    //optional pridat gesture handler

export default function Nav() {
    const [isOpen, setIsOpen] = useState(false)

    const location = useLocation()

    const seasons = useQuery([`seasons-navigation`], () => fetchSeasons())

    function closeNavbar() {
        setIsOpen(false)
    }


    const jsx = 
        <nav className={`main-navigation ${isOpen ? 'nav-active' : ''}`}>
            <div className='navbar'>
                <div className="league-options">
                    <ul>
                        {
                            seasons.data?.seasons.map(s =>
                                <NavLink className='clickable-button' onClick={closeNavbar} to={`/seasons/${s.id}`} key={s.id}>{s.name}</NavLink>
                            )
                        }
                    </ul>
                </div>

                <div className="account-options">
                    <ul>
                        <NavLink className='clickable-button' onClick={closeNavbar} to={`/${randomURIkey}/admin`}>
                            <span>
                                <FontAwesomeIcon icon={faLock} /> F1 Admin
                            </span>
                        </NavLink>
                        <NavLink className='clickable-button' onClick={closeNavbar} to='/settings'>
                            <span>
                                <FontAwesomeIcon icon={faGears} /> Nastavenia
                            </span>
                        </NavLink>
                        <NavLink className='clickable-button' to='/'>
                            <span>
                                <FontAwesomeIcon icon={faArrowRightFromBracket} /> Odhlásiť sa  
                            </span>
                        </NavLink>
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
            {/*fills the rest of the page, on mobile on click outside navbar to close the navbar*/}
            <div style={isOpen ? navFill.active : navFill.inactive} onClick={closeNavbar}></div>
        </nav>

    return(
        location.pathname === '/' ? null : jsx
    )
}



async function fetchSeasons() {
    type data = {
        seasons: SeasonType[]
    }
    const res = await axios.get<data>(`${URI}/seasons/`)
    return res.data
}


const navFill = {
    active: {
        zIndex: '-1',
        position: 'fixed' as 'fixed',
        height: '100%',
        width: '100vw'
    },
    inactive: {position: 'fixed' as 'fixed'}
}