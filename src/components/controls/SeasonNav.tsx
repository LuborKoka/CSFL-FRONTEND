import { Link, Outlet, useLocation, useParams } from "react-router-dom";
import React, { useEffect, useState } from 'react'
import { useQuery } from "@tanstack/react-query";
import { fetchDrivers } from "../subcompontents/user/RaceOverview";
import { fetchData } from "../screens/Season";

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
    const season = useQuery([`scheduled-races-${seasonID}`], () => fetchData(seasonID))

    useEffect(() => {
        setContext(p => {
            return {...p, seasonName: season.data?.seasonName || ''}
        })
    }, [season.data])

    return(
       //no neda sa nic robit, bude to mat ine classname podal toho, co vrati location.pathname, lebo toto ma v pici cely responzivny design
        <div className={location.pathname.includes('/race') ? 'content-container' : 'season-with-race-cards'}> 
            <div className='header-navigation'>
                <h3>{season.data?.seasonName}</h3>
                <div className='breadcrumbs'>
                    <Link className='link' to={`/seasons/${seasonID}`}>Prehľad ročníka</Link>
                    {
                        location.pathname.includes('/race') ?
                       <> {'>'}
                        <Link className='link' to={`/seasons/${seasonID}/race/${raceID}/overview`}>{query.data?.raceName}</Link> </>
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

