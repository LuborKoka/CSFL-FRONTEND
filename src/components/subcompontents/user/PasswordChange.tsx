import axios from "axios"
import { URI } from "../../../App"
import { useRef, useState } from "react"
import useUserContext from "../../../hooks/useUserContext"
import useConfirmation from "../../../hooks/useConfirmation"
import useErrorMessage from "../../../hooks/useErrorMessage"
import SectionHeading from "../../reusableCompontents/SectionHeading"
import ClickableButton from "../../reusableCompontents/ClickableButton"
import LabeledInput from "../../reusableCompontents/LabeledInput"


export default function PasswordChange() {
    const [isPending, setIsPending] = useState(false)

    const oldPassword = useRef<HTMLInputElement | null>(null)
    const newPassword = useRef<HTMLInputElement | null>(null)
    const newPasswordConfirm = useRef<HTMLInputElement | null>(null)

    const user = useUserContext()[0]

    const [confirmation, showConfirmation] = useConfirmation()
    const [message, showMessage] = useErrorMessage()

    function confirm() {
        oldPassword.current!.value = ''
        newPassword.current!.value = ''
        newPasswordConfirm.current!.value = ''
    }

    function handlePasswordChange(e: React.FormEvent) {
        (document.activeElement as HTMLInputElement | null)?.blur()
        e.preventDefault()
        setIsPending(true)
        
        axios.patch(`${URI}/change-password/`, {
            params: {
                username: user?.username,
                oldPassword: oldPassword.current!.value,
                newPassword: newPassword.current!.value,
                newPasswordConfirm: newPasswordConfirm.current!.value
            }
        })
        .then(() => {
            showConfirmation(confirm)
        })
        .catch((e: unknown) => {
            showMessage(e)
        })
        .finally(() => {
            setIsPending(false)
        })
    }

    return(
        <>
            <SectionHeading sectionHeading>Zmena hesla</SectionHeading>
            <form name="Form Password-Change" onSubmit={handlePasswordChange}>
                <LabeledInput name="old-password" htmlFor="old-password" label="Staré heslo" ref={oldPassword} required withToggleVisible />
                <br/>
                <div style={{marginTop: '5px'}}>
                    <LabeledInput name="new-password" htmlFor="new-password" label="Nové heslo" ref={newPassword} minLength={8} required withToggleVisible />
                </div>
                <br/>
                <div style={{marginTop: '5px'}}>
                    <LabeledInput name="new-password-confirm" htmlFor="new-password-confirm" label="Potvrď nové heslo" minLength={8} ref={newPasswordConfirm} required withToggleVisible />
                </div>
                <br/>

                <ClickableButton withContainer disabled={isPending}>Zmeniť heslo</ClickableButton>
            </form>

            { confirmation }
            { message }
        </>
    )

}