import { faSquareCheck } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState } from 'react'


/**
 * A custom hook for displaying confirmation messages.
 * @returns An array containing a JSX element representing the confirmation message
 *          and a function to trigger the confirmation display. This function takes an optional parameter, 
 *          a function that you want to call after the confirmation sign disappears.
 */
export default function useConfirmation(): [JSX.Element | null, (callback?: () => any) => Promise<void>] {
    const [isShown, setIsShown] = useState(false)


    //takes an optional parameter, function what they want to do after the confirmation sign disappears
    async function showConfirmation(callback?: () => any ) {
        setIsShown(true)
        await new Promise(r => setTimeout(r, 1900))
        setIsShown(false)
        if ( callback !== undefined ) callback()
    }


    const jsx =
    <div className='confirmation'>
        <div className='animate-confirmation'>
            <FontAwesomeIcon icon={faSquareCheck} />
        </div>
    </div>

    const element = isShown ? jsx : null

    return [element, showConfirmation]
}