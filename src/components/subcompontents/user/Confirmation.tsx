import { faSquareCheck } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";


export default function Confirmation() {


    return(
        <div className='confirmation'>
            <div className='animate-confirmation'>
                <FontAwesomeIcon icon={faSquareCheck} />
            </div>
        </div>
    )
}