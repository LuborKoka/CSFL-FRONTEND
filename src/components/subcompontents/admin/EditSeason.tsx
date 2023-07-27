import axios from 'axios'
import React from 'react'
import { Link, useOutletContext, useParams } from 'react-router-dom'
import { URI } from '../../../App'
import { useQuery } from '@tanstack/react-query'
import { Race } from './edit season related/Schedule'
import AssignDriversTeams from './edit season related/AssignDriversTeams'
import { AdminOutletContext, OutletSeason } from '../../controls/AdminNav'

type RaceProps = {
    id: string,
    date: string,
    raceName: string,
    isSprint: boolean,
    trackID: string,
    setSeason: React.Dispatch<React.SetStateAction<OutletSeason>>
}

type Data = {
    races: RaceProps[]
}


export default function EditSeason() {
    const { seasonID } = useParams()

    const setSeason = (useOutletContext() as AdminOutletContext)[1]

    const query = useQuery([`admin-season-schedule_${seasonID}`], () => fetchSeasonSchedule(seasonID))
    

    return(
        <div>
            {
                query.data?.races.map(r => {
                    return <RaceBox {...r} key={r.id} setSeason={setSeason} />
                })
            }
            
        </div>
    )
}

function RaceBox({ id, raceName, date, isSprint, setSeason}: RaceProps) {

    return(
        <div style={{padding: '20px', display: 'inline-block'}} onClick={() => setSeason(p => {return {...p, raceName: raceName}})}>
            <h5>{`${isSprint ? 'Sprint: ' : ''}${raceName}`}</h5>
            <h5>{date}</h5>

            <Link to={`race/${id}`}>Edit</Link>
        </div>
    )
}


async function fetchSeasonSchedule(seasonID: string | undefined) {
    type Data = {
        races: {
            id: string,
            raceName: string,
            date: string,
            trackID: string,
            isSprint: boolean
        }[]
    }
    const res = await axios.get<Data>(`${URI}/schedule/${seasonID}/`)
    return res.data
}

