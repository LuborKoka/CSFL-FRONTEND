import axios from "axios"
import { useLocation, useParams } from "react-router-dom"
import { URI } from "../../../App"
import { useQuery } from "@tanstack/react-query"
import { useState, useTransition } from 'react'
import { RED, WHITE } from "../../../constants"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faExclamationTriangle } from "@fortawesome/free-solid-svg-icons"
import Loader from "../../reusableCompontents/Loader"




export default function Standings() {
    const { seasonID } = useParams()
    const [isChecked, setIsChecked] = useState(false)

    const query = useQuery([`season_standings_${seasonID}`], () => fetchStandings(seasonID))

    const location = useLocation()

    const startTransition = useTransition()[1]

    function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
        startTransition(() => {
            setIsChecked(e.target.checked)
        })
    }

    if ( query.isLoading ) return(
        <>
            <h2 className="section-heading fade-in-out-border">Tabuľka priebežného poradia</h2>
            <Loader type='standings' />
        </>
        
    )

    if ( query.data?.code === 204 ) {
        return(
            <>
                <br/><br/>
                <h2 className='section-heading fade-in-out-border' style={{textAlign: 'center'}}> 
                    <FontAwesomeIcon icon={faExclamationTriangle} style={{color: RED, margin: '0 2rem'}} />
                    Ešte nie je z čoho vyrobiť tabuľky.
                    <FontAwesomeIcon icon={faExclamationTriangle} style={{color: RED, margin: '0 2rem'}} />
                </h2>

            </>
        )
    }

    return(
        <div className={ `${!location.pathname.includes('/race') && 'section'}`}>
            <h2 className="section-heading fade-in-out-border">Tabuľka priebežného poradia jazdcov</h2>
            <div className='center switch-container section-heading fade-in-out-border'>
                <span style={{cursor: 'pointer'}} onClick={() => setIsChecked(false)}>Poradie</span>
                <label className="switch">
                    <input type="checkbox" checked={isChecked} onChange={handleChange} />
                    <span className="slider round"></span>
                </label>
                <span style={{cursor: 'pointer'}} onClick={() => setIsChecked(true)}>Body</span>
            </div>

            <div className="overflow-y">
                <table className="table standings-table">
                    <thead>
                        <tr>
                            <th className="empty-header-item"></th><th style={{textAlign: 'left', paddingLeft: '8px'}}>Meno</th>
                            {
                                query.data?.data.races.map(r => 
                                <th key={r.id} >
                                    <div className='flag-box'>
                                        <img alt='flag' style={{objectFit: 'cover', width: '100%', height: '100%', borderRadius: '2px'}}   src={`${URI}/media/${r.flag}/`} />                                   
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
                                    <td className='team-border' style={{whiteSpace: "nowrap", borderColor: d.color, paddingLeft: '8px'}}>{d.driverName}</td> {/* i wanna target this element on tr hover */}
                                    {d.races.map((r, i) => 
                                        r.hasBeenRaced ?
                                        
                                        <td key={`${d.driverID}, race${i}`}>
                                            <div className="switcher-visible">
                                                <div style={{color: getTextColor(r.rank)}} className={`switcher-container ${ !isChecked && 'switcher-container-rank'}`}>
                                                    <div className={`switcher-item-${isChecked ? 'active' : 'inactive'}`}>{r.points}</div>
                                                    <div className={`switcher-item-${isChecked ? 'inactive' : 'active'}`}>{r.rank}</div>
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
            </div>
            

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
                                    <td><img style={{transform: 'translateY(5px)'}} src={`${URI}/media/${r.icon}/`} alt={r.name} width={'30px'} />{r.name}</td>
                                    <td>{r.points}</td>
                                </tr>
                            )
                        })
                    }

                </tbody>

            </table>

            <br/><br/>
            <h2 className="section-heading fade-in-out-border">
                Tabuľka trestných bodov
            </h2>

            <div className="overflow-y">
                <table className='table standings-table'>
                    <thead>
                        <tr>
                            <th className="empty-header-item"></th>
                            <th style={{textAlign: 'left', paddingLeft: '8px'}}>Meno</th>
                            {
                                query.data?.data.races.map((r, i) => 
                                <th key={r.id} >
                                    <div className='flag-box'>
                                        <img alt='' style={{objectFit: 'cover', width: '100%', height: '100%', borderRadius: '2px'}}   src={`${URI}/media/${r.flag}/`} />                                   
                                    </div>
                                </th>)
                            }
                            <th>Celkom</th>
                        </tr>
                    </thead>

                    <tbody>
                        {
                            query.data?.data.penaltyPoints.map(p =>
                                <tr key={p.id}>
                                    <td>
                                        <div style={{width: '36px'}}>
                                            { 
                                                p.teamIcon && <img src={`${URI}/media/${p.teamIcon}/`} alt="team-icon" width='25px' />
                                            }
                                        </div>
                                    </td>
                                    <td style={{whiteSpace: 'nowrap'}}>{p.name}</td>
                                    {
                                        p.races.map((r, i) => <td key={`${p.id}${i}`}>{r === 0 ? '' : r}</td>)
                                    }
                                    <td>{p.totalPoints}</td>
                                </tr>
                            )
                        }
                    </tbody>
                </table>
            </div>
        </div>
    )
}

type Race = {
    teamName: string,
    hasFastestLap: boolean,
    isDSQ: boolean,
    rank: number | string,
    points: number,
    hasBeenRaced: boolean
}


type Driver = {
    driverID: string,
    driverName: string,
    
    isReserve: boolean,
    totalPoints: number,
    races: Race[],
    color: string
}

type Data = {
    races: {
        id: string,
        trackID: string,
        flag: string
    }[],
    drivers: Driver[],
    teams: {
        id: string,
        name: string,
        points: number,
        color: string,
        icon: string
    }[],
    penaltyPoints: {
        id: string,
        name: string,
        totalPoints: number,
        teamIcon: string | null,
        races: number[]
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