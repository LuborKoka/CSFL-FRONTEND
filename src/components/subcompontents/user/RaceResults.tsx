import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { URI } from '../../../App';
import { faClock, faExclamationTriangle } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { RED, WHITE } from '../../../constants';

export default function RaceResults() {
    const [leaderTime, setLeaderTime] = useState(0)

    const { raceID } = useParams()

    const query = useQuery([`race-results_${raceID}`], () => fetchResults(raceID))

    useEffect(() => {
        if ( !query || !query.data || query.data.results.length === 0 ) return
        setLeaderTime(query.data.results[0].time)
    }, [query])

    if ( query.data?.results.length === 0 || query.data?.has_been_raced === false ) {
        return(
            <>
                <br/><br/>
                <h2 className='section-heading fade-in-out-border' style={{textAlign: 'center'}}> 
                    <FontAwesomeIcon icon={faExclamationTriangle} style={{color: RED, margin: '0 2rem'}} />
                    Výsledky tu budú do 3 hodín od začiatku pretekov.
                    <FontAwesomeIcon icon={faExclamationTriangle} style={{color: RED, margin: '0 2rem'}} />
                </h2>
            </>
        )
    }

    return(
        <div style={{display: 'grid', overflowX: 'auto'}}>
            <h2 className='section-heading fade-in-out-border'>Výsledky pretekov</h2>
            <table className='table' id='race-results-table'>
                <thead className='table-header'>
                    <tr>
                        <th></th>
                        <th style={{textAlign: 'left'}}>Pilot</th>
                        <th style={{textAlign: 'left'}}>Team</th>
                        <th>Čas</th>
                        <th>Body</th>
                    </tr>
                </thead>
                <tbody id='race-results'>
                {
                    //SELECT NOW() < race.date AS race_took_place a mam vyriesene tie nuly
                    query?.data?.results.map(d => {
                        return(
                            <tr key={d.driverID}>
                                <td>{d.rank}.</td>
                                <td>{d.driverName}</td>
                                <td>{d.teamName}</td>
                                <td>
                                    {d.isDSQ ? 'DSQ' : d.time === null ? 'DNF' : d.rank === 1 ? formatTime(d.time, d.plusLaps) : `+${formatTime(d.time - leaderTime, d.plusLaps)}`}
                                </td>
                                <td style={{whiteSpace: 'nowrap'}}>
                                    {assignPoints(d.rank, d.hasFastestLap, d.isSprint, d.time === null)}
                                    {d.hasFastestLap ? <FontAwesomeIcon 
                                    style={{color: 'purple', marginLeft: '5px', backgroundColor: WHITE, borderRadius: '50%'}} icon={faClock} /> 
                                    : null}
                                </td>
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
    hasFastestLap: boolean,
    isSprint: boolean,
    plusLaps: number,
    isDSQ: boolean
}

type Data = {
    results: Driver[],
    has_been_raced: boolean
}



async function fetchResults(id: string | undefined) {
    const res = await axios.get<Data>(`${URI}/races/${id}/results/`)
    return res.data
}

function formatTime(input: number, laps: number): string {
    if ( laps > 0 ) {
        switch(laps) {
            case 1:
                return '1 kolo'
            case 2:
                return '2 kolá'
            case 3:
                return '3 kolá'
            case 4:
                return '4 kolá'
            
            default:
                return `${laps} kôl`
        }
    }

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
  
  function assignPoints(rank: number, hasFL: boolean, isSprint: boolean, didDNF: boolean) {
    if ( didDNF ) return 0

    switch(rank) {
        case 1:
            return isSprint ? 8 : 25 + Number(hasFL)
        case 2:
            return isSprint ? 7 : 18 + Number(hasFL)
        case 3:
            return isSprint ? 6 : 15 + Number(hasFL)
        case 4: 
            return isSprint ? 5 : 12 + Number(hasFL)
        case 5:
            return isSprint ? 4 : 10 + Number(hasFL)
        case 6:
            return isSprint ? 3 : 8 + Number(hasFL)
        case 7:
            return isSprint ? 2 : 6 + Number(hasFL)
        case 8:
            return isSprint ? 1 : 4 + Number(hasFL)
        case 9:
            return isSprint ? 0 : 2 + Number(hasFL)
        case 10:
            return isSprint ? 0 : 1 + Number(hasFL)
        default:
            return 0
    }
} 