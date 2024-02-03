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
import ClickableButton from '../reusableCompontents/ClickableButton'
import useThemeContext from '../../hooks/useThemeContext'
import ThemeToggle from './theme-toggle/ThemeToggle'

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
    const [isDarkTheme] = useThemeContext()

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
        <nav className={`main-navigation ${isOpen && 'nav-active'} ${isDarkTheme ? 'dark' : 'light'}`} {...handlers}>
            <ThemeToggle />
            <div className='navbar'>
                <div className="league-options">
                    <ul>
                        <NavLink style={{position: 'relative', textDecoration: 'none'}} onClick={closeNavbar} to='/'>
                            <ClickableButton>
                                <span><FontAwesomeIcon icon={faHome} flip='horizontal' /> Domov</span>
                            </ClickableButton>
                        </NavLink>

                        <NavLink style={{position: 'relative', textDecoration: 'none'}} onClick={closeNavbar} to='/rules'>
                            <ClickableButton>
                                <span><FontAwesomeIcon icon={faScroll} flip='horizontal' /> Pravidlá</span>
                            </ClickableButton>
                        </NavLink>
                        {
                            seasons.data?.seasons.map(s =>
                                <NavLink style={{position: 'relative', textDecoration: 'none'}} onClick={closeNavbar} to={`/seasons/${encodeURIComponent(s.name)}`} key={s.id}>
                                    <ClickableButton>
                                        {s.name}
                                    </ClickableButton>
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
                                <ClickableButton>
                                    <span>
                                        <FontAwesomeIcon icon={faLock} /> Wife Beater
                                    </span>
                                </ClickableButton>     
                            </NavLink> 
                        }
                        {
                            user?.roles.some(r => allowedRoles.includes(r)) &&
                            <NavLink style={{position: 'relative', textDecoration: 'none'}} onClick={closeNavbar} to={`/${randomURIkey}/admin/seasons`}>
                                <ClickableButton>
                                    <span>
                                        <FontAwesomeIcon icon={faLock} /> F1 Admin
                                    </span>
                                </ClickableButton>        
                            </NavLink>
                        }
                        {
                            user?.isLoggedIn ?
                            <NavLink style={{position: 'relative', textDecoration: 'none'}} onClick={closeNavbar} to='/settings'>
                                <ClickableButton>
                                    <span>
                                        <FontAwesomeIcon icon={faGears} /> Nastavenia
                                    </span>
                                </ClickableButton>
                            </NavLink> :
                            <NavLink style={{position: 'relative', textDecoration: 'none'}} onClick={closeNavbar} to={`/auth?redirect_url=${location.pathname}`}>
                                <ClickableButton>
                                    <span>
                                        <FontAwesomeIcon icon={faUser} /> Prihlásiť sa
                                    </span>
                                </ClickableButton>
                            </NavLink>
                        }
                        {
                            user?.isLoggedIn &&
                            <NavLink onClick={logOut} to='/'> 
                                <ClickableButton>
                                    <span>
                                        <FontAwesomeIcon icon={faArrowRightFromBracket} /> Odhlásiť sa  
                                    </span>
                                </ClickableButton>
                            </NavLink>
                        }
                    </ul>
                </div>
            </div>

            <div className='hamburger-position' onClick={() => setIsOpen(!isOpen)}>
                <button className={`hamburger--arrowturn ${isOpen ? 'is-active' : ''}`} type="button" id='burger'>
                    <span className="hamburger-box">
                        <span className={`hamburger-inner ${isDarkTheme ? 'dark' : 'light'}`}></span>
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
