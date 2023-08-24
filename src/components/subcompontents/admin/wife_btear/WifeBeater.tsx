import axios from "axios"
import { useRef, useState } from "react"
import { URI, insertTokenIntoHeader } from "../../../../App"
import useUserContext from "../../../../hooks/useUserContext"
import useConfirmation from "../../../../hooks/useConfirmation"
import useErrorMessage from "../../../../hooks/useErrorMessage"
import AddRole from "./AddRole"
import DeleteRole from "./DeleteRole"


export default function WifeBeater() {
    const [isPending, setIsPending] = useState(false)

    const name = useRef<HTMLInputElement>(null)

    const user = useUserContext()[0]

    const [confirmation, showConfirmation] = useConfirmation()
    const [message, showMessage] = useErrorMessage()

    function submit(e: React.FormEvent) {
        e.preventDefault()
        if ( !name.current ) return

        setIsPending(true)

        axios.post(`${URI}/wife-beater/drivers/`, {
            params: {
                name: name.current.value
            }
        }, {
            headers: {
                Authorization: `Bearer ${insertTokenIntoHeader(user?.token)}`
            }
        })
        .then(() => showConfirmation(() => name.current!.value = ''))
        .catch((e: unknown) => {
            console.log(e)
            showMessage(e)
        })
        .finally(() => setIsPending(false))
    }

    return(
        <div className="section">
            <h2 className="section-heading fade-in-out-border">Vytvoriť Drivera</h2>

            <form onSubmit={submit}>
                <div className="labeled-input">
                    <input name='driver-name' type="text" className="form-input" required ref={name} />
                    <label htmlFor="driver-name">Driver name</label>
                </div>

                <div className="submit-button-container">
                    <button type="submit" className={`clickable-button ${isPending && 'button-disabled'}`}>
                        Odoslať
                    </button>
                </div>
            </form>

            <AddRole />
            <DeleteRole />

            {
                confirmation
            }
            {
                message
            }
        </div>
    )
}