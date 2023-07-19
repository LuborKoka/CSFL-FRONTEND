import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { URI } from '../../../App';

export default function RaceResults() {
    const [leaderTime, setLeaderTime] = useState(0)

    const { raceID } = useParams()

    const query = useQuery([`race-results_${raceID}`], () => fetchResults(raceID))

    useEffect(() => {
        if ( !query || !query.data || query.data.results.length === 0 ) return
        setLeaderTime(query.data.results[0].time)
    }, [query])

    return(
        <div>
            Race Results
            <table>
                <thead>
                    <tr>
                        <th></th>
                        <th>Pilot</th>
                        <th>Team</th>
                        <th>Čas</th>
                        <th>Body</th>
                    </tr>
                </thead>
                <tbody>
                {
                    //SELECT NOW() < race.date AS race_took_place a mam vyriesene tie nuly
                    query?.data?.results.map(d => {
                        return(
                            <tr key={d.driverID}>
                                <td>{d.rank}.</td>
                                <td>{d.driverName}</td>
                                <td>{d.teamName}</td>
                                <td>{d.rank === 1 ? formatTime(d.time) : `+${formatTime(d.time - leaderTime)}`}</td>
                                <td>{assignPoints(d.rank, d.hasFastestLap)}</td>
                            </tr>
                        )
                    })
                }
                </tbody>   
                
            </table>
        </div>
    )
}

type Driver = {
    driverID: string,
    driverName: string,
    teamName: string,
    rank: number,
    time: number,
    hasFastestLap: boolean
}

type Data = {
    results: Driver[]
}

async function fetchResults(id: string | undefined) {
    const res = await axios.get<Data>(`${URI}/races/${id}/results/`)
    return res.data
}

function formatTime(input: number): string {
    // Convert the input seconds into milliseconds
    const totalMilliseconds = Math.round(input * 1000)
    
    // Calculate hours, minutes, seconds, and milliseconds
    const hours = Math.floor(totalMilliseconds / (1000 * 60 * 60))
    const minutes = Math.floor((totalMilliseconds % (1000 * 60 * 60)) / (1000 * 60))
    const seconds = Math.floor((totalMilliseconds % (1000 * 60)) / 1000)
    const milliseconds = totalMilliseconds % 1000
    
    // Convert each unit into strings
    // Pad the start with "0" where necessary
    const hoursString = hours ? hours.toString().padStart(2, '0') + ':' : ''
    const minutesString = hours ? minutes.toString().padStart(2, '0') + ':' : minutes ? minutes.toString() + ':' : ''
    const secondsString = ( hours || minutes ) ? seconds.toString().padStart(2, '0') : seconds.toString()
    const millisecondsString = milliseconds.toString().padStart(3, '0')
    
    // Combine all the units into the final time string
    const timeString = `${hoursString}${minutesString}${secondsString}.${millisecondsString}`
    
    return timeString
  }
  
  function assignPoints(rank: number, hasFL: boolean) {
    switch(rank) {
        case 1:
            return 25 + Number(hasFL)
        case 2:
            return 18 + Number(hasFL)
        case 3:
            return 15 + Number(hasFL)
        case 4: 
            return 12 + Number(hasFL)
        case 5:
            return 10 + Number(hasFL)
        case 6:
            return 8 + Number(hasFL)
        case 7:
            return 6 + Number(hasFL)
        case 8:
            return 4 + Number(hasFL)
        case 9:
            return 2 + Number(hasFL)
        case 10:
            return 1 + Number(hasFL)
        default:
            return 0
    }
  } 