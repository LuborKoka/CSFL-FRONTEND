import axios from "axios";
import React, { Context, useContext, useState } from "react";
import { URI, UserContext, UserTypes, insertTokenIntoHeader } from "../../../../App";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import Select, { MultiValue } from 'react-select'
import { selectMultiValueStyles } from "../../user/AddReport";
import useConfirmation from "../../../../hooks/useConfirmation";



export default function AddReserves() {
    const { seasonID } = useParams()

    const [reserves, setReserves] = useState<{label: string, value: string}[]>([])

    const { user } = useContext(UserContext as Context<UserTypes>)

    const queryClient = useQueryClient()
    const query = useQuery([`season-non-reserve-drivers-${seasonID}`], () => fetchNonReserves(seasonID, user?.token
    ))

    const [confirmation, showConfirmation] = useConfirmation()

    function handleChange(v: MultiValue<{label: string, value: string}>) {
        if ( v === null )
            setReserves([])
        else 
            setReserves(v.map(o => {return {...o}}))
    }

    function confirm() {
        setReserves([])
        queryClient.invalidateQueries([`season-drivers-${seasonID}`])
    }

    function submit(e: React.FormEvent) {
        e.preventDefault()

        axios.post(`${URI}/admins/season-drivers/${seasonID}/reserves/`, {
            params: {
                drivers: reserves.map(r => r.value)
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



async function fetchNonReserves(seasonID: string | undefined, token: string | null | undefined) {
    type Data = {
        drivers: {
            driverID: string,
            driverName: string
        }[]
    }

    const res = await axios.get<Data>(`${URI}/admins/season-drivers/${seasonID}/reserves/`, {
        headers: {
            Authorization: `Bearer ${insertTokenIntoHeader(token)}`
        }
    })
    return res.data
}