import React, { useState } from 'react'
import Select, { MultiValue } from 'react-select'
import { selectMultiValueStyles } from '../../user/AddReport'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPenToSquare } from '@fortawesome/free-regular-svg-icons'
import useConfirmation from '../../../../hooks/useConfirmation'
import { useParams } from 'react-router-dom'
import axios from 'axios'
import { URI } from '../../../../App'
import { useQueryClient } from '@tanstack/react-query'


type Props = {
    color: string,
    name: string,
    id: string,
    signed: {
        id: string,
        name: string
    }[],
    options: {
        label: string,
        value: string
    }[]
}


export default function EditTeamDrivers({ color, id, name, signed, options }: Props) {
    const [values, setValues] = useState(signed.map(d => {return {value: d.id, label: d.name}}))
    const [isDisabled, setIsDisabled] = useState(true)
    const [isPending, setIsPending] = useState(false)

    const { seasonID } = useParams()

    const queryClient = useQueryClient()

    const [confirmation, showConfirmation] = useConfirmation()

    function handleChange(v: MultiValue<{value: string, label: string}>) {
        if ( v.length > 2 ) return
        setValues(v.map(d => {return {value: d.value, label: d.label}}))
    }

    function enableEdit() {
        setIsDisabled(false)
    }

    function cancel() {
        setValues(signed.map(d => {return {label: d.name, value: d.id}}))
        setIsDisabled(true)
    }

    function resetAfterSubmit() {
        setIsDisabled(true)
        queryClient.invalidateQueries([`drivers-for-season-and-replacements-${seasonID}`])
    }

    //doplnit uri
    function submit() {
        axios.post(`${URI}/admins/season-drivers/${seasonID}/`, {
            params: {
                teamID: id, //id is string - uuid
                drivers: handleOldAndNewDrivers(signed, values)
            }
        })
        .then(r => {
            showConfirmation(resetAfterSubmit)
        })
        .catch(e => {

        })
        .finally(() => setIsPending(false))
    }


    const icons = 
    <div className='top-right' style={{top: '-1.5rem'}}>
        <FontAwesomeIcon icon={faPenToSquare} className='change-icon' onClick={enableEdit}/>
    </div>

    const buttons =
    <div className='submit-button-container' style={{columnGap: '3rem'}}>
        <button className='clickable-button' onClick={cancel}>Zrušiť</button>
        <button className={`clickable-button ${isPending ? 'button-disabled' : ''}`} onClick={submit}>Uložiť</button>
    </div>

    return(
        <div>
            <div className='labeled-input'>
                <Select name={name} isDisabled={isDisabled} isMulti value={values} styles={selectMultiValueStyles(color)} 
                onChange={handleChange} options={[...values, ...options]} closeMenuOnSelect={false} placeholder={isDisabled ? '' : 'Select...'} />
                <label htmlFor={name} style={{color: color, transform: 'translate(-2%, -120%) scale(.9)', padding: '2px 5px'}}>
                    {name}
                </label>
                { isDisabled ? icons : null}
            </div>

            { isDisabled ? null : buttons}
            
            { confirmation }
        </div>
    )
}





function handleOldAndNewDrivers(old: Props["signed"], newDrivers: Props["options"]) {
    if ( old.length === 0 ) return {
        reserves: [],
        newDrivers: newDrivers.map(d => d.value)
    }

    const toReserve: string[] = []

    old.forEach(d => { 
        if ( newDrivers.findIndex(nd => nd.value === d.id) === -1 ) toReserve.push(d.id)
    })

    return {
        reserves: toReserve,
        newDrivers: newDrivers.map(d => d.value)
    }
}