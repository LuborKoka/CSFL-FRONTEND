import axios from 'axios'
import React from 'react'
import { Link, useParams } from 'react-router-dom'
import { URI } from '../../../App'
import { useQuery } from '@tanstack/react-query'
import { Race } from './CreateSchedule'
import AssignDriversTeams from './AssignDriversTeams'

type RaceProps = {
    raceID: string,
    date: string,
    name: string,
    raceName: string
}

type Data = {
    races: RaceProps[]
}


export default function EditSeason() {
    const { seasonID } = useParams()

    const query = useQuery([`admin-season-schedule_${seasonID}`], () => fetchSeasonSchedule(seasonID))
    

    return(
        <div>
            <h1>season name</h1>

            <AssignDriversTeams seasonID={seasonID!} />

            {
                query.data?.races.map(r => {
                    return <RaceBox {...r} key={r.raceID} />
                })
            }
            
        </div>
    )
}

function RaceBox({ name, raceID, raceName, date}: RaceProps) {

    return(
        <div style={{padding: '20px', display: 'inline-block'}}>
            <h5>{raceName}</h5>
            <h5>{date}</h5>

            <Link to={`race/${raceID}`}>Edit</Link>
        </div>
    )
}


async function fetchSeasonSchedule(id: string | undefined) {
    const response = await axios.get<Data>(`${URI}/season-schedule/${id}/`)
    return response.data
}