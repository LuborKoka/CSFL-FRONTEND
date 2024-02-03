import axios from "axios"
import useUserContext from "../../../hooks/useUserContext"
import { URI, insertTokenIntoHeader } from "../../../App"
import { useQuery, useQueryClient } from "@tanstack/react-query"
import Select, { SingleValue } from 'react-select'
import React, { useState } from "react"
import { selectSingleValueStyles } from "./edit season related/CreateRace"
import useConfirmation from "../../../hooks/useConfirmation"
import useErrorMessage from "../../../hooks/useErrorMessage"
import SectionHeading from "../../reusableCompontents/SectionHeading"
import ClickableButton from "../../reusableCompontents/ClickableButton"
import useThemeContext from "../../../hooks/useThemeContext"

export default function Roles() {
    const [value, setValue] = useState<{label: string, value: string} | null>(null)
    const [delValue, setDelValue] = useState<{label: string, value: string} | null>(null)
    const [isPending, setIsPending] = useState(false)
    const [isPendingDel, setIsPendingDel] = useState(false)

    const user = useUserContext()[0]
    const [isDarkTheme] = useThemeContext()

    const query = useQuery([`users`], () => fetchUsers(user?.token))
    const queryClient = useQueryClient()

    const [confirmation, showConfirmation] = useConfirmation()
    const [message, showMessage] = useErrorMessage()

    const roles = ['Sys Admin', 'F1 Super Admin', 'F1 Admin']


    function handleNewAdminChange(v: SingleValue<{value: string, label: string}>) {
        setValue(v)
    }

    function handleDelAdminChange(v: SingleValue<{value: string, label: string}>) {
        setDelValue(v)
    }

    function cancelNewAdmin() {
        setValue(null)
    }

    function cancelDelAdmin() {
        setDelValue(null)
    }


    function confirmNewAdmin() {
        setValue(null)
        queryClient.invalidateQueries([`users`])
    }

    function confirmDelAdmin() {
        setDelValue(null)
        queryClient.invalidateQueries([`users`])
    }

    function submitNewAdmin(e: React.FormEvent) {
        e.preventDefault()

        setIsPending(true)
        axios.patch(`${URI}/admins/users-roles/`, {
            params: {
                user_id: value?.value,
                role: query.data?.data.roles.find(r => r.role_name === 'F1 Admin')!.role_id
            }
        }, {
            headers: {
                Authorization: `Bearer ${insertTokenIntoHeader(user?.token)}`
            }
        })
        .then(() => showConfirmation(confirmNewAdmin))
        .catch((e: unknown) => showMessage(e))
        .finally(() => setIsPending(false))
    }

    function submitDelAdmin(e: React.FormEvent) {
        e.preventDefault()

        setIsPendingDel(true)
        const role = encodeURIComponent('F1 Admin')
        axios.delete(`${URI}/admins/users-roles/?user_id=${delValue?.value}&role=${role}`, {
            headers: {
                Authorization: `Bearer ${insertTokenIntoHeader(user?.token)}`
            }
        })
        .then(() => showConfirmation(confirmDelAdmin))
        .catch((e: unknown) => showMessage(e))
        .finally(() => setIsPendingDel(false))
    }

    return(
        <>
        <SectionHeading sectionHeading>Pridať rolu F1 Admina</SectionHeading>
        <form onSubmit={submitNewAdmin}>
            <Select value={value} required onChange={handleNewAdminChange} styles={selectSingleValueStyles(isDarkTheme)}
            options={
                query.data?.data.users.filter(u => !u.roles.some(r => roles.includes(r.role_name)) ).map(u => {
                    return {value: u.user_id, label: u.driver_name}
                })}
             />
            <div className='submit-button-container single-row'>
                <ClickableButton onClick={cancelNewAdmin}>Zrušiť</ClickableButton>
                <ClickableButton type='submit' disabled={isPending}>Uložiť</ClickableButton>
            </div>
        </form>


        <SectionHeading sectionHeading>Odobrať rolu F1 Admina</SectionHeading>
        <form onSubmit={submitDelAdmin}>
            <Select value={delValue} required styles={selectSingleValueStyles(isDarkTheme)} onChange={handleDelAdminChange} 
            options={
                query.data?.data.users.filter(u => u.roles.some(r => r.role_name === 'F1 Admin') ).map(u => {
                    return {value: u.user_id, label: u.driver_name}
                })}
            />
            <div className='submit-button-container single-row'>
                <ClickableButton onClick={cancelDelAdmin}>Zrušiť</ClickableButton>
                <ClickableButton type='submit' disabled={isPendingDel}>Uložiť</ClickableButton>
            </div>
        </form>

        { [confirmation, message] }
        </>
    )
}



async function fetchUsers(token: string | undefined) {
    type Data = {
        users: {
            user_id:  string,
            username: string,
            driver_name: string,
            driver_id: string,
            roles: {
                role_id: string,
                role_name: string
            }[]
        }[],
        roles: {
            role_id: string,
            role_name: string
        }[]
    }

    const res = await axios.get<Data>(`${URI}/admins/users-roles/`, {
        headers: {
            Authorization: `Bearer ${insertTokenIntoHeader(token)}`
        }
    })

    return {
        code: res.status,
        data: res.data
    }
}