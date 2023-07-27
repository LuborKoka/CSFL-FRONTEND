import { faSquareCheck } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState } from 'react'


export default function useConfirmation(): [JSX.Element | null, (callback?: () => any) => Promise<void>] {
    const [isShown, setIsShown] = useState(false)
    const a = useState()


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