import axios from "axios"
import { useParams } from "react-router-dom"
import { URI } from "../../../App"
import { useQuery } from "@tanstack/react-query"
import { useState, useTransition } from 'react'
import { RED, WHITE } from "../../../constants"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faExclamationTriangle } from "@fortawesome/free-solid-svg-icons"




export default function Standings() {
    const { seasonID } = useParams()
    const [isPoints, setIsPoints] = useState(false)

    const query = useQuery([`season_standings_${seasonID}`], () => fetchStandings(seasonID))

    const [isPending, startTransition] = useTransition()

    function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
        startTransition(() => {
            setIsPoints(e.target.checked)
        })
    }

    if ( query.data?.code === 204 ) {
        return(
            <div className='section'>
                <br/><br/>
                <h1 className='section-heading fade-in-out-border' style={{textAlign: 'center'}}> 
                    <FontAwesomeIcon icon={faExclamationTriangle} style={{color: RED, margin: '0 2rem'}} />
                    Nie je tu čo zobraziť
                    <FontAwesomeIcon icon={faExclamationTriangle} style={{color: RED, margin: '0 2rem'}} />
                </h1>

            </div>
        )
    }

    return(
        <div className='section'>
            <h2 className="section-heading fade-in-out-border">Tabuľka priebežného poradia jazdcov</h2>
            <div className='center switch-container section-heading fade-in-out-border'>
                <span>Poradie</span>
                <label className="switch">
                    <input type="checkbox" onChange={handleChange} />
                    <span className="slider round"></span>
                </label>
                <span>Body</span>
            </div>
            <table className="table standings-table">
                <thead>
                    <tr>
                        <th></th><th style={{textAlign: 'left'}}>Meno</th>
                        {
                            query.data?.data.races.map((r, i) => 
                            <th key={r.id} >
                                <div className='flag-box'>
                                    <img alt='' style={{objectFit: 'cover', width: '100%', height: '100%'}}   src={`${URI}/images/tracks/${r.trackID}/`} />                                   
                                </div>
                            </th>)
                        }
                        <th>Body</th>
                    </tr>
                </thead>

                <tbody>
                {
                    query.data?.data.drivers.map((d, i) => {
                        return(
                            <tr key={d.driverID}>
                                <td>{i+1}.</td>
                                <td style={{whiteSpace: "nowrap"}}>{d.driverName}</td>
                                {d.races.map((r, i) => 
                                    r.hasBeenRaced ?
                                    
                                    <td key={`${d.driverID}, race${i}`}>
                                        <div className="switcher-visible">
                                            <div className={`switcher-container ${isPoints ? '' : 'switcher-container-rank'}`}>
                                                <div className={`switcher-item-${isPoints ? 'active' : 'inactive'}`}>{r.points}</div>
                                                <div style={{color: getTextColor(r.rank)}} className={`switcher-item-${isPoints ? 'inactive' : 'active'}`}>{r.rank}</div>
                                            </div>
                                        </div>
                                    </td>
                                    : <td key={`${d.driverID}, race${i}`}></td>
                                    )
                                
                                }
                                <td>{d.totalPoints}</td>
                            </tr>
                        )
                    })
                }
                </tbody>
                
            </table>

            <br/><br/>
            <h2 className='section-heading fade-in-out-border'>Tabuľka priebežného poradia konštruktérov</h2>
            <table className="table team-standings-table">
                <thead>
                    <tr>
                        <th></th><th>Tím</th><th>Body</th>
                    </tr>
                </thead>

                <tbody>
                    {
                        query.data?.data.teams.map((r, i) => {
                            return(
                                <tr key={r.id}>
                                    <td>{i + 1}.</td>
                                    <td>{r.name}</td>
                                    <td>{r.points}</td>
                                </tr>
                            )
                        })
                    }

                </tbody>

            </table>

        </div>
    )
}

type Race = {
    teamName: string,
    hasFastestLap: boolean,
    rank: number | string,
    points: number,
    hasBeenRaced: boolean
}


type Driver = {
    driverID: string,
    driverName: string,
    isReserve: boolean,
    totalPoints: number,
    races: Race[]
}

type Data = {
    races: {
        id: string,
        trackID: string,
    }[],
    drivers: Driver[],
    teams: {
        id: string,
        name: string,
        points: number,
        color: string
    }[]
}


async function fetchStandings(id: string | undefined) {
    const response = await axios.get<Data>(`${URI}/seasons/${id}/standings/`)
    return {code: response.status, data: response.data}
}


function getTextColor(rank: number | string) {
    switch (rank) {
        case 1:
            return 'gold'
        case 2:
            return 'silver'
        case 3:
            return 'coral'
        default:
            return WHITE
    }
}