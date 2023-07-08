import React, { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import '../../styles/navbar.css'

export default function Nav(){
    const [isOpen, setIsOpen] = useState(false)

    const location = useLocation()

    function closeNavbar() {
        setIsOpen(false)
    }

    const jsx = 
        <nav className={`${isOpen ? 'nav-active' : ''}`}>
            <div className='navbar'>
                <div className="league-options">
                    <ul>
                        <Link onClick={closeNavbar} to={'/reports'}>Reports</Link>
                        <Link onClick={closeNavbar} to='/admin'>Admin Settings</Link>
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



