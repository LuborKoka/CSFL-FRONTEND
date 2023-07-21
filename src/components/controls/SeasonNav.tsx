import { Link, Outlet, useLocation } from "react-router-dom";
import React, { useState } from 'react'

type Data = {
    raceName: string,
    seasonName: string,
    reportID: string
}

export type RaceContext = [
    Data, React.Dispatch<React.SetStateAction<Data>>
]

export default function SeasonNav() {
    const [context, setContext] = useState<Data>({raceName: '', seasonName: '', reportID: ''})

    const location = useLocation()

    return(
       //no neda sa nic robit, bude to mat ine classname podal toho, co vrati location.pathname, lebo toto ma v pici cely responzivny design
        <div className={location.pathname.includes('/race') ? 'season-container' : 'season-with-race-cards'} /* contains all of users' content*/>
            <div className='season-navigation'>
                <h1>Season Navigation</h1>
                <div className='breadcrumbs'>
                    <Link className='link' to='/welcome'>Welcome</Link>
                    {'>'}
                    <Link className='link' to='/welcome'>Welcome</Link>
                    {'>'}
                    <Link className='link' to='/welcome'>Welcome</Link>
                </div>
            </div>

            <Outlet context={[context, setContext]} />
        </div>
    )
}