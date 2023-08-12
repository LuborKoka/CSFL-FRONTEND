import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { NavLink, useParams } from "react-router-dom"
import Icon from '../../images/poll.svg'
import { faAddressCard, faPlusCircle, faTable, faTableList } from "@fortawesome/free-solid-svg-icons"

export default function BottomTabs() {

    const { raceID } = useParams()

    return(
        <nav className='bottom-tabs'>
            <NavLink className='bottom-tabs-link' to={`${raceID}/results`}>
                <div>
                    <FontAwesomeIcon icon={faTable} />
                </div>
                Výsledky
            </NavLink>
            <NavLink className='bottom-tabs-link' to={`${raceID}/standings`}>
                <div>
                    <FontAwesomeIcon icon={faTableList} />
                </div>
                Tabuľka
            </NavLink>
            <NavLink className='bottom-tabs-link' to={`${raceID}/reports`}>
                <div>
                    <FontAwesomeIcon icon={faAddressCard} />
                </div>
                Reporty
            </NavLink>
            <NavLink className='bottom-tabs-link' to={`${raceID}/new-report`}>
                <div>
                    <FontAwesomeIcon icon={faPlusCircle} />
                </div>
                Nový report
            </NavLink>

        </nav>
    )
}