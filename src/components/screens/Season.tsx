import axios from "axios";
import React, { Context, useContext, useState } from "react";
import { URI, UserContext, UserTypes, insertTokenIntoHeader } from "../../App";
import { useQuery } from '@tanstack/react-query'
import Race from "../subcompontents/user/Race";
import '../../styles/seasons.css'
import '../../styles/tiltableCard.css'

import { Link, useOutletContext, useParams } from "react-router-dom";
import { RaceContext } from "../controls/SeasonNav";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowUpRightFromSquare, faExclamationTriangle } from "@fortawesome/free-solid-svg-icons";
import { RED, WHITE } from "../../constants";


export default function Season() {
    const { seasonID } = useParams()

    const setSeason = (useOutletContext() as RaceContext)[1]

    const { user } = useContext(UserContext as Context<UserTypes>)

    const query = useQuery([`scheduled-races-${seasonID}`], () => fetchData(seasonID, setSeason))
    const drivers = useQuery([`season-drivers-user-${seasonID}`], () => fetchSeasonDrivers(seasonID, user?.token))

    const calendar = 
    <>
        <div className='section-heading fade-in-out-border header-with-time'>
            <h2>Kalendár</h2>
            <Link className='link-in-header' to={`/seasons/${seasonID}/standings`}>
                <h2 className='clickable-button'>
                    Tabuľka
                    <FontAwesomeIcon icon={faArrowUpRightFromSquare} />
                </h2>
                
            </Link>
        </div>
        

        {
            query?.data?.races.map(r => {
                return <Race key={r.id} {...r} />
            })
        }
    </>

    const emptyCalendar =
    <>
        <br/><br/>
        <h2 className='section-heading fade-in-out-border' style={{textAlign: 'center'}}> 
            <FontAwesomeIcon icon={faExclamationTriangle} style={{color: RED, margin: '0 2rem'}} />
            Kalendár pre túto sezónu je zatiaľ prázdny.
            <FontAwesomeIcon icon={faExclamationTriangle} style={{color: RED, margin: '0 2rem'}} />
        </h2>

    </>


    return(
        <div className='section'>
            {
                query.data?.races.length === 0 ? emptyCalendar : calendar
            }

            <h2 className="section-heading fade-in-out-border" style={{marginTop: '2rem'}}>
                Súpiska
            </h2>

            <div className="team-members-grid" >
                {
                    drivers.data?.teams.map(t => 
                        <div className='team-members'  key={t.id}>
                            <img src={`${URI}/media/${t.image}/`} alt={t.name} className='team-logo'/>
                            <div className='fade-in-out-border' style={{display: 'inline-grid', placeContent: 'center flex-start', rowGap: '1rem', fontSize: '1.2rem', minWidth: '160px'}}>
                                <b style={{whiteSpace: 'nowrap'}}>
                                    {
                                        t.drivers.length >= 1 ? <b style={{textShadow: `2px 2px 3px ${t.color}`}}>{t.drivers[0].name}</b> : null
                                    } 
                                </b>
                                
                                <b style={{whiteSpace: 'nowrap'}}> 
                                    {
                                        t.drivers.length === 2 ? <b style={{textShadow: `2px 2px 3px ${t.color}`}}>{t.drivers[1].name}</b> : null
                                    } 
                                </b>       
                            </div>
                        </div>    
                    )
                }
            </div>
        
        </div>
    )
}




async function fetchData(seasonID: string | undefined, setState: React.Dispatch<React.SetStateAction<{raceName: string, seasonName: string, reportID: string}>>) {
    type Data = {
        seasonName: string,
        races: {
            id: string,
            raceName: string,
            date: string,
            trackID: string,
            isSprint: boolean,
            image: string
        }[]
    }
    const res = await axios.get<Data>(`${URI}/schedule/${seasonID}/`)
    setState(p => {return {...p, seasonName: res.data.seasonName}})
    return res.data
}


async function fetchSeasonDrivers(seasonID: string | undefined, token: string | undefined | null) {
    type Data = {
        reserves: {
            id: string,
            name: string
        }[],
        availableDrivers: {
            id: string,
            name: string
        }[],
        teams: {
            id: string,
            name: string,
            color: string,
            image: string,
            drivers: {
                id: string,
                name: string
            }[]
        }[]
    }
    const res = await axios.get<Data>(`${URI}/season-drivers/${seasonID}/`, {
        headers: {
            Authorization: `Bearer ${insertTokenIntoHeader(token)}`
        }
    })

    return res.data
}