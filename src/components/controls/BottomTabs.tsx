import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { NavLink, useParams } from "react-router-dom"
import { faAddressCard, faPlusCircle, faTable, faTableList } from "@fortawesome/free-solid-svg-icons"
import FiaLogo from '../../images/logo_Fia.svg'
import useUserContext from "../../hooks/useUserContext"
import useSeasonDataContext from "../../hooks/useSeasonDataContext"

type Props = {
    setOpen: React.Dispatch<React.SetStateAction<boolean>>
}


export default function BottomTabs({ setOpen}: Props) {
    const { raceID } = useParams()

    const user = useUserContext()[0]
    const season = useSeasonDataContext()[0]

    function openFiaForm() {
        setOpen(true)
    }

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
            {
                user?.roles.includes(`${season.seasonName}fia`) &&
                <button onClick={openFiaForm} className='bottom-tabs-link' style={{background: 'none', border: 'none'}}>
                    <img src={FiaLogo} height='15px' alt="fia" />
                    FIA
                </button>
            }

        </nav>
    )
}