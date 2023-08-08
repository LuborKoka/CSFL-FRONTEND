import React, { useContext, Context, useState, useEffect } from 'react';
import axios from 'axios'
import { URI, UserContext, UserTypes, insertTokenIntoHeader } from '../../../../App';
import { useQuery } from '@tanstack/react-query';
import EditTeamDrivers from './EditTeamDrivers';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLightbulb } from '@fortawesome/free-solid-svg-icons';
import { useNavigate, useParams } from 'react-router-dom';
import { Forbidden } from '../../../controls/BadReq';

// potom upravit tu logiku pre ligy s uz priradenymi jazdcami do timov
// 2 select komponenty, jeden na vytvorenie, jeden na update

// for now creation works
// uz aj prepisanie by malo fungovat

export default function AssignDriversTeams() {
    const [isForbidden, setIsForbidden] = useState(true)

    const { seasonID } = useParams()

    //nefunguje context
    const user = useContext(UserContext as Context<UserTypes>)

    //zoznam zvolenych teamov aj s jazdcami
    const navigate = useNavigate()

    const query = useQuery([`season-drivers-${seasonID}`], () => fetchDriversAndTeams(seasonID, user.user?.token))


    useEffect(() => {
        if ( query.data === undefined ) return
        if ( query.data.code === 403 ) setIsForbidden(true) 
        else setIsForbidden(false)
    }, [query.data])
    
    if ( isForbidden ) {
        return <Forbidden />
    }

    return(
        <div>
            <div className='user-tip'>
                <FontAwesomeIcon icon={faLightbulb} />
                <span>
                    Je lepšie tie tímy klikať po jednom. Potom sa nemusíš báť, že jedného hráča naklikáš do viacerých tímov.<br/>
                    Keď jazdca tímu nahradíš novým, automaticky sa tým z neho stáva náhradník pre danú sezónu.
                </span>
                <FontAwesomeIcon icon={faLightbulb} />
            </div>
            <br/><br/>

            <h2 className='section-heading fade-in-out-border'>Vytvorenie tímových dvojíc</h2>

            {
                    query.data?.data.teams.map(t => 
                        <div key={t.id} style={{padding: '1.5rem 0'}}>
                            <EditTeamDrivers {...t} signed={t.drivers} 
                            options={query.data === undefined ? [] : query.data.data.availableDrivers.map(o => {return {value: o.id, label: o.name}})} />    
                        </div>
                    )
                }
            
        </div>
    )
}


async function fetchDriversAndTeams(seasonID: string | undefined, token: string | undefined | null) {
    type Data = {
        teams: {
            color: string,
            id: string,
            name: string,
            drivers: {
                id: string,
                name: string
            }[]
        }[],
        availableDrivers: {
            id: string,
            name: string
        }[],
        reserves: {
            id: string,
            name: string
        }[]
    }
    const res = await axios.get<Data>(`${URI}/season-drivers/${seasonID}/`, {
        headers: {
            'Authorization': `Bearer ${insertTokenIntoHeader(token)}`
        }
    })
    return {
        code: res.status,
        data: res.data
    }
}