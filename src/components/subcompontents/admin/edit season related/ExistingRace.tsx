import React, { useState } from 'react'
import { faPenToSquare } from '@fortawesome/free-regular-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCaretDown, faTrashAlt } from '@fortawesome/free-solid-svg-icons'
import Select, { SingleValue } from 'react-select'
import { selectSingleValueStyles } from './CreateRace'

type Props = {
    id: string,
    date: string,
    raceName: string,
    trackID: string,
    isSprint: boolean,
    options: {
        label: string,
        value: string
    }[]
    deleteRace: (raceID: string) => void,
    patchRace: (raceID: string, trackID: string, date: string) => Promise<boolean>
}

export default function ExistingRace({ id, date, raceName, patchRace, deleteRace, trackID, isSprint, options }: Props) {
    const [isChanging, setIsChanging] = useState(false)
    const [track, setTrack] = useState({value: trackID, label: raceName})
    const [newDate, setNewDate] = useState(date)

    function handleInput(e: React.ChangeEvent<HTMLInputElement>) {
        setNewDate(e.target.value)
    }

    function handleRaceInput(v: SingleValue<{value: string, label: string}>) {
        if ( v === null ) return
        setTrack({value: v.value, label: v.label})
    }

    function cancel() {
        setTrack({value: trackID, label: raceName})
        setNewDate(date)
        setIsChanging(false)
    }

    async function update() {
        const isOK = await patchRace(id, track.value, newDate)
        if ( isOK ) setIsChanging(false)
    }

    const icons =
    <div className='single-row top-right' style={{columnGap: '1rem', fontSize: '20px', top: '1rem'}}>
        <FontAwesomeIcon icon={faPenToSquare} className='change-icon' onClick={() => setIsChanging(true)} />
        <FontAwesomeIcon className='close-icon' icon={faTrashAlt} onClick={() => deleteRace(id)} />
    </div>

    const race = 
    <>
        <h3 style={{paddingLeft: '20px'}}>{new Date(date).toLocaleString()}</h3>
        <br/>
        <input className='form-input disabled-input' type='text' value={`${isSprint ? 'Sprint: ' : ''}${raceName}`} readOnly />
        {
            new Date() > new Date(date) ? null : icons
        }
    </>

    const updateRace = 
    <>
        <div className='new-race'>  
            <Select placeholder='Vyber veľkú cenu' styles={selectSingleValueStyles()} options={options} value={track} onChange={handleRaceInput} />
            <br/>
            <div className='date-time-picker' style={{height: '50px'}}>
                <input onChange={handleInput} className='input-date' type='datetime-local' value={newDate} />
                <FontAwesomeIcon icon={faCaretDown} />
            </div>

        </div>
        <div className='submit-button-container' style={{justifyContent: 'space-evenly'}}>
            <button className='clickable-button' onClick={cancel}>Zrušiť</button>
            <button className='clickable-button' onClick={update}>Uložiť</button>
        </div>
    </>


    return(
        <div className='editable-container'>
            { isChanging ? updateRace : race }
        </div>
    )
}