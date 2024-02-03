import { URI, UserContext, UserTypes, insertTokenIntoHeader, randomURIkey } from "../../../../App";
import React, { useContext, Context, useState, useRef } from 'react' 
import axios, { AxiosResponse, AxiosError } from "axios";
import { useNavigate } from "react-router-dom";
import useConfirmation from "../../../../hooks/useConfirmation";
import { useQueryClient } from "@tanstack/react-query";
import SectionHeading from "../../../reusableCompontents/SectionHeading";
import ClickableButton from "../../../reusableCompontents/ClickableButton";
import LabeledInput from "../../../reusableCompontents/LabeledInput";

export default function CreateSeason() {
    const [isPending, setIsPending] = useState(false)

    const name = useRef<HTMLInputElement>(null)

    const { user } = useContext(UserContext as Context<UserTypes>)

    const queryClient = useQueryClient()

    const navigate = useNavigate()

    const [confirmation, showConfirmation] = useConfirmation()

    function confirm(id: string) {
        navigate(`/${randomURIkey}/admin/season/${id}/schedule`)
        queryClient.invalidateQueries([`seasons-navigation`])
    }


    function submitNewSeason(e: React.FormEvent) {
        e.preventDefault()

        setIsPending(true)
        axios.post(`${URI}/admins/create-season/`, {
            params: {
                name: name.current!.value
            }
        }, {
            headers: {
                Authorization: `Bearer ${insertTokenIntoHeader(user?.token)}`
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
            <SectionHeading sectionHeading>Vytvorenie novej sezóny</SectionHeading>

            <form onSubmit={submitNewSeason}>
                <LabeledInput ref={name} label="Meno novej sezóny" htmlFor="season-name" name="season-name" required />
                <ClickableButton withContainer disabled={isPending} type="submit">Vytvoriť sezónu</ClickableButton>
            </form>

            { confirmation }
        </>
    )
}