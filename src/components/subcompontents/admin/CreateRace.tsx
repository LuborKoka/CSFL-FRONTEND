import React, { useRef } from 'react';
import Select, { SingleValue } from 'react-select';
import { Race } from './CreateSchedule';

type Props = {
    options: {
        label: string,
        value: string
    }[],
    racesList: Race[],
    index: number
}

type Option = {
    label: string,
    value: string
}

export default function CreateRace({ options, racesList, index }: Props) {
    const data = useRef<Race>({trackID: '', timestamp: ''})

    function handleInput(e: React.ChangeEvent<HTMLInputElement>) {
        data.current = {...data.current, timestamp: e.target.value}
        submitForm()
    }

    function handleRaceInput(v: SingleValue<Option>) {
        if ( v === null ) return
        data.current = {...data.current, trackID: v.value}
        submitForm()
    }

    function submitForm() {
        if ( data.current.trackID === '' || data.current.timestamp === '' ) return
        racesList[index] = data.current
    }



    return(
        <div>
            <Select onChange={handleRaceInput} options={options} />
            <input onChange={handleInput} type='datetime-local' />
        </div>
    )
}