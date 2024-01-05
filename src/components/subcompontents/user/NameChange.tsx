import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import axios, { AxiosResponse } from "axios"
import { useRef, useState } from "react"
import { URI, insertTokenIntoHeader } from "../../../App"
import useUserContext from "../../../hooks/useUserContext"
import useConfirmation from "../../../hooks/useConfirmation"
import useErrorMessage from "../../../hooks/useErrorMessage"
import SectionHeading from "../../reusableCompontents/SectionHeading"
import ClickableButton from "../../reusableCompontents/ClickableButton"



export default function NameChange() {
    const [isPending, setIsPending] = useState(false)
    const [isVisible, setIsVisible] = useState(false)

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
                <div className="labeled-input">
                    <input name='new-name' className="form-input" required minLength={5} ref={name} type="text" />
                    <label htmlFor="new-name">Nové meno</label>
                </div>
                <br/>
                <div className="labeled-input" style={{marginTop: '5px'}}>
                    <input name="password" className="form-input" type={isVisible ? 'text' : "password"} required minLength={8} ref={password} />
                    <label htmlFor="passwrd">Heslo</label>
                    <FontAwesomeIcon className='center-right' icon={isVisible ? faEye : faEyeSlash} onClick={() => setIsVisible(p => !p)} style={{position: 'absolute'}} />
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