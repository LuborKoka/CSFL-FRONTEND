import { useQuery } from '@tanstack/react-query';
import React, { useContext, Context} from 'react'
import { useParams } from "react-router-dom";
import { URI, UserContext, UserTypes, insertTokenIntoHeader } from '../../../App';
import axios from 'axios'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faExclamationTriangle } from '@fortawesome/free-solid-svg-icons';
import { RED } from '../../../constants';



export default function RaceOverview() {
    const { raceID } = useParams()

    const { user } = useContext(UserContext as Context<UserTypes>)

    const query = useQuery([`race_${raceID}_drivers_overview`], () => fetchDrivers(raceID, user?.token))

    if ( query.data?.length === 0 ) return(
        <>
            <br/><br/>
            <h2 className='section-heading fade-in-out-border' style={{textAlign: 'center'}}> 
                <FontAwesomeIcon icon={faExclamationTriangle} style={{color: RED, margin: '0 2rem'}} />
                Súpiska pre túto veľkú cenu ešte nebola vytvorená.
                <FontAwesomeIcon icon={faExclamationTriangle} style={{color: RED, margin: '0 2rem'}} />
            </h2>

        </>
    )

    return(
        <>

            <h2 className='section-heading fade-in-out-border'>
                Súpiska
            </h2>
            {
                query.data?.map(t => 
                    <div className='team-members fade-in-out-border'  key={t.teamName}>
                        <img src={`${URI}/media/${t.logo}/`} alt={t.teamName} className='team-logo'/>
                        <div style={{display: 'inline-grid', placeContent: 'center flex-start', rowGap: '1rem', fontSize: '1.2rem', minWidth: '160px'}}>
                            <b style={{whiteSpace: 'nowrap'}}>
                                {
                                    t.drivers.length >= 1 ? <b>{t.drivers[0].driverName}</b> : null
                                } 
                            </b>
                            
                            <b style={{whiteSpace: 'nowrap'}}> 
                                {
                                    t.drivers.length === 2 ? <b>{t.drivers[1].driverName}</b> : null
                                } 
                            </b>       
                        </div>
                    </div>    
                )
            }
        </>
    )
}


async function fetchDrivers(id: string | undefined, token: string | null | undefined) {
    type Data = {
        raceName: string,
        drivers: {
            id: string,
            name: string,
            teamName: string,
            logo: string
        }[]
    }
    const res = await axios.get<Data>(`${URI}/races/${id}/drivers/`, {
        headers: {
            Authorization: `Bearer ${insertTokenIntoHeader(token)}`
        }
    })

    type TeamDriver = {
        driverID: string,
        driverName: string
    }

    type TeamData = {
        teamName: string;
        logo: string;
        drivers: TeamDriver[];
      }

    const driversData = res.data.drivers
    const teamsMap: { [teamName: string]: TeamData } = {}

    for (const d of driversData) {
        const teamName = d.teamName
        const driverObj: TeamDriver = {
            driverID: d.id,
            driverName: d.name
        };

        if (teamsMap[teamName]) {
            teamsMap[teamName].drivers.push(driverObj)
        } else {
            teamsMap[teamName] = {
            teamName,
            logo: d.logo,
            drivers: [driverObj]
            }
        }
    }

    return Object.values(teamsMap)
}