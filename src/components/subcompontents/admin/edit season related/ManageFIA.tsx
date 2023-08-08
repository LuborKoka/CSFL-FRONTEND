import axios from 'axios'
import React, { useState, useEffect, useContext, Context } from 'react'
import { useParams } from 'react-router-dom'
import { URI, UserContext, UserTypes, insertTokenIntoHeader } from '../../../../App'
import {  useQuery, useQueryClient } from '@tanstack/react-query'
import Select, { MultiValue } from 'react-select'
import { selectMultiValueStyles } from '../../user/AddReport'
import useConfirmation from '../../../../hooks/useConfirmation'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPenToSquare } from '@fortawesome/free-solid-svg-icons'


export default function ManageFIA() {
    const [values, setValues] = useState<{value: string, label: string}[]>([])
    const [isDisabled, setIsDisabled] = useState(true)

    const { seasonID } = useParams()

    const { user } = useContext(UserContext as Context<UserTypes>)

    const query = useQuery([`fia-candidates-${seasonID}`], () => fetchFiaCandidates(seasonID, user?.token), { staleTime: Infinity })
    const queryClient = useQueryClient()

    const [confirmation, showConfirmation] = useConfirmation()

    const options = query.data === undefined ? [] : query.data.users.map(u => {return {value: u.userID, label: u.driverName}})

    function handleChange(v: MultiValue<{value: string, label: string}>) {
        if ( v === null ) {
            setValues([])
            return
        }

        setValues(v.map(o => {return {value: o.value, label: o.label}}))
    }

    function confirm() {
        setValues([])
        queryClient.invalidateQueries([`fia-candidates-${seasonID}`])
    }

    function enableEdit() {
        setIsDisabled(false)
    }

    function cancel() {
        setIsDisabled(true)
        if ( query.data === undefined ) {
            setValues([])
            return
        }
        setValues(query.data.currentFIA.map(u => {return {value: u.userID, label: u.driverName}}))
    }


    function submit(e: React.FormEvent) {
        e.preventDefault()

        axios.post(`${URI}/admins/fia/${seasonID}/`, {
            params: {
                users: values.map(v => v.value)
            }
        }, {
            headers: {
                Authorization: `Bearer ${insertTokenIntoHeader(user?.token)}`
            }
        })
        .then(r => {
            showConfirmation(confirm)
        })
        .catch(e => {

        })
    }


    useEffect(() =>{
        if ( query.data === undefined ) return
        setValues(query.data.currentFIA.map(u => {return {value: u.userID, label: u.driverName}}))
    }, [query.data])


    const icons = 
    <div className='top-right' style={{top: '-1.5rem'}}>
        <FontAwesomeIcon icon={faPenToSquare} className='change-icon' onClick={enableEdit}/>
    </div>

    const buttons =
    <div className='submit-button-container' style={{columnGap: '3rem'}}>
        <button className='clickable-button' onClick={cancel}>Zrušiť</button>
        <button type='submit' className='clickable-button'>Uložiť</button>
    </div>

    return(
        <>
            <h2 className='section-heading fade-in-out-border'>
                Spravovať FIA
            </h2>

                <form onSubmit={submit}>
                    <div className='labeled-input'>
                        <Select name='fia-options' styles={selectMultiValueStyles()} onChange={handleChange} value={values} isMulti
                        options={options} closeMenuOnSelect={false} isDisabled={isDisabled}  />

                        { isDisabled ? icons : null}
                    </div>
                
                    { isDisabled ? null : buttons }
                </form>

            { confirmation }
        
        </>
    )
}



async function fetchFiaCandidates(seasonID: string | undefined, token: string | undefined | null) {
    type Data = {
        users: {
            userID: string,
            driverName: string
        }[],
        currentFIA: {
            userID: string,
            driverName: string
        }[]
    }
    const res = await axios.get<Data>(`${URI}/admins/fia/${seasonID}/`, {
        headers: {
            Authorization: `Bearer ${insertTokenIntoHeader(token)}`
        }
    })
    return res.data
}   