import { Link, Outlet, useLocation, useParams } from "react-router-dom";
import React, { useState } from 'react'
import { useQuery } from "@tanstack/react-query";
import { fetchDrivers } from "../subcompontents/user/RaceOverview";
import useUserContext from "../../hooks/useUserContext";

type Data = {
    seasonName: string,
    reportID: string
}

export type RaceContext = [
    Data, React.Dispatch<React.SetStateAction<Data>>
]

export default function SeasonNav() {
    const [context, setContext] = useState<Data>({seasonName: '', reportID: ''})

    const { seasonID, raceID } = useParams()

    const location = useLocation()

    const query = useQuery([`race_${raceID}_drivers_overview`], () => fetchDrivers(raceID))

    return(
       //no neda sa nic robit, bude to mat ine classname podal toho, co vrati location.pathname, lebo toto ma v pici cely responzivny design
        <div className={location.pathname.includes('/race') ? 'content-container' : 'season-with-race-cards'} /* contains all of users' content*/> 
            <div className='header-navigation'>
                <h3>{context.seasonName}</h3>
                <div className='breadcrumbs'>
                    <Link className='link' to={'/'}>Úvod</Link>
                    <Link className='link' to={`/seasons/${seasonID}`}>{'> Prehľad ročníka'}</Link>
                    {
                        location.pathname.includes('/race') ?
                       <> {'>'}
                        <Link className='link' to={`/seasons/${seasonID}/race/${raceID}`}>{query.data?.raceName}</Link> </>
                    :
                    null
                    }
                    {
                        lastLink(location.pathname)
                    }
                </div>
            </div>

            <Outlet context={[context, setContext]} />
        </div>
    )
}




function lastLink(pathname: string): JSX.Element | null {
    if ( pathname.includes('/new-report') ) return <>{'>'} <Link className='link' to={pathname}>Pridať report</Link></>

    if ( pathname.includes('/reports')) return <>{'>'} <Link className='link' to={pathname}>Reporty</Link> </>

    if ( pathname.includes('/results') ) return <>{'>'} <Link className='link' to={pathname}>Výsledky</Link></>

    if ( pathname.includes('/standings') ) return <>{'>'} <Link className='link' to={pathname}>Tabuľka</Link> </>

    

    return null
}

