import axios, { AxiosResponse } from "axios"
import { URI } from "../../../App"
import { useRef, useState } from "react"
import useUserContext from "../../../hooks/useUserContext"


export default function PasswordChange() {
    const [isPending, setIsPending] = useState(false)

    const oldPassword = useRef<HTMLInputElement | null>(null)
    const newPassword = useRef<HTMLInputElement | null>(null)
    const newPasswordConfirm = useRef<HTMLInputElement | null>(null)

    const user = useUserContext()[0]

    function handlePasswordChange(e: React.FormEvent) {
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
        .then((r: AxiosResponse) => {
            console.log(r)
        })
        .catch((e: unknown) => {
            console.log(e)
        })
        .finally(() => {
            setIsPending(false)
        })
    }

    return(
        <>
            <h2 className='section-heading fade-in-out-border'>Zmena Hesla</h2>
            <form name="Form Password-Change" onSubmit={handlePasswordChange}>
                <div className='labeled-input'>
                    <input name='old-password' className='form-input' ref={oldPassword} required type="password" />
                    <label htmlFor='old-password'>Staré heslo</label>
                </div>
                <br/>
                <div className='labeled-input'>
                    <input name='new-password' className='form-input' ref={newPassword} required type="password" />
                    <label htmlFor='new-password'>Nové heslo</label>
                </div>
                <br/>
                <div className='labeled-input'>
                    <input name='new-password-confirm' className='form-input' ref={newPasswordConfirm} required type="password" />
                    <label htmlFor='new-password-confirm'>Potvrď nové heslo</label>
                </div>
                <br/>
                <div className='submit-button-container'>
                    <button className={`clickable-button ${isPending && 'button-disabled'}`} disabled={isPending} type="submit">Zmeniť heslo</button>
                </div>
            </form>
        </>
    )

}