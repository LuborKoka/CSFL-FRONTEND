import { useState } from "react"
import useConfirmation from "../../../../hooks/useConfirmation"
import useErrorMessage from "../../../../hooks/useErrorMessage"
import useUserContext from "../../../../hooks/useUserContext"
import { useQuery, useQueryClient } from "@tanstack/react-query"
import { fetchUsers } from "./AddRole"
import { selectSingleValueStyles } from "../edit season related/CreateRace"
import Select, { SingleValue } from 'react-select'
import { URI, insertTokenIntoHeader } from "../../../../App"
import axios from "axios"
import useThemeContext from "../../../../hooks/useThemeContext"


export default function DeleteRole() {
    const [value, setValue] = useState<{label: string, value: string} | null>(null)
    const [roleValue, setRoleValue] = useState<{label: string, value: string} | null>(null)
    const [isPending, setIsPending] = useState(false)

    const [confirmation, showConfirmation] = useConfirmation()
    const [message, showMessage] = useErrorMessage()

    const user = useUserContext()[0]
    const [isDarkTheme] = useThemeContext()

    const query = useQuery(['all-users'], () => fetchUsers(user?.token))
    const queryClient = useQueryClient()


    function handleChange(v: SingleValue<{label: string, value: string}> | null) {
        setValue(v)
        setRoleValue(null)
    }

    function handleRoleChange(v: SingleValue<{label: string, value: string}> | null) {
        setRoleValue(v)
    }

    function submit(e: React.FormEvent) {
        e.preventDefault()

        function confirm() {
            setValue(null)
            setRoleValue(null)
        }

        setIsPending(true)
        axios.delete(`${URI}/wife-beater/roles/?user_id=${value?.value}&role_id=${roleValue?.value}`, {
            headers: {
                Authorization: `Bearer ${insertTokenIntoHeader(user?.token)}`
            }
        })
        .then(() => {
            queryClient.invalidateQueries([`all-users`])
            showConfirmation(confirm)
        })
        .catch((e: unknown) => showMessage(e))
        .finally(() => setIsPending(false))
    }


    return(
        <>
            <h2 className='section-heading fade-in-out-border'>Vymazať rolu</h2>
            <form onSubmit={submit}>
                <Select styles={selectSingleValueStyles(isDarkTheme)} value={value} onChange={handleChange} required 
                options={query.data?.users.map(u => ({label: `Driver name: ${u.driver_name}, User name: ${u.username}`, value: u.user_id}))} />

                <br/>

                <Select styles={selectSingleValueStyles(isDarkTheme)} value={roleValue} onChange={handleRoleChange} required
                options={query.data?.users.find(u => value?.value === u.user_id)?.roles.map(r => ({value: r.role_id, label: r.role_name}))}
                />

                <br/>

                <div className='submit-button-container'>
                    <button type="submit" className={`clickable-button ${isPending && 'button-disabled'}`}>
                        Uložiť
                    </button>
                </div>

                {
                    confirmation
                }

                {
                    message
                }

            </form>
        </>
    )
}