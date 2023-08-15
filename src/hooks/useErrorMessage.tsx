import { faXmarkSquare } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState } from "react";


/**
 * Displays an error message for the user.
 * 
 * @returns An array containing a JSX element representing the error message
 *          and a function to trigger the error message display. This function takes one parameter: the content of the message.
 */
export default function useErrorMessage(): [JSX.Element | null, (messageContent: string) => void] {
    const [isOpen, setIsOpen] = useState(false)
    const [text, setText] = useState('')

    function showMessage(messageContent: string) {
        setIsOpen(true)
        setText(messageContent)
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