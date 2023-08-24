import { useQuery, useQueryClient } from "@tanstack/react-query"
import useUserContext from "../../../../hooks/useUserContext"
import axios from "axios"
import { URI, insertTokenIntoHeader } from "../../../../App"
import Select, { SingleValue } from 'react-select'
import { selectSingleValueStyles } from "../edit season related/CreateRace"
import { useState } from "react"
import useConfirmation from "../../../../hooks/useConfirmation"
import useErrorMessage from "../../../../hooks/useErrorMessage"



export default function AddRole() {
    const [value, setValue] = useState<{label: string, value: string} | null>(null)
    const [roleValue, setRoleValue] = useState<{label: string, value: string} | null>(null)
    const [isPending, setIsPending] = useState(false)

    const [confirmation, showConfirmation] = useConfirmation()
    const [message, showMessage] = useErrorMessage()

    const user = useUserContext()[0]

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
        axios.put(`${URI}/wife-beater/roles/?user_id=${value?.value}&role_id=${roleValue?.value}`, {}, {
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
            <h2 className='section-heading fade-in-out-border'>Pridať rolu</h2>
            <form onSubmit={submit}>
                <Select styles={selectSingleValueStyles()} value={value} onChange={handleChange} required
                options={query.data?.users.map(u => ({label: `${u.driver_name}, ${u.username}`, value: u.user_id}))} />

                <br/>

                <Select styles={selectSingleValueStyles()} value={roleValue} onChange={handleRoleChange} required
                options={query.data?.roles.map(r => ({value: r.role_id, label: r.role_name}))}
                />
                    
                <br/>

                <div className='button-container'>
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



export async function fetchUsers(token: string | undefined | null) {
    type Data = {
        users: {
            user_id: string,
            driver_id: string,
            username: string,
            driver_name: string,
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

    const res = await axios.get<Data>(`${URI}/wife-beater/roles/`, {
        headers: {
            Authorization: `Bearer ${insertTokenIntoHeader(token)}`
        }
    })

    return res.data
}