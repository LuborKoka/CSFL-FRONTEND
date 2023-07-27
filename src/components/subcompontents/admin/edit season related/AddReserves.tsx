import axios from "axios";
import React, { useState } from "react";
import { URI } from "../../../../App";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import Select, { MultiValue } from 'react-select'
import { selectMultiValueStyles } from "../../user/AddReport";
import useConfirmation from "../../../../hooks/useConfirmation";



export default function AddReserves() {
    const { seasonID } = useParams()

    const [reserves, setReserves] = useState<{label: string, value: string}[]>([])

    const query = useQuery([`season-non-reserve-drivers-${seasonID}`], () => fetchNonReserves(seasonID))

    const [confirmation, showConfirmation] = useConfirmation()

    function handleChange(v: MultiValue<{label: string, value: string}>) {
        if ( v === null )
            setReserves([])
        else 
            setReserves(v.map(o => {return {...o}}))
    }

    function submit(e: React.FormEvent) {
        e.preventDefault()

        axios.post(`${URI}/admins/season-drivers/${seasonID}/reserves/`, {
            params: {
                drivers: reserves.map(r => r.value)
            }
        })
        .then(r => {
            showConfirmation(() => setReserves([]))
        })
        .catch(e => {

        })
    }

    return(
        <>
            <h2 className='section-heading fade-in-out-border'>
                Pridať nové rezervy
            </h2>

            <form onSubmit={submit}>
                <Select 
                    isMulti options={query.data === undefined ? [] : query.data.drivers.map(d => {return {value: d.driverID, label: d.driverName}})} 
                    styles={selectMultiValueStyles()}  onChange={handleChange} required value={reserves}
                />

                <div className='submit-button-container'>
                    <button type="submit" className='clickable-button'>Uložiť</button>
                </div>
            </form>

            { confirmation }
        </>
    )
}



async function fetchNonReserves(seasonID: string | undefined) {
    type Data = {
        drivers: {
            driverID: string,
            driverName: string
        }[]
    }

    const res = await axios.get<Data>(`${URI}/admins/season-drivers/${seasonID}/reserves/`)
    return res.data
}