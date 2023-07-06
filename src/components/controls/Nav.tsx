import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import '../../styles/navbar.css'

export default function Nav(){
    const [isOpen, setIsOpen] = useState(false)

    return(
        <nav className={`${isOpen ? 'nav-active' : ''}`}>
            <div className='navbar'>
                <div className="league-options">
                    <ul>
                        <Link to={'/reports'}>Reports</Link>
                    </ul>
                </div>

                <div className="account-option">
                    <ul>
                        <li>Toggle Theme</li>
                        <li>Nastavenia</li>
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
    )
}



