import React from 'react'
import { NavLink, Outlet } from 'react-router-dom'


export default function RaceDetails() {
    
//toto css je totalne dojebane, tie kontajnery hlavne
    return(
        <div className='race-details-container'>
            <nav className='race-navigation'>
                <NavLink to='report'>Report</NavLink> {/*i think im doing something wrong here, it doesnt navigate to the desired route*/}
                <NavLink to='results'>Výsledky</NavLink>
            </nav>
            <div>
                content
            </div>
            <Outlet />
        </div>
    )
}