import React, { useState } from 'react'
import { useLocation, NavLink } from 'react-router-dom'
import '../../styles/navigation.css'
import axios from 'axios'
import { URI, randomURIkey } from '../../App'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowRightFromBracket, faGears, faHome, faLock, faScroll } from '@fortawesome/free-solid-svg-icons'
import { storageKeyName } from '../../constants'
import secureLocalStorage from 'react-secure-storage'
import useUserContext from '../../hooks/useUserContext'
import { faUser } from '@fortawesome/free-regular-svg-icons'
import { useSwipeable } from 'react-swipeable'

type SeasonType = {
    id: string,
    name: string
}

    //optional pridat gesture handler

export default function Nav() {
    const [isOpen, setIsOpen] = useState(false)

    const handlers = useSwipeable({
        onSwipedRight: () => setIsOpen(true),
        onSwipedLeft: () => setIsOpen(false)
    })

    const location = useLocation()

    const seasons = useQuery([`seasons-navigation`], () => fetchSeasons())
    const queryClient = useQueryClient()

    const [user, setUser] = useUserContext()

    const allowedRoles = ['Sys Admin', 'F1 Super Admin', 'F1 Admin']

    function closeNavbar() {
        setIsOpen(false)   
    }


    function logOut() {
        secureLocalStorage.removeItem(storageKeyName)
        setUser({
            isLoggedIn: false,
            roles: []
        })
        queryClient.clear()
    }


    const jsx = 
        <nav className={`main-navigation ${isOpen ? 'nav-active' : ''}`} {...handlers}>
            <div className='navbar'>
                <div className="league-options">
                    <ul>
                        <NavLink style={{position: 'relative', textDecoration: 'none'}} onClick={closeNavbar} to='/'>
                            <div className='clickable-button'>
                                <span><FontAwesomeIcon icon={faHome} flip='horizontal' /> Domov</span>
                            </div>
                        </NavLink>

                        <NavLink style={{position: 'relative', textDecoration: 'none'}} onClick={closeNavbar} to='/rules'>
                            <div className='clickable-button'>
                                <span><FontAwesomeIcon icon={faScroll} flip='horizontal' /> Pravidlá</span>
                            </div>
                        </NavLink>
                        {
                            seasons.data?.seasons.map(s =>
                                <NavLink style={{position: 'relative', textDecoration: 'none'}} onClick={closeNavbar} to={`/seasons/${s.id}`} key={s.id}>
                                    <div className='clickable-button'>
                                        {s.name}
                                    </div>
                                </NavLink>
                            )
                        }
                    </ul>
                </div>

                <div className="account-options">
                    <ul>
                        {
                            user?.roles.some(r => r === 'Sys Admin') &&
                            <NavLink style={{position: 'relative', textDecoration: 'none'}} onClick={closeNavbar} to={`/${randomURIkey}/wife-beater`}>
                                <div className='clickable-button'>
                                    <span>
                                        <FontAwesomeIcon icon={faLock} /> Wife Beater
                                    </span>
                                </div>        
                            </NavLink> 
                        }
                        {
                            user?.roles.some(r => allowedRoles.includes(r)) &&
                            <NavLink style={{position: 'relative', textDecoration: 'none'}} onClick={closeNavbar} to={`/${randomURIkey}/admin/seasons`}>
                                <div className='clickable-button'>
                                    <span>
                                        <FontAwesomeIcon icon={faLock} /> F1 Admin
                                    </span>
                                </div>        
                            </NavLink>
                        }
                        {
                            user?.isLoggedIn ?
                            <NavLink style={{position: 'relative', textDecoration: 'none'}} onClick={closeNavbar} to='/settings'>
                                <div className='clickable-button'>
                                    <span>
                                        <FontAwesomeIcon icon={faGears} /> Účet
                                    </span>
                                </div>
                            </NavLink> :
                            <NavLink style={{position: 'relative', textDecoration: 'none'}} onClick={closeNavbar} to={`/auth?redirect_url=${location.pathname}`}>
                                <div className='clickable-button'>
                                    <span>
                                        <FontAwesomeIcon icon={faUser} /> Prihlásiť sa
                                    </span>
                                </div>
                            </NavLink>
                        }
                        {
                            user?.isLoggedIn &&
                            <NavLink className='clickable-button' onClick={logOut} to='/'> 
                                <span>
                                    <FontAwesomeIcon icon={faArrowRightFromBracket} /> Odhlásiť sa  
                                </span>
                            </NavLink>
                        }
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
            <div className='swipeable' style={{zIndex: '-1', height: '100%', position: 'fixed', width: isOpen ? '100vw' : '100%'}} onClick={closeNavbar}></div>
        </nav>

    return(
        location.pathname === '/auth' ? null : jsx
    )
}



async function fetchSeasons() {
    type data = {
        seasons: SeasonType[]
    }
    const res = await axios.get<data>(`${URI}/seasons/`)
    return res.data
}
