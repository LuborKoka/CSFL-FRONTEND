import React from 'react'
import { NavLink, useParams } from 'react-router-dom'
import RaceResults from '../subcompontents/user/RaceResults'


export default function RaceDetails() {
    const { raceID, seasonID } = useParams()
    
//toto css je totalne dojebane, tie kontajnery hlavne
    return(
        <div className='race-details-container'>
            <nav className='race-navigation'>
                <NavLink to='report'>Report</NavLink> {/*i think im doing something wrong here, it doesnt navigate to the desired route*/}
                <NavLink to='results'>Výsledky</NavLink>
                <NavLink to={`/seasons/${seasonID}/standings`}>Tabuľka</NavLink>
            </nav>
            <div>
                <RaceResults />
            </div>
        </div>
    )
}