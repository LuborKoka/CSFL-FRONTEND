import { URI, UserContext, UserTypes, randomURIkey } from "../../../../App";
import React, { useContext, Context, useState, useRef } from 'react' 
import axios, { AxiosResponse, AxiosError } from "axios";
import { useNavigate } from "react-router-dom";
import useConfirmation from "../../../../hooks/useConfirmation";
import { useQueryClient } from "@tanstack/react-query";

export default function CreateSeason() {
    const [isPending, setIsPending] = useState(false)

    const name = useRef<HTMLInputElement>(null)

    const user = useContext(UserContext as Context<UserTypes>)

    const queryClient = useQueryClient()

    const navigate = useNavigate()

    const [confirmation, showConfirmation] = useConfirmation()

    function confirm(id: string) {
        navigate(`/${randomURIkey}/admin/season/${id}/schedule`)
        queryClient.invalidateQueries([`list-of-seasons`])
    }


    function submitNewSeason(e: React.FormEvent) {
        e.preventDefault()

        setIsPending(true)
        axios.post(`${URI}/admins/create-season/`, {
            params: {
                name: name.current!.value
            }
        })
        .then((r: AxiosResponse) => {
            //setSeasonID(r.data.seasonID as string)
            showConfirmation(() => confirm(r.data.seasonID))
        })
        .catch((e: AxiosError) => {
            console.log(e)
        })
        .finally(() => setIsPending(false))
    }

    return(
        <>
            <h2 className='section-heading fade-in-out-border'>
                Vytvorenie novej sezóny
            </h2>

            <form onSubmit={submitNewSeason}>
                
                <div className='labeled-input'>
                    <input name='season-name' className='form-input' ref={name} type="text" required />
                    <label htmlFor="season-name">Meno novej sezóny</label>
                </div>

                <div className='submit-button-container'>
                    <button className={`clickable-button ${isPending ? 'button-disabled' : ''}`} disabled={isPending} type="submit">Vytvoriť sezónu</button>
                </div>
            </form>

            { confirmation }
        </>
    )
}