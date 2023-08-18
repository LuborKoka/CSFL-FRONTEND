import axios, { AxiosResponse } from "axios"
import { URI } from "../../../App"
import { useRef, useState } from "react"
import useUserContext from "../../../hooks/useUserContext"
import useConfirmation from "../../../hooks/useConfirmation"
import useErrorMessage from "../../../hooks/useErrorMessage"
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"


export default function PasswordChange() {
    const [isPending, setIsPending] = useState(false)
    const [isVisible, setIsVisible] = useState(false)
    const [isVisibleConfirm, setIsVisibleConfirm] = useState(false)

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
            <h2 className='section-heading fade-in-out-border'>Zmena Hesla</h2>
            <form name="Form Password-Change" onSubmit={handlePasswordChange}>
                <div className='labeled-input'>
                    <input name='old-password' className='form-input' ref={oldPassword} required type="password" />
                    <label htmlFor='old-password'>Staré heslo</label>
                </div>
                <br/>
                <div className='labeled-input' style={{marginTop: '5px'}}>
                    <input name='new-password' className='form-input' ref={newPassword} required type={isVisible ? 'text' : 'password'} />
                    <label htmlFor='new-password'>Nové heslo</label>
                    <FontAwesomeIcon className='center-right' icon={isVisible ? faEye : faEyeSlash} onClick={() => setIsVisible(p => !p)} style={{position: 'absolute'}} />
                </div>
                <br/>
                <div className='labeled-input' style={{marginTop: '5px'}}>
                    <input name='new-password-confirm' className='form-input' ref={newPasswordConfirm} required type={isVisibleConfirm ? 'text' : 'password'} />
                    <label htmlFor='new-password-confirm'>Potvrď nové heslo</label>
                    <FontAwesomeIcon className='center-right' icon={isVisibleConfirm ? faEye : faEyeSlash} onClick={() => setIsVisibleConfirm(p => !p)} style={{position: 'absolute'}} />
                </div>
                <br/>
                <div className='submit-button-container'>
                    <button className={`clickable-button ${isPending && 'button-disabled'}`} disabled={isPending} type="submit">Zmeniť heslo</button>
                </div>
            </form>

            { confirmation }
            { message }
        </>
    )

}