import { faXmarkSquare } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { AxiosError } from "axios";
import { useState } from "react";


/**
 * Displays an error message for the user, when error is thrown by an http request.
 * 
 * @returns An array containing a JSX element representing the error message
 *          and a function to trigger the error message display. This function takes one parameter: the error (from try catch block) or a text message.
 */
export default function useErrorMessage(): [JSX.Element | null, (error: unknown) => void] {
    const [isOpen, setIsOpen] = useState(false)
    const [text, setText] = useState('')

    function showMessage(error: unknown) {
        setIsOpen(true)

        if ( typeof error === 'string' ) {
            setText(error)
            return
        }

        if ( error instanceof AxiosError && error.response?.data.error !== undefined ) {
            setText(error.response.data.error)
            return
        } 

        if ( error instanceof AxiosError && error.message.toLowerCase() === 'network error' ) {
            setText('Network Error')
            return
        } 

        setText('Niečo sa dokazilo, skús to znova.')
    }

    const element =
    <div className='message-container' onClick={() => setIsOpen(false)}>
        <div className='message-content' onClick={e => e.stopPropagation()}>
            <FontAwesomeIcon icon={faXmarkSquare} className='msg-icon close-icon' onClick={() => setIsOpen(false)} />
            <h3>Chyba!</h3>
            <p>{text}</p>
        </div>
    </div>

    const jsx = isOpen ? element : null

    return [jsx, showMessage]
}