import React, { useEffect, useState, useRef } from 'react';
import axios, { AxiosError, AxiosResponse } from 'axios'
import { URI } from '../../../../App';
import Select, { MultiValue } from 'react-select'
import { selectMultiValueStyles } from '../../user/AddReport';
import { useQuery } from '@tanstack/react-query';
import useConfirmation from '../../../../hooks/useConfirmation';
import EditTeamDrivers from './EditTeamDrivers';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLightbulb } from '@fortawesome/free-solid-svg-icons';
import { useParams } from 'react-router-dom';



type Params = {
    seasonID: string
}

type Team = {
    teamID: string,
    drivers: string[]
}

// potom upravit tu logiku pre ligy s uz priradenymi jazdcami do timov
// 2 select komponenty, jeden na vytvorenie, jeden na update

//for now creation works

export default function AssignDriversTeams() {
    const { seasonID } = useParams()

    //zoznam zvolenych teamov aj s jazdcami
    const teams = useRef<Team[]>([])

    const query = useQuery([`drivers-for-season-and-replacements-${seasonID}`], () => fetchDriversAndTeams(seasonID))

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
                    query.data?.teams.map(t => 
                        <div key={t.id} style={{padding: '1.5rem 0'}}>
                            <EditTeamDrivers {...t} signed={t.drivers} 
                            options={query.data === undefined ? [] : query.data.availableDrivers.map(o => {return {value: o.id, label: o.name}})} />    
                        </div>
                    )
                }
            
        </div>
    )
}





type TeamSelectProps = {
    id: string,
    name: string,
    signed: {
        id: string,
        name: string
    }[],
    drivers: {value: string, label: string}[],
    color: string,
    setDrivers: (v: MultiValue<{value: string, label: string}>, id: string) => void
}




function TeamSelect({ id, name, signed, drivers, color, setDrivers }: TeamSelectProps) {
    const [options, setOptions] = useState<{value: string, label: string}[]>([])

    useEffect(() => {
        if ( signed.length === 0 ) return
        const d = drivers.filter(d => d.value === signed[0].id || d.value === signed[1].id )
        setOptions(d)
    }, [signed, drivers])

    function setSelected(v: MultiValue<{value: string, label: string}>) {
        if ( v.length > 2 ) return
        setOptions(v.map(d => {
            return {value: d.value, label: d.label}
        }))
        setDrivers(v, id)
    }

    return(
        <Select value={options} isMulti placeholder={name} options={drivers} closeMenuOnSelect={false}
        styles={selectMultiValueStyles(color)} 
        onChange={(v: MultiValue<{value: string, label: string}>) => setSelected(v)} key={id}  />
    )
}


async function fetchDriversAndTeams(seasonID: string | undefined) {
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
    const res = await axios.get<Data>(`${URI}/admins/season-drivers/${seasonID}/`)
    return res.data
}