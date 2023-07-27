import React, { useState, useEffect, useRef } from 'react'
import Select, { MultiValue } from 'react-select' 
import { selectMultiValueStyles } from '../../user/AddReport'

//potom na editovanie existujuceho driver lineup pre preteky (aj sezonu) spravit is_set column v db a podla neho vratit komponent pre 
// vytvorenie noveho alebo update existujuceho zlozenia, tak to bude najjedoduchsie a asi aj najprehladnejsie nakodit

//doplnit odoslanie dvojic na backend
type Team = {
    teamID: string,
    teamName: string,
    drivers: {
        id: string,
        name: string
    }[],
    color: string
}

type Data = {
    raceName: string,
    date: string,
    teams: Team[],
    reserves: {
        id: string,
        name: string
    }[]
}

type DriversSelectProps = (Team & {reserves: Data["reserves"]} & {setDrivers: (teamID: string, drivers: string[]) => void} ) 

export default function DriversSelect({ teamID, teamName, drivers, reserves, setDrivers, color }: DriversSelectProps ) {
    const [value, setValue] = useState<{value: string, label: string}[]>([])
    const [options, setOptions] = useState<{value: string, label: string}[]>([])

    function updateValue(val: MultiValue<{value: string, label: string}>) {
        if ( val.length > 2 ) return
        setValue(val.map(v => v))
        setDrivers(teamID, val.map(v => v.value))
    }

    useEffect(() => {
        setOptions(
            [...drivers.map(d => {return {value: d.id, label: d.name}}), 
            ...reserves.map(r => {return {value: r.id, label: `Rezerva: ${r.name}`}})]
        )

        setValue([...drivers.map(d => {return {value: d.id, label: d.name}})])

        setDrivers(teamID, drivers.map(d => d.id))
    }, [drivers, reserves, teamID, setDrivers])

    return(
        <div style={{padding: '1.5rem 0'}}>
            <div className='labeled-input' key={teamID}>
                <Select name={teamName} value={value} isMulti styles={selectMultiValueStyles(color)} placeholder={teamName} options={options} onChange={updateValue} />
                <label htmlFor={teamName} style={{color: color, transform: 'translate(-2%, -120%) scale(.9)', padding: '2px 5px'}}>
                    {teamName}
                </label>
            </div>
        </div>
    )
}