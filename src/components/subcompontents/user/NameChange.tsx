import axios, { AxiosResponse } from "axios"
import { useRef, useState } from "react"
import { URI, insertTokenIntoHeader } from "../../../App"
import useUserContext from "../../../hooks/useUserContext"
import useConfirmation from "../../../hooks/useConfirmation"
import useErrorMessage from "../../../hooks/useErrorMessage"
import SectionHeading from "../../reusableCompontents/SectionHeading"
import ClickableButton from "../../reusableCompontents/ClickableButton"
import LabeledInput from "../../reusableCompontents/LabeledInput"



export default function NameChange() {
    const [isPending, setIsPending] = useState(false)

    const name = useRef<HTMLInputElement>(null)
    const password = useRef<HTMLInputElement>(null)

    const [user, setUser] = useUserContext()

    const [confirmation, showConfirmation] = useConfirmation()
    const [message, showMessage] = useErrorMessage()

    function confirm() {
        name.current!.value = ''
        password.current!.value = ''
    }
    
    function submit(e: React.FormEvent) {
        e.preventDefault()
        if ( !name.current || !password.current ) return

        setIsPending(true)
        axios.patch(`${URI}/name-change/`, {
            params: {
                name: name.current.value,
                password: password.current.value,
                user_id: user?.id
            }
        }, {
            headers: {
                Authorization: `Bearer ${insertTokenIntoHeader(user?.token)}`
            }
        })
        .then((r: AxiosResponse) => {
            setUser(p => {
                return {
                    ...p!,
                    token: r.data.token,
                    driverName: name.current!.value
                }
            })
            showConfirmation(confirm)
        })
        .catch((e: unknown) => {
            showMessage(e)
        })
        .finally(() => setIsPending(false))
    }

    return(
        <>
            <SectionHeading sectionHeading>Zmena Verejného Mena</SectionHeading>

            <form onSubmit={submit} name="name change">
                <LabeledInput name="new-name" required minLength={5} ref={name} label="Nové meno" htmlFor="new-name" />
                <br/>
                <div style={{marginTop: '5px'}}>
                    <LabeledInput htmlFor="password" name="password" label="Heslo" minLength={8} required ref={password} withToggleVisible />
                </div>
            
                <ClickableButton withContainer disabled={isPending} type='submit'>Uložiť</ClickableButton>

            </form>

            {
                confirmation
            }

            {message}
        </>
    )
}